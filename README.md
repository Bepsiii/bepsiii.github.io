# Bepsi — Tech & Design

A static personal site for GitHub Pages at https://bepsi.dev/.

The committed HTML, CSS, JavaScript, and images are ready to serve directly. No server application, dependency installation, or GitHub Actions build is required.

## Editing the site

- `index.html` contains the homepage.
- `header.html` and `footer.html` contain shared navigation and contact details.
- `style.css` and `refresh.css` define the visual design and responsive layouts.
- `main.js` handles navigation, resource search, clipboard feedback, and the contact form.
- `enhancements.js` adds site search, review filters, saved resources, and reading tools.
- `images/optimized/` contains responsive WebP images; original photos remain in `images/`.

The pages and hardware information are based on the supplied local copy (`d4f1ffb`). The homepage reorganizes that content; the remote-only archive pages are removed.

Utility styles are generated with Tailwind 3.4.17. To rebuild after editing utility classes:

```sh
npm install
npm run build
```

Commit `assets/utilities.css` whenever utility classes change. GitHub Pages serves the committed CSS directly; there is no browser-side Tailwind runtime.

Run `python scripts/audit-links.py` to check local page and asset links. Run `npx playwright install chromium`, then `npm run check` for desktop and mobile browser checks. On a Windows machine with Edge installed, set `PLAYWRIGHT_BROWSER=msedge` to use Edge instead. The browser checks cover search, review filters, saved resources, reading tools, light mode, blocked browser storage, contact success/failure, and mobile layouts. Test form requests are intercepted locally.

The contact form uses the existing Formspree endpoint. Browser verification should intercept form requests so test messages are not sent. Performance checklist inputs stay in the browser.

Serve this directory with a local HTTP server to preview it. Shared navigation loads from `header.html` and `footer.html`. Keep `sitemap.xml`, `robots.txt`, and page canonical URLs consistent with the published domain.
