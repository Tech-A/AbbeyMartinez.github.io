# Abbey Portfolio

A mixed-media scrapbook portfolio on one long scrolling page.
React + TypeScript + Vite.

## Run it

```bash
npm install
npm run dev      # local dev server (hot reload)
npm run build    # production build into /dist
npm run preview  # preview the production build
```

## How the page works

2. **Hero + scrapbook starfield** (`Hero.tsx`, `Scrapbook.tsx`) — real photo
   cutouts scattered like stars around the title and on down the page. Each
   is nudged to the nearest free spot so it never covers text, windows or the
   contact note (anything marked `data-avoid`). Hover the name (tap on phones)
   and every piece swoops into a tilted planet ring orbiting it.
3. **Projects** (`ProjectsSection.tsx`) — shuttered windows; hover opens the
   shutters onto a mini browser tab, click opens a tabbed browser window with
   every project. Content comes from `projects` in `src/data/site.ts`.
4. **Experience** (`Experience.tsx`) — a simple timeline (earliest → latest)
   whose entries open on hover/tap, and the toolkit on paper scraps (film frame,
   torn strip, lined note) packed in a suitcase that unpacks on hover.
   Edit `timeline` and `stack` in `src/data/site.ts`; icons live in `public/stack/`.
5. **Contact** (`Contact.tsx`) — text set on the ruled lines of a real
   notepaper cutout. Edit `contact` in `src/data/site.ts`; the resume link
   points at `public/resume.pdf`.
6. **Nav** (`Nav.tsx`) — fixed pills that scroll to `#home`, `#projects`,
   `#experience`, `#contact`. The page background fades from paper into a lilac dusk as you
   scroll (`src/pages/home.css`); scrapbook pieces drift with a little parallax.

Performance: nothing animates at rest — the orbit loop only runs while the
name is hovered (and while pieces fly back), everything else is CSS hover.

Cutout images live in `public/scrapbook/` (see the README there).

## WHERE TO PUT YOUR ASSETS

### Fonts
Two options — pick one:
- **Easy (default):** Google Fonts is already linked in `index.html`
  (Archivo / Caveat / Fraunces). Just change the family names there + in
  `theme.css` (`--font-display / --font-script / --font-body`).
- **Self-hosted:** drop `.woff2` files in `public/fonts/`, uncomment the
  `@font-face` blocks in `src/styles/fonts.css`, and delete the Google
  `<link>` from `index.html`.

### Drawings / illustrations  →  `src/assets/`
- **SVG** (best for line art like your stick figure and mountains):
  `import { ReactComponent as Walker } from "../assets/walker.svg";`
  then render `<Walker className="walker" />`. The SVG-as-component typing is
  already set up in `vite-env.d.ts`.
- **PNG / JPEG** (textures, painterly art like your mushroom scene):
  `import bg from "../assets/mountains.png";` then use as `src` or
  `background-image`.

### Colors
All in `src/styles/theme.css`. Your locked palette (Lilac Ash, Dim Grey,
Onyx, Ivory, Soft Linen) is there as CSS variables.

## Folder map

```
public/fonts/        self-hosted font files (optional)
public/scrapbook/    real photos + transparent PNG cutouts for the pile
src/assets/          your drawings, SVGs, textures
src/components/      Hero, Scrapbook, ConnectDots + their css
src/data/site.ts     all copy/text in one place
src/styles/          theme tokens, fonts, global reset
```
