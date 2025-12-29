import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { SitemapService } from '../services/sitemap.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [CommonModule],
  template: '<pre *ngIf="sitemapXml">{{ sitemapXml }}</pre>',
  styles: ['pre { white-space: pre-wrap; word-wrap: break-word; font-family: monospace; }']
})
export class SitemapComponent implements OnInit {
  sitemapXml: string = '';

  constructor(
    private sitemapService: SitemapService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Generate sitemap immediately
    this.sitemapService.generateSitemap().subscribe({
      next: (xml) => {
        this.sitemapXml = xml;
        
        // Set content type for XML response
        if (isPlatformBrowser(this.platformId)) {
          // Try to set content type via meta tag
          const meta = this.document.createElement('meta');
          meta.setAttribute('http-equiv', 'Content-Type');
          meta.setAttribute('content', 'application/xml; charset=utf-8');
          this.document.head.appendChild(meta);
        }
      },
      error: (error) => {
        console.error('Error generating sitemap:', error);
        // Fallback sitemap with just home page
        this.sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://wizzride.com/</loc>\n    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>';
      }
    });
  }
}

