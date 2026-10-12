import React from 'react';
import { email, github, linkedin } from '../data/links.js';
import { Arrow } from './Shared.jsx';

export default function ContactSection() {
  return (
    <section id="connect" className="section connect">
      <div className="eyebrow">
        <span className="signal" />{' '}
        KEEP THE CONVERSATION GOING
      </div>
      <h2>
        Good questions lead
        <br />
        to{' '}
        <span className="blue">interesting things.</span>
      </h2>
      <p>
        Security, AI, open source, or an idea at the intersection.
        <br />{' '}
        I’d be glad to connect.
      </p>
      <div className="contact-actions">
        <a className="button primary" href={linkedin} target="_blank" rel="noreferrer">
          Find me on LinkedIn{' '}
          <Arrow />
        </a>
        <a
          className="button secondary"
          href={github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub (opens in a new tab)"
        >
          GitHub{' '}
          <Arrow />
        </a>
        <a className="button secondary contact-email" href={`mailto:${email}`}>{email}</a>
      </div>
    </section>
  );
}
