import { useEffect } from 'react';

const SEOHead = ({ title, description, breadcrumbs = [], structuredData = null }) => {
  useEffect(() => {
    // Set title
    document.title = title || 'PetsLib - Your Complete Guide to Pet Care & Breeds';
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description || 'Discover expert pet care advice, comprehensive breed information, and everything you need for your furry friends.';

    // Add structured data (JSON-LD)
    if (structuredData || breadcrumbs.length > 0) {
      // Remove existing structured data scripts
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => script.remove());

      // Add breadcrumb structured data
      if (breadcrumbs.length > 0) {
        const breadcrumbScript = document.createElement('script');
        breadcrumbScript.type = 'application/ld+json';
        breadcrumbScript.text = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': item.name,
            'item': item.url
          }))
        });
        document.head.appendChild(breadcrumbScript);
      }

      // Add custom structured data
      if (structuredData) {
        const structuredScript = document.createElement('script');
        structuredScript.type = 'application/ld+json';
        structuredScript.text = JSON.stringify(structuredData);
        document.head.appendChild(structuredScript);
      }
    }
  }, [title, description, breadcrumbs, structuredData]);

  return null;
};

export default SEOHead;
