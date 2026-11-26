'use client';

import { useState } from 'react';

export function ContactEmail({ email }: { email: string }) {
  const [status, setStatus] = useState('');

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus('Email address copied.');
    } catch {
      setStatus('Select the address above to copy it.');
    }
  }

  return (
    <div className="contact-address">
      <a className="email-address" href={'mailto:' + email}>{email}</a>
      <button className="contact-copy" type="button" data-pointer-control onClick={copyEmail}>Copy email</button>
      <p className="copy-status" role="status">{status}</p>
    </div>
  );
}
