import { Hero } from "@/components/home/Hero";
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

      {/* 2. Pizza Categories (Dynamic Section 2 from Assignment 9) */}
      <CategoriesSection />

      {/* 3. Why Choose PizzaHub? (Required Extra Section from Assignment 9) */}
      <WhyChooseUs />

      {/* 4. How PizzaHub Works (Extra Section: 4-Step Journey) */}
      <HowItWorks />

      {/* 5. Customer Testimonials (Social Proof & Purist Reviews) */}
      <Testimonials />

      {/* 6. Vendor Acquisition & Premium Subscription Banner */}
      <VendorBannerCTA />
    </div>
  );
}
