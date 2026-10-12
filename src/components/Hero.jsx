import React from 'react';
import { linkedin } from '../data/links.js';
import { Arrow } from './Shared.jsx';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="signal" />{' '}
          CS + NEUROSCIENCE · UT AUSTIN
        </div>
        <h1 id="hero-title">
          Anish
          <br />
          <span>
            Gorakavi
            <span className="cursor">_</span>
          </span>
        </h1>
        <p className="hero-statement">
          Curious about systems.
          <br />
          Driven to{' '}
          <em>take them apart.</em>
        </p>
        <p className="hero-description">
          I build across cybersecurity, AI, and open source.
          <br className="desktop-break" />{' '}
          Exploring what happens when disciplines collide.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#work">
            Explore my work{' '}
            <span>↓</span>
          </a>
          <a className="button secondary" href={linkedin} target="_blank" rel="noreferrer">
            LinkedIn{' '}
            <Arrow />
          </a>
        </div>
        <div className="hero-meta">
          <span>BUILD · RESEARCH · REPEAT</span>
          <span>AUSTIN, TX</span>
        </div>
      </div>
      <figure className="hero-portrait">
        <img
          src="./anish-gorakavi.png"
          alt="Anish Gorakavi outdoors wearing glasses, a white shirt, and a blue tie"
          width="800"
          height="800"
          decoding="async"
        />
      </figure>
    </section>
  );
}

export function InterestStrip() {
  return (
    <div className="interest-strip">
      <span>SECURITY ENGINEERING</span>
      <b>+</b>
      <span>ARTIFICIAL INTELLIGENCE</span>
      <b>+</b>
      <span>OPEN SOURCE</span>
      <b>+</b>
      <span>SYSTEMS THINKING</span>
    </div>
  );
}
