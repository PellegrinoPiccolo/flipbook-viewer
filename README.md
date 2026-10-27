# Flipbook Viewer

Componente React che mostra un PDF come un libro sfogliabile. Funzioni:

- sfoglio pagina per pagina con animazione
- zoom, con pinch su mobile
- barra di navigazione con anteprima delle pagine
- frecce da tastiera
- schermo intero, con fallback per iPhone Safari

La cartella è autonoma: non importa nulla dal progetto che la ospita.

## Requisiti

- **React 19** (`PdfPage` riceve `ref` come prop normale)
- **Tailwind CSS v4**: lo stile è scritto quasi tutto in classi Tailwind
- un bundler che supporti `new URL("…", import.meta.url)` per caricare il worker di pdf.js (Next.js, Vite, webpack 5)

## Installazione

1. Clona la repo nella cartella dei componenti del progetto:

   ```bash
   cd src/components
   git clone <url-della-repo> flipbook-viewer
   ```

   Non c'è un `index.ts`: il componente si importa direttamente da `flipbook-viewer/FlipbookViewer`.

2. Installa le dipendenze:

   ```bash
   npm install react-pdf react-pageflip react-zoom-pan-pinch react-draggable keyboardjs screenfull lucide-react cn
   ```

   `pdfjs-dist` arriva insieme a `react-pdf`, quindi non va installato a parte.

3. Fai in modo che Tailwind veda le classi del componente. Se la cartella sta dentro `src/` di solito succede già. Se sta fuori dalle cartelle che Tailwind scansiona, aggiungi una riga nel CSS principale:

   ```css
   @import "tailwindcss";
   @source "../percorso/della/cartella/flipbook-viewer";
   ```

## Uso

pdf.js usa API che esistono solo nel browser (`DOMMatrix`, `canvas`), quindi il componente non va mai renderizzato lato server.

### Next.js (App Router)

```tsx
"use client";

import dynamic from "next/dynamic";

const FlipbookViewer = dynamic(() => import("@/components/flipbook-viewer/FlipbookViewer"), {
  ssr: false,
});

export default function Volantino() {
  return <FlipbookViewer pdfUrl="/volantino.pdf" />;
}
```

### Vite / React

```tsx
import { lazy, Suspense } from "react";

const FlipbookViewer = lazy(() => import("./components/flipbook-viewer/FlipbookViewer"));

export default function App() {
  return (
    <Suspense>
      <FlipbookViewer pdfUrl="/volantino.pdf" />
    </Suspense>
  );
}
```

## Props

| Prop          | Tipo     | Predefinito          | Descrizione                                                                 |
| ------------- | -------- | -------------------- | --------------------------------------------------------------------------- |
| `pdfUrl`      | `string` | —                    | URL del PDF. Se è su un altro dominio, il server deve consentire il CORS.    |
| `className`   | `string` | —                    | Classi aggiuntive sul contenitore, unite con `cn` (vincono su quelle base). |
| `loadingText` | `string` | `"Caricamento PDF…"` | Testo mostrato mentre il PDF si carica.                                     |
| `workerSrc`   | `string` | worker incluso       | URL alternativo del worker di pdf.js (vedi sotto).                          |

## Personalizzare colori e font

I colori e il font si cambiano con tre variabili CSS:

| Variabile          | Predefinito | Dove si usa                                         |
| ------------------ | ----------- | --------------------------------------------------- |
| `--flipbook-ink`   | `#272723`   | sfondo del libro, testi, tooltip delle anteprime    |
| `--flipbook-accent`| `#ee7e0e`   | cursore della barra, hover dei pulsanti, loader     |
| `--flipbook-font`  | `inherit`   | testo di caricamento                                |

I valori predefiniti hanno specificità zero, quindi qualsiasi regola li sovrascrive.

**Con le classi Tailwind:**

```tsx
<FlipbookViewer
  pdfUrl="/volantino.pdf"
  className="[--flipbook-ink:#0f172a] [--flipbook-accent:#22c55e]"
/>
```

**Riusando i colori del tema:**

```tsx
className="[--flipbook-ink:var(--color-inchiostro)] [--flipbook-accent:var(--color-arancio)] [--flipbook-font:var(--font-display)]"
```

**Oppure in CSS, per tutti i viewer del sito:**

```css
.flipbook-viewer {
  --flipbook-ink: #0f172a;
  --flipbook-accent: #22c55e;
}
```

## Altezza

L'altezza è responsive e predefinita (da circa 20rem su mobile a circa 35rem su desktop). Si può cambiare con `className`, per esempio `className="h-[40rem]"`. L'area del libro occupa l'altezza disponibile meno la toolbar.

## Worker di pdf.js

Il worker viene incluso nel bundle con:

```ts
new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url);
```

Se il bundler non lo supporta, o se vuoi caricarlo da una CDN, passa `workerSrc`. La versione deve essere la stessa di `pdfjs-dist` installata:

```tsx
<FlipbookViewer
  pdfUrl="/volantino.pdf"
  workerSrc="https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs"
/>
```

## Schermo intero

- Dove esiste la Fullscreen API, il viewer va a schermo intero davvero.
- Su iPhone Safari, dove la Fullscreen API non c'è, il viewer copre la pagina con `position: fixed` e si chiude con il pulsante o con `Esc`.

In questa modalità `style.css` blocca lo scroll di `<html>` e alza lo `z-index` di `<main>`, così il viewer resta sopra un eventuale header sticky. Se il layout non usa `<main>`, oppure l'header ha uno `z-index` maggiore di 100, adatta quella regola.

## Testi

I testi dell'interfaccia (etichette dei pulsanti, "Pagina 3", "4 di 12") sono in italiano. Si trovano in `toolbar/Toolbar.tsx`, `toolbar/Zoom.tsx` e `toolbar/slider-nav/HoverItem.tsx`.

## Struttura

```
flipbook-viewer/
├── FlipbookViewer.tsx       componente da importare: caricamento PDF, zoom, schermo intero
├── types.ts
├── style.css                variabili del tema e fallback schermo intero
├── hooks/                   useDebounce, useRefSize, useScreenSize
├── flipbook/                libro sfogliabile e rendering delle pagine
├── toolbar/                 frecce, zoom, schermo intero, barra di navigazione
└── pdf-loading/             animazione di caricamento
```
