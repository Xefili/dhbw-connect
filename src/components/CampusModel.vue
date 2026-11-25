<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import StatusMessage from './StatusMessage.vue'

const MODEL_URL = `${import.meta.env.BASE_URL}dhbw.glb`

const stage = ref(null)
const status = ref('idle') // idle | loading | ready | error
const progress = ref(0)

let observer = null
let cleanup = null

// Frees GPU resources of a loaded object tree (geometries, materials, textures).
function disposeTree(root) {
  root.traverse((obj) => {
    obj.geometry?.dispose()
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (const material of materials) {
      if (!material) continue
      for (const value of Object.values(material)) {
        if (value?.isTexture) value.dispose()
      }
      material.dispose()
    }
  })
}

// Loads three.js and the model, then renders it into `el`.
// Returns a cleanup function. Everything here is async, so the page keeps rendering meanwhile.
function startViewer(el) {
  let disposed = false
  let frameId = 0
  let renderer = null
  let controls = null
  let model = null
  let resizeObserver = null
  let visibilityObserver = null

  status.value = 'loading'

  async function init() {
    const [THREE, { GLTFLoader }, { OrbitControls }] = await Promise.all([
      import('three'),
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/controls/OrbitControls.js'),
    ])
    if (disposed) return

    const width = el.clientWidth || 1
    const height = el.clientHeight || 1

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444466, 1.2))
    const sun = new THREE.DirectionalLight(0xffffff, 2)
    sun.position.set(5, 10, 7)
    scene.add(sun)

    const gltf = await new GLTFLoader().loadAsync(MODEL_URL, (event) => {
      if (event.total) progress.value = Math.round((event.loaded / event.total) * 100)
    })
    if (disposed) return

    model = gltf.scene

    // Textures from the GLB are already tagged as sRGB by the loader; only add sharpness at angles.
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
    model.traverse((obj) => {
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
      for (const material of materials) {
        if (material?.map) material.map.anisotropy = maxAnisotropy
      }
    })

    // Center the model on the origin and frame it in the camera.
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    model.position.sub(center)
    scene.add(model)

    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const fov = THREE.MathUtils.degToRad(camera.fov)
    const distance = (maxDim / 2 / Math.tan(fov / 2)) * 1.4
    camera.position.set(distance * 0.6, distance * 0.5, distance)
    camera.lookAt(0, 0, 0)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = distance * 0.4
    controls.maxDistance = distance * 2
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
    // Stop the slow spin once the visitor takes over.
    controls.addEventListener('start', () => {
      controls.autoRotate = false
    })

    resizeObserver = new ResizeObserver(() => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    })
    resizeObserver.observe(el)

    // Only render while the viewer is on screen.
    let visible = true
    visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    visibilityObserver.observe(el)

    function tick() {
      frameId = requestAnimationFrame(tick)
      if (!visible) return
      controls.update()
      renderer.render(scene, camera)
    }
    tick()

    status.value = 'ready'
  }

  init().catch((err) => {
    if (disposed) return
    console.error('Could not load the 3D model:', err)
    status.value = 'error'
  })

  return function stop() {
    disposed = true
    cancelAnimationFrame(frameId)
    resizeObserver?.disconnect()
    visibilityObserver?.disconnect()
    controls?.dispose()
    if (model) disposeTree(model)
    if (renderer) {
      renderer.dispose()
      renderer.domElement.remove()
    }
  }
}

onMounted(() => {
  // Start loading only once the card is near the viewport, so it never competes with the initial page load.
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      cleanup = startViewer(stage.value)
    },
    { rootMargin: '200px' },
  )
  observer.observe(stage.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cleanup?.()
})
</script>

<template>
  <section>
    <h2>Campus-Modell</h2>
    <div class="relative mt-4 h-72 w-full overflow-hidden rounded-md lg:h-96">
      <div ref="stage" class="absolute inset-0"></div>

      <div
        v-if="status === 'idle' || status === 'loading'"
        class="absolute inset-0 flex items-center justify-center text-sm"
        role="status"
        aria-live="polite"
      >
        3D-Modell wird geladen… {{ progress > 0 ? `${progress} %` : '' }}
      </div>
    </div>

    <StatusMessage v-if="status === 'error'"
      >Das 3D-Modell konnte nicht geladen werden.</StatusMessage
    >
  </section>
</template>
