import { MarketingNav } from "@/components/layout/marketing-nav";
import { LandingHero } from "@/components/sections/landing-hero";
import { LandingFeatures } from "@/components/sections/landing-features";
import { HowAppsFail } from "@/components/sections/how-apps-fail";

export default function LandingPage() {
  return (
    <div>
      <MarketingNav />
      <LandingHero />
      <LandingFeatures />
      <HowAppsFail />
    </div>
  );
}
