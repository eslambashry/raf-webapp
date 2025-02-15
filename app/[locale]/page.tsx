'use client'
import { useState } from "react";
import AboutUs from "@/components/AboutUs";
import Blog from "@/components/Blog";
// import Consultation from "@/components/Consultation";
import Contact from "@/components/Contact";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Partners from "@/components/Partners";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import FeatureSection from "@/components/FeatureSection";
// import Pagination from "@/components/Pagination";


export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div 
      className="min-h-screen w-full bg-[#EFEDEA] overflow-x-hidden" 
      dir="rtl" 
      style={{ fontFamily: 'Cairo, sans-serif' }}
    >
      <Navbar />
      {/* Hero Section - Full height on mobile */}
      <div className="min-h-[100vh] md:min-h-[90vh]">
        <Hero />
      </div>

      {/* Main Content with Responsive Spacing */}
      <main className="">
        <div className="space-y-16 md:space-y-24 lg:space-y-32">
          {/* Cards Grid Section */}
          
            <FeatureCards />
           

          {/* Projects Section */}
          
            <Projects />
           

          {/* About Section */}
          
            <AboutUs />
           

          {/* Consultation Section */}
          {/* 
            <Consultation />
            */}

          {/* Services Section */}
          
            <Services />
           

          {/* Testimonials Section */}
          
            <Testimonials />
           

          {/* Partners Section */}
          
            <Partners />
           

          {/* Blog Section */}
          
            <Blog />
           

          {/* Contact Section */}
          
            <Contact />
           

          {/* FAQ Section */}
          
            <FAQ />
           
        </div>
<FeatureSection />
        {/* Footer Section */}
        <Footer />
      </main>
    </div>
  );
}