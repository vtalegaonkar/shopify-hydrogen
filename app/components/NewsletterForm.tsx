import {useState, type FormEvent} from 'react';
import {IconArrow} from '~/components/Icons';

/**
 * Email signup from the Horizon footer.
 *
 * PLACEHOLDER: the form renders and validates, but submitting does nothing yet.
 * To connect it, replace `subscribe()` with a call to a route action that runs
 * the Storefront API `customerCreate` mutation (acceptsMarketing: true) or
 * your email platform's API (Klaviyo, Mailchimp, ...).
 */
async function subscribe(_email: string): Promise<void> {
  // Intentionally a no-op for now.
}

export function NewsletterForm({
  placeholder,
  buttonLabel,
}: {
  placeholder: string;
  buttonLabel: string;
}) {
  const [email, setEmail] = useState('');

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void subscribe(email);
  }

  return (
    <form className="newsletter-form" onSubmit={onSubmit} noValidate={false}>
      <label htmlFor="newsletter-email" className="sr-only">
        {placeholder}
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" aria-label={buttonLabel}>
        <IconArrow />
      </button>
    </form>
  );
}
