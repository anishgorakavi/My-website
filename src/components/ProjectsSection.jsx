import React, { useState } from 'react';
import { projects } from '../data/projects.js';
import { SectionLabel } from './Shared.jsx';

const projectFilters = ['All work', 'Security', 'AI & agents', 'Open source'];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('All work');
  const visibleProjects = projects.filter(project => (
    activeFilter === 'All work' || project.category === activeFilter
  ));
  const projectCount = String(projects.length).padStart(2, '0');

  return (
    <section id="work" className="section work">
      <SectionLabel number="01">SELECTED WORK</SectionLabel>
      <div className="section-heading">
        <h2>Built to understand.</h2>
        <p>Projects, experiments, and questions<br /> worth pulling on.</p>
      </div>
      <div className="filters" role="group" aria-label="Filter projects">
        {projectFilters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
            className={activeFilter === filter ? 'active' : ''}
          >
            {filter}
            {filter === 'All work' && <span>{projectCount}</span>}
          </button>
        ))}
      </div>
      <div className="project-grid">
        {visibleProjects.map(project => <ProjectCard key={project.id} project={project} />)}
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-top">
        <span className="project-icon" aria-hidden="true">{project.glyph}</span>
        <span>{project.type}</span>
        <span className="project-index">/{project.id}</span>
      </div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="tags">
        {project.tags.map(tag => <span key={tag}>{tag}</span>)}
      </div>
      <details>
        <summary>Project notes <span>+</span></summary>
        <p>{project.detail}</p>
      </details>
    </article>
  );
}
