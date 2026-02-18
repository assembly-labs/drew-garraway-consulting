# Gather - Complete Feature Specification

> **Purpose:** Single comprehensive feature specification covering all platform domains -- customer storefront, operations dashboard, admin panel, payments, and reporting. This document consolidates what was previously spread across 6 separate files into one organized reference.
>
> **Source Documents Merged:**
> - `FEATURE_ROADMAP.md` -- 180 MVP features + Phase 2-4 + UX Research Plan
> - `CUSTOMER_FEATURES.md` -- 508 customer-facing features across 15 domains
> - `OPERATIONS_DASHBOARD_SPEC.md` -- Operations dashboard with wireframes and UX patterns
> - `ADMIN_FEATURES.md` -- Admin panel feature specs with API endpoints
> - `PAYMENTS_AND_PAYOUTS.md` -- Stripe Connect implementation spec
> - `REPORTING_AND_ANALYTICS.md` -- Reporting features for 4 audiences

---

## Document Guide

### How This Document Is Organized

| Part | Content | Key Feature IDs |
|------|---------|-----------------|
| **Part 1** | MVP Feature Summary | C1-C55, O1-O63, A1-A39, P1-P23 |
| **Part 2** | Customer Storefront | 508 features across 15 domains |
| **Part 3** | Operations Dashboard | Wireframes, flows, UX patterns |
| **Part 4** | Admin Panel | 14 sections with API endpoints |
| **Part 5** | Payments & Payouts | Stripe Connect spec with DB schema |
| **Part 6** | Reporting & Analytics | MO-1 to MO-40, V-1 to V-17, G-1 to G-38, C-1 to C-17 |
| **Part 7** | Phase 2-4 Features | V1-V20, M1-M20, E1-E20 + UX Research Plan |

### Priority & Complexity Legend

These definitions apply throughout the entire document:

| Priority | Meaning |
|----------|---------|
| **P0** | Must-have for MVP launch -- blocking |
| **P1** | Should-have for MVP -- important but not blocking |
| **P2** | Nice-to-have -- defer to post-MVP |

| Complexity | Meaning |
|------------|---------|
| **Low** | 1-2 days of development |
| **Med/Medium** | 3-5 days of development |
| **High** | 1-2+ weeks of development |

### How to Use Feature IDs

- **C1-C55:** Customer-facing MVP features (Part 1)
- **O1-O63:** Operations MVP features (Part 1)
- **A1-A39:** Admin MVP features (Part 1)
- **P1-P23:** Payments MVP features (Part 1)
- **V1-V20:** Phase 2 Vendor Self-Service features (Part 7)
- **M1-M20:** Phase 3 Market Manager features (Part 7)
- **E1-E20:** Phase 4 Platform Ecosystem features (Part 7)
- **MO-1 to MO-40:** Market Operator reporting features (Part 6)
- **V-1 to V-17:** Vendor reporting features (Part 6)
- **G-1 to G-38:** Gather Team internal analytics (Part 6)
- **C-1 to C-17:** Customer insight analytics (Part 6)

---

# Part 1: MVP Feature Summary

> **Source:** FEATURE_ROADMAP.md

**Goal:** Enable customers to shop, order, and pay online. Enable operations team to organize orders, print packing slips, check in customers, and distribute payments to vendors.

**Timeline:** 6 months (per PRD.md)
**Target:** Berwyn Farmers Market launch

---

### Customer Storefront

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| C1 | **Market Homepage** | Landing page displaying market name, logo, hours, location, and featured products. Entry point for all customer shopping. |
| C2 | **Category Navigation** | Horizontal scrolling category bar (Produce, Dairy, Meat, Baked Goods, etc.) allowing customers to filter products by type. |
| C3 | **Product Grid** | Responsive grid layout showing product cards with photo, name, vendor, price, and quick-add button. Supports pagination or infinite scroll. |
| C4 | **Product Card** | Individual product display showing thumbnail image, product name, vendor name, price per unit, and "Add to Cart" action. |
| C5 | **Product Detail Page** | Full product view with large photo, description, dietary tags, vendor info, quantity selector, and add-to-cart button. |
| C6 | **Vendor Page** | Dedicated page for each vendor showing their story, photo, location, and all their products in a grid. |
| C7 | **Vendor Directory** | Alphabetical listing of all active vendors with photo, name, tagline, and link to their vendor page. |
| C8 | **Product Search** | Search bar allowing customers to find products by name, description, or vendor. Returns instant results with debounce. |
| C9 | **Category Filter** | Multi-select filter allowing customers to narrow products to one or more categories simultaneously. |
| C10 | **Vendor Filter** | Multi-select filter allowing customers to show only products from selected vendors. |
| C11 | **Dietary Filter** | Filter products by dietary attributes (Organic, Non-GMO, Gluten-Free, Vegan, etc.). |
| C12 | **Availability Toggle** | Toggle to show only in-stock products, hiding items marked as unavailable. |
| C13 | **Sort Options** | Dropdown to sort products by: Popular, Price (Low-High), Price (High-Low), Vendor A-Z, Newest. |
| C14 | **Empty State: No Results** | Friendly message when search or filters return no products, with suggestion to browse categories. |
| C15 | **Market Closed State** | Display when market is not accepting orders (off-season or order window closed), showing next open date. |

---

### Shopping Cart

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| C16 | **Cart Icon Badge** | Header icon showing current item count, updating in real-time when products are added. |
| C17 | **Add to Cart Action** | Button on product card/detail that adds item to cart with quantity, showing confirmation toast. |
| C18 | **Cart Page** | Dedicated page showing all cart items grouped by vendor, with quantities, prices, and totals. |
| C19 | **Vendor Grouping** | Cart items organized by vendor with vendor subtotals, making it clear which items come from which farm. |
| C20 | **Quantity Selector** | Plus/minus buttons and input field to adjust quantity of each item directly in cart. |
| C21 | **Remove Item** | Button to remove individual items from cart with confirmation. |
| C22 | **Cart Subtotal** | Running subtotal of all items before fees, updating as quantities change. |
| C23 | **Service Fee Display** | Clear display of service fee amount (flat or percentage) added to order. |
| C24 | **Cart Total** | Final total including subtotal plus service fee. |
| C25 | **Cart Persistence** | Cart saved to localStorage so customers don't lose items if they close browser. Guest carts expire after 7 days. |
| C26 | **Stock Validation** | Real-time check when viewing cart to warn if any item has become unavailable since adding. |
| C27 | **Empty Cart State** | Friendly message when cart is empty with call-to-action to start shopping. |
| C28 | **Continue Shopping Link** | Link from cart page back to product browsing to add more items. |
| C29 | **Proceed to Checkout** | Primary button to advance from cart to checkout flow. |

---

### Checkout & Payment

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| C30 | **Checkout Page** | Single-page checkout with contact info, pickup selection, order summary, and payment entry. |
| C31 | **Contact Information** | Form fields for customer email (required), name (required), and phone (optional for pickup alerts). |
| C32 | **Guest Checkout** | Allow customers to complete purchase without creating an account. Order accessible via email link. |
| C33 | **Pickup Date Display** | Show the next available market day (e.g., "Saturday, March 15") as the pickup date. |
| C34 | **Pickup Time Slot Selector** | Dropdown or button group to select pickup window (e.g., 9-10am, 10-11am) with availability shown. |
| C35 | **Slot Capacity Display** | Show remaining slots per time window (e.g., "8 slots available") to distribute pickups evenly. |
| C36 | **Special Instructions Field** | Optional text field for customer notes (e.g., "Extra napkins please" or "First time ordering"). |
| C37 | **Order Summary** | Itemized list of all products with vendor, quantity, unit price, and line totals. |
| C38 | **Fee Breakdown** | Clear display of subtotal, service fee, and total before payment. |
| C39 | **Stripe Payment Element** | Stripe Elements integration for secure card entry with real-time validation. |
| C40 | **Apple Pay Button** | One-tap Apple Pay checkout for iOS/Safari users with saved cards. |
| C41 | **Google Pay Button** | One-tap Google Pay checkout for Android/Chrome users with saved cards. |
| C42 | **Place Order Button** | Primary action button that validates form, processes payment, and creates order. |
| C43 | **Payment Processing State** | Loading state with spinner while payment processes, preventing double-submission. |
| C44 | **Payment Error Handling** | Inline error display when payment fails (declined, insufficient funds, etc.) with retry option. |
| C45 | **Terms Acceptance** | Checkbox or text indicating agreement to terms of service before order placement. |
| C46 | **Order Cutoff Enforcement** | Prevent checkout if order window has closed (e.g., orders close Friday 8pm for Saturday market). |

---

