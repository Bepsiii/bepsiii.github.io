# Bepsi — Tech & Design

A static personal site for GitHub Pages at https://bepsi.dev/.

The committed HTML, CSS, JavaScript, and images are ready to serve directly. No server application, dependency installation, or GitHub Actions build is required.

## Editing the site

- `index.html` contains the homepage.
- `header.html` and `footer.html` contain shared navigation and contact details.
- `style.css` and `refresh.css` define the visual design and responsive layouts. `polish.css` refines the homepage and setup page.
- `main.js` handles navigation, resource search, clipboard feedback, and the contact form.
- `enhancements.js` adds site search, review filters, saved resources, and reading tools.
- `home-scene.js` renders the homepage's animated 3D ribbon. `visual-polish.js` adds pointer highlights and scroll reveals.
- `setup-explorer.js` adds the desk photo explorer, inventory filters, and audio category overview. It reads the existing gear lists rather than maintaining separate specifications.
- `images/optimized/` contains responsive WebP images; original photos remain in `images/`.

The pages and hardware information are based on the supplied local copy (`d4f1ffb`). The homepage focuses on resources and gear. The earlier AscentCustoms project remains for reference; the bottleneck page and remote-only archives have been removed.

The homepage uses a locally hosted, pinned Three.js 0.169.0 module in `assets/vendor/`. Its MIT license is included as `THREE-LICENSE.txt`. The scene respects reduced motion, includes a pause control, stops rendering when off screen, and leaves the content usable if WebGL is unavailable. The rest of the site does not load Three.js.

Utility styles are generated with Tailwind 3.4.17. To rebuild after editing utility classes:

```sh
npm install
npm run build
```

Commit `assets/utilities.css` whenever utility classes change. GitHub Pages serves the committed CSS directly; there is no browser-side Tailwind runtime.

Run `python scripts/audit-links.py` to check local page and asset links. Run `npx playwright install chromium`, then `npm run check` for desktop and mobile browser checks. On a Windows machine with Edge installed, set `PLAYWRIGHT_BROWSER=msedge` to use Edge instead. The browser checks cover search, review filters, saved resources, reading tools, light mode, blocked browser storage, contact success/failure, mobile layouts, the desk explorer, and the 3D animation's pause and visibility controls. Test form requests are intercepted locally.

The contact form uses the existing Formspree endpoint. Browser verification should intercept form requests so test messages are not sent.

Serve this directory with a local HTTP server to preview it. Shared navigation loads from `header.html` and `footer.html`. Keep `sitemap.xml`, `robots.txt`, and page canonical URLs consistent with the published domain.
