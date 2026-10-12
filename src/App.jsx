import React from 'react';
import Header from './components/Header.jsx';
import Hero, { InterestStrip } from './components/Hero.jsx';
import ProjectsSection from './components/ProjectsSection.jsx';
import AboutSection from './components/AboutSection.jsx';
import AcademicSection from './components/AcademicSection.jsx';
import JourneySection from './components/JourneySection.jsx';
import PublicationSection from './components/PublicationSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <InterestStrip />
        <ProjectsSection />
        <AboutSection />
        <AcademicSection />
        <JourneySection />
        <PublicationSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
