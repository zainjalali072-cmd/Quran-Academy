import React from "react";
import { Phone, Mail, MessageCircle, Globe, Github, Sparkles } from "lucide-react";
import { academyContact } from "../data";

export default function DeveloperCard() {
  return (
    <div className="max-w-md mx-auto" id="developer-card-container">
      <div className="bg-gradient-to-br from-[#12141b] to-[#0e1015] border border-[#d9b45c]/25 rounded-2xl p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        
        {/* Decorative corner borders in luxury gold */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#d9b45c]/40 group-hover:border-[#f2d98a]/80 transition-colors" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#d9b45c]/40 group-hover:border-[#f2d98a]/80 transition-colors" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#d9b45c]/40 group-hover:border-[#f2d98a]/80 transition-colors" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#d9b45c]/40 group-hover:border-[#f2d98a]/80 transition-colors" />

        {/* Diagonal glare effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#d9b45c]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar with gold border */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d9b45c] to-[#f2d98a] rounded-full blur-[4px] opacity-40 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-20 h-20 rounded-full border-2 border-[#d9b45c] overflow-hidden bg-zinc-900">
              <img
                src={academyContact.developerAvatar}
                alt={academyContact.developerName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name & Title */}
          <div>
            <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#d9b45c] flex items-center justify-center gap-1">
              <Sparkles size={10} />
              <span>Academy Architect</span>
            </span>
            <h4 className="font-serif text-xl text-[#f3ecd8] font-bold tracking-tight mt-1">
              {academyContact.developerName}
            </h4>
            <p className="text-[11px] font-sans text-[#c9c2ab] mt-1 leading-normal">
              Senior Consultant at <span className="text-[#f2d98a] font-semibold">Truth Quran Academy</span>
            </p>
          </div>

          {/* Divider line */}
          <div className="w-2/3 h-[1px] bg-[#d9b45c]/15" />

          {/* Quick specs description */}
          <p className="text-[11px] text-[#c9c2ab] leading-relaxed max-w-xs select-none">
            Responsible for crafting full-stack educational platforms, traditional learning curricula, and secure communication systems.
          </p>

          {/* Contact Row Links */}
          <div className="flex items-center space-x-3 pt-2" id="developer-socials">
            <a
              href={`tel:${academyContact.phone.replace(/\s+/g, "")}`}
              className="w-8 h-8 rounded-full bg-[#07080b] border border-[#d9b45c]/15 flex items-center justify-center text-[#c9c2ab] hover:text-[#f2d98a] hover:border-[#f2d98a] hover:bg-[#d9b45c]/10 transition-all duration-200"
              title="Call Phone"
              aria-label="Call Developer"
            >
              <Phone size={14} />
            </a>
            <a
              href={`${academyContact.whatsapp}?text=Salam%20Abbas!%20I%20saw%20your%20developer%20card%20on%20Truth%20Quran%20Academy%20website.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#07080b] border border-[#d9b45c]/15 flex items-center justify-center text-[#c9c2ab] hover:text-[#5fe396] hover:border-[#1fae5b]/40 hover:bg-[#1fae5b]/10 transition-all duration-200"
              title="WhatsApp Chat"
              aria-label="WhatsApp Chat with Developer"
            >
              <MessageCircle size={14} />
            </a>
            <a
              href={`mailto:${academyContact.email}`}
              className="w-8 h-8 rounded-full bg-[#07080b] border border-[#d9b45c]/15 flex items-center justify-center text-[#c9c2ab] hover:text-[#f2d98a] hover:border-[#f2d98a] hover:bg-[#d9b45c]/10 transition-all duration-200"
              title="Send Email"
              aria-label="Email Developer"
            >
              <Mail size={14} />
            </a>
            <a
              href={academyContact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#07080b] border border-[#d9b45c]/15 flex items-center justify-center text-[#c9c2ab] hover:text-[#f2d98a] hover:border-[#f2d98a] hover:bg-[#d9b45c]/10 transition-all duration-200"
              title="Facebook Profile"
              aria-label="Developer Facebook"
            >
              <Globe size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
