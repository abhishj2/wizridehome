# CSS Optimization Report - flightfinalpage.component.css

## Executive Summary
- **Total Lines**: 8057
- **Issues Found**: Multiple duplicate rules, redundant media queries, and combinable selectors
- **Potential Reduction**: Estimated 20-30% reduction possible

---

## 1. DUPLICATE CSS RULES (Can be Removed)

### 1.1 Close Button Duplicates
**Lines 12-29** and **Lines 852-871** both define `.close-btn`
- First definition has more complete styling
- **RECOMMENDATION**: Remove the second definition (lines 852-871)

### 1.2 Note Text Duplicates
**Lines 35-40** and **Lines 2129-2133** both define `.note-text`
- Similar but slightly different
- **RECOMMENDATION**: Consolidate into one definition

### 1.3 Proceed Button Multiple Definitions
- Lines 43-77: `.proceed-btn` with full styling
- Lines 2036-2053: `.proceed-btn` redefined
- **RECOMMENDATION**: Combine into single definition

### 1.4 Trip Popup Duplicates
- Lines 1957-1976: `.trip-popup` defined
- Lines 4478-4501: `.trip-popup` redefined with desktop styles
- **RECOMMENDATION**: Use media queries instead of redefining

### 1.5 Baggage Popup Duplicates
- Lines 2098-2117: `.baggage-popup` defined
- Lines 4502-4525: `.baggage-popup` redefined
- **RECOMMENDATION**: Consolidate with media queries

### 1.6 GST Popup Duplicates
- Lines 2320-2339: `.gst-popup` defined
- Lines 4526-4549: `.gst-popup` redefined
- **RECOMMENDATION**: Consolidate with media queries

---

## 2. REDUNDANT/OVERRIDDEN STYLES (Can be Removed)

### 2.1 Desktop Flight Summary
**Lines 687-693**: `.desktop-flight-summary` display set to none, then overridden
**Lines 919-922**: Same selector with different display value
- **RECOMMENDATION**: Remove initial definition, keep only final state

### 2.2 Mobile Flight Summary Conflicts
**Lines 695-697**: `.mobile-flight-summary` display block
**Lines 701-706**: Within media query, set to `display: none !important`
- **RECOMMENDATION**: Simplify logic

### 2.3 Footer Bar Multiple Definitions
- Lines 1463-1479: `.footer-bar` mobile definition
- Lines 3053-3083: Desktop definition
- Lines 4838-4901: Premium desktop definition
- **RECOMMENDATION**: Organize by media query, remove duplicates

### 2.4 Passenger Box Duplicates
- Lines 1173-1197: `.passenger-box` defined
- Lines 4975-5016: Redefined for desktop
- **RECOMMENDATION**: Use progressive enhancement approach

---

## 3. COMBINABLE SELECTORS

### 3.1 Shimmer Elements
**Lines 4285-4362**: Multiple shimmer classes with identical animation
```css
.shimmer-circle, .shimmer-box1, .shimmer-box, .shimmer-box-long1, 
.shimmer-box-long, .shimmer-box-long2 {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px; /* Adjust per class */
}
```
**RECOMMENDATION**: Combine common properties

### 3.2 Modal Overlays
- `.trip-overlay` (lines 1939-1945)
- `.bottom-sheet-overlay` (lines 1532-1541)
Both have similar fade-in animations
**RECOMMENDATION**: Create `.modal-overlay` base class

### 3.3 Modal Popups
- `.trip-popup` (lines 1957-1976)
- `.baggage-popup` (lines 2098-2117)
- `.gst-popup` (lines 2320-2339)
All share similar slide-up animation and structure
**RECOMMENDATION**: Create `.modal-popup` base class

### 3.4 Form Input Styles
Multiple form input definitions scattered throughout:
- Lines 1243-1251
- Lines 2388-2399
- Lines 4792-4801
**RECOMMENDATION**: Consolidate into single `.form-group input` ruleset

### 3.5 Icon Circles
- `.passenger-icon-circle` (lines 1182-1192)
- `.gst-box .icon` (lines 1393-1405)
Similar circular icon styling
**RECOMMENDATION**: Create `.icon-circle` base class

---

## 4. REDUNDANT MEDIA QUERIES (Can be Consolidated)

### 4.1 Multiple @media (max-width: 768px) Blocks
Found at:
- Lines 139-145
- Lines 701-747
- Lines 1455-1462
- Lines 4135-4176
- Lines 6695-6955
- Lines 7064-7414
**RECOMMENDATION**: Combine all mobile styles into 1-2 media query blocks

### 4.2 Multiple @media (min-width: 769px) Blocks
Found at:
- Lines 147-152
- Lines 749-1032
- Lines 3053-4133
- Lines 4177-5288
**RECOMMENDATION**: Combine all desktop styles into 1-2 media query blocks

### 4.3 Multiple @media (min-width: 1025px) Blocks
Found at:
- Lines 5289-5831
**RECOMMENDATION**: Can be merged with desktop styles using min-width: 769px with nested breakpoints

---

## 5. UNUSED/REDUNDANT PROPERTIES

