/**
 * CAVENTRA — Interactive Website Project Cost Estimator Configuration
 * 
 * Centralised pricing rules and scope options for CAVENTRA website projects.
 * 
 * PRICING STATUS:
 * - 'PENDING_CAVENTRA_APPROVAL': Prices are indicative planning guidelines for testing & budgeting.
 * - 'APPROVED': Official CAVENTRA commercial pricing rules approved by management.
 */

(function(root) {
  'use strict';

  var CAVENTRA_ESTIMATOR_CONFIG = {
    // Configuration Status
    pricingStatus: 'APPROVED', // 'PENDING_CAVENTRA_APPROVAL' | 'APPROVED'
    statusNote: 'Official CAVENTRA Indicative Rates · Subject to Scope Confirmation',

    // Supported Currencies (Separate price lists — no arbitrary foreign exchange conversion)
    defaultCurrency: 'INR',
    supportedCurrencies: ['INR', 'USD'],

    currencySymbols: {
      INR: '₹',
      USD: '$'
    },

    // Mandatory Disclaimer text
    disclaimerText: 'This is an indicative estimate based on your selected requirements, not a binding quotation. Final pricing may vary after reviewing your project scope. Request a formal quote for confirmed pricing.',

    // STEP 1: Website Types & Base Architecture
    websiteTypes: [
      {
        id: 'landing-page',
        title: 'High-Conversion Landing Page',
        badge: 'Single Page',
        tagline: 'Focused conversion funnel for product or campaign launches',
        description: 'Single-page experience engineered with responsive hierarchy, fast load times, clear call-to-actions, and lead capture routing.',
        defaultPages: 1,
        pricing: {
          INR: { baseMin: 25000, baseMax: 35000, includedPages: 1, extraPageRate: 3500 },
          USD: { baseMin: 450, baseMax: 650, includedPages: 1, extraPageRate: 60 }
        }
      },
      {
        id: 'small-business',
        title: 'Small Business Website',
        badge: 'Core Online Presence',
        tagline: 'Professional multi-page studio presence for growing brands',
        description: 'Essential digital identity for businesses, consultants, or local services featuring services, about, portfolio highlights, and inquiry workflows.',
        defaultPages: 5,
        pricing: {
          INR: { baseMin: 45000, baseMax: 65000, includedPages: 5, extraPageRate: 4000 },
          USD: { baseMin: 800, baseMax: 1200, includedPages: 5, extraPageRate: 75 }
        }
      },
      {
        id: 'corporate',
        title: 'Corporate / Enterprise Website',
        badge: 'Multi-Department',
        tagline: 'Robust multi-service platform for established organizations',
        description: 'Comprehensive digital footprint with dedicated department sections, case study repositories, careers, leadership profiles, and trust signals.',
        defaultPages: 10,
        pricing: {
          INR: { baseMin: 85000, baseMax: 130000, includedPages: 10, extraPageRate: 5000 },
          USD: { baseMin: 1500, baseMax: 2400, includedPages: 10, extraPageRate: 90 }
        }
      },
      {
        id: 'portfolio',
        title: 'Portfolio / Personal Brand',
        badge: 'Visual Showcase',
        tagline: 'Bespoke showcase for creators, executives, and architects',
        description: 'Visually driven portfolio emphasizing imagery, project breakdowns, case studies, publication history, and personal achievements.',
        defaultPages: 4,
        pricing: {
          INR: { baseMin: 35000, baseMax: 50000, includedPages: 4, extraPageRate: 3500 },
          USD: { baseMin: 650, baseMax: 950, includedPages: 4, extraPageRate: 65 }
        }
      },
      {
        id: 'ecommerce',
        title: 'E-Commerce Storefront',
        badge: 'Digital Commerce',
        tagline: 'Complete digital retail storefront with payment integration',
        description: 'Full-featured online store with product catalog, cart workflows, payment gateway (Razorpay/Stripe), automated receipts, and order routing.',
        defaultPages: 8,
        pricing: {
          INR: { baseMin: 75000, baseMax: 120000, includedPages: 8, extraPageRate: 5000 },
          USD: { baseMin: 1400, baseMax: 2200, includedPages: 8, extraPageRate: 90 }
        }
      },
      {
        id: 'booking',
        title: 'Booking & Appointment Platform',
        badge: 'Automated Scheduling',
        tagline: 'Interactive scheduling system with automated notifications',
        description: 'Appointment booking system with calendar slots, automated WhatsApp/email reminders, customer intake, and optional advance deposits.',
        defaultPages: 6,
        pricing: {
          INR: { baseMin: 60000, baseMax: 90000, includedPages: 6, extraPageRate: 4500 },
          USD: { baseMin: 1100, baseMax: 1700, includedPages: 6, extraPageRate: 80 }
        }
      },
      {
        id: 'custom-web-app',
        title: 'Bespoke Custom Web Application',
        badge: 'Custom Architecture',
        tagline: 'Engineered web software tailored around your unique operations',
        description: 'Bespoke digital product with custom data models, user portals, interactive dashboards, or internal automation pipelines.',
        defaultPages: 10,
        pricing: {
          INR: { baseMin: 120000, baseMax: 200000, includedPages: 10, extraPageRate: 6000 },
          USD: { baseMin: 2200, baseMax: 3800, includedPages: 10, extraPageRate: 110 }
        }
      }
    ],

    // STEP 2: Page Presets and Rules
    pageRules: {
      minPages: 1,
      maxStandardPages: 40,
      presets: [
        { label: '1 Page', value: 1, desc: 'Single-page landing or teaser' },
        { label: '2–5 Pages', value: 5, desc: 'Standard business footprint' },
        { label: '6–10 Pages', value: 10, desc: 'Detailed multi-page structure' },
        { label: '11–20 Pages', value: 15, desc: 'Broad corporate or product catalog' },
        { label: '20+ Pages', value: 25, desc: 'Extensive web architecture' }
      ]
    },

    // STEP 3: Technical Features
    features: [
      {
        id: 'contact-form-routing',
        title: 'Contact Form & Google Sheets Routing',
        category: 'Lead Capture',
        description: 'Validated enquiry form with automated Google Sheets sync, email notifications, spam protection, and real-time confirmation states.',
        pricing: {
          INR: { min: 4000, max: 7000 },
          USD: { min: 75, max: 130 }
        },
        includedByDefaultIn: ['landing-page', 'small-business', 'corporate', 'portfolio', 'ecommerce', 'booking', 'custom-web-app']
      },
      {
        id: 'blog-cms',
        title: 'Blog / Article Management (CMS)',
        category: 'Content',
        description: 'Search-optimised article architecture with category filters, estimated reading time, markdown rendering, and instant zero-bloat static loading.',
        pricing: {
          INR: { min: 12000, max: 18000 },
          USD: { min: 220, max: 330 }
        }
      },
      {
        id: 'online-booking-system',
        title: 'Online Booking & Calendar Scheduling',
        category: 'Automation',
        description: 'Interactive scheduling calendar with Google Calendar / Cal.com synchronization and automated client notification triggers.',
        pricing: {
          INR: { min: 14000, max: 22000 },
          USD: { min: 260, max: 400 }
        },
        includedByDefaultIn: ['booking']
      },
      {
        id: 'ecommerce-payment-gateway',
        title: 'E-Commerce & Secure Payment Gateway',
        category: 'Commerce',
        description: 'Razorpay / Stripe checkout integration with order status logging, tax calculation, and automated invoice receipts.',
        pricing: {
          INR: { min: 22000, max: 35000 },
          USD: { min: 400, max: 650 }
        },
        includedByDefaultIn: ['ecommerce']
      },
      {
        id: 'third-party-integrations',
        title: 'Third-Party API & Webhook Integrations',
        category: 'Integrations',
        description: 'Secure API connections to your CRM, ERP, email newsletter (Mailchimp/Klaviyo), or internal cloud systems.',
        pricing: {
          INR: { min: 15000, max: 25000 },
          USD: { min: 280, max: 460 }
        }
      },
      {
        id: 'multilingual-support',
        title: 'Multilingual / Multi-Region Support',
        category: 'Localization',
        description: 'Seamless language switcher with dedicated localized content routing, metadata tags, and regional script handling.',
        pricing: {
          INR: { min: 16000, max: 26000 },
          USD: { min: 300, max: 480 }
        }
      },
      {
        id: 'seo-architecture',
        title: 'Comprehensive SEO & Structured Data',
        category: 'Growth',
        description: 'Semantic Schema.org markup, XML sitemap generation, OpenGraph social cards, canonical routing, and Google Search Console validation.',
        pricing: {
          INR: { min: 8000, max: 14000 },
          USD: { min: 150, max: 260 }
        }
      },
      {
        id: 'custom-motion-design',
        title: 'Custom Motion Design & Micro-Interactions',
        category: 'Experience',
        description: 'Hardware-accelerated CSS/GSAP micro-motion, smooth cursor tracking, scroll-triggered reveals, and tactile hover states.',
        pricing: {
          INR: { min: 10000, max: 18000 },
          USD: { min: 190, max: 330 }
        }
      },
      {
        id: 'user-auth-accounts',
        title: 'Client Portal / User Authentication',
        category: 'Security',
        description: 'Encrypted login/registration, password hashing, session cookies, and private user dashboard or member area.',
        pricing: {
          INR: { min: 28000, max: 45000 },
          USD: { min: 520, max: 820 }
        },
        includedByDefaultIn: ['custom-web-app']
      }
    ],

    // STEP 4: Additional Services (One-time vs Recurring)
    additionalServices: [
      {
        id: 'brand-identity',
        title: 'Brand Identity & Logo Suite',
        category: 'Branding',
        type: 'one-time',
        description: 'High-resolution logo design in light/dark variants, brand typography guide, color system, and social asset package.',
        pricing: {
          INR: { min: 15000, max: 25000 },
          USD: { min: 280, max: 460 }
        }
      },
      {
        id: 'copywriting-content',
        title: 'Professional Copywriting & Messaging',
        category: 'Content',
        type: 'one-time',
        description: 'Persuasive, conversion-focused headlines, value propositions, and service descriptions written specifically for your target audience.',
        pricing: {
          INR: { min: 12000, max: 22000 },
          USD: { min: 220, max: 400 }
        }
      },
      {
        id: 'hosting-domain-setup',
        title: 'Domain, SSL & High-Availability Cloud Setup',
        category: 'Infrastructure',
        type: 'one-time',
        description: 'Custom domain DNS routing, automated SSL certification, global CDN caching (Cloudflare/GitHub/Vercel), and HTTP security headers.',
        pricing: {
          INR: { min: 5000, max: 9000 },
          USD: { min: 90, max: 170 }
        }
      },
      {
        id: 'analytics-tracking',
        title: 'Analytics, Event Tracking & Heatmaps',
        category: 'Analytics',
        type: 'one-time',
        description: 'Privacy-first analytics setup, custom conversion event tracking (form submits, button clicks), and Google Analytics 4 integration.',
        pricing: {
          INR: { min: 6000, max: 10000 },
          USD: { min: 110, max: 190 }
        }
      },
      {
        id: 'speed-accessibility-audit',
        title: 'Performance & WCAG Accessibility Optimization',
        category: 'Performance',
        type: 'one-time',
        description: 'Image WebP compression, lazy loading, font optimization, 95+ PageSpeed Core Web Vitals target, and WCAG AA contrast compliance.',
        pricing: {
          INR: { min: 8000, max: 14000 },
          USD: { min: 150, max: 260 }
        }
      },
      {
        id: 'ongoing-maintenance',
        title: 'Ongoing Technical Maintenance & Monitoring',
        category: 'Maintenance',
        type: 'recurring',
        period: 'month',
        description: 'Continuous uptime monitoring, monthly security patches, minor content adjustments, backup verification, and priority engineering support.',
        pricing: {
          INR: { min: 4500, max: 8000 },
          USD: { min: 85, max: 150 }
        }
      }
    ],

    // Complexity Adjustments
    complexityLevels: [
      {
        id: 'standard',
        label: 'Standard Precision',
        desc: 'Clean, elegant execution adhering to CAVENTRA best practices and core design system.',
        multiplier: 1.0
      },
      {
        id: 'elevated',
        label: 'High-Impact / Custom Micro-Interactions',
        desc: 'Advanced visual polish, custom 3D/canvas micro-effects, bespoke illustrative iconography, and deep conversion tuning.',
        multiplier: 1.2
      }
    ]
  };

  /**
   * Deterministic Price Calculation Engine
   */
  function calculateEstimate(state, config) {
    var cfg = config || CAVENTRA_ESTIMATOR_CONFIG;
    var currency = (state && state.currency) || cfg.defaultCurrency;
    var typeId = (state && state.websiteTypeId) || 'small-business';
    var type = cfg.websiteTypes.find(function(t) { return t.id === typeId; }) || cfg.websiteTypes[0];
    var typePricing = type.pricing[currency] || type.pricing.INR;

    // 1. Base Development Cost
    var baseMin = typePricing.baseMin;
    var baseMax = typePricing.baseMax;

    // 2. Extra Pages Calculation
    var totalPages = Math.max(1, (state && state.pageCount) || type.defaultPages);
    var includedPages = typePricing.includedPages || 1;
    var extraPages = Math.max(0, totalPages - includedPages);
    var extraPagesCost = extraPages * (typePricing.extraPageRate || 0);

    var devMin = baseMin + extraPagesCost;
    var devMax = baseMax + extraPagesCost;

    // 3. Feature Pricing (prevent double-charging for features included in base type)
    var selectedFeatureDetails = [];
    var selectedFeatureIds = (state && state.selectedFeatureIds) || [];

    cfg.features.forEach(function(feat) {
      var isSelected = selectedFeatureIds.indexOf(feat.id) !== -1;
      var isIncluded = (feat.includedByDefaultIn || []).indexOf(type.id) !== -1;

      if (isSelected || isIncluded) {
        if (isIncluded) {
          selectedFeatureDetails.push({
            id: feat.id,
            title: feat.title,
            category: feat.category,
            included: true,
            costMin: 0,
            costMax: 0
          });
        } else {
          var fPrice = feat.pricing[currency] || { min: 0, max: 0 };
          devMin += fPrice.min;
          devMax += fPrice.max;
          selectedFeatureDetails.push({
            id: feat.id,
            title: feat.title,
            category: feat.category,
            included: false,
            costMin: fPrice.min,
            costMax: fPrice.max
          });
        }
      }
    });

    // 4. Additional Services (Separating one-time vs recurring monthly maintenance)
    var selectedServiceDetails = [];
    var selectedServiceIds = (state && state.selectedServiceIds) || [];
    var recurringMin = 0;
    var recurringMax = 0;
    var recurringPeriod = '';

    selectedServiceIds.forEach(function(sId) {
      var srv = cfg.additionalServices.find(function(s) { return s.id === sId; });
      if (!srv) return;
      var sPrice = srv.pricing[currency] || { min: 0, max: 0 };

      if (srv.type === 'recurring') {
        recurringMin += sPrice.min;
        recurringMax += sPrice.max;
        recurringPeriod = srv.period || 'month';
        selectedServiceDetails.push({
          id: srv.id,
          title: srv.title,
          category: srv.category,
          type: 'recurring',
          period: srv.period,
          costMin: sPrice.min,
          costMax: sPrice.max
        });
      } else {
        devMin += sPrice.min;
        devMax += sPrice.max;
        selectedServiceDetails.push({
          id: srv.id,
          title: srv.title,
          category: srv.category,
          type: 'one-time',
          costMin: sPrice.min,
          costMax: sPrice.max
        });
      }
    });

    // 5. Complexity Multiplier
    var complexityId = (state && state.complexityId) || 'standard';
    var complexity = cfg.complexityLevels.find(function(c) { return c.id === complexityId; }) || cfg.complexityLevels[0];
    var multiplier = complexity.multiplier || 1.0;

    devMin = Math.round(devMin * multiplier);
    devMax = Math.round(devMax * multiplier);

    var sym = cfg.currencySymbols[currency] || (currency === 'INR' ? '₹' : '$');

    return {
      currency: currency,
      currencySymbol: sym,
      pricingStatus: cfg.pricingStatus,
      statusNote: cfg.statusNote,
      websiteType: type,
      totalPages: totalPages,
      includedPages: includedPages,
      extraPages: extraPages,
      extraPagesCost: extraPagesCost,
      complexity: complexity,
      selectedFeatures: selectedFeatureDetails,
      selectedServices: selectedServiceDetails,
      oneTimeDevMin: devMin,
      oneTimeDevMax: devMax,
      recurringMin: recurringMin,
      recurringMax: recurringMax,
      recurringPeriod: recurringPeriod,
      disclaimer: cfg.disclaimerText
    };
  }

  // Export to global scope & CommonJS
  root.CAVENTRA_ESTIMATOR_CONFIG = CAVENTRA_ESTIMATOR_CONFIG;
  root.calculateEstimate = calculateEstimate;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      CAVENTRA_ESTIMATOR_CONFIG: CAVENTRA_ESTIMATOR_CONFIG,
      calculateEstimate: calculateEstimate
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);
