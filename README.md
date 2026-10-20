# HZTL Storefront (Hydrogen)

Hydrogen rebuild of the **Horizon 4.3.0** theme with the Horizontal Digital brand layer
(`Shopify_Custom_Theme`), for hosting on **Shopify Oxygen**.

## Run locally

Requires Node 22 or 24.

```bash
npm install
npm run dev        # http://localhost:3000
```

`.env` already points at `vt-test-store-j7obtjaj.myshopify.com` with the public Storefront token.
It is git-ignored. Private values (`PRIVATE_STOREFRONT_API_TOKEN`, `SESSION_SECRET`) never go in git;
Oxygen injects them at deploy time.

Optional: `npx shopify hydrogen link` connects the folder to the Hydrogen storefront in admin,
so `npm run dev` pulls the real environment variables.

## Deploy to Oxygen

1. Push this folder to a GitHub repo.
2. Shopify admin > Sales channels > Hydrogen > your storefront > Storefront settings > connect the repo.
3. Each push to `main` deploys to Production; other branches create preview deployments.

Or deploy from any CI: `npx shopify hydrogen deploy --token $SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN`.

## What maps to what

| Horizon theme | Hydrogen |
|---|---|
| `settings_data.json` + `assets/horizontal-brand.css` | `app/styles/app.css` (fonts via `@fontsource/work-sans`) |
| `header-group.json` (announcement + header) | `app/components/Header.tsx` |
| `footer-group.json` (newsletter, menu, policies) | `app/components/Footer.tsx`, `NewsletterForm.tsx` |
| `templates/index.json` (hero + product list) | `app/routes/_index.tsx` |
| `templates/product.json` | `app/routes/products.$handle.tsx`, `ProductImage.tsx`, `ProductForm.tsx` |
| `templates/collection.json`, `list-collections.json` | `app/routes/collections.*.tsx` |
| `templates/page.contact.json` | `app/routes/pages.contact.tsx`, `ContactForm.tsx` |
| `templates/page.json`, `blog.json`, `article.json`, `search.json`, `cart.json`, `404.json` | matching routes in `app/routes/` |
| Theme-editor text (announcement, hero, footer heading) | `app/lib/site-content.ts` |

## Placeholders

- **Contact form** (`ContactForm.tsx`) and **newsletter** (`NewsletterForm.tsx`): fields render, submit does nothing.
  Each has a single `sendMessage()` / `subscribe()` function to connect later.
- **Editable copy** lives in `app/lib/site-content.ts`. Move it to a metaobject to edit it in Shopify admin.

## Shopify admin checklist

- Products and collections published to the **Hydrogen** sales channel.
- Menus with handles `main-menu` and `footer` (Online Store > Navigation).
- A page with handle `contact` (optional; the form shows either way).
- Customer accounts: Hydrogen channel > Storefront settings > Customer Account API (for /account login).
