import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

/**
 * Product card used on the homepage, collections and recommendations.
 * Mirrors Horizon's product card: square image with zoom on hover,
 * title, price, and Sale / Sold out badges.
 */
export function ProductItem({
  product,
  loading,
}: {
  product: ProductCardFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const onSale =
    compareAt && Number(compareAt.amount) > Number(price.amount);
  const soldOut = !product.availableForSale;

  return (
    <Link className="product-card" prefetch="intent" to={variantUrl}>
      <div className="product-card-media">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 990px) 25vw, (min-width: 750px) 33vw, 50vw"
          />
        ) : (
          <div className="product-card-placeholder" />
        )}
        {(soldOut || onSale) && (
          <span className={`badge ${soldOut ? 'badge--sold-out' : 'badge--sale'}`}>
            {soldOut ? 'Sold out' : 'Sale'}
          </span>
        )}
      </div>
      <div className="product-card-info">
        <h3 className="product-card-title">{product.title}</h3>
        <div className="product-card-price">
          {product.priceRange.minVariantPrice.amount !==
            product.priceRange.maxVariantPrice.amount && <span>From</span>}
          <Money data={price} />
          {onSale && (
            <s className="compare-at">
              <Money data={compareAt} />
            </s>
          )}
        </div>
      </div>
    </Link>
  );
}

export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCardMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductCard on Product {
    id
    handle
    title
    availableForSale
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...ProductCardMoney
      }
      maxVariantPrice {
        ...ProductCardMoney
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...ProductCardMoney
      }
    }
  }
` as const;
