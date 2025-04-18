# Sim Studio Website Specification

## INDEX
1. [Introduction](#introduction)
2. [Business Objectives](#business-objectives)
3. [Functional Requirements](#functional-requirements)
4. [Information Architecture](#information-architecture)
5. [Technical Requirements](#technical-requirements)
6. [Plugins and Apps](#plugins-and-apps)
7. [Future Features](#future-features)

## Introduction

### Overview
This specification document outlines the functional and technical requirements for a website designed to support a car racing simulator training studio. The website will enable visitors to learn about the business, explore services, and complete bookings. The business requires a reliable and scalable platform to manage bookings, e-commerce, and administrative functions. Additionally, the website will cater to trade customers who may book the studio as a facility for their own clients.

This document provides two separate versions of the specification:

- **WordPress Version**: Leveraging WordPress's CMS capabilities and plugins like WooCommerce and Amelia.
- **Shopify Version**: Utilizing Shopify's robust e-commerce platform and third-party apps like Sesami or BookThatApp.

### Scope
- **Version 1**: Focus on launching a fully functional website that covers core requirements such as bookings, e-commerce, user accounts, and facility booking for trade customers. This version will also include basic support for selling non-core products and services, such as merchandise or off-site coaching sessions, using product tags or categories.
- **Version 2 (Future)**: Consider headless setups, mobile app integration, or advanced features like multi-currency and custom credit systems.

## Business Objectives
- Attract and educate potential customers about the business and services offered.
- Provide an intuitive online experience for booking time in simulators, purchasing services, and managing user accounts.
- Streamline administrative workflows, including product/service management and reporting.
- Prepare for scalability to support multiple locations and a potential franchise model.
- Offer facility booking options for trade customers, including special pricing and scheduling flexibility.
- Support the sale of non-core products and services, such as merchandise (e.g., caps, t-shirts) or off-site coaching sessions.
- Provide a unified content hub for dynamic content like articles, news, and events.
- Showcase partnerships with sponsors, event collaborators, and hardware providers.

### Platform-Specific Considerations
**WordPress:**
- Strengths: Exceptional content management, customizability, robust plugin ecosystem.
- Challenges: Greater reliance on hosting and plugin compatibility; potential technical overhead.

**Shopify:**
- Strengths: Simplified e-commerce management, reliable hosting, and ease of use.
- Challenges: Limited content management and dependence on third-party apps for advanced features.

## Functional Requirements

### Core Features
**Booking System:**
- Enable customers to book simulator sessions online with options for individual, group, or coach bookings.
- Support recurring bookings (e.g., weekly sessions) and flexible time slots.
- Trade customers should be able to book the facility (e.g., full studio or selected simulators) via manual or automated processes.

**E-Commerce Functionality:**
- Support for selling two distinct categories:
  - Physical Merchandise: Items such as caps, driving gloves, and t-shirts, available through the Store.
  - Training-Related Services: Offerings like off-site coaching sessions, organized and accessible within the Training section.
- Provide a streamlined checkout process with support for discounts, gift cards, and store credits.
- Manage inventory and pricing for both retail and trade customers.

**User Accounts:**
- Allow customers to create accounts to view booking history, manage active bookings, and store payment information.
- Include functionality for tracking referral bonuses and managing credit balances.

### Content Management
**Static Content:**
- Create and manage landing pages for services, streams, and products.
- Ensure SEO-friendly structures (e.g., correct heading nesting, metadata control).
- Include a limited set of "How It Works" landing pages (e.g., booking process, account setup).

**Dynamic Content:**
- Enable cross-linking between related products and services.
- Support blogs or updates to engage customers and improve organic traffic.
- Implement FAQ-style "nuggets" of micro-content (e.g., "How to create an account," "How to book a session") that can be reused contextually across pages, such as booking screens or account management sections.
- Create a unified content hub for publishing articles, news, and events, with filters for organization (e.g., /hub, /hub/news, /hub/events).

### Additional Features
**Multi-Location Support:**
- Enable location-based filtering for services, bookings, and products.
- Support location-specific pricing, staff availability, and scheduling.

**Referral Programs:**
- Implement referral incentives, such as rewarding customers for referring friends with credits or discounts on future bookings.

**Transactional Emails:**
- Automate emails for booking confirmations, reminders, and special offers.
- Support customization to align with branding.

**Partners Section:**
- Create a static page showcasing partnerships, categorized by type (e.g., Sim Hardware Providers, Event Sponsors).

### Technical Features
**API Integration:**
- Integrate with third-party tools like Stripe, Google Calendar, and referral management systems.
- Support for headless setups in future iterations.

**Payment Gateways:**
- Offer multiple payment options, including Stripe, PayPal, and store credit.

**Mobile Optimization:**
- Ensure responsive design and fast loading times for mobile users.

## Information Architecture

### Primary Navigation (Main Menu)
This structure supports SEO by providing clear, user-friendly navigation and logical URL patterns to improve discoverability.

**Home**
- Overview of the business, and key CTAs (e.g., "Book Now," "Learn More").
- Links to Streams, Booking, and Store.

**Training**
- Overview of training offerings (e.g., simulator bookings, coaching, packages).
- Includes cross-links to relevant simulator specifications in the Facility section for detailed information.
- Subcategories:
  - Motorsport Training: Coaching and simulator packages for race drivers.
  - On-Road Training: Beginner and school-age driver sessions.

**Facility**
- Studio and simulator specs (hardware, features, and environment).
- Links back to Training for booking options and services to maintain content focus.
- Subsection: Book Facility (trade-focused bookings).

**Store**
- Physical products only (e.g., caps, t-shirts, driving gloves).

**How It Works**
- Dedicated landing pages (e.g., "Getting Started," "Booking Guide").

**Articles (Future)**
- A unified content hub for blog posts, news, and events, organized with tags or filters (e.g., /hub, /hub/news, /hub/events).

**Partners (Future)**
- Static page showcasing partnerships (e.g., Sim Hardware Providers, Sponsors, Event Partners).

**About Us**
- Business story, mission, and team introduction.

**Contact**
- Contact form, studio locations, and operating hours.

### Secondary Navigation (Footer Links)
- Privacy Policy
- Terms and Conditions
- FAQ (also integrated throughout).
- Careers
- Social Media Links

### Logged-In User Area (User Dashboard)
Pages and features accessible to logged-in users for account management and enhanced functionality.

**Dashboard Overview:**
- Quick access to upcoming bookings, credit balance (if applicable), and recent activity.

**Booking Management:**
- View, modify, or cancel active bookings.
- History of completed bookings with options for rebooking.

**Account Details:**
- Update personal information, contact details, and preferences.
- Manage payment methods for faster checkout.

**Referral Tracking:**
- View referral bonuses earned and usage history.

**Credit Balance (Future):**
- Monitor available store credit for future purchases or bookings.

**Support:**
- Access FAQ, customer support contact, or submit inquiries.

### Key Customer Workflows
**Booking a Simulator Session:**
- Navigate to Training > Select session type > Choose date/time > Checkout.
- "How to Book" FAQ snippets linked contextually.

**Buying a Package (10-Session Pack):**
- Navigate to Training > Select package > Checkout.
- Individual sessions booked separately via the account dashboard.

**Facility Booking for Trade:**
- Navigate to Facility > Login or learn about trade options.

**Purchasing Merchandise:**
- Navigate to Store > Add items to cart > Checkout.

**Exploring Articles (Future):**
- Navigate to Articles > Filter by type (e.g., News, Events).

**Learning About Partners (Future):**
- Navigate to Partners > View partner categories.

## Technical Requirements

### Platform Setup
**WordPress:**
- Hosting requirements to ensure scalability, backups, and performance optimization.
- Recommended use of managed WordPress hosting providers like WP Engine or Kinsta for reliability.

**Shopify:**
- Built-in hosting ensures scalability and global content delivery via Shopify's CDN.
- Minimal setup required, with hosting and security managed by Shopify.

## Plugins and Apps

### WordPress Plugins
**Booking Management:**
- Amelia:
  - Comprehensive booking tool supporting individual, group, and recurring bookings.
  - Integration with Google Calendar for real-time scheduling updates, if critical to workflows.

**E-Commerce:**
- WooCommerce:
  - Handles both physical products (e.g., merchandise) and services (e.g., training packages).
  - Extensive extensions are available for payments, shipping, and inventory management.

**Referral Programs:**
- AffiliateWP:
  - Tracks referral bonuses and integrates with WooCommerce.
  - Supports coupon-based and link-based referral tracking.
  - Ensure this tool aligns with referral program goals and the scope of planned campaigns.

**Payment Gateways:**
- Stripe and PayPal:
  - Secure and tokenized payment handling.
  - Supports saved payment methods for faster checkouts.

**Other Notable Plugins:**
- Yoast SEO:
  - Improves on-page SEO and content optimization.
- WP Rocket:
  - Enhances website speed and caching.
- Advanced Custom Fields (ACF):
  - Allows creation and management of custom fields across posts, pages, and custom post types.
  - Useful for adding structured data, such as simulator specifications or additional booking details.
- Hotjar (Optional):
  - Tracks user interactions and gathers heatmap insights for user experience optimization.
  - Useful for identifying pain points in user flows.

### Shopify Apps
**Booking Management:**
- Sesami or BookThatApp:
  - Provides booking tools to schedule sessions or manage availability.
  - Integration with Shopify's inventory and product system.

**E-Commerce Enhancements:**
- Shopify's built-in tools:
  - Native functionality for managing products, collections, and inventory.
- Advanced Product Options:
  - Customizes options for bundled packages or personalized items.

**Referral Programs:**
- Referral Candy:
  - Encourages referrals with automated rewards (discounts or credits).
  - Integrated dashboards to track program success.

**Payment Gateways:**
- Shopify Payments (powered by Stripe):
  - Simplifies setup and provides secure transactions.
- PayPal:
  - Adds additional flexibility for customer payment preferences.

**Other Notable Apps:**
- SEO Manager:
  - Enhances search engine visibility with schema markup and automated tagging.
  - Consider how Shopify's SEO tools align with long-term SEO goals compared to Yoast SEO on WordPress.
- Hotjar:
  - Tracks user interactions and gathers heatmap insights for user experience optimization.

### Comparison of Plugins/Apps

| Feature               | WordPress          | Shopify                  |
|-----------------------|--------------------|--------------------------|
| Booking Management    | Amelia             | Sesami / BookThatApp     |
| E-Commerce            | WooCommerce        | Shopify's native tools   |
| Referral Programs     | AffiliateWP        | Referral Candy           |
| SEO Optimization      | Yoast SEO          | SEO Manager              |
| Performance Tools     | WP Rocket          | Built-in performance tools |
| Analytics             | Google Analytics / Hotjar | Google Analytics / Hotjar |

### Future Plugin/App Needs
**Credit System (Optional):**
- WordPress: Wallet-based plugins or WooCommerce extensions.
- Shopify: Store credit functionality through apps like Rise.ai.

**Multi-Location Support (Optional):**
- WordPress: Custom solutions for location filtering via plugins.
- Shopify: Integrated tools for managing inventory by location.

**Accessibility Enhancements (Optional):**
- WordPress:
  - Plugins for WCAG compliance testing, such as WP Accessibility.
  - Useful for ensuring your site meets accessibility standards and improves usability.
- Shopify:
  - Theme-based accessibility improvements, with options to enhance as needed.

**Multi-Location Support:**
- WordPress: Custom solutions for location filtering via plugins (Optional).
- Shopify: Integrated tools for managing inventory by location (Optional).

## Future Features

### Headless Setup
**API-Driven Front End:**
- Use WordPress or Shopify APIs to power a custom front-end framework such as React, Next.js, or Flutter.

**Benefits:**
- Improve site performance and scalability by decoupling the frontend and backend.
- Enhanced control over the user experience.
- Faster page load times and improved SEO.

### Mobile App Integration
**Standalone App:**
- Develop a mobile app to extend the website's functionality.
- Allow users to book sessions, view schedules, and manage accounts on the go.

**Integration:**
- Utilize APIs for seamless data sharing between the website and app.
- Support push notifications for booking confirmations and special promotions.

### Franchise Model Support
**Multi-Location Management:**
- Expand capabilities for managing multiple studios, including location-specific staff, pricing, and availability.

**Multi-Currency Support:**
- Allow transactions in different currencies if the franchise model expands internationally.

**Localized Content:**
- Provide region-specific landing pages and content for SEO optimization.

### Advanced Customer Features
**Credit System:**
- Enable users to purchase and redeem credits for bookings and products.
- Integrate with referral bonuses to add credits to user accounts.

**Enhanced Referral Programs:**
- Introduce tiered rewards based on referral performance.
- Provide real-time dashboards for users to track referrals.

### Marketing and Analytics
**Enhanced Personalization:**
- Use AI-driven tools to recommend services or products based on user behaviour.

**Advanced Analytics:**
- Integrate tools for deeper insights into user behaviour and conversion tracking (e.g., Google Analytics 4, Mixpanel).
