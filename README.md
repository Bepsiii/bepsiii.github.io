# Bepsi — Tech & Design

A static personal site for GitHub Pages at https://bepsi.dev/.

The committed HTML, CSS, JavaScript, and images are ready to serve directly. No server application, dependency installation, or GitHub Actions build is required.

## Editing the site

- `index.html` contains the homepage.
- `header.html` and `footer.html` contain shared navigation and contact details.
- `style.css` defines the visual design and responsive layouts.
- `main.js` handles navigation, resource search, clipboard feedback, and the contact form.
- `images/optimized/` contains responsive WebP images; original photos remain in `images/`.

Utility styles are generated locally from the classes used by the site:

```sh
npm run build
```

This command requires Node.js and has no external dependencies. Commit `assets/utilities.css` whenever utility classes change. The generator covers the site's existing utility vocabulary; unsupported utility classes cause a build error. Extend `scripts/build-css.cjs` or use a named class in `style.css` when adding new styles.

The contact form uses the existing Formspree endpoint. Browser verification should intercept form requests so test messages are not sent. Performance checklist inputs stay in the browser.

Local asset paths begin with `/` because this is a GitHub Pages user site. If moving it to a project site under a subdirectory, update those paths. Keep `sitemap.xml`, `robots.txt`, and page canonical URLs consistent with the published domain.
