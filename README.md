# Wekraft Solar — Next.js

Responsive website built with Next.js App Router and React. Separate Home, About, Warehouses, Catalogue and Contact pages, logo-matched theme, 3D effects with reduced-motion support, searchable product catalogue and Adani PDF downloads. No prices displayed.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production:

```sh
npm run build
npm start
```

## Vercel

Import `rishalbillava/wekraft`, select `wekraft-3d-vercel` as the production branch and select the **Next.js** framework preset. Root directory: repository root. Use default build and output settings. The existing ERP on `main` is preserved.

Legacy `.html` URLs redirect to the new routes.

## Editing

- `app/`: pages, metadata and styles.
- `components/`: navigation, footer, 3D effects and catalogue.
- `lib/products.js`: product data.
- `public/assets/`: logos and images.
- `public/datasheets/`: Adani PDFs.

Contact links open phone/email apps. No customer data is stored.
