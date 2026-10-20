# Fragen Blätter

## Blatt 3

1. Die Spezifikation des Selectors `element element` besitzt die Spezifikation `(0, 0, 2)`, der Selector `.klasse` besitzt `(0, 1, 0)` und ist daher höher gewichtet.
2. `rem` nutzt root-em Größen, also Schriftgröße nach Browserzoom. `px` ist eine statische Größe, welche immer gleich bleibt. Für Layouts, welche sich an verschiedene Browser anpassen müssen, sind relative Größen wie `rem` besser.
3. Das Element ist entweder nicht `position: absolute|fixed|static|sticky` oder das Elternelement ist nicht `position: relative`.


## Blatt 4
Der Header (Navbar), der Footer und Kärtchen sind Komponenten und nutzen daher auf allen Seiten das gleiche Design.

`dist/assets/index-CJ-aHc-V.css    7.55 kB │ gzip:  2.23 kB`
Tailwind compiliert nur benötigte Klassen und lässt nicht genutzten Whitespace aus, das geht manuell auch mit `--minify`. Vite komprimiert die Datei zusätzlich mit gzip.

1. `fr` steht für Fraction; `grid-template-columns: 1fr 3fr` erstellt ein Grid mit zwei Spalten, Spalte 2 ist 3x so groß wie Spalte 1.
2. Der Ordner enthält statische Dateien (Vue SPA). Der Ordner wird durch `.gitignore` nicht markiert. Das Repo enthält die Rohdateien, der `dist/` Ordner wird durch das Build-System von Github immer neu generiert. Dadurch spart man Platz und Teilnehmer müssen nicht immer neue Build Dateien hochladen oder erstellen.
3. Weil der Ordner zu groß ist und oft platformspezifische Dateien beinhaltet. `package-lock.json` definiert die benötigten Packages und die Versionen der Pakete.
