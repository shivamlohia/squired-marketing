/**
 * Squired Marketing - Master Configuration File
 * Brand Name: Squired Marketing (never "Squared")
 *
 * ALL copy, variants, FAQ items, form labels, calculator settings,
 * and company details are defined here. Pages render dynamically from this config.
 *
 * Trimmed Revision (v2) applied.
 */

const CONFIG = {
  // Brand & Company Details
  brand: {
    name: "Squired Marketing",
    tagline: "Performance & Retention Growth Partner for Modern Brands",
    founded: "Kolkata, India",
    email: "anirban@squiredmarketing.com",
    phone: "+91 98365 78989",
    location: "Kolkata, India",
    copyrightYear: 2026,
    socials: {
      linkedin: "https://linkedin.com/company/squired-marketing",
      twitter: "https://x.com/squiredmktg"
    }
  },

  // Form endpoint (Direct FormSubmit AJAX endpoint delivering straight to Anirban's inbox)
  formEndpoint: "https://formsubmit.co/ajax/anirban@squiredmarketing.com",

  // Calculator Configuration
  calculator: {
    improvementPct: 10,
    defaults: {
      inr: {
        minSpend: 50000,
        maxSpend: 5000000,
        stepSpend: 25000,
        defaultSpend: 100000,
        currencySymbol: "₹",
        currencyCode: "INR"
      },
      usd: {
        minSpend: 1000,
        maxSpend: 100000,
        stepSpend: 500,
        defaultSpend: 5000,
        currencySymbol: "$",
        currencyCode: "USD"
      },
      defaultRoas: 3.0,
      defaultAcos: 33.3
    },
    note: "Illustrative estimate. Full economics are validated in the audit."
  },

  // Token values (Empty tokens automatically hide their container elements)
  tokens: {
    VERIFIED_METRIC_1: "",
    VERIFIED_METRIC_1_LABEL: "",
    VERIFIED_METRIC_1_DATES: "",

    VERIFIED_METRIC_2: "",
    VERIFIED_METRIC_2_LABEL: "",
    VERIFIED_METRIC_2_DATES: "",

    VERIFIED_METRIC_3: "",
    VERIFIED_METRIC_3_LABEL: "",
    VERIFIED_METRIC_3_DATES: "",
  },

  // Verified Case Studies (Module remains completely hidden if array is empty)
  caseStudies: [],

  // Platform Trust Strip (Names only, bracketed types removed)
  trustPlatforms: {
    india: [
      { name: "Shopify" },
      { name: "Meta Ads" },
      { name: "Google Ads" },
      { name: "Amazon Ads" },
      { name: "Flipkart Ads" },
      { name: "WhatsApp" }
    ],
    international: [
      { name: "Shopify" },
      { name: "Meta Ads" },
      { name: "Google Ads" },
      { name: "Amazon Ads" },
      { name: "Klaviyo" }
    ]
  },

  // VARIANTS: default, marketplace, d2c, retention
  variants: {
    default: {
      key: "default",
      name: "Squired Growth Partner",
      ctaText: "Book a Growth Audit",
      ctaSubtext: "Free 45-minute teardown of your media and margin leaks.",
      hero: {
        eyebrow: "Performance & Margin Partner",
        headline: "Profitable scaling for modern commerce brands.",
        subhead: "Media buying, creative and retention, built around contribution margin instead of vanity GMV.",
        microcopy: "Founder-led. Live reporting sheets. Reply within 48 hours."
      },
      dynamicBrandField: {
        label: "Store or brand link",
        placeholder: "yourbrand.com or store link",
        help: ""
      },
      proofBarLabels: {
        metric1: "Capital Managed",
        metric2: "Blended Return",
        metric3: "Retention Lift"
      },
      problemTrio: {
        title: "Why Commerce Growth Stalls",
        items: [
          {
            title: "CPA Escalation & Creative Fatigue",
            description: "Audiences tire fast. Costs rise faster than margin."
          },
          {
            title: "Channel Silos & Blind ROAS",
            description: "Every platform claims the sale. The bank balance disagrees."
          },
          {
            title: "One-Time Buyers, No Retention",
            description: "Acquisition costs never earn back without repeat orders."
          }
        ]
      },
      servicesOrder: ["paid-social", "search-marketplace", "retention-lifecycle", "creative-cro", "growth-analytics"],
      calculatorMode: "roas"
    },

    marketplace: {
      key: "marketplace",
      name: "Marketplace & Retail Media",
      ctaText: "Request Marketplace Audit",
      ctaSubtext: "Amazon and Flipkart ad teardown with a TACoS review.",
      hero: {
        eyebrow: "Amazon & Flipkart Growth",
        headline: "Scale marketplace revenue while driving down TACoS.",
        subhead: "Cut wasted keyword spend. We fix catalog structure, sponsored ad efficiency and brand defense.",
        microcopy: "TACoS-focused bidding. Strict catalog hygiene. Founder-led."
      },
      dynamicBrandField: {
        label: "Primary Storefront/Brand Link (Amazon/Flipkart)",
        placeholder: "amazon.in/shops/... or flipkart.com/...",
        help: ""
      },
      proofBarLabels: {
        metric1: "Marketplace GMV",
        metric2: "Average TACoS",
        metric3: "Organic Rank Lift"
      },
      problemTrio: {
        title: "Why Marketplace Revenue Plateaus",
        items: [
          {
            title: "Runaway TACoS on Broad Keywords",
            description: "Spend grows. Organic rank does not."
          },
          {
            title: "Weak PDPs & Low Buy Box Share",
            description: "Clicks arrive. Orders do not."
          },
          {
            title: "No Brand Defense",
            description: "Competitors capture your branded demand."
          }
        ]
      },
      servicesOrder: ["search-marketplace", "creative-cro", "growth-analytics", "paid-social", "retention-lifecycle"],
      calculatorMode: "acos"
    },

    d2c: {
      key: "d2c",
      name: "D2C Performance & Scale",
      ctaText: "Book Growth Diagnostic",
      ctaSubtext: "Audit of your Meta and Google funnels and unit economics.",
      hero: {
        eyebrow: "D2C Performance & Margin",
        headline: "Break through CAC plateaus on Meta, Google and Shopify.",
        subhead: "Faster creative testing, tighter media structure and landing page CRO that grow contribution margin.",
        microcopy: "Founder-led. Daily pacing checks. Margin first."
      },
      dynamicBrandField: {
        label: "Website URL & Current Monthly Ad Spend",
        placeholder: "brand.com — ₹3,00,000/month",
        help: ""
      },
      proofBarLabels: {
        metric1: "D2C Pipeline Scaled",
        metric2: "Blended MER",
        metric3: "Landing Page CVR"
      },
      problemTrio: {
        title: "Why D2C Growth Stalls",
        items: [
          {
            title: "Creative Fatigue From Static Pipelines",
            description: "Winning ads fade. Nothing replaces them."
          },
          {
            title: "Landing Page Bottlenecks",
            description: "Paid clicks stall on default themes."
          },
          {
            title: "Flawed Attribution & Cannibalization",
            description: "Channels compete for the same buyers."
          }
        ]
      },
      servicesOrder: ["paid-social", "creative-cro", "growth-analytics", "search-marketplace", "retention-lifecycle"],
      calculatorMode: "roas"
    },

    retention: {
      key: "retention",
      name: "Retention & Lifecycle Engine",
      ctaText: "Get Retention Blueprint",
      ctaSubtext: "Roadmap to turn first-time buyers into repeat customers.",
      hero: {
        eyebrow: "Retention & Lifecycle",
        headline: "Turn first-time buyers into compounding repeat revenue.",
        subhead: "WhatsApp, email and loyalty automations that lift 90-day LTV and repurchase rates.",
        microcopy: "No spam blasts. Segmented flows. Klaviyo and WhatsApp."
      },
      dynamicBrandField: {
        label: "Website URL",
        placeholder: "https://yourbrand.com",
        help: ""
      },
      proofBarLabels: {
        metric1: "Repeat Revenue Share",
        metric2: "30-Day Cohort Lift",
        metric3: "Flow Open/Click Rate"
      },
      problemTrio: {
        title: "Why Repeat Revenue Stagnates",
        items: [
          {
            title: "Discount Blasts That Burn Your List",
            description: "Heavy offers train buyers to wait."
          },
          {
            title: "Broken Post-Purchase Flows",
            description: "Second orders are lost after checkout."
          },
          {
            title: "WhatsApp Left Untapped",
            description: "A high-engagement channel sits idle."
          }
        ]
      },
      servicesOrder: ["retention-lifecycle", "growth-analytics", "creative-cro", "paid-social", "search-marketplace"],
      calculatorMode: "roas"
    }
  },

  // What We Do - 5 Master Service Blocks
  services: [
    {
      id: "paid-social",
      title: "Paid Social & Direct Response",
      shortTitle: "Paid Social",
      homeSummary: "Scalable Meta and YouTube acquisition.",
      description: "Margin-disciplined acquisition on Meta and YouTube, built to scale without inflating first-order CAC.",
      includes: [
        "Meta account structure and ASC+ orchestration",
        "Weekly creative testing sprints (hooks, formats, angles)",
        "Direct-response scripts and copywriting frameworks",
        "Granular demographic and bid capping management"
      ],
      bestFor: "D2C brands spending ₹1L–₹50L+ a month that have hit a CAC plateau.",
      weMeasure: "nCAC · First-Order AOV · Contribution Margin · MER",
      ctaText: "View scope ->"
    },
    {
      id: "search-marketplace",
      title: "Marketplace & Paid Search Media",
      shortTitle: "Marketplaces & Search",
      homeSummary: "Amazon, Flipkart and Google ads that capture intent.",
      description: "Sponsored Amazon, Flipkart and Google campaigns built to capture intent and defend brand terms.",
      includes: [
        "Amazon Sponsored Products, Brands and Display",
        "Flipkart PLA and PCA campaigns",
        "Google Search, Shopping and Performance Max",
        "Search-term clean-up and catalog audit"
      ],
      bestFor: "Brands selling on Amazon, Flipkart or Google Shopping who want lower TACoS.",
      weMeasure: "ACOS · TACoS · Share of Voice · Organic Rank",
      ctaText: "View scope ->"
    },
    {
      id: "retention-lifecycle",
      title: "Retention & Lifecycle Engineering",
      shortTitle: "Retention & Lifecycle",
      homeSummary: "WhatsApp and email flows that drive repeat orders.",
      description: "Automated WhatsApp, email and SMS flows that turn one-time buyers into repeat customers.",
      includes: [
        "WhatsApp flows: COD verification, abandoned checkout, reorder",
        "Klaviyo post-purchase, replenishment and VIP flows",
        "RFM segmentation and opt-in optimization",
        "Cohort repeat-rate and LTV analysis"
      ],
      bestFor: "Brands with steady traffic and a 90-day repeat rate under 25%.",
      weMeasure: "Repeat Rate · LTV · Flow Revenue % · WhatsApp Conversion",
      ctaText: "View scope ->"
    },
    {
      id: "creative-cro",
      title: "Creative Strategy & Conversion CRO",
      shortTitle: "Creative & CRO",
      homeSummary: "Creative and landing pages that convert clicks.",
      description: "Direct-response creative and mobile-first landing pages that turn clicks into orders.",
      includes: [
        "UGC briefs, comparison and founder-story frameworks",
        "Mobile-first landing pages, PDPs and speed fixes",
        "Checkout and COD friction audit",
        "A/B tests on offers, bundles and shipping tiers"
      ],
      bestFor: "Brands with solid traffic but on-site conversion below 2.5%.",
      weMeasure: "CVR · AOV · Mobile Bounce Rate · Checkout Initiation",
      ctaText: "View scope ->"
    },
    {
      id: "growth-analytics",
      title: "Growth Analytics & Margin Architecture",
      shortTitle: "Analytics & Economics",
      homeSummary: "One source of truth for margin and cash.",
      description: "One source of truth for cash flow, contribution margin and cohort payback across channels.",
      includes: [
        "MER and contribution margin dashboards",
        "Server-side tracking and first-party attribution",
        "SKU profitability and RTO diagnostics",
        "Weekly pacing sheets and margin reviews"
      ],
      bestFor: "Founders who need clear unit economics before spending more.",
      weMeasure: "Contribution Margin · Cash Flow · RTO Rate · Payback Period",
      ctaText: "View scope ->"
    }
  ],

  // How We Work - 4 Steps (Concise 1-line format)
  processSteps: [
    {
      number: "01",
      title: "Audit",
      description: "We review accounts, tracking and unit economics for leaks."
    },
    {
      number: "02",
      title: "Plan",
      description: "Targets for CAC, MER and margin, plus a 90-day sprint map."
    },
    {
      number: "03",
      title: "Execute",
      description: "Rebuild campaigns, launch creative, deploy pages and automations."
    },
    {
      number: "04",
      title: "Scale",
      description: "Back what wins while protecting margin and retention."
    }
  ],

  // What We Measure (6 Compact Tiles)
  metricsFramework: [
    {
      name: "Contribution Margin",
      definition: "Revenue minus COGS, shipping, fees and ad spend."
    },
    {
      name: "MER",
      definition: "Total revenue divided by total marketing spend."
    },
    {
      name: "New Customer CAC",
      definition: "Ad spend divided by new buyers only."
    },
    {
      name: "Cohort LTV",
      definition: "Gross margin per customer cohort at 60 and 90 days."
    },
    {
      name: "TACoS",
      definition: "Marketplace ad spend divided by total marketplace revenue."
    },
    {
      name: "RTO Rate",
      definition: "COD orders that fail delivery."
    }
  ],

  // About Page Copy
  about: {
    title: "About Squired Marketing",
    lead: "A specialist growth consultancy for commerce brands that value contribution margin over vanity metrics.",
    story: {
      paragraphs: [
        "We started Squired to fix a simple problem: agencies that celebrate 5x ROAS while the founder's bank balance shrinks.",
        "We are founder-led. We treat your ad budget like our own and recommend more spend only after reviewing unit economics, inventory and retention."
      ]
    },
    beliefs: [
      {
        number: "01",
        title: "Cash in the Bank Beats Platform ROAS",
        description: "We optimize contribution margin, not dashboard numbers."
      },
      {
        number: "02",
        title: "Creative Is the New Targeting",
        description: "A steady creative pipeline is a durable edge."
      },
      {
        number: "03",
        title: "First-Order Profit Is Fragile; Retention Compounds",
        description: "One-time buyers are fragile. Repeat buyers build margin."
      },
      {
        number: "04",
        title: "No Junior Handoffs",
        description: "You work directly with the founder."
      },
      {
        number: "05",
        title: "Attribution Must Be Blended and Honest",
        description: "We judge blended MER and new-customer growth, not channel credit."
      },
      {
        number: "06",
        title: "Eliminate Waste Early",
        description: "We stop what doesn't work: weak terms, tired creative, leaky pages."
      }
    ],
    founder: {
      name: "Anirban Roy",
      role: "Founder & Lead Growth Architect",
      bio: "More than five years across Shopify, Amazon, Flipkart, Meta and Google. Hands-on in daily execution, creative direction and margin modeling."
    },
    whereWeWork: {
      title: "Where We Work",
      description: "Based in Kolkata. Serving brands across India and international markets."
    }
  },

  // Contact Page Copy
  contact: {
    title: "Start a Conversation",
    lead: "Tell us about your brand and targets. We reply within 48 hours.",
    quickTabLabel: "Quick Enquiry",
    detailedTabLabel: "Detailed Brief",
    privacyLine: "We respect your privacy. No spam, and your brand metrics are never shared.",
    whatHappensNext: [
      {
        number: "01",
        title: "Store & Ad Review",
        description: "We review your storefront, catalog and ads."
      },
      {
        number: "02",
        title: "45-Minute Diagnostic Call",
        description: "We share findings and a 90-day plan."
      },
      {
        number: "03",
        title: "Scope Proposal",
        description: "If it is a fit, you get a clear scope with targets."
      }
    ],
    directDetails: {
      title: "Contact",
      email: "anirban@squiredmarketing.com",
      phone: "+91 98365 78989",
      headquarters: "Kolkata, India",
      hours: "Mon–Fri, 10 AM–7 PM IST"
    }
  },

  // FAQ Accordion (4 Items)
  faq: [
    {
      question: "How is Squired different from traditional agencies?",
      answer: "You work directly with the founder, not junior account managers. We optimize for contribution margin and blended MER, not platform-reported ROAS."
    },
    {
      question: "What monthly ad spend do you work with?",
      answer: "Typically ₹1,00,000+ a month (about $3,000 internationally), or brands with proven product-market fit preparing to scale."
    },
    {
      question: "Do you manage D2C and marketplaces together?",
      answer: "Yes. We coordinate search, social and marketplace campaigns to prevent cannibalization and protect blended profit."
    },
    {
      question: "How do contracts work?",
      answer: "A focused 90-day initial engagement, then a rolling 30-day notice period."
    }
  ]
};

// Export for browser environment
if (typeof window !== "undefined") {
  window.SQUIRED_CONFIG = CONFIG;
}
