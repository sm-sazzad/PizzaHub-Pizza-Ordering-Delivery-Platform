import { Hero } from "@/components/home/Hero";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { VendorBannerCTA } from "@/components/home/VendorBannerCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner with Interactive Woodfired Oven Showcase */}
      <Hero />

      {/* 2. Featured Menu Items (Dynamic from /features endpoint) */}
      <FeaturedSection />

      {/* 3. Pizza Categories (Dynamic Section 2 from Assignment 9) */}
      <CategoriesSection />

      {/* 4. Why Choose PizzaHub? (Required Extra Section from Assignment 9) */}
      <WhyChooseUs />

      {/* 5. How PizzaHub Works (Extra Section: 4-Step Journey) */}
      <HowItWorks />

      {/* 6. Customer Testimonials (Social Proof & Purist Reviews) */}
      <Testimonials />

      {/* 7. Vendor Acquisition & Premium Subscription Banner */}
      <VendorBannerCTA />
    </div>
  );
}
