import React from 'react';
import { email, github, linkedin } from '../data/links.js';
import { Brand } from './Shared.jsx';

export default function Footer() {
  return (
    <footer>
      <Brand />
      <span>AUSTIN, TX · ALWAYS LEARNING</span>
      <div className="footer-links" role="group" aria-label="Footer links">
        <a
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn (opens in a new tab)"
        >
          LinkedIn
        </a>
        <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub (opens in a new tab)">GitHub</a>
        <a href={`mailto:${email}`}>Email</a>
        <a href="#">Back to top ↑</a>
      </div>
    </footer>
  );
}
