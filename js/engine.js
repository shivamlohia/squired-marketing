/**
 * Squired Marketing - Dynamic Variant Engine & Resolution
 * 
 * Handles zero-flicker variant resolution, UTM persistence, Geo detection,
 * DOM data binding, and message matching across all pages.
 */

(function () {
  'use strict';

  // 1. Core Variant Resolver Logic
  function resolveVariant() {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignParam = (urlParams.get('utm_campaign') || '').toLowerCase().trim();
    const termParam = (urlParams.get('utm_term') || '').toLowerCase().trim();
    const sourceParam = (urlParams.get('utm_source') || '').toLowerCase().trim();
    const contentParam = (urlParams.get('utm_content') || '').toLowerCase().trim();

    // Check if query params explicitly dictate variant
    let detectedVariant = null;

    // Rule 1: utm_campaign = marketplace | d2c | retention
    if (campaignParam === 'marketplace') detectedVariant = 'marketplace';
    else if (campaignParam === 'd2c') detectedVariant = 'd2c';
    else if (campaignParam === 'retention') detectedVariant = 'retention';

    // Rule 2: utm_term keywords
    if (!detectedVariant && termParam) {
      const marketplaceKeywords = ['amazon', 'flipkart', 'acos', 'tacos', 'listing', 'marketplace'];
      const d2cKeywords = ['shopify', 'meta', 'facebook', 'roas', 'cpa', 'creative'];
      const retentionKeywords = ['whatsapp', 'email flow', 'repeat', 'retention'];

      if (marketplaceKeywords.some(k => termParam.includes(k))) {
        detectedVariant = 'marketplace';
      } else if (d2cKeywords.some(k => termParam.includes(k))) {
        detectedVariant = 'd2c';
      } else if (retentionKeywords.some(k => termParam.includes(k))) {
        detectedVariant = 'retention';
      }
    }

    // Rule 3: Session persistence fallback
    if (!detectedVariant) {
      const storedVariant = sessionStorage.getItem('squired_variant');
      if (storedVariant && ['default', 'marketplace', 'd2c', 'retention'].includes(storedVariant)) {
        detectedVariant = storedVariant;
      }
    }

    // Rule 4: Default
    if (!detectedVariant) {
      detectedVariant = 'default';
    }

    // Persist in sessionStorage
    try {
      sessionStorage.setItem('squired_variant', detectedVariant);
      if (campaignParam) sessionStorage.setItem('squired_utm_campaign', campaignParam);
      if (termParam) sessionStorage.setItem('squired_utm_term', termParam);
      if (sourceParam) sessionStorage.setItem('squired_utm_source', sourceParam);
      if (contentParam) sessionStorage.setItem('squired_utm_content', contentParam);
      
      // Store all UTMs
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        const val = urlParams.get(param);
        if (val) sessionStorage.setItem('squired_' + param, val);
      });
    } catch (e) {
      console.warn('Storage access restricted', e);
    }

    return detectedVariant;
  }

  // 2. Resolve Source for Mechanism Visual
  function resolveSource() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = (urlParams.get('utm_source') || sessionStorage.getItem('squired_utm_source') || '').toLowerCase().trim();
    
    // creative / UGC sources vs dashboard / search sources
    const creativeSources = ['meta', 'facebook', 'instagram', 'tiktok'];
    if (creativeSources.includes(source)) {
      return 'creative';
    }
    return 'dashboard'; // google, bing, amazon, flipkart, or other
  }

  // 3. Geo Detection (Host headers or client check)
  function resolveGeo() {
    // Check if host injected country code in meta or dataset
    const metaCountry = document.querySelector('meta[name="geo-country"]')?.getAttribute('content');
    const headerCountry = window.__SQUIRED_COUNTRY__ || metaCountry;

    if (headerCountry && headerCountry.toUpperCase() !== 'IN') {
      return 'international';
    }
    return 'india'; // Default
  }

  // Synchronous initialization before DOM paint
  const activeVariant = resolveVariant();
  const activeSource = resolveSource();
  const activeGeo = resolveGeo();

  document.documentElement.setAttribute('data-variant', activeVariant);
  document.documentElement.setAttribute('data-source', activeSource);
  document.documentElement.setAttribute('data-geo', activeGeo);

  // Expose engine API globally
  window.SquiredEngine = {
    getVariant: () => activeVariant,
    getSource: () => activeSource,
    getGeo: () => activeGeo,
    getUtm: (key) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(key) || sessionStorage.getItem('squired_' + key) || '';
    },
    getAllUtms: () => {
      const urlParams = new URLSearchParams(window.location.search);
      const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      const result = {};
      keys.forEach(k => {
        result[k] = urlParams.get(k) || sessionStorage.getItem('squired_' + k) || '';
      });
      return result;
    },
    formatCurrency: (amount, geo = activeGeo) => {
      if (geo === 'international') {
        return '$' + Math.round(amount).toLocaleString('en-US');
      }
      // Indian numbering format (Lakhs / Crores)
      const val = Math.round(amount);
      return '₹' + val.toLocaleString('en-IN');
    },
    applyConfig: () => {
      if (!window.SQUIRED_CONFIG) return;
      applyVariantCopy(activeVariant, activeGeo);
      handleTokenVisibility();
    }
  };

  // Helper to format Indian / standard numbers
  function formatNumber(val, geo) {
    return geo === 'international' 
      ? Number(val).toLocaleString('en-US') 
      : Number(val).toLocaleString('en-IN');
  }

  // Check and hide empty tokens
  function handleTokenVisibility() {
    const config = window.SQUIRED_CONFIG;
    if (!config || !config.tokens) return;

    // Check proof bar tokens
    const hasMetric1 = Boolean(config.tokens.VERIFIED_METRIC_1 && config.tokens.VERIFIED_METRIC_1.trim());
    const hasMetric2 = Boolean(config.tokens.VERIFIED_METRIC_2 && config.tokens.VERIFIED_METRIC_2.trim());
    const hasMetric3 = Boolean(config.tokens.VERIFIED_METRIC_3 && config.tokens.VERIFIED_METRIC_3.trim());

    const proofBar = document.getElementById('proof-bar');
    if (proofBar) {
      if (!hasMetric1 && !hasMetric2 && !hasMetric3) {
        proofBar.style.display = 'none';
        proofBar.setAttribute('aria-hidden', 'true');
      } else {
        proofBar.style.display = 'grid';
        proofBar.removeAttribute('aria-hidden');
      }
    }

    // Check Results / Case Studies module
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      if (!config.caseStudies || config.caseStudies.length === 0) {
        resultsSection.style.display = 'none';
        resultsSection.setAttribute('aria-hidden', 'true');
      } else {
        resultsSection.style.display = 'block';
        resultsSection.removeAttribute('aria-hidden');
      }
    }

    // Any generic element with data-token
    document.querySelectorAll('[data-token]').forEach(el => {
      const tokenName = el.getAttribute('data-token');
      const val = config.tokens[tokenName];
      if (!val || val.trim() === '') {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.textContent = val;
      }
    });
  }

  // Apply copy to DOM elements
  function applyVariantCopy(variantKey, geo) {
    const config = window.SQUIRED_CONFIG;
    if (!config) return;

    const variant = config.variants[variantKey] || config.variants.default;

    // 1. Uniform CTA text across ALL buttons on the site
    document.querySelectorAll('.js-cta-text').forEach(el => {
      el.textContent = variant.ctaText;
    });

    // 2. Dynamic CTA subtext if element present
    document.querySelectorAll('.js-cta-subtext').forEach(el => {
      el.textContent = variant.ctaSubtext || '';
    });

    // 3. Hero elements (Home page)
    const heroEyebrow = document.getElementById('hero-eyebrow');
    if (heroEyebrow && variant.hero?.eyebrow) heroEyebrow.textContent = variant.hero.eyebrow;

    const heroHeadline = document.getElementById('hero-headline');
    if (heroHeadline && variant.hero?.headline) heroHeadline.textContent = variant.hero.headline;

    const heroSubhead = document.getElementById('hero-subhead');
    if (heroSubhead && variant.hero?.subhead) heroSubhead.textContent = variant.hero.subhead;

    const heroMicrocopy = document.getElementById('hero-microcopy');
    if (heroMicrocopy && variant.hero?.microcopy) heroMicrocopy.textContent = variant.hero.microcopy;

    // 4. Dynamic Brand Link Form Field
    document.querySelectorAll('.js-dynamic-brand-label').forEach(el => {
      el.textContent = variant.dynamicBrandField.label;
    });
    document.querySelectorAll('.js-dynamic-brand-input').forEach(el => {
      el.setAttribute('placeholder', variant.dynamicBrandField.placeholder);
    });
    document.querySelectorAll('.js-dynamic-brand-help').forEach(el => {
      el.textContent = variant.dynamicBrandField.help;
    });

    // 5. Proof Bar Labels
    if (variant.proofBarLabels) {
      const p1 = document.getElementById('proof-label-1');
      if (p1) p1.textContent = variant.proofBarLabels.metric1;
      const p2 = document.getElementById('proof-label-2');
      if (p2) p2.textContent = variant.proofBarLabels.metric2;
      const p3 = document.getElementById('proof-label-3');
      if (p3) p3.textContent = variant.proofBarLabels.metric3;
    }

    // 6. Problem Trio (Why D2C/Marketplace growth stalls)
    const problemTrioTitle = document.getElementById('problem-trio-title');
    if (problemTrioTitle && variant.problemTrio?.title) {
      problemTrioTitle.textContent = variant.problemTrio.title;
    }
    const problemTrioSubtitle = document.getElementById('problem-trio-subtitle');
    if (problemTrioSubtitle) {
      if (variant.problemTrio?.subtitle) {
        problemTrioSubtitle.textContent = variant.problemTrio.subtitle;
        problemTrioSubtitle.style.display = '';
      } else {
        problemTrioSubtitle.style.display = 'none';
      }
    }

    const problemGrid = document.getElementById('problem-trio-grid');
    if (problemGrid && variant.problemTrio?.items) {
      problemGrid.innerHTML = variant.problemTrio.items.map((item, idx) => `
        <article class="problem-col">
          <div class="problem-num">0${idx + 1}</div>
          ${item.metric ? `<div class="problem-tag">${item.metric}</div>` : ''}
          <h3 class="problem-heading">${item.title}</h3>
          <p class="problem-desc">${item.description}</p>
        </article>
      `).join('');
    }

    // 7. Order Services on Home and Services pages based on variant
    reorderServices(variant.servicesOrder);

    // 8. Platform Trust Strip Geo-adjustment
    renderTrustStrip(geo);

    // 9. Fire dataLayer variant_view event
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'variant_view',
        variant: variantKey,
        source: activeSource,
        geo: geo,
        page: window.location.pathname
      });
    }
  }

  // Re-order service items according to variant priority
  function reorderServices(orderArray) {
    if (!orderArray || !Array.isArray(orderArray)) return;

    // Home 4-column services preview
    const homeServicesContainer = document.getElementById('home-services-grid');
    const allServices = window.SQUIRED_CONFIG?.services || [];

    if (homeServicesContainer && allServices.length > 0) {
      // Pick the top 4 services according to the variant's orderArray
      const ordered = [...allServices].sort((a, b) => {
        const indexA = orderArray.indexOf(a.id);
        const indexB = orderArray.indexOf(b.id);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });

      const topFour = ordered.slice(0, 4);
      homeServicesContainer.innerHTML = topFour.map((srv, idx) => `
        <div class="service-preview-card">
          <div class="service-preview-top">
            <span class="service-preview-num">0${idx + 1}</span>
          </div>
          <h3 class="service-preview-title">${srv.title}</h3>
          <p class="service-preview-desc">${srv.homeSummary || srv.description}</p>
          <a href="services.html#${srv.id}" class="service-preview-link">
            View scope &rarr;
          </a>
        </div>
      `).join('');
    }

    // Full Services page (services.html)
    const fullServicesContainer = document.getElementById('services-list-container');
    if (fullServicesContainer && allServices.length > 0) {
      const ordered = [...allServices].sort((a, b) => {
        const indexA = orderArray.indexOf(a.id);
        const indexB = orderArray.indexOf(b.id);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });

      fullServicesContainer.innerHTML = ordered.map((srv, idx) => `
        <article class="service-block" id="${srv.id}">
          <div class="service-block-header">
            <span class="service-block-num">0${idx + 1}</span>
            <div>
              <h2 class="service-block-title">${srv.title}</h2>
              <div class="service-block-badge">${srv.shortTitle}</div>
            </div>
          </div>
          
          <p class="service-block-lead">${srv.description}</p>

          <div class="service-block-details">
            <div class="service-includes-col">
              <h3 class="service-subheading">Scope</h3>
              <ul class="service-includes-list">
                ${srv.includes.map(inc => `
                  <li>
                    <svg aria-hidden="true" class="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E56315" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>${inc}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="service-meta-col">
              <div class="service-meta-card">
                <h4 class="meta-card-title">Best For</h4>
                <p class="meta-card-text">${srv.bestFor}</p>
              </div>

              <div class="service-meta-card">
                <h4 class="meta-card-title">Measures</h4>
                <p class="meta-card-text">${srv.weMeasure}</p>
              </div>

              <div class="service-cta-wrap">
                <a href="contact.html?service=${srv.id}" class="btn btn-primary js-cta-btn">
                  <span class="js-cta-text">${window.SQUIRED_CONFIG?.variants[activeVariant]?.ctaText || 'Book a Growth Audit'}</span>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
        </article>
      `).join('');
    }
  }

  // Platform trust strip
  function renderTrustStrip(geo) {
    const container = document.getElementById('trust-strip-list');
    if (!container || !window.SQUIRED_CONFIG) return;

    const list = geo === 'international' 
      ? window.SQUIRED_CONFIG.trustPlatforms.international 
      : window.SQUIRED_CONFIG.trustPlatforms.india;

    container.innerHTML = list.map(item => `
      <div class="trust-pill">
        <span class="trust-pill-name">${item.name}</span>
        ${item.type ? `<span class="trust-pill-type">${item.type}</span>` : ''}
      </div>
    `).join('');
  }

})();
