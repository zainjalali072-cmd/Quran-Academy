import React, { useState } from "react";
import { BookOpen, Calendar, Clock, ArrowLeft, MessageCircle, ArrowRight, Sparkles, User } from "lucide-react";
import { academyContact, blogPostsData } from "../data";
import { BlogPost } from "../types";

interface BlogSectionProps {
  currentView: "home" | "blog-post";
  setView: (view: "home" | "blog-post") => void;
  activePostId: string | null;
  setActivePostId: (id: string | null) => void;
}

export default function BlogSection({
  currentView,
  setView,
  activePostId,
  setActivePostId,
}: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Quran Memorization Tips", "Tajweed Rules", "Parenting", "Islamic Studies"];

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === "All"
      ? blogPostsData
      : blogPostsData.filter((post) => post.category === selectedCategory);

  // Get active post object if any
  const activePost = blogPostsData.find((post) => post.id === activePostId);

  const handleReadMore = (id: string) => {
    setActivePostId(id);
    setView("blog-post");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToArchive = () => {
    setView("home");
    setActivePostId(null);
    // Smooth scroll down to the blog section on the home page
    setTimeout(() => {
      const el = document.getElementById("blog");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  if (currentView === "blog-post" && activePost) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-left" id="single-blog-post-view">
        {/* Breadcrumbs */}
        <nav className="text-xs font-sans font-semibold text-[#c9c2ab] tracking-wider uppercase flex items-center space-x-2 select-none mb-6">
          <button onClick={handleBackToArchive} className="hover:text-[#f2d98a] transition-colors cursor-pointer">
            Home
          </button>
          <span>/</span>
          <button onClick={handleBackToArchive} className="hover:text-[#f2d98a] transition-colors cursor-pointer">
            Blog
          </button>
          <span>/</span>
          <span className="text-[#f2d98a] font-bold truncate max-w-[200px] md:max-w-none">
            {activePost.title}
          </span>
        </nav>

        {/* Back Button */}
        <button
          onClick={handleBackToArchive}
          className="inline-flex items-center space-x-2 text-xs font-sans font-bold text-[#d9b45c] hover:text-[#f2d98a] uppercase tracking-wider mb-8 cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Blog Archive</span>
        </button>

        {/* 2-Column Article Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Article Column */}
          <article className="lg:col-span-8 space-y-6" id="blog-article-content">
            
            {/* Category Pill */}
            <span className="inline-block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#d9b45c] bg-[#d9b45c]/8 border border-[#d9b45c]/20 px-3 py-1 rounded-full">
              {activePost.category}
            </span>

            {/* Article Heading */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#f3ecd8] font-bold leading-tight tracking-tight">
              {activePost.title}
            </h1>

            {/* Author Row */}
            <div className="flex items-center space-x-4 border-y border-[#d9b45c]/12 py-4">
              <div className="w-11 h-11 rounded-full border border-[#d9b45c]/30 overflow-hidden bg-zinc-900">
                <img
                  src={activePost.author.avatar}
                  alt={activePost.author.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h5 className="font-sans font-bold text-xs text-[#f3ecd8]">
                  {activePost.author.name}
                </h5>
                <p className="text-[10px] text-[#c9c2ab] mt-0.5">
                  {activePost.author.role}
                </p>
              </div>
              <div className="flex items-center space-x-4 text-[10px] text-[#c9c2ab] font-sans font-semibold tracking-wider uppercase">
                <span className="flex items-center space-x-1">
                  <Calendar size={12} className="text-[#d9b45c]" />
                  <span>{activePost.date}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock size={12} className="text-[#d9b45c]" />
                  <span>{activePost.readTime}</span>
                </span>
              </div>
            </div>

            {/* Real high-quality cover image with verse text beautifully overlayed as a glass card or side-by-side */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#d9b45c]/20 shadow-2xl group" style={{ minHeight: '340px' }}>
              <img
                src={activePost.coverImage}
                alt={activePost.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay with elegant gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-black/40 to-black/30" />
              
              {/* Overlay Glass Card showing the Arabic Verse */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-black/60 border border-[#d9b45c]/20 backdrop-blur-md max-w-2xl space-y-2">
                <div className="font-arabic text-lg md:text-2xl text-[#f2d98a] font-bold leading-relaxed select-text">
                  {activePost.arabicVerse?.arabic}
                </div>
                <div className="text-xs text-[#c9c2ab] select-text">
                  "{activePost.arabicVerse?.translation}"
                </div>
                <div className="text-[10px] font-sans font-bold tracking-widest text-[#d9b45c] uppercase">
                  — {activePost.arabicVerse?.citation}
                </div>
              </div>
            </div>

            {/* Article Body (renders formatted HTML safely) */}
            <div 
              className="prose prose-invert max-w-none text-xs md:text-sm text-[#c9c2ab] leading-relaxed space-y-6 select-text
                prose-headings:font-serif prose-headings:text-[#f3ecd8] prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
                prose-h3:text-lg md:prose-h3:text-xl
                prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-3
                prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-3
                prose-blockquote:border-l-4 prose-blockquote:border-[#d9b45c] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-6 prose-blockquote:bg-[#0e1015]/80 prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:rounded-r-xl prose-blockquote:text-[#f2d98a]"
              dangerouslySetInnerHTML={{ __html: activePost.content }}
            />

            {/* Topics/Tags Section */}
            <div className="border-t border-[#d9b45c]/12 pt-6">
              <h5 className="font-sans font-bold text-xs text-[#f3ecd8] uppercase tracking-wider mb-3">
                Related Topics:
              </h5>
              <div className="flex flex-wrap gap-2">
                {activePost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-sans font-semibold text-[#c9c2ab] bg-[#0e1015] border border-[#d9b45c]/10 px-3 py-1.5 rounded-full select-none"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </article>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-8" id="blog-article-sidebar">
            
            {/* Widget 1: Author Bio Card */}
            <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5 text-left relative overflow-hidden">
              <h4 className="font-sans font-bold text-[10px] text-[#d9b45c] uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Sparkles size={10} />
                <span>About the Author</span>
              </h4>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full border border-[#d9b45c]/20 overflow-hidden">
                  <img
                    src={activePost.author.avatar}
                    alt={activePost.author.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="font-sans font-bold text-xs text-[#f3ecd8]">
                    {activePost.author.name}
                  </h5>
                  <p className="text-[10px] text-[#c9c2ab]">{activePost.author.role}</p>
                </div>
              </div>
              <p className="text-[11px] text-[#c9c2ab] leading-relaxed">
                A native scholar possessing credentials and Ijazah in classic Tajweed and Tafseer methodology. Regularly contributes articles on Islamic education and child rearing.
              </p>
            </div>

            {/* Widget 2: Recent Posts Widget */}
            <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5 text-left">
              <h4 className="font-sans font-bold text-[10px] text-[#d9b45c] uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Sparkles size={10} />
                <span>Recent Articles</span>
              </h4>
              <div className="space-y-4">
                {blogPostsData
                  .filter((post) => post.id !== activePost.id)
                  .map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handleReadMore(post.id)}
                      className="group flex items-start space-x-3 cursor-pointer"
                    >
                      {/* Small Thumbnail Image */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#d9b45c]/15 flex-shrink-0 group-hover:border-[#f2d98a] transition-all">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-sans font-bold text-[11px] text-[#f3ecd8] line-clamp-2 leading-tight group-hover:text-[#f2d98a] transition-colors">
                          {post.title}
                        </h5>
                        <p className="text-[9px] text-[#c9c2ab] mt-1 flex items-center gap-1">
                          <Calendar size={8} />
                          <span>{post.date}</span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Widget 3: WhatsApp Advisor Card */}
            <div className="bg-gradient-to-b from-[#12141b] to-[#0e1015] border border-[#d9b45c]/20 rounded-2xl p-6 text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1fae5b]/5 blur-2xl pointer-events-none" />
              <div className="w-10 h-10 rounded-full bg-[#1fae5b]/10 border border-[#1fae5b]/30 flex items-center justify-center text-[#5fe396] mb-4">
                <MessageCircle size={20} className="fill-[#1fae5b]/10" />
              </div>
              <h4 className="font-serif text-lg text-[#f3ecd8] font-bold tracking-tight">
                Have questions about this article?
              </h4>
              <p className="text-[11px] text-[#c9c2ab] mt-2 leading-relaxed">
                Connect with Sheikh Abdul Rahman or our course consultants on WhatsApp. Get answers immediately.
              </p>
              <div className="pt-4">
                <a
                  href={`${academyContact.whatsapp}?text=Salam!%20I%20have%20a%20question%20regarding%20the%20article%20"${encodeURIComponent(activePost.title)}"%20on%20your%20website.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-full bg-[#1fae5b] text-white text-[11px] font-sans font-bold hover:bg-[#1fae5b]/90 hover:scale-[1.02] transition-all"
                >
                  <span>Chat With Us</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>

          </aside>

        </div>
      </div>
    );
  }

  // Otherwise render Blog Archive
  return (
    <div className="space-y-10 text-left" id="blog-archive-view">
      
      {/* Category Filter Chips Row */}
      <div className="flex flex-wrap gap-2.5 justify-center md:justify-start" id="category-chips-row">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-sans font-bold text-[10px] md:text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] shadow-[0_4px_15px_rgba(217,180,92,0.25)]"
                  : "bg-[#0e1015]/60 border border-[#d9b45c]/12 text-[#c9c2ab] hover:text-[#f3ecd8] hover:border-[#d9b45c]/30"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 2-Column Archive Layout (Cards left, Sidebar right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Blog Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6" id="blog-archive-grid">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#12141b] border border-[#d9b45c]/12 rounded-2xl overflow-hidden hover:border-[#d9b45c]/35 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between group h-full"
            >
              <div>
                {/* Media area with real high-quality image */}
                <div className="h-48 bg-[#0e1015] border-b border-[#d9b45c]/10 relative select-none overflow-hidden group">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] via-transparent to-black/30" />
                  <span className="absolute bottom-3 left-4 text-[9px] font-sans uppercase font-semibold text-[#c9c2ab] bg-[#07080b]/90 border border-[#d9b45c]/20 px-2.5 py-1 rounded-full backdrop-blur-sm shadow-md">
                    {post.readTime}
                  </span>
                  {/* Subtle Arabic Verse Tag Overlaid */}
                  {post.arabicVerse && (
                    <span className="absolute top-3 right-4 font-arabic text-[10px] text-[#f2d98a] bg-black/70 px-2 py-0.5 rounded border border-[#d9b45c]/30 backdrop-blur-sm">
                      {post.arabicVerse.arabic.split(" ")[0]} ...
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3 text-left">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#d9b45c]">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-lg text-[#f3ecd8] font-bold tracking-tight line-clamp-2 leading-tight group-hover:text-[#f2d98a] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#c9c2ab] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-2 border-t border-[#d9b45c]/8 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full border border-[#d9b45c]/25 overflow-hidden">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-[#c9c2ab] font-medium">{post.author.name}</span>
                </div>

                <button
                  onClick={() => handleReadMore(post.id)}
                  className="text-[10px] font-sans font-extrabold text-[#d9b45c] hover:text-[#f2d98a] uppercase tracking-wider flex items-center space-x-1 group/btn"
                >
                  <span>Read More</span>
                  <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

            </article>
          ))}
        </div>

        {/* Right Column: Sidebar (Recent & Categories) */}
        <aside className="lg:col-span-4 space-y-8" id="blog-archive-sidebar">
          
          {/* Recent Posts widget */}
          <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5 text-left">
            <h4 className="font-sans font-bold text-[10px] text-[#d9b45c] uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Sparkles size={10} />
              <span>Recent Articles</span>
            </h4>
            <div className="space-y-4">
              {blogPostsData.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handleReadMore(post.id)}
                  className="group flex items-start space-x-3 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#d9b45c]/15 flex-shrink-0 group-hover:border-[#f2d98a] transition-all">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-sans font-bold text-[11px] text-[#f3ecd8] line-clamp-2 leading-tight group-hover:text-[#f2d98a] transition-colors">
                      {post.title}
                    </h5>
                    <p className="text-[9px] text-[#c9c2ab] mt-1 flex items-center gap-1">
                      <Calendar size={8} />
                      <span>{post.date}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories list widget */}
          <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5 text-left">
            <h4 className="font-sans font-bold text-[10px] text-[#d9b45c] uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Sparkles size={10} />
              <span>Categories</span>
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`text-xs flex items-center justify-between w-full text-[#c9c2ab] hover:text-[#f2d98a] transition-colors cursor-pointer ${
                      selectedCategory === cat ? "text-[#f2d98a] font-bold" : ""
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] text-[#c9c2ab]/50 bg-[#0e1015] px-2 py-0.5 rounded-full">
                      {cat === "All" ? blogPostsData.length : blogPostsData.filter(p => p.category === cat).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </aside>

      </div>

    </div>
  );
}
