# Customer Journey Mapping Tool

Ein webbasiertes Tool zum Erstellen visueller Customer Journey Maps im Stil eines
16:9 Executive-Reports – inklusive Phasen-Editor, globalen CI-Einstellungen,
Drag & Drop und hochauflösendem Export (PNG, JPG, PDF).

## Stack

- React + TypeScript, Vite
- Tailwind CSS
- dnd-kit (Drag & Drop der Phasen)
- zustand (State + localStorage-Persistenz)
- html-to-image + jsPDF (Export)

## Entwicklung

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Single-file build (für Hosting ohne Server / z. B. als Artifact)

Erzeugt eine einzige `dist-artifact/index.html` mit allen Assets (JS/CSS)
inline – lässt sich direkt öffnen oder an einer beliebigen URL hosten, ohne
weitere Dateien:

```bash
npm run build:single-file
```

## Funktionen

- Journey-Phasen hinzufügen, umbenennen, löschen, per Drag & Drop verschieben
- Jede Phase individuell bearbeitbar (Ziele, Touchpoints, Emotion, Score, Pain
  Points, Opportunities, Handlungsempfehlungen, Bild, Farben)
- Globale Einstellungen: Titel, Logo, CI-Farben, Schriftgröße, Kartenrundung,
  Spaltenabstand, Zeilenhöhe, Ein-/Ausblenden von Legende, KPI-Bereich und
  Bottom Summary
- Export als PNG/JPG/PDF im festen 16:9-Format, optional in 3840×2160
- JSON-Import/-Export zum Speichern und Wiederladen einer Journey Map
- Demo-Datensatz „Schloss Dankern" als Ausgangspunkt
