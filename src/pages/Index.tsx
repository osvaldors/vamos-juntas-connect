import Header from "@/components/public/Header";
import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import MembersCarousel from "@/components/public/MembersCarousel";
import EventsSection from "@/components/public/EventsSection";
import BookClubSection from "@/components/public/BookClubSection";
import PartnersCarousel from "@/components/public/PartnersCarousel";
import ShopSection from "@/components/public/ShopSection";
import GymRatsSection from "@/components/public/GymRatsSection";
import PricingSection from "@/components/public/PricingSection";
import FAQSection from "@/components/public/FAQSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import NewsletterSection from "@/components/public/NewsletterSection";
import Footer from "@/components/public/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <MembersCarousel />
      <EventsSection />
      <BookClubSection />
      <PartnersCarousel />
      <ShopSection />
      <GymRatsSection />
      <PricingSection />
      <FAQSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
