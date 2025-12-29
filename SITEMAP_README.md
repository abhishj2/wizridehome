# Dynamic Sitemap.xml Generation

This Angular application includes a dynamic sitemap generator that combines static routes from your Angular routing configuration with dynamic routes fetched from APIs.

## Features

- ✅ **Automatic Static Route Extraction**: Extracts all routes from `app.routes.ts`
- ✅ **Dynamic Route Generation**: Fetches dynamic routes from your API (cities, destinations, etc.)
- ✅ **SEO Optimized**: Includes lastmod, changefreq, and priority for each URL
- ✅ **XML Format**: Generates proper XML sitemap format
- ✅ **Error Handling**: Falls back to static routes if API fails

## Usage

### Access the Sitemap

Simply navigate to: `https://yourdomain.com/sitemap.xml`

The sitemap will be generated dynamically on each request, combining:
1. All static routes from `app.routes.ts`
2. Dynamic routes from your API (cities, destinations, etc.)

### Configuration

#### Update Base URL

In `src/app/services/sitemap.service.ts`, update the `baseUrl`:

```typescript
private baseUrl = 'https://wizzride.com'; // Change to your production URL
```

#### Customize Dynamic Routes

The service currently fetches dynamic routes from:
- `getstatewisecitywithpopularity()` API - generates destination routes

You can extend `getDynamicRoutes()` method to add more dynamic routes:
- Blog posts
- Product pages
- User profiles
- etc.

#### Adjust Priority and Change Frequency

Modify the `getChangeFreq()` and `getPriority()` methods in `sitemap.service.ts` to customize SEO settings for different route types.

## Example Sitemap Output

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://wizzride.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://wizzride.com/destinations/gangtok</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- More URLs... -->
</urlset>
```

## Server-Side Rendering (SSR)

If you're using Angular Universal, you may want to handle sitemap generation on the server side for better performance. You can:

1. Create a server route handler
2. Use the same `SitemapService` in your server code
3. Return XML with proper content-type headers

## Testing

1. Start your development server: `ng serve`
2. Navigate to: `http://localhost:4200/sitemap.xml`
3. Verify the XML output includes both static and dynamic routes

## Notes

- Routes with parameters (e.g., `:id`, `:slug`) are automatically excluded from static routes
- Wildcard routes (`*`) are also excluded
- The sitemap is generated fresh on each request
- Consider caching the sitemap for production if it becomes large

