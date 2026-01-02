# Homepage Popup Setup Guide

This guide explains how to set up and manage the homepage auto-popup feature through WordPress settings.

## Overview

The homepage popup system allows you to create and manage an auto-opening popup on your homepage through a simple WordPress settings page. These popups can be used for:
- Announcements
- Special offers
- Important notifications
- Promotional campaigns
- Event highlights

## Features

- **Easy Settings Page**: Simple WordPress settings interface - no custom post types or ACF needed
- **Auto-open**: Popup opens automatically after a customizable delay
- **Show Once**: Option to show popup only once per user (uses localStorage)
- **Fully Customizable**: Image, title, subtitle, button text, and button URL
- **WordPress Managed**: All content managed through WordPress settings
- **Responsive**: Mobile-friendly design
- **Smooth Animations**: Fade-in and slide-up animations

## WordPress Backend Setup

### Access Settings Page

1. Log in to **WordPress Admin**
2. Go to **Settings** → **Homepage Popup**
3. You'll see the popup configuration page

**Note**: No plugins or custom post types required! Everything is built into WordPress settings.

## Configuring the Homepage Popup

### Step 1: Enable the Popup

1. Check the **"Enable popup on homepage"** checkbox
2. This activates the popup on your website

### Step 2: Upload Image (Required)

1. Click the **"Upload Image"** button
2. Select an image from your media library or upload a new one
3. **Recommended size**: 1200x800px for best quality
4. The image will appear as a preview
5. **This field is required** - the popup won't show without an image

**Image Guidelines**:
- Use high-quality images
- Keep file size under 500KB for fast loading
- Formats: JPG, PNG, or WebP
- Aspect ratio: 3:2 (landscape) works best

### Step 3: Set Title

1. Enter your popup title in the **"Title"** field
2. This will be the main heading of the popup
3. Keep it short and impactful (5-10 words)
4. Example: "Special Offer! 50% OFF"

### Step 4: Add Subtitle (Optional)

1. Enter description text in the **"Subtitle"** field
2. This provides additional context
3. Keep it concise (1-2 sentences)
4. Example: "Limited time offer on all bookings. Ends tonight!"

### Step 5: Configure Button (Optional)

**Button Text**:
- Enter the button label (e.g., "Shop Now", "Learn More", "Get Started")
- Keep it action-oriented (2-3 words max)
- Leave empty to hide the button

