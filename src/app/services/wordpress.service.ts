import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  // Try different URLs based on your setup
  private baseUrl = 'https://cms.wizztest.com/wp-json/wp/v2';
  // Alternative URLs to try:
  // private baseUrl = 'http://wizcms.test/wp-json/wp/v2';
  // private baseUrl = 'http://127.0.0.1/wizcms/wp-json/wp/v2';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts?_embed`).pipe(
      catchError(this.handleError)
    );
  }

  getPostBySlug(slug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts?slug=${slug}&_embed&acf_format=standard&yoast_head_json=true`).pipe(
      catchError(this.handleError)
    );
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`).pipe(
      catchError(this.handleError)
    );
  }

  getHomepageOffers(): Observable<any> {
    const url = `${this.baseUrl}/homepage_offers?_embed&acf_format=standard&status=publish`;
    
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  getGoogleReviews(limit: number = 10): Observable<any> {
    const url = `${this.baseUrl}/google_reviews?_embed&acf_format=standard&status=publish&per_page=${limit}&orderby=date&order=desc`;
    
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  getHomeStatistics(): Observable<any> {
    // Use custom REST API endpoint
    const customBaseUrl = this.baseUrl.replace('/wp/v2', '');
    const url = `${customBaseUrl}/custom/v1/home-statistics`;
    
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  getFAQs(): Observable<any> {
    const url = `${this.baseUrl}/published_faqs?_embed&acf_format=standard&status=publish&per_page=100&orderby=menu_order&order=asc`;
    
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('WordPress API Error:', error);
    return throwError(() => new Error(`WordPress API Error: ${error.message}`));
  }
}