import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from "lucide-react";
import { academyContact, coursesData } from "../data";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    country: "",
    course: "noorani-qaida",
    email: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Simple validation
    if (!formData.name || !formData.age || !formData.country || !formData.email) {
      setErrorMessage("Please fill in all fields before submitting.");
      return;
    }

    // Identify selected course title
    const selectedCourseObj = coursesData.find((c) => c.id === formData.course);
    const courseTitle = selectedCourseObj ? selectedCourseObj.title : formData.course;

    // Build pre-filled WhatsApp message
    const message = `Salam! I have submitted an enrollment inquiry on your website. Here are my details:\n\n👤 *Student Name:* ${formData.name}\n👶 *Student Age:* ${formData.age} years\n🌍 *Country:* ${formData.country}\n📚 *Selected Course:* ${courseTitle}\n✉️ *Email Address:* ${formData.email}\n\nPlease guide me regarding the trial session.`;
    
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `${academyContact.whatsapp}?text=${encoded}`;

    // Mark as submitted
    setIsSubmitted(true);

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="contact-grid">
      {/* Left Column: Contact Info */}
      <div className="lg:col-span-5 space-y-8 text-left" id="contact-info-panel">
        <div>
          <span className="text-[12px] font-sans uppercase font-bold tracking-[0.22em] text-[#d9b45c]">
            Get In Touch
          </span>
          <h3 className="font-serif text-3xl md:text-4xl text-[#f3ecd8] font-medium tracking-tight mt-2">
            Have Questions? <br />
            <span className="text-[#d9b45c] italic font-normal">Connect With Us Directly</span>
          </h3>
          <p className="text-xs md:text-sm text-[#c9c2ab] mt-4 leading-relaxed max-w-md">
            Our student coordination desk operates round-the-clock to assist global students. Whether you want to book a custom trial slot or have general inquiries, reach out using any channel below.
          </p>
        </div>

        {/* Info List */}
        <div className="space-y-5" id="contact-details-list">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-[#d9b45c]/8 border border-[#d9b45c]/20 flex items-center justify-center text-[#d9b45c] flex-shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <h5 className="font-sans font-bold text-xs text-[#f3ecd8] uppercase tracking-wider">Academy Location</h5>
              <p className="text-xs text-[#c9c2ab] mt-1 leading-normal">{academyContact.address}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-[#d9b45c]/8 border border-[#d9b45c]/20 flex items-center justify-center text-[#d9b45c] flex-shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <h5 className="font-sans font-bold text-xs text-[#f3ecd8] uppercase tracking-wider">Phone Helpline</h5>
              <p className="text-xs text-[#c9c2ab] mt-1 leading-normal">{academyContact.phone}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-[#d9b45c]/8 border border-[#d9b45c]/20 flex items-center justify-center text-[#d9b45c] flex-shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <h5 className="font-sans font-bold text-xs text-[#f3ecd8] uppercase tracking-wider">Official Email</h5>
              <p className="text-xs text-[#c9c2ab] mt-1 leading-normal">{academyContact.email}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-[#1fae5b]/10 border border-[#1fae5b]/20 flex items-center justify-center text-[#5fe396] flex-shrink-0">
              <MessageCircle size={18} className="fill-[#1fae5b]/10" />
            </div>
            <div>
              <h5 className="font-sans font-bold text-xs text-[#5fe396] uppercase tracking-wider">Secure WhatsApp</h5>
              <p className="text-xs text-[#c9c2ab] mt-1 leading-normal">Instant Reply: {academyContact.phone}</p>
            </div>
          </div>
        </div>

        {/* Big WhatsApp CTA Button */}
        <div className="pt-2">
          <a
            href={`${academyContact.whatsapp}?text=Salam!%20I%20have%20a%20question%20regarding%20Truth%20Quran%20Academy.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 px-6 py-4 rounded-full bg-[#1fae5b]/15 border border-[#1fae5b]/30 text-xs md:text-sm font-sans font-bold text-[#5fe396] hover:bg-[#1fae5b] hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(31,174,91,0.3)] transition-all duration-300"
          >
            <MessageCircle size={18} className="fill-current" />
            <span>Chat Securely on WhatsApp Now</span>
          </a>
        </div>
      </div>

      {/* Right Column: Lead Capture Form Card */}
      <div className="lg:col-span-7" id="contact-form-panel">
        <div className="bg-[#12141b] border border-[#d9b45c]/18 rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Subtle gold glow inside */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#d9b45c]/5 blur-[80px] pointer-events-none rounded-full" />

          {isSubmitted ? (
            <div className="text-center py-10 space-y-4" id="form-success-state">
              <div className="w-16 h-16 rounded-full bg-[#5fe396]/10 border border-[#5fe396]/30 flex items-center justify-center text-[#5fe396] mx-auto animate-bounce">
                <CheckCircle size={36} />
              </div>
              <h4 className="font-serif text-2xl text-[#f3ecd8] font-semibold tracking-tight">
                Inquiry Sent Successfully!
              </h4>
              <p className="text-xs md:text-sm text-[#c9c2ab] max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[#f2d98a]">{formData.name}</strong>. Your inquiry has been registered. We are now redirecting you to WhatsApp to instantly establish your chat connection with our academic advisor.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2.5 rounded-full border border-[#d9b45c]/30 text-xs font-sans text-[#c9c2ab] hover:text-[#f3ecd8] hover:border-[#d9b45c] transition-all"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-left" id="lead-capture-form">
              <div className="border-b border-[#d9b45c]/12 pb-4">
                <h4 className="font-serif text-lg md:text-xl text-[#f3ecd8] font-bold">
                  Schedule Your Free Trial Lesson
                </h4>
                <p className="text-[11px] md:text-xs text-[#c9c2ab] mt-1">
                  Fill in the secure credentials below. We immediately match you with an appropriate tutor.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/45 border border-red-500/30 text-red-200 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Student Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-[11px] font-sans font-bold text-[#c9c2ab] uppercase tracking-wider">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Zain Ali"
                    className="w-full bg-[#07080b] border border-[#d9b45c]/15 rounded-xl px-4 py-3.5 text-xs text-[#f3ecd8] placeholder-zinc-600 focus:outline-none focus:border-[#d9b45c] focus:ring-1 focus:ring-[#d9b45c] transition-colors"
                    required
                  />
                </div>

                {/* Student Age */}
                <div className="space-y-2">
                  <label htmlFor="age" className="block text-[11px] font-sans font-bold text-[#c9c2ab] uppercase tracking-wider">
                    Student Age (years) *
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 12"
                    min="4"
                    max="99"
                    className="w-full bg-[#07080b] border border-[#d9b45c]/15 rounded-xl px-4 py-3.5 text-xs text-[#f3ecd8] placeholder-zinc-600 focus:outline-none focus:border-[#d9b45c] focus:ring-1 focus:ring-[#d9b45c] transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Country */}
                <div className="space-y-2">
                  <label htmlFor="country" className="block text-[11px] font-sans font-bold text-[#c9c2ab] uppercase tracking-wider">
                    Your Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="e.g. United Kingdom"
                    className="w-full bg-[#07080b] border border-[#d9b45c]/15 rounded-xl px-4 py-3.5 text-xs text-[#f3ecd8] placeholder-zinc-600 focus:outline-none focus:border-[#d9b45c] focus:ring-1 focus:ring-[#d9b45c] transition-colors"
                    required
                  />
                </div>

                {/* Course Select */}
                <div className="space-y-2">
                  <label htmlFor="course" className="block text-[11px] font-sans font-bold text-[#c9c2ab] uppercase tracking-wider">
                    Select Quran Program
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/15 rounded-xl px-4 py-3.5 text-xs text-[#f3ecd8] focus:outline-none focus:border-[#d9b45c] focus:ring-1 focus:ring-[#d9b45c] transition-colors appearance-none cursor-pointer"
                  >
                    {coursesData.map((course) => (
                      <option key={course.id} value={course.id} className="bg-[#12141b] text-[#f3ecd8]">
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[11px] font-sans font-bold text-[#c9c2ab] uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. parent@example.com"
                  className="w-full bg-[#07080b] border border-[#d9b45c]/15 rounded-xl px-4 py-3.5 text-xs text-[#f3ecd8] placeholder-zinc-600 focus:outline-none focus:border-[#d9b45c] focus:ring-1 focus:ring-[#d9b45c] transition-colors"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] font-sans font-extrabold text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(217,180,92,0.35)] hover:shadow-[0_4px_30px_rgba(217,180,92,0.55)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send size={14} className="fill-current" />
                  <span>Submit Inquiry & Start Free Trial</span>
                </button>
              </div>

              <p className="text-[10px] text-[#c9c2ab] text-center select-none leading-relaxed">
                🔒 Your privacy is fully protected. By submitting this form, you authorize our admissions department to connect with you via email and secure WhatsApp chat.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
