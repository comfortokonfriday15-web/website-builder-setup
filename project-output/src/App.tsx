import Nav from "./components/Nav";
import Hero from "./components/Hero";
import LogoBar from "./components/LogoBar";
import ProblemSection from "./components/ProblemSection";
import UnifiedWorkspace from "./components/UnifiedWorkspace";
import WorkflowTransformation from "./components/WorkflowTransformation";
import CoreCapabilities from "./components/CoreCapabilities";
import ProductWalkthrough from "./components/ProductWalkthrough";
import UseCases from "./components/UseCases";
import Integrations from "./components/Integrations";
import Testimonials from "./components/Testimonials";
import SocialProof from "./components/SocialProof";
import Security from "./components/Security";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import FinalCta from "./components/FinalCta";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-canvas antialiased">
      <Nav />
      <Hero />
      <LogoBar />
      <ProblemSection />
      <UnifiedWorkspace />
      <WorkflowTransformation />
      <CoreCapabilities />
      <ProductWalkthrough />
      <UseCases />
      <Integrations />
      <Testimonials />
      <SocialProof />
      <Security />
      <Pricing />
      <FAQ />
      <FinalCta />
      <Footer />
    </div>
  );
}
