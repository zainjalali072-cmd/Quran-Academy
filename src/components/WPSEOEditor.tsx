import React, { useState, useEffect, useMemo } from "react";
import { BlogPost } from "../types";
import { saveCMSData, CMSData } from "../cmsStore";
import { 
  Check, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Link2, 
  Code, 
  Share2, 
  Eye, 
  FileText, 
  ImageIcon, 
  Save, 
  Plus, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Clock, 
  User, 
  Tag, 
  Calendar, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Search, 
  HelpCircle, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  Quote, 
  Table, 
  Film, 
  Upload, 
  Crop, 
  RotateCcw, 
  RefreshCw, 
  Globe, 
  X, 
  FileDown, 
  CheckCircle2, 
  AlertCircle,
  Sliders,
  Maximize2
} from "lucide-react";

interface WPSEOEditorProps {
  cmsData: CMSData;
  onSave: (newData: CMSData) => void;
  externalPostId?: string | null;
}

export default function WPSEOEditor({ cmsData, onSave, externalPostId }: WPSEOEditorProps) {
  // 1. Post Selection State
  const posts = cmsData.blogPosts || [];
  const [selectedPostId, setSelectedPostId] = useState<string>(
    externalPostId || (posts.length > 0 ? posts[0].id : "")
  );

  useEffect(() => {
    if (externalPostId) {
      setSelectedPostId(externalPostId);
    } else if (posts.length > 0 && !selectedPostId) {
      setSelectedPostId(posts[0].id);
    }
  }, [externalPostId, posts]);

  // Current Post loaded
  const currentPostIndex = posts.findIndex((p) => p.id === selectedPostId);
  const activePost = currentPostIndex !== -1 ? posts[currentPostIndex] : posts[0] || null;

  // Local Editable Post State
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(activePost);

  useEffect(() => {
    if (activePost) {
      setCurrentPost({
        ...activePost,
        status: activePost.status || "published",
        metaTitle: activePost.metaTitle || activePost.title,
        metaDescription: activePost.metaDescription || activePost.excerpt,
        focusKeyword: activePost.focusKeyword || (activePost.tags && activePost.tags[0]) || "Tajweed",
        slug: activePost.slug || activePost.id,
        robotsMeta: activePost.robotsMeta || "index, follow",
        ogTitle: activePost.ogTitle || activePost.title,
        ogDescription: activePost.ogDescription || activePost.excerpt,
        ogImage: activePost.ogImage || activePost.coverImage,
        twitterTitle: activePost.twitterTitle || activePost.ogTitle || activePost.title,
        twitterDescription: activePost.twitterDescription || activePost.ogDescription || activePost.excerpt,
        twitterCard: activePost.twitterCard || "summary_large_image",
        imageAltText: activePost.imageAltText || `${activePost.title} banner`,
        imageTitle: activePost.imageTitle || `${activePost.title} image`,
        imageCaption: activePost.imageCaption || "",
        imageDescription: activePost.imageDescription || "",
        imageFileName: activePost.imageFileName || `${(activePost.slug || "image").toLowerCase()}.jpg`,
        internalLinksCount: activePost.internalLinksCount !== undefined ? activePost.internalLinksCount : 2,
        externalLinksCount: activePost.externalLinksCount !== undefined ? activePost.externalLinksCount : 1,
        schemaType: activePost.schemaType || "Article",
        customSchemaJson: activePost.customSchemaJson || JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": activePost.title,
          "description": activePost.excerpt,
          "author": {
            "@type": "Person",
            "name": activePost.author?.name || "Muhammad Zain"
          }
        }, null, 2)
      });
    }
  }, [selectedPostId, posts.length]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // View / Device mode (desktop, tablet, mobile, raw HTML)
  const [deviceFrame, setDeviceFrame] = useState<"desktop" | "tablet" | "mobile" | "raw">("desktop");

  // Accordions open states in sidebar
  const [expandedSections, setExpandedSections] = useState({
    meta: true,
    imageSeo: true,
    links: false,
    schema: false,
    social: false,
    publishing: false,
    revisions: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Modal Popups
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blockSearch, setBlockSearch] = useState("");
  const [showInternalLinkModal, setShowInternalLinkModal] = useState(false);
  const [internalLinkSearch, setInternalLinkSearch] = useState("");
  const [internalLinkTab, setInternalLinkTab] = useState<"posts" | "pages" | "courses" | "teachers" | "faqs">("posts");
  const [showImageCropModal, setShowImageCropModal] = useState(false);
  const [cropBrightness, setCropBrightness] = useState(100);
  const [cropContrast, setCropContrast] = useState(100);

  // Field updater
  const handleUpdateField = (field: keyof BlogPost, value: any) => {
    if (!currentPost) return;
    setCurrentPost((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // 2. Dynamic Real Content & SEO Analysis Engine
  const contentStats = useMemo(() => {
    if (!currentPost) return { words: 0, sentences: 0, paragraphs: 0, readingTime: "1 min" };
    const htmlContent = currentPost.content || "";
    const stripped = htmlContent.replace(/<[^>]*>/g, " ");
    const wordList = stripped.trim() ? stripped.trim().split(/\s+/).filter(Boolean) : [];
    const words = wordList.length;
    const sentenceList = stripped.split(/[.!?]+/).filter((s) => s.trim().length > 2);
    const sentences = sentenceList.length || 1;
    const pList = htmlContent.split(/<\/p>|<br\s*\/?>|\n\n+/).filter((p) => p.trim().length > 0);
    const paragraphs = pList.length || 1;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    return {
      words,
      sentences,
      paragraphs,
      readingTime: `${readTimeMinutes} min read`
    };
  }, [currentPost?.content]);

  // SEO Score calculation (Rank Math Pro style)
  const seoAnalysis = useMemo(() => {
    if (!currentPost) {
      return {
        score: 0,
        readability: 0,
        keywordDensity: 0,
        rules: [],
        passedCount: 0,
        recommendations: []
      };
    }

    const keyword = (currentPost.focusKeyword || "").trim().toLowerCase();
    const title = (currentPost.title || "").toLowerCase();
    const metaTitle = (currentPost.metaTitle || "").toLowerCase();
    const metaDesc = (currentPost.metaDescription || "").toLowerCase();
    const slug = (currentPost.slug || "").toLowerCase();
    const htmlContent = (currentPost.content || "").toLowerCase();
    const plainText = htmlContent.replace(/<[^>]*>/g, " ");
    
    const words = contentStats.words;
    const wordList = plainText.trim().split(/\s+/).filter(Boolean);

    let rules: Array<{ id: string; label: string; category: string; passed: boolean; feedback: string; points: number }> = [];

    // 1. Focus Keyword in Post Title
    const kwInTitle = keyword ? title.includes(keyword) || metaTitle.includes(keyword) : false;
    rules.push({
      id: "kw_title",
      label: "Focus Keyword in Title",
      category: "Basic SEO",
      passed: kwInTitle,
      feedback: kwInTitle ? "Focus keyword appears in the title." : "Add your focus keyword to the post title.",
      points: 15
    });

    // 2. Focus Keyword in Meta Description
    const kwInDesc = keyword ? metaDesc.includes(keyword) : false;
    rules.push({
      id: "kw_desc",
      label: "Focus Keyword in Meta Description",
      category: "Basic SEO",
      passed: kwInDesc,
      feedback: kwInDesc ? "Focus keyword found in meta description." : "Add your focus keyword to the meta description.",
      points: 12
    });

    // 3. Focus Keyword in URL / Slug
    const kwInSlug = keyword ? slug.includes(keyword.replace(/\s+/g, "-")) || slug.includes(keyword) : false;
    rules.push({
      id: "kw_slug",
      label: "Focus Keyword in Permalink Slug",
      category: "Basic SEO",
      passed: kwInSlug,
      feedback: kwInSlug ? "Permalink contains focus keyword." : "Include focus keyword in the URL slug.",
      points: 10
    });

    // 4. Focus Keyword in first 10% of content
    const firstPart = plainText.slice(0, Math.max(200, Math.floor(plainText.length * 0.1)));
    const kwInFirstPart = keyword ? firstPart.includes(keyword) : false;
    rules.push({
      id: "kw_first_10",
      label: "Focus Keyword in First 10% Content",
      category: "Basic SEO",
      passed: kwInFirstPart,
      feedback: kwInFirstPart ? "Focus keyword appears early in the introduction." : "Mention focus keyword in the opening paragraph.",
      points: 10
    });

    // 5. Keyword Density (0.5% to 2.5%)
    let kwOccurrences = 0;
    if (keyword && words > 0) {
      const regex = new RegExp(`\\b${keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "gi");
      kwOccurrences = (plainText.match(regex) || []).length;
    }
    const keywordDensity = words > 0 && keyword ? (kwOccurrences / words) * 100 : 0;
    const kwDensityPassed = keywordDensity >= 0.5 && keywordDensity <= 2.5;
    rules.push({
      id: "kw_density",
      label: "Keyword Density (0.5% - 2.5%)",
      category: "Additional SEO",
      passed: kwDensityPassed,
      feedback: kwDensityPassed 
        ? `Keyword density is optimal (${keywordDensity.toFixed(2)}%).`
        : keywordDensity === 0 
          ? "Focus keyword is missing from body content."
          : `Keyword density is ${keywordDensity.toFixed(2)}% (Target: 0.5% - 2.5%).`,
      points: 10
    });

    // 6. Word Count >= 300 words
    const lengthPassed = words >= 300;
    rules.push({
      id: "word_count",
      label: "Content Length (300+ Words)",
      category: "Basic SEO",
      passed: lengthPassed,
      feedback: lengthPassed 
        ? `Content is ${words} words long (Good length).` 
        : `Content is only ${words} words. Aim for at least 300-600 words.`,
      points: 10
    });

    // 7. Headings (H2 / H3 present)
    const hasHeadings = /<h[2-4]/i.test(htmlContent);
    rules.push({
      id: "headings",
      label: "Subheadings (H2, H3) Used",
      category: "Content Readability",
      passed: hasHeadings,
      feedback: hasHeadings ? "Content utilizes subheadings for clear hierarchy." : "Add subheadings (H2/H3) to break up text.",
      points: 8
    });

    // 8. Image ALT Text present
    const imageAlt = currentPost.imageAltText || "";
    const altPassed = imageAlt.trim().length > 3;
    rules.push({
      id: "image_alt",
      label: "Featured Image Alt Text",
      category: "Additional SEO",
      passed: altPassed,
      feedback: altPassed ? "Featured image has descriptive ALT text." : "Add ALT text to your featured image for accessibility & SEO.",
      points: 7
    });

    // 9. Internal Links
    const internalLinks = currentPost.internalLinksCount || 0;
    const internalPassed = internalLinks >= 1 || /href=["']\//i.test(htmlContent);
    rules.push({
      id: "internal_links",
      label: "Internal Linking Present",
      category: "Additional SEO",
      passed: internalPassed,
      feedback: internalPassed ? "Internal links found pointing to Academy resources." : "Add internal links to other pages or articles.",
      points: 6
    });

    // 10. External Links
    const externalLinks = currentPost.externalLinksCount || 0;
    const externalPassed = externalLinks >= 1 || /href=["']http/i.test(htmlContent);
    rules.push({
      id: "external_links",
      label: "Outbound External Links",
      category: "Additional SEO",
      passed: externalPassed,
      feedback: externalPassed ? "Outbound external references included." : "Include at least one external authoritative reference.",
      points: 4
    });

    // 11. Meta Description Length (120-160)
    const descLen = (currentPost.metaDescription || "").length;
    const descLenPassed = descLen >= 100 && descLen <= 160;
    rules.push({
      id: "desc_length",
      label: "Meta Description Length (100-160 Chars)",
      category: "Title Readability",
      passed: descLenPassed,
      feedback: descLenPassed 
        ? `Meta description is ${descLen} characters (Optimal).`
        : `Meta description is ${descLen} characters. Target is 100-160 characters.`,
      points: 3
    });

    // Calculate total score out of 100
    const scoreSum = rules.reduce((acc, r) => acc + (r.passed ? r.points : 0), 0);
    const maxScore = rules.reduce((acc, r) => acc + r.points, 0);
    const overallScore = Math.min(100, Math.round((scoreSum / maxScore) * 100));

    // Readability Score calculation (Flesch Kincaid style estimation)
    const wordsPerSentence = words / Math.max(1, contentStats.sentences);
    const readability = Math.max(20, Math.min(100, Math.round(100 - (wordsPerSentence * 1.5))));

    const passedCount = rules.filter((r) => r.passed).length;
    const recommendations = rules.filter((r) => !r.passed).map((r) => r.feedback);

    return {
      score: overallScore,
      readability,
      keywordDensity,
      rules,
      passedCount,
      recommendations
    };
  }, [currentPost, contentStats]);

  // Save current post to CMS state & trigger global persistence
  const handleSaveArticle = (statusOverride?: "published" | "draft" | "scheduled") => {
    if (!currentPost) return;

    const newStatus = statusOverride || currentPost.status || "published";
    const updatedPost: BlogPost = {
      ...currentPost,
      status: newStatus,
      lastUpdated: new Date().toISOString().split("T")[0],
      wordCount: contentStats.words,
      sentenceCount: contentStats.sentences,
      paragraphCount: contentStats.paragraphs,
      readTime: contentStats.readingTime,
      seoScore: seoAnalysis.score
    };

    let updatedPosts = [...posts];
    if (currentPostIndex !== -1) {
      updatedPosts[currentPostIndex] = updatedPost;
    } else {
      updatedPosts.unshift(updatedPost);
    }

    const updatedCMSData: CMSData = {
      ...cmsData,
      blogPosts: updatedPosts
    };

    saveCMSData(updatedCMSData);
    onSave(updatedCMSData);
    setCurrentPost(updatedPost);
    showToast(`Article "${updatedPost.title}" saved successfully as ${newStatus.toUpperCase()}!`);
  };

  // Create new post
  const handleCreateNewPost = () => {
    const newId = `post-${Date.now()}`;
    const newPost: BlogPost = {
      id: newId,
      title: "New Quran & Tajweed Guide",
      excerpt: "Write a short summary introducing this article for readers and search engines...",
      category: "Tajweed Rules",
      coverImage: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
      author: {
        name: "Muhammad Zain",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        role: "Senior Quran Scholar"
      },
      date: new Date().toISOString().split("T")[0],
      readTime: "3 min read",
      tags: ["Tajweed", "Recitation", "Quran"],
      content: "<h2>Introduction to Tajweed Rules</h2><p>Learning the proper pronunciation and articulation of Quranic Arabic letters is essential for every Muslim. In this comprehensive guide, we explore the core principles of Tajweed...</p>",
      status: "draft",
      metaTitle: "New Quran & Tajweed Guide | Truth Quran Academy",
      metaDescription: "Comprehensive guide on Tajweed rules and Quran recitation techniques.",
      focusKeyword: "Tajweed",
      slug: `tajweed-guide-${Date.now().toString().slice(-4)}`,
      canonicalUrl: `https://truthquranacademy.com/blog/tajweed-guide-${Date.now().toString().slice(-4)}/`,
      robotsMeta: "index, follow",
      ogTitle: "New Quran & Tajweed Guide",
      ogDescription: "Learn Tajweed rules step-by-step with our scholars.",
      ogImage: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
      imageAltText: "Quran open on a stand with Tajweed annotations",
      internalLinksCount: 2,
      externalLinksCount: 1,
      schemaType: "Article",
      seoScore: 85
    };

    const updatedCMSData = {
      ...cmsData,
      blogPosts: [newPost, ...posts]
    };

    saveCMSData(updatedCMSData);
    onSave(updatedCMSData);
    setSelectedPostId(newId);
    setCurrentPost(newPost);
    showToast("New article draft initialized!");
  };

  // Delete current post
  const handleDeletePost = () => {
    if (!currentPost) return;
    if (!window.confirm(`Are you sure you want to delete "${currentPost.title}"?`)) return;

    const remaining = posts.filter((p) => p.id !== currentPost.id);
    const updatedCMSData = {
      ...cmsData,
      blogPosts: remaining
    };

    saveCMSData(updatedCMSData);
    onSave(updatedCMSData);
    if (remaining.length > 0) {
      setSelectedPostId(remaining[0].id);
      setCurrentPost(remaining[0]);
    } else {
      setSelectedPostId("");
      setCurrentPost(null);
    }
    showToast("Post deleted from database.");
  };

  // Block Insertion Logic
  const handleInsertBlock = (blockHtml: string) => {
    if (!currentPost) return;
    const updatedContent = `${currentPost.content || ""}\n${blockHtml}`;
    handleUpdateField("content", updatedContent);
    setShowBlockMenu(false);
    showToast("Block added to post content!");
  };

  // Internal Link Insertion Logic
  const handleSelectInternalLink = (url: string, title: string) => {
    if (!currentPost) return;
    const anchorHtml = `<a href="${url}" title="${title}" class="text-[#d9b45c] underline font-semibold hover:text-[#f2d98a]">${title}</a>`;
    const updatedContent = `${currentPost.content || ""}\n<p>Related Reading: ${anchorHtml}</p>`;
    handleUpdateField("content", updatedContent);
    handleUpdateField("internalLinksCount", (currentPost.internalLinksCount || 0) + 1);
    setShowInternalLinkModal(false);
    showToast(`Internal link to "${title}" inserted!`);
  };

  if (!currentPost) {
    return (
      <div className="p-8 bg-[#12141b] rounded-2xl border border-[#d9b45c]/20 text-center space-y-4">
        <FileText size={48} className="mx-auto text-[#d9b45c]/40" />
        <h3 className="text-lg font-serif font-bold text-white">No Articles Available</h3>
        <p className="text-xs text-[#c9c2ab]">Create your first blog post to unlock Rank Math Pro SEO optimization tools.</p>
        <button
          onClick={handleCreateNewPost}
          className="px-5 py-2.5 bg-[#d9b45c] text-black rounded-xl font-bold text-xs hover:bg-[#f2d98a] transition-all"
        >
          + Create First Article
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left relative font-sans">
      
      {/* TOAST FEEDBACK NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#d9b45c] text-black px-4 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center space-x-2 border border-black/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: RANK MATH PRO TOOLBAR & ACTION BAR */}
      <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-4 md:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d9b45c]/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d9b45c] to-[#997a2e] text-black flex items-center justify-center font-bold font-serif text-lg shadow-md">
              RM
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-lg md:text-xl text-white font-bold">Rank Math Pro Article Studio</h2>
                <span className="bg-[#d9b45c]/10 border border-[#d9b45c]/30 text-[#f2d98a] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  Gutenberg SEO v3.2
                </span>
              </div>
              <p className="text-[11px] text-[#c9c2ab] mt-0.5">Full On-Page SEO Engine, WordPress Block Editor & Real-Time Website Sync</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCreateNewPost}
              className="px-3 py-2 bg-[#1e2230] hover:bg-[#282d3f] text-white border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Plus size={14} className="text-[#d9b45c]" />
              <span>New Article</span>
            </button>

            <button
              onClick={() => handleSaveArticle("draft")}
              className="px-3 py-2 bg-[#12141b] hover:bg-white/5 text-[#c9c2ab] border border-white/15 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Save size={14} />
              <span>Save Draft</span>
            </button>

            <button
              onClick={() => handleSaveArticle("published")}
              className="px-4 py-2 bg-gradient-to-r from-[#f2d98a] via-[#d9b45c] to-[#b38f3b] text-black rounded-xl text-xs font-bold shadow-lg hover:brightness-110 transition-all flex items-center space-x-1.5"
            >
              <Check size={14} />
              <span>Publish / Sync Website</span>
            </button>

            <a
              href={`/blog/${currentPost.slug || currentPost.id}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-[#07080b] hover:bg-[#12141b] text-[#d9b45c] border border-[#d9b45c]/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <ExternalLink size={14} />
              <span>View Live</span>
            </a>

            <button
              onClick={handleDeletePost}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all"
              title="Delete Article"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Post Selector & Device Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Post Selection Dropdown */}
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <span className="text-[10px] uppercase font-bold text-[#c9c2ab] whitespace-nowrap">Editing Article:</span>
            <select
              value={selectedPostId}
              onChange={(e) => setSelectedPostId(e.target.value)}
              className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#d9b45c]"
            >
              {posts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.status === "published" ? "🟢" : "🟡"} {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* View Device Switcher */}
          <div className="flex items-center space-x-1 bg-[#07080b] border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setDeviceFrame("desktop")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all ${
                deviceFrame === "desktop" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-white"
              }`}
            >
              <Monitor size={12} />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceFrame("tablet")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all ${
                deviceFrame === "tablet" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-white"
              }`}
            >
              <Tablet size={12} />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDeviceFrame("mobile")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all ${
                deviceFrame === "mobile" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-white"
              }`}
            >
              <Smartphone size={12} />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setDeviceFrame("raw")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all ${
                deviceFrame === "raw" ? "bg-[#d9b45c] text-black" : "text-[#c9c2ab] hover:text-white"
              }`}
            >
              <Code size={12} />
              <span>HTML</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: WORKSPACE & RANK MATH SIDEBAR */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: GUTENBERG ARTICLE WORKSPACE (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* LIVE POST INFORMATION BAR */}
          <div className="bg-[#12141b]/90 border border-[#d9b45c]/15 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2 text-[11px]">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] uppercase ${
                  currentPost.status === "published" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                }`}>
                  {currentPost.status || "published"}
                </span>
                <span className="text-[#c9c2ab] font-mono text-[10px]">URL Slug: /blog/{currentPost.slug}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://truthquranacademy.com/blog/${currentPost.slug}`);
                    showToast("Live article URL copied to clipboard!");
                  }}
                  className="px-2 py-1 bg-[#07080b] hover:bg-white/5 text-[#d9b45c] rounded text-[10px] font-bold flex items-center space-x-1 border border-[#d9b45c]/20"
                >
                  <Copy size={10} />
                  <span>Copy URL</span>
                </button>
              </div>
            </div>

            {/* Post Meta Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase text-[#c9c2ab]/50 block">Word Count</span>
                <span className="font-bold text-white font-mono">{contentStats.words} words</span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase text-[#c9c2ab]/50 block">Reading Time</span>
                <span className="font-bold text-white font-mono">{contentStats.readingTime}</span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase text-[#c9c2ab]/50 block">Paragraphs</span>
                <span className="font-bold text-white font-mono">{contentStats.paragraphs}</span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[9px] uppercase text-[#c9c2ab]/50 block">Author</span>
                <span className="font-bold text-[#d9b45c] truncate block">{currentPost.author?.name || "Muhammad Zain"}</span>
              </div>
            </div>
          </div>

          {/* ARTICLE CONTENT CANVAS (CONTAINER DEVICE WRAPPER) */}
          <div className={`mx-auto transition-all duration-300 ${
            deviceFrame === "tablet" ? "max-w-[768px] border-8 border-[#12141b] rounded-3xl p-4 shadow-2xl bg-[#07080b]" :
            deviceFrame === "mobile" ? "max-w-[375px] border-8 border-[#12141b] rounded-3xl p-3 shadow-2xl bg-[#07080b]" :
            "w-full"
          }`}>
            <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 md:p-6 space-y-5">
              
              {/* Headline H1 Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-[#d9b45c] tracking-wider flex items-center space-x-1">
                    <Heading1 size={12} />
                    <span>Post Title (H1 Tag)</span>
                  </label>
                  <span className={`text-[9px] font-mono ${currentPost.title.length >= 20 && currentPost.title.length <= 70 ? "text-green-400" : "text-yellow-400"}`}>
                    {currentPost.title.length} chars
                  </span>
                </div>
                <input
                  type="text"
                  value={currentPost.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleUpdateField("title", val);
                    if (!currentPost.slug || currentPost.slug === "new-post") {
                      handleUpdateField("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                    }
                  }}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-xl px-4 py-3 text-lg md:text-xl font-serif font-bold text-white focus:outline-none focus:border-[#d9b45c] transition-colors"
                  placeholder="Enter a compelling post title..."
                />
              </div>

              {/* Slug / Permalink Edit Bar */}
              <div className="bg-[#07080b] border border-white/10 rounded-xl p-3 flex items-center space-x-2 text-xs font-mono">
                <span className="text-[#c9c2ab]/50">https://truthquranacademy.com/blog/</span>
                <input
                  type="text"
                  value={currentPost.slug || ""}
                  onChange={(e) => handleUpdateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="flex-1 bg-transparent border-b border-[#d9b45c]/30 text-[#f2d98a] font-bold outline-none px-1"
                  placeholder="permalink-slug"
                />
              </div>

              {/* Excerpt Summary Input */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] tracking-wider">Article Lead Excerpt (Short Summary)</label>
                <textarea
                  rows={2}
                  value={currentPost.excerpt}
                  onChange={(e) => handleUpdateField("excerpt", e.target.value)}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9b45c] resize-none"
                  placeholder="Write a short summary introducing this article..."
                />
              </div>

              {/* BLOCK EDITOR TOOLBAR & SLASH MENU BUTTON */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#07080b] border border-[#d9b45c]/20 p-2 rounded-xl">
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowBlockMenu(true)}
                    className="px-3 py-1.5 bg-[#d9b45c] text-black rounded-lg font-bold flex items-center space-x-1.5 hover:bg-[#f2d98a] transition-all"
                  >
                    <Plus size={14} />
                    <span>+ Add Block</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowInternalLinkModal(true)}
                    className="px-2.5 py-1.5 bg-[#12141b] hover:bg-white/5 text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg font-bold flex items-center space-x-1"
                  >
                    <Link2 size={12} />
                    <span>Internal Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertBlock(`<h2>Subheading (H2)</h2>\n<p>Write your section content here...</p>`)}
                    className="px-2 py-1 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/5"
                    title="Insert H2 Subheading"
                  >
                    <Heading2 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertBlock(`<h3>Subheading (H3)</h3>\n<p>Write detailed sub-points here...</p>`)}
                    className="px-2 py-1 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/5"
                    title="Insert H3 Subheading"
                  >
                    <Heading3 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertBlock(`<blockquote class="border-l-4 border-[#d9b45c] pl-4 italic text-[#f2d98a] my-4"><p>"Seek knowledge from the cradle to the grave."</p></blockquote>`)}
                    className="px-2 py-1 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/5"
                    title="Insert Quote / Verse"
                  >
                    <Quote size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertBlock(`<ul class="list-disc list-inside space-y-1 my-3 text-xs text-[#c9c2ab]"><li>First key principle</li><li>Second key principle</li><li>Third key principle</li></ul>`)}
                    className="px-2 py-1 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/5"
                    title="Insert Bullet List"
                  >
                    <List size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertBlock(`<div class="my-6 text-center"><a href="/courses" class="inline-block bg-[#d9b45c] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#f2d98a]">Enroll in Online Quran Class →</a></div>`)}
                    className="px-2 py-1 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/5"
                    title="Insert Call to Action Button"
                  >
                    <Sparkles size={14} className="text-[#d9b45c]" />
                  </button>
                </div>

                <div className="text-[10px] font-mono text-[#c9c2ab]/50">
                  Tip: Use HTML or Slash Menu to insert blocks
                </div>
              </div>

              {/* ARTICLE CONTENT EDITING AREA */}
              {deviceFrame === "raw" ? (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#d9b45c]">Raw HTML Content Editor</label>
                  <textarea
                    rows={16}
                    value={currentPost.content}
                    onChange={(e) => handleUpdateField("content", e.target.value)}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-4 text-xs font-mono text-green-400 focus:outline-none focus:border-[#d9b45c] leading-relaxed"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab] tracking-wider">Main Article Content (Gutenberg HTML)</label>
                    <span className="text-[9px] font-mono text-[#d9b45c]">
                      {contentStats.words} words | {contentStats.paragraphs} paragraphs
                    </span>
                  </div>
                  <textarea
                    rows={18}
                    value={currentPost.content}
                    onChange={(e) => handleUpdateField("content", e.target.value)}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#d9b45c] transition-colors font-sans leading-relaxed resize-y"
                    placeholder="Write article content using HTML formatting or click block buttons above..."
                  />
                </div>
              )}

              {/* LIVE CONTENT VISUAL PREVIEW BOX */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#d9b45c] tracking-widest flex items-center space-x-1">
                  <Eye size={12} />
                  <span>Rendered Article Visual Output</span>
                </span>
                <div className="bg-[#07080b] border border-white/5 rounded-xl p-5 text-left text-xs space-y-3 prose prose-invert max-w-none text-white leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: currentPost.content || "<p>No content written yet.</p>" }} />
                </div>
              </div>

            </div>
          </div>

          {/* DEDICATED FEATURED IMAGE & IMAGE SEO PANEL */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-serif font-bold text-[#d9b45c] uppercase tracking-wider flex items-center space-x-2">
                <ImageIcon size={14} />
                <span>Featured Image & Image SEO Metadata</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImageCropModal(true)}
                className="px-2.5 py-1 bg-[#07080b] hover:bg-white/5 text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg text-[10px] font-bold flex items-center space-x-1"
              >
                <Crop size={12} />
                <span>Image Tools</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Featured Image URL */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Featured Image URL</label>
                <input
                  type="text"
                  value={currentPost.coverImage}
                  onChange={(e) => {
                    handleUpdateField("coverImage", e.target.value);
                    handleUpdateField("featuredImage", e.target.value);
                    handleUpdateField("ogImage", e.target.value);
                  }}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  placeholder="https://..."
                />
              </div>

              {/* ALT Text */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Image Alt Text (SEO)</label>
                  <span className={`text-[8px] font-mono ${currentPost.imageAltText ? "text-green-400" : "text-red-400"}`}>
                    {currentPost.imageAltText ? "Added" : "Missing"}
                  </span>
                </div>
                <input
                  type="text"
                  value={currentPost.imageAltText || ""}
                  onChange={(e) => handleUpdateField("imageAltText", e.target.value)}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Describe image for search engine indexing..."
                />
              </div>

              {/* Image Title */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Image Title Attribute</label>
                <input
                  type="text"
                  value={currentPost.imageTitle || ""}
                  onChange={(e) => handleUpdateField("imageTitle", e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  placeholder="Image title attribute..."
                />
              </div>

              {/* File Name */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Image File Name (Clean Slug)</label>
                <input
                  type="text"
                  value={currentPost.imageFileName || ""}
                  onChange={(e) => handleUpdateField("imageFileName", e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  placeholder="tajweed-rules-banner.jpg"
                />
              </div>

              {/* Image Caption */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Image Caption (Visible below photo)</label>
                <input
                  type="text"
                  value={currentPost.imageCaption || ""}
                  onChange={(e) => handleUpdateField("imageCaption", e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  placeholder="e.g. Quran recitation session at Truth Quran Academy"
                />
              </div>
            </div>

            {/* Visual Cover Banner Box */}
            {currentPost.coverImage && (
              <div className="relative h-48 rounded-xl overflow-hidden border border-[#d9b45c]/20 mt-2">
                <img
                  src={currentPost.coverImage}
                  alt={currentPost.imageAltText || "Cover Image"}
                  className="w-full h-full object-cover"
                  style={{
                    filter: `brightness(${cropBrightness}%) contrast(${cropContrast}%)`
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold bg-[#d9b45c] text-black px-2 py-0.5 rounded mr-2">
                      {currentPost.category}
                    </span>
                    <h4 className="text-white text-xs font-serif font-bold mt-1">{currentPost.title}</h4>
                    {currentPost.imageCaption && (
                      <p className="text-[10px] text-[#c9c2ab] italic mt-0.5">{currentPost.imageCaption}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: RANK MATH PRO SEO SIDEBAR (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* 1. RANK MATH PRO SCORE CIRCULAR GAUGE */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 text-center space-y-4 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />

            <div className="flex items-center justify-between pb-1 border-b border-white/5">
              <span className="text-[10px] uppercase font-sans font-extrabold tracking-widest text-[#d9b45c]">
                Rank Math Pro Score
              </span>
              <span className="text-[8px] font-mono text-[#c9c2ab]/50 uppercase">Live Analysis</span>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#1e2230" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={seoAnalysis.score >= 80 ? "#10b981" : seoAnalysis.score >= 50 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - seoAnalysis.score / 100)}`}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-serif font-extrabold text-white leading-none">{seoAnalysis.score}</span>
                <span className="text-[8px] font-sans font-bold text-[#c9c2ab]/60 uppercase tracking-widest mt-1">
                  {seoAnalysis.score >= 80 ? "Great" : seoAnalysis.score >= 50 ? "Needs Work" : "Poor"}
                </span>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5 text-xs">
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Word Count</span>
                <span className="font-bold text-white font-mono">{contentStats.words}</span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Keyword %</span>
                <span className={`font-bold font-mono ${seoAnalysis.keywordDensity >= 0.5 && seoAnalysis.keywordDensity <= 2.5 ? "text-green-400" : "text-yellow-400"}`}>
                  {seoAnalysis.keywordDensity.toFixed(1)}%
                </span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Readability</span>
                <span className={`font-bold ${seoAnalysis.readability >= 60 ? "text-green-400" : "text-yellow-500"}`}>
                  {seoAnalysis.readability}/100
                </span>
              </div>
            </div>
          </div>

          {/* 2. LIVE GOOGLE SERP PREVIEW */}
          <div className="bg-[#12141b]/80 border border-[#d9b45c]/10 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] uppercase font-sans font-bold text-[#d9b45c] tracking-widest flex items-center space-x-1">
              <Eye size={12} />
              <span>Google SERP Snippet Preview</span>
            </span>
            <div className="bg-white text-black p-3.5 rounded-xl space-y-1 text-left font-sans select-text shadow-md">
              <div className="text-[10px] text-[#202124] flex items-center space-x-1 font-sans">
                <span>https://truthquranacademy.com</span>
                <span className="text-gray-400 font-normal">› blog › {(currentPost.slug || "article").toLowerCase()}</span>
              </div>
              <h4 className="text-sm font-sans text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight line-clamp-1">
                {currentPost.metaTitle || currentPost.title}
              </h4>
              <p className="text-[11px] text-[#4d5156] leading-normal line-clamp-2 font-light">
                {currentPost.metaDescription || currentPost.excerpt || "No meta description provided."}
              </p>
            </div>
          </div>

          {/* 3. RANK MATH AUDIT CHECKS & RECOMMENDATIONS */}
          <div className="bg-[#12141b]/70 border border-[#d9b45c]/15 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-sans font-extrabold text-[#f3ecd8] uppercase tracking-widest flex items-center justify-between pb-2 border-b border-white/5">
              <span>SEO Audit Checklist</span>
              <span className="text-[9px] font-mono text-[#d9b45c] bg-[#d9b45c]/10 px-2 py-0.5 rounded">
                {seoAnalysis.passedCount} / {seoAnalysis.rules.length} Passed
              </span>
            </h3>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 text-xs">
              {seoAnalysis.rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-2.5 rounded-xl border flex items-start space-x-2 ${
                    rule.passed
                      ? "bg-green-500/5 border-green-500/20 text-green-300"
                      : "bg-red-500/5 border-red-500/20 text-red-300"
                  }`}
                >
                  {rule.passed ? (
                    <Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-[10px] uppercase block">{rule.label}</span>
                    <p className="text-[10px] text-[#c9c2ab] leading-snug mt-0.5">{rule.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. INTEGRATED EDITABLE SEO ACCORDIONS */}
          <div className="space-y-3">
            
            {/* ACCORDION A: FOCUS KEYWORD & SNIPPET (UNLOCKED FULLY EDITABLE) */}
            <div className="bg-[#12141b] border border-white/10 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("meta")}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#12141b] text-[#f3ecd8] font-sans font-bold text-xs uppercase tracking-wider border-b border-white/5 hover:bg-white/5 transition-colors text-left"
              >
                <span className="flex items-center space-x-2">
                  <Sparkles size={14} className="text-[#d9b45c]" />
                  <span>Focus Keyword & Snippet Editor</span>
                </span>
                {expandedSections.meta ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {expandedSections.meta && (
                <div className="p-4 space-y-3.5 text-xs">
                  {/* Focus Keyword */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Focus Keyword</label>
                    <input
                      type="text"
                      value={currentPost.focusKeyword || ""}
                      onChange={(e) => handleUpdateField("focusKeyword", e.target.value)}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-lg px-3 py-1.5 text-xs text-[#f2d98a] font-bold outline-none focus:border-[#d9b45c]"
                      placeholder="e.g. Tajweed Rules"
                    />
                  </div>

                  {/* SEO Title Tag & Counter */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">SEO Title Tag</label>
                      <span className={`text-[9px] font-mono ${
                        (currentPost.metaTitle || "").length >= 50 && (currentPost.metaTitle || "").length <= 60
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}>
                        {(currentPost.metaTitle || "").length}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={currentPost.metaTitle || ""}
                      onChange={(e) => handleUpdateField("metaTitle", e.target.value)}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#d9b45c]"
                      placeholder="SEO Title..."
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">URL Slug</label>
                    <input
                      type="text"
                      value={currentPost.slug || ""}
                      onChange={(e) => handleUpdateField("slug", e.target.value)}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white font-mono outline-none focus:border-[#d9b45c]"
                      placeholder="slug"
                    />
                  </div>

                  {/* Meta Description & Counter */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Meta Description</label>
                      <span className={`text-[9px] font-mono ${
                        (currentPost.metaDescription || "").length >= 100 && (currentPost.metaDescription || "").length <= 160
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}>
                        {(currentPost.metaDescription || "").length}/160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={currentPost.metaDescription || ""}
                      onChange={(e) => handleUpdateField("metaDescription", e.target.value)}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-[#c9c2ab] outline-none focus:border-[#d9b45c] resize-none"
                      placeholder="Write a concise meta snippet..."
                    />
                  </div>

                  {/* Robots Meta Tag */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Robots Meta Tag</label>
                    <select
                      value={currentPost.robotsMeta || "index, follow"}
                      onChange={(e) => handleUpdateField("robotsMeta", e.target.value)}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    >
                      <option value="index, follow">index, follow (Default - Recommended)</option>
                      <option value="noindex, follow">noindex, follow (Hide from search)</option>
                      <option value="index, nofollow">index, nofollow (Do not follow links)</option>
                      <option value="noindex, nofollow">noindex, nofollow (Private post)</option>
                    </select>
                  </div>

                  {/* Canonical URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Canonical URL Override</label>
                    <input
                      type="text"
                      value={currentPost.canonicalUrl || ""}
                      onChange={(e) => handleUpdateField("canonicalUrl", e.target.value)}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION B: LINKS & TAXONOMIES */}
            <div className="bg-[#12141b] border border-white/10 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("links")}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#12141b] text-[#f3ecd8] font-sans font-bold text-xs uppercase tracking-wider border-b border-white/5 hover:bg-white/5 transition-colors text-left"
              >
                <span className="flex items-center space-x-2">
                  <Link2 size={14} className="text-[#d9b45c]" />
                  <span>Links, Categories & Tags</span>
                </span>
                {expandedSections.links ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {expandedSections.links && (
                <div className="p-4 space-y-3.5 text-xs">
                  {/* Category Selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Primary Category</label>
                    <select
                      value={currentPost.category}
                      onChange={(e) => handleUpdateField("category", e.target.value)}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#d9b45c]"
                    >
                      <option value="Tajweed Rules">Tajweed Rules</option>
                      <option value="Hifz Guide">Hifz Guide</option>
                      <option value="Quranic Arabic">Quranic Arabic</option>
                      <option value="Parenting Guide">Parenting Guide</option>
                      <option value="Academy Lectures">Academy Lectures</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={currentPost.tags ? currentPost.tags.join(", ") : ""}
                      onChange={(e) =>
                        handleUpdateField(
                          "tags",
                          e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                        )
                      }
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                      placeholder="Tajweed, Recitation, Hifz"
                    />
                  </div>

                  {/* Link Counters */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Internal Links</label>
                      <input
                        type="number"
                        value={currentPost.internalLinksCount || 0}
                        onChange={(e) => handleUpdateField("internalLinksCount", parseInt(e.target.value) || 0)}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white font-bold text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">External Links</label>
                      <input
                        type="number"
                        value={currentPost.externalLinksCount || 0}
                        onChange={(e) => handleUpdateField("externalLinksCount", parseInt(e.target.value) || 0)}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white font-bold text-center"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION C: SCHEMA & STRUCTURED DATA */}
            <div className="bg-[#12141b] border border-white/10 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("schema")}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#12141b] text-[#f3ecd8] font-sans font-bold text-xs uppercase tracking-wider border-b border-white/5 hover:bg-white/5 transition-colors text-left"
              >
                <span className="flex items-center space-x-2">
                  <Code size={14} className="text-[#d9b45c]" />
                  <span>Schema Markup & Structured Data</span>
                </span>
                {expandedSections.schema ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {expandedSections.schema && (
                <div className="p-4 space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Schema Type</label>
                    <select
                      value={currentPost.schemaType || "Article"}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleUpdateField("schemaType", val);
                        handleUpdateField("customSchemaJson", JSON.stringify({
                          "@context": "https://schema.org",
                          "@type": val === "FAQPage" ? "FAQPage" : val === "HowTo" ? "HowTo" : "Article",
                          "headline": currentPost.title,
                          "description": currentPost.excerpt
                        }, null, 2));
                      }}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    >
                      <option value="Article">Article Schema</option>
                      <option value="BlogPosting">BlogPosting Schema</option>
                      <option value="FAQPage">FAQPage Schema</option>
                      <option value="HowTo">HowTo Guide Schema</option>
                      <option value="Course">Course Reference Schema</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">LD+JSON Schema Output</label>
                    <textarea
                      rows={6}
                      value={currentPost.customSchemaJson || ""}
                      onChange={(e) => handleUpdateField("customSchemaJson", e.target.value)}
                      className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2.5 text-xs text-green-400 font-mono leading-normal focus:border-[#d9b45c]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION D: SOCIAL MEDIA PREVIEWS & OPEN GRAPH */}
            <div className="bg-[#12141b] border border-white/10 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("social")}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#12141b] text-[#f3ecd8] font-sans font-bold text-xs uppercase tracking-wider border-b border-white/5 hover:bg-white/5 transition-colors text-left"
              >
                <span className="flex items-center space-x-2">
                  <Share2 size={14} className="text-[#d9b45c]" />
                  <span>Social Media Previews (OG)</span>
                </span>
                {expandedSections.social ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {expandedSections.social && (
                <div className="p-4 space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Facebook / LinkedIn Title (og:title)</label>
                    <input
                      type="text"
                      value={currentPost.ogTitle || ""}
                      onChange={(e) => handleUpdateField("ogTitle", e.target.value)}
                      className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                      placeholder="Social title..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Twitter/X Title</label>
                    <input
                      type="text"
                      value={currentPost.twitterTitle || currentPost.ogTitle || ""}
                      onChange={(e) => handleUpdateField("twitterTitle", e.target.value)}
                      className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                      placeholder="Twitter title..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Social Description (og:description)</label>
                    <textarea
                      rows={2}
                      value={currentPost.ogDescription || ""}
                      onChange={(e) => handleUpdateField("ogDescription", e.target.value)}
                      className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white resize-none"
                      placeholder="Social description..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Twitter Card Type</label>
                    <select
                      value={currentPost.twitterCard || "summary_large_image"}
                      onChange={(e) => handleUpdateField("twitterCard", e.target.value)}
                      className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      <option value="summary_large_image">summary_large_image</option>
                      <option value="summary">summary</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* POPUP MODAL 1: GUTENBERG BLOCK INSERTER MENU */}
      {showBlockMenu && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#d9b45c] flex items-center space-x-2">
                <Plus size={18} />
                <span>Insert Gutenberg Block</span>
              </h3>
              <button onClick={() => setShowBlockMenu(false)} className="p-1 hover:bg-white/10 rounded-lg text-white">
                <X size={16} />
              </button>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-[#c9c2ab]" />
              <input
                type="text"
                value={blockSearch}
                onChange={(e) => setBlockSearch(e.target.value)}
                placeholder="Search blocks (Heading, Quote, Button, Download...)"
                className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 text-xs">
              <button
                onClick={() => handleInsertBlock(`<h2>Heading 2</h2>`)}
                className="p-3 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 rounded-xl text-left space-y-1 transition-all"
              >
                <Heading2 size={16} className="text-[#d9b45c]" />
                <span className="font-bold text-white block">Heading H2</span>
                <span className="text-[10px] text-[#c9c2ab]/60 block">Section header</span>
              </button>

              <button
                onClick={() => handleInsertBlock(`<h3>Heading 3</h3>`)}
                className="p-3 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 rounded-xl text-left space-y-1 transition-all"
              >
                <Heading3 size={16} className="text-[#d9b45c]" />
                <span className="font-bold text-white block">Heading H3</span>
                <span className="text-[10px] text-[#c9c2ab]/60 block">Sub-section header</span>
              </button>

              <button
                onClick={() => handleInsertBlock(`<blockquote class="border-l-4 border-[#d9b45c] pl-4 italic text-[#f2d98a] my-4"><p>"The best among you are those who learn the Quran and teach it." - Prophet Muhammad (ﷺ)</p></blockquote>`)}
                className="p-3 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 rounded-xl text-left space-y-1 transition-all"
              >
                <Quote size={16} className="text-[#d9b45c]" />
                <span className="font-bold text-white block">Quran / Hadith Callout</span>
                <span className="text-[10px] text-[#c9c2ab]/60 block">Styled verse quote</span>
              </button>

              <button
                onClick={() => handleInsertBlock(`<div class="my-6 p-4 bg-[#07080b] border border-[#d9b45c]/30 rounded-2xl flex flex-col items-center text-center space-y-2"><h4 class="text-sm font-bold text-[#f2d98a]">Free Trial Quran Class</h4><p class="text-xs text-[#c9c2ab]">Book 3 days free trial with expert tutor.</p><a href="/courses" class="bg-[#d9b45c] text-black font-bold px-5 py-2 rounded-xl text-xs">Book Free Trial →</a></div>`)}
                className="p-3 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 rounded-xl text-left space-y-1 transition-all"
              >
                <Sparkles size={16} className="text-[#d9b45c]" />
                <span className="font-bold text-white block">CTA Box</span>
                <span className="text-[10px] text-[#c9c2ab]/60 block">Free trial banner</span>
              </button>

              <button
                onClick={() => handleInsertBlock(`<div class="my-6 p-4 bg-[#07080b] border border-white/10 rounded-xl flex items-center justify-between"><div className="space-y-1"><span class="text-xs font-bold text-white block">Download Quran Para / Qaida PDF</span><span class="text-[10px] text-[#c9c2ab] block">Branded with Truth Quran Academy</span></div><a href="/quran-download" class="px-4 py-2 bg-[#d9b45c] text-black font-bold rounded-lg text-xs">Download PDF →</a></div>`)}
                className="p-3 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 rounded-xl text-left space-y-1 transition-all"
              >
                <FileDown size={16} className="text-[#d9b45c]" />
                <span className="font-bold text-white block">PDF Download Button</span>
                <span className="text-[10px] text-[#c9c2ab]/60 block">Branded Quran PDF</span>
              </button>

              <button
                onClick={() => handleInsertBlock(`<div class="my-4 overflow-x-auto"><table class="w-full border border-white/10 text-xs"><thead><tr class="bg-[#12141b] text-[#d9b45c]"><th class="p-2 border border-white/10">Tajweed Rule</th><th class="p-2 border border-white/10">Description</th></tr></thead><tbody><tr><td class="p-2 border border-white/10">Ghunnah</td><td class="p-2 border border-white/10">Nasal sound for 2 counts</td></tr></tbody></table></div>`)}
                className="p-3 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 rounded-xl text-left space-y-1 transition-all"
              >
                <Table size={16} className="text-[#d9b45c]" />
                <span className="font-bold text-white block">Data Table</span>
                <span className="text-[10px] text-[#c9c2ab]/60 block">Rules comparison</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: SMART INTERNAL LINK SEARCH */}
      {showInternalLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#d9b45c] flex items-center space-x-2">
                <Link2 size={18} />
                <span>Insert Smart Internal Link</span>
              </h3>
              <button onClick={() => setShowInternalLinkModal(false)} className="p-1 hover:bg-white/10 rounded-lg text-white">
                <X size={16} />
              </button>
            </div>

            <div className="flex space-x-1 border-b border-white/10 pb-2 text-xs">
              <button
                onClick={() => setInternalLinkTab("posts")}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  internalLinkTab === "posts" ? "bg-[#d9b45c] text-black" : "bg-[#07080b] text-[#c9c2ab]"
                }`}
              >
                Blog Articles ({posts.length})
              </button>
              <button
                onClick={() => setInternalLinkTab("pages")}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  internalLinkTab === "pages" ? "bg-[#d9b45c] text-black" : "bg-[#07080b] text-[#c9c2ab]"
                }`}
              >
                Pages (7)
              </button>
              <button
                onClick={() => setInternalLinkTab("courses")}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  internalLinkTab === "courses" ? "bg-[#d9b45c] text-black" : "bg-[#07080b] text-[#c9c2ab]"
                }`}
              >
                Courses ({cmsData.courses?.length || 0})
              </button>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 text-xs">
              {internalLinkTab === "posts" &&
                posts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectInternalLink(`/blog/${p.slug || p.id}`, p.title)}
                    className="w-full p-2.5 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 rounded-xl text-left flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">{p.title}</span>
                      <span className="text-[10px] text-[#c9c2ab]/50 block">/blog/{p.slug}</span>
                    </div>
                    <span className="text-[10px] text-[#d9b45c] font-bold">Insert →</span>
                  </button>
                ))}

              {internalLinkTab === "pages" && (
                <>
                  <button
                    onClick={() => handleSelectInternalLink("/courses", "Quran Courses & Programs")}
                    className="w-full p-2.5 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 rounded-xl text-left flex items-center justify-between"
                  >
                    <span className="font-bold text-white">Quran Courses & Fee Plans</span>
                    <span className="text-[10px] text-[#d9b45c] font-bold">Insert →</span>
                  </button>
                  <button
                    onClick={() => handleSelectInternalLink("/quran-download", "Quran 30 Paras & Qaida Download")}
                    className="w-full p-2.5 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 rounded-xl text-left flex items-center justify-between"
                  >
                    <span className="font-bold text-white">Quran 30 Paras & Qaida PDF Download</span>
                    <span className="text-[10px] text-[#d9b45c] font-bold">Insert →</span>
                  </button>
                  <button
                    onClick={() => handleSelectInternalLink("/teachers", "Expert Quran Teachers & Scholars")}
                    className="w-full p-2.5 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 rounded-xl text-left flex items-center justify-between"
                  >
                    <span className="font-bold text-white">Teachers & Scholars</span>
                    <span className="text-[10px] text-[#d9b45c] font-bold">Insert →</span>
                  </button>
                </>
              )}

              {internalLinkTab === "courses" &&
                (cmsData.courses || []).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectInternalLink("/courses", c.title)}
                    className="w-full p-2.5 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 rounded-xl text-left flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">{c.title}</span>
                      <span className="text-[10px] text-[#c9c2ab]/50 block">{c.tag || c.difficulty}</span>
                    </div>
                    <span className="text-[10px] text-[#d9b45c] font-bold">Insert →</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL 3: FEATURED IMAGE TOOLS */}
      {showImageCropModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#d9b45c] flex items-center space-x-2">
                <Crop size={18} />
                <span>Featured Image Adjustments</span>
              </h3>
              <button onClick={() => setShowImageCropModal(false)} className="p-1 hover:bg-white/10 rounded-lg text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Brightness ({cropBrightness}%)</label>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={cropBrightness}
                  onChange={(e) => setCropBrightness(parseInt(e.target.value))}
                  className="w-full accent-[#d9b45c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Contrast ({cropContrast}%)</label>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={cropContrast}
                  onChange={(e) => setCropContrast(parseInt(e.target.value))}
                  className="w-full accent-[#d9b45c]"
                />
              </div>

              <button
                onClick={() => {
                  setCropBrightness(100);
                  setCropContrast(100);
                }}
                className="w-full py-2 bg-[#07080b] text-[#c9c2ab] hover:text-white rounded-xl text-xs font-bold border border-white/10"
              >
                Reset Adjustments
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
