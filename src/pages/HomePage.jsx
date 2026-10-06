import React from 'react';
import Hero                    from '../components/sections/Hero.jsx';
import TrustBanner            from '../components/sections/TrustBanner.jsx';
import Features                from '../components/sections/Features.jsx';
import WhyChooseUs             from '../components/sections/WhyChooseUs.jsx';
import AboutSection            from '../components/sections/AboutSection.jsx';
import CoursesPreview          from '../components/sections/CoursesPreview.jsx';
import HowItWorks              from '../components/sections/HowItWorks.jsx';
import CertVerifyWidget        from '../components/sections/CertVerifyWidget.jsx';
import LegalRegistrationSection from '../components/sections/LegalRegistrationSection.jsx';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBanner />
      <Features />
      <WhyChooseUs />
      <AboutSection />
      <CoursesPreview />
      <HowItWorks />
      <LegalRegistrationSection />
      <CertVerifyWidget />
    </>
  );
}
