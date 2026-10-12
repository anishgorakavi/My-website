import React from 'react';
import { SectionLabel } from './Shared.jsx';

export default function AboutSection() {
  return (
    <section id="about" className="section about">
      <div>
        <SectionLabel number="02">THE PERSON BEHIND THE TERMINAL</SectionLabel>
        <h2>
          Interesting things
          <br />
          happen{' '}
          <span className="blue">in between.</span>
        </h2>
        <div className="about-badge">
          <span className="badge-monogram">UT</span>
          <div>
            The University of Texas at Austin
            <small>Computer Science + Neuroscience · Class of 2030</small>
          </div>
        </div>
      </div>
      <div className="about-copy">
        <p>
          I’m Anish, a CS + Neuroscience student at UT Austin. I’ve been programming since childhood
          and working in cybersecurity since my early teens.
        </p>
        <p>
          I’m drawn to the places where fields overlap: AI and security, infrastructure and
          identity, computation and cognition. I like taking complicated systems apart,
          understanding their assumptions, and building something that makes them easier to reason
          about.
        </p>
        <p>
          I also experiment with home-lab infrastructure and think about how technical ideas become
          useful products.
        </p>
        <div className="philosophy">
          <span>~/philosophy</span>
          <p>
            Build to understand. Question assumptions.
            <br />
            Keep room for what comes next.
          </p>
        </div>
      </div>
    </section>
  );
}
