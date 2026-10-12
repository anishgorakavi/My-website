import React from 'react';
export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function SectionLabel({ number, children }) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <span>{children}</span>
      <i />
    </div>
  );
}

export function Brand({ label }) {
  return (
    <a className="brand" href="#" aria-label={label}>
      <span className="brand-icon">AG<span>_</span></span>
      <span>ANISH GORAKAVI</span>
    </a>
  );
}
