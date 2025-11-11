// import { lazy } from "react";
import BannerLand from "../components/BannerLand";
import FooterLanding from "../components/FooterLanding";
import LandHeroSection from "../components/LandHeroSection.tsx";
import CallAction from "../components/LandingPageCards/CallAction.tsx";
import KeyBenefits from "../components/LandingPageCards/KeyBenefits.tsx";
import ThreeSteps from "../components/LandingPageCards/ThreeSteps.tsx";
import UseCases from "../components/LandingPageCards/UseCases.tsx";

// const BannerLand = lazy(() => import("../components/BannerLand"));
// const CallAction = lazy(() => import("../LandingPageCards/CallAction"));
// const UseCases = lazy(() => import("../LandingPageCards/UseCases"));
// const KeyBenefit = lazy(() => import("../LandingPageCards/KeyBenefits"));
// const ThreeStep = lazy(() => import("../LandingPageCards/ThreeSteps"));
// const FooterLand = lazy(() => import("../components/FooterLanding"));

function LandingPage() {
  return (
    <>
      <LandHeroSection />
      <BannerLand />
      <CallAction />
      <UseCases />
      <KeyBenefits />
      <ThreeSteps />
      <FooterLanding />
    </>
  );
}

export default LandingPage;
