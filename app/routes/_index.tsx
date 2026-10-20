import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import type {HomeProductsQuery} from 'storefrontapi.generated';
import {ProductItem, PRODUCT_CARD_FRAGMENT} from '~/components/ProductItem';
import {SITE_CONTENT} from '~/lib/site-content';

export const meta: Route.MetaFunction = ({matches}) => {
  const root = matches.find((m) => m?.id === 'root')?.data as
    | {header?: {shop?: {name?: string; description?: string | null}}}
    | undefined;
  const shop = root?.header?.shop;
  return [
    {title: shop?.name ?? 'Home'},
    {name: 'description', content: shop?.description ?? ''},
  ];
};

export function loader({context}: Route.LoaderArgs) {
  // The hero is static copy, so the product grid can stream in below the fold.
  const products = context.storefront
    .query(HOME_PRODUCTS_QUERY, {
      variables: {first: SITE_CONTENT.featuredProducts.count},
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {products};
}

export default function Homepage() {
  const {products} = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Hero />
      <FeaturedProducts products={products} />
    </div>
  );
}

/** Horizon "hero" section: black, large, centered heading + blue button. */
function Hero() {
  const {heading, buttonLabel, buttonLink} = SITE_CONTENT.hero;
  return (
    <section className="hero">
      <div className="hero-content page-width">
        <h1>{heading}</h1>
        <Link to={buttonLink} className="button" prefetch="intent">
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}

/** Horizon "product-list" section. */
function FeaturedProducts({
  products,
}: {
  products: Promise<HomeProductsQuery | null>;
}) {
  const {heading, viewAllLabel, viewAllLink} = SITE_CONTENT.featuredProducts;
  return (
    <section className="product-list page-width" aria-labelledby="featured-products">
      <div className="section-heading">
        <h2 id="featured-products">{heading}</h2>
        <Link to={viewAllLink} className="link-underline" prefetch="intent">
          {viewAllLabel}
        </Link>
      </div>
      <Suspense fallback={<div className="product-grid product-grid--loading" />}>
        <Await resolve={products}>
          {(response) =>
            response?.products.nodes.length ? (
              <div className="product-grid">
                {response.products.nodes.map((product, i) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
            ) : (
              <p className="empty-state">
                No products yet. Make sure products are published to the
                Hydrogen sales channel.
              </p>
            )
          }
        </Await>
      </Suspense>
    </section>
  );
}

const HOME_PRODUCTS_QUERY = `#graphql
  query HomeProducts($first: Int!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
