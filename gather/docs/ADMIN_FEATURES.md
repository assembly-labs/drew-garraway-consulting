# Gather Admin Panel - Comprehensive Feature Specification

> **Context:** In MVP, the Gather team centrally manages all products on behalf of 70+ vendors at Berwyn Farmers Market. Vendors do not log in yet (Phase 2). This document exhaustively covers all admin/product management features.

---

## Priority & Complexity Legend

| Priority | Meaning |
|----------|---------|
| **P0** | Must-have for MVP launch - blocking |
| **P1** | Should-have for MVP - important but not blocking |
| **P2** | Nice-to-have - defer to post-MVP |

| Complexity | Meaning |
|------------|---------|
| **Low** | 1-2 days of development |
| **Med** | 3-5 days of development |
| **High** | 1-2+ weeks of development |

---

## Table of Contents

1. [Product Management](#1-product-management)
2. [Bulk Operations](#2-bulk-operations)
3. [Photo & Media Management](#3-photo--media-management)
4. [Inventory & Availability](#4-inventory--availability)
5. [Category & Tag Management](#5-category--tag-management)
6. [Vendor Management](#6-vendor-management)
7. [Market Configuration](#7-market-configuration)
8. [User & Access Management](#8-user--access-management)
9. [Audit & Activity Logging](#9-audit--activity-logging)
10. [Reporting & Analytics](#10-reporting--analytics)
11. [Search & Filtering](#11-search--filtering)
12. [Import & Export](#12-import--export)
13. [Workflow & Notifications](#13-workflow--notifications)
14. [UX Patterns & Design Notes](#14-ux-patterns--design-notes)

---

## 1. Product Management

### Core CRUD Operations

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Create product** | P0 | Low | Add new product with name, vendor, category, price, unit type, description |
| **Edit product** | P0 | Low | Modify any product field with inline or modal editing |
| **Delete product** | P0 | Low | Soft-delete product with confirmation dialog (preserve for order history) |
| **View product list** | P0 | Med | Paginated table/grid of all products with key info at a glance |
| **View product detail** | P0 | Low | Full detail page showing all product information |
| **Duplicate product** | P1 | Low | Clone existing product as starting point for similar items |
| **Archive product** | P1 | Low | Hide product from storefront without deleting (seasonal items) |
| **Restore archived product** | P1 | Low | Bring archived product back to active status |
| **Product versioning** | P2 | High | Track historical changes to product data for auditing |

### Product Fields (MVP)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text | Yes | Max 100 characters |
| Vendor | Dropdown | Yes | Select from vendor list |
| Category | Dropdown | Yes | Single category assignment |
| Subcategory | Dropdown | No | Optional second-level categorization |
| Price | Decimal | Yes | Two decimal places, USD |
| Unit Type | Dropdown | Yes | each, lb, oz, pint, bunch, dozen, half-dozen, quart, gallon |
| Description | Textarea | No | Rich text or plain text, max 1000 characters |
| Short Description | Text | No | 150 char summary for listings |
| Primary Photo | Image | Recommended | Main product image |
| Additional Photos | Images | No | Up to 5 gallery images |
| Dietary Tags | Multi-select | No | Organic, Non-GMO, Vegan, Gluten-Free, etc. |
| Availability Status | Toggle | Yes | In Stock / Out of Stock |
| Inventory Count | Number | No | Optional quantity tracking |
| Sort Order | Number | No | Custom ordering within category |
| Featured | Toggle | No | Show on homepage featured section |
| SKU | Text | No | Internal reference code |

### Product Fields (Phase 2)

| Field | Type | Notes |
|-------|------|-------|
| Low Stock Threshold | Number | Alert when inventory drops below |
| Seasonal Start Date | Date | Auto-show product on this date |
| Seasonal End Date | Date | Auto-hide product on this date |
| Variants | Array | Size/color options (e.g., Small, Medium, Large) |
| Related Products | References | Cross-sell suggestions |
| Prep Instructions | Text | Internal notes for order packing |

---

## 2. Bulk Operations

### MVP Bulk Actions

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Multi-select products** | P0 | Low | Checkbox selection in product list for bulk actions |
| **Bulk availability toggle** | P0 | Low | Mark multiple products in-stock or out-of-stock at once |
| **Bulk delete** | P1 | Low | Delete multiple selected products with confirmation |
| **Bulk archive** | P1 | Low | Archive multiple products simultaneously |
| **Bulk category change** | P1 | Med | Move multiple products to different category |
| **Bulk vendor reassign** | P2 | Med | Reassign products to different vendor (rare use case) |

### Advanced Bulk Operations (Post-MVP)

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Bulk price adjustment** | P2 | Med | Increase/decrease prices by percentage or fixed amount |
| **Bulk tag assignment** | P2 | Low | Add/remove dietary tags from multiple products |
| **Bulk photo removal** | P2 | Low | Clear photos from selected products |
| **Saved bulk selections** | P2 | Med | Save commonly-used product groups for quick selection |
| **Scheduled bulk actions** | P2 | High | Queue bulk changes to execute at specific time |

### Inline Editing

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Inline price edit** | P1 | Med | Edit price directly in list view without opening detail |
| **Inline availability toggle** | P0 | Low | One-click toggle in list view |
| **Inline inventory update** | P1 | Low | Quick inventory adjustment in list view |
| **Inline name edit** | P2 | Low | Click-to-edit product name in place |

---

## 3. Photo & Media Management

### Photo Upload

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Single photo upload** | P0 | Low | Upload primary product image via file picker |
| **Drag-and-drop upload** | P0 | Low | Drag image files directly onto upload zone |
| **Multi-photo upload** | P1 | Med | Upload multiple images at once for gallery |
| **Camera capture** | P1 | Med | Take photo directly from device camera (mobile) |
| **Photo from URL** | P2 | Low | Paste image URL to import from web |

### Photo Processing

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Auto-compression** | P0 | Med | Compress images to max 1MB, resize to 1200px wide |
| **Format conversion** | P0 | Low | Convert to WebP for smaller file sizes |
| **Thumbnail generation** | P0 | Med | Auto-generate thumbnail, medium, and full sizes |
| **EXIF data stripping** | P1 | Low | Remove metadata for privacy and file size |
| **Background removal** | P2 | High | AI-powered background removal (like Square's auto-polish) |
| **Basic image editing** | P2 | Med | Crop, rotate, brightness adjustment in-browser |

### Photo Organization

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Reorder gallery images** | P1 | Low | Drag-and-drop to reorder product photos |
| **Set primary photo** | P0 | Low | Designate which photo shows in listings |
| **Delete photo** | P0 | Low | Remove individual photos from product |
| **Photo alt text** | P1 | Low | Accessibility description for screen readers |
| **Bulk photo upload** | P1 | Med | Upload many photos that auto-match to products by filename |
| **Photo library** | P2 | Med | Central media library to reuse images across products |

---

## 4. Inventory & Availability

### Availability Management

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Binary availability toggle** | P0 | Low | Simple In Stock / Out of Stock per product |
| **Quick "mark all out"** | P0 | Low | One-click to mark all of a vendor's products unavailable |
| **Quick "mark all in"** | P0 | Low | One-click to mark all of a vendor's products available |
| **Availability by vendor view** | P1 | Med | Dashboard showing availability status grouped by vendor |
| **Seasonal availability** | P2 | Med | Set date ranges when product is available |
| **Day-of-week availability** | P2 | Med | Product only available on certain market days |

### Inventory Tracking (Optional in MVP)

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Inventory count field** | P1 | Low | Optional quantity field per product |
| **Manual inventory adjustment** | P1 | Low | Add/subtract inventory with reason logging |
| **Inventory deduction on order** | P1 | Med | Auto-reduce count when order placed |
| **Inventory restoration on cancel** | P1 | Med | Auto-restore count when order cancelled |
| **Low stock indicator** | P1 | Low | Visual badge when inventory below threshold |
| **Out-of-stock auto-toggle** | P2 | Med | Automatically mark unavailable when count reaches 0 |

### Advanced Inventory (Post-MVP)

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Low stock alerts** | P2 | Med | Email/push notification when stock is low |
| **Inventory history** | P2 | Med | Log of all inventory changes with timestamps |
| **Inventory forecasting** | P2 | High | Predict stock needs based on order history |
| **Batch/lot tracking** | P2 | High | Track inventory by production batch |
| **Expiration tracking** | P2 | Med | Track perishable item expiration dates |

---

## 5. Category & Tag Management

### Category Management

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **View all categories** | P0 | Low | List of all product categories |
| **Create category** | P0 | Low | Add new category with name, slug, icon |
| **Edit category** | P0 | Low | Modify category name, icon, description |
| **Delete category** | P1 | Low | Remove category (must reassign products first) |
| **Reorder categories** | P1 | Low | Drag-and-drop to set display order |
| **Category icon/image** | P1 | Low | Assign icon or image to category |
| **Subcategories** | P2 | Med | Nested category hierarchy (Produce > Vegetables > Root Vegetables) |
| **Category visibility** | P2 | Low | Hide category from storefront without deleting |

### Dietary Tags

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Predefined tag list** | P0 | Low | Organic, Non-GMO, Vegan, Vegetarian, Gluten-Free, Dairy-Free, Local, Pasture-Raised |
| **Assign tags to products** | P0 | Low | Multi-select tag assignment in product editor |
| **Create custom tag** | P1 | Low | Add new dietary/attribute tags as needed |
| **Edit tag** | P1 | Low | Rename or change tag display properties |
| **Delete tag** | P2 | Low | Remove tag (removed from all products) |
| **Tag icons/colors** | P2 | Low | Visual customization for tag badges |

---

## 6. Vendor Management

### Vendor Profiles

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **View vendor list** | P0 | Low | All vendors with key info and product counts |
| **Create vendor** | P0 | Low | Add new vendor profile |
| **Edit vendor** | P0 | Low | Modify vendor information |
| **Delete vendor** | P1 | Low | Soft-delete (only if no products/orders) |
| **Archive vendor** | P1 | Low | Hide vendor from storefront (seasonal/inactive) |
| **Vendor detail page** | P0 | Low | Full vendor profile with all their products |

### Vendor Profile Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text | Yes | Business/farm name |
| Slug | Text | Auto-generated | URL-friendly identifier |
| Photo/Logo | Image | Recommended | Vendor image for storefront |
| Description | Textarea | Recommended | "Our Story" for vendor page |
| Tagline | Text | No | Short description for listings |
| Farm Location | Text | No | Where produce is grown |
| Contact Email | Email | No | Internal contact (not shown publicly) |
| Contact Phone | Phone | No | Internal contact |
| Website | URL | No | Link to vendor's own website |
| Social Links | URLs | No | Instagram, Facebook, etc. |
| Is Active | Toggle | Yes | Show/hide on storefront |
| Product Categories | Multi-select | No | What types of products they sell |
| Certifications | Multi-select | No | USDA Organic, etc. |
| Booth/Stall Number | Text | No | Physical location at market |

### Vendor Operations

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **View vendor products** | P0 | Low | Filter product list to single vendor |
| **Vendor product count** | P0 | Low | Show number of products per vendor |
| **Vendor availability summary** | P1 | Low | How many products in/out of stock per vendor |
| **Quick-add product to vendor** | P1 | Low | Add product with vendor pre-selected |
| **Vendor order summary** | P1 | Med | Orders that include this vendor's products |
| **Duplicate vendor** | P2 | Low | Clone vendor profile as template |

---

## 7. Market Configuration

### Market Settings

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Market name** | P0 | Low | Display name for the market |
| **Market slug** | P0 | Low | URL identifier (e.g., "berwyn") |
| **Market logo** | P0 | Low | Logo image upload |
| **Market description** | P0 | Low | About text for homepage |
| **Market address** | P0 | Low | Physical location for pickup |
| **Market coordinates** | P1 | Low | Lat/lng for map display |
| **Contact email** | P0 | Low | Customer support email |
| **Contact phone** | P0 | Low | Customer support phone |
| **Social media links** | P1 | Low | Facebook, Instagram, etc. |

### Operating Hours

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Market days** | P0 | Low | Which days market operates (e.g., Saturday only) |
| **Market hours** | P0 | Low | Open and close time per market day |
| **Special closures** | P1 | Med | Holiday closures, weather cancellations |
| **Season dates** | P1 | Low | Market season start and end dates |
| **Market day calendar** | P2 | Med | Visual calendar of all market days |

### Pickup Configuration

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Pickup time slots** | P0 | Med | Define available pickup windows (e.g., 9-10am, 10-11am) |
| **Slot duration** | P0 | Low | Length of each pickup window (30min, 1hr) |
| **Slots per day** | P0 | Low | Number of time slots available |
| **Max orders per slot** | P0 | Low | Capacity limit per pickup window |
| **Slot availability view** | P1 | Med | Dashboard showing remaining capacity per slot |
| **Order cutoff time** | P0 | Low | When orders must be placed by (e.g., Friday 8pm) |
| **Lead time** | P0 | Low | Minimum hours between order and pickup |

### Fees & Pricing

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Service fee type** | P0 | Low | Percentage, flat fee, or none |
| **Service fee amount** | P0 | Low | The fee value (e.g., 5% or $3.00) |
| **Minimum order amount** | P1 | Low | Optional cart minimum |
| **Free service fee threshold** | P2 | Low | No fee above certain order size |
| **Tax configuration** | P2 | Med | Sales tax settings (likely exempt for farmers markets) |

---

## 8. User & Access Management

### User Accounts

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **View all users** | P0 | Low | List of all admin/staff users |
| **Create user** | P0 | Low | Invite new user with email |
| **Edit user** | P0 | Low | Update user name, email, role |
| **Deactivate user** | P0 | Low | Disable access without deleting |
| **Delete user** | P1 | Low | Permanently remove user (preserve in audit logs) |
| **Password reset** | P0 | Low | Send password reset email |
| **User profile** | P1 | Low | Users can update their own info |

### Roles & Permissions

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Role: Super Admin** | P0 | Low | Full access to everything |
| **Role: Admin** | P0 | Low | Full access except user management |
| **Role: Staff** | P0 | Low | Orders, check-in, pick lists - no settings |
| **Role: Viewer** | P2 | Low | Read-only access for reporting |
| **Permission matrix view** | P2 | Med | Visual grid of role permissions |
| **Custom roles** | P2 | High | Create custom permission sets |

### Authentication

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Email/password login** | P0 | Low | Standard authentication |
| **Session management** | P0 | Low | Automatic logout after inactivity |
| **Remember me** | P1 | Low | Extended session option |
| **Magic link login** | P2 | Med | Passwordless login via email link |
| **Two-factor authentication** | P2 | Med | Optional 2FA for enhanced security |
| **SSO integration** | P2 | High | Google Workspace or similar |

---

## 9. Audit & Activity Logging

### Activity Log

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Log all changes** | P0 | Med | Record who changed what, when |
| **View activity feed** | P1 | Med | Chronological list of all system activity |
| **Filter by user** | P1 | Low | See all actions by specific user |
| **Filter by entity** | P1 | Low | See all changes to specific product/vendor |
| **Filter by action type** | P1 | Low | See all deletes, all creates, etc. |
| **Filter by date range** | P1 | Low | Activity within time period |
| **Activity detail view** | P1 | Med | Before/after values for changes |

### Logged Events

| Event Category | Specific Events |
|----------------|-----------------|
| **Products** | Create, Update, Delete, Archive, Restore, Photo upload, Photo delete |
| **Vendors** | Create, Update, Delete, Archive, Restore |
| **Categories** | Create, Update, Delete, Reorder |
| **Inventory** | Adjustment (with reason), Auto-deduction, Auto-restoration |
| **Orders** | Status change, Item marked unavailable, Substitution, Refund |
| **Users** | Login, Logout, Failed login, Create, Update, Deactivate |
| **Settings** | Any market/pickup/fee setting changed |
| **Bulk Actions** | Bulk update, Bulk delete, Import, Export |

### Log Data Fields

| Field | Description |
|-------|-------------|
| Timestamp | When action occurred |
| User | Who performed action |
| Action | What type of action (create, update, delete) |
| Entity Type | Product, Vendor, Order, etc. |
| Entity ID | Specific item affected |
| Entity Name | Human-readable name at time of action |
| Changes | Before/after values for updates |
| IP Address | User's IP (for security) |
| User Agent | Browser/device info |

### Retention & Export

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Log retention** | P1 | Low | Keep logs for 1 year minimum |
| **Export logs** | P2 | Med | Download activity logs as CSV |
| **Log search** | P2 | Med | Full-text search across log entries |

---

## 10. Reporting & Analytics

### MVP Reports

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Orders summary** | P1 | Med | Total orders, revenue by date range |
| **Top products** | P1 | Med | Best-selling products by units/revenue |
| **Revenue by vendor** | P1 | Med | Sales breakdown per vendor |
| **Orders by pickup slot** | P1 | Med | Distribution across time windows |
| **Average order value** | P1 | Low | Mean basket size over time |
| **Product count** | P0 | Low | Total products, by category, by vendor |

### Dashboard Widgets

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Today's orders count** | P0 | Low | Quick stat on dashboard |
| **Pending orders count** | P0 | Low | Orders awaiting pickup |
| **This week's revenue** | P1 | Low | Running total for current week |
| **Low stock alerts** | P1 | Low | Products below threshold |
| **Recent activity** | P1 | Low | Latest changes in system |

### Advanced Reports (Post-MVP)

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Customer reports** | P2 | Med | Repeat rate, new vs returning |
| **Category performance** | P2 | Med | Sales by product category |
| **Trend analysis** | P2 | High | Week-over-week, month-over-month |
| **Inventory reports** | P2 | Med | Stock levels, turnover rates |
| **Pick list analytics** | P2 | Med | Items per vendor, packing efficiency |
| **Report scheduling** | P2 | High | Automated email reports |
| **Custom report builder** | P2 | High | Build ad-hoc reports with filters |

---

## 11. Search & Filtering

### Product Search

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Text search** | P0 | Low | Search by product name |
| **Search by description** | P1 | Low | Include description in search |
| **Search by SKU** | P1 | Low | Find by internal reference |
| **Instant search** | P1 | Med | Results update as you type (debounced) |

### Product Filters

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Filter by vendor** | P0 | Low | Show only one vendor's products |
| **Filter by category** | P0 | Low | Show only one category |
| **Filter by availability** | P0 | Low | In stock, out of stock, or all |
| **Filter by tag** | P1 | Low | Filter by dietary tags |
| **Filter by price range** | P2 | Low | Min/max price filter |
| **Filter by featured** | P1 | Low | Only featured products |
| **Filter by archived** | P1 | Low | View archived products |
| **Combined filters** | P0 | Med | Multiple filters at once |
| **Save filter presets** | P2 | Med | Save commonly-used filter combinations |

### Sorting

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Sort by name** | P0 | Low | Alphabetical A-Z, Z-A |
| **Sort by price** | P0 | Low | Low to high, high to low |
| **Sort by vendor** | P1 | Low | Group by vendor alphabetically |
| **Sort by date added** | P1 | Low | Newest first, oldest first |
| **Sort by date modified** | P1 | Low | Recently updated first |
| **Sort by availability** | P1 | Low | In-stock first |

---

## 12. Import & Export

### Data Import

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **CSV product import** | P1 | Med | Upload spreadsheet of products |
| **Import template download** | P1 | Low | Provide CSV template with headers |
| **Import validation** | P1 | Med | Check for errors before importing |
| **Import preview** | P1 | Med | Show what will be created/updated |
| **Import error report** | P1 | Med | List of rows that failed with reasons |
| **Vendor CSV import** | P2 | Med | Bulk import vendor profiles |
| **Photo bulk import** | P2 | High | Match photos to products by filename |

### Data Export

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Export products to CSV** | P1 | Low | Download all products as spreadsheet |
| **Export filtered results** | P1 | Med | Export only current filter/search results |
| **Export vendors** | P2 | Low | Download vendor list |
| **Export orders** | P1 | Med | Order history for accounting |
| **Export with photos** | P2 | High | Include photo URLs or zip file |

---

## 13. Workflow & Notifications

### Admin Notifications

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **New order notification** | P0 | Med | Email/push when order placed |
| **Daily order summary** | P1 | Med | Morning email with day's orders |
| **Low stock alerts** | P2 | Med | Notification when inventory low |
| **Pick list ready** | P1 | Med | Notification when it's time to generate lists |
| **Order cutoff reminder** | P2 | Med | Alert before order window closes |

### Workflow Automation

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Auto-archive out-of-season** | P2 | Med | Automatically archive products by date |
| **Auto-unarchive seasonal** | P2 | Med | Automatically restore seasonal products |
| **End-of-day availability reset** | P2 | Med | Option to reset all to out-of-stock after market |
| **Pre-market availability reminder** | P2 | Med | Prompt to update availability before market day |

---

## 14. UX Patterns & Design Notes

### Patterns from Shopify Admin

Based on [Shopify's Polaris design system](https://shopify.dev/docs/apps/design):

| Pattern | Application to Gather |
|---------|----------------------|
| **Index pages** | Product list, vendor list should follow consistent table layout |
| **Resource detail pages** | Product edit page with sidebar for secondary info |
| **Two-column layout for editors** | Live preview panel when editing products |
| **Tabs for navigation** | Products > All / By Vendor / Archived |
| **Color coding** | Orange for attention-needed, red only for errors |
| **Empty states** | Friendly illustrations and clear CTAs when no data |

### Patterns from Square Dashboard

Based on [Square's 2025 product updates](https://squareup.com/us/en/releases):

| Pattern | Application to Gather |
|---------|----------------------|
| **Quick item creation flow** | Essential fields first, advanced options expandable |
| **AI-powered image cleanup** | Background removal for product photos (Phase 2) |
| **Unified stock overview** | Single page for all inventory management |
| **Inline editing in lists** | Click-to-edit availability, price in table view |
| **Mobile-first dashboard** | Admin must work well on tablets at market |
| **Filtering + bulk operations** | Filter first, then apply bulk action to results |

### Patterns from ManageMyMarket

Based on [farmers market management software](https://www.managemymarket.com/):

| Pattern | Application to Gather |
|---------|----------------------|
| **Vendor-centric views** | Easy switching between "all products" and "by vendor" |
| **Document/photo uploads** | Simple drag-drop zones for images |
| **Activity log per vendor** | Audit trail scoped to individual vendors |
| **Product availability status** | Clear visual indicators for in/out of stock |

### Mobile/Tablet Considerations

| Consideration | Implementation |
|---------------|----------------|
| **Touch targets** | All buttons/toggles minimum 48px |
| **Thumb zones** | Critical actions (save, toggle) in easy reach |
| **Responsive tables** | Stack columns on mobile, keep essential info visible |
| **Swipe actions** | Swipe to archive/delete on product rows |
| **Quick actions** | Floating action button for "Add Product" |
| **Offline awareness** | Show connection status, queue changes if offline |

### Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Keyboard navigation** | All functions accessible without mouse |
| **Screen reader support** | Proper ARIA labels, semantic HTML |
| **Color contrast** | 4.5:1 minimum for all text |
| **Focus indicators** | Clear visible focus states |
| **Error messaging** | Descriptive error messages with resolution hints |
| **Form validation** | Real-time validation with clear feedback |

### Information Architecture

```
Admin Navigation
├── Dashboard (home)
│   ├── Quick stats
│   ├── Today's orders
│   ├── Low stock alerts
│   └── Recent activity
│
├── Products
│   ├── All Products
│   ├── By Vendor
│   ├── By Category
│   ├── Archived
│   └── [New Product]
│
├── Vendors
│   ├── All Vendors
│   ├── Archived
│   └── [New Vendor]
│
├── Orders
│   ├── Pending
│   ├── Packed
│   ├── Picked Up
│   └── Cancelled
│
├── Operations
│   ├── Pick Lists
│   ├── Check-in
│   └── Pickup Slots
│
├── Reports
│   ├── Sales Summary
│   ├── Top Products
│   ├── Vendor Revenue
│   └── Export Data
│
└── Settings
    ├── Market Info
    ├── Pickup Configuration
    ├── Fees
    ├── Categories
    ├── Tags
    ├── Users
    └── Activity Log
```

---

## MVP vs Post-MVP Summary

### MVP-Essential Features (P0)

These features are required for launch:

**Products:**
- Create, edit, delete products
- Product list view with search
- Photo upload with auto-compression
- Availability toggle

**Bulk Operations:**
- Multi-select in product list
- Bulk availability toggle

**Vendors:**
- Create, edit vendor profiles
- View vendor list
- View products by vendor

**Categories:**
- View, create, edit categories
- Assign products to categories

**Market Settings:**
- Market name, logo, address
- Contact information
- Pickup time slots
- Order cutoff time
- Service fee configuration

**Users:**
- User accounts with email/password
- Basic roles (Admin, Staff)
- Session management

**Audit:**
- Log all product/vendor changes
- Basic activity log view

**Search/Filter:**
- Product search by name
- Filter by vendor, category, availability

### Should-Have for MVP (P1)

Important but not blocking:

- Duplicate product
- Archive/restore products
- Inline price editing
- Reorder categories
- Custom dietary tags
- Vendor product counts
- Activity log filters
- CSV product import/export
- Basic reports (orders, revenue)
- Dashboard widgets
- New order notifications

### Nice-to-Have / Post-MVP (P2)

Defer until Phase 2:

- Product versioning
- AI background removal
- Seasonal availability dates
- Advanced inventory tracking
- Custom roles/permissions
- Two-factor authentication
- Report scheduling
- Bulk price adjustment
- Workflow automation
- Saved filter presets

---

## Technical Notes

### Database Considerations

- Soft-delete for products/vendors (set `deleted_at` timestamp)
- Audit log as separate table with JSON `changes` column
- Consider full-text search index on product name/description
- Image URLs stored, not binary data (use R2/S3)

### API Endpoints Needed

```
Products:
POST   /api/admin/products          (create)
GET    /api/admin/products          (list with filters)
GET    /api/admin/products/:id      (detail)
PATCH  /api/admin/products/:id      (update)
DELETE /api/admin/products/:id      (soft delete)
POST   /api/admin/products/bulk     (bulk actions)
POST   /api/admin/products/import   (CSV import)
GET    /api/admin/products/export   (CSV export)

Vendors:
POST   /api/admin/vendors
GET    /api/admin/vendors
GET    /api/admin/vendors/:id
PATCH  /api/admin/vendors/:id
DELETE /api/admin/vendors/:id

Categories:
GET    /api/admin/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/:id
DELETE /api/admin/categories/:id
PATCH  /api/admin/categories/reorder

Settings:
GET    /api/admin/settings/market
PATCH  /api/admin/settings/market
GET    /api/admin/settings/pickup
PATCH  /api/admin/settings/pickup

Activity:
GET    /api/admin/activity          (with filters)

Users:
GET    /api/admin/users
POST   /api/admin/users
PATCH  /api/admin/users/:id
DELETE /api/admin/users/:id
```

### State Management

- Server state: React Query or SWR for data fetching
- Optimistic updates for toggles and quick edits
- Form state: React Hook Form for product/vendor editors
- URL state: Filter/sort params in URL for shareable links

---

## Open Questions for Gather Team

1. **Photo requirements:** Accept any image, or require minimum dimensions (e.g., 800x800)?

2. **Inventory model:** Track quantity at all, or pure availability toggle for MVP?

3. **Vendor contact visibility:** Show vendor contact info to customers, or internal only?

4. **Archive vs delete:** Soft-delete everything, or allow permanent deletion?

5. **Activity log retention:** How long to keep logs? 90 days? 1 year? Forever?

6. **Multi-market future:** Should data model support multiple markets from day one?

7. **Offline support:** How critical is offline functionality for market-day operations?

8. **Import format:** Standard CSV, or also support Excel files?

---

## References

- [Shopify Admin Design Guidelines](https://shopify.dev/docs/apps/design)
- [Square 2025 Product Releases](https://squareup.com/us/en/releases)
- [Admin Dashboard UX Best Practices 2025](https://medium.com/@CarlosSmith24/admin-dashboard-ui-ux-best-practices-for-2025-8bdc6090c57d)
- [Bulk Action UX Guidelines](https://www.eleken.co/blog-posts/bulk-actions-ux)
- [ManageMyMarket Features](https://www.managemymarket.com/)
- [Local Line E-Commerce Platform](https://www.localline.co)

---

*Document Version: 1.0*
*Created: February 2026*
*Author: Claude (for Gather Team)*
