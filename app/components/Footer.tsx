import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {NewsletterForm} from '~/components/NewsletterForm';
import {SITE_CONTENT} from '~/lib/site-content';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  const {footer: copy, social} = SITE_CONTENT;
  return (
    <footer className="footer">
      <div className="footer-main page-width">
        <div className="footer-newsletter">
          <h2>{copy.newsletterHeading}</h2>
          <NewsletterForm
            placeholder={copy.newsletterPlaceholder}
            buttonLabel={copy.newsletterButton}
          />
        </div>
        <Suspense>
          <Await resolve={footerPromise}>
            {(footer) =>
              footer?.menu && header.shop.primaryDomain?.url ? (
                <FooterMenu
                  menu={footer.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              ) : null
            }
          </Await>
        </Suspense>
      </div>

      <div className="footer-utilities">
        <div className="page-width footer-utilities-inner">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} {header.shop.name}
          </p>
          <Suspense>
            <Await resolve={footerPromise}>
              {(footer) => <PolicyList shop={footer?.shop} />}
            </Await>
          </Suspense>
          {social.length > 0 && (
            <ul className="footer-social">
              {social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}

function PolicyList({shop}: {shop?: FooterQuery['shop']}) {
  if (!shop) return null;
  const policies = [
    shop.privacyPolicy,
    shop.refundPolicy,
    shop.shippingPolicy,
    shop.termsOfService,
  ].filter(Boolean);
  if (!policies.length) return null;
  return (
    <ul className="footer-policies">
      {policies.map((policy) => (
        <li key={policy!.id}>
          <NavLink prefetch="intent" to={`/policies/${policy!.handle}`}>
            {policy!.title}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  if (!menu?.items.length) return null;
  return (
    <nav className="footer-menu" role="navigation" aria-label="Footer">
      {menu.items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink end key={item.id} prefetch="intent" to={url}>
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}
