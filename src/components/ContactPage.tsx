import React from "react";
import { motion } from "motion/react";
import { MapPin, Navigation, Sparkles } from "lucide-react";
import ContactForm from "./ContactForm";
import logoImg from "../assets/images/truth_quran_logo_1784116839263.jpg";

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-6 py-12 text-left space-y-16"
    >
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-5">
        <div className="flex justify-center mb-2">
          <div className="w-24 h-24 rounded-full border-2 border-[#d9b45c]/50 p-1 bg-[#0e1015] shadow-lg overflow-hidden">
            <img 
              src={logoImg} 
              alt="Truth Quran Academy Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full scale-[1.08]" 
            />
          </div>
        </div>
        <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/15 px-3 py-1 rounded-full">
          Reach Our Advisors
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#f3ecd8] font-medium tracking-tight">
          Let's Begin Your <br />
          <span className="text-[#d9b45c] italic font-normal">Spiritual Journey Today</span>
        </h1>
        <p className="text-xs md:text-sm text-[#c9c2ab] leading-relaxed">
          Book a free 1-on-1 evaluation, schedule your sibling-discount classes, or ask our Al-Azhar qualified scholars general questions. We respond within minutes!
        </p>
      </div>

      {/* Embedded Lead Form and Info Row */}
      <ContactForm />

      {/* Interactive Slate/Dark Google Maps Locator Fulfilling Requirement 4 */}
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[#d9b45c]">
            <MapPin size={18} />
            <h3 className="font-serif text-xl font-bold tracking-tight">Our Lahore Head Office</h3>
          </div>
          <p className="text-xs text-[#c9c2ab] max-w-xl">
            We are globally distributed online, with our pedagogical headquarters, teacher evaluation team, and digital servers based in Lahore, Pakistan.
          </p>
        </div>

        {/* Premium Dark Map Frame */}
        <div className="relative rounded-3xl overflow-hidden border border-[#d9b45c]/25 shadow-2xl h-96 w-full group">
          {/* Real iframe map pointing to Lahore Cantt, Pakistan */}
          <iframe
            src="https://maps.google.com/maps?q=Altaf%20Colony,%20Ranjar%20Head%20Quarter,%20Lahore%20Cantt,%20Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Truth Quran Academy Lahore Location"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />

          {/* Golden floating badge overlay */}
          <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-white border border-[#d9b45c]/40 backdrop-blur-md max-w-sm flex items-start space-x-3 shadow-md pointer-events-none">
            <div className="w-10 h-10 rounded-xl bg-[#d9b45c]/10 border border-[#d9b45c]/35 flex items-center justify-center text-[#d9b45c] flex-shrink-0">
              <Navigation size={18} className="animate-pulse" />
            </div>
            <div>
              <h5 className="font-sans font-bold text-xs text-[#1E1B15]">Global Admin Office</h5>
              <p className="text-[10px] text-[#5D5749] leading-relaxed mt-0.5">
                Altaf Colony, Ranjar Head Quarter, Lahore Cantt, Pakistan
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
