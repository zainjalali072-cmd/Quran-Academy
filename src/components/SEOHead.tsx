import React, { useEffect } from "react";
import { CMSData } from "../cmsStore";

interface SEOHeadProps {
  cmsData: CMSData;
  currentView: string;
  activePostId: string | null;
}

export default function SEOHead({ cmsData, currentView, activePostId }: SEOHeadProps) {
  useEffect(() => {
    // 1. Determine Title & Description
    const getMetaStr = (val: any, fallback: string): string => {
      if (!val) return fallback;
      if (typeof val === "string") return val;
      if (typeof val === "object" && val.metaTitle) return String(val.metaTitle);
      if (typeof val === "object" && val.metaDescription) return String(val.metaDescription);
      return fallback;
    };

    let title: string = getMetaStr(cmsData.seoSettings?.metaTitle, "Truth Quran Academy | 1-on-1 Online Quran & Tajweed Classes");
    let description: string = getMetaStr(cmsData.seoSettings?.metaDescription, "Learn Holy Quran recitation, Tajweed rules, Hifz, and Quranic Arabic from certified native scholars in private 1-on-1 classrooms.");
    let canonical: string = window.location.href;
    let ogTitle: string = title;
    let ogDesc: string = description;
    let ogImage: string = getMetaStr(cmsData.seoSettings?.ogImage, "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200");
    let twitterCard: string = "summary_large_image";
    let schemaJson: any = null;

    if (currentView === "blog-post" && activePostId) {
      const posts = cmsData.blogPosts || [];
      const post = posts.find(p => p.id === activePostId);
      if (post) {
        title = post.metaTitle || post.seoTitle || `${post.title} | Truth Quran Academy`;
        description = post.metaDescription || post.excerpt || description;
        canonical = post.canonicalUrl || window.location.href;
        ogTitle = post.ogTitle || title;
        ogDesc = post.ogDescription || description;
        ogImage = post.ogImage || post.coverImage || ogImage;
        twitterCard = post.twitterCard || twitterCard;

        if (post.customSchemaJson) {
          try {
            schemaJson = JSON.parse(post.customSchemaJson);
          } catch (e) {
            schemaJson = null;
          }
        }

        if (!schemaJson) {
          schemaJson = {
            "@context": "https://schema.org",
            "@type": post.schemaType || "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.coverImage,
            "datePublished": post.date || post.publishDate || "2026-07-20",
            "author": {
              "@type": "Person",
              "name": post.author?.name || "Muhammad Zain"
            },
            "publisher": {
              "@type": "EducationalOrganization",
              "name": "Truth Quran Academy",
              "url": "https://truthquranacademy.com"
            }
          };
        }
      }
    } else {
      // General Organization & WebSite schema
      schemaJson = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Truth Quran Academy",
        "url": "https://truthquranacademy.com",
        "description": description,
        "email": cmsData.contactEmail || "muhammadzain92624@gmail.com",
        "telephone": cmsData.contactPhone || "+92 321 9347471",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": cmsData.contactAddress || "Altaf Colony, Ranjar Head Quarter, Lahore Cantt, Pakistan",
          "addressLocality": "Lahore",
          "addressCountry": "PK"
        }
      };
    }

    // 2. Set document title
    document.title = title;

    // Helper function to update or create meta tags
    const setMetaTag = (nameAttr: string, value: string, content: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[${nameAttr}="${value}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(nameAttr, value);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper for canonical link
    const setCanonicalLink = (href: string) => {
      let element = document.querySelector(`link[rel="canonical"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Helper for JSON-LD script
    const setSchemaScript = (jsonObj: any) => {
      let element = document.getElementById("seo-schema-script") as HTMLScriptElement;
      if (!element) {
        element = document.createElement("script");
        element.id = "seo-schema-script";
        element.setAttribute("type", "application/ld+json");
        document.head.appendChild(element);
      }
      element.textContent = JSON.stringify(jsonObj, null, 2);
    };

    // 3. Inject Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", getMetaStr(cmsData.seoSettings?.metaKeywords, "online quran class, tajweed rules, hifz course, quran tutor"));
    setMetaTag("name", "robots", getMetaStr(cmsData.seoSettings?.robotsDirective, "index, follow"));

    // Google Search Console Verification code
    const gscTag = cmsData.integrations?.googleSiteVerification || cmsData.integrations?.gscId;
    if (gscTag) {
      setMetaTag("name", "google-site-verification", gscTag);
    }

    // Open Graph
    setMetaTag("property", "og:title", ogTitle);
    setMetaTag("property", "og:description", ogDesc);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:url", canonical);
    setMetaTag("property", "og:type", currentView === "blog-post" ? "article" : "website");
    setMetaTag("property", "og:site_name", "Truth Quran Academy");

    // Twitter Cards
    setMetaTag("name", "twitter:card", twitterCard);
    setMetaTag("name", "twitter:title", ogTitle);
    setMetaTag("name", "twitter:description", ogDesc);
    setMetaTag("name", "twitter:image", ogImage);

    // Canonical
    setCanonicalLink(canonical);

    // Schema
    if (schemaJson) {
      setSchemaScript(schemaJson);
    }

  }, [cmsData, currentView, activePostId]);

  return null;
}
