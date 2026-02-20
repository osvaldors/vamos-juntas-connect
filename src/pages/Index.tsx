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
import NewsletterSection from "@/components/public/NewsletterSection";
import Footer from "@/components/public/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="mt-16 flex-1">
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
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
