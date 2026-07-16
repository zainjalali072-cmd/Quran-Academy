import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Award, 
  Shield, 
  Calendar, 
  UserCheck, 
  Star, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ArrowUpRight,
  BookOpen,
  HelpCircle,
  GraduationCap
} from "lucide-react";

import { 
  academyContact, 
  coursesData, 
  whyUsData, 
  processSteps, 
  pricingPlans, 
  testimonialsData 
} from "./data";

import Header from "./components/Header";
import Starfield from "./components/Starfield";
import WhatsAppModal from "./components/WhatsAppModal";
import logoImg from "./assets/images/truth_quran_logo_1784116839263.jpg";
import kidsLearningBg from "./assets/images/kids_quran_learning_1784116863937.jpg";
import teacherBg from "./assets/images/online_quran_teacher_1784116886285.jpg";
import FAQAccordion from "./components/FAQAccordion";
import ContactForm from "./components/ContactForm";
import DeveloperCard from "./components/DeveloperCard";
import Footer from "./components/Footer";
import AutoOpeningQuran from "./components/AutoOpeningQuran";
import BlogSection from "./components/BlogSection";

import AboutPage from "./components/AboutPage";
import CoursesPage from "./components/CoursesPage";
import NooraniQaidaPage from "./components/NooraniQaidaPage";
import KidsClassesPage from "./components/KidsClassesPage";
import FeesPage from "./components/FeesPage";
import ContactPage from "./components/ContactPage";

