import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  setCanonicalURL(url?: string) {
    const head = this.doc.head;
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');

    if (!url) {
      // If no URL is provided, remove the canonical tag if it exists
      if (link) {
        head.removeChild(link);
      }
      return;
    }

    if (!link) {
      // Create the canonical link element if it doesn't exist
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }

    // Set or update the href attribute
    link.setAttribute('href', url);
  }
}
