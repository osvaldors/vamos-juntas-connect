import { useData } from "@/contexts/DataContext";
import Header from "@/components/public/Header";
import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import MembersCarousel from "@/components/public/MembersCarousel";
import EventsSection from "@/components/public/EventsSection";
import BookClubSection from "@/components/public/BookClubSection";
import PartnersCarousel from "@/components/public/PartnersCarousel";
import BenefitsSection from "@/components/public/BenefitsSection";
import PricingSection from "@/components/public/PricingSection";
import FAQSection from "@/components/public/FAQSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
// import NewsletterSection from "@/components/public/NewsletterSection";
import Footer from "@/components/public/Footer";

const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
    </div>
    <p className="text-muted-foreground text-sm animate-pulse">Carregando...</p>
  </div>
);

const ErrorBanner = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 text-center text-sm flex items-center justify-center gap-3 flex-wrap">
    <span>⚠️ Alguns dados podem não ter carregado corretamente.</span>
    <button
      onClick={onRetry}
      className="underline font-semibold hover:text-destructive/80 transition-colors"
    >
      Tentar novamente
    </button>
  </div>
);

const Index = () => {
  const { loading, error, initialLoadDone, refetch } = useData();

  if (loading && !initialLoadDone) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      {error && <ErrorBanner error={error} onRetry={refetch} />}
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <MembersCarousel />
        <EventsSection />
        <BookClubSection />
        <PartnersCarousel />
        <BenefitsSection />
        <PricingSection />
        <FAQSection />
        <TestimonialsSection />
        {/* <NewsletterSection /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
