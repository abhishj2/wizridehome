import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { WordpressService } from '../services/wordpress.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-blog-single',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-single.component.html',
  styleUrl: './blog-single.component.css',
  encapsulation: ViewEncapsulation.None
})
export class BlogSingleComponent implements OnInit, OnDestroy {
  post: any = null;
  loading = true;
  error: string | null = null;
  slug: string = '';
  activeFaqIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wpService: WordpressService,
    private title: Title,
    private meta: Meta,
    private seoService: SeoService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      if (this.slug) {
        this.loadPost();
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up JSON-LD scripts (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const scriptIds = ['breadcrumb-schema', 'article-schema', 'faq-schema'];
      scriptIds.forEach(id => {
        const script = this.document.getElementById(id);
        if (script) {
          script.remove();
        }
      });
    }
  }

  loadPost(): void {
    this.loading = true;
    this.error = null;

    this.wpService.getPostBySlug(this.slug).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.post = data[0];
          this.setMetaTags();
          this.loading = false;
          console.log('Post loaded successfully:', this.post);
        } else {
          this.error = 'Post not found';
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = error.message || 'Failed to load post';
        this.loading = false;
        console.error('Error loading post:', error);
      }
    });
  }

  setMetaTags(): void {
    if (!this.post) return;

    // Get Yoast SEO data from WordPress
    const yoast = this.post.yoast_head_json || {};
    
    // Set title from Yoast SEO or fallback to post title
    const title = yoast.title || this.post.title?.rendered || 'Blog Post';
    this.title.setTitle(title);

    // Set meta description from Yoast SEO or fallback
    const description = yoast.description || 
                      this.post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || 
                      this.post.content?.rendered?.replace(/<[^>]*>/g, '').substring(0, 160) || 
                      'Read this amazing blog post on Wizzride';
    
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'title', content: title });

    // Canonical URL using SEO service
    const canonicalUrl = yoast.canonical || `https://www.wizzride.com/blog/${this.slug}`;
    this.seoService.setCanonicalURL(canonicalUrl);

    // Open Graph tags from Yoast SEO or fallback
    this.meta.updateTag({ property: 'og:title', content: yoast.og_title || title });
    this.meta.updateTag({ property: 'og:description', content: yoast.og_description || description });
    this.meta.updateTag({ property: 'og:url', content: yoast.og_url || canonicalUrl });
    this.meta.updateTag({ property: 'og:type', content: yoast.og_type || 'article' });
    this.meta.updateTag({ property: 'og:image', content: yoast.og_image?.[0]?.url || this.getFeaturedImage(this.post) });
    this.meta.updateTag({ property: 'og:site_name', content: yoast.og_site_name || 'Wizzride' });
    this.meta.updateTag({ property: 'og:locale', content: yoast.og_locale || 'en_IN' });

    // Twitter Card tags from Yoast SEO or fallback
    this.meta.updateTag({ name: 'twitter:card', content: yoast.twitter_card || 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: yoast.twitter_title || title });
    this.meta.updateTag({ name: 'twitter:description', content: yoast.twitter_description || description });
    this.meta.updateTag({ name: 'twitter:image', content: yoast.twitter_image || this.getFeaturedImage(this.post) });
    this.meta.updateTag({ name: 'twitter:site', content: yoast.twitter_site || '@wizzride' });

    // Article specific meta
    if (this.post.date) {
      this.meta.updateTag({ property: 'article:published_time', content: this.post.date });
    }
    if (this.post.modified) {
      this.meta.updateTag({ property: 'article:modified_time', content: this.post.modified });
    }

    // Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.wizzride.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://www.wizzride.com/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": title,
          "item": canonicalUrl
        }
      ]
    };

    // Add Breadcrumb Schema as JSON-LD script
    this.addJsonLdScript('breadcrumb-schema', breadcrumbSchema);

    // Article Schema
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Person",
        "name": this.getAuthorName(this.post)
      },
      "publisher": {
        "@type": "Organization",
        "name": "Wizzride",
        "url": "https://www.wizzride.com"
      },
      "datePublished": this.post.date,
      "dateModified": this.post.modified || this.post.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      }
    };

    // Add Article Schema as JSON-LD script
    this.addJsonLdScript('article-schema', articleSchema);

    // Add FAQ Schema if FAQ data exists
    const faqData = this.getFaqData(this.post);
    if (faqData.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map((faq: any) => ({
          "@type": "Question",
          "name": faq.faq_question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.faq_answer
          }
        }))
      };

      // Add FAQ Schema as JSON-LD script
      this.addJsonLdScript('faq-schema', faqSchema);
    }
  }

  getAuthorName(post: any): string {
    if (post._embedded && post._embedded.author && post._embedded.author[0]) {
      return post._embedded.author[0].name || 'Admin';
    }
    return 'Admin';
  }

  getReadTime(post: any): number {
    if (post.content && post.content.rendered) {
      const plainText = post.content.rendered.replace(/<[^>]*>/g, '');
      const wordCount = plainText.split(/\s+/).length;
      return Math.max(1, Math.ceil(wordCount / 200));
    }
    return 1;
  }

  getFeaturedImage(post: any): string {
    if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
      return post._embedded['wp:featuredmedia'][0].source_url;
    }
    return '/assets/images/default-blog.jpg'; // Fallback image
  }

  getFaqData(post: any): any[] {
    // Check if post has FAQ data from ACF repeater field
    if (post.acf && post.acf.faq && Array.isArray(post.acf.faq)) {
      return post.acf.faq;
    }
    
    // Fallback: check for FAQ in custom fields
    if (post.acf && post.acf.faq_content) {
      return post.acf.faq_content;
    }
    
    return [];
  }

  addJsonLdScript(id: string, schema: any): void {
    // Only add scripts in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remove existing script if it exists
    const existingScript = this.document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script element
    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    
    // Add to head
    this.document.head.appendChild(script);
  }

  toggleFaq(index: number): void {
    if (this.activeFaqIndex === index) {
      this.activeFaqIndex = null;
    } else {
      this.activeFaqIndex = index;
    }
  }


  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  async sharePost(): Promise<void> {
    if (!this.post || !isPlatformBrowser(this.platformId)) return;

    const shareData = {
      title: this.post.title?.rendered || 'Check out this article',
      text: this.post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || 'Check out this amazing travel article!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        const shareBtn = this.document.getElementById('shareBtn');
        if (shareBtn) {
          shareBtn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
          }, 2000);
        }
      } catch (err) {
        console.log('Failed to copy URL');
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const backToTop = this.document.getElementById('backToTop');
    const shareBtn = this.document.getElementById('shareBtn');
    const header = this.document.getElementById('header');
    
    // Update scroll progress bar
    const scrollTop = window.pageYOffset;
    const docHeight = this.document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (header) {
      header.style.transform = `scaleX(${scrollPercent / 100})`;
    }
    
    // Show/hide back to top and share buttons
    if (window.pageYOffset > 300) {
      backToTop?.classList.add('visible');
      shareBtn?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
      shareBtn?.classList.remove('visible');
    }
  }
}
