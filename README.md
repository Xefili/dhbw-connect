# dhbw-connect-vite

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Raspberry Pi menu API

The frontend loads today's Mensa Erzbergerstraße plan from
`https://foodapi.xefili.app/`. The included [`main.js`](./main.js) runs a small
Node.js API using `ka-mensa-fetch`; it refreshes the menu every 30 minutes and
serves the last fetched plan at `/`.

On the Raspberry Pi, install Node.js 22.18 or newer, clone this repository, and
run:

```sh
npm ci
npm run api:start
```

The API listens on port `3000` by default. Set `PORT` to change it. Configure
your DNS and HTTPS reverse proxy for `foodapi.xefili.app` to forward requests to
the Pi on that port. The `/health` endpoint reports whether a menu has loaded.

### Compile and Minify for Production

```sh
npm run build
```
