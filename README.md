# SSV Print Pack — website

Marketing site for **SSV Print Pack** (B32, MIDC Wai, Satara): pouches, carry bags, foiled labels, mono cartons and rigid boxes.

Design direction **"Kraft & Dieline"**: warm paper and kraft, red cut lines and dashed creases, set in **Archivo** (display and text) and **Martian Mono** (spec labels).

## Run it locally

No build step. Serve the folder with any static server:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` straight from disk also works, but a server is closer to production.

## Deploy

Any static host works (GitHub Pages, Netlify, Cloudflare Pages, Vercel).

**Live at:** https://ssvprintpack.com (GitHub Pages, served from the `gh-pages` branch; the `CNAME` file sets the custom domain).

DNS at Hostinger: four `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `www` follows the main domain.

To publish changes, push `main` to that branch with `git push origin main:gh-pages`. Or, simpler: in Settings → Pages, switch the source to `main` / root, after which every push to `main` deploys and `gh-pages` can be deleted. The `.nojekyll` file is already in place.

## What's where

```
index.html              page content and structure
404.html                not-found page
assets/css/site.css     all styles (tokens at the top)
assets/js/site.js       motion, filters, menu, quote form
assets/vendor/lenis.min.js   smooth scrolling (Lenis 1.3.26, MIT)
assets/fonts/           self-hosted Archivo + Martian Mono (variable, woff2)
assets/img/             logo (SVG + PNG), photos in AVIF / WebP / JPEG at two widths, paper textures
og-image.jpg            social preview image (1200×630)
favicon.svg, favicon-48.png, apple-touch-icon.png
```

## Editing

- **Copy and products:** edit `index.html` directly. The spec sheet is a plain `<table>`; each row's `data-fam` (`pouches`, `bags`, `labels`, `boxes`) drives the filter buttons.
- **Colours and fonts:** the `:root` tokens at the top of `assets/css/site.css`.
- **Quote form destination:** `WHATSAPP_NUMBER` at the top of `assets/js/site.js`. The form opens WhatsApp with the visitor's details prefilled; it has no server.

## Motion and accessibility

Motion is progressive enhancement, layered by classes on `<html>`:

| Class | Meaning |
|---|---|
| `js` | JavaScript is running |
| `motion` | …and the visitor has not asked for reduced motion |
| `is-ready` | fonts have loaded, so the hero intro plays |
| `io` | scroll reveals are armed |
| `pin` | the pinned "scroll-to-fold" carton scene is armed |

Without JavaScript, or with *reduce motion* switched on, every section renders in its finished state, with no hidden content and no pinning or smooth scrolling. The page has a skip link, labelled form fields, a real data table and visible focus states.

## Before launch

- [ ] Confirm **+91 70303 63555** is on WhatsApp (the quote form sends there). Otherwise change `WHATSAPP_NUMBER` or swap the form for an email or form service.
- [ ] Add a business **email address** if there is one (none was in the brochure).
- [ ] In GitHub → Settings → Pages, tick **Enforce HTTPS** once the certificate for ssvprintpack.com is issued.
- [ ] Replace the brochure renders with **real product photography**. Current images top out at 1376 px wide and look soft on large retina screens.
- [ ] The logo (`assets/img/logo.svg`) was traced to vector from the supplied 2000 px image. If the original artwork file (AI / EPS / PDF / SVG) exists, swap it in for perfect fidelity.
