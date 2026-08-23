# Compass Portfolio (base)

A Skyrim-favorites-menu-styled portfolio: a four-point compass (Skills /
Items / Magic / Map) over a static blurred background, built with Vite +
Three.js.

## Running it locally

```
npm install
npm run dev
```

That opens `http://localhost:5173` automatically and hot-reloads as you edit.

`npm run build` produces a production build in `dist/` (deploy that folder
anywhere — Netlify, Vercel, GitHub Pages, etc). `npm run preview` serves
that build locally so you can sanity-check it before deploying.

## Where things live

- `src/config.js` — site name, background image path, and the four
  compass labels/positions. Start here.
- `src/data/items.js` — one object per physical piece (apparel, figures,
  shoes, packaging...). Add entries here; the grid + detail view update
  automatically.
- `src/data/skills.js` — one object per skill/capability.
- `src/views/` — the compass home screen and the four section screens.
  `magicView.js` and `mapView.js` are placeholders — content for those two
  directions isn't decided yet.
- `src/three/modelViewer.js` — the reusable 3D viewer used in the Items
  detail panel (drag to orbit). Falls back to a placeholder shape if a
  model path is empty or fails to load, so nothing looks broken while
  you're still producing models.
- `public/` — static files served as-is: background image, `models/*.glb`,
  `items/*` thumbnails.

## Assets to drop in when ready

- **Background image** → `public/background.jpg` (update the path in
  `config.js` if you name it differently). It's blurred + darkened via
  CSS, so a fairly high-res source (1920px+ wide) will look smoother than
  a small one. This stays fixed behind every screen, exactly as-is.
- **Item models** → `public/models/your-item.glb`, referenced from
  `src/data/items.js`. Keep an eye on file size for web (a few MB per
  model is comfortable; if your Nomad/Stager exports run large, the same
  texture-downscaling approach from your bedroom-portfolio pipeline
  applies here too).
- **Item thumbnails** → `public/items/your-item.jpg` (square works best
  for the grid).
- **Skill icons**, if you want them — `skills.js` doesn't have an icon
  field yet; easy to add once you know what style you want (line icons?
  your own illustrations?).
- **A custom display font**, optional — currently using Google Fonts
  "Cinzel" (headers/labels) + "Spectral" (body) as stand-ins for the
  actual Skyrim UI typeface, which is proprietary. If you find/own a
  closer fan font, drop the file in and swap the `@font-face` /
  Google Fonts link in `index.html`.
- **A compass-rose graphic**, optional — `compassHome.js` currently draws
  a simple inline SVG placeholder for the center ornament. Swap in your
  own icon/knotwork whenever you have one.
- **Content for Magic and Map** — whatever you decide these become
  (About Me? a literal map? something else) — the screens, nav, and
  routing are already built and just need the content dropped in.
