import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BookOpen, Calendar, Clock, ArrowLeft, ArrowRight, User, Tag, Sparkles } from "lucide-react";
import { blogPostsData } from "../data";
import { getCMSData } from "../cmsStore";

interface BlogSectionProps {
  currentView: string;
  setView: (view: string) => void;
  activePostId: string | null;
  setActivePostId: (id: string | null) => void;
}

export default function BlogSection({
  currentView,
  setView,
  activePostId,
  setActivePostId
}: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cms, setCms] = useState(getCMSData());

  useEffect(() => {
    const handleSync = () => setCms(getCMSData());
    window.addEventListener("cms_data_updated", handleSync);
    return () => window.removeEventListener("cms_data_updated", handleSync);
  }, []);

  const allPosts = (cms.blogPosts && cms.blogPosts.length > 0) ? cms.blogPosts : (cms.posts || blogPostsData);
  const currentPosts = allPosts.filter(p => !p.status || p.status === "published");

  const categories = ["All", ...Array.from(new Set(allPosts.map(p => p.category).filter(Boolean)))];

  // Handle post clicks
  const handlePostClick = (postId: string) => {
    setActivePostId(postId);
    setView("blog-post");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Back navigation
  const handleBackToBlog = () => {
    setActivePostId(null);
    setView("blog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render Single Full Blog Post View
  if (currentView === "blog-post" && activePostId) {
    const post = allPosts.find((p) => p.id === activePostId);
    if (!post) {
      return (
        <div className="text-center py-20">
          <p className="text-base text-[#c9c2ab]">Article not found.</p>
          <button 
            onClick={() => setView("blog")}
            className="mt-4 px-6 py-2.5 rounded-full bg-[#d9b45c] text-[#07080b] font-sans font-bold uppercase text-xs tracking-wider cursor-pointer"
          >
            Back to Blog
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-6 py-10" id="blog-post-content">
        {/* Back Button */}
        <button
          onClick={handleBackToBlog}
          className="inline-flex items-center space-x-2 text-xs font-sans font-bold uppercase tracking-wider text-[#d9b45c] hover:text-[#f3ecd8] transition-colors mb-8 cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </button>

        {/* Post Category Pill */}
        <div className="mb-4">
          <span className="inline-block text-[9px] font-sans uppercase font-bold text-[#d9b45c] bg-[#d9b45c]/10 border border-[#d9b45c]/25 px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Post Title */}
        <h1 className="font-serif text-3xl md:text-5xl text-[#f3ecd8] font-medium leading-[1.15] tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Author & Meta Row */}
        <div className="flex flex-wrap items-center gap-6 border-y border-[#d9b45c]/10 py-5 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border border-[#d9b45c]/30 overflow-hidden bg-[#0e1015]">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <div className="text-xs font-sans font-bold text-[#f3ecd8]">{post.author.name}</div>
              <div className="text-[10px] font-sans text-[#c9c2ab]">{post.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-sans text-[#c9c2ab] ml-auto">
            <span className="flex items-center space-x-1.5">
              <Calendar size={13} className="text-[#d9b45c]" />
              <span>{post.date}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#d9b45c]/30" />
            <span className="flex items-center space-x-1.5">
              <Clock size={13} className="text-[#d9b45c]" />
              <span>{post.readTime}</span>
            </span>
          </div>
        </div>

        {/* Rich Header Cover Image */}
        <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-[#d9b45c]/15 mb-10 shadow-lg relative">
          <img
            src={post.coverImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080b]/50 to-transparent" />
        </div>

        {/* Highlighted Arabic Verse block */}
        {post.arabicVerse && (
          <div className="bg-[#12141b]/90 border-l-4 border-[#d9b45c] rounded-r-2xl p-6 md:p-8 mb-10 relative overflow-hidden shadow-md text-left">
            <div className="absolute right-4 top-4 text-[#d9b45c]/5 pointer-events-none font-serif text-8xl leading-none">
              ✦
            </div>
            <div className="space-y-4">
              <div className="font-arabic text-[#f2d98a] text-xl md:text-2xl leading-relaxed text-right font-semibold">
                {post.arabicVerse.arabic}
              </div>
              <p className="text-xs md:text-sm text-[#f3ecd8] italic font-serif leading-relaxed">
                "{post.arabicVerse.translation}"
              </p>
              <div className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#d9b45c]">
                — {post.arabicVerse.citation}
              </div>
            </div>
          </div>
        )}

        {/* Post Body Text Content (Safely injected HTML) */}
        <div 
          className="prose prose-invert max-w-none text-xs md:text-sm lg:text-base text-[#c9c2ab] leading-relaxed space-y-6 text-left"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags Block */}
        <div className="flex flex-wrap items-center gap-2 pt-10 border-t border-[#d9b45c]/10 mt-12">
          <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#d9b45c] mr-2">
            Keywords:
          </span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-md bg-[#12141b] border border-[#d9b45c]/10 text-[10px] font-sans font-semibold text-[#c9c2ab]"
            >
              <Tag size={10} className="text-[#d9b45c]" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Filter logic
  const filteredPosts =
    selectedCategory === "All"
      ? currentPosts
      : currentPosts.filter((post) => post.category === selectedCategory);

  // Home View (Show latest 3 previews)
  if (currentView === "home") {
    return (
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="home-blog-grid">
          {currentPosts.slice(0, 3).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.25 } }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handlePostClick(post.id)}
              className="bg-[#12141b]/70 border border-[#d9b45c]/12 rounded-2xl overflow-hidden hover:border-[#d9b45c]/35 transition-all duration-300 flex flex-col h-full cursor-pointer group"
            >
              {/* Media Card Cover */}
              <div className="w-full aspect-[3/2] bg-[#07080b] relative overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12141b] via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-4 left-4 text-[9px] font-sans uppercase font-bold text-[#f2d98a] bg-[#07080b]/85 border border-[#d9b45c]/25 px-2.5 py-1 rounded-full z-10">
                  {post.category}
                </span>
              </div>

              {/* Content Card Panel */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[10px] font-sans text-[#c9c2ab]">
                    <span className="flex items-center space-x-1">
                      <Calendar size={11} className="text-[#d9b45c]" />
                      <span>{post.date}</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#d9b45c]/20" />
                    <span className="flex items-center space-x-1">
                      <Clock size={11} className="text-[#d9b45c]" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>
                  <h3 className="font-serif text-[#f3ecd8] group-hover:text-[#f2d98a] text-sm md:text-base font-medium tracking-tight leading-snug line-clamp-2 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#c9c2ab] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Card Button footer link */}
                <div className="pt-2 border-t border-[#d9b45c]/8 flex items-center justify-between">
                  <span className="text-[10px] font-sans uppercase font-extrabold tracking-widest text-[#d9b45c] group-hover:text-[#f2d98a] flex items-center space-x-1 transition-colors">
                    <span>Read Article</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] font-sans text-[#c9c2ab] italic">
                    By {post.author.name.split(" ").slice(-1)[0]}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={() => setView("blog")}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-[#d9b45c]/30 text-xs font-sans font-bold uppercase tracking-wider text-[#f3ecd8] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c] transition-all duration-300 cursor-pointer"
          >
            <span>View All Articles & Guides</span>
            <ArrowRight size={14} className="text-[#d9b45c]" />
          </button>
        </div>
      </div>
    );
  }

  // Blog Page View
  return (
    <div className="space-y-10" id="blog-page-panel">
      {/* Category Filter Pills Row */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-sans font-extrabold uppercase tracking-widest border transition-all duration-300 cursor-pointer ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] border-[#d9b45c] shadow-[0_4px_12px_rgba(217,180,92,0.25)]"
                : "bg-[#12141b]/60 text-[#c9c2ab] border-[#d9b45c]/15 hover:border-[#d9b45c]/40 hover:text-[#f3ecd8]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Full Grid Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-grid">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            onClick={() => handlePostClick(post.id)}
            className="bg-[#12141b]/70 border border-[#d9b45c]/12 rounded-2xl overflow-hidden hover:border-[#d9b45c]/35 transition-all duration-300 flex flex-col h-full cursor-pointer group"
          >
            {/* Media Card Cover */}
            <div className="h-48 bg-[#07080b] relative overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141b] via-transparent to-transparent pointer-events-none" />
              <span className="absolute top-4 left-4 text-[9px] font-sans uppercase font-bold text-[#f2d98a] bg-[#07080b]/85 border border-[#d9b45c]/25 px-2.5 py-1 rounded-full z-10">
                {post.category}
              </span>
            </div>

            {/* Content Card Panel */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-[10px] font-sans text-[#c9c2ab]">
                  <span className="flex items-center space-x-1">
                    <Calendar size={11} className="text-[#d9b45c]" />
                    <span>{post.date}</span>
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#d9b45c]/20" />
                  <span className="flex items-center space-x-1">
                    <Clock size={11} className="text-[#d9b45c]" />
                    <span>{post.readTime}</span>
                  </span>
                </div>
                <h3 className="font-serif text-[#f3ecd8] group-hover:text-[#f2d98a] text-sm md:text-base font-medium tracking-tight leading-snug line-clamp-2 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-[#c9c2ab] leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Card Button footer link */}
              <div className="pt-2 border-t border-[#d9b45c]/8 flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase font-extrabold tracking-widest text-[#d9b45c] group-hover:text-[#f2d98a] flex items-center space-x-1 transition-colors">
                  <span>Read Article</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] font-sans text-[#c9c2ab] italic">
                  By {post.author.name}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-sm text-[#c9c2ab]">No articles found in this category.</p>
        </div>
      )}
    </div>
  );
}
