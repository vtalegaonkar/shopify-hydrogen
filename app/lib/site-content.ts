/**
 * Site copy ported from the Horizon theme's editor settings
 * (header-group.json, footer-group.json, index.json).
 *
 * In the Liquid theme these were edited in the theme editor. To make them
 * editable in Shopify admin again, move them into a "site_settings" metaobject
 * and load it in root.tsx. Until then, edit the values here.
 */
export const SITE_CONTENT = {
  announcement: {
    text: 'Free shipping on orders over $75',
    link: null as string | null,
  },
  hero: {
    heading: 'Made for people. Built to last.',
    buttonLabel: 'Shop the collection',
    buttonLink: '/collections/all',
  },
  featuredProducts: {
    heading: 'Featured products',
    viewAllLabel: 'View all',
    viewAllLink: '/collections/all',
    count: 8,
  },
  footer: {
    newsletterHeading: "Let's stay connected",
    newsletterPlaceholder: 'Email address',
    newsletterButton: 'Sign up',
  },
  social: [
    // Add profile URLs to show icons in the footer, e.g.
    // {label: 'Instagram', url: 'https://instagram.com/yourbrand'},
  ] as Array<{label: string; url: string}>,
} as const;
