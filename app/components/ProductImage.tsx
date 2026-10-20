import {useEffect, useMemo, useState} from 'react';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

type GalleryImage = NonNullable<ProductVariantFragment['image']>;

/**
 * Product media gallery (Horizon "_product-media-gallery" block):
 * large main image plus a thumbnail strip. Switching variants jumps to
 * that variant's image.
 */
export function ProductGallery({
  selectedImage,
  images,
  title,
}: {
  selectedImage?: ProductVariantFragment['image'];
  images: GalleryImage[];
  title: string;
}) {
  const all = useMemo(() => {
    const list = [...images];
    if (selectedImage && !list.some((img) => img.id === selectedImage.id)) {
      list.unshift(selectedImage);
    }
    return list;
  }, [images, selectedImage]);

  const [activeId, setActiveId] = useState(selectedImage?.id ?? all[0]?.id);

  useEffect(() => {
    if (selectedImage?.id) setActiveId(selectedImage.id);
  }, [selectedImage?.id]);

  const active = all.find((img) => img.id === activeId) ?? all[0];

  if (!active) {
    return <div className="product-gallery"><div className="product-image product-card-placeholder" /></div>;
  }

  return (
    <div className="product-gallery">
      <div className="product-image">
        <Image
          alt={active.altText || title}
          aspectRatio="1/1"
          data={active}
          key={active.id}
          loading="eager"
          sizes="(min-width: 990px) 55vw, 100vw"
        />
      </div>
      {all.length > 1 && (
        <ul className="product-thumbnails" aria-label="Product images">
          {all.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                className={img.id === active.id ? 'is-active' : ''}
                aria-label={`Show image ${i + 1}`}
                aria-current={img.id === active.id}
                onClick={() => setActiveId(img.id)}
              >
                <Image
                  alt=""
                  aspectRatio="1/1"
                  data={img}
                  loading="lazy"
                  sizes="96px"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
