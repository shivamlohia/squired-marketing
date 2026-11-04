# Squired Marketing — Official Website

> **Brand Name:** Squired Marketing *(never "Squared")*  
> **Brand Colors:** Navy `#100558` (Primary, Text, Dark sections), Orange `#E56315` (Accents, CTAs, Numerals, Highlights), White `#FFFFFF`, Light Navy Tints (`#F5F6FC`).  
> **Contrast Ratio:** 5.2:1 (Orange fill with navy text, WCAG AA compliant). Orange is never used for small text on white.

---

## 1. Project Overview

Production website for **Squired Marketing**, built strictly to specification:
- **4 Pages:** [Home (`index.html`)](index.html), [Services (`services.html`)](services.html), [About (`about.html`)](about.html), [Contact (`contact.html`)](contact.html).
- **Single Source of Truth:** All copy, variants, FAQ items, service details, and form labels live in [`js/config.js`](js/config.js). Pages render dynamically from this config.
- **Zero-Flicker Dynamic Engine:** Synchronous inline `<head>` script resolves variants before first paint, eliminating layout shifts and visual flicker.
- **Message Match:** The primary CTA text is identical everywhere on the site for a given active variant.
- **Zero Heavy Dependencies:** Built with semantic HTML5, modern CSS, and vanilla JS for an ultra-fast LCP (< 1.5s) and 95+ mobile Lighthouse performance.
- **Deploy Ready:** Seamless deployment on **Vercel**, **Netlify**, or **Cloudflare Pages**.

---

## 2. Directory Structure

```text
├── index.html           # Home page (Hero, Trust strip, Proof bar, Why growth stalls, What we do, How we work, Calculator, Founder, FAQ, Final CTA)
├── services.html        # Services page (5 variant-ordered execution blocks, includes scope, ideal profile, key economics, closing band)
├── about.html           # About page (Title & lead, story, 6 core beliefs with large numerals, senior team, Kolkata HQ, CTA)
├── contact.html         # Contact page (Toggle tabs: Quick enquiry / Detailed 3-step brief, What happens next, Direct details)
├── js/
│   ├── config.js        # MASTER CONFIG: All copy, variants, FAQ items, tokens, and calculator parameters
│   ├── engine.js        # Dynamic variant resolver, UTM persistence, Geo detection, and DOM binding
│   └── components.js    # Interactive calculator, FAQ accordion, multi-step brief, quick form, and JSON-LD injection
├── css/
│   └── main.css         # Complete design system, typography, 5.2:1 contrast buttons, responsive grid, mobile bottom sticky CTA
├── assets/
│   ├── logo.svg         # Crisp Squired Marketing SVG logo mark
│   └── favicon.svg      # Squired favicon in brand navy and orange
├── vercel.json          # Vercel deployment configuration
├── netlify.toml         # Netlify deployment configuration
├── package.json         # Local development scripts
└── README.md            # Documentation and testing guide
```

---

## 3. Dynamic Engine & Variant Resolution

Variants are resolved synchronously in the `<head>` of every page before first paint:

### Resolution Priority Order:
1. `utm_campaign = marketplace | d2c | retention`
2. `utm_term` keywords:
   - `amazon`, `flipkart`, `acos`, `tacos`, `listing`, `marketplace` &rarr; `marketplace`
   - `shopify`, `meta`, `facebook`, `roas`, `cpa`, `creative` &rarr; `d2c`
   - `whatsapp`, `email flow`, `repeat`, `retention` &rarr; `retention`
3. Stored session variant in `sessionStorage`
4. Default fallback: `default` (Base copy)

### Dynamic Variations:
| Variant | CTA Text Everywhere | Hero Focus | Dynamic Brand Field | Calculator Mode |
| :--- | :--- | :--- | :--- | :--- |
| **`default`** | "Book a Growth Audit" | Profitable scaling for modern commerce brands | Brand link or store URL | ROAS |
| **`marketplace`** | "Request Marketplace Audit" | Scale marketplace revenue while driving down TACoS | Primary Storefront/Brand Link (Amazon/Flipkart) | TACoS / ACOS |
| **`d2c`** | "Book Growth Diagnostic" | Break through CAC plateaus on Meta, Google and Shopify | Website URL & Current Monthly Ad Spend | ROAS |
| **`retention`** | "Get Retention Blueprint" | Turn first-time buyers into compounding repeat revenue | Website URL | ROAS |

### Core Mechanism Visual:
- Driven by `utm_source`:
  - `meta`, `facebook`, `instagram`, `tiktok` &rarr; Ad-creative and UGC thumbnail mockups.
  - `google`, `bing`, `amazon`, `flipkart`, `other` &rarr; Bid optimization & ROI tracking dashboard mockup.
- Decorative only (`aria-hidden="true"`).

### Geo Adaptation:
- Reads `cf-ipcountry` / `x-vercel-ip-country`.
- **India (Default):** Currency in INR (`₹`), Lakh/Crore grouping (e.g. `₹1,00,000`), Flipkart and Indian marketplace references enabled.
- **International:** Currency in USD (`$`), standard grouping (e.g. `$5,000`), platform strip "Shopify · Meta · Google · Amazon", no Flipkart/regional references.

---

## 4. Test URLs

To test variants and dynamic behavior locally or in production:

1. **Marketplace Variant:**
   ```text
   http://localhost:3000/?utm_campaign=marketplace
   ```
2. **D2C Variant + Meta Ad Visual:**
   ```text
   http://localhost:3000/?utm_campaign=d2c&utm_source=meta
   ```
3. **Retention Variant:**
   ```text
   http://localhost:3000/?utm_campaign=retention
   ```
4. **Keyword Keyword Search (TACoS/ACOS):**
   ```text
   http://localhost:3000/?utm_term=acos+tacos
   ```
5. **D2C Creative Search:**
   ```text
   http://localhost:3000/?utm_term=shopify+roas+creative
   ```

---

## 5. Editing Copy & Verified Proof Tokens

All copy is in [`js/config.js`](js/config.js).

### Supplying Proof Bar Metrics:
In [`js/config.js`](js/config.js), fill the `tokens` object:
```javascript
tokens: {
  VERIFIED_METRIC_1: "₹14.2 Cr",
  VERIFIED_METRIC_1_LABEL: "Blended GMV Scaled",
  VERIFIED_METRIC_1_DATES: "Trailing 12 Months",
  // ...
}
```
*Note: Any token that is empty (`""`) automatically hides the proof bar and related elements.*

---

## 6. Local Development

To run locally:

```bash
# Option A: With npm
npm start

# Option B: With any static server (Python)
python -m http.server 3000

# Option C: With Node npx
npx serve . -l 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Deployment

### Vercel:
```bash
npx vercel deploy --prod
```
Or import the repository directly into the Vercel dashboard. `vercel.json` is preconfigured.

### Netlify:
```bash
npx netlify deploy --prod --dir=.
```
Or connect the repository in Netlify. `netlify.toml` is preconfigured.

### Cloudflare Pages:
1. Create a Cloudflare Pages project.
2. Select repository, set **Build command** to empty (static), and **Build output directory** to `.`.

---

## 8. Form Endpoint Configuration

Forms dispatch submissions to `CONFIG.formEndpoint` in [`js/config.js`](js/config.js):
```javascript
formEndpoint: "https://your-api-endpoint.com/enquiry"
```
Submissions include:
- Client Name & Contact (Email or WhatsApp)
- Brand / Store URL
- Full UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`)
- Active variant (`marketplace`, `d2c`, `retention`, `default`)
- Referrer & timestamp
- Client-side validation, honeypot spam protection, and inline success states showing the 3 next steps.
