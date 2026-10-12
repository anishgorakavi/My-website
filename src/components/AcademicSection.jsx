import React from 'react';
import BevoTerminal from './BevoTerminal.jsx';

export default function AcademicSection() {
  return (
    <section id="academics" className="section academics" aria-label="Academic Goals & Successes">
      <details className="academic-details">
        <summary>
          <span className="academic-kicker">UT AUSTIN / CLASS OF 2030</span>
          <span className="academic-title">
            Academic Goals
            <br />
            &amp; Successes{' '}
            <span className="academic-chevron" aria-hidden="true">⌄</span>
          </span>
          <span className="academic-hint">Coursework, community, and what comes next.</span>
        </summary>
        <div className="academic-copy">
          <p>
            As a computer science student at{' '}
            <strong>The University of Texas at Austin</strong>
            , I want to take advantage of UT’s strong CS community to explore systems,
            cybersecurity, networking, and the intersection of computing and neuroscience. My
            coursework in areas such as data structures and algorithms has strengthened the way I
            approach complex problems, while UT’s labs, student resources, and technical community
            have given me opportunities to experiment beyond the classroom.
          </p>
          <p>
            My goal at UT is not just to earn a degree, but to leave with a deeper understanding of
            how computers work, from algorithms and software to operating systems and hardware. I
            hope to use that foundation to contribute to research, ambitious technical projects, and
            eventually work that connects my interests across computing, security, and neuroscience.
          </p>
        </div>
      </details>
      <BevoTerminal />
    </section>
  );
}