// Simple custom count-up component using React state and native frame scheduler
function CountUpNumber({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function App() {
  const [currentView, setView] = useState<string>("home");
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // In-page navigation helper
  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07080b] text-[#f3ecd8] font-sans selection:bg-[#d9b45c] selection:text-[#07080b]">
      
      {/* 1. Global Translucent Twinkling Starfield Background */}
      <Starfield />

      {/* 2. Translucent Translucent Header */}
      <Header 
        currentView={currentView} 
        setView={setView} 
        onNavigate={handleScrollToSection} 
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        
        {currentView === "home" && (
          <>
            {/* HERO SECTION */}
            <section 
              id="hero" 
              className="hero-section-bg pt-10 pb-20 md:py-28 overflow-hidden flex items-center min-h-[calc(100vh-80px)]"
            >
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
                
                {/* Left Column: Text & Stats */}
                <div className="lg:col-span-7 space-y-8 text-left" id="hero-left-content">
                  
                  {/* Eyebrow kicker label */}
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9b45c] animate-ping" />
                    <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                      Premium 1-on-1 Online Quranic Academy
                    </span>
                  </div>

                  {/* Headline with serif and custom gold italicized word */}
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#f3ecd8] font-medium leading-[1.1] tracking-tight">
                    Embark on a Spiritual <br />
                    Journey with <span className="text-[#d9b45c] italic font-normal font-serif">Divine</span> Precision
                  </h1>

                  {/* Supporting paragraph */}
                  <p className="text-xs md:text-sm lg:text-base text-[#c9c2ab] leading-relaxed max-w-xl font-light">
                    Learn Holy Quran recitation, Tajweed, Hifz, and Arabic language from native certified Arab tutors in private 1-on-1 virtual classrooms. Structured curriculums tailored perfectly for children, sisters, and busy professionals.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    {/* Primary Green WhatsApp CTA */}
                    <a
                      href={`${academyContact.whatsapp}?text=Salam,%20I%20would%20like%20to%20register%20for%20a%20Free%20Trial%20at%20Truth%20Quran%20Academy.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-6 py-4 rounded-full bg-[#1fae5b] text-white text-xs md:text-sm font-sans font-extrabold uppercase tracking-wider shadow-[0_8px_20px_rgba(31,174,91,0.35)] hover:shadow-[0_8px_30px_rgba(31,174,91,0.55)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <MessageCircle size={18} className="fill-current" />
                      <span>Book Free Trial Session</span>
                    </a>

                    {/* Secondary Outline CTA */}
                    <button
                      onClick={() => handleScrollToSection("courses")}
                      className="px-6 py-4 rounded-full border border-[#d9b45c]/30 text-xs md:text-sm font-sans font-bold uppercase tracking-wider text-[#f3ecd8] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c] transition-all duration-300 cursor-pointer"
                    >
                      Explore Courses
                    </button>
                  </div>

                  {/* Divider line */}
                  <div className="w-full h-[1px] bg-[#d9b45c]/15 pt-2" />

                  {/* Stat Badges Count-Up */}
                  <div className="grid grid-cols-3 gap-4" id="hero-stat-badges">
                    <div className="bg-[#12141b]/40 border border-[#d9b45c]/10 rounded-2xl p-4 text-center">
                      <div className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-[#f2d98a]">
                        <CountUpNumber end={5000} suffix="+" />
                      </div>
                      <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#c9c2ab] mt-1 font-semibold">
                        Students Taught
                      </div>
                    </div>

                    <div className="bg-[#12141b]/40 border border-[#d9b45c]/10 rounded-2xl p-4 text-center">
                      <div className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-[#f2d98a]">
                        <CountUpNumber end={45} suffix="+" />
                      </div>
                      <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#c9c2ab] mt-1 font-semibold">
                        Certified Tutors
                      </div>
                    </div>

                    <div className="bg-[#12141b]/40 border border-[#d9b45c]/10 rounded-2xl p-4 text-center">
                      <div className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-[#f2d98a]">
                        <CountUpNumber end={99} suffix=".6%" />
                      </div>
                      <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#c9c2ab] mt-1 font-semibold">
                        Success Rate
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Auto-Opening Holy Quran with Rotating Surah Al-Ikhlas */}
                <div className="lg:col-span-5 flex justify-center items-center relative" id="hero-right-visual">
                  <div className="relative w-full aspect-square max-w-[26rem] md:max-w-[30rem] flex items-center justify-center">
                    <AutoOpeningQuran />
                  </div>
                </div>

              </div>
            </section>

            {/* ARABIC VERSE TICKER */}
            <div className="w-full bg-[#0e1015] border-y border-[#d9b45c]/18 py-4 overflow-hidden relative select-none">
              <div className="flex animate-marquee-loop whitespace-nowrap items-center space-x-12">
                
                {/* Text Block repeated for infinite loop */}
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-12 flex-shrink-0">
                    <span className="font-arabic text-[#f2d98a] text-lg md:text-xl font-bold">
                      وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ
                    </span>
                    <span className="text-xs md:text-sm font-serif text-[#f3ecd8] italic">
                      "And We have indeed made the Quran easy to understand and remember..." — Surah Al-Qamar, 54:17
                    </span>
                    <span className="text-[#d9b45c] text-sm">✦</span>
                    
                    <span className="font-arabic text-[#f2d98a] text-lg md:text-xl font-bold">
                      أَوْ زِدْ عَلَيْهِ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
                    </span>
                    <span className="text-xs md:text-sm font-serif text-[#f3ecd8] italic">
                      "And recite the Quran with measured, beautiful recitation (Tajweed)." — Surah Al-Muzzammil, 73:4
                    </span>
                    <span className="text-[#d9b45c] text-sm">✦</span>
                  </div>
                ))}

              </div>
            </div>

            {/* WHY CHOOSE US */}
            <section id="why-us" className="why-us-section-bg border-y border-[#d9b45c]/10">
              <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
                {/* Decorative side blurs */}
                <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#d9b45c]/3 blur-[120px] pointer-events-none rounded-full" />
                <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#d9b45c]/3 blur-[120px] pointer-events-none rounded-full" />

                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 relative z-10">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
                    Our Uncompromising Standards
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl text-[#f3ecd8] font-medium tracking-tight leading-[1.15]">
                    Why Families Choose <br />
                    <span className="text-[#d9b45c] italic font-normal">Truth Quran Academy</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed max-w-lg mx-auto">
                    We blend traditional Al-Azhar pedagogical values with cutting-edge global streaming software, ensuring comfortable, safe, and elite lessons for your household.
                  </p>
                </div>

                {/* 4-Column Responsive Bento-Style Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10" id="why-us-grid">
                  {whyUsData.map((item, index) => {
                    let IconComp = Award;
                    if (item.iconName === "UserCheck") IconComp = UserCheck;
                    if (item.iconName === "Shield") IconComp = Shield;
                    if (item.iconName === "Calendar") IconComp = Calendar;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-[#12141b]/70 border border-[#d9b45c]/15 rounded-2xl p-6 text-left hover:border-[#d9b45c]/50 hover:shadow-[0_20px_45px_rgba(217,180,92,0.1)] transition-all duration-300 group flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          {/* Beautiful Badge with Glow */}
                          <div className="w-12 h-12 rounded-xl bg-[#0e1015] border border-[#d9b45c]/20 flex items-center justify-center text-[#d9b45c] mb-6 group-hover:bg-[#d9b45c] group-hover:text-[#07080b] group-hover:border-[#d9b45c] transition-all duration-300 relative overflow-hidden shadow-inner">
                            {/* Halo effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#d9b45c]/5 to-transparent pointer-events-none" />
                            <IconComp size={20} className="relative z-10" />
                          </div>
                          
                          {/* Title */}
                          <h3 className="font-sans font-bold text-sm md:text-base text-[#f3ecd8] group-hover:text-[#f2d98a] transition-colors">
                            {item.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-xs text-[#c9c2ab] mt-3 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Small visual card footer dot */}
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d9b45c]/20 group-hover:bg-[#d9b45c] transition-colors mt-6" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* COURSES SECTION */}
            <section id="courses" className="courses-section-bg py-20 md:py-28 border-y border-[#d9b45c]/12">
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                    Curriculums
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                    Our Structured <span className="text-[#d9b45c] italic font-normal">Quran Programs</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                    Designed by Al-Azhar pedagogical specialists, our courses cater to absolute beginners taking their first phonetics steps, up to students seeking complete Ijazah.
                  </p>
                </div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="courses-grid">
                  {coursesData.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      className="bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl overflow-hidden hover:border-[#d9b45c]/45 hover:shadow-[0_25px_50px_rgba(217,180,92,0.1)] transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Media Area with Image & Radial Gold Glow */}
                      <div className="h-44 bg-[#07080b] relative flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                        
                        {/* Course Image Background */}
                        <img 
                          src={course.image} 
                          alt={course.title}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                        />
                        
                        {/* Glowing backdrop & overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] via-[#07080b]/65 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,180,92,0.15)_0%,transparent_85%)] pointer-events-none" />
                        
                        {/* Uppercase difficulty tag pill */}
                        <span className="absolute top-4 right-4 text-[9px] font-sans uppercase font-bold text-[#d9b45c] bg-[#07080b]/80 border border-[#d9b45c]/35 px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
                          {course.difficulty}
                        </span>

                        {/* Large Arabic Calligraphic Glyph representative */}
                        <div className="font-arabic text-[#d9b45c] text-5xl font-bold tracking-widest drop-shadow-[0_4px_15px_rgba(217,180,92,0.4)] group-hover:scale-110 transition-transform duration-500 relative z-10">
                          {course.arabicGlyph}
                        </div>
                        
                        <span className="absolute bottom-4 left-4 text-[9px] font-sans uppercase tracking-widest font-bold text-[#f3ecd8] bg-[#07080b]/60 px-2 py-0.5 rounded border border-[#d9b45c]/10 backdrop-blur-xs z-10">
                          {course.tag}
                        </span>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-6 space-y-3 text-left">
                        <h3 className="font-sans font-bold text-base md:text-lg text-[#f3ecd8] group-hover:text-[#f2d98a] transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-[#c9c2ab] leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      {/* Card Buttons */}
                      <div className="px-6 pb-6 pt-3 border-t border-[#d9b45c]/8 grid grid-cols-2 gap-3">
                        <a
                          href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20enroll%20in%20the%20${encodeURIComponent(course.title)}%20course%20at%20Truth%20Quran%20Academy.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#07080b] hover:shadow-[0_4px_15px_rgba(217,180,92,0.3)] transition-all flex items-center justify-center space-x-1"
                        >
                          <span>Enroll</span>
                        </a>

                        <a
                          href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20request%20a%20Free%20Trial%20lesson%20for%20the%20${encodeURIComponent(course.title)}%20program.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center py-2.5 rounded-full border border-[#d9b45c]/20 text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#c9c2ab] hover:bg-[#d9b45c]/8 hover:border-[#d9b45c] hover:text-[#f3ecd8] transition-all flex items-center justify-center"
                        >
                          <span>Trial</span>
                        </a>
                      </div>

                    </motion.div>
                  ))}
                </div>

              </div>
            </section>

            {/* PROCESS SECTION */}
            <section id="process" className="process-section-bg border-y border-[#d9b45c]/10">
              <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
                
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                    Your Roadmap
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                    How Our Online Academy <span className="text-[#d9b45c] italic font-normal">Works</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                    Start learning from anywhere globally in 4 elementary steps. No physical files, fully digital synchronization.
                  </p>
                </div>

                {/* 4-Step Process Grid connected by thin gold gradient line */}
                <div className="relative" id="process-steps-container">
                  
                  {/* Connecting Line (Desktop Only) */}
                  <div className="hidden lg:block absolute top-14 left-16 right-16 h-[1.5px] bg-gradient-to-r from-[#d9b45c]/5 via-[#d9b45c]/35 to-[#d9b45c]/5 z-0" />

                  {/* Steps Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10" id="process-row">
                    {processSteps.map((step, index) => (
                      <motion.div
                        key={step.stepNumber}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.12 }}
                        className="text-left space-y-4"
                      >
                        {/* Number Circle */}
                        <div className="w-16 h-16 rounded-full bg-[#0e1015] border-2 border-[#d9b45c] flex items-center justify-center shadow-[0_0_20px_rgba(217,180,92,0.15)] relative">
                          <span className="font-serif text-[#f2d98a] font-bold text-xl">
                            0{step.stepNumber}
                          </span>
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                          <h3 className="font-sans font-bold text-sm md:text-base text-[#f3ecd8]">
                            {step.title}
                          </h3>
                          <p className="text-xs text-[#c9c2ab] leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                      </motion.div>
                    ))}
                  </div>

                </div>
              </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="pricing-section-bg py-20 md:py-28 border-y border-[#d9b45c]/12 relative">
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                    Investment Plans
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                    Affordable <span className="text-[#d9b45c] italic font-normal">Monthly Tuition</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                    No long-term contracts. Choose the monthly commitment that perfectly aligns with your schedule and budget.
                  </p>
                </div>

                {/* 3-Column Price Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start" id="pricing-grid">
                  {pricingPlans.map((plan, index) => {
                    const isPopular = plan.isPopular;
                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: isPopular ? -20 : -8, scale: 1.025, transition: { duration: 0.25 } }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`rounded-3xl p-6 md:p-8 text-left transition-all duration-300 relative ${
                          isPopular
                            ? "bg-[#12141b] border-2 border-[#d9b45c] shadow-[0_25px_50px_rgba(217,180,92,0.2)] lg:-translate-y-4"
                            : "bg-[#12141b]/70 border border-[#d9b45c]/15 shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
                        }`}
                      >
                        {/* Ribbon Badge for Popular Plan */}
                        {isPopular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] font-sans font-extrabold text-[9px] uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                            Most Popular Plan
                          </span>
                        )}

                        <div className="space-y-4">
                          {/* Plan Name */}
                          <h3 className="font-sans font-bold text-sm md:text-base text-[#c9c2ab] uppercase tracking-wider">
                            {plan.name}
                          </h3>

                          {/* Price */}
                          <div className="flex items-baseline">
                            <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#f3ecd8] font-bold">
                              {plan.price}
                            </span>
                            <span className="font-sans text-xs text-[#c9c2ab] ml-2">
                              /{plan.period}
                            </span>
                          </div>

                          <div className="w-full h-[1px] bg-[#d9b45c]/10 my-2" />

                          {/* Features List */}
                          <ul className="space-y-3" id={`features-${plan.id}`}>
                            {plan.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start space-x-3 text-xs text-[#c9c2ab] leading-relaxed">
                                <Check size={14} className="text-[#d9b45c] mt-0.5 flex-shrink-0" />
                                <span className="select-none">{feat}</span>
                              </li>
                            ))}
                          </ul>

                          {/* CTA Button */}
                          <div className="pt-4">
                            <a
                              href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20register%20for%20the%20${encodeURIComponent(plan.name)}%20fee%20plan%20at%20Truth%20Quran%20Academy.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center space-x-2 transition-all duration-300 ${
                                isPopular
                                  ? "bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] shadow-[0_4px_15px_rgba(217,180,92,0.3)] hover:shadow-[0_4px_25px_rgba(217,180,92,0.5)] hover:-translate-y-0.5"
                                  : "border border-[#d9b45c]/30 text-[#f3ecd8] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c]"
                              }`}
                            >
                              <span>Enroll Under This Plan</span>
                            </a>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Subtext Disclaimer */}
                <p className="text-[10px] md:text-xs text-[#c9c2ab] text-center mt-12 max-w-lg mx-auto select-none leading-relaxed">
                  * Customs slots and multi-student sibling discounts are available upon request. Please connect with the coordination desk to customize your schedule.
                </p>

              </div>
            </section>

            {/* TESTIMONIALS */}
            <section id="reviews" className="reviews-section-bg py-20 md:py-28 overflow-hidden border-y border-[#d9b45c]/12">
              
              {/* Centered Heading */}
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                  Global Voices
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                  What Our <span className="text-[#d9b45c] italic font-normal">Students Say</span>
                </h2>
                <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                  Empowering thousands of believers across USA, UK, Canada, Australia, and Western Europe to master recitation elegantly.
                </p>
              </div>

              {/* Infinite Auto-scrolling Testimonials Marquee Track (pure CSS marquee loop) */}
              <div className="w-full relative hover-pause py-4">
                <div className="flex animate-marquee-loop whitespace-nowrap space-x-6">
                  
                  {/* Duplicated track to loop perfectly seamless */}
                  {Array.from({ length: 2 }).map((_, trackIdx) => (
                    <div key={trackIdx} className="flex space-x-6 flex-shrink-0">
                      {testimonialsData.map((testimonial) => (
                        <div
                          key={`${testimonial.id}-${trackIdx}`}
                          className="inline-block w-[320px] md:w-[380px] bg-[#12141b]/70 border border-[#d9b45c]/10 rounded-2xl p-6 whitespace-normal text-left select-none"
                        >
                          {/* 5-Star Row */}
                          <div className="flex items-center space-x-1 text-[#f2d98a] mb-4">
                            {Array.from({ length: testimonial.rating }).map((_, starIdx) => (
                              <Star key={starIdx} size={14} className="fill-current" />
                            ))}
                          </div>

                          {/* Quote */}
                          <p className="text-xs md:text-sm text-[#c9c2ab] italic leading-relaxed min-h-[72px]">
                            "{testimonial.quote}"
                          </p>

                          {/* Author line */}
                          <div className="border-t border-[#d9b45c]/10 pt-4 mt-4 flex items-center justify-between">
                            <span className="font-sans font-bold text-xs text-[#f3ecd8]">
                              {testimonial.name}
                            </span>
                            <span className="text-[10px] font-sans font-semibold text-[#d9b45c]">
                              {testimonial.country}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                </div>
              </div>
            </section>

            {/* ACADEMY BLOG SECTION (Archive Mode) */}
            <section id="blog" className="blog-section-bg py-20 md:py-28 border-y border-[#d9b45c]/12">
              <div className="max-w-7xl mx-auto px-6">
                
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                    Education & Insights
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                    The Academy <span className="text-[#d9b45c] italic font-normal">Insights Blog</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                    Read professional guide articles on Tajweed mechanics, traditional Hifz strategies, and classical Arabic linguistic studies.
                  </p>
                </div>

                {/* Interactive Blog Component (handles category filtering & navigation) */}
                <BlogSection
                  currentView={currentView}
                  setView={setView}
                  activePostId={activePostId}
                  setActivePostId={setActivePostId}
                />

              </div>
            </section>

            {/* GENERAL FAQ SECTION */}
            <section id="faq" className="faq-section-bg border-y border-[#d9b45c]/10">
              <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
                
                {/* Centered Heading */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                  <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
                    Got Questions?
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                    Frequently Asked <span className="text-[#d9b45c] italic font-normal">Questions</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                    Clear, objective answers detailing global class delivery, tutoring standards, and secure cancellation rules.
                  </p>
                </div>

                {/* Interactive single-open accordion */}
                <FAQAccordion />

              </div>
            </section>

            {/* CTA BAND (Full Width Contrasting Gradient Band) */}
            <section className="contact-section-bg py-16 md:py-20 relative overflow-hidden border-y border-[#d9b45c]/20">
              
              {/* Soft gold backdrop glow */}
              <div className="absolute inset-0 bg-[#d9b45c]/3 pointer-events-none filter blur-[80px]" />

              <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10" id="cta-band-content">
                <span className="text-[10px] md:text-[11px] font-sans uppercase font-extrabold tracking-[0.25em] text-[#d9b45c]">
                  Begin Your Journey
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#f3ecd8] font-medium tracking-tight leading-none">
                  Let Us Guide You Towards <br />
                  <span className="text-[#d9b45c] italic font-normal font-serif">Perfect Quranic Recitation</span>
                </h2>
                <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed max-w-xl mx-auto">
                  Take a risk-free 30-minute evaluation class today. We evaluate pronunciation, formulate a customized path, and match you with native instructors.
                </p>

                {/* Buttons row */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                  <a
                    href={`${academyContact.whatsapp}?text=Salam!%20I%20would%20like%20to%20register%20for%20a%20Free%20Evaluation%20Class%20at%20Truth%20Quran%20Academy.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-4 rounded-full bg-[#1fae5b] text-white text-xs md:text-sm font-sans font-extrabold uppercase tracking-wider shadow-[0_8px_20px_rgba(31,174,91,0.35)] hover:bg-[#1fae5b]/90 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <MessageCircle size={18} className="fill-current" />
                    <span>WhatsApp Trial Session</span>
                  </a>

                  <a
                    href={`tel:${academyContact.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center space-x-2 px-6 py-4 rounded-full border border-[#d9b45c]/30 text-xs md:text-sm font-sans font-bold uppercase tracking-wider text-[#f3ecd8] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Phone size={16} />
                    <span>Call Helpline Now</span>
                  </a>
                </div>
              </div>
            </section>

            {/* CONTACT SECTION (Two Column) */}
            <section id="contact" className="py-20 md:py-28 max-w-7xl mx-auto px-6">
              <ContactForm />
            </section>

            {/* DEVELOPER/BRANDING CARD */}
            <section className="py-12 md:py-16 bg-[#0e1015]/30 border-t border-[#d9b45c]/10">
              <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-sans uppercase font-bold tracking-[0.2em] text-[#d9b45c]">
                    Verified Developer Credential
                  </span>
                  <h3 className="font-serif text-2xl text-[#f3ecd8] font-medium tracking-tight">
                    Academy Platform <span className="text-[#d9b45c] italic font-normal">Architect</span>
                  </h3>
                </div>
                <DeveloperCard />
              </div>
            </section>
          </>
        )}

        {currentView === "about" && <AboutPage setView={setView} />}
        {currentView === "courses" && <CoursesPage />}
        {currentView === "noorani-qaida" && <NooraniQaidaPage />}
        {currentView === "kids-classes" && <KidsClassesPage />}
        {currentView === "fees" && <FeesPage />}
        {currentView === "blog" && (
          <div className="max-w-7xl mx-auto px-6 py-12 text-left space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
                Education & Insights
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight">
                The Academy <span className="text-[#d9b45c] italic font-normal">Insights Blog</span>
              </h2>
              <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
                Read professional guide articles on Tajweed mechanics, traditional Hifz strategies, and classical Arabic linguistic studies.
              </p>
            </div>
            <BlogSection
              currentView={currentView}
              setView={setView}
              activePostId={activePostId}
              setActivePostId={setActivePostId}
            />
          </div>
        )}
        {currentView === "contact" && <ContactPage />}
        {currentView === "blog-post" && (
          <div className="py-12 bg-[#07080b]">
            <BlogSection
              currentView={currentView}
              setView={setView}
              activePostId={activePostId}
              setActivePostId={setActivePostId}
            />
          </div>
        )}

      </main>

      {/* 15. Academy Footer */}
      <Footer 
        setView={setView} 
        onNavigate={handleScrollToSection} 
      />

      {/* 16. Floating WhatsApp Pulse Button & Modal */}
      <WhatsAppModal />

    </div>
  );
}
