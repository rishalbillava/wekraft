# Wekraft Solar website

Responsive five-page website with Wekraft, Adani Solar and Deye branding, 3D card effects, searchable product catalogue and six warehouse locations.

## Pages

- `index.html` — Home
- `about.html` — About Wekraft
- `catalogue.html` — Product catalogue
- `warehouses.html` — Warehouse network
- `contact.html` — Contact details

## Catalogue

Deye inverter and storage entries, global Deye inverter series, and Adani TOPCon modules. The Adani range contains 15 DCR models from the supplied datasheets and only 625, 630 and 635 Wp for non-DCR. No prices are displayed. Model details include source datasheet links where available.

## Deploy to Vercel

Import this GitHub repository into Vercel and select the `wekraft-3d-vercel` branch. Framework preset: Other. No build command is needed. The included `vercel.json` serves the static files from the repository root.

This branch includes the complete ready-to-host static website. The earlier React/Vite source remains in repository history.

## Local preview

Run `python -m http.server 8080` in the project folder, then open `http://localhost:8080`.

## Update content

Edit the HTML files for page text, `catalog-data.js` for product entries, and the CSS files for styling. Logos and images are in `assets/`; manufacturer datasheets are in `datasheets/`.
