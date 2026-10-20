import {useLoaderData} from 'react-router';
import type {Route} from './+types/pages.contact';
import {ContactForm} from '~/components/ContactForm';

/**
 * Horizon "page.contact" template: page content followed by a contact form.
 * Overrides the generic /pages/:handle route for the "contact" handle only.
 */
export const meta: Route.MetaFunction = ({data}) => [
  {title: data?.page?.seo?.title || data?.page?.title || 'Contact'},
];

export async function loader({context}: Route.LoaderArgs) {
  const {page} = await context.storefront.query(CONTACT_PAGE_QUERY, {
    variables: {handle: 'contact'},
  });
  // Render the form even if the "contact" page doesn't exist in admin yet.
  return {page};
}

export default function ContactPage() {
  const {page} = useLoaderData<typeof loader>();
  return (
    <div className="page page-width page-narrow">
      <h1>{page?.title ?? 'Contact'}</h1>
      {page?.body ? (
        <div className="rte" dangerouslySetInnerHTML={{__html: page.body}} />
      ) : null}
      <ContactForm />
    </div>
  );
}

const CONTACT_PAGE_QUERY = `#graphql
  query ContactPage(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  ) @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        title
        description
      }
    }
  }
` as const;
