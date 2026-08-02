import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Heading4,
  List, 
  Quote, 
  Table as TableIcon, 
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
  Maximize2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layout,
  ListOrdered,
  FileCode,
  HelpCircle as FaqIcon,
  Video,
  Download,
  Minus,
  MessageSquare,
  Code2,
  Grid,
  Layers,
  ArrowUp,
  ArrowDown,
  Edit3
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
  const currentPostIndex = posts.findIndex((p) => p.id === selectedPostId || p.slug === selectedPostId);
  const activePost = currentPostIndex !== -1 ? posts[currentPostIndex] : posts[0] || null;

  // Local Editable Post State
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(activePost);

  useEffect(() => {
    if (activePost) {
      setCurrentPost({
        ...activePost,
        status: activePost.status || "published",
        title: activePost.title || "",
        content: activePost.content || "",
        excerpt: activePost.excerpt || "",
        metaTitle: activePost.metaTitle || activePost.title || "",
        metaDescription: activePost.metaDescription || activePost.excerpt || "",
        focusKeyword: activePost.focusKeyword || "",
        slug: activePost.slug || activePost.id || "post-slug",
        robotsMeta: activePost.robotsMeta || "index, follow",
        ogTitle: activePost.ogTitle || activePost.title || "",
        ogDescription: activePost.ogDescription || activePost.excerpt || "",
        ogImage: activePost.ogImage || activePost.coverImage || "",
        twitterTitle: activePost.twitterTitle || activePost.title || "",
        twitterDescription: activePost.twitterDescription || activePost.excerpt || "",
        twitterCard: activePost.twitterCard || "summary_large_image",
        coverImage: activePost.coverImage || "",
        featuredImage: activePost.featuredImage || activePost.coverImage || "",
        imageAltText: activePost.imageAltText || "",
        imageTitle: activePost.imageTitle || "",
        imageCaption: activePost.imageCaption || "",
        imageDescription: activePost.imageDescription || "",
        imageFileName: activePost.imageFileName || "",
        internalLinksCount: activePost.internalLinksCount !== undefined ? activePost.internalLinksCount : 0,
        externalLinksCount: activePost.externalLinksCount !== undefined ? activePost.externalLinksCount : 0,
        schemaType: activePost.schemaType || "Article",
        customSchemaJson: activePost.customSchemaJson || ""
      });
    }
  }, [selectedPostId, posts.length]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // View / Device mode (desktop, tablet, mobile)
  const [deviceFrame, setDeviceFrame] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Dual Editor Mode (Visual vs HTML Code)
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");

  // Accordions open states in sidebar
  const [expandedSections, setExpandedSections] = useState({
    meta: true,
    imageSeo: true,
    links: false,
    schema: false,
    social: false,
    publishing: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Modals state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashSearch, setSlashSearch] = useState("");
  
  const [showInternalLinkModal, setShowInternalLinkModal] = useState(false);
  const [internalLinkSearch, setInternalLinkSearch] = useState("");
  const [internalLinkTab, setInternalLinkTab] = useState<"posts" | "pages" | "courses">("posts");

  const [showExternalLinkModal, setShowExternalLinkModal] = useState(false);
  const [extLinkUrl, setExtLinkUrl] = useState("https://");
  const [extLinkText, setExtLinkText] = useState("External Reference");

  // Internal Images Manager Modal State
  const [showInternalImagesModal, setShowInternalImagesModal] = useState(false);
  const [internalImgSearch, setInternalImgSearch] = useState("");
  const [selectedInternalImages, setSelectedInternalImages] = useState<string[]>([]);
  const [imgAlign, setImgAlign] = useState<"left" | "center" | "right">("center");
  const [imgWidth, setImgWidth] = useState<string>("100%");
  const [imgAltText, setImgAltText] = useState<string>("");
  const [imgCaptionText, setImgCaptionText] = useState<string>("");
  const [imgTitleText, setImgTitleText] = useState<string>("");

  // Media Library Upload Modal
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<"featured" | "internal">("featured");

  // Crop / Image Tool Modal
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropBrightness, setCropBrightness] = useState(100);
  const [cropContrast, setCropContrast] = useState(100);

  const featuredFileInputRef = useRef<HTMLInputElement>(null);
  const internalFileInputRef = useRef<HTMLInputElement>(null);

  // Field updater
  const handleUpdateField = (field: keyof BlogPost, value: any) => {
    if (!currentPost) return;
    setCurrentPost((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // 2. Dynamic Content Analysis Engine
  const contentStats = useMemo(() => {
    if (!currentPost) return { words: 0, sentences: 0, paragraphs: 0, readingTime: "0 min" };
    const htmlContent = currentPost.content || "";
    const stripped = htmlContent.replace(/<[^>]*>/g, " ");
    const wordList = stripped.trim() ? stripped.trim().split(/\s+/).filter(Boolean) : [];
    const words = wordList.length;
    const sentenceList = stripped.split(/[.!?]+/).filter((s) => s.trim().length > 2);
    const sentences = sentenceList.length || 0;
    const pList = htmlContent.split(/<\/p>|<br\s*\/?>|\n\n+/).filter((p) => p.trim().length > 0);
    const paragraphs = pList.length || 0;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    return {
      words,
      sentences,
      paragraphs,
      readingTime: `${readTimeMinutes} min read`
    };
  }, [currentPost?.content]);

  // 3. REAL-TIME RANK MATH PRO SEO SCORE ENGINE (Starts from 0% for new/unoptimized posts)
  const seoAnalysis = useMemo(() => {
    if (!currentPost) {
      return {
        score: 0,
        readability: 0,
        keywordDensity: 0,
        rules: [],
        passedCount: 0,
        failedCount: 0,
        recommendations: []
      };
    }

    const keyword = (currentPost.focusKeyword || "").trim().toLowerCase();
    const title = (currentPost.title || "").trim();
    const titleLower = title.toLowerCase();
    const metaTitle = (currentPost.metaTitle || "").trim().toLowerCase();
    const metaDesc = (currentPost.metaDescription || "").trim();
    const metaDescLower = metaDesc.toLowerCase();
    const slug = (currentPost.slug || "").trim().toLowerCase();
    const htmlContent = (currentPost.content || "").trim();
    const htmlContentLower = htmlContent.toLowerCase();
    const plainText = htmlContent.replace(/<[^>]*>/g, " ");
    const plainTextLower = plainText.toLowerCase();

    const words = contentStats.words;
    let rules: Array<{ id: string; label: string; category: string; passed: boolean; feedback: string; points: number }> = [];

    // Rule 1: Focus Keyword Defined
    const hasKeyword = keyword.length >= 2;
    rules.push({
      id: "has_keyword",
      label: "Focus Keyword Defined",
      category: "Basic SEO",
      passed: hasKeyword,
      feedback: hasKeyword ? `Target keyword set to "${keyword}".` : "Specify a focus keyword for Rank Math analysis.",
      points: 10
    });

    // Rule 2: Focus Keyword in Post Title
    const kwInTitle = hasKeyword ? titleLower.includes(keyword) || metaTitle.includes(keyword) : false;
    rules.push({
      id: "kw_title",
      label: "Focus Keyword in Title",
      category: "Basic SEO",
      passed: kwInTitle,
      feedback: kwInTitle ? "Focus keyword appears in post title." : "Include your focus keyword in the article title.",
      points: 10
    });

    // Rule 3: Focus Keyword in Permalink Slug
    const kwInSlug = hasKeyword ? slug.includes(keyword.replace(/\s+/g, "-")) || slug.includes(keyword) : false;
    rules.push({
      id: "kw_slug",
      label: "Focus Keyword in URL / Slug",
      category: "Basic SEO",
      passed: kwInSlug,
      feedback: kwInSlug ? "Permalink slug contains focus keyword." : "Include focus keyword in the URL slug.",
      points: 10
    });

    // Rule 4: Focus Keyword in Meta Description
    const kwInDesc = hasKeyword ? metaDescLower.includes(keyword) : false;
    rules.push({
      id: "kw_desc",
      label: "Focus Keyword in Meta Description",
      category: "Basic SEO",
      passed: kwInDesc,
      feedback: kwInDesc ? "Focus keyword found in meta description." : "Add focus keyword to the meta description.",
      points: 10
    });

    // Rule 5: Focus Keyword in First 10% Content / First Paragraph
    const firstPart = plainTextLower.slice(0, Math.max(200, Math.floor(plainTextLower.length * 0.15)));
    const kwInFirst = hasKeyword ? firstPart.includes(keyword) : false;
    rules.push({
      id: "kw_first_paragraph",
      label: "Focus Keyword in First Paragraph",
      category: "Basic SEO",
      passed: kwInFirst,
      feedback: kwInFirst ? "Focus keyword appears early in opening paragraph." : "Mention focus keyword in the first paragraph.",
      points: 10
    });

    // Rule 6: Focus Keyword in Subheadings (H2, H3)
    const headingsText = (htmlContent.match(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi) || []).join(" ").toLowerCase();
    const kwInHeadings = hasKeyword ? headingsText.includes(keyword) : false;
    rules.push({
      id: "kw_headings",
      label: "Focus Keyword in Subheadings (H2/H3)",
      category: "Content Readability",
      passed: kwInHeadings,
      feedback: kwInHeadings ? "Focus keyword used inside H2/H3 subheadings." : "Use focus keyword in at least one H2/H3 subheading.",
      points: 8
    });

    // Rule 7: Keyword Density (0.5% - 2.5%)
    let kwOccurrences = 0;
    if (hasKeyword && words > 0) {
      const regex = new RegExp(`\\b${keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "gi");
      kwOccurrences = (plainText.match(regex) || []).length;
    }
    const keywordDensity = words > 0 && hasKeyword ? (kwOccurrences / words) * 100 : 0;
    const kwDensityPassed = keywordDensity >= 0.5 && keywordDensity <= 2.5;
    rules.push({
      id: "kw_density",
      label: "Keyword Density (0.5% - 2.5%)",
      category: "Additional SEO",
      passed: kwDensityPassed,
      feedback: kwDensityPassed 
        ? `Keyword density is optimal (${keywordDensity.toFixed(2)}%).`
        : keywordDensity === 0 
          ? "Focus keyword does not appear in body content."
          : `Keyword density is ${keywordDensity.toFixed(2)}% (Target: 0.5% - 2.5%).`,
      points: 10
    });

    // Rule 8: Word Count >= 300 words
    const lengthPassed = words >= 300;
    rules.push({
      id: "word_count",
      label: "Content Length (300+ Words)",
      category: "Basic SEO",
      passed: lengthPassed,
      feedback: lengthPassed 
        ? `Content is ${words} words long.` 
        : `Content is only ${words} words. Aim for at least 300-600 words.`,
      points: 10
    });

    // Rule 9: Featured Image Set & Alt Text
    const imageSet = Boolean(currentPost.coverImage || currentPost.featuredImage);
    const altSet = (currentPost.imageAltText || "").trim().length > 3;
    const imgPassed = imageSet && altSet;
    rules.push({
      id: "featured_image",
      label: "Featured Image & Alt Text",
      category: "Additional SEO",
      passed: imgPassed,
      feedback: imgPassed ? "Featured image set with descriptive ALT text." : "Set a featured image and add ALT text.",
      points: 8
    });

    // Rule 10: Internal Links Present
    const internalLinks = currentPost.internalLinksCount || 0;
    const internalPassed = internalLinks >= 1 || /href=["']\//i.test(htmlContent) || /truthquranacademy\.com/i.test(htmlContent);
    rules.push({
      id: "internal_links",
      label: "Internal Linking Present",
      category: "Additional SEO",
      passed: internalPassed,
      feedback: internalPassed ? "Internal links found pointing to Academy resources." : "Include at least one internal link to another page.",
      points: 7
    });

    // Rule 11: External Links Present
    const externalLinks = currentPost.externalLinksCount || 0;
    const externalPassed = externalLinks >= 1 || /href=["']http/i.test(htmlContent);
    rules.push({
      id: "external_links",
      label: "Outbound External Links",
      category: "Additional SEO",
      passed: externalPassed,
      feedback: externalPassed ? "Outbound external references included." : "Include an external reference link.",
      points: 5
    });

    // Rule 12: Title Length (40 - 60 Chars)
    const titleLen = title.length;
    const titleLenPassed = titleLen >= 30 && titleLen <= 65;
    rules.push({
      id: "title_length",
      label: "Title Length (30 - 65 Chars)",
      category: "Title Readability",
      passed: titleLenPassed,
      feedback: titleLenPassed ? `Title is ${titleLen} characters (Optimal).` : `Title is ${titleLen} characters (Target: 30-65 chars).`,
      points: 4
    });

    // Rule 13: Meta Description Length (100 - 160 Chars)
    const descLen = metaDesc.length;
    const descLenPassed = descLen >= 90 && descLen <= 160;
    rules.push({
      id: "desc_length",
      label: "Meta Description Length (90 - 160 Chars)",
      category: "Title Readability",
      passed: descLenPassed,
      feedback: descLenPassed ? `Meta description is ${descLen} characters (Optimal).` : `Meta description is ${descLen} characters (Target: 90-160 chars).`,
      points: 4
    });

    // Rule 14: Schema Markup Configured
    const schemaSet = Boolean(currentPost.schemaType || currentPost.customSchemaJson);
    rules.push({
      id: "schema_markup",
      label: "Schema Structured Data",
      category: "Additional SEO",
      passed: schemaSet,
      feedback: schemaSet ? `Schema set to ${currentPost.schemaType || "Article"}.` : "Configure Schema markup.",
      points: 4
    });

    // Compute exact total score
    const totalAchieved = rules.reduce((acc, r) => acc + (r.passed ? r.points : 0), 0);
    const totalMax = rules.reduce((acc, r) => acc + r.points, 0);
    const overallScore = Math.min(100, Math.round((totalAchieved / totalMax) * 100));

    // Readability Score
    const wordsPerSentence = words / Math.max(1, contentStats.sentences);
    const readability = Math.max(0, Math.min(100, Math.round(100 - (wordsPerSentence * 1.8))));

    const passedCount = rules.filter((r) => r.passed).length;
    const failedCount = rules.filter((r) => !r.passed).length;
    const recommendations = rules.filter((r) => !r.passed).map((r) => r.feedback);

    return {
      score: overallScore,
      readability,
      keywordDensity,
      rules,
      passedCount,
      failedCount,
      recommendations
    };
  }, [currentPost, contentStats]);

  // Save current post
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

  // Create brand new draft article (Starts at 0% SEO Score until user writes content!)
  const handleCreateNewPost = () => {
    const newId = `post-${Date.now()}`;
    const newPost: BlogPost = {
      id: newId,
      title: "New Quran & Tajweed Guide",
      excerpt: "",
      category: "Tajweed Rules",
      coverImage: "",
      author: {
        name: "Muhammad Zain",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        role: "Senior Quran Scholar"
      },
      date: new Date().toISOString().split("T")[0],
      readTime: "1 min read",
      tags: ["Tajweed"],
      content: "<p>Start writing your article here...</p>",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      slug: `new-article-${Date.now().toString().slice(-4)}`,
      canonicalUrl: `https://truthquranacademy.com/blog/new-article-${Date.now().toString().slice(-4)}/`,
      robotsMeta: "index, follow",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      imageAltText: "",
      internalLinksCount: 0,
      externalLinksCount: 0,
      schemaType: "Article",
      seoScore: 0
    };

    const updatedCMSData = {
      ...cmsData,
      blogPosts: [newPost, ...posts]
    };

    saveCMSData(updatedCMSData);
    onSave(updatedCMSData);
    setSelectedPostId(newId);
    setCurrentPost(newPost);
    showToast("New blank draft initialized (SEO Score: 0%).");
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

  // Insert Block or HTML content into editor
  const handleInsertBlockHtml = (blockHtml: string) => {
    if (!currentPost) return;
    const updatedContent = `${currentPost.content || ""}\n${blockHtml}`;
    handleUpdateField("content", updatedContent);
    setShowSlashMenu(false);
    showToast("Block added to post content!");
  };

  // File Upload Helpers for Featured & Internal Images
  const handleFileUpload = (file: File, target: "featured" | "internal") => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (target === "featured") {
        handleUpdateField("coverImage", dataUrl);
        handleUpdateField("featuredImage", dataUrl);
        handleUpdateField("ogImage", dataUrl);
        if (!currentPost?.imageFileName) {
          handleUpdateField("imageFileName", file.name);
        }
        showToast("Featured image uploaded successfully!");
      } else {
        // Insert internal image block
        const imgHtml = `
<figure className="my-6 text-center">
  <img 
    src="${dataUrl}" 
    alt="${currentPost?.focusKeyword || 'Quranic Tajweed Illustration'}" 
    loading="lazy" 
    class="rounded-2xl max-w-full mx-auto shadow-xl border border-white/10" 
  />
  <figcaption className="text-xs text-[#c9c2ab] italic mt-2">${file.name.replace(/\.[^/.]+$/, "")}</figcaption>
</figure>`;
        handleInsertBlockHtml(imgHtml);
        showToast("Internal image uploaded & inserted!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropFeatured = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], "featured");
    }
  };

  const handleDropInternal = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], "internal");
    }
  };

  // 4. COMPLETE SLASH (/) COMMAND MENU ITEMS (All 22 Gutenberg & Rank Math commands)
  const slashCommands = [
    {
      id: "image",
      title: "/image",
      label: "Insert Image Block",
      desc: "Upload or choose an image with ALT text, caption & lazy loading",
      icon: <ImageIcon size={16} className="text-[#d9b45c]" />,
      action: () => setShowInternalImagesModal(true)
    },
    {
      id: "table",
      title: "/table",
      label: "Insert Data Table",
      desc: "Responsive HTML table for comparisons & schedules",
      icon: <TableIcon size={16} className="text-blue-400" />,
      action: () => handleInsertBlockHtml(`
<div class="overflow-x-auto my-6">
  <table class="w-full text-left text-xs border border-[#d9b45c]/20 rounded-xl overflow-hidden">
    <thead class="bg-[#d9b45c]/10 text-[#f2d98a] font-bold">
      <tr>
        <th class="p-3 border-b border-[#d9b45c]/20">Tajweed Rule</th>
        <th class="p-3 border-b border-[#d9b45c]/20">Arabic Letter</th>
        <th class="p-3 border-b border-[#d9b45c]/20">Pronunciation Guide</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5 text-[#c9c2ab]">
      <tr>
        <td class="p-3 font-semibold text-white">Izhar (Clearness)</td>
        <td class="p-3 font-serif text-lg text-[#d9b45c]">ء هـ ع ح غ خ</td>
        <td class="p-3">Pronounce Noon Sakinah clearly without Ghunnah</td>
      </tr>
      <tr>
        <td class="p-3 font-semibold text-white">Idgham (Merging)</td>
        <td class="p-3 font-serif text-lg text-[#d9b45c]">ي ر م ل و ن</td>
        <td class="p-3">Merge Noon Sakinah into the next letter</td>
      </tr>
    </tbody>
  </table>
</div>`)
    },
    {
      id: "heading",
      title: "/heading",
      label: "Insert Subheading (H2 / H3 / H4)",
      desc: "Structured subheadings for SEO hierarchy",
      icon: <Heading2 size={16} className="text-purple-400" />,
      action: () => handleInsertBlockHtml(`<h2 class="font-serif text-xl md:text-2xl text-[#f3ecd8] font-bold mt-8 mb-4 border-b border-[#d9b45c]/20 pb-2">Key Principles of Tajweed Recitation</h2>`)
    },
    {
      id: "quote",
      title: "/quote",
      label: "Quranic Verse / Quote Box",
      desc: "Highlighted quote with Arabic verse styling",
      icon: <Quote size={16} className="text-emerald-400" />,
      action: () => handleInsertBlockHtml(`
<blockquote class="border-l-4 border-[#d9b45c] bg-[#12141b] p-5 my-6 rounded-r-2xl shadow-lg">
  <p class="font-serif text-lg text-[#f2d98a] italic leading-relaxed">"And recite the Qur'an with measured recitation."</p>
  <cite class="text-xs text-[#c9c2ab] mt-2 block font-sans font-bold">— Surah Al-Muzzammil [73:4]</cite>
</blockquote>`)
    },
    {
      id: "button",
      title: "/button",
      label: "Call to Action Button",
      desc: "Clickable button directing to courses or trial registration",
      icon: <Sparkles size={16} className="text-amber-400" />,
      action: () => handleInsertBlockHtml(`
<div class="my-6 text-center">
  <a href="https://truthquranacademy.com/courses" class="inline-flex items-center space-x-2 bg-[#d9b45c] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-[#f2d98a] transition-all shadow-xl">
    <span>Enroll in Live Quran Classes →</span>
  </a>
</div>`)
    },
    {
      id: "callout",
      title: "/callout",
      label: "Highlight Callout Box",
      desc: "Important tip, warning, or key takeaways box",
      icon: <MessageSquare size={16} className="text-teal-400" />,
      action: () => handleInsertBlockHtml(`
<div class="bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl p-5 my-6 flex items-start space-x-4 shadow-xl">
  <div class="w-8 h-8 rounded-xl bg-[#d9b45c]/10 text-[#f2d98a] flex items-center justify-center flex-shrink-0 font-bold">💡</div>
  <div class="text-xs text-[#c9c2ab] leading-relaxed">
    <strong class="text-white block font-sans text-sm mb-1">Important Tajweed Note:</strong>
    Always listen to a qualified Qari to master the exact makhraj (articulation point) of heavy letters like Ḍād (ض) and Ṭā (ط).
  </div>
</div>`)
    },
    {
      id: "faq",
      title: "/faq",
      label: "FAQ Accordion Block",
      desc: "Schema-ready FAQ questions & answers",
      icon: <FaqIcon size={16} className="text-pink-400" />,
      action: () => handleInsertBlockHtml(`
<div class="space-y-4 my-8">
  <h3 class="text-lg font-serif font-bold text-white mb-4">Frequently Asked Questions</h3>
  <details class="bg-[#12141b] border border-white/10 rounded-xl p-4 cursor-pointer">
    <summary class="font-bold text-xs text-[#f2d98a]">What is the ideal age for a child to start Noorani Qaida?</summary>
    <p class="text-xs text-[#c9c2ab] mt-2 leading-relaxed">Children as young as 4 to 5 years old can start learning Arabic letters through interactive visual lessons.</p>
  </details>
  <details class="bg-[#12141b] border border-white/10 rounded-xl p-4 cursor-pointer">
    <summary class="font-bold text-xs text-[#f2d98a]">Are female Quran teachers available for kids and sisters?</summary>
    <p class="text-xs text-[#c9c2ab] mt-2 leading-relaxed">Yes, Truth Quran Academy provides certified 1-on-1 female Quran teachers upon request.</p>
  </details>
</div>`)
    },
    {
      id: "video",
      title: "/video",
      label: "HTML5 Video Player",
      desc: "Embed an MP4 video file directly into the article",
      icon: <Video size={16} className="text-red-400" />,
      action: () => handleInsertBlockHtml(`
<div class="my-6 rounded-2xl overflow-hidden border border-[#d9b45c]/30 shadow-2xl">
  <video controls class="w-full aspect-video bg-black" poster="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80">
    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
    Your browser does not support video play.
  </video>
</div>`)
    },
    {
      id: "gallery",
      title: "/gallery",
      label: "Image Gallery Grid",
      desc: "3-column responsive photo grid",
      icon: <Grid size={16} className="text-indigo-400" />,
      action: () => handleInsertBlockHtml(`
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
  <img src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80" alt="Quran Study 1" class="rounded-xl h-40 w-full object-cover border border-white/10" />
  <img src="https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=600&q=80" alt="Quran Study 2" class="rounded-xl h-40 w-full object-cover border border-white/10" />
  <img src="https://images.unsplash.com/photo-1542816417-0983cbe82752?auto=format&fit=crop&w=600&q=80" alt="Quran Study 3" class="rounded-xl h-40 w-full object-cover border border-white/10" />
</div>`)
    },
    {
      id: "youtube",
      title: "/youtube",
      label: "YouTube Embed Block",
      desc: "Responsive YouTube video player container",
      icon: <Film size={16} className="text-red-500" />,
      action: () => handleInsertBlockHtml(`
<div class="relative w-full aspect-video rounded-2xl overflow-hidden my-6 border border-[#d9b45c]/20 shadow-2xl">
  <iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`)
    },
    {
      id: "code",
      title: "/code",
      label: "Code Snippet Box",
      desc: "Formatted dark box for shortcodes or code examples",
      icon: <FileCode size={16} className="text-[#d9b45c]" />,
      action: () => handleInsertBlockHtml(`
<pre class="bg-[#07080b] border border-white/10 p-4 rounded-xl text-xs font-mono text-green-400 overflow-x-auto my-6"><code>/* Tajweed Audio Shortcode */
[quran_audio surah="1" ayah="1-7" reciter="mishary"]</code></pre>`)
    },
    {
      id: "columns",
      title: "/columns",
      label: "2-Column Layout",
      desc: "Side-by-side content columns for comparison",
      icon: <Layout size={16} className="text-cyan-400" />,
      action: () => handleInsertBlockHtml(`
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs leading-relaxed">
  <div class="bg-[#12141b] border border-white/10 p-5 rounded-2xl">
    <h4 class="font-bold text-white text-sm mb-2">Theoretical Tajweed</h4>
    <p class="text-[#c9c2ab]">Understanding rules, makharij points, and characteristics of Arabic letters.</p>
  </div>
  <div class="bg-[#12141b] border border-white/10 p-5 rounded-2xl">
    <h4 class="font-bold text-white text-sm mb-2">Practical Recitation</h4>
    <p class="text-[#c9c2ab]">Applying rules live with a qualified teacher who listens and corrects errors.</p>
  </div>
</div>`)
    },
    {
      id: "download",
      title: "/download",
      label: "Download File Button",
      desc: "Download button for PDF guides & Qaida books",
      icon: <Download size={16} className="text-green-400" />,
      action: () => handleInsertBlockHtml(`
<div class="bg-[#12141b] border border-emerald-500/20 p-4 rounded-2xl my-6 flex items-center justify-between">
  <div>
    <h4 class="font-bold text-white text-xs">Download Free Tajweed Rules PDF Guide</h4>
    <p class="text-[10px] text-[#c9c2ab]">Includes complete color-coded rules chart (3.4 MB)</p>
  </div>
  <a href="https://truthquranacademy.com/download" target="_blank" class="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400 transition-all flex items-center space-x-1">
    <Download size={14} />
    <span>Download PDF</span>
  </a>
</div>`)
    },
    {
      id: "divider",
      title: "/divider",
      label: "Horizontal Divider",
      desc: "Clean golden accent line separator",
      icon: <Minus size={16} className="text-gray-400" />,
      action: () => handleInsertBlockHtml(`<hr class="my-8 border-t border-[#d9b45c]/20" />`)
    },
    {
      id: "list",
      title: "/list",
      label: "Bulleted List",
      desc: "Clean bullet point list container",
      icon: <List size={16} className="text-yellow-400" />,
      action: () => handleInsertBlockHtml(`
<ul class="list-disc list-inside space-y-2 my-4 text-xs text-[#c9c2ab]">
  <li>Mastering Noon Sakinah & Tanween rules</li>
  <li>Understanding Meem Sakinah rules</li>
  <li>Madd (Elongation) classifications</li>
</ul>`)
    },
    {
      id: "shortcode",
      title: "/shortcode",
      label: "Shortcode Block",
      desc: "Insert WordPress shortcodes like [quran_audio]",
      icon: <Code2 size={16} className="text-[#d9b45c]" />,
      action: () => handleInsertBlockHtml(`<div class="my-4 text-xs font-mono text-[#f2d98a] bg-[#07080b] p-3 rounded-xl border border-[#d9b45c]/30">[quran_audio_player]</div>`)
    },
    {
      id: "internal_link",
      title: "/internal link",
      label: "Search & Insert Internal Link",
      desc: "Search pages, courses, or posts to insert a link",
      icon: <Link2 size={16} className="text-[#d9b45c]" />,
      action: () => setShowInternalLinkModal(true)
    },
    {
      id: "external_link",
      title: "/external link",
      label: "Insert External Reference Link",
      desc: "Insert a link pointing to an external authoritative source",
      icon: <ExternalLink size={16} className="text-blue-400" />,
      action: () => setShowExternalLinkModal(true)
    },
    {
      id: "html",
      title: "/html",
      label: "Custom HTML Container",
      desc: "Insert raw HTML or embed script tags",
      icon: <Code size={16} className="text-orange-400" />,
      action: () => handleInsertBlockHtml(`<div class="raw-html-block my-4 p-4 border border-white/10 rounded-xl bg-[#07080b] text-xs font-mono text-green-400"><!-- Custom HTML Code Here --></div>`)
    },
    {
      id: "media",
      title: "/media",
      label: "Open Media Library",
      desc: "Select an existing media asset from library",
      icon: <ImageIcon size={16} className="text-[#d9b45c]" />,
      action: () => {
        setMediaTargetField("internal");
        setShowMediaLibraryModal(true);
      }
    }
  ];

  const filteredSlashCommands = slashCommands.filter(
    (c) =>
      c.title.toLowerCase().includes(slashSearch.toLowerCase()) ||
      c.label.toLowerCase().includes(slashSearch.toLowerCase()) ||
      c.desc.toLowerCase().includes(slashSearch.toLowerCase())
  );

  // Internal Link Select Handler
  const handleInsertInternalLink = (url: string, linkText: string) => {
    if (!currentPost) return;
    const anchorHtml = `<a href="${url}" title="${linkText}" class="text-[#d9b45c] font-bold underline hover:text-[#f2d98a]">${linkText}</a>`;
    const updatedContent = `${currentPost.content || ""}\n<p>Related Reading: ${anchorHtml}</p>`;
    handleUpdateField("content", updatedContent);
    handleUpdateField("internalLinksCount", (currentPost.internalLinksCount || 0) + 1);
    setShowInternalLinkModal(false);
    showToast(`Internal link to "${linkText}" inserted!`);
  };

  // External Link Select Handler
  const handleInsertExternalLink = () => {
    if (!currentPost || !extLinkUrl) return;
    const anchorHtml = `<a href="${extLinkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-400 font-bold underline hover:text-blue-300">${extLinkText}</a>`;
    const updatedContent = `${currentPost.content || ""}\n<p>Reference: ${anchorHtml}</p>`;
    handleUpdateField("content", updatedContent);
    handleUpdateField("externalLinksCount", (currentPost.externalLinksCount || 0) + 1);
    setShowExternalLinkModal(false);
    showToast(`External link to "${extLinkUrl}" inserted!`);
  };

  // Batch insert images from Internal Images Modal
  const handleInsertSelectedInternalImages = () => {
    if (selectedInternalImages.length === 0) return;

    let combinedHtml = "";
    selectedInternalImages.forEach((imgUrl, idx) => {
      combinedHtml += `
<figure className="my-6 text-${imgAlign}">
  <img 
    src="${imgUrl}" 
    alt="${imgAltText || currentPost?.focusKeyword || 'Quranic Tajweed Guide Photo'}" 
    title="${imgTitleText || 'Academy Media'}"
    loading="lazy" 
    style="width: ${imgWidth};" 
    class="rounded-2xl max-w-full mx-auto shadow-2xl border border-white/10" 
  />
  ${imgCaptionText ? `<figcaption className="text-xs text-[#c9c2ab] italic mt-2">${imgCaptionText}</figcaption>` : ""}
</figure>\n`;
    });

    handleInsertBlockHtml(combinedHtml);
    setSelectedInternalImages([]);
    setShowInternalImagesModal(false);
    showToast(`${selectedInternalImages.length} image(s) inserted into post!`);
  };

  if (!currentPost) {
    return (
      <div className="p-8 bg-[#12141b] rounded-2xl border border-[#d9b45c]/20 text-center space-y-4">
        <FileText size={48} className="mx-auto text-[#d9b45c]/40" />
        <h3 className="text-lg font-serif font-bold text-white">No Articles Found</h3>
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
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#d9b45c] text-black px-4 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center space-x-2 border border-black/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: RANK MATH PRO TOOLBAR & CONTROL BAR */}
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
                  Gutenberg v3.4
                </span>
              </div>
              <p className="text-[11px] text-[#c9c2ab] mt-0.5">Real-time SEO Audit Engine, Visual Gutenberg Blocks & Website Router</p>
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
              <span>View Live Page</span>
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

        {/* Post Selector, Dual Mode Switcher & Device Frame */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
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

          {/* DUAL EDITING MODE SWITCHER (Visual vs Code) */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold text-[#c9c2ab] whitespace-nowrap">Editor Mode:</span>
            <div className="flex items-center p-1 bg-[#07080b] border border-[#d9b45c]/30 rounded-xl">
              <button
                onClick={() => setEditorMode("visual")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  editorMode === "visual" ? "bg-[#d9b45c] text-black shadow-md" : "text-[#c9c2ab] hover:text-white"
                }`}
              >
                <Eye size={13} />
                <span>Visual Editor</span>
              </button>
              <button
                onClick={() => setEditorMode("code")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  editorMode === "code" ? "bg-[#d9b45c] text-black shadow-md" : "text-[#c9c2ab] hover:text-white"
                }`}
              >
                <Code size={13} />
                <span>HTML Code Editor</span>
              </button>
            </div>
          </div>

          {/* Device Frame Switcher */}
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
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: WORKSPACE & RANK MATH SIDEBAR */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: GUTENBERG WORKSPACE (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* ARTICLE METRICS BAR */}
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

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://truthquranacademy.com/blog/${currentPost.slug}`);
                  showToast("Live article URL copied!");
                }}
                className="px-2 py-1 bg-[#07080b] hover:bg-white/5 text-[#d9b45c] rounded text-[10px] font-bold flex items-center space-x-1 border border-[#d9b45c]/20"
              >
                <Copy size={10} />
                <span>Copy URL</span>
              </button>
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

          {/* ARTICLE CONTENT CANVAS */}
          <div className={`mx-auto transition-all duration-300 ${
            deviceFrame === "tablet" ? "max-w-[768px] border-8 border-[#12141b] rounded-3xl p-4 shadow-2xl bg-[#07080b]" :
            deviceFrame === "mobile" ? "max-w-[375px] border-8 border-[#12141b] rounded-3xl p-3 shadow-2xl bg-[#07080b]" :
            "w-full"
          }`}>
            <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 md:p-6 space-y-5">
              
              {/* Post Title (H1 Tag) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-[#d9b45c] tracking-wider flex items-center space-x-1">
                    <Heading1 size={12} />
                    <span>Post Title (H1 Tag)</span>
                  </label>
                  <span className={`text-[9px] font-mono ${currentPost.title.length >= 30 && currentPost.title.length <= 65 ? "text-green-400" : "text-yellow-400"}`}>
                    {currentPost.title.length} chars
                  </span>
                </div>
                <input
                  type="text"
                  value={currentPost.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleUpdateField("title", val);
                    if (!currentPost.slug || currentPost.slug.startsWith("new-article")) {
                      handleUpdateField("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                    }
                  }}
                  className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-xl px-4 py-3 text-lg md:text-xl font-serif font-bold text-white focus:outline-none focus:border-[#d9b45c] transition-colors"
                  placeholder="Enter a compelling article title..."
                />
              </div>

              {/* Permalink / Slug Bar */}
              <div className="bg-[#07080b] border border-white/10 rounded-xl p-3 flex items-center space-x-2 text-xs font-mono">
                <span className="text-[#c9c2ab]/50">https://truthquranacademy.com/blog/</span>
                <input
                  type="text"
                  value={currentPost.slug || ""}
                  onChange={(e) => handleUpdateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="flex-1 bg-transparent border-b border-[#d9b45c]/30 text-[#f2d98a] font-bold outline-none px-1"
                  placeholder="article-url-slug"
                />
              </div>

              {/* Excerpt */}
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

              {/* GUTENBERG & RANK MATH SLASH COMMAND TOOLBAR */}
              <div className="bg-[#07080b] border border-[#d9b45c]/20 p-2.5 rounded-xl space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {/* Slash Menu Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setShowSlashMenu(!showSlashMenu)}
                      className="px-3 py-1.5 bg-[#d9b45c] text-black rounded-lg font-bold flex items-center space-x-1.5 hover:bg-[#f2d98a] transition-all shadow-md"
                    >
                      <Plus size={14} />
                      <span>/ Add Block</span>
                    </button>

                    {/* Internal Images Manager Button */}
                    <button
                      type="button"
                      onClick={() => setShowInternalImagesModal(true)}
                      className="px-2.5 py-1.5 bg-[#12141b] hover:bg-white/5 text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg font-bold flex items-center space-x-1"
                    >
                      <ImageIcon size={13} />
                      <span>+ Internal Images</span>
                    </button>

                    {/* Internal Link Search Button */}
                    <button
                      type="button"
                      onClick={() => setShowInternalLinkModal(true)}
                      className="px-2.5 py-1.5 bg-[#12141b] hover:bg-white/5 text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg font-bold flex items-center space-x-1"
                    >
                      <Link2 size={13} />
                      <span>Internal Link</span>
                    </button>

                    {/* Quick Formatting Buttons */}
                    <button
                      type="button"
                      onClick={() => handleInsertBlockHtml(`<h2>Section Subheading (H2)</h2>\n<p>Write detailed explanation here...</p>`)}
                      className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/5"
                      title="Insert H2 Subheading"
                    >
                      <Heading2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInsertBlockHtml(`<h3>Sub-point (H3)</h3>\n<p>Write sub-points here...</p>`)}
                      className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/5"
                      title="Insert H3 Subheading"
                    >
                      <Heading3 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInsertBlockHtml(`<blockquote class="border-l-4 border-[#d9b45c] bg-[#12141b] p-4 my-4 rounded-r-xl italic text-[#f2d98a]"><p>"Recite Quran with Tajweed precision."</p></blockquote>`)}
                      className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/5"
                      title="Insert Quote / Verse"
                    >
                      <Quote size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInsertBlockHtml(`<ul class="list-disc list-inside space-y-1 my-3 text-xs text-[#c9c2ab]"><li>First key principle</li><li>Second key principle</li></ul>`)}
                      className="p-1.5 bg-[#12141b] text-[#c9c2ab] hover:text-white rounded border border-white/5"
                      title="Insert Bulleted List"
                    >
                      <List size={14} />
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-[#c9c2ab]/50">
                    Type <code className="text-[#d9b45c]">/</code> for Gutenberg commands
                  </span>
                </div>

                {/* SLASH COMMAND POPOVER DROPDOWN */}
                {showSlashMenu && (
                  <div className="bg-[#12141b] border border-[#d9b45c]/40 rounded-xl p-3 space-y-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
                    <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                      <Search size={14} className="text-[#d9b45c]" />
                      <input
                        type="text"
                        value={slashSearch}
                        onChange={(e) => setSlashSearch(e.target.value)}
                        placeholder="Search Gutenberg / Rank Math commands (e.g. /image, /table, /callout)..."
                        className="w-full bg-transparent text-xs text-white outline-none"
                        autoFocus
                      />
                      <button onClick={() => setShowSlashMenu(false)} className="text-[#c9c2ab] hover:text-white">
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {filteredSlashCommands.map((cmd) => (
                        <div
                          key={cmd.id}
                          onClick={() => {
                            cmd.action();
                            setShowSlashMenu(false);
                          }}
                          className="p-2 bg-[#07080b] hover:bg-[#d9b45c]/10 border border-white/5 hover:border-[#d9b45c]/30 rounded-lg cursor-pointer transition-all flex items-start space-x-2.5 group"
                        >
                          <div className="p-1.5 rounded-md bg-[#12141b] group-hover:bg-[#d9b45c] group-hover:text-black transition-colors">
                            {cmd.icon}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-mono text-xs font-bold text-[#f2d98a]">{cmd.title}</span>
                              <span className="text-[10px] text-white font-semibold">{cmd.label}</span>
                            </div>
                            <p className="text-[10px] text-[#c9c2ab]/60 line-clamp-1 mt-0.5">{cmd.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DUAL MODE EDITOR CANVAS */}
              {editorMode === "code" ? (
                /* HTML CODE EDITOR MODE */
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-[#d9b45c] flex items-center space-x-1">
                      <Code size={12} />
                      <span>Full HTML Code Editor</span>
                    </label>
                    <span className="text-[9px] font-mono text-[#c9c2ab]">
                      Raw HTML Mode | {contentStats.words} words
                    </span>
                  </div>
                  <textarea
                    rows={18}
                    value={currentPost.content}
                    onChange={(e) => handleUpdateField("content", e.target.value)}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-xl p-4 text-xs font-mono text-green-400 focus:outline-none focus:border-[#d9b45c] leading-relaxed resize-y"
                    placeholder="Write raw HTML content here..."
                  />
                </div>
              ) : (
                /* VISUAL RICH EDITOR MODE WITH DRAG & DROP DROPZONE */
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-[#c9c2ab] tracking-wider flex items-center space-x-1">
                      <Eye size={12} />
                      <span>Visual Editor Canvas</span>
                    </label>
                    <span className="text-[9px] font-mono text-[#d9b45c]">
                      {contentStats.words} words | {contentStats.paragraphs} paragraphs
                    </span>
                  </div>

                  {/* VISUAL DRAG & DROP DROPZONE */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDropInternal}
                    className="border-2 border-dashed border-[#d9b45c]/30 hover:border-[#d9b45c] bg-[#07080b]/50 rounded-xl p-3 text-center transition-colors cursor-pointer"
                    onClick={() => internalFileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={internalFileInputRef}
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "internal")}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center justify-center space-x-2 text-xs text-[#c9c2ab]">
                      <Upload size={14} className="text-[#d9b45c]" />
                      <span>Drag & Drop image anywhere on editor or click to upload internal photo</span>
                    </div>
                  </div>

                  <textarea
                    rows={18}
                    value={currentPost.content}
                    onChange={(e) => handleUpdateField("content", e.target.value)}
                    className="w-full bg-[#07080b] border border-[#d9b45c]/20 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#d9b45c] transition-colors leading-relaxed resize-y"
                    placeholder="Write article content using HTML or Gutenberg Slash commands..."
                  />
                </div>
              )}

              {/* RENDERED ARTICLE VISUAL OUTPUT PREVIEW */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#d9b45c] tracking-widest flex items-center space-x-1">
                  <Eye size={12} />
                  <span>Rendered Article Visual Output</span>
                </span>
                <div className="bg-[#07080b] border border-white/5 rounded-xl p-5 text-left text-xs space-y-3 prose prose-invert max-w-none text-white leading-relaxed overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: currentPost.content || "<p className='text-gray-500 italic'>No content written yet.</p>" }} />
                </div>
              </div>

            </div>
          </div>

          {/* FEATURED IMAGE PANEL WITH FILE UPLOAD, DRAG & DROP, & CROPPING */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-serif font-bold text-[#d9b45c] uppercase tracking-wider flex items-center space-x-2">
                <ImageIcon size={14} />
                <span>Featured Image & Image SEO Metadata</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCropModal(true)}
                className="px-2.5 py-1 bg-[#07080b] hover:bg-white/5 text-[#f2d98a] border border-[#d9b45c]/30 rounded-lg text-[10px] font-bold flex items-center space-x-1"
              >
                <Crop size={12} />
                <span>Image Adjustments</span>
              </button>
            </div>

            {/* DRAG & DROP FEATURED IMAGE DROPZONE */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDropFeatured}
              className="border-2 border-dashed border-[#d9b45c]/40 hover:border-[#d9b45c] bg-[#07080b] p-6 rounded-2xl text-center space-y-2 cursor-pointer transition-all"
              onClick={() => featuredFileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={featuredFileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "featured")}
                accept="image/*"
                className="hidden"
              />
              <Upload size={28} className="mx-auto text-[#d9b45c]" />
              <div className="text-xs font-bold text-white">Upload Featured Image from Computer</div>
              <p className="text-[10px] text-[#c9c2ab]">Drag & Drop image file here or click to browse files</p>
              
              <div className="flex justify-center space-x-2 pt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => {
                    setMediaTargetField("featured");
                    setShowMediaLibraryModal(true);
                  }}
                  className="px-3 py-1.5 bg-[#12141b] hover:bg-white/10 text-[#d9b45c] border border-[#d9b45c]/30 rounded-lg text-[11px] font-bold"
                >
                  Select from Media Library
                </button>
                {currentPost.coverImage && (
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateField("coverImage", "");
                      handleUpdateField("featuredImage", "");
                    }}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[11px] font-bold"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            {/* EDITABLE IMAGE PROPERTIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Featured Image ALT Text (SEO)</label>
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

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Image Title Attribute</label>
                <input
                  type="text"
                  value={currentPost.imageTitle || ""}
                  onChange={(e) => handleUpdateField("imageTitle", e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  placeholder="Image title attribute..."
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Image Caption (Visible below photo)</label>
                <input
                  type="text"
                  value={currentPost.imageCaption || ""}
                  onChange={(e) => handleUpdateField("imageCaption", e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  placeholder="e.g. Online Quran Recitation Session at Truth Quran Academy"
                />
              </div>
            </div>

            {/* PREVIEW FEATURED IMAGE BANNER */}
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

        {/* RIGHT COLUMN: RANK MATH PRO REAL-TIME SEO SIDEBAR (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* 1. RANK MATH PRO DYNAMIC CIRCULAR SCORE GAUGE */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-5 text-center space-y-4 relative overflow-hidden shadow-xl">
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              seoAnalysis.score >= 80 ? "bg-green-500" : seoAnalysis.score >= 50 ? "bg-yellow-500" : "bg-red-500"
            }`} />

            <div className="flex items-center justify-between pb-1 border-b border-white/5">
              <span className="text-[10px] uppercase font-sans font-extrabold tracking-widest text-[#d9b45c]">
                Rank Math Pro Score
              </span>
              <span className="text-[8px] font-mono text-[#c9c2ab]/50 uppercase">Live Real-time Audit</span>
            </div>

            {/* Circular Score Gauge */}
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
                <span className="text-4xl font-serif font-extrabold text-white leading-none">{seoAnalysis.score}%</span>
                <span className="text-[8px] font-sans font-bold text-[#c9c2ab]/60 uppercase tracking-widest mt-1">
                  {seoAnalysis.score >= 80 ? "Great" : seoAnalysis.score >= 50 ? "Needs Work" : "Poor / Unoptimized"}
                </span>
              </div>
            </div>

            {/* Score Breakdown Bar */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5 text-xs">
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Passed</span>
                <span className="font-bold text-green-400 font-mono">{seoAnalysis.passedCount} tests</span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Failed</span>
                <span className="font-bold text-red-400 font-mono">{seoAnalysis.failedCount} tests</span>
              </div>
              <div className="bg-[#07080b] p-2 rounded-xl border border-white/5">
                <span className="text-[8px] uppercase tracking-wider text-[#c9c2ab]/50 block">Readability</span>
                <span className={`font-bold ${seoAnalysis.readability >= 60 ? "text-green-400" : "text-yellow-500"}`}>
                  {seoAnalysis.readability}/100
                </span>
              </div>
            </div>
          </div>

          {/* 2. FOCUS KEYWORD INPUT PANEL */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-4 space-y-3">
            <label className="text-[10px] uppercase font-bold text-[#d9b45c] tracking-wider flex items-center space-x-1">
              <Sparkles size={12} />
              <span>Focus Keyword Optimization</span>
            </label>
            <input
              type="text"
              value={currentPost.focusKeyword || ""}
              onChange={(e) => handleUpdateField("focusKeyword", e.target.value)}
              className="w-full bg-[#07080b] border border-[#d9b45c]/30 rounded-xl px-3 py-2 text-xs font-bold text-[#f2d98a] outline-none focus:border-[#d9b45c]"
              placeholder="e.g. Tajweed Rules, Quran Recitation..."
            />
            <p className="text-[10px] text-[#c9c2ab]">
              Enter the main search phrase you want this article to rank for in Google search results.
            </p>
          </div>

          {/* 3. LIVE GOOGLE SERP PREVIEW */}
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

          {/* 4. REAL-TIME AUDIT CHECKS & ACTIONABLE RECOMMENDATIONS */}
          <div className="bg-[#12141b]/70 border border-[#d9b45c]/15 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-sans font-extrabold text-[#f3ecd8] uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-2">
              <span>SEO Audit Checklist</span>
              <span className="text-[10px] font-mono text-[#d9b45c]">{seoAnalysis.passedCount}/{seoAnalysis.rules.length} Passed</span>
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {seoAnalysis.rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-start space-x-2.5 transition-all ${
                    rule.passed ? "bg-green-500/5 border-green-500/20 text-green-300" : "bg-red-500/5 border-red-500/20 text-red-300"
                  }`}
                >
                  {rule.passed ? (
                    <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">{rule.label}</span>
                      <span className="text-[9px] font-mono text-[#c9c2ab]/60">+{rule.points} pts</span>
                    </div>
                    <p className="text-[10px] text-[#c9c2ab] leading-snug">{rule.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. EDIT META TITLE & DESCRIPTION SNIPPET */}
          <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-[#d9b45c] uppercase tracking-wider">Edit Snippet Metadata</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Meta Title (Google Title Tag)</label>
              <input
                type="text"
                value={currentPost.metaTitle || ""}
                onChange={(e) => handleUpdateField("metaTitle", e.target.value)}
                className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                placeholder="Google Meta Title..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#c9c2ab]">Meta Description</label>
              <textarea
                rows={3}
                value={currentPost.metaDescription || ""}
                onChange={(e) => handleUpdateField("metaDescription", e.target.value)}
                className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white resize-none"
                placeholder="Meta description for search engine result snippet..."
              />
            </div>
          </div>

        </div>

      </div>

      {/* MODAL 1: INTERNAL IMAGES MANAGER & INSERTER MODAL */}
      {showInternalImagesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/40 rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <ImageIcon size={20} className="text-[#d9b45c]" />
                <h3 className="font-serif text-lg font-bold text-white">Internal Images Manager</h3>
              </div>
              <button onClick={() => setShowInternalImagesModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* DRAG & DROP INTERNAL IMAGE UPLOADER */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDropInternal}
              className="border-2 border-dashed border-[#d9b45c]/40 hover:border-[#d9b45c] bg-[#07080b] p-5 rounded-2xl text-center space-y-2 cursor-pointer transition-all"
              onClick={() => internalFileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={internalFileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "internal")}
                accept="image/*"
                className="hidden"
              />
              <Upload size={24} className="mx-auto text-[#d9b45c]" />
              <div className="text-xs font-bold text-white">Upload New Image from Computer</div>
              <p className="text-[10px] text-[#c9c2ab]">Drag & Drop image files here or click to browse files</p>
            </div>

            {/* SELECT FROM MEDIA LIBRARY */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#d9b45c] uppercase">Select Existing Image from Library</h4>
                <input
                  type="text"
                  value={internalImgSearch}
                  onChange={(e) => setInternalImgSearch(e.target.value)}
                  placeholder="Search media..."
                  className="bg-[#07080b] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
                {(cmsData.mediaLibrary || []).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (selectedInternalImages.includes(m.url)) {
                        setSelectedInternalImages(selectedInternalImages.filter((u) => u !== m.url));
                      } else {
                        setSelectedInternalImages([...selectedInternalImages, m.url]);
                      }
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer h-24 transition-all ${
                      selectedInternalImages.includes(m.url) ? "border-[#d9b45c] scale-95" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
                    {selectedInternalImages.includes(m.url) && (
                      <div className="absolute top-1 right-1 bg-[#d9b45c] text-black rounded-full p-0.5">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* PROPERTIES CONFIGURATION FOR INSERTION */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/10">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Image Alignment</label>
                <select
                  value={imgAlign}
                  onChange={(e: any) => setImgAlign(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="center">Center (Block)</option>
                  <option value="left">Float Left</option>
                  <option value="right">Float Right</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Display Width</label>
                <select
                  value={imgWidth}
                  onChange={(e) => setImgWidth(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="100%">100% Full Width</option>
                  <option value="75%">75% Width</option>
                  <option value="50%">50% Medium Width</option>
                  <option value="25%">25% Small Thumbnail</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">ALT Text (SEO)</label>
                <input
                  type="text"
                  value={imgAltText}
                  onChange={(e) => setImgAltText(e.target.value)}
                  placeholder="Descriptive ALT text for search engines..."
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Caption (Optional)</label>
                <input
                  type="text"
                  value={imgCaptionText}
                  onChange={(e) => setImgCaptionText(e.target.value)}
                  placeholder="Visible caption underneath image..."
                  className="w-full bg-[#07080b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowInternalImagesModal(false)}
                className="px-4 py-2 bg-[#07080b] text-[#c9c2ab] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertSelectedInternalImages}
                disabled={selectedInternalImages.length === 0}
                className="px-5 py-2 bg-[#d9b45c] disabled:opacity-50 text-black font-bold text-xs rounded-xl hover:bg-[#f2d98a] transition-all"
              >
                Insert Selected ({selectedInternalImages.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERNAL LINK SEARCH MODAL */}
      {showInternalLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Link2 size={18} className="text-[#d9b45c]" />
                <h3 className="font-serif text-base font-bold text-white">Insert Internal Link</h3>
              </div>
              <button onClick={() => setShowInternalLinkModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 text-xs font-bold">
              <button
                onClick={() => setInternalLinkTab("posts")}
                className={`pb-2 px-3 border-b-2 ${internalLinkTab === "posts" ? "border-[#d9b45c] text-[#f2d98a]" : "border-transparent text-[#c9c2ab]"}`}
              >
                Blog Posts
              </button>
              <button
                onClick={() => setInternalLinkTab("courses")}
                className={`pb-2 px-3 border-b-2 ${internalLinkTab === "courses" ? "border-[#d9b45c] text-[#f2d98a]" : "border-transparent text-[#c9c2ab]"}`}
              >
                Courses
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {internalLinkTab === "posts" ? (
                posts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleInsertInternalLink(`https://truthquranacademy.com/blog/${p.slug || p.id}`, p.title)}
                    className="p-3 bg-[#07080b] hover:bg-[#d9b45c]/10 rounded-xl border border-white/5 cursor-pointer flex items-center justify-between text-xs group"
                  >
                    <span className="font-bold text-white group-hover:text-[#f2d98a] truncate">{p.title}</span>
                    <span className="text-[10px] text-[#d9b45c] font-bold">Insert →</span>
                  </div>
                ))
              ) : (
                [
                  { title: "Noorani Qaida Course", slug: "noorani-qaida" },
                  { title: "Tajweed Mastery Course", slug: "courses" },
                  { title: "Kids Online Quran Classes", slug: "kids-classes" }
                ].map((c) => (
                  <div
                    key={c.slug}
                    onClick={() => handleInsertInternalLink(`https://truthquranacademy.com/${c.slug}`, c.title)}
                    className="p-3 bg-[#07080b] hover:bg-[#d9b45c]/10 rounded-xl border border-white/5 cursor-pointer flex items-center justify-between text-xs group"
                  >
                    <span className="font-bold text-white group-hover:text-[#f2d98a]">{c.title}</span>
                    <span className="text-[10px] text-[#d9b45c] font-bold">Insert →</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EXTERNAL LINK MODAL */}
      {showExternalLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-blue-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <ExternalLink size={18} className="text-blue-400" />
                <h3 className="font-serif text-base font-bold text-white">Insert External Link</h3>
              </div>
              <button onClick={() => setShowExternalLinkModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Destination URL</label>
                <input
                  type="text"
                  value={extLinkUrl}
                  onChange={(e) => setExtLinkUrl(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#c9c2ab] block mb-1">Anchor Text</label>
                <input
                  type="text"
                  value={extLinkText}
                  onChange={(e) => setExtLinkText(e.target.value)}
                  className="w-full bg-[#07080b] border border-white/10 rounded-xl px-3 py-2 text-white"
                  placeholder="Link text..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowExternalLinkModal(false)}
                className="px-4 py-2 bg-[#07080b] text-[#c9c2ab] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertExternalLink}
                className="px-5 py-2 bg-blue-500 text-black font-bold text-xs rounded-xl hover:bg-blue-400 transition-all"
              >
                Insert Reference Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: MEDIA LIBRARY SELECTOR MODAL */}
      {showMediaLibraryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141b] border border-[#d9b45c]/40 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-base font-bold text-white">Select Image from Media Library</h3>
              <button onClick={() => setShowMediaLibraryModal(false)} className="text-[#c9c2ab] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
              {(cmsData.mediaLibrary || []).map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    if (mediaTargetField === "featured") {
                      handleUpdateField("coverImage", m.url);
                      handleUpdateField("featuredImage", m.url);
                      showToast("Featured image set from Media Library!");
                    } else {
                      const imgHtml = `<figure class="my-6 text-center"><img src="${m.url}" alt="${m.title}" loading="lazy" class="rounded-2xl max-w-full mx-auto shadow-xl" /></figure>`;
                      handleInsertBlockHtml(imgHtml);
                    }
                    setShowMediaLibraryModal(false);
                  }}
                  className="rounded-xl overflow-hidden border border-white/10 hover:border-[#d9b45c] cursor-pointer h-28 group relative"
                >
                  <img src={m.url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold">
                    Select
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
