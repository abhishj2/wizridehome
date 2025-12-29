import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SitemapService } from '../services/sitemap.service';

/**
 * Resolver to pre-fetch sitemap data before component loads
 * This ensures sitemap is ready when route is accessed
 */
@Injectable({
  providedIn: 'root'
})
export class SitemapResolver implements Resolve<string> {
  constructor(private sitemapService: SitemapService) {}

  resolve(): Observable<string> {
    return this.sitemapService.generateSitemap();
  }
}

