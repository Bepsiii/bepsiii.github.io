# Bepsi — Tech & Design

A static personal site for GitHub Pages at https://bepsi.dev/.

The committed HTML, CSS, JavaScript, and images are ready to serve directly. No server application, dependency installation, or GitHub Actions build is required.

## Editing the site

- `index.html` contains the homepage.
- `header.html` and `footer.html` contain shared navigation and contact details.
- `style.css` and `refresh.css` define the visual design and responsive layouts. `site-refinement.css` styles shared navigation, the footer, and notices; `polish.css` refines the homepage and desk explorer.
- `pages.css` and `pages.js` provide the resource library, review directory, articles, About, Contact, and archive layouts.
- `reading.css` and `reading-experience.js` provide review typography, sticky contents, text-size controls, reading progress, and photo enlargement. The original review text and benchmark data remain in the HTML.
- `main.js` handles navigation, resource search, clipboard feedback, and the contact form.
- `enhancements.js` adds site search, review filters, saved resources, and reading tools.
- `home-scene.js` renders the homepage's animated 3D ribbon. `visual-polish.js` adds pointer highlights and scroll reveals.
- `setup-explorer.js` adds the desk photo explorer, inventory filters, and audio category overview. It reads the existing gear lists rather than maintaining separate specifications.
- `setup-refinement.css` styles the readable inventory rows, keyboard builds, and audio groups. All specifications are static HTML and remain visible without JavaScript.
- `page-scenes.js` and `scenes.css` add the library lattice, orbital forms, audio waveform, and abstract workstation schematic.
- `images/optimized/` contains responsive WebP images; original photos remain in `images/`.

The pages and hardware information are based on the supplied local copy (`d4f1ffb`). The homepage focuses on resources and gear. The earlier AscentCustoms project remains for reference; the bottleneck page and remote-only archives have been removed.

The decorative scenes use a locally hosted, pinned Three.js 0.169.0 module in `assets/vendor/`. Its MIT license is included as `THREE-LICENSE.txt`. Scenes respect reduced motion, include pause controls, stop rendering when off screen, and leave the content usable if WebGL is unavailable. The page sculptures initialize when visible and share a frame scheduler. Long reviews prioritize reading and do not load Three.js.

Utility styles are generated with Tailwind 3.4.17. To rebuild after editing utility classes:

```sh
npm install
npm run build
```

Commit `assets/utilities.css` whenever utility classes change. GitHub Pages serves the committed CSS directly; there is no browser-side Tailwind runtime.

Run `python scripts/audit-links.py` to check local page and asset links. Run `npx playwright install chromium`, then `npm run check` for desktop and mobile browser checks. On a Windows machine with Edge installed, set `PLAYWRIGHT_BROWSER=msedge` to use Edge instead. The browser checks cover search, review filters, resource counts/saving, reading/photo tools, themes, blocked storage, contact success/failure, mobile layouts, the desk explorer, the four new scene compositions, reduced motion, WebGL fallback, and static content without JavaScript. Test form requests are intercepted locally.

The contact form uses the existing Formspree endpoint. Browser verification should intercept form requests so test messages are not sent.

Serve this directory with a local HTTP server to preview it. Shared navigation loads from `header.html` and `footer.html`. Keep `sitemap.xml`, `robots.txt`, and page canonical URLs consistent with the published domain.
