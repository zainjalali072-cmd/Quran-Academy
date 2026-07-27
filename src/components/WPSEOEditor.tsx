import React, { useState } from "react";
import { CMSData } from "../cmsStore";
import { BlogPost } from "../types";
import { 
  FileText, 
  Search, 
  Settings, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  X, 
  Plus, 
  Trash2, 
  Award, 
  BookOpen, 
  Link2, 
  Image as ImageIcon, 
  Globe, 
  Code,
  Tag,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  ExternalLink,
  HelpCircle,
  Share2
} from "lucide-react";

interface WPSEOEditorProps {
  cmsData: CMSData;
  onSave: (updatedData: CMSData) => void;
  externalPostId?: string | null;
}

export default function WPSEOEditor({ cmsData, onSave, externalPostId }: WPSEOEditorProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(
    externalPostId || (cmsData.blogPosts && cmsData.blogPosts.length > 0 ? cmsData.blogPosts[0].id : null)
  );

  React.useEffect(() => {
    if (externalPostId) {
      setSelectedPostId(externalPostId);
    }
  }, [externalPostId]);

  // Accordion states for the SEO Sidebar panels
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    meta: true,
    links: false,
    schema: false,
    social: false,
    passed: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Load selected post
  const currentPost = cmsData.blogPosts.find(p => p.id === selectedPostId) || cmsData.blogPosts[0];

  const handleUpdateField = (field: keyof BlogPost, value: any) => {
    if (!currentPost) return;
    const updated = cmsData.blogPosts.map(p => {
      if (p.id === currentPost.id) {
        const nextPost = { ...p, [field]: value };
        // If content changes, auto-calculate word count and reading time
        if (field === "content") {
          const stripped = value.replace(/<[^>]*>/g, ""); // strip HTML tags
          const words = stripped.trim() ? stripped.trim().split(/\s+/).filter(Boolean).length : 0;
          nextPost.wordCount = words;
          nextPost.readTime = `${Math.ceil(words / 200)} min read`;
        }
        return nextPost;
      }
      return p;
    });
    onSave({ ...cmsData, blogPosts: updated });
  };

  const handleAddNewPost = () => {
    const newId = `post-${Date.now()}`;
    const newPost: BlogPost = {
      id: newId,
      title: "Mastering the Art of Tajweed Recitation & Heartfelt Quran Connection",
      excerpt: "An essential roadmap for beginners and intermediate students looking to master Quranic phonetics.",
      category: "Tajweed Rules",
      coverImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
      author: {
        name: cmsData.developerName || "Muhammad Zain",
        avatar: cmsData.developerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        role: "Scholar"
      },
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: "3 min read",
      tags: ["Tajweed", "Quran Rules"],
      content: "<h2>Intro to Sacred Tajweed Rules</h2><p>Reciting the Holy Quran with divine precision is a spiritual obligation. Mastering throat letters is crucial for accurate pronunciation.</p>",
      seoTitle: "Mastering the Art of Tajweed Recitation | Quran Tutors",
      metaTitle: "Mastering Tajweed Recitation & Quranic Articulation",
      metaDescription: "Learn Tajweed rules step-by-step from native certified Arabic scholars. Elevate your recitation with correct Makharij articulation points.",
      focusKeyword: "Tajweed",
      slug: "mastering-tajweed-recitation",
      canonicalUrl: `https://truthquranacademy.com/blog/mastering-tajweed-recitation/`,
      robotsMeta: "index, follow",
      ogTitle: "Mastering Tajweed Recitation Online",
      ogDescription: "Learn Tajweed rules step-by-step from native certified Arabic scholars. Elevate your recitation.",
      ogImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
      twitterCard: "summary_large_image",
      imageAltText: "Beautiful Quran book on wooden stand",
      wordCount: 150,
      internalLinksCount: 1,
      externalLinksCount: 1,
      schemaType: "BlogPosting",
      customSchemaJson: `{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Mastering the Art of Tajweed Recitation & Heartfelt Quran Connection",
  "description": "An essential roadmap for beginners and intermediate students looking to master Quranic phonetics.",
  "author": {
    "@type": "Person",
    "name": "Muhammad Zain"
  }
}`
    };

    onSave({
      ...cmsData,
      blogPosts: [newPost, ...cmsData.blogPosts]
    });
    setSelectedPostId(newId);
  };

  const handleDeletePost = (id: string) => {
    if (cmsData.blogPosts.length <= 1) {
      alert("At least one blog post must exist in the database.");
      return;
    }
    if (confirm("Are you sure you want to delete this blog post?")) {
      const filtered = cmsData.blogPosts.filter(p => p.id !== id);
      onSave({
        ...cmsData,
        blogPosts: filtered
      });
      if (selectedPostId === id) {
        setSelectedPostId(filtered[0].id);
      }
    }
  };

  // Schema Presets
  const schemaPresets = [
    { type: "FAQPage", name: "FAQ Schema" },
    { type: "Article", name: "Article Schema" },
    { type: "BlogPosting", name: "BlogPosting Schema" },
    { type: "LocalBusiness", name: "Local Business Schema" },
    { type: "Custom", name: "Custom JSON-LD Schema" }
  ];

  const handleApplySchemaPreset = (type: string) => {
    if (!currentPost) return;
    let template = "";
    if (type === "Article") {
      template = `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${currentPost.title}",
  "image": ["${currentPost.coverImage}"],
  "datePublished": "2026-07-18T08:00:00+08:00",
  "author": {
    "@type": "Person",
    "name": "${currentPost.author?.name || "Muhammad Zain"}"
  }
}`;
    } else if (type === "FAQPage") {
      template = `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What are the rules of Tajweed?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Tajweed is the ruleset for correct pronunciation and articulation of Quranic letters."
    }
  }]
}`;
    } else if (type === "LocalBusiness") {
      template = `{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Truth Quran Academy",
  "url": "https://truthquranacademy.com",
  "logo": "https://truthquranacademy.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "${cmsData.contactAddress}",
    "addressLocality": "London",
    "addressCountry": "UK"
  }
}`;
    } else {
      template = `{
  "@context": "https://schema.org",
  "@type": "${type}",
  "name": "${currentPost.title}"
}`;
    }

    handleUpdateField("schemaType", type);
    handleUpdateField("customSchemaJson", template);
  };

  // --- LIVE SEO REAL-TIME ANALYSIS ENGINE ---
  const strippedContent = currentPost?.content ? currentPost.content.replace(/<[^>]*>/g, "") : "";
  const words = strippedContent.trim() ? strippedContent.trim().split(/\s+/).filter(Boolean).length : 0;
  const focusKeyword = (currentPost?.focusKeyword || "").trim();

  let keywordCount = 0;
  let density = 0;
  if (focusKeyword && words > 0) {
    const escapedKeyword = focusKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedKeyword, 'gi');
    keywordCount = (strippedContent.match(regex) || []).length;
    density = (keywordCount / words) * 100;
  }

  // Readability Score
  const sentences = strippedContent.split(/[.!?]+/).filter(s => s.trim().length > 3).length || 1;
  const avgSentenceLength = words / sentences;
  const readabilityScore = words === 0 ? 0 : Math.max(10, Math.min(100, Math.round(100 - (avgSentenceLength - 12) * 2)));
  let readabilityLabel = "Difficult";
  if (readabilityScore >= 80) readabilityLabel = "Very Easy";
  else if (readabilityScore >= 60) readabilityLabel = "Standard/Good";
  else if (readabilityScore >= 40) readabilityLabel = "Fair/Moderate";

  // Check subheadings and focus keyword in subheadings
  const hasSubheadings = currentPost?.content ? (currentPost.content.toLowerCase().includes("<h2") || currentPost.content.toLowerCase().includes("<h3") || currentPost.content.toLowerCase().includes("<h4")) : false;
  let keywordInSubheading = false;
  if (focusKeyword && currentPost?.content) {
    const headingRegex = /<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi;
    let match;
    while ((match = headingRegex.exec(currentPost.content)) !== null) {
      if (match[1].toLowerCase().includes(focusKeyword.toLowerCase())) {
        keywordInSubheading = true;
        break;
      }
    }
  }

  // Links
  const parsedInternalCount = currentPost?.content ? (currentPost.content.match(/href=["'](\/[^"']*|#[^"']*|https?:\/\/(?:www\.)?truthquranacademy\.com[^"']*)["']/g) || []).length : 0;
  const totalInternal = currentPost ? Math.max(currentPost.internalLinksCount || 0, parsedInternalCount) : 0;

  const parsedExternalCount = currentPost?.content ? (currentPost.content.match(/href=["']https?:\/\/(?!(?:www\.)?truthquranacademy\.com)[^"']*["']/g) || []).length : 0;
  const totalExternal = currentPost ? Math.max(currentPost.externalLinksCount || 0, parsedExternalCount) : 0;

  // Schema validation
  let isSchemaValidJson = false;
  try {
    if (currentPost?.customSchemaJson) {
      JSON.parse(currentPost.customSchemaJson);
      isSchemaValidJson = true;
    }
  } catch (e) {}

  const title = (currentPost?.metaTitle || currentPost?.title || "").trim();
  const desc = (currentPost?.metaDescription || "").trim();
  const slug = (currentPost?.slug || "").trim();
  const imageAlt = (currentPost?.imageAltText || "").trim();

  // Dynamic Rule Scoring List (sums to exactly 100 points)
  const rules = currentPost ? [
    {
      id: "focus_keyword",
      label: "Focus Keyword",
      points: 5,
      passed: focusKeyword.length > 0,
      feedback: focusKeyword.length > 0 ? `Focus keyword "${focusKeyword}" is defined.` : "Focus keyword is missing.",
      recommendation: "Missing Focus Keyword",
      earned: focusKeyword.length > 0 ? 5 : 0
    },
    {
      id: "seo_title_length",
      label: "SEO Title Length",
      points: 5,
      passed: title.length >= 30 && title.length <= 65,
      feedback: title.length >= 30 && title.length <= 65 ? "SEO Title length is optimal." : title.length === 0 ? "SEO Title is empty." : `Title is ${title.length} chars. Aim for 30-65 chars.`,
      recommendation: title.length < 30 ? "Meta Description is too short" : title.length > 65 ? "SEO Title is too long" : undefined, // fallback or warning
      earned: title.length >= 30 && title.length <= 65 ? 5 : (title.length > 0 && title.length <= 80 ? 2 : 0)
    },
    {
      id: "keyword_in_title",
      label: "Keyword in SEO Title",
      points: 5,
      passed: focusKeyword.length > 0 && title.toLowerCase().includes(focusKeyword.toLowerCase()),
      feedback: focusKeyword.length > 0 && title.toLowerCase().includes(focusKeyword.toLowerCase()) ? "Focus keyword found in SEO Title." : "Focus keyword missing from SEO Title.",
      recommendation: "Focus keyword missing from SEO Title",
      earned: focusKeyword.length > 0 && title.toLowerCase().includes(focusKeyword.toLowerCase()) ? 5 : 0
    },
    {
      id: "meta_desc_length",
      label: "Meta Description",
      points: 5,
      passed: desc.length >= 100 && desc.length <= 160,
      feedback: desc.length >= 100 && desc.length <= 160 ? "Meta description is optimal length." : desc.length === 0 ? "Meta description is empty." : `Description is ${desc.length} chars. Aim for 100-160 chars.`,
      recommendation: desc.length < 100 ? "Meta Description is too short" : undefined,
      earned: desc.length >= 100 && desc.length <= 160 ? 5 : (desc.length > 0 ? 2 : 0)
    },
    {
      id: "keyword_in_desc",
      label: "Keyword in Meta Description",
      points: 5,
      passed: focusKeyword.length > 0 && desc.toLowerCase().includes(focusKeyword.toLowerCase()),
      feedback: focusKeyword.length > 0 && desc.toLowerCase().includes(focusKeyword.toLowerCase()) ? "Focus keyword found in Meta Description." : "Focus keyword missing from Meta Description.",
      recommendation: "Focus keyword missing from Meta Description",
      earned: focusKeyword.length > 0 && desc.toLowerCase().includes(focusKeyword.toLowerCase()) ? 5 : 0
    },
    {
      id: "slug_format",
      label: "URL Slug Format",
      points: 3,
      passed: slug.length > 0 && !slug.includes(" ") && slug === slug.toLowerCase(),
      feedback: slug.length > 0 && !slug.includes(" ") && slug === slug.toLowerCase() ? "Slug is clean and SEO friendly." : "Slug contains uppercase or spaces.",
      recommendation: "Improve URL Slug formatting",
      earned: slug.length > 0 && !slug.includes(" ") && slug === slug.toLowerCase() ? 3 : (slug.length > 0 ? 1 : 0)
    },
    {
      id: "keyword_in_slug",
      label: "Keyword in URL Slug",
      points: 3,
      passed: focusKeyword.length > 0 && slug.toLowerCase().includes(focusKeyword.toLowerCase().replace(/\s+/g, "-")),
      feedback: focusKeyword.length > 0 && slug.toLowerCase().includes(focusKeyword.toLowerCase().replace(/\s+/g, "-")) ? "Focus keyword found in URL Slug." : "Focus keyword missing from URL Slug.",
      recommendation: "Focus keyword missing from URL Slug",
      earned: focusKeyword.length > 0 && slug.toLowerCase().includes(focusKeyword.toLowerCase().replace(/\s+/g, "-")) ? 3 : 0
    },
    {
      id: "word_count",
      label: "Article Length",
      points: 8,
      passed: words >= 600,
      feedback: words >= 600 ? `Excellent word count (${words} words).` : `Word count is ${words}. Aim for 600+.`,
      recommendation: words < 300 ? "Increase Word Count" : undefined,
      earned: words >= 600 ? 8 : (words >= 300 ? 5 : (words >= 100 ? 2 : 0))
    },
    {
      id: "heading_structure",
      label: "Subheading Structure",
      points: 4,
      passed: hasSubheadings,
      feedback: hasSubheadings ? "Subheadings (H2, H3) exist in content." : "No H2/H3 subheadings found.",
      recommendation: "Improve Heading Structure",
      earned: hasSubheadings ? 4 : 0
    },
    {
      id: "keyword_in_headings",
      label: "Keyword in Subheadings",
      points: 4,
      passed: focusKeyword.length > 0 && keywordInSubheading,
      feedback: focusKeyword.length > 0 && keywordInSubheading ? "Focus keyword found in subheadings." : "Focus keyword not found in subheadings.",
      recommendation: "Include Focus Keyword in a Heading",
      earned: focusKeyword.length > 0 && keywordInSubheading ? 4 : 0
    },
    {
      id: "keyword_density",
      label: "Keyword Density",
      points: 6,
      passed: focusKeyword.length > 0 && density >= 0.5 && density <= 2.5,
      feedback: focusKeyword.length > 0 && density >= 0.5 && density <= 2.5 ? `Optimal density: ${density.toFixed(2)}%.` : focusKeyword.length === 0 ? "No focus keyword." : `Density is ${density.toFixed(2)}% (aim for 0.5%-2.5%).`,
      recommendation: focusKeyword.length > 0 && (density < 0.5 || density > 2.5) ? "Improve Keyword Density" : undefined,
      earned: focusKeyword.length > 0 && density >= 0.5 && density <= 2.5 ? 6 : (focusKeyword.length > 0 && density > 0 ? 2 : 0)
    },
    {
      id: "internal_links",
      label: "Internal Links",
      points: 5,
      passed: totalInternal >= 2,
      feedback: totalInternal >= 2 ? `Strong internal structure (${totalInternal} links).` : `Found ${totalInternal} internal link(s).`,
      recommendation: totalInternal < 2 ? "Add more Internal Links" : undefined,
      earned: totalInternal >= 2 ? 5 : (totalInternal === 1 ? 3 : 0)
    },
    {
      id: "external_links",
      label: "External Links",
      points: 5,
      passed: totalExternal >= 1,
      feedback: totalExternal >= 1 ? `${totalExternal} external authority link(s) found.` : "No external links.",
      recommendation: totalExternal === 0 ? "Add at least one External Link" : undefined,
      earned: totalExternal >= 2 ? 5 : (totalExternal === 1 ? 3 : 0)
    },
    {
      id: "image_alt_text",
      label: "Image Alt Text",
      points: 3,
      passed: imageAlt.length > 0,
      feedback: imageAlt.length > 0 ? `Alt text configured.` : "Alt text is missing.",
      recommendation: "Add Image ALT Text",
      earned: imageAlt.length > 0 ? 3 : 0
    },
    {
      id: "keyword_in_alt",
      label: "Keyword in Alt Text",
      points: 3,
      passed: focusKeyword.length > 0 && imageAlt.toLowerCase().includes(focusKeyword.toLowerCase()),
      feedback: focusKeyword.length > 0 && imageAlt.toLowerCase().includes(focusKeyword.toLowerCase()) ? "Focus keyword found in image alt text." : "Focus keyword missing from alt text.",
      recommendation: "Include keyword in Alt Text",
      earned: focusKeyword.length > 0 && imageAlt.toLowerCase().includes(focusKeyword.toLowerCase()) ? 3 : 0
    },
    {
      id: "featured_image",
      label: "Featured Image",
      points: 4,
      passed: !!currentPost.coverImage,
      feedback: currentPost.coverImage ? "Featured image set." : "Featured image is missing.",
      recommendation: "Set a Featured Image",
      earned: currentPost.coverImage ? 4 : 0
    },
    {
      id: "readability",
      label: "Content Readability",
      points: 5,
      passed: readabilityScore >= 60,
      feedback: `Readability score is ${readabilityScore}/100 (${readabilityLabel}).`,
      recommendation: readabilityScore < 60 ? "Improve Readability" : undefined,
      earned: readabilityScore >= 60 ? 5 : (readabilityScore >= 40 ? 3 : 1)
    },
    {
      id: "schema_markup",
      label: "Schema Markup",
      points: 6,
      passed: currentPost.schemaType === "FAQPage" && isSchemaValidJson,
      feedback: currentPost.schemaType === "FAQPage" && isSchemaValidJson ? "FAQ Schema is active and valid." : currentPost.schemaType ? `Schema preset is "${currentPost.schemaType}".` : "No schema markup.",
      recommendation: currentPost.schemaType !== "FAQPage" || !isSchemaValidJson ? "Add FAQ Schema" : undefined,
      earned: isSchemaValidJson ? 6 : 0
    },
    {
      id: "tags_configured",
      label: "Tags",
      points: 5,
      passed: (currentPost.tags?.length || 0) >= 2 && currentPost.tags?.some(t => t.toLowerCase().includes(focusKeyword.toLowerCase())),
      feedback: (currentPost.tags?.length || 0) >= 2 ? "Tags configured correctly." : "Tags are incomplete.",
      recommendation: "Add tags with Focus Keyword",
      earned: (currentPost.tags?.length || 0) >= 2 && currentPost.tags?.some(t => t.toLowerCase().includes(focusKeyword.toLowerCase())) ? 5 : ((currentPost.tags?.length || 0) >= 2 ? 3 : 1)
    },
    {
      id: "category_configured",
      label: "Category",
      points: 3,
      passed: !!currentPost.category && currentPost.category.toLowerCase() !== "uncategorized",
      feedback: `Post category is "${currentPost.category}".`,
      recommendation: "Assign a relevant Category",
      earned: !!currentPost.category && currentPost.category.toLowerCase() !== "uncategorized" ? 3 : 0
    },
    {
      id: "canonical",
      label: "Canonical URL",
      points: 3,
      passed: !!currentPost.canonicalUrl && currentPost.canonicalUrl.startsWith("http"),
      feedback: `Canonical URL defined: "${currentPost.canonicalUrl}".`,
      recommendation: "Add Canonical URL",
      earned: !!currentPost.canonicalUrl && currentPost.canonicalUrl.startsWith("http") ? 3 : 0
    },
    {
      id: "og_settings",
      label: "Open Graph Settings",
      points: 3,
      passed: !!currentPost.ogTitle && !!currentPost.ogDescription && !!currentPost.ogImage,
      feedback: "Open Graph social titles and descriptions are configured.",
      recommendation: "Configure Open Graph Settings",
      earned: !!currentPost.ogTitle && !!currentPost.ogDescription && !!currentPost.ogImage ? 3 : 0
    },
    {
      id: "twitter_card",
      label: "Twitter Card",
      points: 2,
      passed: !!currentPost.twitterCard,
      feedback: `Twitter card format is "${currentPost.twitterCard}".`,
      recommendation: "Configure Twitter Card Settings",
      earned: !!currentPost.twitterCard ? 2 : 0
    }
  ] : [];

  // Exact list of recommendations specified by the user
  const recommendationsList: string[] = [];
  if (currentPost) {
    if (!focusKeyword) {
      recommendationsList.push("Missing Focus Keyword");
    }
    if (!desc || desc.length < 100) {
      recommendationsList.push("Meta Description is too short");
    }
    if (totalInternal < 2) {
      recommendationsList.push("Add more Internal Links");
    }
    if (totalExternal === 0) {
      recommendationsList.push("Add at least one External Link");
    }
    if (words < 300) {
      recommendationsList.push("Increase Word Count");
    }
    if (focusKeyword && (density < 0.5 || density > 2.5)) {
      recommendationsList.push("Improve Keyword Density");
    }
    if (!imageAlt) {
      recommendationsList.push("Add Image ALT Text");
    }
    if (currentPost.schemaType !== "FAQPage" || !isSchemaValidJson) {
      recommendationsList.push("Add FAQ Schema");
    }
    if (!hasSubheadings || (focusKeyword && !keywordInSubheading)) {
      recommendationsList.push("Improve Heading Structure");
    }
  }

  // Calculate dynamic overall score out of exactly 100
  const overallScore = currentPost ? Math.max(0, Math.min(100, rules.reduce((acc, r) => acc + r.earned, 0))) : 0;
  const passedCount = currentPost ? rules.filter(r => r.passed).length : 0;

  return (
    <div className="space-y-6 text-left" id="wp-seo-editor-section">
      {/* Header Bar with select & buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d9b45c]/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-[#d9b45c]/10 text-[#d9b45c]">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-white">Advanced Gutenberg Post Editor</h2>
            <div className="flex items-center space-x-2 text-[10px] text-[#c9c2ab] mt-0.5">
              <span>Editing Article:</span>
              <select
                value={selectedPostId || ""}
                onChange={(e) => setSelectedPostId(e.target.value)}
                className="bg-[#07080b] border border-[#d9b45c]/25 rounded px-2 py-0.5 text-[#d9b45c] text-[10px] font-sans font-bold outline-none"
              >
                {cmsData.blogPosts.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleAddNewPost}
            className="flex items-center space-x-1 px-3.5 py-2 text-[10px] font-sans font-extrabold uppercase tracking-widest text-black bg-[#d9b45c] rounded-lg hover:bg-[#f2d98a] transition-all cursor-pointer"
          >
            <Plus size={12} />
            <span>New Post</span>
          </button>
          <button
            onClick={() => handleDeletePost(currentPost?.id)}
            className="p-2 text-red-400 border border-red-500/10 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            title="Delete active post"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {currentPost ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Main Writing Space (8 cols) */}
          <div className="xl:col-span-8 space-y-6">
            <div className="space-y-4 bg-[#12141b]/50 border border-[#d9b45c]/10 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-[#d9b45c]">Gutenberg Content Builder</span>
                <span className="text-[10px] text-[#c9c2ab]/50 font-mono">ID: {currentPost.id}</span>
              </div>

              {/* Title / Headline */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] tracking-wider">Article Headline (H1)</label>
                <input
                  type="text"
                  value={currentPost.title}
                  onChange={(e) => handleUpdateField("title", e.target.value)}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d9b45c] transition-colors font-sans font-bold"
                  placeholder="Enter main headline..."
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] tracking-wider">Excerpt / Short Description</label>
                <textarea
                  value={currentPost.excerpt}
                  rows={2}
                  onChange={(e) => handleUpdateField("excerpt", e.target.value)}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/15 rounded-xl px-4 py-2.5 text-xs text-[#c9c2ab] focus:outline-none focus:border-[#d9b45c] transition-colors resize-none leading-relaxed"
                  placeholder="Summarize this article..."
                />
              </div>

              {/* Main Text Body with live HTML preview */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab] tracking-wider flex items-center space-x-1.5">
                    <span>Main Article Content Body (HTML supported)</span>
                  </label>
                  <div className="flex items-center space-x-3 text-[9px] font-mono text-[#c9c2ab]/50 bg-[#07080b] px-2.5 py-1 rounded-md border border-white/5">
                    <span className="flex items-center space-x-1">
                      <Clock size={10} className="text-[#d9b45c]" />
                      <span>{currentPost.readTime}</span>
                    </span>
                    <span>Words: <strong>{words}</strong></span>
                  </div>
                </div>
                <textarea
                  value={currentPost.content}
                  rows={14}
                  onChange={(e) => handleUpdateField("content", e.target.value)}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/15 rounded-xl px-4 py-3 text-xs text-[#c9c2ab] focus:outline-none focus:border-[#d9b45c] transition-colors font-mono leading-relaxed"
                  placeholder="Write your beautiful content with heading tags like <h2>, paragraph tags <p>, etc..."
                />
              </div>

              {/* Featured Image URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab] tracking-wider flex items-center space-x-1">
                    <ImageIcon size={10} className="text-[#d9b45c]" />
                    <span>Featured Image URL</span>
                  </label>
                  <input
                    type="text"
                    value={currentPost.coverImage}
                    onChange={(e) => handleUpdateField("coverImage", e.target.value)}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] transition-colors font-mono text-[11px]"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab] tracking-wider flex items-center space-x-1">
                    <Tag size={10} className="text-[#d9b45c]" />
                    <span>Featured Image ALT text</span>
                  </label>
                  <input
                    type="text"
                    value={currentPost.imageAltText || ""}
                    onChange={(e) => handleUpdateField("imageAltText", e.target.value)}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d9b45c] transition-colors"
                    placeholder="Describe image for SEO alt text..."
                  />
                </div>
              </div>

              {/* Inline visual rendering of the featured image banner */}
              {currentPost.coverImage && (
                <div className="pt-2">
                  <span className="text-[9px] uppercase font-sans font-bold text-[#c9c2ab]/50 block mb-1">Live Featured Image Banner Preview:</span>
                  <div className="relative h-44 rounded-xl overflow-hidden border border-[#d9b45c]/20">
                    <img 
                      src={currentPost.coverImage} 
                      alt={currentPost.imageAltText || "Featured cover banner"} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider font-bold bg-[#d9b45c] text-black px-1.5 py-0.5 rounded mr-2">{currentPost.category}</span>
                        <h4 className="text-white text-xs font-serif font-bold mt-1 line-clamp-1">{currentPost.title}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: THE SEO SIDEBAR (Yoast / Rank Math Pro Style) (4 cols) */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* 1. SEO SCORE RING & METRICS RADIAL GAUGE */}
            <div className="bg-[#12141b] border border-[#d9b45c]/15 rounded-2xl p-5 text-center space-y-4 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
              
              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <span className="text-[9px] uppercase font-sans font-extrabold tracking-widest text-[#d9b45c]">
                  Rank Math Pro Live Analysis
                </span>
                <span className="text-[8px] font-mono text-[#c9c2ab]/50 uppercase">Active</span>
              </div>
              
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                {/* SVG Circle chart */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#1e2230"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={overallScore > 80 ? "#10b981" : overallScore > 50 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallScore / 100)}`}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-serif font-extrabold text-white leading-none">{overallScore}</span>
                  <span className="text-[8px] font-sans font-bold text-[#c9c2ab]/60 uppercase tracking-widest mt-1">
                    {overallScore > 80 ? "Excellent" : overallScore > 50 ? "Needs Work" : "Critical"}
                  </span>
                </div>
              </div>

              {/* Dynamic Metrics Badge Grid */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5">
                <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                  <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Word Count</span>
                  <span className="text-xs font-bold text-white font-mono">{words}</span>
                </div>
                <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                  <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Keyword %</span>
                  <span className={`text-xs font-bold font-mono ${density >= 0.5 && density <= 2.5 ? "text-green-400" : "text-yellow-400"}`}>
                    {density.toFixed(2)}%
                  </span>
                </div>
                <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                  <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Readability</span>
                  <span className={`text-xs font-bold ${readabilityScore >= 60 ? "text-green-400" : "text-yellow-500"}`}>
                    {readabilityScore}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. LIVE SEARCH ENGINE GOOGLE SERP PREVIEW */}
            <div className="bg-[#12141b]/80 border border-[#d9b45c]/10 rounded-2xl p-4 space-y-2">
              <span className="text-[9px] uppercase font-sans font-bold text-[#d9b45c] tracking-widest flex items-center space-x-1">
                <Eye size={12} />
                <span>Google SERP Snippet Preview</span>
              </span>
              <div className="bg-white text-black p-3.5 rounded-xl space-y-1 text-left font-sans select-text shadow-md">
                <div className="text-[10px] text-[#202124] flex items-center space-x-1 font-sans">
                  <span>https://truthquranacademy.com</span>
                  <span className="text-gray-400 font-normal">› blog › {(slug || "article").toLowerCase()}</span>
                </div>
                <h4 className="text-sm font-sans text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight line-clamp-1">
                  {title || `${currentPost.title} | Academy`}
                </h4>
                <p className="text-[11px] text-[#4d5156] leading-normal line-clamp-2 font-light">
                  {desc || "No meta description defined. Google will automatically display text extracted from the first paragraph of your blog post instead."}
                </p>
              </div>
            </div>

            {/* 3. DYNAMIC SEO RECOMMENDATIONS PANEL */}
            <div className="bg-[#12141b]/60 border border-[#d9b45c]/12 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-sans font-extrabold text-[#f3ecd8] uppercase tracking-widest flex items-center justify-between pb-1.5 border-b border-[#d9b45c]/10">
                <span>Recommendations to Fix</span>
                <span className="text-[8px] font-mono text-[#d9b45c] bg-[#d9b45c]/5 border border-[#d9b45c]/15 px-2 py-0.5 rounded">
                  {recommendationsList.length} REMAINING
                </span>
              </h3>

              <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                {recommendationsList.length > 0 ? (
                  recommendationsList.map((rec, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs bg-[#ef4444]/5 border border-[#ef4444]/10 rounded-lg p-2.5">
                      <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-sans font-extrabold block text-[10px] uppercase text-red-400">
                          {rec}
                        </span>
                        <p className="text-[9px] text-[#c9c2ab] leading-snug mt-0.5">
                          {rec === "Missing Focus Keyword" ? "Add a Focus Keyword to the sidebar input to unlock full analysis." :
                           rec === "Meta Description is too short" ? "Write a meta description between 100-160 characters containing your keyword." :
                           rec === "Add more Internal Links" ? "Link to other pages of Truth Quran Academy to pass site architecture tests." :
                           rec === "Add at least one External Link" ? "Add links pointing to authority education sites like Wikipedia or scholars." :
                           rec === "Increase Word Count" ? "Write at least 300 words (ideally 600+) for substantial coverage." :
                           rec === "Improve Keyword Density" ? "Maintain focus keyword repetition density between 0.5% and 2.5%." :
                           rec === "Add Image ALT Text" ? "Add a short description inside the featured image Alt Text box." :
                           rec === "Add FAQ Schema" ? "Choose the FAQ Schema preset and compile dynamic structured data." :
                           "Organize with hierarchical subheadings (H2, H3) and insert focus keywords."}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 bg-green-500/5 border border-green-500/10 rounded-xl space-y-2">
                    <Check size={28} className="text-green-400" />
                    <span className="text-[11px] font-sans font-bold text-green-400 uppercase tracking-wider">All checks passed!</span>
                    <p className="text-[9px] text-[#c9c2ab]">Your blog article is 100% on-page SEO optimized and ready for publishing.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. THE INTEGRATED SEO SIDEBAR CONFIG PANEL */}
            <div className="space-y-3">
              
              {/* SECTION A: KEYWORD & TITLE META (Accordion) */}
              <div className="bg-[#12141b]/50 border border-white/5 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("meta")}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#12141b]/80 text-[#f3ecd8] font-sans font-bold text-xs uppercase tracking-wider border-b border-white/5 hover:bg-[#d9b45c]/5 transition-colors text-left"
                >
                  <span className="flex items-center space-x-2">
                    <Sparkles size={13} className="text-[#d9b45c]" />
                    <span>Focus Keyword & Snippet</span>
                  </span>
                  {expandedSections.meta ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expandedSections.meta && (
                  <div className="p-4 space-y-3.5">
                    {/* Focus Keyword */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Focus Keyword</label>
                        <span className="text-[8px] font-mono text-[#d9b45c] bg-[#d9b45c]/5 px-1 rounded">PRO</span>
                      </div>
                      <input
                        type="text"
                        value={currentPost.focusKeyword || ""}
                        onChange={(e) => handleUpdateField("focusKeyword", e.target.value)}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-[#f2d98a] font-bold outline-none focus:border-[#d9b45c]"
                        placeholder="e.g. Tajweed"
                      />
                    </div>

                    {/* SEO Title */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">SEO Title Tag</label>
                      <input
                        type="text"
                        value={currentPost.metaTitle || ""}
                        onChange={(e) => handleUpdateField("metaTitle", e.target.value)}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#d9b45c]"
                        placeholder="Fallback to Article Title..."
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">URL Slug</label>
                      <input
                        type="text"
                        value={currentPost.slug || ""}
                        onChange={(e) => handleUpdateField("slug", e.target.value)}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white font-mono outline-none focus:border-[#d9b45c]"
                        placeholder="rules-of-tajweed"
                      />
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Meta Description</label>
                        <span className={`text-[8px] font-mono ${desc.length >= 100 && desc.length <= 160 ? "text-green-400" : "text-yellow-500"}`}>
                          {desc.length}/160 chars
                        </span>
                      </div>
                      <textarea
                        value={currentPost.metaDescription || ""}
                        rows={3}
                        onChange={(e) => handleUpdateField("metaDescription", e.target.value)}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-[#c9c2ab] outline-none focus:border-[#d9b45c] resize-none leading-relaxed"
                        placeholder="Write a concise meta snippet..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION B: LINKS & TAXONOMIES (Accordion) */}
              <div className="bg-[#12141b]/50 border border-white/5 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("links")}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#12141b]/80 text-[#f3ecd8] font-sans font-bold text-xs uppercase tracking-wider border-b border-white/5 hover:bg-[#d9b45c]/5 transition-colors text-left"
                >
                  <span className="flex items-center space-x-2">
                    <Link2 size={13} className="text-[#d9b45c]" />
                    <span>Links & Organization</span>
                  </span>
                  {expandedSections.links ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expandedSections.links && (
                  <div className="p-4 space-y-3.5">
                    {/* Tags */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={currentPost.tags ? currentPost.tags.join(", ") : ""}
                        onChange={(e) => handleUpdateField("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                        placeholder="Tajweed, Recitation, Hifz"
                      />
                      {currentPost.tags && currentPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {currentPost.tags.map((tag, idx) => (
                            <span key={idx} className="bg-[#d9b45c]/10 text-[#f2d98a] border border-[#d9b45c]/20 text-[9px] px-1.5 py-0.5 rounded font-sans font-bold">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Primary Category</label>
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

                    {/* Custom simulated links counting */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Internal Links</label>
                        <input
                          type="number"
                          value={currentPost.internalLinksCount || 0}
                          onChange={(e) => handleUpdateField("internalLinksCount", parseInt(e.target.value) || 0)}
                          className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white text-center font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">External Links</label>
                        <input
                          type="number"
                          value={currentPost.externalLinksCount || 0}
                          onChange={(e) => handleUpdateField("externalLinksCount", parseInt(e.target.value) || 0)}
                          className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg px-3 py-1.5 text-xs text-white text-center font-bold"
                        />
                      </div>
                    </div>

                    {/* Canonical URL */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Canonical URL Override</label>
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

              {/* SECTION C: SCHEMA & STRUCTURED DATA (Accordion) */}
              <div className="bg-[#12141b]/50 border border-white/5 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("schema")}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#12141b]/80 text-[#f3ecd8] font-sans font-bold text-xs uppercase tracking-wider border-b border-white/5 hover:bg-[#d9b45c]/5 transition-colors text-left"
                >
                  <span className="flex items-center space-x-2">
                    <Code size={13} className="text-[#d9b45c]" />
                    <span>Schema Markup & Structured Data</span>
                  </span>
                  {expandedSections.schema ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expandedSections.schema && (
                  <div className="p-4 space-y-3.5">
                    {/* Schema Type Preset */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-[#c9c2ab] block">Apply Schema Preset</label>
                      <div className="flex flex-wrap gap-1.5">
                        {schemaPresets.map(preset => (
                          <button
                            type="button"
                            key={preset.type}
                            onClick={() => handleApplySchemaPreset(preset.type)}
                            className={`px-2 py-1 rounded text-[8px] font-sans font-bold uppercase border transition-all cursor-pointer ${
                              currentPost.schemaType === preset.type
                                ? "bg-[#d9b45c] text-black border-[#d9b45c]"
                                : "bg-[#07080b] text-[#c9c2ab] border-white/10 hover:border-white/30"
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Schema JSON Textarea with Validation Badge */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">LD+JSON Schema Output</label>
                        {isSchemaValidJson ? (
                          <span className="text-[8px] font-mono bg-green-500/10 text-green-400 border border-green-500/20 px-1 py-0.5 rounded font-bold uppercase">
                            Validated
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-1 py-0.5 rounded font-bold uppercase">
                            Syntax Error
                          </span>
                        )}
                      </div>
                      <textarea
                        value={currentPost.customSchemaJson || ""}
                        rows={6}
                        onChange={(e) => handleUpdateField("customSchemaJson", e.target.value)}
                        className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-lg p-2 text-xs text-green-400 font-mono leading-normal focus:border-[#d9b45c]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION D: SOCIAL SHARE PREVIEWS & OPEN GRAPH (Accordion) */}
              <div className="bg-[#12141b]/50 border border-white/5 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("social")}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#12141b]/80 text-[#f3ecd8] font-sans font-bold text-xs uppercase tracking-wider border-b border-white/5 hover:bg-[#d9b45c]/5 transition-colors text-left"
                >
                  <span className="flex items-center space-x-2">
                    <Share2 size={13} className="text-[#d9b45c]" />
                    <span>Social Media Previews</span>
                  </span>
                  {expandedSections.social ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expandedSections.social && (
                  <div className="p-4 space-y-3.5">
                    {/* OG Title */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Facebook / LinkedIn Title (og:title)</label>
                      <input
                        type="text"
                        value={currentPost.ogTitle || ""}
                        onChange={(e) => handleUpdateField("ogTitle", e.target.value)}
                        className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                        placeholder="Custom title for FB shares..."
                      />
                    </div>

                    {/* OG Description */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Social Description (og:description)</label>
                      <textarea
                        value={currentPost.ogDescription || ""}
                        rows={2}
                        onChange={(e) => handleUpdateField("ogDescription", e.target.value)}
                        className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white resize-none"
                        placeholder="Custom summary description for FB shares..."
                      />
                    </div>

                    {/* OG Image */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Share Banner URL (og:image)</label>
                      <input
                        type="text"
                        value={currentPost.ogImage || ""}
                        onChange={(e) => handleUpdateField("ogImage", e.target.value)}
                        className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono text-[10px]"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Twitter Card Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-[#c9c2ab]">Twitter/X Card Type</label>
                      <select
                        value={currentPost.twitterCard || "summary_large_image"}
                        onChange={(e) => handleUpdateField("twitterCard", e.target.value)}
                        className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                      >
                        <option value="summary">summary</option>
                        <option value="summary_large_image">summary_large_image</option>
                        <option value="app">app</option>
                        <option value="player">player</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION E: PASSED AUDITS (Accordion) */}
              <div className="bg-[#12141b]/50 border border-white/5 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("passed")}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#12141b]/80 text-[#f3ecd8] font-sans font-bold text-xs uppercase tracking-wider border-b border-white/5 hover:bg-[#d9b45c]/5 transition-colors text-left"
                >
                  <span className="flex items-center space-x-2">
                    <Check size={13} className="text-green-400" />
                    <span>Passed Audits ({passedCount})</span>
                  </span>
                  {expandedSections.passed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expandedSections.passed && (
                  <div className="p-4 space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {rules.filter(r => r.passed).map((rule, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-[11px] pb-1.5 border-b border-white/5 last:border-b-0 last:pb-0">
                        <Check size={12} className="text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-sans font-bold text-green-400 text-[9px] uppercase block">{rule.label}</span>
                          <span className="text-[#c9c2ab] text-[9px] font-sans block leading-snug">{rule.feedback}</span>
                        </div>
                      </div>
                    ))}
                    {passedCount === 0 && (
                      <div className="text-[10px] text-[#c9c2ab]/50 text-center py-2">No audits passed yet.</div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div className="p-12 text-center bg-[#12141b] rounded-2xl border border-[#d9b45c]/10 text-[#c9c2ab]">
          No posts available in the simulator database. Create one to get started!
        </div>
      )}
    </div>
  );
}
