import type {FormEvent} from 'react';

/**
 * Contact form from Horizon's page.contact template.
 *
 * PLACEHOLDER: fields render, but submitting does nothing yet.
 * To connect it, replace `sendMessage()` with a call to a route action that
 * forwards the data to a form service (Formspree, etc.), an email API,
 * or stores it as a metaobject via the Admin API.
 */
async function sendMessage(_data: FormData): Promise<void> {
  // Intentionally a no-op for now.
}

export function ContactForm() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(new FormData(event.currentTarget));
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-form-row">
        <div className="field">
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="contact-email">
            Email <span aria-hidden>*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact-phone">Phone number</label>
        <input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="contact-comment">Comment</label>
        <textarea id="contact-comment" name="comment" rows={6} />
      </div>
      <button type="submit" className="button">
        Send
      </button>
    </form>
  );
}
