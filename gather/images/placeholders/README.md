# Image Placeholders

This document describes what images should be placed in each location throughout the website.

## Section 2: The Three Neighbors

### Audience Cards
1. **Margaret the Market Manager**
   - Location: `.audience-card` (first card)
   - Description: Warm photo of a woman with clipboard at an outdoor farmers market
   - Suggested: Professional shot showing market management in action
   - Dimensions: 400x240px (will be responsive)

2. **Victor the Vendor**
   - Location: `.audience-card` (second card)
   - Description: Farmer at market stall with fresh produce
   - Suggested: Vendor arranging vegetables or interacting with customer
   - Dimensions: 400x240px (will be responsive)

3. **Catherine the Customer**
   - Location: `.audience-card` (third card)
   - Description: Mom with reusable shopping bags at market
   - Suggested: Smiling shopper with sustainable bags, fresh produce visible
   - Dimensions: 400x240px (will be responsive)

## Section 9: Berwyn Case Study

### Testimonials
1. **Carlo Luciano**
   - Location: `.testimonial-card` (first)
   - Description: Carlo at the Berwyn market
   - Suggested: Professional headshot or candid at market
   - Dimensions: 300x200px

2. **Tom Mitchell**
   - Location: `.testimonial-card` (second)
   - Description: Tom at Mitchell Family Farm
   - Suggested: Farmer in field or with produce
   - Dimensions: 300x200px

3. **Jennifer Walsh**
   - Location: `.testimonial-card` (third)
   - Description: Jennifer with shopping bags
   - Suggested: Customer at pickup or with fresh purchases
   - Dimensions: 300x200px

## Section 11: Team

### Founders
1. **Carlo Luciano**
   - Location: `.founder-card` (first)
   - Description: Professional photo of Carlo at market
   - Suggested: High-quality founder headshot
   - Dimensions: 400x300px

2. **[Technical Co-founder]**
   - Location: `.founder-card` (second)
   - Description: CTO headshot
   - Suggested: Professional tech executive photo
   - Dimensions: 400x300px

## Image Format Recommendations

- **Format**: WebP with JPG fallback for best performance
- **Optimization**: Compress to ~80% quality
- **Resolution**: 2x for retina displays
- **Alt text**: Already provided in HTML for accessibility

## How to Replace Placeholders

1. Save your images to `/gather/images/` folder
2. Update the HTML by replacing:
   ```html
   <div class="card-image-placeholder">
     [Photo description]
   </div>
   ```
   With:
   ```html
   <img src="images/your-image.jpg" alt="Descriptive alt text">
   ```

## Optional: Hero Background

Consider adding a subtle background image of a farmers market scene with opacity overlay to the hero section for added warmth.

## Performance Notes

- Use lazy loading for images below the fold (data-src attribute)
- Serve appropriately sized images for mobile vs desktop
- Consider using a CDN for production deployment
