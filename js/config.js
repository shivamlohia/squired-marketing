/**
 * Squired Marketing - Master Configuration File
 * Brand Name: Squired Marketing (never "Squared")
 *
 * ALL copy, variants, FAQ items, form labels, calculator settings,
 * and company details are defined here. Pages render dynamically from this config.
 */

const CONFIG = {
  // Brand & Company Details
  brand: {
    name: "Squired Marketing",
    tagline: "Performance & Retention Growth Partner for Modern Brands",
    founded: "Kolkata, India",
    email: "growth@squiredmarketing.com",
    phone: "+91 98300 00000",
    location: "Kolkata, West Bengal, India",
    copyrightYear: 2026,
    socials: {
      linkedin: "https://linkedin.com/company/squired-marketing",
      twitter: "https://x.com/squiredmktg"
    }
  },

  // Form endpoint (Overridden by environment or config)
  formEndpoint: "/api/enquiry", // can point to Formspree, custom backend, or webhook

  // Calculator Configuration
  calculator: {
    improvementPct: 10, // Default 10% conservative improvement as specified
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
      defaultAcos: 33.3 // For marketplace mode: ROAS = 1 / (ACOS / 100)
    },
    note: "Illustrative estimate based on a conservative 10% efficiency gain on spend efficiency and contribution margin. Squired validates full economics during the diagnostic audit."
  },

  // Token values (Empty tokens automatically hide their container elements)
  tokens: {
    VERIFIED_METRIC_1: "", // e.g. "₹14.2 Cr"
    VERIFIED_METRIC_1_LABEL: "", // e.g. "Blended GMV Scaled"
    VERIFIED_METRIC_1_DATES: "", // e.g. "Q1 2025 - Q4 2025"

    VERIFIED_METRIC_2: "", // e.g. "4.1x"
    VERIFIED_METRIC_2_LABEL: "", // e.g. "Blended ROAS Sustained"
    VERIFIED_METRIC_2_DATES: "", // e.g. "Trailing 12 Months"

    VERIFIED_METRIC_3: "", // e.g. "38%"
    VERIFIED_METRIC_3_LABEL: "", // e.g. "Repeat Purchase Rate"
    VERIFIED_METRIC_3_DATES: "", // e.g. "90-Day Cohort"
  },

  // Verified Case Studies (Module remains hidden if array is empty)
  caseStudies: [
    /* Example structure when verified data is supplied:
    {
      id: "cs-1",
      category: "home-lifestyle",
      clientCategory: "Home & Kitchen Living",
      platforms: ["Shopify", "Meta", "Google Ads"],
      challenge: "Plateaued at ₹25L/month spend with rising CPA and sub-1.8x first-order ROAS.",
      metrics: [
        { label: "Revenue Scale", value: "+184%", dates: "6-Month Diagnostic" },
        { label: "Contribution Margin", value: "+32%", dates: "Net After Returns" },
        { label: "Blended MER", value: "3.4x", dates: "Sustained Peak Season" }
      ],
      linkText: "Request breakdown"
    }
    */
  ],

  // Platform Trust Strip
  trustPlatforms: {
    india: [
      { name: "Shopify Plus", type: "Commerce Engine" },
      { name: "Meta Ads", type: "Direct Response" },
      { name: "Google Performance Max", type: "Intent Capture" },
      { name: "Amazon Advertising", type: "Marketplace Scale" },
      { name: "Flipkart Ads", type: "Retail Media" },
      { name: "WhatsApp Business API", type: "Retention Flows" }
    ],
    international: [
      { name: "Shopify Plus", type: "Commerce Engine" },
      { name: "Meta Ads", type: "Direct Response" },
      { name: "Google Ads", type: "Search & Shopping" },
      { name: "Amazon Advertising", type: "Sponsored Ads" },
      { name: "Klaviyo", type: "Retention & SMS" }
    ]
  },

  // VARIANTS: default, marketplace, d2c, retention
  variants: {
    default: {
      key: "default",
      name: "Squired Growth Partner",
      ctaText: "Book a Growth Audit",
      ctaSubtext: "Free 45-minute teardown of your paid media & margin leaks",
      hero: {
        eyebrow: "Specialist Performance & Margin Partner",
        headline: "Profitable scaling for modern commerce brands.",
        subhead: "We combine aggressive media buying, creative science, and retention engineering to build sustainable contribution margin — not just vanity top-line GMV.",
        microcopy: "Zero junior account reps. Transparent live sheets. 48-hour response SLA."
      },
      dynamicBrandField: {
        label: "Brand link or store URL",
        placeholder: "yourbrand.com or store link",
        help: "Where can our analysts review your current storefront?"
      },
      proofBarLabels: {
        metric1: "Capital Managed",
        metric2: "Blended Return",
        metric3: "Retention Lift"
      },
      problemTrio: {
        title: "Why Commerce Growth Stalls",
        subtitle: "Scaling ad spend without fixing unit economics breaks the business. Here is what we diagnose first:",
        items: [
          {
            title: "CPA Escalation & Creative Exhaustion",
            description: "Ad networks exhaust audience pools in 7-14 days. Without a systematic creative production engine, customer acquisition costs rise faster than gross margin.",
            metric: "Rising CAC"
          },
          {
            title: "Channel Silos & Blind ROAS Reporting",
            description: "Meta claims the sale, Google takes credit, and marketplaces cannibalize direct traffic. In-platform ROAS looks strong while cash in the bank shrinks.",
            metric: "Margin Erosion"
          },
          {
            title: "First-Order Bleed With Zero Retention",
            description: "Paying high acquisition costs for one-time buyers is unsustainable. Without automated retention funnels, repeat revenue fails to subsidize new customer growth.",
            metric: "Depressed LTV"
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
      ctaSubtext: "Detailed Amazon & Flipkart advertising teardown and TACoS review",
      hero: {
        eyebrow: "Amazon & Flipkart Growth Specialists",
        headline: "Scale marketplace revenue while driving down TACoS.",
        subhead: "Stop burning ad budgets on broad keyword waste. We engineer high-converting catalog architecture, Sponsored Ads efficiency, and brand defense across major marketplaces.",
        microcopy: "Direct marketplace API integration. TACoS-focused bidding. Strict catalog hygiene."
      },
      dynamicBrandField: {
        label: "Primary Storefront/Brand Link (Amazon/Flipkart)",
        placeholder: "amazon.in/shops/... or flipkart.com/...",
        help: "Provide your brand store or top ASIN/FSN listings for catalog review."
      },
      proofBarLabels: {
        metric1: "Marketplace GMV",
        metric2: "Average TACoS",
        metric3: "Organic Rank Lift"
      },
      problemTrio: {
        title: "Why Marketplace Revenue Plateaus",
        subtitle: "Marketplace algorithms punish inefficient advertising and weak listings. The three biggest margin leaks:",
        items: [
          {
            title: "Runaway TACoS on Broad Keywords",
            description: "Over-bidding on high-volume search terms without negative keyword pruning inflates ad spend while cannibalizing organic sales velocity.",
            metric: "High TACoS"
          },
          {
            title: "Unoptimized PDPs & Low Buy Box Share",
            description: "Driving paid traffic to listings with poor A+ content, weak secondary imagery, or stockouts destroys conversion rates and algorithm ranking.",
            metric: "Sub-par CVR"
          },
          {
            title: "Zero Brand Defense Against Competitors",
            description: "Competitors conquer your brand search terms on the search results page, stealing your highest-intent buyers right before checkout.",
            metric: "Leaked Demand"
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
      ctaSubtext: "Full audit of your Meta/Google funnels, creative velocity & unit economics",
      hero: {
        eyebrow: "D2C Performance & Margin Architecture",
        headline: "Break through CAC plateaus on Meta, Google and Shopify.",
        subhead: "We engineer high-velocity creative testing, ruthless media buying structures, and landing page CRO that expand contribution margin at scale.",
        microcopy: "Founder-led account oversight. Daily pacing monitors. Contribution margin focus."
      },
      dynamicBrandField: {
        label: "Website URL & Current Monthly Ad Spend",
        placeholder: "brand.com — ₹3,00,000/month",
        help: "Include your Shopify store URL and approximate monthly paid ad budget."
      },
      proofBarLabels: {
        metric1: "D2C Pipeline Scaled",
        metric2: "Blended MER",
        metric3: "Landing Page CVR"
      },
      problemTrio: {
        title: "Why D2C Growth Stalls",
        subtitle: "Paid social is no longer set-and-forget. When customer acquisition costs spiral, here is what breaks first:",
        items: [
          {
            title: "Ad Fatigue from Static Creative Pipelines",
            description: "Running 3-4 hero ads until performance collapses. Without a structured weekly pipeline of UGC, hooks, and angles, Meta CAC inevitably spikes.",
            metric: "Creative Burnout"
          },
          {
            title: "Landing Page Bottlenecks on Default Themes",
            description: "Dumping paid mobile traffic onto generic product detail pages with slow load times, buried reviews, and non-optimized checkout flows.",
            metric: "Sub-2% CVR"
          },
          {
            title: "Flawed Attribution & Channel Cannibalization",
            description: "Relying on in-platform 7-day click attribution while contribution margin shrinks. You need blended MER tracking to evaluate actual net cash generated.",
            metric: "Misaligned Spend"
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
      ctaSubtext: "Actionable roadmap to turn single-order buyers into high-LTV advocates",
      hero: {
        eyebrow: "Retention, WhatsApp & Lifecycle Architecture",
        headline: "Turn first-time buyers into compounding repeat revenue.",
        subhead: "Stop letting acquisition costs swallow your gross margin. We build hyper-segmented WhatsApp, email, and loyalty automations that increase 90-day LTV and cohort repurchase rates.",
        microcopy: "Zero spam broadcast policies. Dynamic segmentation. Direct Klaviyo & WhatsApp API."
      },
      dynamicBrandField: {
        label: "Website URL",
        placeholder: "https://yourbrand.com",
        help: "Enter your brand's storefront so we can evaluate your opt-in & post-purchase touchpoints."
      },
      proofBarLabels: {
        metric1: "Repeat Revenue Share",
        metric2: "30-Day Cohort Lift",
        metric3: "Flow Open/Click Rate"
      },
      problemTrio: {
        title: "Why Repeat Revenue Stagnates",
        subtitle: "Most ecommerce brands treat email and WhatsApp as periodic discount blast channels. The three critical retention failures:",
        items: [
          {
            title: "Generic Discount Blasts That Burn Your List",
            description: "Blasting your entire subscriber base with price cuts trains customers to never pay full price and accelerates unsubscribe rates.",
            metric: "List Degradation"
          },
          {
            title: "Broken Post-Purchase Lifecycle Flows",
            description: "Sending a single generic order confirmation with zero post-purchase education, unboxing guidance, or replenishment reminders when repurchase intent is highest.",
            metric: "Lost Repurchase"
          },
          {
            title: "Ignoring High-Converting WhatsApp Sequences",
            description: "Failing to implement automated WhatsApp flows for COD confirmation, shipping milestones, and personalized reorder triggers with 90%+ open rates.",
            metric: "Untapped Channel"
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
      description: "Aggressive, margin-disciplined customer acquisition across Meta (Instagram & Facebook), TikTok, and YouTube. We build modular campaign architectures that allow algorithms to scale efficiently while controlling first-order customer acquisition costs.",
      includes: [
        "Full-funnel Meta Ads account structure & ASC+ orchestration",
        "Weekly creative testing sprints (hooks, formats, angles)",
        "Granular demographic & interest breakout auditing",
        "Real-time bid capping & dayparting management",
        "Direct response copywriting and script guidelines"
      ],
      bestFor: "D2C brands spending ₹1L to ₹50L+ monthly looking to break past CAC plateaus without sacrificing contribution margin.",
      weMeasure: "New Customer Acquisition Cost (nCAC), First-Order AOV, Contribution Margin, Blended Marketing Efficiency Ratio (MER).",
      ctaText: "Explore Paid Social"
    },
    {
      id: "search-marketplace",
      title: "Marketplace & Paid Search Media",
      shortTitle: "Marketplaces & Search",
      description: "Dominate high-intent search queries where purchase decisions happen. We engineer comprehensive Sponsored Ads across Amazon, Flipkart, and Google Performance Max, defending your brand turf and capturing market share from competitors.",
      includes: [
        "Amazon Sponsored Products, Brands & Display advertising",
        "Flipkart PLA (Product Listing Ads) & PCA campaign management",
        "Google Search, Shopping & Performance Max optimization",
        "Ruthless negative keyword harvesting and search-term harvesting",
        "Catalog listing audit, bullet hygiene, and A+ content alignment"
      ],
      bestFor: "Brands selling on Amazon, Flipkart, or Google Shopping needing to scale sales velocity while driving down TACoS.",
      weMeasure: "Advertising Cost of Sales (ACOS), Total Advertising Cost of Sales (TACoS), Share of Voice (SOV), Organic Keyword Rank.",
      ctaText: "Explore Marketplace Growth"
    },
    {
      id: "retention-lifecycle",
      title: "Retention & Lifecycle Engineering",
      shortTitle: "Retention & Lifecycle",
      description: "Convert costly one-time buyers into high-LTV repeat customers. We design automated, behavior-triggered messaging across WhatsApp Business API, Klaviyo email, and SMS that drive predictable second and third purchases.",
      includes: [
        "Automated WhatsApp Flows (COD verification, abandon checkout, reorder)",
        "Klaviyo post-purchase lifecycle, replenishment & VIP nurture flows",
        "RFM (Recency, Frequency, Monetary) dynamic audience segmentation",
        "Zero-party data capture quizzes and opt-in rate optimization",
        "Cohort repeat purchase rate and LTV analysis"
      ],
      bestFor: "Commerce brands with healthy top-of-funnel traffic where 30-day and 90-day repeat purchase rates remain under 25%.",
      weMeasure: "30/60/90-Day Cohort Repurchase Rate, Customer Lifetime Value (LTV), Flow Revenue %, WhatsApp Open & Conversion Rate.",
      ctaText: "Explore Retention Systems"
    },
    {
      id: "creative-cro",
      title: "Creative Strategy & Conversion CRO",
      shortTitle: "Creative & CRO",
      description: "Traffic is only as profitable as the creative that stops the scroll and the landing page that converts the click. We develop high-converting direct-response creative frameworks and build dedicated mobile-first PDPs that multiply on-site conversion rates.",
      includes: [
        "Direct-response visual frameworks (UGC briefs, comparison charts, founder story)",
        "Mobile-first landing page design and headless lander builds",
        "Friction audit: checkout flow, trust signals, payment gateways, and COD verification",
        "Iterative A/B testing: offer structures, bundles, and threshold shipping tiers",
        "Speed optimization: Core Web Vitals, asset compression, under-2s load"
      ],
      bestFor: "Brands driving solid traffic with on-site conversion rates lagging below 2.5% or suffering from high mobile bounce rates.",
      weMeasure: "On-site Conversion Rate (CVR), Average Order Value (AOV), Mobile Bounce Rate, Scroll Depth & Checkout Initiation Rate.",
      ctaText: "Explore Creative & CRO"
    },
    {
      id: "growth-analytics",
      title: "Growth Analytics & Margin Architecture",
      shortTitle: "Analytics & Economics",
      description: "Eliminate attribution blindness and channel squabbling. We set up single-source-of-truth reporting that tracks real cash in the bank, contribution margin after COGS and shipping, and customer cohort payback periods.",
      includes: [
        "Blended MER & Contribution Margin dashboard setup",
        "Server-side tracking (Meta CAPI, Google Server-side GTM, Stape)",
        "First-party attribution auditing and post-purchase surveys",
        "SKU-level profitability and return/RTO rate diagnostics",
        "Weekly executive pacing sheets and margin-defense meetings"
      ],
      bestFor: "Founders and marketing leaders tired of conflicting channel dashboards who require clear unit economics before deploying more capital.",
      weMeasure: "Net Contribution Margin, Cash Flow Velocity, Return-to-Origin (RTO) Rate, First-Order Payback Period.",
      ctaText: "Explore Growth Analytics"
    }
  ],

  // How We Work - 4 Numbered Steps
  processSteps: [
    {
      number: "01",
      title: "Deep-Dive Diagnostic & Margin Audit",
      description: "We audit your ad accounts, creative archives, analytics tracking, and unit economics. We identify where capital is leaking, which SKUs actually make money, and uncover immediate low-hanging scale opportunities."
    },
    {
      number: "02",
      title: "Growth Blueprint & Target Unit Economics",
      description: "We define clear targets for CAC, MER, and contribution margin. No vague vanity metrics. We construct a 90-day execution roadmap covering creative production, channel budget allocations, and retention workflows."
    },
    {
      number: "03",
      title: "Sprint Execution & High-Velocity Testing",
      description: "We rebuild campaign structures, launch new creative angles, deploy conversion landers, and activate automated lifecycle flows. We operate in weekly test-and-learn sprints with rigorous statistical discipline."
    },
    {
      number: "04",
      title: "Scale, Defend & Compounding Margin",
      description: "As winning creatives and efficient search structures emerge, we methodically allocate capital to scale volume while aggressively defending blended contribution margin and cohort retention."
    }
  ],

  // What We Measure (Consulting Metrics Framework)
  metricsFramework: [
    {
      name: "Contribution Margin (CM)",
      definition: "Net revenue minus COGS, shipping, payment gateway fees, and ad spend. Our primary compass for true business viability."
    },
    {
      name: "Marketing Efficiency Ratio (MER)",
      definition: "Total top-line revenue divided by total marketing spend. Eliminates cross-channel attribution double-counting."
    },
    {
      name: "New Customer CAC (nCAC)",
      definition: "Total paid ad spend divided strictly by new, non-repeat buyers. Ensures acquisition isn't secretly relying on existing customers."
    },
    {
      name: "60-Day & 90-Day Cohort LTV",
      definition: "Cumulative gross margin generated by a customer cohort over time. Dictates how aggressively we can bid upfront."
    },
    {
      name: "Total ACOS / TACoS",
      definition: "Total ad spend on marketplaces divided by total marketplace revenue. The truest indicator of organic momentum."
    },
    {
      name: "Return-To-Origin (RTO) Rate",
      definition: "Percentage of shipped COD orders that fail delivery. Monitored closely to protect cash flow and fulfillment overhead."
    }
  ],

  // About Page Copy
  about: {
    title: "About Squired Marketing",
    lead: "A specialist growth consultancy built for modern commerce brands that value contribution margin over empty vanity metrics.",
    story: {
      paragraphs: [
        "Squired Marketing was founded to fix a fundamental flaw in the modern agency model: agencies that celebrate 5x ROAS in screenshots while the founder's bank balance quietly shrinks.",
        "Most growth agencies operate on churn-and-burn. They assign junior account managers to manage templates, blast generic ad creatives, and take credit for organic sales when the algorithms do the heavy lifting.",
        "We built Squired as a high-conviction, senior-led growth partner. We treat every rupee or dollar of your ad budget as if it were drawn from our own operating accounts. We analyze unit economics, contribution margins, inventory turn rates, and post-purchase retention before recommending budget increases.",
        "Headquartered in Kolkata, we partner with ambitious D2C brands, marketplace sellers, and consumer enterprises across India and global markets."
      ]
    },
    beliefs: [
      {
        number: "01",
        title: "Cash in the Bank Beats In-Platform ROAS",
        description: "Ad platform dashboards are designed to encourage more ad spend. We optimize for Contribution Margin and net bank deposits, never platform-reported vanity numbers."
      },
      {
        number: "02",
        title: "Creative is the New Targeting",
        description: "In the era of automated algorithmic delivery, ad creative does the targeting. A systematic, high-velocity creative production pipeline is your only durable moat."
      },
      {
        number: "03",
        title: "First-Order Profit is Fragile; Retention is Compounding",
        description: "Customer acquisition gets you in the game; retention is how you win. We build automated WhatsApp and email systems that transform one-off buyers into long-term gross margin."
      },
      {
        number: "04",
        title: "No Junior Account Handoffs",
        description: "You partner directly with senior operators who understand full-funnel economics, supply chains, and consumer psychology. No layer of intermediary account managers."
      },
      {
        number: "05",
        title: "Attribution Must Be Blended and Honest",
        description: "We don't argue over whether Google or Meta deserves credit for an order. We evaluate blended MER and new customer acquisition velocity as one unified commercial machine."
      },
      {
        number: "06",
        title: "Ruthless Elimination of Waste",
        description: "We cut non-performing search terms, fatigued ad creatives, and leaky landing pages without hesitation. Efficiency comes from stopping what does not work."
      }
    ],
    founder: {
      name: "Senior Leadership Team",
      role: "Growth Architects & Performance Directors",
      bio: "Squired Marketing is led by hands-on growth operators with over a decade of combined experience deploying millions in profitable ad spend across Shopify, Amazon, Flipkart, Meta, and Google. We remain deeply embedded in daily account execution, creative direction, and margin modeling.",
      location: "Operating from Kolkata, West Bengal with a global reach."
    },
    whereWeWork: {
      title: "Where We Work",
      description: "Based in Kolkata, West Bengal, India. We serve D2C brands, marketplace merchants, and omnichannel retail brands across Mumbai, Delhi NCR, Bengaluru, Kolkata, and international commerce hubs across North America, the UK, and Southeast Asia.",
      address: "Squired Marketing, Sector V, Salt Lake, Kolkata, West Bengal 700091, India"
    }
  },

  // Contact Page Copy
  contact: {
    title: "Start a Conversation",
    lead: "Tell us about your brand, current bottlenecks, and growth targets. We will review your storefront and respond with actionable initial thoughts within 48 hours.",
    quickTabLabel: "Quick Enquiry",
    detailedTabLabel: "Detailed Growth Brief",
    privacyLine: "We respect your privacy. No spam, no sales harassment, and zero sharing of your brand metrics.",
    whatHappensNext: [
      {
        number: "01",
        title: "Initial Storefront & Media Audit",
        description: "Within 24 hours, our senior growth lead inspects your public storefront, catalog structure, ad creative library, and public listings."
      },
      {
        number: "02",
        title: "45-Minute Growth Diagnostic Call",
        description: "We walk you through our findings, point out immediate margin leaks or wasted spend, and discuss our 90-day scaling hypothesis."
      },
      {
        number: "03",
        title: "Tailored Scope & Margin Target Proposal",
        description: "If there is a strong mutual fit, we share a transparent scope of work with defined unit economics and operational SLAs."
      }
    ],
    directDetails: {
      title: "Direct Contact",
      email: "growth@squiredmarketing.com",
      phone: "+91 98300 00000",
      headquarters: "Kolkata, West Bengal, India",
      hours: "Monday to Friday: 10:00 AM – 7:00 PM IST"
    }
  },

  // FAQ Accordion (Home & General)
  faq: [
    {
      question: "How is Squired Marketing different from traditional marketing agencies?",
      answer: "Most traditional agencies charge a percentage of spend and pass your account to junior trainees who prioritize vanity metrics like clicks and platform-reported ROAS. At Squired, senior operators manage your brand directly. We focus strictly on Contribution Margin (cash left after ad spend, COGS, and shipping), blended MER, and creative velocity."
    },
    {
      question: "What monthly ad spend is required to work with Squired?",
      answer: "We typically partner with brands spending at least ₹1,00,000 / month (or $3,000 / month internationally) across paid media, or brands with verified product-market fit preparing for rapid scale. This ensures sufficient data density for rapid creative testing and statistical significance."
    },
    {
      question: "Do you manage both D2C (Shopify) and Marketplaces (Amazon/Flipkart)?",
      answer: "Yes. In fact, running D2C and marketplaces together is one of our greatest strategic advantages. We coordinate paid search and social campaigns to prevent cross-channel cannibalization, defend your brand terms, and maximize total blended profitability."
    },
    {
      question: "How do your contracts and engagement terms work?",
      answer: "We begin with a focused 90-day initial engagement. This provides enough runway to conduct the audit, overhaul campaign architecture, deploy creative testing sprints, and demonstrate measurable impact on your unit economics. After 90 days, we operate on a flexible rolling 30-day notice period."
    },
    {
      question: "Who produces the ad creatives and video assets?",
      answer: "We provide comprehensive creative direction, direct-response scripts, hook variations, and graphic design frameworks. For UGC and product filming, we either work with your in-house creator network or coordinate with vetted direct-response creators, handling all brief-writing and post-production editing."
    },
    {
      question: "How quickly can we launch after signing?",
      answer: "Our diagnostic and onboarding sprint takes 7 business days. During this period, we audit your tracking (CAPI, server-side events), build out the initial 30-day creative roadmaps, and stage new campaign structures for your review before going live."
    }
  ]
};

// Export for browser environment
if (typeof window !== "undefined") {
  window.SQUIRED_CONFIG = CONFIG;
}