### Order Confirmation

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| C47 | **Confirmation Page** | Post-purchase page with success message, order number, QR code, and pickup details. |
| C48 | **Order Number Display** | Unique, human-readable order number (e.g., #BFM-2025-0042) for reference. |
| C49 | **QR Code Display** | Large, scannable QR code that encodes order ID for staff check-in on market day. |
| C50 | **Pickup Details Card** | Clear display of pickup location (with map link), date, and selected time window. |
| C51 | **Order Summary (Collapsed)** | Expandable section showing all items ordered, grouped by vendor. |
| C52 | **Add to Calendar Button** | One-click buttons to add pickup to Google Calendar, Apple Calendar, or download .ics file. |
| C53 | **Confirmation Email** | Automated email with order number, QR code image, pickup details, and order summary. |
| C54 | **Order Lookup Page** | Web page (linked in email) where customers can view their order details using order ID + email. |
| C55 | **Print Order Button** | Option to print confirmation page with QR code for customers without smartphones. |

---

### Operations Dashboard

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| O1 | **Staff Login** | Secure authentication for market staff to access operations dashboard. Role-based access control. |
| O2 | **Orders List View** | Table/grid showing all orders with columns: order #, customer name, pickup time, item count, total, status. |
| O3 | **Status Tab Navigation** | Tab bar to filter orders by status: Pending, Packed, Picked Up, Issues, All. Shows count per tab. |
| O4 | **Date Filter** | Date picker defaulting to next/current market day, allowing staff to view orders for any date. |
| O5 | **Pickup Slot Filter** | Filter to show only orders for a specific time window (e.g., just 10-11am pickups). |
| O6 | **Vendor Filter** | Filter to show only orders containing items from a specific vendor. |
| O7 | **Order Search** | Search by order number, customer name, email, or phone to quickly find specific orders. |
| O8 | **Order Sort Options** | Sort orders by pickup time (default), order date, total, or customer name. |
| O9 | **Quick Stats Header** | At-a-glance metrics: total orders today, orders packed, orders picked up, orders with issues. |
| O10 | **Real-Time Order Updates** | New orders appear automatically without page refresh using WebSocket connection. |
| O11 | **Order Row Preview** | Each order row shows vendors involved as chips/badges for quick visual reference. |
| O12 | **Issue Badge** | Red indicator on orders with problems (unavailable items, customer no-show, etc.). |
| O13 | **Bulk Select** | Checkbox to select multiple orders for bulk actions. |
| O14 | **Bulk Mark Packed** | Action to mark all selected orders as packed in one click. |
| O15 | **Order Detail View** | Full order page showing customer info, all items grouped by vendor, status timeline, and actions. |
| O16 | **Customer Contact Card** | Display customer name, email, phone with one-tap call/SMS/email buttons. |
| O17 | **Items by Vendor Display** | Order items grouped by vendor with checkboxes to mark individual items as packed. |
| O18 | **Order Status Selector** | Dropdown or button group to change order status (Pending -> Packed -> Picked Up). |
| O19 | **Order Timeline** | Visual history showing when order was placed, packed, picked up, with timestamps. |
| O20 | **Staff Notes Field** | Internal notes field for staff to add comments (e.g., "Called to confirm pickup time"). |
| O21 | **Special Instructions Display** | Prominently show any customer-provided special instructions. |
| O22 | **Resend Confirmation Email** | Button to re-send the confirmation email with QR code to customer. |
| O23 | **Print Order Button** | Print-optimized view of individual order for paper backup. |

---

### Pick List System

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| O24 | **Pick List Generator** | Interface to generate vendor-specific pick lists for a selected market date. |
| O25 | **Vendor Selection** | Checkbox list of all vendors with orders, allowing selection of which pick lists to generate. |
| O26 | **Pick List Preview** | On-screen preview of pick list before printing, showing products and quantities. |
| O27 | **Consolidated Pick List Format** | Pick list groups same products across orders (e.g., "Heirloom Tomatoes: 6 lb total across 4 orders"). |
| O28 | **Order Reference Numbers** | Pick list shows which order numbers each item belongs to for traceability. |
| O29 | **Packing Checkboxes** | Printable checkboxes next to each item for vendors to mark as they pack. |
| O30 | **Pick List Header** | Each pick list shows vendor name, market name, date, generation timestamp, and order cutoff time. |
| O31 | **Pick List Summary Footer** | Bottom of pick list shows total products, total items, and total orders for that vendor. |
| O32 | **Print Pick Lists** | Browser print with print-optimized CSS (black & white, clean margins, no headers/footers). |
| O33 | **Download Pick Lists as PDF** | Generate downloadable PDF files of pick lists for email distribution. |
| O34 | **Bulk Print All** | One-click to print all vendor pick lists in sequence. |
| O35 | **By-Order Pick List View** | Alternative view showing pick list organized by order instead of by product. |

---

### Customer Check-in

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| O36 | **Check-in Interface** | Dedicated screen optimized for QR scanning and customer pickup processing. |
| O37 | **QR Code Scanner** | Camera-based QR code reader that opens device camera and scans customer's confirmation code. |
| O38 | **Scan Success Display** | On successful scan, show order details: customer name, items, pickup time, special instructions. |
| O39 | **Complete Pickup Button** | One-tap action to mark order as picked up after handing over items to customer. |
| O40 | **Manual Order Lookup** | Fallback search when QR won't scan -- find order by number, name, phone, or email. |
| O41 | **Recent Check-ins List** | Rolling list of last 5-10 check-ins for quick reference and undo if needed. |
| O42 | **Already Picked Up Warning** | Alert when scanning an order that was already marked picked up, showing who processed it. |
| O43 | **Order Not Ready Warning** | Alert when scanning an order that hasn't been marked as packed yet. |
| O44 | **Wrong Date Warning** | Alert when scanning an order for a different market date. |
| O45 | **Cancelled Order Warning** | Alert when scanning an order that was cancelled, showing refund status. |
| O46 | **Order Has Issues Alert** | Prominent display when scanned order has substitutions, refunds, or other issues to communicate. |
| O47 | **Audio Feedback** | Sound effect on successful scan (chime) vs. error (buzz) for quick confirmation. |

---

### Issue Resolution

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| O48 | **Mark Item Unavailable** | Action to flag a specific item as unavailable when vendor is out of stock. |
| O49 | **Unavailable Item Resolution Options** | Choice of resolution: refund item, substitute with similar product, or contact customer. |
| O50 | **Substitution Selector** | Search/browse interface to select a replacement product, with same-vendor suggestions first. |
| O51 | **Substitution Price Handling** | Automatic calculation of price difference -- refund if substitute is cheaper, absorb if more expensive. |
| O52 | **Customer Notification (Unavailable)** | Automated email to customer when item is marked unavailable with resolution details. |
| O53 | **Partial Refund Trigger** | Initiate refund for specific items while keeping rest of order active. |
| O54 | **Full Refund Trigger** | Cancel entire order and refund full amount through Stripe. |
| O55 | **Refund Reason Selection** | Dropdown of standard reasons: item unavailable, quality issue, customer requested, order error, etc. |
| O56 | **Refund Amount Entry** | Option to enter custom refund amount for partial refunds not tied to specific items. |
| O57 | **Refund Confirmation** | Summary of refund details before processing, requiring explicit confirmation. |
| O58 | **Customer Notification (Refund)** | Automated email to customer confirming refund amount and expected timeline (3-5 business days). |
| O59 | **Issue Flag on Order** | Persistent badge/flag on orders with unresolved issues for follow-up tracking. |
| O60 | **Issue Resolution Notes** | Required note when resolving an issue, documenting what happened and how it was handled. |
| O61 | **No-Show Identification** | End-of-day view showing orders not picked up within their time window. |
| O62 | **No-Show Contact Actions** | One-tap buttons to call or SMS customers who haven't picked up. |
| O63 | **No-Show Resolution** | Options for unpicked orders: hold for next week, return to vendors, issue refund. |

---

### Admin: Product Management

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| A1 | **Products List** | Searchable, filterable table of all products with photo thumbnail, name, vendor, price, availability status. |
| A2 | **Add New Product** | Form to create new product with all required fields and photo upload. |
| A3 | **Edit Product** | Form to modify existing product details, with change history tracking. |
| A4 | **Delete Product** | Soft-delete product (hide from storefront) with confirmation dialog. |
| A5 | **Product Name Field** | Text input for product name (e.g., "Heirloom Tomatoes"). |
| A6 | **Product Vendor Assignment** | Dropdown to assign product to a vendor. |
| A7 | **Product Category Assignment** | Dropdown to assign product to a category. |
| A8 | **Product Price Field** | Numeric input for product price. |
| A9 | **Product Unit Type** | Dropdown for unit of sale: each, lb, oz, pint, bunch, dozen, half-dozen, etc. |
| A10 | **Product Description** | Rich text area for product description and details. |
| A11 | **Product Photo Upload** | Drag-and-drop or click-to-upload photo with automatic compression (max 1MB, 1200px). |
| A12 | **Photo Preview & Crop** | Preview uploaded photo with optional cropping to standard aspect ratio. |
| A13 | **Dietary Tags Selection** | Multi-select chips for dietary attributes: Organic, Non-GMO, Gluten-Free, Vegan, Vegetarian, etc. |
| A14 | **Availability Toggle** | Switch to mark product as In Stock or Out of Stock, immediately affecting storefront. |
| A15 | **Quick Availability Toggle** | Toggle availability directly from products list without opening edit form. |
| A16 | **Bulk Availability Update** | Select multiple products and set all to in-stock or out-of-stock at once. |
| A17 | **Product Search (Admin)** | Search products by name, vendor, or category. |
| A18 | **Product Filter by Vendor** | Filter products list to show only products from selected vendor. |
| A19 | **Product Filter by Category** | Filter products list to show only products in selected category. |
| A20 | **Product Filter by Status** | Filter to show only in-stock, only out-of-stock, or all products. |

---

### Admin: Market Configuration

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| A21 | **Market Profile Settings** | Edit market name, description, logo, address, contact email, contact phone. |
| A22 | **Market Logo Upload** | Upload and crop market logo for display on storefront and emails. |
| A23 | **Market Location** | Address entry with optional map preview for customer pickup directions. |
| A24 | **Vendor Management List** | Table of all vendors with name, contact, product count, active status. |
| A25 | **Add New Vendor** | Form to create vendor profile: name, description, photo, contact email, location. |
| A26 | **Edit Vendor** | Modify vendor details and profile information. |
| A27 | **Vendor Active Toggle** | Enable/disable vendor -- inactive vendors hidden from storefront but data preserved. |
| A28 | **Category Management** | List, add, edit, reorder, and delete product categories. |
| A29 | **Category Sort Order** | Drag-and-drop or number input to control category display order on storefront. |
| A30 | **Pickup Slot Configuration** | Define pickup time windows: start time, end time, slot duration (e.g., 1 hour). |
| A31 | **Slot Capacity Setting** | Set maximum orders per pickup slot to distribute customer arrivals evenly. |
| A32 | **Market Days Configuration** | Select which days of week the market operates (e.g., Saturdays only). |
| A33 | **Market Hours Setting** | Define market open/close times for each operating day. |
| A34 | **Order Cutoff Setting** | Define when online orders close (e.g., Friday 8pm for Saturday market, or Saturday 8am). |
| A35 | **Service Fee Configuration** | Set service fee type (percentage, flat, or none) and amount. |
| A36 | **Minimum Order Setting** | Optional minimum order amount required for checkout (e.g., $20 minimum). |
| A37 | **Staff User Management** | List, invite, edit, and remove staff users with role assignment. |
| A38 | **Staff Roles** | Define access levels: Admin (full access), Staff (operations), Check-in Only (QR scanning). |
| A39 | **Staff Invite via Email** | Send email invitation for new staff to create account and set password. |

---

### Payments & Vendor Payouts

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| P1 | **Stripe Checkout Integration** | Process customer payments through Stripe with PCI-compliant card handling. |
| P2 | **Payment Capture on Order** | Charge customer's card immediately upon order placement, not just authorization. |
| P3 | **Payment Receipt** | Stripe-generated receipt emailed to customer with transaction details. |
| P4 | **Apple Pay Integration** | Accept Apple Pay for one-tap mobile checkout. |
| P5 | **Google Pay Integration** | Accept Google Pay for one-tap mobile checkout. |
| P6 | **Stripe Webhook Handler** | Server endpoint to receive Stripe events (successful charge, refund, dispute, etc.). |
| P7 | **Payment Failure Handling** | Graceful error handling when payment fails with clear customer messaging and retry. |
| P8 | **Vendor Stripe Connect Onboarding** | Invite vendors to create Stripe Express accounts for receiving payouts. |
| P9 | **Vendor Bank Account Verification** | Stripe-hosted flow for vendors to verify bank accounts for ACH deposits. |
| P10 | **Vendor Payout Calculation** | Calculate each vendor's earnings: item sales minus platform commission. |
| P11 | **Platform Commission Deduction** | Automatically deduct platform fee (e.g., 8%) from vendor earnings before payout. |
| P12 | **Weekly Payout Schedule** | Process vendor payouts on a set day (e.g., Monday) for previous week's completed orders. |
| P13 | **Payout Hold Period** | Hold funds for 2 days after pickup confirmation before releasing to vendor. |
| P14 | **Payout Trigger** | Initiate payout transfer from Stripe to vendor's connected bank account. |
| P15 | **Vendor Payout Email** | Automated email to vendor when payout is initiated with amount and expected arrival. |
| P16 | **Refund Processing** | Issue refunds through Stripe, automatically deducting from next vendor payout if applicable. |
| P17 | **Partial Refund Support** | Refund specific amount less than full order total. |
| P18 | **Refund Impact on Payout** | Refunded amounts deducted from vendor's pending payout for that period. |
| P19 | **Payout Report (Vendor)** | Summary for each vendor showing orders, gross sales, commission, refunds, net payout. |
| P20 | **Payout Report (Admin)** | Admin view of all vendor payouts for a period with totals and status. |
| P21 | **Service Fee Collection** | Service fees collected from customers flow to market/platform, not to vendors. |
| P22 | **Platform Revenue Report** | Report showing platform earnings: service fees + commissions minus Stripe fees. |
| P23 | **Stripe Dashboard Link** | Quick link to Stripe dashboard for detailed transaction history and dispute management. |

---

### MVP Feature Count Summary

| Domain | Feature Count | Critical Path |
|--------|---------------|---------------|
| Customer Storefront | 15 features | Yes |
| Shopping Cart | 14 features | Yes |
| Checkout & Payment | 17 features | Yes |
| Order Confirmation | 9 features | Yes |
| Operations Dashboard | 23 features | Yes |
| Pick List System | 12 features | Yes |
| Customer Check-in | 12 features | Yes |
| Issue Resolution | 16 features | Yes |
| Admin: Product Management | 20 features | Yes |
| Admin: Market Configuration | 19 features | Yes |
| Payments & Vendor Payouts | 23 features | Yes |
| **TOTAL MVP** | **180 features** | |

---

# Part 2: Customer Storefront

> **Source:** CUSTOMER_FEATURES.md
>
> Exhaustive feature list for the customer-facing storefront. This section serves as the UX source of truth for what customers can do, see, and experience. 508 features across 15 categories with priority/complexity ratings.

---

## 2.1 Homepage & Landing

The homepage is the storefront window - it must immediately communicate value proposition, build trust, and guide users to products.

### Header & Navigation

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Market logo + name** | P0 | Low | Prominently display Berwyn Farmers Market branding; clickable to return home |
| **Search bar** | P0 | Med | Persistent, prominent search input with placeholder text (e.g., "Search tomatoes, honey, Mitchell Farm...") |
| **Cart icon with badge** | P0 | Low | Shows item count; click opens cart page or slide-out panel |
| **Category navigation** | P0 | Med | Horizontal scrolling tabs on mobile; full nav on desktop (Produce, Meat, Dairy, etc.) |
| **Account icon** | P1 | Low | Login/signup trigger; shows user avatar if logged in |
| **Market hours indicator** | P1 | Low | "Open Saturday 8am-1pm" with next market date countdown |
| **Order cutoff banner** | P0 | Low | Prominent banner: "Order by Friday 8pm for Saturday pickup" |
| **Announcement bar** | P2 | Low | Optional dismissible banner for promotions, new vendors, etc. |
| **Sticky header on scroll** | P1 | Low | Header compresses and sticks when scrolling down |
| **Skip to content link** | P0 | Low | Accessibility: hidden link for screen reader users |

### Hero Section

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Hero headline** | P0 | Low | Value prop: "Fresh from your neighbors. Ready when you are." |
| **Hero subheadline** | P0 | Low | Explanation: "Shop 70+ local vendors, checkout once, pick up Saturday" |
| **Primary CTA button** | P0 | Low | "Start Shopping" - scrolls to categories or links to /products |
| **Secondary CTA** | P1 | Low | "How It Works" - anchor link to explanation section |
| **Hero image** | P0 | Low | High-quality photo of market, produce, or happy customer |
| **Social proof badges** | P1 | Low | "500+ neighbors shopping" or "4.9 stars" |
| **Seasonal callout** | P2 | Low | Dynamic: "Now in season: Heirloom tomatoes, sweet corn, peaches" |

### How It Works Section

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **3-step visual** | P0 | Low | Browse -> Checkout -> Pickup icons with descriptions |
| **Step 1: Browse** | P0 | Low | "Explore products from 70+ local vendors" |
| **Step 2: Checkout** | P0 | Low | "Pay once for your entire order" |
| **Step 3: Pickup** | P0 | Low | "Grab your bag Saturday at the market" |
| **Animated on scroll** | P2 | Low | Subtle fade-in animation as section enters viewport |

### Featured Products Section

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Section title** | P0 | Low | "This Week's Favorites" or "Fresh Picks" |
| **Product cards (6-8)** | P0 | Med | Admin-curated featured products with quick-add functionality |
| **Quick add to cart** | P0 | Med | "+" button on card adds 1 to cart without leaving page |
| **View all link** | P0 | Low | "Browse all products" links to /products |
| **Seasonal rotation** | P2 | Med | Admin can schedule featured products by date range |
| **Stock indicators** | P1 | Low | "Low stock" or "Popular" badges on cards |

### Category Grid

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Visual category cards** | P0 | Med | Photo + name for each category (Produce, Meat, Dairy, etc.) |
| **Product count per category** | P1 | Low | Shows "45 products" under category name |
| **Click to filter** | P0 | Low | Each card links to /products?category=produce |
| **Responsive grid** | P0 | Low | 2 columns mobile, 3-4 columns desktop |
| **Category icons** | P2 | Low | Custom icons alongside category photos |

### Vendors Section

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Section title** | P0 | Low | "Meet Your Neighbors" or "Local Vendors" |
| **Vendor logo carousel** | P1 | Med | Horizontally scrollable vendor cards |
| **Vendor card** | P0 | Med | Photo, name, tagline, product count |
| **Click to vendor page** | P0 | Low | Links to /vendors/mitchell-farm |
| **"View all vendors"** | P0 | Low | Link to /vendors listing page |
| **Randomize display order** | P2 | Low | Ensure fair vendor exposure (not always A-Z) |

### Trust & Value Props

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Trust badges row** | P1 | Low | Icons: "Local farms only", "Secure checkout", "Pickup in 3 min" |
| **Testimonial quotes** | P2 | Med | 2-3 customer quotes with photos |
| **Market story section** | P2 | Med | Brief about Berwyn Farmers Market history |
| **Vendor spotlight** | P2 | Med | Featured vendor of the week with story |

### Footer

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Market info** | P0 | Low | Address, hours, next market date |
| **Map embed or link** | P1 | Low | Google Maps link to market location |
| **Contact info** | P0 | Low | Email, phone for market questions |
| **Social links** | P1 | Low | Instagram, Facebook icons |
| **Legal links** | P0 | Low | Terms of Service, Privacy Policy |
| **FAQ link** | P1 | Low | Link to help/FAQ page |
| **Powered by Gather** | P2 | Low | Subtle branding with link to gather.market |

---

## 2.2 Product Discovery & Browsing

The browsing experience must handle 500+ products from 70+ vendors while feeling simple and fast.

### Product Listing Page

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Product grid** | P0 | Med | Responsive grid of product cards (2 col mobile, 3-4 desktop) |
| **Results count** | P0 | Low | "Showing 142 products" with active filter summary |
| **Sort dropdown** | P0 | Med | Popular, Price Low-High, Price High-Low, Newest, Vendor A-Z |
| **Filter panel** | P0 | High | Multi-select filters (see Filtering System below) |
| **Load more / pagination** | P0 | Med | Infinite scroll OR "Load more" button (20 products per page) |
| **Empty state** | P0 | Low | "No products match your filters. Try adjusting or browse all." |
| **Filter chips (active)** | P1 | Med | Show active filters as removable chips above grid |
| **Clear all filters** | P1 | Low | One-click reset to show all products |
| **View toggle (grid/list)** | P2 | Med | Optional list view with more product info |
| **Skeleton loading** | P1 | Med | Placeholder cards while products load |

### Filtering System

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Category filter** | P0 | Med | Multi-select: Produce, Meat, Dairy, Eggs, Baked Goods, etc. |
| **Vendor filter** | P0 | Med | Multi-select with search; shows product count per vendor |
| **Dietary filter** | P1 | Med | Organic, Non-GMO, Gluten-Free, Vegan, Vegetarian, Dairy-Free |
| **Price range filter** | P1 | Med | Slider or min/max input (e.g., $0-$50) |
| **Availability toggle** | P0 | Low | "Show in-stock only" (default on) |
| **Filter persistence** | P1 | Med | Filters persist in URL params for sharing/back button |
| **Mobile filter sheet** | P0 | Med | Bottom sheet slide-up for filters on mobile |
| **Filter counts** | P2 | Med | Show count of matching products per filter option |
| **Recently used filters** | P2 | Med | Remember customer's common filter combinations |

### Product Card

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Product photo** | P0 | Low | High-quality square image, lazy loaded |
| **Product name** | P0 | Low | Truncated to 2 lines if long |
| **Vendor name** | P0 | Low | Clickable link to vendor page |
| **Price + unit** | P0 | Low | "$4.50 / lb" or "$6.00 each" |
| **Add to cart button** | P0 | Med | Quick-add single unit; or "+" icon |
| **Quantity in cart** | P1 | Med | If item in cart, show quantity with +/- controls |
| **Out of stock state** | P0 | Low | Grayed out with "Out of Stock" label |
| **Low stock warning** | P2 | Low | "Only 3 left" badge for urgency |
| **Dietary badges** | P1 | Low | Small icons: organic leaf, V for vegan, etc. |
| **Favorite/wishlist heart** | P2 | Med | Save for later (requires account) |
| **Card hover state** | P1 | Low | Subtle lift and border color change |
| **New product badge** | P2 | Low | "New" tag for recently added products |

### Category Pages

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Category header** | P0 | Low | Category name, description, product count |
| **Category hero image** | P2 | Low | Optional banner image for category |
| **Subcategory filters** | P2 | Med | E.g., Produce -> Vegetables, Fruits, Herbs |
| **Related categories** | P2 | Low | "Also explore: Dairy, Eggs" links |
| **SEO-friendly URLs** | P0 | Low | /berwyn/products/produce not /products?cat=1 |

---

## 2.3 Search

Search is critical when customers know what they want. Must be fast and forgiving.

### Search Input

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Prominent placement** | P0 | Low | Visible in header on all pages |
| **Placeholder text** | P0 | Low | "Search products, vendors..." |
| **Search icon** | P0 | Low | Magnifying glass left of input |
| **Clear button** | P0 | Low | X icon appears when text entered |
| **Mobile full-screen** | P1 | Med | Tap opens full-screen search overlay on mobile |
| **Keyboard shortcut** | P2 | Low | "/" focuses search (desktop power user feature) |
| **Voice search** | P2 | High | Microphone icon for voice input (mobile) |

### Search Suggestions (Autocomplete)

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Instant results** | P1 | Med | Dropdown appears after 2+ characters |
| **Product suggestions** | P1 | Med | Top 5 matching products with photos |
| **Vendor suggestions** | P1 | Med | Matching vendor names |
| **Category suggestions** | P2 | Med | "Produce", "Baked Goods" if query matches |
| **Recent searches** | P2 | Med | Show user's recent search queries |
| **Popular searches** | P2 | Med | "Trending: tomatoes, honey, bread" |
| **Debounced requests** | P0 | Low | 300ms delay to reduce API calls |
| **Keyboard navigation** | P1 | Low | Arrow keys to select, Enter to search |

### Search Results Page

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Results count** | P0 | Low | "24 results for 'tomatoes'" |
| **Query in heading** | P0 | Low | Show what was searched |
| **Product results** | P0 | Med | Same grid/card format as product listing |
| **Vendor results section** | P1 | Med | Separate section for matching vendors |
| **"Did you mean?"** | P2 | High | Spell correction suggestions |
| **No results state** | P0 | Low | Friendly message with suggestions to browse categories |
| **Search within results** | P2 | Med | Refine search with additional terms |
| **Filter search results** | P1 | Med | Same filters apply to search results |

### Search Intelligence

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Fuzzy matching** | P1 | Med | "tomatoe" finds "tomatoes" |
| **Synonym matching** | P2 | Med | "greens" finds "lettuce", "spinach", "kale" |
| **Vendor name search** | P0 | Low | "Mitchell" finds Mitchell Farm products |
| **Search analytics** | P2 | Med | Track searches with no results for product gap analysis |

---

## 2.4 Product Detail Pages

The PDP must give customers confidence to add to cart and discover more from the vendor.

### Product Information

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Product photos** | P0 | Med | Large hero image; swipeable gallery if multiple |
| **Photo zoom** | P1 | Med | Pinch-to-zoom on mobile; hover zoom on desktop |
| **Product name** | P0 | Low | Clear H1 heading |
| **Vendor name + link** | P0 | Low | Clickable to vendor page; "by Mitchell Farm" |
| **Price display** | P0 | Low | Prominent: "$4.50 / lb" |
| **Unit type** | P0 | Low | Clear unit: "per pound", "each", "per bunch" |
| **Product description** | P0 | Low | Full description, origin story, growing practices |
| **Dietary tags** | P1 | Low | Chips: Organic, Vegan, Gluten-Free, etc. |
| **Availability status** | P0 | Low | "In Stock" (green) or "Out of Stock" (grayed) |
| **Quantity remaining** | P2 | Low | "Only 5 left this week" for scarcity |

### Add to Cart

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Quantity selector** | P0 | Med | +/- buttons with number input; default 1 |
| **Add to Cart button** | P0 | Med | Primary CTA; shows loading state |
| **Cart confirmation** | P0 | Low | Toast/snackbar: "Added to cart" with link to cart |
| **Button state change** | P1 | Low | If in cart, button shows "In Cart (3)" with update option |
| **Minimum quantity** | P2 | Low | Some products may require min order (e.g., 1 lb) |
| **Maximum quantity** | P1 | Low | Cap at available stock; show message if exceeded |
| **Disabled state** | P0 | Low | Button disabled for out-of-stock items |
| **Notify when available** | P2 | Med | Email signup for out-of-stock products |

### Related Products

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **"From this vendor" section** | P0 | Med | 4-6 other products from same vendor |
| **"You might also like"** | P2 | High | Algorithm-based recommendations |
| **"Pairs well with"** | P2 | Med | Admin-curated pairings (tomatoes + basil) |
| **"Others also bought"** | P2 | High | Collaborative filtering based on order data |
| **Carousel navigation** | P1 | Med | Horizontal scroll with arrows |

### Product Page Extras

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Breadcrumb navigation** | P1 | Low | Home > Produce > Tomatoes > Heirloom Tomatoes |
| **Share button** | P2 | Low | Copy link, share to social |
| **Vendor story snippet** | P1 | Med | Mini vendor card with "About Mitchell Farm" |
| **Recipe/use suggestions** | P2 | Med | "Perfect for: caprese salad, sandwiches, roasting" |
| **Growing/sourcing info** | P2 | Low | "Grown in Chester County, PA - 12 miles away" |
| **Back to results** | P1 | Low | Preserve search/filter context when returning |

---

## 2.5 Vendor Pages

Vendor pages build trust by connecting customers with the people behind the products.

### Vendor Profile

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Vendor hero image** | P0 | Low | Farm photo, market booth photo, or vendor portrait |
| **Vendor name** | P0 | Low | H1 heading |
| **Tagline** | P1 | Low | Brief descriptor: "Family farm since 1952" |
| **Location** | P1 | Low | Farm location with distance: "Downingtown, PA - 8 miles" |
| **Full story** | P1 | Low | About section with vendor's story (2-3 paragraphs) |
| **Farming practices** | P2 | Low | Organic, sustainable, pasture-raised badges |
| **Product count** | P0 | Low | "32 products" available |
| **Contact info** | P2 | Low | Optional: vendor email/website if they want public |

### Vendor Products

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Product grid** | P0 | Med | All products from this vendor |
| **Filter by category** | P1 | Med | Filter vendor's products by type |
| **Sort options** | P1 | Low | Same sort options as main product listing |
| **Add all popular** | P2 | Med | "Add vendor's top 5" quick action |

### Vendor Discovery

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Vendors listing page** | P0 | Med | Grid of all active vendors |
| **Vendor search** | P1 | Med | Search vendors by name |
| **Filter by category** | P2 | Med | "Show vendors who sell Produce" |
| **Map view** | P2 | High | Map showing farm locations |
| **Alphabetical index** | P2 | Low | A-Z quick jump navigation |

---

## 2.6 Shopping Cart

The cart must handle multi-vendor complexity while feeling simple. This is where purchase intent converts.

### Cart Page

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Cart items list** | P0 | Med | All items with full details |
| **Group by vendor** | P0 | Med | Visual grouping: "From Mitchell Farm", "From Honeybee Farms" |
| **Vendor subtotals** | P1 | Low | Show subtotal per vendor (transparency) |
| **Product photo** | P0 | Low | Thumbnail of each item |
| **Product name + link** | P0 | Low | Clickable to product detail |
| **Vendor name** | P0 | Low | Under product name |
| **Unit price** | P0 | Low | "$4.50 / lb" |
| **Quantity selector** | P0 | Med | +/- buttons; update is debounced |
| **Line total** | P0 | Low | Quantity x unit price |
| **Remove button** | P0 | Low | Trash icon or "Remove" link |
| **Stock warnings** | P0 | Med | "Only 2 left" if quantity exceeds stock |
| **Out of stock alert** | P0 | Med | Item became unavailable since added; prompt removal |

### Cart Summary

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Subtotal** | P0 | Low | Sum of all line items |
| **Service fee** | P0 | Low | "$3.00 service fee" or "5% service fee" with tooltip explaining |
| **Estimated total** | P0 | Low | Subtotal + service fee |
| **Proceed to Checkout** | P0 | Low | Primary CTA button |
| **Continue Shopping** | P1 | Low | Link back to products |
| **Minimum order warning** | P1 | Low | If min order $20: "Add $X more to checkout" |

### Cart Persistence

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Local storage cart** | P0 | Med | Cart persists without account |
| **Cart expiration** | P1 | Low | Clear after 7 days of inactivity |
| **Cross-device sync** | P2 | Med | Sync cart when logged in |
| **Cart recovery email** | P2 | High | Email abandoned carts after 24 hours |
| **Merge guest + account** | P2 | Med | Combine carts when guest logs in |

### Cart Drawer (Optional)

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Slide-out cart** | P2 | Med | Desktop: cart as side panel instead of full page |
| **Mini cart dropdown** | P2 | Med | Hover on cart icon shows mini cart preview |
| **Quick quantity edit** | P2 | Med | Edit quantity without opening full cart |

### Cart Edge Cases

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Empty cart state** | P0 | Low | "Your cart is empty. Start shopping!" with CTA |
| **Item unavailable modal** | P0 | Med | Product removed/sold out since added to cart |
| **Price change notice** | P2 | Med | Alert if price changed since adding |
| **Vendor minimum** | P2 | Med | Optional per-vendor minimum order |

---

## 2.7 Checkout

Checkout must be fast, simple, and handle the unique "pickup time selection" requirement.

### Checkout Flow

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Single-page checkout** | P0 | High | All steps on one scrollable page (not multi-step) |
| **Progress indicator** | P1 | Low | Visual showing Contact > Pickup > Payment |
| **Mobile-optimized** | P0 | Med | Large inputs, native keyboards, minimal scrolling |
| **Express checkout option** | P2 | Med | Apple Pay / Google Pay at top for one-tap purchase |

### Contact Information

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Email field** | P0 | Low | Required; for order confirmation |
| **Phone field** | P1 | Low | Optional; for pickup alerts |
| **First/Last name** | P0 | Low | Required; for order identification |
| **Email validation** | P0 | Low | Real-time format validation |
| **Phone formatting** | P1 | Low | Auto-format as (xxx) xxx-xxxx |
| **Guest checkout** | P0 | Low | No account required (MVP default) |
| **Create account option** | P2 | Med | Optional account creation at checkout |
| **Login for returning** | P2 | Med | "Already have an account? Log in" |
| **Autofill support** | P0 | Low | Work with browser autofill |

### Pickup Details

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Pickup location** | P0 | Low | Display market address with map link |
| **Pickup date** | P0 | Med | Show next market date (e.g., "Saturday, June 7") |
| **Pickup time slots** | P0 | Med | Dropdown or radio buttons with availability |
| **Slot availability** | P0 | Med | Show remaining capacity: "(12 slots left)" |
| **Sold out slots** | P0 | Low | Disable fully booked time slots |
| **Order cutoff** | P0 | Low | Show when orders close: "Order by Friday 8pm" |
| **Special instructions** | P1 | Low | Optional text field for pickup notes |
| **Pickup tent location** | P1 | Low | "Look for the Gather tent near the entrance" |

### Order Summary (Checkout)

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Collapsed item list** | P0 | Med | Expandable/collapsible order summary |
| **Item thumbnails** | P1 | Low | Small product photos for recognition |
| **Edit cart link** | P0 | Low | "Edit cart" to return and modify |
| **Subtotal** | P0 | Low | Product subtotal |
| **Service fee** | P0 | Low | Fee amount with explanation tooltip |
| **Total** | P0 | Low | Bold, prominent final amount |
| **Price guarantee** | P2 | Low | "No surprises - this is your final total" |

### Payment

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Stripe Elements** | P0 | High | Embedded card input (number, expiry, CVC) |
| **Card validation** | P0 | Med | Real-time validation with card type detection |
| **Apple Pay button** | P1 | Med | Native Apple Pay on supported devices |
| **Google Pay button** | P1 | Med | Native Google Pay on supported devices |
| **Saved cards** | P2 | Med | Remember card for logged-in users |
| **Pay with Link** | P2 | Med | Stripe Link for faster checkout |
| **Secure badge** | P0 | Low | Lock icon: "Secure checkout" |
| **PCI compliance** | P0 | Low | Stripe handles; no card data touches server |
| **Payment error display** | P0 | Med | Clear error messages for declined cards |

### Place Order

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Place Order button** | P0 | Med | Primary CTA; disabled until form complete |
| **Terms agreement** | P0 | Low | "By placing this order, you agree to Terms of Service" |
| **Loading state** | P0 | Low | Button shows spinner during processing |
| **Prevent double submit** | P0 | Low | Disable button after click |
| **Error recovery** | P0 | Med | If payment fails, stay on page with error |
| **Success redirect** | P0 | Low | Redirect to confirmation page on success |

### Promo Codes

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Promo code field** | P2 | Med | Expandable "Have a promo code?" section |
| **Code validation** | P2 | Med | Real-time validation with error/success |
| **Discount display** | P2 | Low | Show discount amount in summary |
| **Remove code** | P2 | Low | Option to remove applied code |

---

## 2.8 Order Confirmation & Tracking

Post-purchase experience builds trust and ensures successful pickup.

### Confirmation Page

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Success message** | P0 | Low | "Thank you! Your order is confirmed." |
| **Checkmark animation** | P1 | Low | Satisfying visual confirmation |
| **Order number** | P0 | Low | Prominent: "#BFM-2024-0042" |
| **QR code display** | P0 | Med | Large, scannable QR for pickup check-in |
| **Pickup details** | P0 | Low | Date, time slot, location address |
| **Map link** | P0 | Low | "Get directions" opens Google/Apple Maps |
| **Add to Calendar** | P1 | Med | Buttons for Google Cal, Apple Cal, .ics download |
| **Order summary** | P0 | Med | Expandable list of items purchased |
| **Print order** | P2 | Low | Print-friendly version of confirmation |
| **Save QR image** | P1 | Low | Download QR code to photos |

### Confirmation Email

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Instant delivery** | P0 | Med | Email sent immediately upon order |
| **Subject line** | P0 | Low | "Your order #BFM-2024-0042 is confirmed!" |
| **Order details** | P0 | Med | Number, date, time, items, total |
| **QR code image** | P0 | Med | Embedded QR in email body |
| **Pickup instructions** | P0 | Low | Clear directions to pickup location |
| **Calendar links** | P1 | Med | Add to calendar buttons |
| **Contact info** | P0 | Low | Market contact for questions |
| **Receipt attachment** | P2 | Med | PDF receipt attached |
| **Mobile-optimized** | P0 | Low | Email renders well on phone |

### Order Status Page

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Order lookup** | P0 | Med | Access via email link (token-based) |
| **Status timeline** | P1 | Med | Visual: Confirmed -> Being Packed -> Ready -> Picked Up |
| **Current status** | P0 | Low | Clear indication of order state |
| **QR code** | P0 | Low | Persistent access to pickup QR |
| **Order details** | P0 | Low | Full order information |
| **Contact support** | P0 | Low | Email/phone for help |
| **Cancel order option** | P2 | Med | Self-service cancel if >24h before pickup |

### Reminder Communications

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Day-before email** | P1 | Med | Reminder email Friday evening |
| **Morning-of email** | P2 | Med | Reminder Saturday morning with QR |
| **SMS reminder (opt-in)** | P2 | High | Text message day before pickup |
| **Push notification** | P2 | High | If PWA installed, push reminder |

---

## 2.9 Post-Purchase Experience

After pickup, engage customers to drive retention and reviews.

### Pickup Experience

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **QR scan confirmation** | P0 | Med | Customer sees "Pickup Complete" when scanned |
| **Digital receipt** | P1 | Med | Email receipt after pickup confirmed |
| **Rate experience prompt** | P2 | Med | In-app or email prompt to rate after pickup |
| **Tip option (post-pickup)** | P2 | Med | Option to tip market staff |

### Feedback & Reviews

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Order feedback email** | P2 | Med | Post-pickup survey: "How was your order?" |
| **Simple rating** | P2 | Low | 1-5 stars with optional comment |
| **Product reviews** | P2 | High | Rate individual products |
| **Vendor reviews** | P2 | High | Rate vendors |
| **Photo reviews** | P2 | Med | Upload photos of products received |
| **Report issue** | P1 | Med | Easy way to flag problems |

### Issue Resolution

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Report missing item** | P1 | Med | Self-service issue reporting |
| **Report quality issue** | P1 | Med | Photo upload with description |
| **Refund request** | P1 | Med | Request refund for issues |
| **Credit for next order** | P2 | Med | Alternative to refund |
| **Issue tracking** | P2 | Med | Status updates on reported issues |

---

## 2.10 Customer Account

Account features enable retention, personalization, and faster checkout.

### Account Creation

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Email signup** | P2 | Med | Create account with email + password |
| **Social login** | P2 | Med | Sign up with Google/Apple |
| **Email verification** | P2 | Low | Confirm email address |
| **Password requirements** | P2 | Low | Minimum 8 chars, strength indicator |
| **Post-checkout signup** | P2 | Med | "Save your info for next time?" after checkout |

### Account Dashboard

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Account overview** | P2 | Med | Summary: orders, saved items, preferences |
| **Edit profile** | P2 | Low | Update name, email, phone |
| **Change password** | P2 | Low | Secure password update |
| **Delete account** | P2 | Low | GDPR-compliant account deletion |

### Order History

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Past orders list** | P2 | Med | All previous orders with status |
| **Order detail view** | P2 | Med | Full order information for each |
| **Reorder button** | P2 | Med | One-click reorder (adds all items to cart) |
| **Download receipts** | P2 | Med | PDF receipts for all orders |
| **Filter/search orders** | P2 | Low | Find specific past orders |

### Favorites & Lists

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Favorites list** | P2 | Med | Save products for later |
| **Quick add from favorites** | P2 | Med | Add favorite items to cart quickly |
| **Create shopping lists** | P2 | Med | Multiple named lists |
| **Share list** | P2 | Med | Share list with family member |
| **"Buy again" section** | P2 | Med | Products from previous orders |

### Preferences

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Dietary preferences** | P2 | Med | Set defaults: show only organic, vegan, etc. |
| **Notification preferences** | P2 | Low | Email, SMS, push toggles |
| **Preferred pickup time** | P2 | Low | Default time slot selection |
| **Saved payment methods** | P2 | Med | Manage saved cards |

### Communication Opt-ins

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Weekly newsletter** | P2 | Low | Subscribe to market updates |
| **New product alerts** | P2 | Med | Notify when vendors add products |
| **Back in stock alerts** | P2 | Med | Notify when saved item is available |
| **Unsubscribe management** | P2 | Low | Easy preference center |

---

## 2.11 Mobile & PWA Features

70%+ traffic expected on mobile. Must be optimized for thumb-zone navigation.

### Responsive Design

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Mobile-first CSS** | P0 | Med | Design for mobile, enhance for desktop |
| **Touch-friendly targets** | P0 | Low | 48px minimum tap targets |
| **Thumb-zone layout** | P1 | Med | Primary actions in bottom 60% of screen |
| **Horizontal scroll areas** | P1 | Med | Carousels for categories, related products |
| **Bottom sheet filters** | P0 | Med | Filters slide up from bottom on mobile |
| **Native keyboard types** | P0 | Low | Email keyboard for email, numeric for phone |

### PWA Features

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Add to Home Screen** | P2 | Med | Installable as app-like icon |
| **Offline fallback** | P2 | Med | Graceful offline page with cart access |
| **App manifest** | P1 | Low | Proper icons, theme colors, splash screen |
| **Service worker** | P2 | High | Caching for faster repeat visits |
| **Push notifications** | P2 | High | Opt-in for order updates, reminders |

### Performance

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Lazy load images** | P0 | Low | Load images as they enter viewport |
| **Image optimization** | P0 | Med | WebP format, responsive sizes |
| **Code splitting** | P1 | Med | Route-based chunking |
| **Skeleton screens** | P1 | Med | Show loading states instantly |
| **<3s LCP** | P0 | Med | Largest Contentful Paint under 3 seconds |
| **Minimize CLS** | P0 | Med | Reserve space for dynamic content |

### Native-Like Interactions

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Pull to refresh** | P2 | Med | Refresh product listing on pull |
| **Swipe gestures** | P2 | Med | Swipe to remove from cart |
| **Haptic feedback** | P2 | Low | Vibrate on add to cart (where supported) |
| **Smooth transitions** | P1 | Med | Page transitions feel native |

---

## 2.12 Accessibility Features

WCAG 2.1 AA compliance is required. Farmers markets serve everyone.

### Visual Accessibility

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Color contrast** | P0 | Low | 4.5:1 minimum for text |
| **Resize text** | P0 | Low | UI works with 200% text size |
| **Focus indicators** | P0 | Low | Visible focus rings on all interactive elements |
| **No color-only info** | P0 | Low | Icons/text accompany color meanings |
| **Dark mode** | P2 | Med | Optional dark theme |
| **High contrast mode** | P2 | Med | Support OS high contrast settings |

### Screen Reader Support

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Semantic HTML** | P0 | Low | Proper heading hierarchy, landmarks |
| **ARIA labels** | P0 | Med | Labels for icons, buttons, form fields |
| **Alt text for images** | P0 | Low | Descriptive alt text for all product photos |
| **Live regions** | P1 | Med | Announce cart updates, form errors |
| **Skip links** | P0 | Low | Skip to main content link |

### Keyboard Navigation

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Tab order** | P0 | Low | Logical tab sequence |
| **Enter/Space activation** | P0 | Low | Buttons work with keyboard |
| **Escape to close** | P0 | Low | Modals, dropdowns close with Escape |
| **Arrow key navigation** | P1 | Med | Navigate lists, carousels |
| **Focus trapping** | P1 | Med | Keep focus in modals |

### Motor Accessibility

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Large touch targets** | P0 | Low | 48px minimum |
| **No time limits** | P0 | Low | No session timeouts during checkout |
| **Undo actions** | P1 | Med | Confirm destructive actions; allow undo |
| **No precision required** | P0 | Low | No tiny click targets |

### Cognitive Accessibility

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Clear language** | P0 | Low | Simple, jargon-free copy |
| **Consistent navigation** | P0 | Low | Same nav location on all pages |
| **Error prevention** | P0 | Med | Validation before submission |
| **Clear error messages** | P0 | Low | Explain what went wrong and how to fix |
| **Progress indicators** | P1 | Low | Show where user is in flow |

---

## 2.13 Trust & Social Proof

Build confidence in local food system and new platform.

### Vendor Trust Signals

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Vendor photos** | P0 | Low | Real photos of farmers and vendors |
| **Farm location** | P1 | Low | "12 miles from market" distance indicator |
| **Years at market** | P2 | Low | "Selling at Berwyn since 2015" |
| **Farming practices** | P1 | Low | "Certified Organic", "Pasture-Raised" badges |
| **Vendor ratings** | P2 | Med | Star ratings from customer reviews |

### Product Trust Signals

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Freshness indicators** | P2 | Low | "Harvested this week" |
| **Sourcing info** | P1 | Low | Farm name and location on every product |
| **Certifications** | P1 | Low | USDA Organic, Non-GMO Project badges |
| **Customer reviews** | P2 | High | Ratings and reviews on products |

### Platform Trust Signals

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Secure checkout badge** | P0 | Low | Lock icon, "Secure checkout" text |
| **Stripe badge** | P1 | Low | "Powered by Stripe" |
| **Market partnership** | P0 | Low | "Official partner of Berwyn Farmers Market" |
| **Satisfaction guarantee** | P2 | Low | "100% satisfaction or we'll make it right" |
| **Order count** | P2 | Low | "5,000+ orders fulfilled" social proof |
| **Customer testimonials** | P2 | Med | Quotes from happy customers |

### Transparency Features

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Fee breakdown** | P0 | Low | Explain what service fee covers |
| **No hidden costs** | P0 | Low | Total at cart = total at checkout |
| **Refund policy** | P1 | Low | Clear refund and substitution policy |
| **FAQ section** | P1 | Med | Common questions answered |

---

## 2.14 Notifications & Communication

Keep customers informed without overwhelming them.

### Transactional Emails

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Order confirmation** | P0 | Med | Immediate post-purchase |
| **Order ready** | P1 | Med | When order is packed (if time allows) |
| **Pickup reminder** | P1 | Med | Day before market |
| **Order picked up** | P2 | Med | Confirmation after QR scan |
| **Refund processed** | P1 | Med | When refund issued |

### Marketing Emails (Opt-in)

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Weekly market preview** | P2 | Med | Thursday email: what's fresh this week |
| **New vendor announcement** | P2 | Med | When new vendors join |
| **Seasonal highlights** | P2 | Med | Peak season product features |
| **Win-back email** | P2 | Med | Re-engage customers who haven't ordered |

### In-App Notifications

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Toast notifications** | P0 | Low | "Added to cart", "Order placed" |
| **Stock alerts** | P1 | Med | "Only 3 left" on cart item |
| **Order cutoff warning** | P1 | Low | "Orders close in 2 hours" |
| **System announcements** | P2 | Med | Market closure, weather delays |

### SMS (Optional)

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Pickup reminder** | P2 | High | Text day before: "Your order is ready" |
| **Order issues** | P2 | High | Text if substitution needed |
| **Two-way support** | P2 | High | Text to chat with support |

---

## 2.15 Error Handling & Edge Cases

Graceful error handling builds trust and reduces support burden.

### Form Validation

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Inline validation** | P0 | Med | Real-time field validation |
| **Clear error messages** | P0 | Low | Explain what's wrong and how to fix |
| **Field highlighting** | P0 | Low | Red border on invalid fields |
| **Error summary** | P1 | Low | Summary at top if multiple errors |
| **Preserve input** | P0 | Low | Don't clear fields on error |

### Payment Errors

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Declined card** | P0 | Med | "Your card was declined. Try another card." |
| **Insufficient funds** | P0 | Low | Clear message without shame |
| **Network error** | P0 | Med | "Connection issue. Check your internet and try again." |
| **Retry option** | P0 | Low | Easy retry without re-entering info |
| **Alternative payment** | P1 | Low | "Try Apple Pay instead" suggestion |

### Stock Issues

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Sold out mid-browse** | P1 | Med | Real-time stock updates; disable add button |
| **Cart item unavailable** | P0 | Med | Alert in cart if item no longer available |
| **Checkout stock check** | P0 | Med | Final validation before payment |
| **Partial order option** | P2 | Med | Proceed with available items only |
| **Waitlist option** | P2 | Med | "Notify me when available" |

### System Errors

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **500 error page** | P0 | Low | Friendly error with support contact |
| **404 error page** | P0 | Low | Helpful message with navigation options |
| **Maintenance mode** | P1 | Low | Scheduled maintenance page |
| **Offline detection** | P1 | Med | Detect offline and show helpful message |
| **Error logging** | P0 | Med | Log errors for debugging (Sentry) |

### Edge Cases

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| **Order cutoff passed** | P0 | Med | Prevent checkout after cutoff time |
| **All slots full** | P1 | Med | Show waitlist or next week option |
| **Market cancelled** | P1 | Med | Handle weather/emergency cancellations |
| **Browser back button** | P0 | Med | Preserve state on back navigation |
| **Session timeout** | P1 | Med | Graceful handling of expired sessions |

---

## 2.16 UX Patterns from Competitors

### Instacart Patterns to Adopt

| Pattern | How Gather Should Apply |
|---------|------------------------|
| **Express checkout** | Apple Pay / Google Pay at top of checkout |
| **Real-time availability** | Show "low stock" warnings; update cart if item sold out |
| **Replacements flow** | Clear substitution/refund options when items unavailable |
| **Order tracking** | Visual timeline: Confirmed -> Ready -> Picked Up |
| **Tip integration** | Consider post-order tip for market staff (Phase 2) |
| **Favorites** | One-tap add to favorites; reorder from past orders |

### DoorDash Patterns to Adopt

| Pattern | How Gather Should Apply |
|---------|------------------------|
| **Group by vendor** | Cart shows items organized by vendor |
| **Time slot selection** | Clear time slot picker with availability |
| **Order tracking page** | Dedicated page with QR code and status |
| **Rating flow** | Post-pickup rating prompt |
| **Promo code placement** | Expandable section at checkout, not prominent |

### Amazon Fresh Patterns to Adopt

| Pattern | How Gather Should Apply |
|---------|------------------------|
| **Subscribe & Save** | Future: weekly subscription baskets |
| **Buy Again** | Quick reorder from order history |
| **Search suggestions** | Autocomplete with product photos |
| **Filter chips** | Active filters shown as removable chips |
| **Price per unit** | Clear unit pricing ($/lb, $/each) |

### Farmish / Local Food Apps Patterns

| Pattern | How Gather Should Apply |
|---------|------------------------|
| **Vendor stories** | Rich vendor profiles with farm photos and stories |
| **Seasonality** | Highlight what's in season now |
| **Farm distance** | "12 miles from market" trust signal |
| **Growing practices** | Organic, sustainable, pasture-raised badges |
| **Community feel** | Warm, personal copy; "neighbors" not "customers" |

### Patterns to Avoid

| Anti-Pattern | Why Avoid |
|--------------|-----------|
| **Forced account creation** | High friction for new customers; guest checkout essential |
| **Hidden fees** | All fees visible in cart before checkout |
| **Dark patterns** | No tricks to add items or subscriptions |
| **Complex filtering** | Keep filters simple; farmers market isn't a mega-store |
| **Delivery upsells** | Gather is pickup-only; don't confuse |
| **Aggressive push notifications** | Respect opt-in; minimal notifications |

---

### Customer Storefront Feature Count Summary

| Category | P0 | P1 | P2 | Total |
|----------|----|----|----|----- |
| Homepage & Landing | 28 | 14 | 12 | 54 |
| Product Discovery | 18 | 12 | 8 | 38 |
| Search | 12 | 10 | 8 | 30 |
| Product Detail | 16 | 10 | 10 | 36 |
| Vendor Pages | 10 | 6 | 6 | 22 |
| Shopping Cart | 22 | 8 | 10 | 40 |
| Checkout | 28 | 10 | 8 | 46 |
| Confirmation & Tracking | 16 | 12 | 8 | 36 |
| Post-Purchase | 4 | 6 | 12 | 22 |
| Customer Account | 2 | 4 | 24 | 30 |
| Mobile & PWA | 12 | 8 | 10 | 30 |
| Accessibility | 22 | 6 | 4 | 32 |
| Trust & Social Proof | 12 | 8 | 10 | 30 |
| Notifications | 8 | 8 | 12 | 28 |
| Error Handling | 20 | 10 | 4 | 34 |
| **TOTAL** | **230** | **132** | **146** | **508** |

**MVP Scope:** ~230 P0 features + prioritized P1 = ~300 total features for launch

---

# Part 3: Operations Dashboard

> **Source:** OPERATIONS_DASHBOARD_SPEC.md
>
> Comprehensive feature list for the staff/operations side of Gather -- designed for 2-4 market staff managing weekly pickup operations at farmers markets.

---

## Context & Constraints

### Operational Reality

| Constraint | Detail |
|------------|--------|
| **Staff size** | 2-4 people on market day |
| **Frequency** | Once per week (Saturday) |
| **Timeline** | Orders come in Mon-Fri, fulfillment on Saturday morning |
| **Environment** | Outdoor market, potentially spotty wifi |
| **Devices** | Mix of tablets (primary), smartphones (backup), desktop (pre-market prep) |
| **Tech comfort** | Moderate - familiar with Square, Google Sheets |

### Key Staff Jobs

1. **Pre-Market (Fri evening/Sat morning):** Review orders, generate pick lists, distribute to vendors
2. **Market Setup (Sat 7-8am):** Collect packed items from vendors, organize by order
3. **Market Hours (Sat 8am-1pm):** Check in customers via QR, handle issues
4. **Post-Market (Sat 1-2pm):** Reconcile, handle no-shows, reporting

---

## Operations Feature Summary by Priority

### MVP-Essential (P0)

| Feature | Complexity | Description |
|---------|------------|-------------|
| Order list view | Low | See all orders with status, filters, search |
| Order detail view | Low | Full order info with item breakdown |
| Pick list generation | Medium | Generate printable lists grouped by vendor |
| QR code check-in | Medium | Scan customer QR to mark order picked up |
| Manual order lookup | Low | Search by order #, name, or email as QR fallback |
| Mark order packed | Low | Update status when vendor items collected |
| Basic substitution flow | Medium | Mark item unavailable, trigger customer notification |
| Simple refund trigger | Medium | Issue full or partial refund via Stripe |

### Important (P1)

| Feature | Complexity | Description |
|---------|------------|-------------|
| Real-time order sync | Medium | New orders appear automatically via websockets |
| Bulk actions | Low | Select multiple orders to mark packed/generate lists |
| Order timeline | Low | Visual history of status changes with timestamps |
| Staff notes | Low | Internal notes per order (not visible to customer) |
| Issue flagging | Low | Mark orders with problems for follow-up |
| End-of-day summary | Medium | Quick stats: orders fulfilled, issues, revenue |
| Print-optimized views | Low | CSS for clean printing of pick lists and orders |
| Customer contact shortcuts | Low | One-tap call/SMS/email to customer |

### Nice-to-Have (P2)

| Feature | Complexity | Description |
|---------|------------|-------------|
| Offline mode | High | Queue actions when offline, sync when reconnected |
| Vendor-specific dashboard view | Medium | Filter everything to single vendor perspective |
| Substitution suggestions | High | Suggest similar products when item unavailable |
| Batch check-in | Medium | Scan multiple orders quickly in sequence |
| Audio/haptic feedback | Low | Sound/vibration on successful scan |
| Time slot queue view | Medium | Kanban-style board organized by pickup window |
| Smart notifications | Medium | Alert staff when pickup slot approaching |
| Packing assistance | Medium | Guided step-by-step item collection |
| Photo documentation | Medium | Capture photos of issues for disputes |
| Customer wait time tracking | Medium | Track time from arrival to pickup completion |

### Future (P3)

| Feature | Complexity | Description |
|---------|------------|-------------|
| Multi-staff role assignment | High | Assign orders to specific staff members |
| Inventory sync | High | Real-time stock levels across all orders |
| Automated refunds | High | Auto-refund for unavailable items with rules |
| Customer self-check-in kiosk | High | Customer scans own QR at unattended station |
| Historical analytics | High | Week-over-week trends, vendor performance |
| API for vendor systems | High | Let vendors integrate with their own tools |

---

## 3.1 Order Management (Detailed)

### Orders List View

**URL:** `/staff/orders`

**Priority:** P0 | **Complexity:** Low

**Description:** Central hub for viewing and managing all incoming orders. Staff spend most of their pre-market and market time here.

#### Elements

```
┌─────────────────────────────────────────────────────────────────┐
│ Orders                                            [+ New Order] │
├─────────────────────────────────────────────────────────────────┤
│ [Pending: 24] [Packed: 12] [Picked Up: 45] [Issues: 3] [All]   │
├─────────────────────────────────────────────────────────────────┤
│ Date: [Sat, Feb 8 ▼]  Pickup: [All Slots ▼]  Search: [______]  │
├─────────────────────────────────────────────────────────────────┤
│ [ ] Select All                      Sort: [Pickup Time ▼]      │
├─────────────────────────────────────────────────────────────────┤
│ [ ] #BFM-0042 │ Catherine S.  │ 11:00-12:00 │ 7 items │ $67.50 │
│     [Pending]                               │ Mitchell, Sunny  │
├─────────────────────────────────────────────────────────────────┤
│ [ ] #BFM-0043 │ Robert T.     │ 9:00-10:00  │ 3 items │ $28.00 │
│     [Packed]                                │ Mitchell         │
├─────────────────────────────────────────────────────────────────┤
│ [ ] #BFM-0044 │ Jennifer M.   │ 10:00-11:00 │ 5 items │ $52.25 │
│     [Issue: 1 item unavailable]             │ Tom's, Valley    │
└─────────────────────────────────────────────────────────────────┘
│ Bulk Actions: [Mark Packed] [Generate Pick Lists] [Export]     │
└─────────────────────────────────────────────────────────────────┘
```

#### Behavior

- **Tab counts update in real-time** as orders change status
- **Default view:** Next market day, Pending tab, sorted by pickup time
- **Real-time updates:** New orders appear automatically (websocket) with subtle highlight
- **Row shows:** Order #, customer name, pickup slot, item count, total, vendors involved
- **Issue badge:** Red dot/badge if any items have problems
- **Click row:** Opens order detail slide-out or full page

#### Filters & Sort

| Filter | Options |
|--------|---------|
| Status | Pending, Packed, Picked Up, Cancelled, Issues |
| Date | Calendar picker (defaults to next/current market) |
| Pickup Slot | All, 9-10am, 10-11am, 11-12pm, 12-1pm |
| Vendor | Multi-select (filters to orders containing vendor) |
| Search | Order #, customer name, email, phone |

| Sort | Description |
|------|-------------|
| Pickup Time (default) | Earliest first |
| Order Date | Most recent first |
| Total | Highest first |
| Customer Name | A-Z |

#### Bulk Actions

- **Mark as Packed:** Set multiple orders to packed status
- **Generate Pick Lists:** Create pick lists for selected orders
- **Export:** Download CSV for backup/reporting
- **Print:** Print selected order summaries

---

### Order Detail View

**URL:** `/staff/orders/:id`

**Priority:** P0 | **Complexity:** Low

**Description:** Complete view of a single order with all items, customer info, and action controls.

#### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Orders            #BFM-2024-0042           [Actions ▼]│
├─────────────────────────────────────────────────────────────────┤
│ STATUS: [PENDING ▼]                                              │
│ ●───────────○───────────○───────────○                            │
│ Placed     Packed     Picked Up   Complete                       │
│ Jan 30     -          -           -                              │
│ 7:42pm                                                           │
├─────────────────────────────────────────────────────────────────┤
│ CUSTOMER                          PICKUP                         │
│ Catherine Sullivan               Saturday, Feb 8, 2025           │
│ catherine.s@email.com            11:00 AM - 12:00 PM             │
│ (610) 555-1234                   Berwyn Farmers Market           │
│ [📞 Call] [💬 SMS] [✉️ Email]     Pickup Tent A                   │
├─────────────────────────────────────────────────────────────────┤
│ ITEMS (7)                                             Subtotal   │
├─────────────────────────────────────────────────────────────────┤
│ Mitchell Farm                                                    │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ [✓] Heirloom Tomatoes    2 lb @ $4.50     $9.00     [Actions]││
│ │ [✓] Sweet Corn 6-pack    1 @ $6.00        $6.00     [Actions]││
│ │ [ ] Cherry Tomatoes      1 pint @ $5.00   $5.00 ⚠️  [Mark N/A]││
│ └──────────────────────────────────────────────────────────────┘│
│ Sunny Meadow Dairy                                               │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ [✓] Farm Fresh Eggs      2 doz @ $7.00    $14.00    [Actions]││
│ │ [✓] Whole Milk           1 gal @ $8.00    $8.00     [Actions]││
│ └──────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Subtotal:                                              $42.00   │
│ Service Fee:                                            $3.00   │
│ TOTAL:                                                 $45.00   │
├─────────────────────────────────────────────────────────────────┤
│ SPECIAL INSTRUCTIONS                                             │
│ "Please include extra napkins if possible. First time ordering!"│
├─────────────────────────────────────────────────────────────────┤
│ STAFF NOTES                                          [Add Note] │
│ • Jan 31, 10am - Called to confirm pickup time (Staff: Maria)   │
├─────────────────────────────────────────────────────────────────┤
│ TIMELINE                                                         │
│ Feb 1, 7:42pm  Order placed                                     │
│ Feb 1, 7:42pm  Confirmation email sent                          │
│ Feb 1, 7:43pm  Payment captured ($45.00)                        │
└─────────────────────────────────────────────────────────────────┘
│            [Mark All Packed]  [Complete Pickup]                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Item Actions

| Action | Description |
|--------|-------------|
| Mark Packed | Check item as collected from vendor |
| Mark Unavailable | Item not available; triggers substitution flow |
| Substitute | Replace with different product |
| Adjust Quantity | Change quantity (triggers partial refund if less) |
| Add Note | Internal note about specific item |

#### Order Actions (Actions Menu)

| Action | Description |
|--------|-------------|
| Mark as Packed | All items collected, order ready |
| Complete Pickup | Customer received order |
| Issue Refund | Open refund dialog |
| Cancel Order | Cancel with full refund |
| Resend Confirmation | Email customer their QR again |
| Print Order | Print-friendly version |
| Contact Customer | Call/SMS/Email shortcuts |

---

### Order Status Management

**Priority:** P0 | **Complexity:** Low

**Description:** Clear status progression with visual timeline.

#### Status Flow

```
PENDING → PACKED → PICKED_UP → COMPLETE
    ↓
CANCELLED (with refund)

Any status can have ISSUE flag
```

| Status | Color | Description | Triggered By |
|--------|-------|-------------|--------------|
| Pending | Yellow | Order placed, awaiting fulfillment | Order creation |
| Packed | Blue | All items collected and ready | Staff action |
| Picked Up | Green | Customer received order | QR scan or manual |
| Complete | Gray | Order finalized (24hr after pickup) | Automatic |
| Cancelled | Red | Order cancelled with refund | Staff action |

#### Issue Flag

- **Separate from status** - any order can have issues
- **Triggers:** Item unavailable, customer no-show, payment problem
- **Visual:** Red warning badge on order row
- **Resolution:** Staff marks issue resolved with note

---

### Quick Stats Header

**Priority:** P1 | **Complexity:** Low

**Description:** At-a-glance metrics shown at top of orders page.

```
┌────────────┬────────────┬────────────┬────────────┐
│   Today    │   Packed   │  Picked Up │   Issues   │
│    42      │    28      │     8      │     2      │
│  orders    │   ready    │  complete  │  pending   │
│  $2,847    │   67%      │    19%     │    ⚠️      │
└────────────┴────────────┴────────────┴────────────┘
```

---

## 3.2 Pick List System (Detailed)

### Pick List Generator

**URL:** `/staff/pick-lists`

**Priority:** P0 | **Complexity:** Medium

**Description:** Generate consolidated pick lists for vendors. Vendors use these to know what to set aside for online orders.

#### Interface

```
┌─────────────────────────────────────────────────────────────────┐
│ Pick Lists                                                       │
├─────────────────────────────────────────────────────────────────┤
│ Market Date: [Saturday, Feb 8 ▼]                                │
│ Pickup Slots: [All ▼] or [9-10am] [10-11am] [11-12pm] [12-1pm] │
├─────────────────────────────────────────────────────────────────┤
│ VENDORS WITH ORDERS (8)                                          │
├─────────────────────────────────────────────────────────────────┤
│ [✓] Mitchell Farm          15 items │ 12 orders │ [Preview]     │
│ [✓] Sunny Meadow Dairy     8 items  │ 7 orders  │ [Preview]     │
│ [✓] Tom's Organic Produce  22 items │ 18 orders │ [Preview]     │
│ [✓] Valley Bread Co.       6 items  │ 5 orders  │ [Preview]     │
│ [✓] Happy Hen Eggs         12 items │ 9 orders  │ [Preview]     │
│ ... (3 more)                                                     │
├─────────────────────────────────────────────────────────────────┤
│ [Generate All] [Generate Selected] [Print All] [Download PDFs]  │
└─────────────────────────────────────────────────────────────────┘
```

#### Pick List Format (Per Vendor)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PICK LIST                                     │
│                    Mitchell Farm                                 │
├─────────────────────────────────────────────────────────────────┤
│ Market: Berwyn Farmers Market                                    │
│ Date: Saturday, February 8, 2025                                │
│ Generated: Friday, Feb 7, 2025 at 8:00 PM                       │
│ Orders Close: Saturday, Feb 8 at 8:00 AM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ PRODUCT              QTY    ORDERS           PACKED              │
│ ─────────────────────────────────────────────────────────────── │
│ Heirloom Tomatoes                                                │
│   2 lb               ─      #042             [ ]                 │
│   1 lb               ─      #057, #061       [ ]                 │
│   3 lb               ─      #063             [ ]                 │
│   ─────────────────────────                                      │
│   TOTAL: 6 lb        4 orders                                   │
│                                                                  │
│ Cherry Tomatoes (pint)                                           │
│   1 pint             ─      #042, #058       [ ]                 │
│   2 pints            ─      #055             [ ]                 │
│   ─────────────────────────                                      │
│   TOTAL: 4 pints     3 orders                                   │
│                                                                  │
│ Sweet Corn (6-pack)                                              │
│   1 pack             ─      #042, #061, #067 [ ]                 │
│   2 packs            ─      #059             [ ]                 │
│   ─────────────────────────                                      │
│   TOTAL: 5 packs     4 orders                                   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ SUMMARY                                                          │
│ Total Products: 3                                                │
│ Total Items: 15                                                  │
│ Total Orders: 12                                                 │
│                                                                  │
│ Questions? Contact market staff: (610) 555-0000                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Behavior

- **Consolidation:** Group same products across orders
- **Grouped by product:** Not by order (easier for vendor to pick)
- **Checkboxes for packing:** Vendor checks off as they pack
- **Order references:** Show which orders each item belongs to
- **Print-optimized:** Black & white, no headers/footers, clean margins
- **PDF option:** Downloadable for email/sharing

---

### Pick List Preview

**Priority:** P1 | **Complexity:** Low

**Description:** Preview pick list before printing/generating.

#### Features

- Modal or slide-out showing formatted pick list
- Toggle between "by product" and "by order" views
- Edit notes before generating
- Last generated timestamp

---

### Vendor Pick List Distribution

**Priority:** P2 | **Complexity:** Medium

**Description:** Send pick lists directly to vendors.

#### Options

- **Email:** Send PDF to vendor email on file
- **SMS:** Text link to view pick list
- **Print station:** Print all pick lists in sequence
- **Scheduled send:** Auto-send Friday evening at X time

---

### Pick List by Order (Alternative View)

**Priority:** P2 | **Complexity:** Low

**Description:** View pick lists organized by order instead of by product.

```
ORDER #BFM-0042 - Catherine S. (Pickup: 11:00-12:00)
├── Mitchell Farm
│   ├── [ ] Heirloom Tomatoes (2 lb)
│   └── [ ] Sweet Corn 6-pack (1)
├── Sunny Meadow Dairy
│   ├── [ ] Farm Fresh Eggs (2 doz)
│   └── [ ] Whole Milk (1 gal)
└── Tom's Organic
    └── [ ] Organic Kale (1 bunch)
```

Useful for staff when collecting items from vendors.

---

## 3.3 Customer Check-in (Detailed)

### QR Code Scanner

**URL:** `/staff/check-in`

**Priority:** P0 | **Complexity:** Medium

**Description:** Primary interface for processing customer arrivals. Staff scans QR from customer's phone or printed confirmation.

#### Interface

```
┌─────────────────────────────────────────────────────────────────┐
│ Customer Check-in                           [Manual Entry →]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│         ┌───────────────────────────────────┐                   │
│         │                                   │                   │
│         │                                   │                   │
│         │        📷 CAMERA VIEWFINDER       │                   │
│         │                                   │                   │
│         │     Point at customer's QR code   │                   │
│         │                                   │                   │
│         │                                   │                   │
│         └───────────────────────────────────┘                   │
│                                                                  │
│                    [Tap to Scan]                                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ RECENT CHECK-INS                                                 │
│ ✓ #0042 Catherine S.    11:32am    $67.50                       │
│ ✓ #0038 Michael R.      11:28am    $42.00                       │
│ ✓ #0041 Sarah K.        11:25am    $89.25                       │
│ ✓ #0039 James L.        11:20am    $31.50                       │
│ ✓ #0037 Emily W.        11:15am    $55.00                       │
└─────────────────────────────────────────────────────────────────┘
```

#### Scan Result - Success

```
┌─────────────────────────────────────────────────────────────────┐
│                          ✓                                       │
│                    ORDER FOUND                                   │
├─────────────────────────────────────────────────────────────────┤
│ #BFM-2024-0042                                                   │
│                                                                  │
│ Catherine Sullivan                                               │
│ Pickup Window: 11:00 AM - 12:00 PM ✓ (on time)                  │
│                                                                  │
│ ITEMS (7)                                                        │
│ • Heirloom Tomatoes (2 lb) - Mitchell Farm                      │
│ • Sweet Corn 6-pack - Mitchell Farm                             │
│ • Cherry Tomatoes (1 pint) - Mitchell Farm                      │
│ • Farm Fresh Eggs (2 doz) - Sunny Meadow                        │
│ • Whole Milk (1 gal) - Sunny Meadow                             │
│ • Organic Kale (1 bunch) - Tom's Organic                        │
│ • Sourdough Loaf - Valley Bread                                 │
│                                                                  │
│ TOTAL: $67.50 (PAID)                                            │
├─────────────────────────────────────────────────────────────────┤
│ NOTES: "Extra napkins please"                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│           [✓ Complete Pickup]    [View Details]                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Scan Result - Issues

```
┌─────────────────────────────────────────────────────────────────┐
│                          ⚠️                                      │
│                    ORDER HAS ISSUES                              │
├─────────────────────────────────────────────────────────────────┤
│ #BFM-2024-0044                                                   │
│ Jennifer Martinez                                                │
│                                                                  │
│ ⚠️ 1 ITEM UNAVAILABLE                                            │
│ • Cherry Tomatoes - SUBSTITUTED with Grape Tomatoes             │
│   Customer notified via email                                    │
│                                                                  │
│ ⚠️ PARTIAL REFUND ISSUED                                         │
│ • $3.00 refunded for price difference                           │
├─────────────────────────────────────────────────────────────────┤
│ Adjusted Total: $49.25                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [✓ Complete Pickup]  [View Details]  [Contact Customer]       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Error States

| State | Display | Action |
|-------|---------|--------|
| Invalid QR | "QR code not recognized" | Offer manual lookup |
| Already picked up | "Order already picked up at 10:45am" | Show who processed |
| Cancelled order | "This order was cancelled" | Show refund status |
| Wrong date | "Order is for next Saturday" | Confirm or reject |
| Not ready | "Order not yet packed" | Alert staff to pack |

---

### Manual Order Lookup

**Priority:** P0 | **Complexity:** Low

**Description:** Fallback when QR won't scan (damaged, phone dead, forgot confirmation).

#### Interface

```
┌─────────────────────────────────────────────────────────────────┐
│ Find Order                                              [× Close]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Search by:                                                       │
│ ○ Order Number   ● Customer Name   ○ Phone   ○ Email            │
│                                                                  │
│ [Catherine___________________________________] 🔍                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ MATCHING ORDERS (2)                                              │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ #0042  Catherine Sullivan                                    │ │
│ │ 11:00-12:00 │ 7 items │ $67.50 │ PACKED                     │ │
│ │ [Select This Order →]                                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ #0028  Catherine Wright                                      │ │
│ │ 10:00-11:00 │ 3 items │ $28.00 │ PICKED UP ✓                │ │
│ │ [Already Picked Up]                                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Batch Check-in Mode

**Priority:** P2 | **Complexity:** Medium

**Description:** Fast mode for high-volume periods. Scan multiple orders in sequence without confirmation between each.

#### Features

- Continuous scanning mode
- Audio/haptic confirmation for each scan
- Counter showing orders processed
- Error handling without stopping flow
- Review mode to see all processed orders

---

### Check-in Queue View

**Priority:** P2 | **Complexity:** Medium

**Description:** Visual queue of customers in current pickup window.

```
┌─────────────────────────────────────────────────────────────────┐
│ Current Window: 11:00 AM - 12:00 PM            12 orders total  │
├────────────────┬───────────────┬────────────────────────────────┤
│ WAITING (8)    │ IN PROGRESS(1)│ COMPLETED (3)                  │
├────────────────┼───────────────┼────────────────────────────────┤
│ Catherine S.   │ Robert M.     │ ✓ Sarah K.                     │
│ Michael R.     │ (Processing)  │ ✓ James L.                     │
│ Jennifer M.    │               │ ✓ Emily W.                     │
│ David K.       │               │                                │
│ Lisa P.        │               │                                │
│ (3 more...)    │               │                                │
└────────────────┴───────────────┴────────────────────────────────┘
```

---

### Audio/Visual Feedback

**Priority:** P2 | **Complexity:** Low

**Description:** Clear feedback for scan results.

| Result | Audio | Visual | Haptic |
|--------|-------|--------|--------|
| Success | Pleasant chime | Green flash, checkmark | Short vibration |
| Issue | Warning tone | Yellow flash, alert icon | Double vibration |
| Error | Error buzz | Red flash, X icon | Long vibration |
| Already processed | Info tone | Gray, "Already done" | None |

---

## 3.4 Issue Resolution (Detailed)

### Item Unavailable Flow

**Priority:** P0 | **Complexity:** Medium

**Description:** Handle when a product is not available from vendor.

#### Flow

```
[Staff marks item unavailable]
         ↓
[Choose resolution]
    ├── Refund item
    ├── Substitute with similar item
    └── Mark for customer decision
         ↓
[Customer notified via email/SMS]
         ↓
[Order updated with resolution]
```

#### Interface - Mark Unavailable

```
┌─────────────────────────────────────────────────────────────────┐
│ Item Unavailable                                        [× Close]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ UNAVAILABLE ITEM                                                 │
│ Cherry Tomatoes (1 pint) - $5.00                                │
│ From: Mitchell Farm                                              │
│ Order: #BFM-2024-0042 (Catherine S.)                            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ RESOLUTION                                                       │
│                                                                  │
│ ○ Refund this item ($5.00)                                      │
│   Customer will be refunded automatically                        │
│                                                                  │
│ ● Substitute with similar item                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Search or select replacement:                            │   │
│   │ [grape tomatoes_______________________] 🔍               │   │
│   │                                                          │   │
│   │ SUGGESTED (same vendor)                                  │   │
│   │ • Grape Tomatoes (1 pint) - $4.50  [Select]             │   │
│   │ • Roma Tomatoes (1 lb) - $4.00  [Select]                │   │
│   │                                                          │   │
│   │ SIMILAR (other vendors)                                  │   │
│   │ • Cherry Tomatoes - Tom's Organic - $5.50  [Select]     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ○ Contact customer first                                        │
│   Put order on hold and notify customer to choose               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ ADD NOTE (optional)                                              │
│ [Vendor sold out early - heavy demand this week___________]     │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│              [Cancel]                [Apply Resolution]          │
└─────────────────────────────────────────────────────────────────┘
```

---

### Substitution Management

**Priority:** P1 | **Complexity:** Medium

**Description:** Track and manage item substitutions.

#### Substitution Rules

| Scenario | Price Handling | Customer Notification |
|----------|---------------|----------------------|
| Substitute same price | No change | Email confirmation |
| Substitute lower price | Refund difference | Email + refund notification |
| Substitute higher price | Absorb difference | Email confirmation |
| No substitute available | Full item refund | Email + refund notification |

#### Substitution Record

```
Original: Cherry Tomatoes (1 pint) - $5.00
Replaced: Grape Tomatoes (1 pint) - $4.50
Difference: -$0.50 (refunded)
Reason: Original unavailable
Staff: Maria
Time: Feb 8, 8:30am
Customer Notified: Yes (email sent Feb 8, 8:31am)
```

---

### Refund Processing

**Priority:** P0 | **Complexity:** Medium

**Description:** Issue full or partial refunds through Stripe.

#### Interface - Issue Refund

```
┌─────────────────────────────────────────────────────────────────┐
│ Issue Refund                                            [× Close]│
├─────────────────────────────────────────────────────────────────┤
│ Order #BFM-2024-0042                                             │
│ Customer: Catherine Sullivan                                     │
│ Original Total: $67.50                                          │
│ Already Refunded: $0.00                                         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ REFUND TYPE                                                      │
│                                                                  │
│ ○ Full Refund ($67.50)                                          │
│   Cancel entire order and refund full amount                    │
│                                                                  │
│ ● Partial Refund                                                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Select items to refund:                                  │   │
│   │ [ ] Heirloom Tomatoes (2 lb)              $9.00         │   │
│   │ [ ] Sweet Corn 6-pack                     $6.00         │   │
│   │ [✓] Cherry Tomatoes (1 pint)              $5.00         │   │
│   │ [ ] Farm Fresh Eggs (2 doz)               $14.00        │   │
│   │ [ ] Whole Milk (1 gal)                    $8.00         │   │
│   │                                                          │   │
│   │ Or enter custom amount:                                  │   │
│   │ $ [_____]                                                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│ Refund Amount: $5.00                                            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ REASON (required)                                                │
│ [Item unavailable - vendor sold out________________] ▼          │
│                                                                  │
│ Internal Note:                                                   │
│ [High demand week, Mitchell ran out by 9am___________]          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Notify customer via email                                     │
│                                                                  │
│              [Cancel]                [Process Refund]            │
└─────────────────────────────────────────────────────────────────┘
```

#### Refund Reasons (Dropdown)

- Item unavailable - vendor sold out
- Item unavailable - quality issue
- Customer requested cancellation
- Order error - wrong item
- Order error - wrong quantity
- Pricing error
- Other (specify)

---

### Customer No-Show Handling

**Priority:** P1 | **Complexity:** Medium

**Description:** Process orders when customers don't pick up.

#### Flow

```
[End of market day]
         ↓
[Identify unpicked orders]
         ↓
[Options per order]
    ├── Contact customer (call/SMS)
    ├── Hold for next week (perishables excluded)
    ├── Return items to vendors
    └── Issue refund (full or minus restocking fee)
```

#### No-Show Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ Unpicked Orders - Feb 8, 2025                          3 orders │
├─────────────────────────────────────────────────────────────────┤
│ #0044 │ Jennifer M. │ 10-11am slot │ $52.25 │ No contact yet    │
│       [📞 Call] [💬 SMS] [Refund] [Hold]                         │
├─────────────────────────────────────────────────────────────────┤
│ #0051 │ David K.    │ 11-12pm slot │ $38.00 │ Left voicemail    │
│       [📞 Call] [💬 SMS] [Refund] [Hold]                         │
├─────────────────────────────────────────────────────────────────┤
│ #0058 │ Lisa P.     │ 12-1pm slot  │ $64.75 │ Customer en route │
│       [📞 Call] [💬 SMS] [Refund] [Hold]                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### Issue Log

**Priority:** P1 | **Complexity:** Low

**Description:** Track all issues for review and pattern identification.

#### Interface

```
┌─────────────────────────────────────────────────────────────────┐
│ Issue Log                                   [Export] [Filter ▼] │
├─────────────────────────────────────────────────────────────────┤
│ Feb 8 │ #0042 │ Item unavailable │ Cherry Tomatoes │ Refunded  │
│ Feb 8 │ #0044 │ No-show          │ -               │ Pending   │
│ Feb 8 │ #0051 │ Item unavailable │ Organic Kale    │ Substituted│
│ Feb 1 │ #0038 │ Quality issue    │ Eggs            │ Refunded  │
│ Feb 1 │ #0029 │ No-show          │ -               │ Refunded  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.5 Vendor Communication

### Vendor Contact Directory

**Priority:** P1 | **Complexity:** Low

**Description:** Quick access to vendor contact info during market operations.

```
┌─────────────────────────────────────────────────────────────────┐
│ Vendors                                              [Search___]│
├─────────────────────────────────────────────────────────────────┤
│ Mitchell Farm                    Orders today: 12               │
│ Tom Mitchell │ (610) 555-1234 │ tom@mitchellfarm.com            │
│ [📞 Call] [💬 SMS] [✉️ Email] [View Orders]                       │
├─────────────────────────────────────────────────────────────────┤
│ Sunny Meadow Dairy               Orders today: 7                │
│ Sarah Chen │ (610) 555-5678 │ sarah@sunnymeadow.com             │
│ [📞 Call] [💬 SMS] [✉️ Email] [View Orders]                       │
├─────────────────────────────────────────────────────────────────┤
│ (more vendors...)                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

### Vendor-Specific Order View

**Priority:** P2 | **Complexity:** Medium

**Description:** Filter all views to single vendor perspective.

#### Use Cases

- Staff assigned to specific vendors
- Troubleshooting vendor-specific issues
- Vendor asking questions about their orders

---

### Pick List Delivery Tracking

**Priority:** P2 | **Complexity:** Low

**Description:** Track which vendors have received their pick lists.

```
┌─────────────────────────────────────────────────────────────────┐
│ Pick List Status - Feb 8                                         │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Mitchell Farm      │ Emailed Fri 8pm │ Opened Sat 6am         │
│ ✓ Sunny Meadow       │ Emailed Fri 8pm │ Opened Sat 6:15am      │
│ ⚠️ Tom's Organic      │ Emailed Fri 8pm │ Not opened             │
│ ✓ Valley Bread       │ Printed Sat 7am │ Delivered in person    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.6 Operations Reporting & Analytics

### End-of-Day Summary

**Priority:** P1 | **Complexity:** Medium

**Description:** Quick recap of market day performance.

```
┌─────────────────────────────────────────────────────────────────┐
│ Market Day Summary                              February 8, 2025│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ORDERS                          │ REVENUE                        │
│ ──────────────────────────────  │ ─────────────────────────────  │
│ Total Orders:        45         │ Gross Sales:       $2,847.50   │
│ Picked Up:           42 (93%)   │ Refunds:              -$38.00  │
│ No-Shows:             2 (4%)    │ Service Fees:        +$135.00  │
│ Cancelled:            1 (2%)    │ Net Revenue:       $2,944.50   │
│                                 │                                │
│ ITEMS                           │ ISSUES                         │
│ ──────────────────────────────  │ ─────────────────────────────  │
│ Items Sold:          287        │ Unavailable Items:    4        │
│ Items Substituted:     6        │ Substitutions Made:   6        │
│ Items Refunded:        4        │ Refunds Issued:       3        │
│                                 │ Avg Resolution:       12 min   │
│                                 │                                │
│ TIMING                          │ TOP VENDORS                    │
│ ──────────────────────────────  │ ─────────────────────────────  │
│ First Pickup:        8:42am     │ 1. Mitchell Farm     $482.00   │
│ Last Pickup:        12:58pm     │ 2. Tom's Organic     $398.50   │
│ Avg Wait Time:       3.2 min    │ 3. Sunny Meadow      $356.00   │
│ Peak Hour:          10-11am     │ 4. Valley Bread      $287.25   │
│                                 │ 5. Happy Hen         $245.00   │
│                                 │                                │
├─────────────────────────────────────────────────────────────────┤
│ NOTES                                                            │
│ • High demand for tomatoes - Mitchell sold out by 9am           │
│ • 2 no-shows contacted, 1 rescheduled for next week             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ [Email Summary to Team] [Download PDF] [View Full Report]       │
└─────────────────────────────────────────────────────────────────┘
```

---

### Weekly/Monthly Reports

**Priority:** P2 | **Complexity:** Medium

**Description:** Aggregate reporting over time.

#### Metrics

| Category | Metrics |
|----------|---------|
| Orders | Total, average per week, growth % |
| Revenue | GMV, fees collected, refunds |
| Customers | Unique, repeat rate, average basket |
| Products | Top sellers, frequently unavailable |
| Vendors | Revenue by vendor, issue rate |
| Operations | Avg pickup time, issue resolution time |

---

### Vendor Performance

**Priority:** P2 | **Complexity:** Medium

**Description:** Per-vendor analytics.

```
Mitchell Farm - Performance
├── Revenue: $2,156 (this month)
├── Orders: 48
├── Popular Items: Heirloom Tomatoes (32), Sweet Corn (28)
├── Availability Rate: 94%
├── Substitution Rate: 6%
└── Customer Rating: 4.8/5
```

---

### Export & Integration

**Priority:** P2 | **Complexity:** Low

**Description:** Export data for external analysis.

#### Formats

- CSV (orders, items, customers)
- PDF (formatted reports)
- JSON (API access for integration)

---

## 3.7 Settings & Configuration

### Staff Management

**Priority:** P1 | **Complexity:** Medium

**Description:** Manage staff access and roles.

```
┌─────────────────────────────────────────────────────────────────┐
│ Staff Members                                        [+ Invite] │
├─────────────────────────────────────────────────────────────────┤
│ Maria Garcia │ Admin │ maria@gather.market │ Active            │
│ [Edit] [Remove]                                                  │
├─────────────────────────────────────────────────────────────────┤
│ James Wilson │ Staff │ james.w@email.com │ Active               │
│ [Edit] [Remove]                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Volunteer 1 │ Check-in Only │ vol1@email.com │ Invited          │
│ [Resend Invite] [Remove]                                         │
└─────────────────────────────────────────────────────────────────┘
```

#### Roles

| Role | Permissions |
|------|-------------|
| Admin | All features + settings |
| Staff | Orders, pick lists, check-in, issues |
| Check-in Only | QR scanning only |
| Viewer | Read-only access |

---

### Notification Settings

**Priority:** P1 | **Complexity:** Low

**Description:** Configure when/how staff get notified.

#### Options

- New order placed (real-time / hourly digest / off)
- Order cancelled
- Customer check-in
- Issue flagged
- End-of-day summary
- Pick lists ready to generate

---

### Pick List Settings

**Priority:** P1 | **Complexity:** Low

**Description:** Configure pick list generation.

#### Options

- Auto-generate time (e.g., Friday 8pm)
- Auto-email to vendors
- Include order numbers (yes/no)
- Consolidate same products (yes/no)
- Sort by product name / vendor location

---

### Check-in Settings

**Priority:** P1 | **Complexity:** Low

**Description:** Configure check-in behavior.

#### Options

- Require confirmation tap (yes/no)
- Auto-mark as picked up on scan
- Allow early pickup (before slot)
- Allow late pickup (after slot)
- Audio feedback (on/off)

---

## 3.8 Mobile & Offline Considerations

### Device-Specific Layouts

**Priority:** P0 | **Complexity:** Medium

**Description:** Optimize for primary device types.

#### Device Matrix

| Device | Primary Use | Key Features |
|--------|-------------|--------------|
| Tablet (iPad) | Check-in station | Large touch targets, scanner, queue view |
| Phone | Mobile staff | Essential actions only, one-hand operation |
| Desktop | Pre-market prep | Full dashboard, reporting, settings |

#### Tablet Layout

- Large order cards
- Full-width scanner
- Bottom action bar
- Split view: scanner + order list

#### Phone Layout

- Simplified navigation
- Essential info only
- Swipe actions
- Bottom tab bar

---

### Offline Mode

**Priority:** P2 | **Complexity:** High

**Description:** Function with limited connectivity.

#### Offline Capabilities

| Feature | Offline Behavior |
|---------|------------------|
| View orders | Cached from last sync |
| Scan QR | Works with cached order data |
| Mark picked up | Queued for sync |
| View pick lists | Cached PDFs |
| Process refunds | Queued, processed on reconnect |

#### Sync Behavior

- Auto-sync every 30 seconds when online
- Queue actions when offline
- Show sync status indicator
- Conflict resolution (server wins)

#### Visual Indicators

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ OFFLINE MODE                               Last sync: 2min ago│
│ Changes will sync when connection restored                       │
│ [3 actions pending sync]                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### Progressive Web App (PWA)

**Priority:** P2 | **Complexity:** Medium

**Description:** Install as app on devices.

#### Features

- Add to home screen
- Full-screen mode
- Push notifications
- Offline support via service worker
- Auto-updates

---

## 3.9 UX Patterns from Related Industries

### Restaurant POS Systems

**Source:** [Square](https://squareup.com/us/en/point-of-sale/restaurants), [GoTab](https://gotab.com/latest/best-restaurant-pos-systems-for-us-restaurants-in-2025-expert-reviews-and-gotabs-guide), [Hospitality Technology](https://hospitalitytech.com/pos-software-2025-key-trends-and-features-horizon)

| Pattern | Application to Gather |
|---------|----------------------|
| Kitchen Display System (KDS) | Show orders organized by pickup slot like kitchen tickets |
| Order routing | Route items to appropriate vendors automatically |
| Coursing | Group items by vendor for staged collection |
| Real-time expo management | Central dashboard showing order flow |
| Auto 86 (sold out) | One-tap to mark items unavailable |
| Split-screen views | Order list + active order detail simultaneously |
| Color-coded status | Immediate visual recognition of order states |
| Printer integration | Direct print to kitchen = direct email to vendor |

---

### Warehouse Management Systems

**Source:** [Monday.com](https://monday.com/blog/project-management/warehouse-software/), [Deposco](https://deposco.com/blog/best-wms-software-of-2025-complete-guide-to-leading-warehouse-management-solutions/), [SKU Nexus](https://www.skunexus.com/best-warehouse-picking-software)

| Pattern | Application to Gather |
|---------|----------------------|
| Wave picking | Batch orders by pickup window for efficient collection |
| Multi-order picking | Collect for multiple orders in one vendor pass |
| Route optimization | Order pick lists by vendor booth location |
| Barcode validation | QR verification at collection and handoff |
| Pick-to-light | Highlight current item being collected |
| Slotting optimization | Suggest vendor visit order for efficiency |
| Digital checklist | Tap-to-confirm each item packed |
| Exception handling | Clear workflow when item not found |

---

### Grocery Curbside/BOPIS

**Source:** [Mercatus](https://www.mercatus.com/fulfillment/), [Wynshop](https://wynshop.com/), [DispatchTrack](https://www.dispatchtrack.com/industries/grocery-delivery)

| Pattern | Application to Gather |
|---------|----------------------|
| Time slot management | Visual queue by pickup window |
| Customer arrival detection | Check-in triggers staff alert |
| Real-time status updates | Customer sees "being packed" -> "ready" |
| Multi-zone picking | Staff assigned to vendor zones |
| Personal shopper app | Guided collection workflow |
| Substitution AI | Suggest similar items automatically |
| Contactless handoff | QR confirms without touching |
| Live stock sync | Real-time availability updates |

---

### QR Check-in Systems

**Source:** [JoinIt](https://joinit.com/blog/top-qr-code-check-in-systems), [Qtrac](https://qtrac.com/blog/what-to-look-for-in-a-qr-code-check-in-system/), [Skedda](https://www.skedda.com/insights/qr-code-check-in)

| Pattern | Application to Gather |
|---------|----------------------|
| Instant confirmation | Audio + visual feedback within 1 second |
| Queue transparency | Customer knows their position |
| Wait time estimation | "Your order will be ready in ~3 min" |
| Contactless flow | Minimize physical interaction |
| Fallback options | Manual lookup when QR fails |
| Multiple scan devices | Any staff device can process |
| Offline capability | Cache orders for no-wifi scanning |
| Clear signage | Direct customers to correct area |

---

### Returns/Refund UX

**Source:** [Baymard](https://baymard.com/blog/order-returns-ecommerce-ux), [ReturnGO](https://returngo.ai/)

| Pattern | Application to Gather |
|---------|----------------------|
| Progress visibility | Staff sees refund progress through stages |
| Quick resolution options | Pre-set refund reasons for speed |
| Customer notification | Auto-email on refund with timeline |
| Partial handling | Refund specific items, not whole order |
| Documentation | Capture reason and notes for review |
| Transparent timeline | Show when refund will process (3-5 days) |

---

## 3.10 Implementation Recommendations

### MVP Build Order

**Month 4 (Operations Sprint)**

| Week | Focus | Features |
|------|-------|----------|
| 1 | Order views | List view, detail view, status management |
| 2 | Pick lists | Generator, print layouts, vendor grouping |
| 3 | Check-in | QR scanner, manual lookup, status update |
| 4 | Issues | Item unavailable, basic refund, notes |

### Technical Considerations

| Area | Recommendation |
|------|----------------|
| Real-time | WebSocket for order updates (Pusher, Socket.io) |
| QR Scanning | html5-qrcode or zxing-js library |
| Printing | CSS print media queries + browser print |
| Offline | Service Worker + IndexedDB for order cache |
| Refunds | Stripe Refund API with webhook confirmation |

### Testing Focus

| Scenario | Test Approach |
|----------|---------------|
| Spotty wifi | Throttle network, test queuing |
| High volume | Simulate 50+ orders, 20 quick check-ins |
| Edge cases | Duplicate scans, cancelled orders, partial refunds |
| Accessibility | Screen reader, keyboard nav, color contrast |
| Device variety | Test on actual tablets at market conditions |

### Staff Training

| Topic | Format |
|-------|--------|
| Basic order flow | 5-min video walkthrough |
| Check-in process | In-person demo on market day |
| Issue handling | Decision tree reference card |
| Offline mode | Printed backup procedures |

---

## Appendix A: Key Measurements

### Success Metrics for Operations Dashboard

| Metric | Target | Measurement |
|--------|--------|-------------|
| Check-in time | <30 seconds | Time from scan to complete |
| Pick list accuracy | 99% | Items matched vs delivered |
| Issue resolution | <15 minutes | Time to close issue |
| Staff satisfaction | 4/5 | Post-season survey |
| Zero lost orders | 100% | All orders accounted for |

### Performance Targets

| Metric | Target |
|--------|--------|
| Page load | <2 seconds |
| QR scan response | <1 second |
| Order sync | <5 seconds |
| Offline function | Essential features work |

---

## Appendix B: Competitive Reference

| Platform | Strengths to Borrow | Gaps to Avoid |
|----------|---------------------|---------------|
| **Square KDS** | Visual order flow, real-time updates, one-tap actions | Over-complexity for simple operations |
| **DoorDash Merchant** | Clean order cards, issue handling, driver communication | Too delivery-focused |
| **Instacart Shopper** | Guided picking, substitution flow, customer chat | Requires constant connectivity |
| **Toast POS** | Kitchen ticket format, coursing, modifier handling | Restaurant-specific terminology |

---


# Part 4: Admin Panel

> Source: ADMIN_FEATURES.md — Comprehensive admin panel feature specification for centralized product and vendor management.

> **Context:** In MVP, the Gather team centrally manages all products on behalf of 70+ vendors at Berwyn Farmers Market. Vendors do not log in yet (Phase 2). This document exhaustively covers all admin/product management features.

---

## 4.1. Product Management

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

## 4.2. Bulk Operations

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

## 4.3. Photo & Media Management

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

## 4.4. Inventory & Availability

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

## 4.5. Category & Tag Management

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

## 4.6. Vendor Management

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

## 4.7. Market Configuration

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

## 4.8. User & Access Management

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

## 4.9. Audit & Activity Logging

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

## 4.10. Reporting & Analytics

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

## 4.11. Search & Filtering

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

## 4.12. Import & Export

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

## 4.13. Workflow & Notifications

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

## 4.14. UX Patterns & Design Notes

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



# Part 5: Payments & Payouts

> Source: PAYMENTS_AND_PAYOUTS.md — Stripe Connect implementation specification for multi-vendor marketplace payments.

---

## 5.1 Executive Summary

Gather operates as a multi-vendor marketplace where customers purchase from multiple vendors (70+ at Berwyn) in a single transaction. The payment system must:

1. **Accept a single payment** from the customer
2. **Split funds** across multiple vendors based on their items
3. **Deduct platform fees** (market's commission)
4. **Pay vendors** on a weekly schedule after market day
5. **Handle refunds, substitutions, and disputes** gracefully
6. **Report taxes** (1099-K) for vendors exceeding thresholds

### Key Constraints

| Constraint | Implication |
|------------|-------------|
| 70+ vendors | Must automate onboarding and payouts |
| Weekly payouts after market day | Need to hold funds until pickup confirmed |
| Pickup-only model | Refunds tied to fulfillment status |
| MVP focus | Start simple, add complexity later |

---

## 5.2 Platform Recommendation: Stripe Connect

### Why Stripe Connect?

After researching Stripe Connect, PayPal for Marketplaces, and other solutions, **Stripe Connect with Express accounts** is the recommended approach for Gather.

| Factor | Stripe Connect | PayPal Marketplaces |
|--------|----------------|---------------------|
| **Multi-vendor split payments** | Native support | Native support |
| **Vendor onboarding** | Stripe-hosted (Express) | Self-managed |
| **Dashboard for vendors** | Express Dashboard (limited) | Full PayPal |
| **Payout flexibility** | Daily/weekly/manual | Immediate/delayed |
| **1099-K reporting** | Built-in | Built-in |
| **Apple Pay / Google Pay** | Native | Limited |
| **Pricing** | 2.9% + $0.30 + $0.25/payout | Similar |
| **Developer experience** | Excellent | Good |
| **Market fit** | Used by DoorDash, Lyft, Instacart | More retail-focused |

### Recommended Account Type: Express

| Account Type | Control | Onboarding | Dashboard | Best For |
|--------------|---------|------------|-----------|----------|
| **Standard** | User owns | User self-manages | Full Stripe | SaaS platforms |
| **Express** | Shared | Stripe-hosted | Limited | **Marketplaces** |
| **Custom** | Platform owns | Platform-managed | None | White-label |

**Express accounts** are ideal for Gather because:
- Stripe handles KYC/identity verification
- Vendors get a simple dashboard to see payouts
- Platform controls payout timing (weekly after market)
- Lower integration complexity than Custom
- $2/active account/month + 0.25% per payout fee is acceptable

---

## 5.3 Feature Inventory by Flow

### 5.3.1 Customer Checkout

#### Payment Method Support

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Credit/Debit Cards | P0 | Low | Accept Visa, Mastercard, Amex, Discover via Stripe Elements | Yes |
| Apple Pay | P0 | Low | One-tap checkout on iOS/Safari with Payment Request API | Yes |
| Google Pay | P0 | Low | One-tap checkout on Android/Chrome with Payment Request API | Yes |
| Guest Checkout | P0 | Low | No account required; email only for order confirmation | Yes |
| Saved Payment Methods | P2 | Medium | Store cards securely for returning customers (Stripe tokens) | No |
| Buy Now Pay Later (Affirm/Klarna) | P2 | Medium | Installment payments for larger orders | No |
| Link by Stripe | P1 | Low | One-click checkout for Stripe Link users | No |
| ACH Bank Transfers | P2 | Medium | Lower-fee option for high-value orders | No |

#### Checkout UX Features

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Unified Cart Checkout | P0 | Medium | Single payment for items from multiple vendors | Yes |
| Real-time Price Calculation | P0 | Low | Subtotal, fees, and total update as cart changes | Yes |
| Order Summary Review | P0 | Low | Clear breakdown of items, vendors, quantities before payment | Yes |
| Pickup Time Selection | P0 | Low | Choose time slot during checkout | Yes |
| Special Instructions Field | P1 | Low | Optional notes for pickup/substitutions | Yes |
| Promo Code / Discount Entry | P1 | Medium | Apply coupon codes at checkout | No |
| Cart Abandonment Recovery | P2 | Medium | Email reminders for incomplete checkouts | No |
| Order Minimum Enforcement | P1 | Low | Require minimum order amount (e.g., $15) to checkout | Yes |
| Real-time Inventory Check | P0 | Medium | Validate items still available before payment | Yes |
| Card Validation (Luhn check) | P0 | Low | Basic card number validation before submission | Yes |
| Address Autocomplete | P2 | Low | For future delivery; not needed for pickup MVP | No |

#### Payment Security

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| PCI-DSS Compliance | P0 | Low | Stripe Elements handles all card data; Gather never sees raw card numbers | Yes |
| 3D Secure 2.0 | P0 | Low | Strong Customer Authentication for fraud prevention (Stripe handles) | Yes |
| CVV Verification | P0 | Low | Require CVV for all card transactions | Yes |
| Address Verification (AVS) | P1 | Low | Verify billing address matches card | Yes |
| Velocity Checks | P1 | Medium | Limit transactions per card/email in time window | No |

---

### 5.3.2 Payment Processing

#### Core Processing

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Payment Intent Creation | P0 | Medium | Create Stripe PaymentIntent with split payment data | Yes |
| Payment Confirmation | P0 | Low | Handle successful payment and update order status | Yes |
| Payment Failure Handling | P0 | Medium | Display clear errors; allow retry without losing cart | Yes |
| Idempotency Keys | P0 | Low | Prevent duplicate charges on network issues | Yes |
| Webhook Integration | P0 | Medium | Listen to Stripe webhooks for payment status updates | Yes |
| Payment Metadata | P0 | Low | Store order ID, vendor IDs, item IDs in payment metadata | Yes |
| Multi-currency Support | P2 | Medium | Accept payments in currencies other than USD | No |

#### Authorization and Capture

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Immediate Capture | P0 | Low | Capture payment immediately on checkout | Yes |
| Auth-only / Delayed Capture | P2 | Medium | Authorize at checkout, capture at pickup (reduces refund friction) | No |
| Authorization Holds | P2 | Medium | Place hold on card; adjust final amount based on substitutions | No |

#### Payment Recovery

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Retry Failed Payments | P0 | Low | Allow customer to retry with same or different card | Yes |
| Card Update Notifications | P2 | Medium | Notify customers when saved cards expire | No |
| Dunning Management | P2 | High | Automated retry sequences for failed recurring payments | No |

---

### 5.3.3 Fee Calculation

#### Platform Fee Structure

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Percentage-based Commission | P0 | Low | Take X% of each vendor's subtotal (e.g., 10%) | Yes |
| Flat Per-Order Fee | P1 | Low | Add flat fee per order (e.g., $2.00 service fee) | Yes |
| Hybrid Fee (% + flat) | P1 | Low | Combine percentage and flat fee | No |
| Tiered Commission Rates | P2 | Medium | Different rates based on vendor volume or category | No |
| Promotional Fee Waivers | P2 | Medium | Temporarily reduce fees for new vendors or promotions | No |
| Category-based Fees | P2 | Medium | Different commission rates by product category | No |

#### Fee Display and Transparency

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Itemized Fee Display | P0 | Low | Show service fee as separate line item at checkout | Yes |
| Fee Breakdown in Receipts | P0 | Low | Include fee breakdown in order confirmation email | Yes |
| Vendor Fee Visibility | P1 | Low | Show vendors their commission rate in dashboard | No |
| Fee Calculator for Vendors | P2 | Low | Tool for vendors to estimate earnings after fees | No |

#### Payment Processing Fee Handling

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Stripe Fee Pass-through | P1 | Low | Decide who absorbs payment processing fees (platform vs vendor) | Yes |
| Net Revenue Calculation | P0 | Medium | Calculate vendor earnings after platform + Stripe fees | Yes |
| Fee Reconciliation | P1 | Medium | Track fees collected vs fees owed in reporting | No |

---

### 5.3.4 Vendor Payouts

#### Vendor Onboarding

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Stripe Express Onboarding | P0 | Medium | Vendors complete Stripe-hosted onboarding flow | Yes |
| Bank Account Verification | P0 | Low | Stripe verifies vendor bank accounts (micro-deposits or instant) | Yes |
| Identity Verification (KYC) | P0 | Low | Stripe collects SSN/EIN and verifies identity | Yes |
| Onboarding Status Tracking | P0 | Low | Track which vendors have completed onboarding | Yes |
| Onboarding Reminders | P1 | Low | Email vendors who haven't completed onboarding | No |
| Debit Card Payout Option | P1 | Low | Allow vendors to receive payouts to debit cards | No |
| Multiple Bank Accounts | P2 | Medium | Vendors can switch between bank accounts | No |

#### Payout Scheduling

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Weekly Payout Schedule | P0 | Medium | Process payouts every Monday for prior week's sales | Yes |
| Configurable Payout Day | P1 | Low | Admin can set which day of week payouts process | No |
| Hold Period Configuration | P0 | Low | Hold funds for X days after pickup before payout eligibility | Yes |
| Manual Payout Trigger | P1 | Medium | Admin can manually trigger payouts for specific vendors | No |
| Minimum Payout Threshold | P1 | Low | Only pay out if balance exceeds minimum (e.g., $25) | No |
| Payout Batching | P0 | Medium | Batch all vendor payouts for efficiency | Yes |

#### Payout Methods

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Standard Bank Transfer (ACH) | P0 | Low | 1-2 business day payout to bank account | Yes |
| Instant Payouts | P2 | Low | Immediate payout to debit card (1% fee) | No |
| Manual Check Payments | P2 | High | Paper checks for vendors without bank accounts | No |

#### Payout Notifications

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Payout Confirmation Email | P0 | Low | Email vendor when payout is initiated | Yes |
| Payout Arrival Notification | P1 | Low | Email when payout arrives (via Stripe webhook) | No |
| Payout Schedule Reminders | P2 | Low | Remind vendors of upcoming payout dates | No |
| Payout Failure Alerts | P0 | Low | Alert vendor and admin if payout fails | Yes |

#### Payout Calculation

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Order-level Split Calculation | P0 | Medium | Calculate each vendor's share of multi-vendor orders | Yes |
| Platform Fee Deduction | P0 | Low | Deduct platform commission before vendor payout | Yes |
| Refund Adjustment | P0 | Medium | Reduce payout if items were refunded | Yes |
| Dispute Reserve | P2 | High | Hold back percentage for potential chargebacks | No |
| Negative Balance Handling | P1 | Medium | Carry forward negative balance from refunds to next payout | No |
| Tip Distribution | P2 | Medium | Distribute customer tips to vendors or staff | No |

---

### 5.3.5 Refunds and Cancellations

#### Customer-Initiated Refunds

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Full Order Refund | P0 | Medium | Cancel entire order and refund full amount | Yes |
| Partial Order Refund | P0 | High | Refund specific items from multi-vendor order | Yes |
| Item-level Refunds | P0 | High | Refund individual items while keeping rest of order | Yes |
| Refund to Original Payment | P0 | Low | Refund back to card used for purchase | Yes |
| Store Credit Option | P2 | Medium | Offer store credit instead of card refund | No |
| Refund Request Window | P1 | Low | Allow refund requests only within X hours of pickup | Yes |

#### Staff/Admin-Initiated Refunds

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Unavailable Item Refund | P0 | Medium | Automatically refund items marked as unavailable | Yes |
| Substitution Price Adjustment | P1 | High | Adjust charge if substitution differs in price | No |
| Service Recovery Refund | P1 | Low | Issue goodwill refunds for poor experience | No |
| Batch Refund Processing | P2 | Medium | Process multiple refunds at once | No |

#### Refund Workflow

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Refund Reason Codes | P1 | Low | Categorize refund reasons for reporting | No |
| Refund Approval Workflow | P2 | Medium | Require admin approval for refunds over threshold | No |
| Automatic Refund Rules | P2 | High | Auto-refund for certain conditions (e.g., no-show vendor) | No |
| Refund Impact on Payout | P0 | Medium | Deduct refunded amounts from vendor's pending payout | Yes |

#### Refund Notifications

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Customer Refund Email | P0 | Low | Notify customer when refund is processed | Yes |
| Vendor Refund Notification | P1 | Low | Notify vendor when their item is refunded | Yes |
| Refund Timeline Display | P1 | Low | Show customer expected refund processing time (3-5 days) | Yes |

#### Cancellations

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Customer Self-Cancel | P1 | Medium | Allow customers to cancel order before cutoff time | Yes |
| Order Cutoff Enforcement | P0 | Low | Prevent cancellations after Friday 8pm (or configured time) | Yes |
| Vendor-Initiated Cancel | P1 | Medium | Allow vendors to request order cancellation | No |
| Cancellation Fees | P2 | Medium | Charge fee for late cancellations | No |
| No-Show Handling | P1 | Medium | Process unclaimed orders after pickup window closes | No |

---

### 5.3.6 Disputes and Chargebacks

#### Chargeback Handling

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Chargeback Notification | P0 | Low | Receive Stripe webhook on chargeback initiation | Yes |
| Chargeback Evidence Collection | P0 | Medium | Gather order details, pickup confirmation, QR scan for dispute | Yes |
| Evidence Submission | P0 | Medium | Submit evidence to Stripe for dispute response | Yes |
| Chargeback Dashboard | P1 | Medium | Admin view of all open disputes and their status | No |
| Dispute Resolution Timeline | P1 | Low | Track dispute deadlines and required actions | No |

#### Liability Assignment

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Platform-Absorbed Chargebacks | P1 | Low | Platform absorbs chargeback costs (simplest for vendors) | Yes |
| Vendor Chargeback Pass-through | P2 | High | Deduct chargeback costs from vendor payouts | No |
| Chargeback Reserve Fund | P2 | High | Hold percentage of payouts to cover potential chargebacks | No |
| Vendor Dispute Appeals | P2 | Medium | Allow vendors to appeal chargeback responsibility | No |

#### Dispute Prevention

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Clear Billing Descriptor | P0 | Low | Show "GATHER MARKET" on card statements | Yes |
| Order Confirmation Proof | P0 | Low | Store confirmation emails as evidence | Yes |
| QR Code Pickup Proof | P0 | Low | Log pickup confirmation as delivery proof | Yes |
| Customer Communication Logs | P1 | Medium | Store all customer communications for disputes | No |
| Fraud Detection Alerts | P2 | High | Flag suspicious orders before fulfillment | No |

---

### 5.3.7 Reporting and Analytics

#### Customer-Facing Reports

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Order History | P1 | Low | Customers can view past orders (if logged in) | No |
| Order Receipt/Invoice | P0 | Low | Downloadable PDF receipt per order | Yes |
| Order Status Tracking | P0 | Low | View current order status (pending, ready, picked up) | Yes |

#### Vendor-Facing Reports

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Earnings Dashboard | P1 | Medium | Vendor sees total earnings, pending payouts | No |
| Payout History | P1 | Low | List of all past payouts with details | No |
| Sales by Product | P2 | Medium | Breakdown of sales by individual product | No |
| Order History | P1 | Medium | Vendor sees all their fulfilled orders | No |
| Earnings Export (CSV) | P2 | Low | Download earnings data for vendor's records | No |
| Performance Comparison | P2 | High | Compare sales to market averages | No |
| Stripe Express Dashboard | P0 | Low | Vendors access Stripe's built-in dashboard for payout details | Yes |

#### Market Operator Reports

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| GMV Dashboard | P0 | Medium | Total gross merchandise value by period | Yes |
| Commission Earnings Report | P0 | Medium | Platform revenue from fees | Yes |
| Order Volume Report | P0 | Low | Orders by day/week/month | Yes |
| Revenue by Vendor | P1 | Medium | Sales breakdown by vendor | No |
| Payout Summary | P0 | Low | Total payouts made, pending, failed | Yes |
| Refund Summary | P1 | Low | Total refunds by reason and vendor | No |
| Chargeback Report | P1 | Low | Dispute outcomes and financial impact | No |
| Customer Acquisition Report | P2 | Medium | New vs returning customers | No |
| Basket Size Analysis | P1 | Low | Average order value trends | No |
| Category Performance | P2 | Medium | Sales by product category | No |
| Export All Data (CSV) | P1 | Low | Export transactions for accounting | Yes |

#### Financial Reconciliation

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Payment-to-Payout Reconciliation | P1 | High | Match customer payments to vendor payouts | No |
| Fee Reconciliation | P1 | Medium | Verify fees collected match expected | No |
| Stripe Balance Reconciliation | P1 | Medium | Match Stripe balance to expected amounts | No |
| Accounting Integration | P2 | High | Export to QuickBooks, Xero, etc. | No |

---

### 5.3.8 Tax and Compliance

#### 1099-K Reporting

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Vendor Tax ID Collection | P0 | Low | Collect SSN/EIN during vendor onboarding | Yes |
| 1099-K Threshold Tracking | P0 | Medium | Track vendor earnings against $20K/200 transaction threshold | Yes |
| Automatic 1099-K Filing | P1 | Low | Stripe handles 1099-K generation and filing | Yes |
| 1099-K Preview for Vendors | P2 | Medium | Show vendors their YTD earnings for tax planning | No |
| Tax Form Delivery | P0 | Low | Stripe delivers 1099-K to qualifying vendors | Yes |

#### Sales Tax

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Sales Tax Calculation | P1 | Medium | Calculate sales tax based on market location | No |
| Sales Tax Collection | P1 | Medium | Collect sales tax at checkout | No |
| Tax-Exempt Products | P2 | Medium | Mark certain products (produce) as tax-exempt | No |
| Sales Tax Remittance | P2 | High | File and remit collected sales tax to state | No |
| Integration with Tax Services | P2 | Medium | Connect to TaxJar or Avalara | No |

#### Compliance

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Terms of Service Acceptance | P0 | Low | Require vendor agreement to marketplace terms | Yes |
| Payment Terms Documentation | P0 | Low | Clear documentation of fee and payout policies | Yes |
| Audit Trail | P1 | Medium | Complete log of all financial transactions | No |
| Data Retention Policy | P1 | Low | Store financial records for required period (7 years) | No |

---

### 5.3.9 Security and Fraud Prevention

#### Payment Security

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Stripe Radar (Fraud Detection) | P0 | Low | Built-in machine learning fraud detection | Yes |
| Manual Review Queue | P2 | High | Flag suspicious orders for manual review | No |
| Card Testing Prevention | P1 | Medium | Detect and block card testing attacks | Yes |
| IP-based Risk Scoring | P2 | Medium | Factor location into fraud scoring | No |
| Device Fingerprinting | P2 | High | Track devices for repeat fraud attempts | No |

#### Account Security

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Staff Access Controls | P1 | Medium | Role-based access to financial data and actions | No |
| Payout Authorization | P2 | Medium | Require approval for payouts over threshold | No |
| Activity Logging | P0 | Low | Log all admin actions on payments and payouts | Yes |
| Two-Factor for Admin | P1 | Low | Require 2FA for admin access to payment settings | No |

---

## 5.4 MVP vs Nice-to-Have Summary

### MVP Essential (P0)

These features are required for launch:

| Area | Feature |
|------|---------|
| **Checkout** | Card payments, Apple Pay, Google Pay, guest checkout |
| **Processing** | Single payment for multi-vendor cart, Stripe integration |
| **Fees** | Percentage commission, fee display at checkout |
| **Payouts** | Stripe Express onboarding, weekly ACH payouts |
| **Refunds** | Full and partial refunds, item-level refunds |
| **Disputes** | Chargeback notification, evidence submission |
| **Reporting** | Basic GMV, orders, payout summary |
| **Tax** | Vendor tax ID collection, 1099-K via Stripe |
| **Security** | PCI compliance via Stripe, fraud detection |

### Post-MVP (P1)

Add after initial launch:

- Saved payment methods
- Link by Stripe (faster checkout)
- Promo codes/discounts
- Order minimum enforcement
- Manual payout triggers
- Vendor earnings dashboard
- Refund reason tracking
- Vendor-facing order history

### Future (P2)

Long-term roadmap:

- BNPL (Affirm/Klarna)
- Instant payouts
- Tiered commission rates
- Negative balance handling
- Store credit system
- Advanced fraud prevention
- Accounting integrations
- Multi-currency support

---

## 5.5 Implementation Roadmap

### Phase 1: Foundation (Month 3 of MVP)

**Goal:** Accept payments, hold funds

| Week | Deliverables |
|------|--------------|
| 1 | Stripe account setup, API keys, webhook endpoints |
| 2 | Stripe Elements integration (card input) |
| 3 | Apple Pay / Google Pay setup |
| 4 | PaymentIntent creation with multi-vendor split data |

### Phase 2: Vendor Setup (Month 3-4)

**Goal:** Onboard vendors to Stripe Connect

| Week | Deliverables |
|------|--------------|
| 5 | Stripe Connect Express account creation flow |
| 6 | Vendor onboarding UI and status tracking |
| 7 | Bank account verification handling |
| 8 | Admin view of vendor onboarding status |

### Phase 3: Payout System (Month 4)

**Goal:** Pay vendors weekly

| Week | Deliverables |
|------|--------------|
| 9 | Payout calculation logic (vendor share - commission) |
| 10 | Weekly payout job (cron or Vercel Cron) |
| 11 | Payout notifications (email to vendors) |
| 12 | Payout dashboard for admin |

### Phase 4: Refunds & Disputes (Month 5)

**Goal:** Handle exceptions gracefully

| Week | Deliverables |
|------|--------------|
| 13 | Full order refund flow |
| 14 | Partial/item-level refund flow |
| 15 | Refund impact on pending payouts |
| 16 | Chargeback handling and evidence collection |

### Phase 5: Reporting & Tax (Month 5-6)

**Goal:** Financial visibility and compliance

| Week | Deliverables |
|------|--------------|
| 17 | Basic GMV and order reporting |
| 18 | Commission earnings report |
| 19 | Payout history and reconciliation |
| 20 | 1099-K threshold tracking, Stripe tax integration |

---

## 5.6 Fee Structure Recommendations

### Recommended: Hybrid Model

Based on industry research and Gather's context:

```
Platform Fee = 8% of vendor subtotal + $1.50 flat per order
```

**Rationale:**
- 8% is competitive (Amazon charges 8-15%, Instacart effective rate ~10%)
- Flat fee covers fixed costs (payment processing, pickup operations)
- Transparent and simple to explain

### Example Calculation

| Order | Customer Pays | Vendors Receive | Platform Earns |
|-------|---------------|-----------------|----------------|
| $50 order (3 vendors) | $50 + $1.50 = **$51.50** | $50 - ($4.00 commission) = **$46.00** | $4.00 + $1.50 = **$5.50** |
| Stripe fees (2.9% + $0.30) | | | -$1.79 |
| **Net platform revenue** | | | **$3.71** |

### Alternative Models Considered

| Model | Pros | Cons |
|-------|------|------|
| **Percentage only (12%)** | Simple | High % feels aggressive |
| **Flat only ($3)** | Predictable | Punishes small orders |
| **Tiered by volume** | Rewards growth | Complex to explain |
| **Free for vendors** | Easy onboarding | Not sustainable |

### Who Pays Stripe Fees?

**Recommendation:** Platform absorbs Stripe processing fees

- Simpler vendor payout calculation
- Standard practice for marketplaces
- Build fee structure to account for it

---

## 5.7 Technical Architecture

### Payment Flow Diagram

```
Customer Checkout
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                    Stripe Payment                         │
│  ┌────────────────┐                                       │
│  │ PaymentIntent  │ ◄── Cart items, vendor splits,       │
│  │   $51.50       │     platform fee, customer email     │
│  └───────┬────────┘                                       │
│          │                                                │
│          ▼                                                │
│  ┌────────────────────────────────────────┐               │
│  │         Stripe Connect Transfers       │               │
│  │  ┌──────────┐ ┌──────────┐ ┌────────┐ │               │
│  │  │ Vendor A │ │ Vendor B │ │ Vendor │ │               │
│  │  │  $15.00  │ │  $22.00  │ │  $9.00 │ │               │
│  │  └──────────┘ └──────────┘ └────────┘ │               │
│  └────────────────────────────────────────┘               │
│                                                           │
│  Platform Account: $5.50 (fee revenue)                   │
└──────────────────────────────────────────────────────────┘
       │
       ▼
  Weekly Payout Job
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                 Vendor Payouts (ACH)                      │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Vendor A: $145.00 (week's earnings - refunds)    │    │
│  │ Vendor B: $312.00                                 │    │
│  │ Vendor C: $89.00                                  │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### Database Schema Additions

```sql
-- Vendor payment account
CREATE TABLE vendor_stripe_accounts (
  id UUID PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id),
  stripe_account_id TEXT UNIQUE, -- acct_xxx
  onboarding_status TEXT, -- pending, complete, restricted
  payouts_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Payment records
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount_cents INTEGER,
  platform_fee_cents INTEGER,
  stripe_fee_cents INTEGER,
  status TEXT, -- pending, succeeded, failed, refunded
  created_at TIMESTAMP
);

-- Payout records
CREATE TABLE payouts (
  id UUID PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id),
  stripe_payout_id TEXT UNIQUE,
  amount_cents INTEGER,
  period_start DATE,
  period_end DATE,
  status TEXT, -- pending, in_transit, paid, failed
  created_at TIMESTAMP,
  paid_at TIMESTAMP
);

-- Refund records
CREATE TABLE refunds (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  order_item_id UUID REFERENCES order_items(id),
  stripe_refund_id TEXT,
  amount_cents INTEGER,
  reason TEXT,
  initiated_by TEXT, -- customer, staff, system
  status TEXT, -- pending, succeeded, failed
  created_at TIMESTAMP
);

-- Chargeback records
CREATE TABLE chargebacks (
  id UUID PRIMARY KEY,
  payment_id UUID REFERENCES payments(id),
  stripe_dispute_id TEXT UNIQUE,
  amount_cents INTEGER,
  reason TEXT,
  status TEXT, -- needs_response, under_review, won, lost
  evidence_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  resolved_at TIMESTAMP
);
```

### Key API Endpoints

```
POST /api/checkout/create-payment-intent
  → Creates Stripe PaymentIntent with split amounts

POST /api/webhooks/stripe
  → Handles payment.succeeded, charge.refunded, charge.dispute.*

GET  /api/admin/payouts
  → List pending and completed payouts

POST /api/admin/payouts/trigger
  → Manually trigger payout run

POST /api/admin/refunds
  → Process refund for order or item

GET  /api/vendor/earnings
  → Vendor's earnings dashboard data

GET  /api/vendor/payouts
  → Vendor's payout history
```

---

## 5.8 Open Questions

### Business Decisions Needed

| # | Question | Options | Recommendation |
|---|----------|---------|----------------|
| 1 | Who absorbs Stripe processing fees? | Platform / Vendors / Split | Platform |
| 2 | What is the platform commission rate? | 5-15% | 8% + $1.50 flat |
| 3 | What is the minimum order amount? | $0 / $15 / $20 | $15 |
| 4 | When do payouts occur? | Daily / Weekly / Bi-weekly | Weekly (Monday) |
| 5 | How long is the hold period before payout eligibility? | 0 / 2 / 7 days after pickup | 2 days |
| 6 | Who handles chargebacks financially? | Platform / Vendor | Platform |
| 7 | Do we offer instant payouts? | Yes (1% fee) / No | No for MVP |
| 8 | Do we collect sales tax? | Yes / No | No for MVP (research needed) |
| 9 | Refund policy window? | 24h / 48h / Same day | Before pickup only |

### Technical Decisions Needed

| # | Question | Options | Recommendation |
|---|----------|---------|----------------|
| 1 | Stripe Connect account type? | Express / Custom | Express |
| 2 | How to handle substitution price differences? | Auto-refund / Manual / Ignore | Auto-refund difference |
| 3 | Auth-only or immediate capture? | Auth+Capture later / Immediate | Immediate for MVP |
| 4 | Store credit system? | Build custom / Use Stripe credits / Skip | Skip for MVP |

---

## 5.9 Sources

### Stripe Connect and Multi-Vendor Payments
- [Stripe Connect Overview](https://stripe.com/connect) - Platform and marketplace payment solutions
- [Stripe Connect Documentation](https://docs.stripe.com/connect) - Official integration guides
- [Stripe Connect Account Types](https://docs.stripe.com/connect/accounts) - Standard vs Express vs Custom comparison
- [Stripe Split Payments Guide](https://stripe.com/resources/more/how-to-implement-split-payment-systems-what-businesses-need-to-do-to-make-it-work) - Implementation best practices
- [Stripe Marketplace Payouts](https://docs.stripe.com/connect/marketplace/tasks/payout) - Payout documentation
- [Stripe Instant Payouts](https://docs.stripe.com/connect/instant-payouts) - Instant payout feature details
- [Jeecart: Stripe Connect 2026 Guide](https://jeecart.com/what-is-stripe-connect/) - Comprehensive marketplace overview

### PayPal and Alternative Providers
- [PayPal Multiparty Payments](https://developer.paypal.com/docs/multiparty/) - Official developer documentation
- [PayPal Multi-Seller Payments](https://developer.paypal.com/docs/multiparty/checkout/multiseller-payments/) - Multi-vendor checkout
- [Sharetribe: PayPal for Marketplaces Overview](https://www.sharetribe.com/academy/marketplace-payments/paypal-for-marketplaces-overview/) - Feature comparison

### Fee Structures and Marketplace Economics
- [Marketplace Pricing Guide](https://fleexy.dev/blog/marketplace-pricing-set-optimal-service-fees-in-7-steps/) - Setting optimal fees
- [Commission vs Flat Fees](https://www.getmonetizely.com/articles/marketplace-pricing-taking-commissions-vs-flat-fees---what-saas-leaders-need-to-know) - SaaS marketplace pricing
- [Sharetribe: Commission/Take Rate](https://www.sharetribe.com/marketplace-glossary/commission-take-rate/) - Industry definitions
- [Marketplace Fee Comparison 2026](https://www.webgility.com/blog/marketplace-fees-amazon-ebay-etsy-walmart) - Amazon, eBay, Etsy, Walmart fees

### Chargebacks and Disputes
- [Chargeback Gurus: Marketplace Chargebacks](https://www.chargebackgurus.com/blog/chargebacks-online-marketplaces) - Dispute handling strategies
- [Rapyd: Marketplace Chargeback Prevention](https://www.rapyd.net/blog/8-marketplace-chargeback-reasons-how-to-reduce/) - Prevention best practices
- [Justt: Digital Marketplace Chargeback Risks](https://justt.ai/blog/digital-marketplaces-and-chargeback-risks/) - Risk management

### Refunds and Returns
- [Nautical: Multi-Vendor Payment Orchestration](https://www.nauticalcommerce.com/blog/multi-vendor-payment-orchestration) - Refund flow architecture
- [Trimplement: E-Commerce Refund Processing](https://trimplement.com/blog/2023/07/how-to-build-powerful-refund-processing-for-e-commerce/) - Technical implementation
- [CS-Cart: Marketplace Returns](https://www.cs-cart.com/blog/how-to-handle-order-returns-on-an-ecommerce-marketplace/) - Return policy best practices

### Tax Compliance (1099-K)
- [IRS: Understanding Form 1099-K](https://www.irs.gov/businesses/understanding-your-form-1099-k) - Official IRS guidance
- [Millan CPA: 1099-K Changes 2025](https://millancpa.com/insights/form-1099-k-changes-for-2025-what-businesses-and-sellers-must-know) - Updated thresholds
- [Trolley: 1099-K for Marketplaces](https://trolley.com/learning-center/irs-1099-k-payment-card-third-party-network-transactions/) - Compliance overview
- [Tax1099: Online Marketplace Reporting](https://www.tax1099.com/irs/tax-reporting-for-online-marketplace/) - Filing requirements

---

*This document should be reviewed with Stripe documentation and legal counsel before implementation. Payment processing regulations vary by jurisdiction.*


# Part 6: Reporting & Analytics

> Source: REPORTING_AND_ANALYTICS.md — Comprehensive reporting and analytics capabilities for all stakeholders.

---

## Table of Contents

1. [Overview](#overview)
2. [Stakeholder Needs Summary](#stakeholder-needs-summary)
3. [Feature Matrix by Audience](#feature-matrix-by-audience)
   - [Market Operator Reports (Carlo)](#market-operator-reports-carlo)
   - [Vendor Reports](#vendor-reports)
   - [Internal Analytics (Gather Team)](#internal-analytics-gather-team)
   - [Customer Insights](#customer-insights)
4. [MVP vs Phase 2+ Features](#mvp-vs-phase-2-features)
5. [Technical Considerations](#technical-considerations)
6. [Export & Delivery Options](#export--delivery-options)

---

## 6.1 Overview

Gather's reporting system must serve four distinct audiences with different needs:

| Audience | Primary Goal | Access Method | Frequency |
|----------|--------------|---------------|-----------|
| **Market Operator (Carlo)** | Understand overall market health | Web dashboard | Daily/Weekly |
| **Vendors (70+)** | Know their sales performance | Email/Print (MVP), Portal (P2) | Weekly |
| **Gather Team** | Track business metrics & growth | Admin dashboard | Real-time |
| **Customer Analytics** | Understand shopping behavior | Internal analysis | Weekly/Monthly |

---

## 6.2 Stakeholder Needs Summary

### Carlo (Market Operator)
- How much money flowed through the platform today/this week/this season?
- Which vendors are performing well vs struggling?
- Are customers coming back?
- How are pickup operations running?
- What should I tell vendors about the value of being online?

### Vendors
- How much did I sell this week?
- What are my top products?
- How does online compare to my in-person sales?
- When should I expect payout?

### Gather Team
- Are we hitting our $50K GMV target?
- Is the platform growing week-over-week?
- Where do customers drop off?
- What's our unit economics (fees collected, margin)?

### Customers (Indirect)
- Order history and receipts
- Spending summary (nice-to-have)

---

## 6.3 Feature Matrix by Audience

---

## 6.4 Market Operator Reports (Carlo)

### 6.4.1 Executive Dashboard

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-1 | **Daily Sales Summary** | P0 | Low | Total orders, GMV, and avg basket for current/previous day with comparison |
| MO-2 | **Weekly Performance Card** | P0 | Low | Week-to-date GMV, order count, unique customers, and WoW change percentage |
| MO-3 | **Season-to-Date Overview** | P0 | Medium | Cumulative GMV, total orders, unique customers since season start (May) |
| MO-4 | **Month Comparison Chart** | P1 | Medium | Line/bar chart comparing GMV across months (June vs July vs August, etc.) |
| MO-5 | **Year-over-Year Comparison** | P2 | Medium | Compare this season to last season (relevant after Year 2) |
| MO-6 | **Real-Time Order Ticker** | P2 | High | Live feed showing orders as they come in (market day mornings) |

### 6.4.2 Vendor Performance Reports

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-7 | **Vendor Leaderboard** | P0 | Low | Ranked list of vendors by GMV for selected period (day/week/month/season) |
| MO-8 | **Vendor Participation Rate** | P0 | Low | X of 70 vendors have products online; X vendors with sales this week |
| MO-9 | **Vendor Comparison Table** | P1 | Medium | Sortable table: vendor name, total sales, order count, avg basket, top product |
| MO-10 | **Zero-Sales Vendor Alert** | P1 | Low | Flag vendors with no sales in past 2 weeks (need attention) |
| MO-11 | **Vendor Growth Trends** | P2 | Medium | Week-over-week sales change per vendor (show who's growing/declining) |
| MO-12 | **Vendor Share of Wallet** | P2 | Medium | What % of total GMV does each vendor represent? Pie chart visualization |

### 6.4.3 Product Performance

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-13 | **Top 10 Products** | P0 | Low | Best-selling products by revenue and by units sold |
| MO-14 | **Category Breakdown** | P1 | Medium | GMV and order count by category (Produce, Meat, Dairy, etc.) |
| MO-15 | **Category Trends** | P1 | Medium | How category mix changes week to week (seasonal shifts) |
| MO-16 | **Product Velocity** | P2 | Medium | Items per order average; products added to cart most frequently |
| MO-17 | **Stock-Out Tracking** | P2 | High | Products marked unavailable; missed revenue estimate |
| MO-18 | **Price Point Analysis** | P2 | Medium | Distribution of items by price range; avg price per category |

### 6.4.4 Customer Metrics

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-19 | **New vs Returning Customers** | P0 | Medium | Unique customers this week; % new vs returning (by email) |
| MO-20 | **Customer Count Growth** | P0 | Low | Running total of unique customers; week-over-week new customer acquisition |
| MO-21 | **Repeat Purchase Rate** | P1 | Medium | % of customers who order again within 30 days |
| MO-22 | **Customer Frequency Distribution** | P1 | Medium | Histogram: 1 order, 2-3 orders, 4-5 orders, 6+ orders |
| MO-23 | **Average Customer Lifetime Value** | P2 | High | Total spend per customer over time; CLV projection |
| MO-24 | **Customer Cohort Analysis** | P2 | High | Track cohorts by signup month; retention curves over time |
| MO-25 | **Geographic Distribution** | P2 | Medium | Customer zip codes on map; identify geographic reach |

### 6.4.5 Operations Reports

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-26 | **Pickup Slot Utilization** | P0 | Medium | Orders per time slot; identify popular/underutilized slots |
| MO-27 | **Order Status Summary** | P0 | Low | Count by status: Pending, Packed, Picked Up, Cancelled for current day |
| MO-28 | **Pickup Completion Rate** | P1 | Low | % of orders successfully picked up vs no-shows |
| MO-29 | **Average Pickup Time** | P1 | Medium | Time from customer arrival (QR scan) to completion |
| MO-30 | **Issue Tracking** | P1 | Medium | Count of unavailable items, substitutions, partial refunds |
| MO-31 | **Peak Hour Analysis** | P2 | Medium | When do most orders come in? When are pickups busiest? |
| MO-32 | **Staff Efficiency Metrics** | P2 | High | Orders processed per staff member; check-in speed |

### 6.4.6 Financial Reports

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-33 | **GMV Summary** | P0 | Low | Total gross merchandise value for period |
| MO-34 | **Service Fee Revenue** | P0 | Low | Total fees collected (5% or flat fee) |
| MO-35 | **Vendor Payables Summary** | P0 | Medium | Amount owed to each vendor after fees (for manual payout) |
| MO-36 | **Refunds & Adjustments** | P1 | Medium | Total refunds issued; partial credits; cancellations |
| MO-37 | **Net Revenue Calculation** | P1 | Low | GMV - Refunds - Vendor Payments = Net to Market/Gather |
| MO-38 | **Payment Method Breakdown** | P2 | Low | Card vs Apple Pay vs Google Pay usage |
| MO-39 | **Failed Payment Log** | P2 | Medium | Transactions that failed; reasons; retry success rate |
| MO-40 | **Weekly Payout Report** | P1 | Medium | Exportable report for manual vendor payouts (CSV with amounts) |

---

## 6.5 Vendor Reports

*Note: In MVP, vendors don't log in. Reports delivered via email/print by market staff.*

### 6.5.1 Weekly Vendor Sales Report (Email/Print)

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| V-1 | **Weekly Sales Summary** | P0 | Low | Total sales, order count, items sold for the week |
| V-2 | **Top 5 Products** | P0 | Low | Best-selling items by revenue for that vendor |
| V-3 | **Order List** | P0 | Low | List of orders containing their products (order #, date, items, amount) |
| V-4 | **Payout Amount** | P0 | Low | Amount to be paid after platform fee deduction |
| V-5 | **Week-over-Week Change** | P1 | Low | Sales this week vs last week (up/down percentage) |
| V-6 | **Product Performance Table** | P1 | Medium | All products with units sold, revenue, and rank |
| V-7 | **Customer Count** | P1 | Low | Number of unique customers who bought from this vendor |
| V-8 | **Average Basket (Vendor-Specific)** | P1 | Low | Avg spend per order on this vendor's products |
| V-9 | **Season-to-Date Summary** | P2 | Low | Cumulative sales since market season opened |
| V-10 | **Compare to Market Average** | P2 | Medium | How does this vendor compare to avg vendor performance? |

### 6.5.2 Vendor Self-Service Dashboard (Phase 2)

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| V-11 | **Real-Time Sales Dashboard** | P2 | High | Live view of today's orders, revenue, items sold |
| V-12 | **Sales Trend Chart** | P2 | Medium | Weekly sales over past 8-12 weeks as line chart |
| V-13 | **Product Analytics** | P2 | Medium | Click-through rates, add-to-cart rates, conversion per product |
| V-14 | **Inventory Performance** | P2 | High | Stock-out frequency; recommend restocking levels |
| V-15 | **Customer Demographics** | P2 | High | Anonymous insights: new vs returning, avg spend |
| V-16 | **Payout History** | P2 | Medium | Log of all payouts with amounts and dates |
| V-17 | **Price Optimization Hints** | P2 | High | Suggestions based on demand elasticity (advanced) |

---

## 6.6 Internal Analytics (Gather Team)

### 6.6.1 Business Health Dashboard

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-1 | **North Star Metric: Monthly GMV** | P0 | Low | Current month GMV vs $50K target; progress bar |
| G-2 | **GMV Trend Line** | P0 | Medium | Daily/weekly GMV over time; identify trends |
| G-3 | **Orders Per Day** | P0 | Low | Order volume trend; identify growth patterns |
| G-4 | **Average Order Value (AOV)** | P0 | Low | Current AOV vs $59 target; trend over time |
| G-5 | **Unique Customers** | P0 | Low | Total unique customers; progress toward 500+ goal |
| G-6 | **Revenue (Platform Fees)** | P0 | Low | Total service fees collected; our actual revenue |
| G-7 | **Week-over-Week Growth** | P0 | Low | WoW % change in GMV, orders, customers |

### 6.6.2 Funnel Analytics

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-8 | **Full Funnel Visualization** | P0 | High | Homepage -> Product View -> Add to Cart -> Checkout -> Complete |
| G-9 | **Homepage to Product View Rate** | P0 | Medium | Target: >40% |
| G-10 | **Product View to Add to Cart** | P0 | Medium | Target: >10% |
| G-11 | **Add to Cart to Checkout** | P0 | Medium | Target: >60% |
| G-12 | **Checkout to Complete** | P0 | Medium | Target: >85% |
| G-13 | **Cart Abandonment Rate** | P1 | Medium | % of carts created but not converted |
| G-14 | **Abandonment by Stage** | P1 | High | Where in checkout do people drop off? |
| G-15 | **Abandonment Recovery** | P2 | High | Track customers who abandon then return later |

### 6.6.3 Customer Acquisition & Retention

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-16 | **Weekly New Customer Count** | P0 | Low | First-time purchasers per week |
| G-17 | **30-Day Repeat Rate** | P0 | Medium | % of customers who order again within 30 days; target: 40% |
| G-18 | **Cohort Retention Table** | P1 | High | Grid showing retention by signup week over time |
| G-19 | **Customer Acquisition Source** | P2 | High | How did customers find us? (UTM tracking) |
| G-20 | **Referral Tracking** | P2 | High | Track referral codes; identify word-of-mouth |
| G-21 | **Reactivation Rate** | P2 | Medium | Customers who return after 60+ days of inactivity |

### 6.6.4 Platform Performance

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-22 | **Page Load Time** | P1 | Medium | Average load time for key pages |
| G-23 | **Error Rate** | P1 | Medium | % of sessions with errors; error log |
| G-24 | **Payment Success Rate** | P1 | Low | Successful vs failed payment attempts |
| G-25 | **QR Scan Success Rate** | P1 | Low | % of QR scans that work first try |
| G-26 | **Mobile vs Desktop Usage** | P1 | Low | Device breakdown; validate mobile-first strategy |
| G-27 | **Browser/OS Distribution** | P2 | Low | Identify any browser-specific issues |
| G-28 | **API Latency Monitoring** | P2 | High | Response times for critical endpoints |

### 6.6.5 Operational Efficiency

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-29 | **Pick List Accuracy** | P1 | Medium | % of orders fulfilled without issues |
| G-30 | **Substitution Rate** | P1 | Low | % of orders with substituted items |
| G-31 | **Cancellation Rate** | P1 | Low | % of orders cancelled; reasons breakdown |
| G-32 | **Refund Rate** | P1 | Low | % of GMV refunded; by reason |
| G-33 | **Time to Pack** | P2 | High | Average time from order to "packed" status |
| G-34 | **Customer Wait Time** | P2 | High | Average time customers wait after QR scan |

### 6.6.6 Market Expansion Readiness (Phase 2+)

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-35 | **Per-Market Comparison** | P2 | High | Compare metrics across multiple markets |
| G-36 | **Market Onboarding Progress** | P2 | Medium | Track new market setup milestones |
| G-37 | **Vendor Density Analysis** | P2 | Medium | Products/vendors per category; identify gaps |
| G-38 | **Market Saturation Metrics** | P2 | High | Penetration rate vs total market visitors |

---

## 6.7 Customer Insights

### 6.7.1 Shopping Behavior Analytics

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| C-1 | **Basket Composition** | P1 | Medium | Average items per order; common product combinations |
| C-2 | **Category Preferences** | P1 | Medium | Which categories dominate shopping carts? |
| C-3 | **Multi-Vendor Orders** | P1 | Low | % of orders from 1 vendor vs 2-3 vs 4+ vendors |
| C-4 | **Browse vs Buy** | P2 | High | Products viewed but not purchased (demand signals) |
| C-5 | **Search Analytics** | P2 | Medium | Top search terms; searches with no results |
| C-6 | **Filter Usage** | P2 | Medium | Which filters are used most? (dietary, vendor, price) |
| C-7 | **Time to Purchase** | P2 | High | Average time from first visit to first order |
| C-8 | **Session Depth** | P2 | Medium | Pages per session; time on site |

### 6.7.2 Customer Segmentation

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| C-9 | **High-Value Customers** | P1 | Medium | Top 10% by spend; VIP identification |
| C-10 | **At-Risk Customers** | P2 | High | Customers who haven't ordered in 30+ days |
| C-11 | **Category Affinity Segments** | P2 | High | Produce lovers, meat buyers, prepared food fans |
| C-12 | **Spending Tier Distribution** | P2 | Medium | Under $30, $30-60, $60-100, $100+ order breakdown |
| C-13 | **Pickup Behavior** | P2 | Medium | Early vs on-time vs late pickup patterns |

### 6.7.3 Customer Communication Analytics

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| C-14 | **Email Open Rate** | P2 | Low | Confirmation email opens (via Resend) |
| C-15 | **Email Click Rate** | P2 | Low | Clicks on "View Order" or "Add to Calendar" |
| C-16 | **SMS Delivery Rate** | P2 | Low | Reminder SMS delivery/failure (if SMS enabled) |
| C-17 | **Unsubscribe Rate** | P2 | Low | Track opt-outs for marketing compliance |

---

## 6.8 MVP vs Phase 2+ Features

### MVP-Essential (P0) - Launch Requirements

| Category | Features |
|----------|----------|
| **Market Operator** | Daily/weekly sales summary, vendor leaderboard, top products, new vs returning customers, pickup slot utilization, GMV summary, service fee revenue, vendor payables |
| **Vendor** | Weekly sales report (email/print), top products, order list, payout amount |
| **Internal** | North Star GMV tracking, funnel visualization, basic conversion rates, AOV, unique customers |
| **Export** | CSV export for all reports, PDF for vendor summaries |

### Phase 1.5 (P1) - Quick Wins After Launch

| Category | Features |
|----------|----------|
| **Market Operator** | Vendor comparison table, category breakdown, repeat purchase rate, pickup completion rate, issue tracking, refunds report |
| **Vendor** | Week-over-week change, product performance table, season-to-date |
| **Internal** | Cohort retention, cart abandonment, pick list accuracy, cancellation/refund rates |
| **Customer** | Basket composition, category preferences, multi-vendor order analysis |

### Phase 2+ (P2) - Scale & Sophistication

| Category | Features |
|----------|----------|
| **Market Operator** | YoY comparison, real-time ticker, vendor growth trends, CLV, geographic distribution, staff efficiency |
| **Vendor** | Self-service dashboard, real-time sales, price optimization |
| **Internal** | Acquisition source tracking, referrals, reactivation, API monitoring, multi-market comparison |
| **Customer** | Segmentation, at-risk identification, search/filter analytics |

---

## 6.9 Technical Considerations

### Data Infrastructure

```
Event Tracking (Mixpanel/PostHog)
├── Page views with timestamps
├── Product interactions (view, add, remove)
├── Checkout funnel events
├── Search queries
└── Filter usage

Database Aggregations (PostgreSQL)
├── Pre-computed daily/weekly rollups
├── Materialized views for dashboards
├── Indexed queries for real-time data
└── Historical snapshots for trends

Caching Layer (Redis/Vercel KV)
├── Dashboard data (5-15 min cache)
├── Expensive aggregations
└── Rate limiting for exports
```

### Report Generation Architecture

```
Real-Time Reports
├── Query database directly
├── Lightweight aggregations
└── <5 second response time

Scheduled Reports
├── Background jobs (Vercel Cron)
├── Pre-compute expensive metrics
├── Email delivery (Resend)
└── PDF generation (React-PDF or Puppeteer)

Export Jobs
├── Async generation for large datasets
├── Signed URL download links
├── CSV and PDF formats
└── 24-hour expiry
```

### Dashboard Technology

| Component | Recommendation | Rationale |
|-----------|----------------|-----------|
| Charts | Recharts or Tremor | React-native, good Next.js support |
| Tables | TanStack Table | Sorting, filtering, export built-in |
| Date Pickers | date-fns + shadcn | Consistent with design system |
| PDF Export | react-pdf | Server-side PDF generation |
| CSV Export | papaparse | Client-side CSV creation |

---

## 6.10 Export & Delivery Options

### Export Formats

| Format | Use Case | Implementation |
|--------|----------|----------------|
| **CSV** | Data analysis, vendor payouts, accounting | All reports |
| **PDF** | Printable summaries, vendor handouts | Weekly summaries, pick lists |
| **Excel** | Complex analysis with formulas | P2 - xlsx export |
| **JSON** | API integrations | P2 - for multi-market |

### Delivery Methods

| Method | Audience | Timing |
|--------|----------|--------|
| **Dashboard** | Market operator, Gather team | Real-time access |
| **Scheduled Email** | Vendors (MVP), all users (P2) | Weekly on Sunday/Monday |
| **On-Demand Email** | Any user | Self-serve export & email |
| **Print** | Vendors, operations | Pick lists, vendor summaries |
| **Push Notification** | Staff | Real-time alerts (P2 mobile) |

### Scheduled Report Cadence

| Report | Recipient | Frequency | Day/Time |
|--------|-----------|-----------|----------|
| Weekly Vendor Summary | Each vendor (via email) | Weekly | Sunday 6pm |
| Market Weekly Digest | Carlo | Weekly | Sunday 8pm |
| Gather Team Metrics | Internal | Weekly | Monday 9am |
| End-of-Season Report | All stakeholders | Once | After last market |

---

## 6.11 Success Metrics for Analytics System

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard load time | <2 seconds | 95th percentile |
| Report generation time | <10 seconds | PDF/CSV exports |
| Data freshness | <15 minutes | Time since last update |
| Report email delivery | >99% | Resend delivery rate |
| User adoption | 80% weekly login | Carlo accesses dashboard |
| Vendor satisfaction | 4.5/5 | Survey on report usefulness |

---

## Appendix A: Report Mockup References

### Daily Summary Card (MVP)
```
┌────────────────────────────────────────┐
│  TODAY: Saturday, June 7              │
├────────────────────────────────────────┤
│  Orders: 47          GMV: $2,832      │
│  Avg Basket: $60.26  Customers: 41    │
│                                        │
│  vs Last Saturday:                    │
│  Orders: +12%  GMV: +18%              │
└────────────────────────────────────────┘
```

### Vendor Leaderboard (MVP)
```
┌────────────────────────────────────────┐
│  TOP VENDORS THIS WEEK                 │
├────────────────────────────────────────┤
│  1. Mitchell Farm         $1,247      │
│  2. Sunrise Dairy          $892       │
│  3. Berwyn Bakery          $756       │
│  4. Green Valley Produce   $623       │
│  5. Happy Hen Farm         $545       │
└────────────────────────────────────────┘
```

### Funnel Visualization (MVP)
```
┌────────────────────────────────────────┐
│  CONVERSION FUNNEL - This Week        │
├────────────────────────────────────────┤
│  Homepage Visits     1,200   (100%)   │
│         ↓                              │
│  Product Views         576   (48%)    │
│         ↓                              │
│  Add to Cart          120   (10%)     │
│         ↓                              │
│  Checkout Start        84   (70%)     │
│         ↓                              │
│  Order Complete        72   (86%)     │
└────────────────────────────────────────┘
```

---

*This document should be reviewed alongside PRD.md to ensure alignment with overall product strategy.*


# Part 7: Phase 2-4 Features & UX Research Plan

> Source: FEATURE_ROADMAP.md — Future phase features and operations UX research plan.

---

## Phase 2: Vendor Self-Service

**Goal:** Enable vendors to manage their own products, view their orders, and track their earnings. Scale to 5-10 markets.

**Timeline:** Months 7-12

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| V1 | **Vendor Login Portal** | Secure authentication for vendors to access their own dashboard. |
| V2 | **Vendor Dashboard Home** | Overview showing today's orders, pending items, recent payouts, and quick actions. |
| V3 | **Vendor Order View** | List of orders containing vendor's products with customer pickup times. |
| V4 | **Vendor Pick List View** | Vendor's own pick list for current market day, auto-updating as orders come in. |
| V5 | **Vendor Product Management** | Add, edit, and manage their own products without admin intervention. |
| V6 | **Vendor Photo Upload** | Upload and manage photos for their products. |
| V7 | **Vendor Availability Control** | Toggle products in/out of stock in real-time as inventory changes. |
| V8 | **Vendor Payout History** | View history of all payouts with amounts, dates, and status. |
| V9 | **Vendor Earnings Dashboard** | Real-time view of current period earnings, pending payouts, and trends. |
| V10 | **Vendor Bank Account Management** | Update connected bank account through Stripe. |
| V11 | **Vendor Profile Editing** | Update vendor description, photos, and contact information. |
| V12 | **Vendor Notifications** | Email/SMS alerts for new orders, pick list ready, payout sent. |
| V13 | **Customer Account Creation** | Optional account creation for customers to save info and view history. |
| V14 | **Customer Order History** | View past orders with details and reorder capability. |
| V15 | **Customer Favorites** | Save favorite products for quick access on future visits. |
| V16 | **Quick Reorder** | One-click to reorder items from a previous order. |
| V17 | **Customer Dietary Preferences** | Save dietary preferences to highlight/filter relevant products. |
| V18 | **Multi-Market Support (Basic)** | Infrastructure to support multiple markets with separate storefronts and operations. |
| V19 | **Market Switching (Admin)** | Admin ability to switch between markets they manage. |
| V20 | **Vendor Multi-Market Presence** | Vendors can sell at multiple markets with shared or market-specific inventory. |

---

## Phase 3: Market Manager Dashboard & Scale

**Goal:** Become indispensable to market operations. Scale to 50-100 markets. Add market management SaaS features.

**Timeline:** Months 13-18

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| M1 | **Vendor Application System** | Online vendor applications with custom questions, document uploads, review workflow. |
| M2 | **Application Review Dashboard** | Manager interface to review, approve, reject, or request more info from applicants. |
| M3 | **Stall Assignment Tool** | Visual market map for assigning vendors to specific stall locations. |
| M4 | **Market Map Builder** | Drag-and-drop tool to create visual representation of market layout. |
| M5 | **Automated Fee Collection** | Calculate and collect vendor booth fees (weekly, monthly, seasonal). |
| M6 | **Invoice Generation** | Generate invoices for vendor fees with payment tracking. |
| M7 | **License/Insurance Tracking** | Track vendor compliance documents with expiration alerts. |
| M8 | **Compliance Dashboard** | View all vendors' compliance status at a glance with red/yellow/green indicators. |
| M9 | **SNAP/EBT Processing** | Accept SNAP/EBT benefits for qualifying products with proper reporting. |
| M10 | **SNAP Token System** | Issue and track SNAP tokens for in-person market purchases. |
| M11 | **Grant Reporting Module** | Generate reports required for USDA FMPP/LFPP grants and other funding sources. |
| M12 | **Broadcast Communications** | Send email/SMS blasts to all vendors, all customers, or filtered segments. |
| M13 | **Announcement System** | Post announcements visible on storefront (weather alerts, special events, etc.). |
| M14 | **Financial Dashboard** | Comprehensive view of market finances: fees collected, GMV, platform revenue. |
| M15 | **Vendor Performance Analytics** | Metrics per vendor: sales trends, availability rate, issue rate, customer ratings. |
| M16 | **Customer Analytics** | Metrics on customers: repeat rate, average basket, cohort analysis. |
| M17 | **Product Analytics** | Top sellers, trending products, frequently out-of-stock items. |
| M18 | **Automated Substitution Suggestions** | AI-powered suggestions for similar products when item is unavailable. |
| M19 | **Inventory Sync Alerts** | Notify vendors when product is selling fast and may need restocking. |
| M20 | **Offline Mode (Operations)** | Operations dashboard works with limited connectivity, syncing when back online. |

---

## Phase 4: Platform Ecosystem

**Goal:** Network effects and platform ecosystem. Series A ready. 500+ markets.

**Timeline:** Months 19-24

| # | Feature Name | Feature Function |
|---|--------------|------------------|
| E1 | **Native iOS App** | Full-featured iPhone app for customers with push notifications. |
| E2 | **Native Android App** | Full-featured Android app for customers with push notifications. |
| E3 | **Vendor Mobile App** | Mobile app for vendors to manage products and view orders on the go. |
| E4 | **Customer Loyalty Program** | Points system for repeat purchases with rewards/discounts. |
| E5 | **Subscription Boxes** | Weekly/monthly subscription option for regular customers. |
| E6 | **Personalized Recommendations** | AI-powered product suggestions based on purchase history. |
| E7 | **Customer Reviews & Ratings** | Allow customers to rate and review products and vendors. |
| E8 | **Multi-Market Search** | Customers can discover markets near them and browse multiple markets. |
| E9 | **Market Directory** | Public directory of all Gather-powered markets with search and filtering. |
| E10 | **White-Label Option** | Remove Gather branding for markets wanting fully custom experience. |
| E11 | **Public API** | RESTful API for integrations with external systems (accounting, inventory, etc.). |
| E12 | **Zapier Integration** | Connect Gather to 1000+ apps via Zapier for workflow automation. |
| E13 | **QuickBooks Integration** | Sync transactions and payouts with QuickBooks for accounting. |
| E14 | **Inventory Management System** | Full inventory tracking with reorder alerts and forecasting. |
| E15 | **Delivery Option** | Optional delivery add-on for markets that want to offer home delivery. |
| E16 | **Multi-Language Support** | Storefront available in Spanish and other languages. |
| E17 | **Accessibility Audit & Compliance** | Full WCAG 2.1 AA compliance certification. |
| E18 | **Enterprise Admin Dashboard** | Admin view across all markets for franchise/network operators. |
| E19 | **Revenue Share Configuration** | Flexible commission structures for different markets/regions. |
| E20 | **Self-Service Market Onboarding** | Markets can sign up and launch without manual Gather team involvement. |

---

## Operations Team UX Research Plan

Before building the MVP, we need deep understanding of Carlo's current operations workflow to ensure the product fits his reality.

### Research Objectives

1. **Map the current end-to-end workflow** from order receipt to customer pickup
2. **Identify pain points** in the current manual process
3. **Understand what makes Berwyn's operations unique** vs. other markets
4. **Validate feature assumptions** before building
5. **Establish success metrics** in Carlo's terms

### Research Sessions

#### Session 1: Current State Workflow Mapping
**Duration:** 2 hours
**Participants:** Carlo + key operations staff

**Topics:**
- Walk through a typical market week from Monday to Saturday
- How do orders come in today? (Phone, email, in-person?)
- How are orders recorded and tracked?
- How are vendors notified of what to bring?
- What happens on market morning?
- How is customer pickup handled?
- What happens with no-shows?
- How are vendors paid currently?

**Deliverable:** Current state journey map with pain points annotated

#### Session 2: Vendor Coordination Deep-Dive
**Duration:** 1.5 hours
**Participants:** Carlo + 2-3 representative vendors

**Topics:**
- How do vendors learn what to bring each week?
- What information do they need and when?
- What format works best for them (paper, email, text)?
- How do they handle items being unavailable?
- What frustrates them about the current process?
- How do they currently get paid?

**Deliverable:** Vendor persona refinement and communication requirements

#### Session 3: Market Day Observation
**Duration:** Full market day (8am-2pm)
**Participants:** Observer shadows operations team

**Topics:**
- Observe actual customer pickup interactions
- Note timing, bottlenecks, and confusion points
- Document edge cases and exceptions in real-time
- Photograph current tools (paper lists, signs, etc.)
- Time key activities (check-in duration, issue resolution, etc.)

**Deliverable:** Observational findings report with photos and timing data

#### Session 4: Technology & Tools Audit
**Duration:** 1 hour
**Participants:** Carlo + whoever manages tech

**Topics:**
- What devices does the team have? (Tablets, phones, laptops)
- What's the wifi situation at the market?
- What software/tools are used today? (Square, Google Sheets, etc.)
- What's the comfort level with new technology?
- Any past technology attempts that failed? Why?

**Deliverable:** Technical requirements and constraints document

#### Session 5: Prototype Validation
**Duration:** 2 hours
**Participants:** Carlo + operations team

**Topics:**
- Walk through MVP wireframes/prototype
- "Would this work for you?" for each major workflow
- Identify missing features or wrong assumptions
- Prioritize features based on their actual needs
- Discuss launch timeline and training needs

**Deliverable:** Validated feature priority list and launch plan

### Research Questions to Answer

| Question | Why It Matters |
|----------|----------------|
| What's the order cutoff time and why? | Affects checkout flow and vendor notification timing |
| How are pick lists currently created and distributed? | Informs pick list feature design |
| What percentage of orders have issues (substitutions, refunds)? | Sizes the issue resolution workflow |
| How long does customer check-in take today? | Establishes baseline for improvement |
| What's the no-show rate? | Determines priority of no-show handling features |
| How are vendors currently paid and on what schedule? | Informs payout system design |
| What reporting does Carlo need for the market board/sponsors? | Shapes analytics and export features |

### Next Steps

1. **Schedule Session 1** with Carlo for current state mapping
2. **Create interview guides** for each session
3. **Prepare observation checklist** for market day
4. **Build low-fidelity wireframes** for Session 5 validation

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-07 | Drew + Claude | Initial feature roadmap, customer features, operations dashboard, admin features, payments spec |
| 1.1 | 2025-01-26 | PM Analysis | Reporting & analytics feature list |
| 2.0 | 2026-02-18 | Claude (Consolidation) | Merged 6 documents into single FEATURE_SPEC.md |

---

*PRD.md is the source of truth for product requirements. This document is the comprehensive feature specification. Last updated: February 2026.*
