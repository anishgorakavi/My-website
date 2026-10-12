import React from 'react';
import { SectionLabel } from './Shared.jsx';

export default function JourneySection() {
  return (
    <section id="journey" className="section journey">
      <SectionLabel number="03">ALONG THE WAY</SectionLabel>
      <div className="section-heading">
        <h2>A foundation in doing.</h2>
        <p>
          Learning in the classroom.
          <br /> Testing it in the real world.
        </p>
      </div>
      <JourneyEntry
        type="INDUSTRY"
        title="CheckRed"
        role="Software quality, security & product research"
      >
        Started as an SDET / manual QA intern around age 14, learning structured testing with Python
        and pytest. Later work explored security posture management, AI security, and turning
        telemetry into useful risk context.
      </JourneyEntry>
      <JourneyEntry type="OPEN SOURCE" title="GNU Prolog for Java" role="Maintainer">
        Maintaining and hardening an open-source logic programming system, with an interest in
        software that others can inspect, extend, and build on.
      </JourneyEntry>
      <JourneyEntry
        type="EXPLORATION"
        title="Beyond the syllabus"
        role="Competitions, agents & independent projects"
      >
        Participated in National Cyber League and picoCTF. Continuing to explore agentic AI,
        MCP-based systems, and the connections between computer science and neuroscience.
      </JourneyEntry>
    </section>
  );
}

function JourneyEntry({ type, title, role, children }) {
  return (
    <div className="journey-row">
      <span className="journey-type">{type}</span>
      <h3>{title}</h3>
      <div>
        <h4>{role}</h4>
        <p>{children}</p>
      </div>
    </div>
  );
}
