import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
}

const defaultMeta = {
  title: "Ženska Pijaca — Kupuj Domaće, Podržavaj Lokalno",
  description: "Online pijaca ručno izrađenih proizvoda od srpskih preduzetnica. Organska hrana, prirodna kozmetika, med, džemovi i unikatne rukotvorine.",
  image: "https://zenskapijaca.rs/og-image.png",
  url: "https://zenskapijaca.rs/",
  siteName: "Ženska Pijaca",
};

const SEOHead = ({
  title,
  description,
  image,
  url,
  type = "website",
  noindex = false,
}: SEOHeadProps) => {
  const fullTitle = title 
    ? `${title} | Ženska Pijaca` 
    : defaultMeta.title;
  
  const metaDescription = description || defaultMeta.description;
  const metaImage = image || defaultMeta.image;
  const metaUrl = url || defaultMeta.url;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attribute, property);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    // Update meta tags
    setMetaTag("description", metaDescription);
    setMetaTag("robots", noindex ? "noindex, nofollow" : "index, follow");

    // Open Graph
    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", metaDescription, true);
    setMetaTag("og:image", metaImage, true);
    setMetaTag("og:url", metaUrl, true);
    setMetaTag("og:type", type, true);

    // Twitter
    setMetaTag("twitter:title", fullTitle);
    setMetaTag("twitter:description", metaDescription);
    setMetaTag("twitter:image", metaImage);

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", metaUrl);
    }
  }, [fullTitle, metaDescription, metaImage, metaUrl, type, noindex]);

  return null; // This component doesn't render anything
};

export default SEOHead;
