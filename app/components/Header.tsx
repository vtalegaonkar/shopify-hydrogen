import {Suspense} from 'react';
import {Await, Link, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {IconAccount, IconCart, IconMenu, IconSearch} from '~/components/Icons';
import {SITE_CONTENT} from '~/lib/site-content';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

/** Blue announcement bar (Horizon "header-announcements" section). */
export function AnnouncementBar() {
  const {text, link} = SITE_CONTENT.announcement;
  if (!text) return null;
  return (
    <div className="announcement-bar" role="region" aria-label="Announcement">
      {link ? <Link to={link}>{text}</Link> : <p>{text}</p>}
    </div>
  );
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const logoUrl = shop.brand?.logo?.image?.url;
  return (
    <header className="header">
      <div className="header-inner page-width">
        <HeaderMenuMobileToggle />
        <Link prefetch="intent" to="/" className="header-logo">
          {logoUrl ? (
            <img src={logoUrl} alt={shop.name} height={36} />
          ) : (
            <span>{shop.name}</span>
          )}
        </Link>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

type MenuItemNode = NonNullable<HeaderQuery['menu']>['items'][number];

function toRelativeUrl(
  url: string,
  publicStoreDomain: string,
  primaryDomainUrl: string,
) {
  return url.includes('myshopify.com') ||
    url.includes(publicStoreDomain) ||
    url.includes(primaryDomainUrl)
    ? new URL(url).pathname
    : url;
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();
  const items = (menu?.items ?? FALLBACK_HEADER_MENU.items) as MenuItemNode[];

  return (
    <nav className={className} role="navigation" aria-label="Main">
      {viewport === 'mobile' && (
        <NavLink end onClick={close} prefetch="intent" to="/" className="menu-link">
          Home
        </NavLink>
      )}
      {items.map((item) => {
        if (!item.url) return null;
        const url = toRelativeUrl(item.url, publicStoreDomain, primaryDomainUrl);
        const children = item.items?.filter((child) => child.url) ?? [];
        return (
          <div className="menu-item" key={item.id}>
            <NavLink
              className={({isActive}) =>
                `menu-link${isActive ? ' menu-link--active' : ''}`
              }
              end
              onClick={close}
              prefetch="intent"
              to={url}
            >
              {item.title}
            </NavLink>
            {children.length > 0 && (
              <div className="submenu">
                {children.map((child) => (
                  <NavLink
                    key={child.id}
                    className="submenu-link"
                    onClick={close}
                    prefetch="intent"
                    to={toRelativeUrl(
                      child.url!,
                      publicStoreDomain,
                      primaryDomainUrl,
                    )}
                  >
                    {child.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <div className="header-ctas">
      <SearchToggle />
      <Suspense fallback={<AccountLink label="Sign in" />}>
        <Await resolve={isLoggedIn} errorElement={<AccountLink label="Sign in" />}>
          {(loggedIn) => <AccountLink label={loggedIn ? 'Account' : 'Sign in'} />}
        </Await>
      </Suspense>
      <CartToggle cart={cart} />
    </div>
  );
}

function AccountLink({label}: {label: string}) {
  return (
    <NavLink prefetch="intent" to="/account" className="icon-button" aria-label={label}>
      <IconAccount />
    </NavLink>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle icon-button reset"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <IconMenu />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="icon-button reset" onClick={() => open('search')} aria-label="Search">
      <IconSearch />
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="icon-button cart-toggle"
      aria-label={`Cart, ${count} items`}
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <IconCart />
      {count > 0 && <span className="cart-bubble">{count}</span>}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

/** Shown only if the "main-menu" menu doesn't exist in Shopify admin. */
const FALLBACK_HEADER_MENU = {
  id: 'fallback-main-menu',
  items: [
    {id: 'fb-home', title: 'Home', url: '/', items: []},
    {id: 'fb-catalog', title: 'Catalog', url: '/collections/all', items: []},
    {id: 'fb-contact', title: 'Contact', url: '/pages/contact', items: []},
  ],
};
