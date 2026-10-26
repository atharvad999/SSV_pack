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

DNS at Hostinger: `A` records for `@` → GitHub Pages (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a `CNAME` for `www` → `atharvad999.github.io`. HTTPS is enforced in Settings → Pages.

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
- **Factory location:** the map at the bottom of the contact section is a Google Maps embed centred on 17.979812, 73.894937 (Plus code 7J9MXVHV+WX). It links to the business listing https://maps.app.goo.gl/EcNxVTeJdNXpfmDH7. Coordinates also appear in the structured data in `<head>`.
- **Quote form:** settings at the top of `assets/js/site.js`. Visitors choose **Email the docket**, which posts in the background through [FormSubmit](https://formsubmit.co) to `QUOTE_EMAIL` (the visitor's email, if given, becomes the Reply-To), or **WhatsApp instead**, which opens a prefilled chat to `WHATSAPP_NUMBER`. A hidden honeypot field filters out bots. If email delivery fails, the form offers WhatsApp or a phone call.

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
- [ ] **Activate email delivery (one time):** submit the live form once. FormSubmit emails an *Activate Form* link to shetekunal22@gmail.com (check Spam). Click it. Until then, email submissions are not delivered, though WhatsApp still works.
- [ ] After activating, FormSubmit sends a random-string alias for the address. Replace the address in `QUOTE_EMAIL` with it so the Gmail address isn't visible in the page source.
- [ ] Replace the brochure renders with **real product photography**. Current images top out at 1376 px wide and look soft on large retina screens.
- [ ] The logo (`assets/img/logo.svg`) was traced to vector from the supplied 2000 px image. If the original artwork file (AI / EPS / PDF / SVG) exists, swap it in for perfect fidelity.
