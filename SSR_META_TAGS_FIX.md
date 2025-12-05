# SSR Meta Tags Fix - Angular Prerendering

## Problem

Web crawlers (Google, Facebook, Twitter) were seeing only the default `<title>Wizbooking</title>` from `index.html` instead of the dynamic titles set in components.

**Root Cause:** Angular's prerender/SSR engine **ONLY executes the constructor and class properties**, NOT lifecycle hooks like `ngOnInit()`.

## Solution

Move `titleService.setTitle()` and `metaService.updateTag()` calls **from `ngOnInit()` to the `constructor()`**.

### Why This Works

| Lifecycle Hook | CSR (Browser) | SSR (Prerender) | When Crawlers See It |
|---------------|---------------|-----------------|---------------------|
| `constructor()` | ✅ Executes | ✅ Executes | ✅ YES |
| `ngOnInit()` | ✅ Executes | ❌ Skipped | ❌ NO |
| `ngAfterViewInit()` | ✅ Executes | ❌ Skipped | ❌ NO |

## Implementation Pattern

### For Static Pages (Home, Contact, Services)

```typescript
constructor(
  private titleService: Title,
  private metaService: Meta,
  private seoService: SeoService
) {
  // SSR Title & Meta Render (executes during prerender)
  this.titleService.setTitle('Your Page Title Here');
  this.seoService.setCanonicalURL('https://yoursite.com/page');
  this.metaService.updateTag({
    name: 'description',
    content: 'Your meta description here'
  });
  this.metaService.updateTag({
    name: 'keywords',
    content: 'keyword1, keyword2'
  });
}

ngOnInit(): void {
  // Keep for CSR hydration (browser-side)
  this.titleService.setTitle('Your Page Title Here');
  // ... rest of your init logic
}
```

### For Dynamic Pages (Blog Posts, Vehicle Details, Routes)

```typescript
constructor(
  private route: ActivatedRoute,
  private titleService: Title,
  private metaService: Meta
) {
  // SSR Default Title & Meta (fallback for prerender)
  this.titleService.setTitle('Default Title - Will Update After Load');
  this.metaService.updateTag({
    name: 'description',
    content: 'Default description'
  });
}

ngOnInit(): void {
  // Load dynamic data
  this.route.params.subscribe(params => {
    this.loadData(params['id']).then(data => {
      // Update with actual data (CSR)
      this.titleService.setTitle(data.title);
      this.metaService.updateTag({
        name: 'description',
        content: data.description
      });
    });
  });
}
```

## Files Already Updated

✅ **Critical Pages (Done)**
- `src/app/home/home.component.ts` - Homepage
- `src/app/blogmain/blogmain.component.ts` - Blog listing
- `src/app/blog-single/blog-single.component.ts` - Blog post detail
- `src/app/buyandsellcar/buyandsellcar.component.ts` - Car marketplace
- `src/app/vehicledetails/vehicledetails.component.ts` - Vehicle details
- `src/app/contactus/contactus.component.ts` - Contact page
- `src/app/ourservices/servicesmain/servicesmain.component.ts` - Services main

## Remaining Files to Update

Run the automated script:
```bash
cd wizbooking
node update-ssr-meta-tags.js
```

Or manually update these 109 remaining files using the pattern above:

### Career Pages (3)
- careerpages/applyforjob
- careerpages/partnerwithus
- careerpages/driverjob

### Destinations (48)
- All Sikkim destinations (13 files)
- All Nagaland destinations (6 files)
- All Meghalaya destinations (7 files)
- All Darjeeling destinations (8 files)
- All Assam destinations (6 files)
- All Arunachal destinations (8 files)

### Airport Routes (35)
- Bagdogra airport routes (8 files)
- Guwahati airport routes (6 files)
- Pakyong airport routes (2 files)
- Airport shared cabs (4 files)
- Airport city reserved cabs (6 files)
- Airport pages (4 files)

### Services (7)
- ourservices/corporatepackages
- ourservices/holidaytours
- ourservices/packageddelivery
- ourservices/localrides
- ourservices/intercityrides
- ourservices/wizzrideinternationalholiday
- ourservices/northeastindiaholiday

### Other Pages (16)
- frequentlyaskedquestions
- newsandannouncements
- ilp/sikkimpermit, nagalandpermit, arunachalpermit
- collaborate/infulencerapply
- aboutpages/* (4 files)
- importantlinks/* (4 files)
- japantour
- cancelbooking
- flight-booking

## Testing

### 1. Build with SSR
```bash
npm run build:ssr
```

### 2. Test Prerendered HTML
Check the generated HTML files in `dist/wizbooking/browser/` - they should contain the correct title and meta tags in the `<head>` section.

```bash
# View homepage HTML
cat dist/wizbooking/browser/index.html | grep -A 20 "<head>"

# Should see your custom title, not "Wizbooking"
```

### 3. Test with Crawler
```bash
# Simulate Google Bot
curl -A "Googlebot" https://yoursite.com/ | grep "<title>"
```

### 4. Verify in Production
- Use Google's Rich Results Test: https://search.google.com/test/rich-results
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

## Key Points

1. ✅ **Constructor = SSR + CSR** (runs always)
2. ✅ **ngOnInit = CSR only** (keep for hydration)
3. ❌ **ngAfterViewInit = CSR only** (never runs in SSR)
4. 🔄 **Dynamic pages:** Default in constructor, update in ngOnInit
5. 📦 **Static pages:** Set once in constructor, duplicate in ngOnInit

## Deployment

After updating all files:

1. Build SSR: `npm run build:ssr`
2. Deploy the `dist/wizbooking/` folder
3. Configure your server to run Node.js SSR server
4. Or use prerendering with `npm run prerender`

## Notes

- The `ngOnInit()` calls are NOT redundant - they ensure proper hydration when Angular bootstraps in the browser
- For prerender, you may need to add all your routes to `angular.json` under `prerender.options.routes`
- Test thoroughly before deploying to production