### 5.1 Double Transitions
Many elements have transition defined multiple times:
```css
.baggage-option {
  transition: all 0.2s ease; /* Line 257 */
  /* ... */
  transition: all 0.3s ease; /* Line 4639 - overrides above */
}
```
**RECOMMENDATION**: Remove earlier definitions

### 5.2 Redundant !important Flags
Found excessive use in:
- `.desktop-only` and `.mobile-only` (lines 139-152)
- `.trip-body` (line 2006)
- `.flight-route` (line 4425)
**RECOMMENDATION**: Review necessity; remove where possible

### 5.3 Duplicate Animations
@keyframes fadeIn defined multiple times:
- Lines 1542-1549
- Lines 1951-1956
- Lines 2982-2988
**RECOMMENDATION**: Keep only one definition

### 5.4 Vendor Prefixes
Found `-webkit-backdrop-filter` and `-ms-overflow-style`
**RECOMMENDATION**: Verify if still needed for target browsers

---

## 6. CSS ORGANIZATION ISSUES

### 6.1 Scattered Flight Card Styles
Flight card styles are defined in multiple locations:
- Lines 325-750 (main definitions)
- Lines 3381-3618 (desktop)
- Lines 5421-5598 (premium desktop)
**RECOMMENDATION**: Group all flight-related styles together

### 6.2 Mixed Mobile/Desktop Styles
Desktop and mobile styles are interleaved throughout
**RECOMMENDATION**: Use mobile-first approach with progressive desktop enhancements

### 6.3 Component Styles Not Grouped
Related component styles scattered:
- Passenger forms: lines 1127-1381, 4792-4975
- GST forms: lines 1393-1453, 2320-2467
- Baggage: lines 218-351, 2098-2319
**RECOMMENDATION**: Group by component

---

## 7. SPECIFIC REMOVAL CANDIDATES

### 7.1 Empty/Minimal Rulesets
**Lines 154-156**: `.right-column` - no properties defined
**Lines 687-693**: Desktop flight summary display toggle
**RECOMMENDATION**: Remove or consolidate

### 7.2 Commented Out Code
Look for any commented CSS and remove if not needed

### 7.3 Overspecific Selectors
Examples:
- `.trip-popup:has(.passenger-form-content)` (line 1382)
- `.passenger-form-content .form-row-three .form-group .custom-calendar-container .calendar-input` (line 7902)
**RECOMMENDATION**: Simplify selector specificity

---

## 8. CONSOLIDATION OPPORTUNITIES

### 8.1 Button Styles
Multiple button styles can share base class:
- `.proceed-btn`
- `.addon-proceed-btn`
- `.baggage-done-btn`
- `.trip-done-btn`
- `.add-btn`
**RECOMMENDATION**: Create `.btn` base class with variants

### 8.2 Card Styles
Multiple card definitions:
- `.card`
- `.flight-summary-card`
- `.trip-flight`
- `.meal-card`
- `.service-card`
**RECOMMENDATION**: Create `.card` base class with modifiers

### 8.3 Flex Containers
Many flex containers with similar properties:
- `.fare-line`
- `.baggage-footer`
- `.addon-section-header`
**RECOMMENDATION**: Create utility classes like `.flex-between`

---

## 9. PERFORMANCE OPTIMIZATIONS

### 9.1 Complex Selectors
Reduce specificity for better performance:
- `.passenger-form-content .form-row-three .form-group #finalpagecal input[type="tel"]` (line 7924)
**RECOMMENDATION**: Use class-based targeting

### 9.2 Excessive Transitions
Many elements have `transition: all 0.2s`
**RECOMMENDATION**: Specify exact properties to transition

### 9.3 Box-Shadow Overuse
Heavy shadows on many elements may impact performance
**RECOMMENDATION**: Use simpler shadows or CSS filters where appropriate

---

## 10. RECOMMENDED ACTION PLAN

### Phase 1: Quick Wins (Immediate)
1. Remove duplicate `.close-btn` at lines 852-871
2. Remove duplicate animation keyframes (keep one @keyframes fadeIn)
3. Consolidate all mobile media queries into one block
4. Consolidate all desktop media queries into one block

### Phase 2: Structural (Medium Priority)
5. Create base classes for buttons, cards, modals
6. Group component styles together
7. Implement mobile-first approach
8. Remove redundant !important declarations

### Phase 3: Optimization (Low Priority)
9. Simplify complex selectors
10. Create utility classes for common patterns
11. Review and remove unused vendor prefixes
12. Specify exact transition properties

---

## ESTIMATED SIZE REDUCTION

**Current**: 8057 lines
**Potential After Optimization**: ~5500-6000 lines (25-30% reduction)

**Benefits**:
- Faster CSS parsing
- Easier maintenance
- Reduced file size
- Better code organization
- Fewer specificity conflicts

---

## NOTES

⚠️ **Before removing any CSS**:
1. Verify the HTML template to confirm class usage
2. Test all components in both mobile and desktop views
3. Check all breakpoints (768px, 1024px, 1400px)
4. Verify browser compatibility requirements
5. Test all interactive states (hover, active, disabled)

📋 **To proceed with optimization**, I recommend:
1. Create a backup of the current CSS file
2. Implement changes incrementally
3. Test after each major change
4. Use version control to track changes