**Button URL**:
- Enter the destination URL
- External links: Use full URL (https://example.com)
- Internal pages: Use relative path (/booking, /about)
- Leave empty if you don't want a button

### Step 6: Set Behavior

**Show Once Per User**:
- Check this to show popup only once per browser
- Useful for announcements that don't need to be seen repeatedly
- Uses browser localStorage to remember

**Delay Before Showing**:
- Set how many seconds to wait before showing the popup
- Default: 2 seconds
- Range: 0-30 seconds
- Recommended: 2-3 seconds for good UX

### Step 7: Save Settings

1. Click **"Save Settings"** button
2. You'll see a success message
3. Popup will now appear on the homepage!

## Example Configurations

### Example 1: Flash Sale Announcement

```
✅ Enable popup on homepage
📷 Image: Sale banner image
📝 Title: Flash Sale! 50% OFF
📋 Subtitle: Limited time offer on all cab bookings. Book now and save big!
🔘 Button Text: Book Now
🔗 Button URL: /booking
☐ Show Once Per User: No (unchecked)
⏱️ Delay: 2 seconds
```

### Example 2: New Feature Launch

```
✅ Enable popup on homepage
📷 Image: Feature screenshot
📝 Title: Introducing Multi-City Flights
📋 Subtitle: Book complex routes with multiple stops. Try our new feature today!
🔘 Button Text: Try Now
🔗 Button URL: /flights
✅ Show Once Per User: Yes (checked)
⏱️ Delay: 3 seconds
```

### Example 3: Important Notice (No Button)

```
✅ Enable popup on homepage
📷 Image: Notification graphic
📝 Title: Service Maintenance Notice
📋 Subtitle: We're upgrading our systems on Sunday, Jan 15th. Service may be briefly interrupted from 2-4 AM.
🔘 Button Text: (leave empty)
🔗 Button URL: (leave empty)
☐ Show Once Per User: No (unchecked)
⏱️ Delay: 1 second
```

### Example 4: Contact/Support

```
✅ Enable popup on homepage
📷 Image: Customer support team photo
📝 Title: Need Help?
📋 Subtitle: Our 24/7 support team is here to assist you with any questions or concerns.
🔘 Button Text: Contact Us
🔗 Button URL: /contactus
✅ Show Once Per User: Yes (checked)
⏱️ Delay: 5 seconds
```

## Managing the Popup

### Temporarily Disable Popup

1. Go to **Settings** → **Homepage Popup**
2. Uncheck **"Enable popup on homepage"**
3. Click **"Save Settings"**
4. Popup will no longer appear on the site

### Update Popup Content

1. Go to **Settings** → **Homepage Popup**
2. Modify any field you want to change
3. Click **"Save Settings"**
4. Changes appear immediately on the site

### Change Image

1. Go to **Settings** → **Homepage Popup**
2. Click **"Change Image"** button
3. Select a new image from media library
4. Click **"Save Settings"**

### Remove Image

1. Go to **Settings** → **Homepage Popup**
2. Click **"Remove Image"** button
3. Upload a new image or save without image
4. **Note**: Popup won't display without an image

## Technical Details

### API Endpoint

The popup data is fetched from:
```
https://cms.wizztest.com/wp-json/wizcms/v1/homepage-popup
```

### Response Format

```json
{
  "success": true,
  "title": "Special Offer",
  "subtitle": "Get 50% off on all bookings",
  "image": "https://example.com/image.jpg",
  "button_text": "Book Now",
  "button_url": "https://example.com/booking",
  "is_active": true,
  "show_once": false,
  "delay_seconds": 2
}
```

### WordPress Options

The following options are stored in the database:

- `homepage_popup_is_active` - Whether popup is enabled (0 or 1)
- `homepage_popup_title` - Popup title text
- `homepage_popup_subtitle` - Popup subtitle text
- `homepage_popup_button_text` - Button label
- `homepage_popup_button_url` - Button destination URL
- `homepage_popup_show_once` - Show only once per user (0 or 1)
- `homepage_popup_delay_seconds` - Delay in seconds (float)
- `homepage_popup_image_id` - WordPress media attachment ID

### Browser Storage

If **Show Once Per User** is enabled, the system stores a flag in localStorage:
```javascript
localStorage.setItem('homepage_popup_shown', 'true');
```

To reset during testing:
```javascript
// In browser console
localStorage.removeItem('homepage_popup_shown');
// Or
localStorage.clear();
```

## Styling Customization

The popup styles can be customized in:
```
src/app/home/home.component.css
```

Key CSS classes:
- `.homepage-popup-overlay` - Backdrop overlay
- `.homepage-popup-modal` - Main popup container
- `.homepage-popup-close` - Close button
- `.homepage-popup-image` - Image container
- `.homepage-popup-content` - Content area with title/subtitle/button
- `.homepage-popup-title` - Title text styling
- `.homepage-popup-subtitle` - Subtitle text styling
- `.homepage-popup-button` - Button styling

## Troubleshooting

### Popup Not Showing

1. **Check if popup is enabled**:
   - Go to **Settings** → **Homepage Popup**
   - Ensure **"Enable popup on homepage"** is checked

2. **Verify image is uploaded**:
   - The popup requires an image to display
   - Check if image preview shows in settings

3. **Check "Show Once" setting**:
   - If enabled, popup shows only once per browser
   - Clear browser cache or test in Incognito mode
   - Or run in console: `localStorage.removeItem('homepage_popup_shown')`

4. **Check browser console**:
   - Open DevTools (F12) → Console tab
   - Look for any JavaScript errors

5. **Verify API is working**:
   - Visit: `https://cms.wizztest.com/wp-json/wizcms/v1/homepage-popup`
   - Should return JSON with `"success": true`

### Image Not Displaying

1. **Check if image was saved**:
   - Go to settings page
   - Verify image preview is showing

2. **Check image URL**:
   - Visit the API endpoint
   - Verify `image` field has a valid URL

3. **Check file permissions**:
   - Ensure WordPress uploads folder is accessible
   - Verify image file exists in media library

### Button Not Working

1. **Verify Button URL format**:
   - External: Must start with `http://` or `https://`
   - Internal: Must start with `/`
   - Examples: `https://wizzride.com` or `/booking`

2. **Check button text**:
   - Button won't display if button text is empty
   - Enter text to make button visible

### Changes Not Appearing

1. **Clear browser cache**:
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   - Or clear cache in browser settings

2. **Check if settings were saved**:
   - Look for "Settings saved successfully!" message
   - Re-save if needed

3. **Verify API cache**:
   - Some hosting providers cache API responses
   - Wait 5-10 minutes or clear server cache

## Best Practices

### Content Guidelines

1. **Title**: 
   - 5-10 words maximum
   - Use clear, action-oriented language
   - Highlight the main benefit or offer

2. **Subtitle**: 
   - 1-2 sentences
   - Provide context or details
   - Include urgency if applicable ("Limited time", "Today only")

3. **Button Text**: 
   - 1-3 words
   - Action verbs ("Shop", "Learn", "Get", "Start")
   - Be specific ("Book Now" vs "Click Here")

### Image Guidelines

1. **Size**: 1200x800px recommended
2. **File size**: Under 500KB for fast loading
3. **Format**: JPG for photos, PNG for graphics
4. **Quality**: High resolution but optimized
5. **Content**: Relevant to the message, visually appealing

### Timing Guidelines

1. **Delay**: 
   - 2-3 seconds is optimal
   - Too fast (< 1s) feels intrusive
   - Too slow (> 5s) might be missed

2. **Show Once**: 
   - Enable for one-time announcements
   - Disable for ongoing offers or promotions
   - Consider user experience vs conversion goals

### Testing Checklist

Before publishing:
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile (iOS Safari, Chrome)
- [ ] Verify image loads quickly
- [ ] Check button redirects correctly
- [ ] Test "Show Once" functionality
- [ ] Verify close button works
- [ ] Check on different screen sizes
- [ ] Test delay timing feels right

## Frequently Asked Questions

**Q: Can I have multiple popups?**  
A: Currently, only one popup can be active at a time. The settings page manages a single popup configuration.

**Q: Does this work with caching plugins?**  
A: Yes, but you may need to clear the cache after making changes to see updates immediately.

**Q: Can I schedule when the popup appears?**  
A: Not built-in, but you can manually enable/disable it in settings when needed.

**Q: Will this slow down my site?**  
A: No, the popup loads asynchronously and doesn't block page rendering.

**Q: Can visitors close the popup?**  
A: Yes, there's a close (X) button in the top-right corner, or they can click outside the popup.

**Q: What happens if I don't set a button?**  
A: The popup will display without a button, showing only the image, title, and subtitle.

**Q: Can I use HTML in the title or subtitle?**  
A: No, fields are sanitized for security. Use plain text only.

**Q: How do I track popup conversions?**  
A: Add Google Analytics UTM parameters to the button URL or use Google Tag Manager to track clicks.

## Support & Resources

### Need Help?

1. Check troubleshooting section above
2. Verify all settings are configured correctly
3. Test in Incognito mode to rule out caching issues
4. Check browser console for error messages

### Settings Location

**WordPress Admin** → **Settings** → **Homepage Popup**

### API Endpoint

```
GET https://cms.wizztest.com/wp-json/wizcms/v1/homepage-popup
```

---

**Version**: 2.0 (Settings-Based)  
**Last Updated**: January 2, 2026  
**Author**: WizzRide Development Team  
**Advantage**: No custom post types or ACF plugins required!
