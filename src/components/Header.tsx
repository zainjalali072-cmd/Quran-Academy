import React, { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { academyContact } from "../data";
import logoImg from "../assets/images/truth_quran_logo_1784116839263.jpg";

interface HeaderProps {
  currentView: string;
  setView: (view: any) => void;
  onNavigate: (sectionId: string) => void;
}

export default function Header({ currentView, setView, onNavigate }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About Us", id: "about" },
    { label: "Courses", id: "courses" },
    { label: "Noorani Qaida", id: "noorani-qaida" },
    { label: "For Kids", id: "kids-classes" },
    { label: "Fee Plans", id: "fees" },
    { label: "Blog", id: "blog" },
    { label: "Contact Us", id: "contact" },
  ];

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    setView(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoClick = () => {
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-[#07080b]/80 backdrop-blur-md border-b border-[#d9b45c]/18 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Left */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center space-x-2.5 cursor-pointer select-none group"
          id="header-logo-container"
        >
          <div className="w-12 h-12 rounded-full border border-[#d9b45c]/40 flex items-center justify-center overflow-hidden bg-[#0e1015] shadow-[0_0_15px_rgba(217,180,92,0.15)] group-hover:border-[#d9b45c] transition-colors flex-shrink-0">
            <img 
              src={logoImg} 
              alt="Truth Quran Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-[1.08]" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-extrabold text-sm tracking-widest text-[#f3ecd8] uppercase">
              Truth <span className="text-[#d9b45c]">Quran</span>
            </span>
            <span className="font-serif italic text-[11px] text-[#d9b45c] tracking-wider leading-none">
              Online Quran Academy
            </span>
          </div>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-7" id="desktop-nav">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="text-xs font-sans font-semibold text-[#c9c2ab] hover:text-[#f2d98a] tracking-wider uppercase transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA (Desktop) */}
        <div className="hidden lg:flex items-center space-x-4" id="desktop-cta">
          <button
            onClick={() => handleLinkClick("contact")}
            className="px-5 py-2.5 rounded-full border border-[#d9b45c]/30 text-xs font-sans font-semibold text-[#f3ecd8] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c] transition-all duration-300 cursor-pointer"
          >
            Enquire
          </button>
          <a
            href={`${academyContact.whatsapp}?text=Salam,%20I%20would%20like%20to%20register%20for%20a%20Free%20Trial%20at%20Truth%20Quran%20Academy.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-xs font-sans font-extrabold text-[#07080b] shadow-[0_4px_15px_rgba(217,180,92,0.3)] hover:shadow-[0_4px_25px_rgba(217,180,92,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-1"
          >
            <span>Free Trial</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-[#f3ecd8] hover:text-[#d9b45c] transition-colors cursor-pointer"
          aria-label="Toggle Menu"
          id="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden w-full bg-[#0e1015] border-b border-[#d9b45c]/18 py-6 px-6 absolute top-20 left-0 shadow-xl transition-all duration-300 z-50"
          id="mobile-dropdown-panel"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-left py-2 font-sans font-semibold text-[#c9c2ab] hover:text-[#f2d98a] tracking-wider uppercase text-sm transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-[#d9b45c]/10 flex flex-col space-y-3">
              <button
                onClick={() => handleLinkClick("contact")}
                className="w-full text-center py-3 rounded-full border border-[#d9b45c]/30 text-sm font-sans font-semibold text-[#f3ecd8] hover:bg-[#d9b45c]/10 transition-colors"
              >
                Enquire
              </button>
              <a
                href={`${academyContact.whatsapp}?text=Salam,%20I%20would%20like%20to%20register%20for%20a%20Free%20Trial%20at%20Truth%20Quran%20Academy.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 rounded-full bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-sm font-sans font-extrabold text-[#07080b] shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Free Trial</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
