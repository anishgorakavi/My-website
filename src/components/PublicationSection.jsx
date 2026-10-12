import React from 'react';
import { amazonBook } from '../data/links.js';
import { Arrow, SectionLabel } from './Shared.jsx';

export default function PublicationSection() {
  return (
    <section id="writing" className="section writing">
      <SectionLabel number="04">ON PAPER</SectionLabel>
      <div className="writing-panel">
        <a
          className="book-link"
          href={amazonBook}
          target="_blank"
          rel="noreferrer"
          aria-label="Find Cyber Essentials for Teenagers on Amazon (opens in a new tab)"
        >
          <div className="publication-mark" aria-hidden="true">
            <span className="book-system">BOOK.SYS / CHANNEL 06</span>
            <strong>
              CYBER
              <br />
              ESSENTIALS
            </strong>
            <div className="book-cover-bottom">
              <span className="book-subtitle">
                for teenagers
                <span className="book-cursor" />
              </span>
              <span className="book-signature">AG // AMAZON ↗</span>
            </div>
          </div>
        </a>
        <div className="writing-copy">
          <div className="eyebrow">PUBLICATION · 2025</div>
          <h2>
            A way into
            <br />
            cybersecurity.
          </h2>
          <p>
            I wrote{' '}
            <em>Cyber Essentials for Teenagers</em>{' '}
            to make cybersecurity more understandable and accessible to young people finding their
            way into the field.
          </p>
          <p className="publication-format">Published in print and Kindle formats.</p>
          <a className="button primary book-amazon" href={amazonBook} target="_blank" rel="noreferrer">
            View on Amazon{' '}
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
