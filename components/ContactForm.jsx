'use client';

import { useState } from 'react';
import Icon from './Icon';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Front-end only contact form with inline validation. On submit it opens the
 * visitor's email app with the message pre-filled (no backend needed).
 * To receive messages directly instead, POST `values` to a service such as
 * Formspree or Web3Forms inside `onSubmit`.
 */
export default function ContactForm({ email }) {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = 'Please enter your name.';
    if (!EMAIL_RE.test(v.email)) e.email = 'Please enter a valid email address.';
    if (v.message.trim().length < 10) e.message = 'Please write a short message (10+ characters).';
    return e;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    const subject = encodeURIComponent(`Virtual assistant inquiry from ${values.name}`);
    const body = encodeURIComponent(`${values.message}\n\n${values.name}\n${values.email}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field = (name, label, props = {}) => {
    const { as: Tag = 'input', ...rest } = props;
    return (
      <div className="field">
        <label htmlFor={`f-${name}`}>{label}</label>
        <Tag
          id={`f-${name}`}
          name={name}
          value={values[name]}
          onChange={onChange}
          aria-invalid={errors[name] ? 'true' : undefined}
          aria-describedby={errors[name] ? `f-${name}-err` : undefined}
          {...rest}
        />
        {errors[name] && (
          <p id={`f-${name}-err`} className="field__error">
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-label="Contact form">
      <div className="form__row">
        {field('name', 'Name', { type: 'text', autoComplete: 'name', placeholder: 'Your name' })}
        {field('email', 'Email', { type: 'email', autoComplete: 'email', placeholder: 'you@company.com' })}
      </div>
      {field('message', 'How can I help?', {
        as: 'textarea',
        placeholder: 'Tell me about your business and the support you need…',
      })}
      <button type="submit" className="btn btn--primary">
        Send Message <Icon name="arrowRight" size={18} />
      </button>
      <div aria-live="polite">
        {sent && (
          <p className="form__status">
            <Icon name="check" size={18} /> Your email app should open with the message ready to send.
          </p>
        )}
      </div>
    </form>
  );
}
