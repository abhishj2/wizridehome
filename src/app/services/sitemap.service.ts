import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { routes } from '../app.routes';
import { ApiserviceService } from './apiservice.service';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  private baseUrl = 'https://wizzride.com'; // Change to your production URL
  
  constructor(
    private http: HttpClient,
    private apiService: ApiserviceService
  ) {}

  /**
   * Generate sitemap XML from static and dynamic routes
   */
  generateSitemap(): Observable<string> {
    return forkJoin({
      staticUrls: of(this.getStaticRoutes()),
      dynamicUrls: this.getDynamicRoutes()
    }).pipe(
      map(({ staticUrls, dynamicUrls }) => {
        const allUrls = [...staticUrls, ...dynamicUrls];
        return this.buildSitemapXml(allUrls);
      }),
      catchError(error => {
        console.error('Error generating sitemap:', error);
        // Return sitemap with just static routes if dynamic fails
        return of(this.buildSitemapXml(this.getStaticRoutes()));
      })
    );
  }

  /**
   * Extract static routes from Angular routes configuration
   */
  private getStaticRoutes(): SitemapUrl[] {
    const urls: SitemapUrl[] = [];
    const today = new Date().toISOString().split('T')[0];

    routes.forEach(route => {
      if (route.path && !route.path.includes(':') && !route.path.includes('*')) {
        // Skip routes with parameters or wildcards
        // Also skip sitemap routes to avoid recursion
        if (route.path === 'sitemap' || route.path === 'sitemap.xml') {
          return;
        }
        
        const url: SitemapUrl = {
          loc: `${this.baseUrl}/${route.path === '' ? '' : route.path}`,
          lastmod: today,
          changefreq: this.getChangeFreq(route.path),
          priority: this.getPriority(route.path)
        };
        urls.push(url);
      }
    });

    return urls;
  }

  /**
   * Get dynamic routes from API or other sources
   */
  private getDynamicRoutes(): Observable<SitemapUrl[]> {
    const dynamicUrls: SitemapUrl[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Fetch dynamic blog slugs if you have a blog API
    // Example: this.getBlogSlugs().subscribe(slugs => { ... })
    
    // Fetch dynamic city routes from API
    return this.apiService.getstatewisecitywithpopularity().pipe(
      map((data: any) => {
        // Handle API response - adjust based on your API structure
        const locations = Array.isArray(data) ? data : (data?.locations || []);
        
        locations.forEach((location: any) => {
          if (location.cities && Array.isArray(location.cities)) {
            location.cities.forEach((city: any) => {
              const cityName = city.city || city.name;
              if (cityName) {
                // Generate destination routes
                const slug = this.slugify(cityName);
                dynamicUrls.push({
                  loc: `${this.baseUrl}/destinations/${slug}`,
                  lastmod: today,
                  changefreq: 'monthly',
                  priority: 0.7
                });
              }
            });
          }
        });

        return dynamicUrls;
      }),
      catchError(error => {
        console.error('Error fetching dynamic routes:', error);
        return of([]);
      })
    );
  }

  /**
   * Build XML sitemap string
   */
  private buildSitemapXml(urls: SitemapUrl[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url.loc)}</loc>\n`;
      
      if (url.lastmod) {
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }
      
      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }
      
      if (url.priority !== undefined) {
        xml += `    <priority>${url.priority}</priority>\n`;
      }
      
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Determine change frequency based on route path
   */
  private getChangeFreq(path: string): SitemapUrl['changefreq'] {
    if (path === '' || path === 'home') return 'daily';
    if (path.includes('blog')) return 'weekly';
    if (path.includes('destinations')) return 'monthly';
    if (path.includes('ourservices')) return 'weekly';
    return 'monthly';
  }

  /**
   * Determine priority based on route path
   */
  private getPriority(path: string): number {
    if (path === '' || path === 'home') return 1.0;
    if (path.includes('ourservices')) return 0.9;
    if (path.includes('destinations')) return 0.8;
    if (path.includes('aboutcompany') || path.includes('contactus')) return 0.7;
    return 0.6;
  }

  /**
   * Convert string to URL-friendly slug
   */
  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

