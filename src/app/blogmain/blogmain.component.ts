import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { WordpressService } from '../services/wordpress.service';

@Component({
  selector: 'app-blogmain',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blogmain.component.html',
  styleUrl: './blogmain.component.css'
})
export class BlogmainComponent implements OnInit, OnDestroy {
  posts: any[] = [];
  filteredPosts: any[] = [];
  categories: any[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  selectedCategory = 'all';

  constructor(
    private wpService: WordpressService,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.setMetaTags();
    this.loadPosts();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions if needed
  }

  setMetaTags(): void {
    this.title.setTitle('Wizzride Blog | Travel Tips, Guides & Updates');
    
    this.meta.updateTag({ name: 'title', content: 'Wizzride Blog | Travel Tips, Guides & Updates' });
    this.meta.updateTag({ 
      name: 'description', 
      content: 'Explore the Wizzride Blog for expert travel tips, destination guides, and latest updates on transportation services across North East India and Himalayan routes. Plan smarter journeys with Wizzride.' 
    });
    
    // Canonical URL
    this.meta.updateTag({ rel: 'canonical', href: 'https://www.wizzride.com/blog' });
    
    // Schema markup
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Our Services",
          "item": {
            "@type": "Service",
            "@id": "https://www.wizzride.com/blog"
          }
        }
      ]
    };
    
    this.meta.updateTag({ 
      name: 'application/ld+json', 
      content: JSON.stringify(schema) 
    });
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;
    
    this.wpService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.filteredPosts = [...data];
        this.loading = false;
        console.log('Posts loaded successfully:', data);
      },
      error: (error) => {
        this.error = error.message || 'Failed to load posts';
        this.loading = false;
        console.error('Error loading posts:', error);
      }
    });
  }

  loadCategories(): void {
    this.wpService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categories loaded successfully:', data);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onSearch(): void {
    this.filterPosts();
  }

  filterByCategory(category: string, event: Event): void {
    event.preventDefault();
    this.selectedCategory = category;
    this.filterPosts();
  }

  filterPosts(): void {
    let filtered = [...this.posts];

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(post => 
        this.getPostCategory(post) === this.selectedCategory
      );
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.rendered.toLowerCase().includes(searchLower) ||
        this.getExcerpt(post).toLowerCase().includes(searchLower)
      );
    }

    this.filteredPosts = filtered;
  }

  getPostCategory(post: any): string {
    if (post.categories && post.categories.length > 0) {
      const category = this.categories.find(cat => cat.id === post.categories[0]);
      return category ? category.slug : 'general';
    }
    return 'general';
  }

  getPostCategoryName(post: any): string {
    if (post.categories && post.categories.length > 0) {
      const category = this.categories.find(cat => cat.id === post.categories[0]);
      return category ? category.name : 'General';
    }
    return 'General';
  }

  getFeaturedImage(post: any): string {
    if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
      return post._embedded['wp:featuredmedia'][0].source_url;
    }
    return '/assets/images/default-blog.jpg'; // Fallback image
  }

  getExcerpt(post: any): string {
    if (post.excerpt && post.excerpt.rendered) {
      const plainText = post.excerpt.rendered.replace(/<[^>]*>/g, '');
      return plainText.length > 180 ? plainText.substring(0, 180) + '...' : plainText;
    }
    return 'No excerpt available.';
  }

  getReadTime(post: any): number {
    if (post.content && post.content.rendered) {
      const plainText = post.content.rendered.replace(/<[^>]*>/g, '');
      const wordCount = plainText.split(/\s+/).length;
      return Math.max(1, Math.ceil(wordCount / 200));
    }
    return 1;
  }
}
