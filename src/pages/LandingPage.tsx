import { lazy, Suspense } from "react";

const BannerLand = lazy(() => import("../components/BannerLand"));
const FooterLanding = lazy(() => import("../components/FooterLanding"));
const LandHeroSection = lazy(() => import("../components/LandHeroSection.tsx"));
const CallAction = lazy(() => import("../components/LandingPageCards/CallAction.tsx"));
const KeyBenefits = lazy(() => import("../components/LandingPageCards/KeyBenefits.tsx"));
const ThreeSteps = lazy(() => import("../components/LandingPageCards/ThreeSteps.tsx"));
const UseCases = lazy(() => import("../components/LandingPageCards/UseCases.tsx"));
const CustomCursor = lazy(() => import("../components/CustomCursor.tsx"));

function LandingPage() {
  return (
    <div className="relative bg-[#020617] md:cursor-none">
      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>

      <section id="home">
        <Suspense fallback={<div className="h-screen bg-[#020617]" />}>
          <LandHeroSection />
        </Suspense>
      </section>

      <Suspense fallback={null}>
        <BannerLand />
        <CallAction />
        <section id="about">
          <UseCases />
        </section>
        <section id="services">
          <KeyBenefits />
        </section>
        <section id="use">
          <ThreeSteps />
        </section>
        <section id="contact">
          <FooterLanding />
        </section>
      </Suspense>
    </div>
  );
}

export default LandingPage;
