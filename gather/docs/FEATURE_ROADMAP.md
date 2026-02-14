# Gather Feature Roadmap

> **Document Purpose:** Comprehensive feature list organized by release phase, with clear feature names and functions.

---

## Table of Contents

1. [MVP (Phase 1)](#mvp-phase-1)
   - [Customer Storefront](#customer-storefront)
   - [Shopping Cart](#shopping-cart)
   - [Checkout & Payment](#checkout--payment)
   - [Order Confirmation](#order-confirmation)
   - [Operations Dashboard](#operations-dashboard)
   - [Pick List System](#pick-list-system)
   - [Customer Check-in](#customer-check-in)
   - [Issue Resolution](#issue-resolution)
   - [Admin: Product Management](#admin-product-management)
   - [Admin: Market Configuration](#admin-market-configuration)
   - [Payments & Vendor Payouts](#payments--vendor-payouts)
2. [Phase 2: Vendor Self-Service](#phase-2-vendor-self-service)
3. [Phase 3: Multi-Market & Scale](#phase-3-multi-market--scale)
4. [Phase 4: Platform Ecosystem](#phase-4-platform-ecosystem)
5. [Operations Team UX Research Plan](#operations-team-ux-research-plan)

---

## MVP (Phase 1)

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
| O18 | **Order Status Selector** | Dropdown or button group to change order status (Pending → Packed → Picked Up). |
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
| O40 | **Manual Order Lookup** | Fallback search when QR won't scan—find order by number, name, phone, or email. |
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
| O51 | **Substitution Price Handling** | Automatic calculation of price difference—refund if substitute is cheaper, absorb if more expensive. |
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
| A27 | **Vendor Active Toggle** | Enable/disable vendor—inactive vendors hidden from storefront but data preserved. |
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

## MVP Feature Summary

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
| 1.0 | 2025-02-07 | Drew + Claude | Initial feature roadmap |

---

*This document should be reviewed with Carlo before development begins to validate features and priorities.*
