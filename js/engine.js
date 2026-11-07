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

    // 10. Automatically resolve GitHub Pages repository subfolder paths
    normalizeRepoLinks();
  }

  // Auto-detect GitHub Pages or repository subfolder hosting and normalize root-relative links
  function normalizeRepoLinks() {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (window.location.hostname.endsWith('github.io') && pathSegments.length > 0) {
      const repoName = pathSegments[0];
      const repoBase = '/' + repoName + '/';

      document.querySelectorAll('a[href^="/"]').forEach(a => {
        const href = a.getAttribute('href');
        if (href === '/') {
          a.setAttribute('href', repoBase);
        } else if (href.startsWith('/') && !href.startsWith(repoBase)) {
          a.setAttribute('href', '/' + repoName + href);
        }
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
        <div class="service-preview-card" tabindex="0">
          <div class="service-preview-top">
            <span class="service-preview-num">0${idx + 1}</span>
          </div>
          <h3 class="service-preview-title">${srv.title}</h3>
          <p class="service-preview-desc">${srv.homeSummary || srv.description}</p>
          <div class="service-preview-drawer">
            <div class="service-drawer-header">Key Execution Focus</div>
            <ul class="service-preview-scope-list">
              ${srv.includes.slice(0, 3).map(inc => `
                <li>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E56315" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>${inc}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <a href="/services#${srv.id}" class="service-preview-link">
            <span>View scope</span>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      `).join('');
    }

    // Full Services Explorer: Desktop Hover-Reveal Blocks + Mobile 3D Diagonal Deck
    const explorerContainer = document.getElementById('services-explorer') || document.getElementById('services-list-container');
    if (explorerContainer && allServices.length > 0) {
      const ordered = [...allServices].sort((a, b) => {
        const indexA = orderArray.indexOf(a.id);
        const indexB = orderArray.indexOf(b.id);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });

      const total = ordered.length;
      let activeIdx = 0;
      if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        const foundIdx = ordered.findIndex(s => s.id === hashId);
        if (foundIdx !== -1) activeIdx = foundIdx;
      }

      const activeService = ordered[activeIdx] || ordered[0];

      explorerContainer.innerHTML = `
        <!-- Desktop: Row layout on left with 5 options; hovering any option expands its details on the right -->
        <div class="services-desktop-explorer" id="services-desktop-explorer">
          <div class="services-explorer-layout">
            <!-- Left Tabs Menu (5 option rows) -->
            <nav class="services-tabs-col" role="tablist" aria-label="Services Navigation">
              ${ordered.map((srv, idx) => {
                const isActive = idx === activeIdx;
                return `
                  <button type="button" 
                          class="service-tab-btn ${isActive ? 'active' : ''}" 
                          data-service-id="${srv.id}" 
                          data-index="${idx}"
                          role="tab" 
                          aria-selected="${isActive ? 'true' : 'false'}"
                          id="tab-${srv.id}">
                    <span class="service-tab-num">0${idx + 1}</span>
                    <div class="service-tab-info">
                      <span class="service-tab-title">${srv.title}</span>
                      <span class="service-tab-badge">${srv.shortTitle}</span>
                    </div>
                    <svg class="service-tab-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                `;
              }).join('')}
            </nav>

            <!-- Right Detail Showcase (pre-rendered common stage, zero layout shift) -->
            <div class="services-detail-col">
              <div class="desktop-panels-stage" id="desktop-panels-stage">
                ${ordered.map((srv, idx) => {
                  const isActive = idx === activeIdx;
                  return `
                    <article class="desktop-service-panel ${isActive ? 'active' : ''}" 
                             id="desktop-panel-${srv.id}" 
                             role="tabpanel" 
                             aria-labelledby="tab-${srv.id}" 
                             aria-hidden="${isActive ? 'false' : 'true'}"
                             data-service-id="${srv.id}"
                             data-index="${idx}">
                      <div class="desktop-panel-head">
                        <div class="service-detail-header">
                          <div>
                            <span class="service-detail-badge">${srv.shortTitle}</span>
                            <h2 class="service-detail-title">${srv.title}</h2>
                          </div>
                          <span class="service-detail-num">0${idx + 1}</span>
                        </div>
                        <p class="service-detail-lead">${srv.description}</p>
                      </div>

                      <div class="service-detail-grid">
                        <div class="service-scope-col">
                          <h3 class="service-subheading">Scope Deliverables</h3>
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
                          <div class="service-specs-box">
                            <div class="spec-row">
                              <span class="spec-title">Best For</span>
                              <p class="spec-text">${srv.bestFor}</p>
                            </div>
                            <div class="spec-divider"></div>
                            <div class="spec-row">
                              <span class="spec-title">Measures</span>
                              <p class="spec-text">${srv.weMeasure}</p>
                            </div>
                          </div>

                          <div class="service-cta-wrap">
                            <a href="/contact?service=${srv.id}" class="btn btn-primary js-cta-btn">
                              <span class="js-cta-text">${window.SQUIRED_CONFIG?.variants[activeVariant]?.ctaText || 'Book a Growth Audit'}</span>
                              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile: 3D Diagonal Peeking Card Deck (Touch-Swipe Enabled) -->
        <div class="services-mobile-deck" id="services-mobile-deck">
          <nav class="services-tabs-col" role="tablist" aria-label="Services Mobile Navigation">
            ${ordered.map((srv, idx) => `
              <button type="button" 
                      class="service-tab-btn ${idx === activeIdx ? 'active' : ''}" 
                      data-index="${idx}" 
                      role="tab" 
                      aria-selected="${idx === activeIdx ? 'true' : 'false'}"
                      id="mobile-tab-${srv.id}">
                <span class="service-tab-num">0${idx + 1}</span>
                <span class="service-tab-title">${srv.shortTitle}</span>
              </button>
            `).join('')}
          </nav>

          <div class="diagonal-deck-stage" id="diagonal-deck-stage" tabindex="0" aria-label="Services card deck. Use arrow keys or swipe to navigate.">
            ${ordered.map((srv, idx) => {
              const prevIdx = Math.max(0, idx - 1);
              const nextIdx = Math.min(total - 1, idx + 1);
              const prevService = ordered[prevIdx];
              const nextService = ordered[nextIdx];

              let posClass = 'card-pos-hidden';
              if (idx === activeIdx) posClass = 'card-pos-active';
              else if (idx === activeIdx + 1) posClass = 'card-pos-next';
              else if (idx === activeIdx - 1) posClass = 'card-pos-prev';

              return `
                <article class="diagonal-card ${posClass}" 
                         data-card-index="${idx}" 
                         data-service-id="${srv.id}"
                         id="card-${srv.id}">
                  
                  <!-- Card Top Bar: Chip Badge, Progress Dots & Arrows -->
                  <div class="service-card-top-nav">
                    <div class="card-indicator">
                      <span class="card-chip">
                        <span class="chip-pulse"></span>
                        <strong>SCOPE 0${idx + 1} / 0${total}</strong>
                      </span>
                      <div class="card-indicator-dots" role="group" aria-label="Service scopes">
                        ${ordered.map((_, dotIdx) => `
                          <button type="button" 
                                  class="card-dot ${dotIdx === activeIdx ? 'active' : ''}" 
                                  data-index="${dotIdx}" 
                                  aria-label="Switch to scope 0${dotIdx + 1}">
                          </button>
                        `).join('')}
                      </div>
                    </div>

                    <div class="card-nav-arrows">
                      <button type="button" class="card-arrow-btn js-btn-prev" aria-label="Previous scope: ${prevService.title}" title="Previous scope: ${prevService.title}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      <button type="button" class="card-arrow-btn js-btn-next" aria-label="Next scope: ${nextService.title}" title="Next scope: ${nextService.title}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </div>
                  </div>

                  <!-- Card Header -->
                  <div class="service-detail-header">
                    <div>
                      <span class="service-detail-badge">${srv.shortTitle}</span>
                      <h2 class="service-detail-title">${srv.title}</h2>
                    </div>
                    <span class="service-detail-num">0${idx + 1}</span>
                  </div>

                  <p class="service-detail-lead">${srv.description}</p>

                  <!-- Card Body -->
                  <div class="service-detail-grid">
                    <div class="service-scope-col service-card-tile">
                      <h3 class="service-subheading">Scope Deliverables</h3>
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
                      <div class="service-meta-card service-card-tile">
                        <h4 class="meta-card-title">Best For</h4>
                        <p class="meta-card-text">${srv.bestFor}</p>
                      </div>

                      <div class="service-meta-card service-card-tile">
                        <h4 class="meta-card-title">Measures</h4>
                        <p class="meta-card-text">${srv.weMeasure}</p>
                      </div>

                      <div class="service-cta-wrap">
                        <a href="/contact?service=${srv.id}" class="btn btn-primary js-cta-btn">
                          <span class="js-cta-text">${window.SQUIRED_CONFIG?.variants[activeVariant]?.ctaText || 'Book a Growth Audit'}</span>
                          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  <!-- Card Footer Stepper (Next & Previous Scope Links) -->
                  <div class="service-card-stepper-footer">
                    <button type="button" class="stepper-nav-btn prev js-btn-prev" aria-label="Go to ${prevService.title}">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                      <span class="stepper-text">
                        <small>Previous</small>
                        <strong>${prevService.shortTitle}</strong>
                      </span>
                    </button>

                    <button type="button" class="stepper-nav-btn next js-btn-next" aria-label="Go to ${nextService.title}">
                      <span class="stepper-text text-right">
                        <small>Next</small>
                        <strong>${nextService.shortTitle}</strong>
                      </span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>

                </article>
              `;
            }).join('')}
          </div>
        </div>
      `;

      // ---------------- Desktop Hover-to-Expand Interactions (Zero Layout Shift) ----------------
      const desktopTabs = explorerContainer.querySelectorAll('#services-desktop-explorer .service-tab-btn');
      const desktopPanels = explorerContainer.querySelectorAll('#services-desktop-explorer .desktop-service-panel');

      function switchDesktopTab(index) {
        if (index < 0 || index >= ordered.length) return;
        desktopTabs.forEach((btn, i) => {
          const isAct = i === index;
          btn.classList.toggle('active', isAct);
          btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
        });
        desktopPanels.forEach((panel, i) => {
          const isAct = i === index;
          panel.classList.toggle('active', isAct);
          panel.setAttribute('aria-hidden', isAct ? 'false' : 'true');
        });
      }

      desktopTabs.forEach((btn, idx) => {
        // HOVER: Instant smooth expand on hover (no DOM recreation, zero layout shift)
        btn.addEventListener('mouseenter', () => switchDesktopTab(idx));
        // CLICK / KEYBOARD: Instant smooth expand on click
        btn.addEventListener('click', () => switchDesktopTab(idx));
      });

      // ---------------- Mobile Card Deck Interactions ----------------
      const cards = explorerContainer.querySelectorAll('.services-mobile-deck .diagonal-card');
      const tabBtns = explorerContainer.querySelectorAll('.services-mobile-deck .service-tab-btn');
      const stage = document.getElementById('diagonal-deck-stage');

      function updateDeck(newIdx) {
        activeIdx = Math.max(0, Math.min(total - 1, newIdx));

        cards.forEach((card, i) => {
          card.classList.remove('card-pos-active', 'card-pos-next', 'card-pos-prev', 'card-pos-hidden');

          if (i === activeIdx) {
            card.classList.add('card-pos-active');
            card.setAttribute('aria-hidden', 'false');
            card.setAttribute('tabindex', '0');
          } else if (i === activeIdx + 1) {
            card.classList.add('card-pos-next');
            card.setAttribute('aria-hidden', 'true');
            card.setAttribute('tabindex', '-1');
          } else if (i === activeIdx - 1) {
            card.classList.add('card-pos-prev');
            card.setAttribute('aria-hidden', 'true');
            card.setAttribute('tabindex', '-1');
          } else {
            card.classList.add('card-pos-hidden');
            card.setAttribute('aria-hidden', 'true');
            card.setAttribute('tabindex', '-1');
          }
        });

        // Sync option tabs
        tabBtns.forEach((btn, i) => {
          const isAct = i === activeIdx;
          btn.classList.toggle('active', isAct);
          btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
        });

        if (tabBtns[activeIdx] && typeof tabBtns[activeIdx].scrollIntoView === 'function') {
          tabBtns[activeIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        // Sync dots on all cards
        cards.forEach(card => {
          const dots = card.querySelectorAll('.card-dot');
          dots.forEach((dot, dotIdx) => {
            dot.classList.toggle('active', dotIdx === activeIdx);
          });

          // Disable or hide boundary buttons
          const prevArrow = card.querySelector('.card-arrow-btn.js-btn-prev');
          const nextArrow = card.querySelector('.card-arrow-btn.js-btn-next');
          const prevStepper = card.querySelector('.stepper-nav-btn.prev');
          const nextStepper = card.querySelector('.stepper-nav-btn.next');

          if (prevArrow) {
            if (activeIdx === 0) {
              prevArrow.style.opacity = '0.22';
              prevArrow.style.pointerEvents = 'none';
              prevArrow.setAttribute('disabled', 'true');
            } else {
              prevArrow.style.opacity = '';
              prevArrow.style.pointerEvents = '';
              prevArrow.removeAttribute('disabled');
            }
          }

          if (nextArrow) {
            if (activeIdx === total - 1) {
              nextArrow.style.opacity = '0.22';
              nextArrow.style.pointerEvents = 'none';
              nextArrow.setAttribute('disabled', 'true');
            } else {
              nextArrow.style.opacity = '';
              nextArrow.style.pointerEvents = '';
              nextArrow.removeAttribute('disabled');
            }
          }

          if (prevStepper) {
            prevStepper.style.visibility = (activeIdx === 0) ? 'hidden' : 'visible';
            prevStepper.style.pointerEvents = (activeIdx === 0) ? 'none' : 'auto';
          }

          if (nextStepper) {
            nextStepper.style.visibility = (activeIdx === total - 1) ? 'hidden' : 'visible';
            nextStepper.style.pointerEvents = (activeIdx === total - 1) ? 'none' : 'auto';
          }
        });
      }

      // 1. Direct tab clicks
      tabBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => updateDeck(i));
      });

      // 2. Direct click on peeking diagonal cards (click right card to go next, left to go prev)
      cards.forEach((card, i) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('a') || e.target.closest('button')) return;
          if (card.classList.contains('card-pos-next') && activeIdx < total - 1) {
            updateDeck(activeIdx + 1);
          } else if (card.classList.contains('card-pos-prev') && activeIdx > 0) {
            updateDeck(activeIdx - 1);
          }
        });
      });

      // 3. Arrow & stepper buttons inside all cards
      cards.forEach(card => {
        card.querySelectorAll('.js-btn-prev').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeIdx > 0) updateDeck(activeIdx - 1);
          });
        });
        card.querySelectorAll('.js-btn-next').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeIdx < total - 1) updateDeck(activeIdx + 1);
          });
        });
        card.querySelectorAll('.card-dot').forEach(dot => {
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const dIdx = parseInt(dot.getAttribute('data-index'), 10);
            if (!isNaN(dIdx)) updateDeck(dIdx);
          });
        });
      });

      // 4. Touch swipe gestures
      if (stage) {
        let touchStartX = 0;
        let touchStartY = 0;
        stage.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        stage.addEventListener('touchend', (e) => {
          const touchEndX = e.changedTouches[0].screenX;
          const touchEndY = e.changedTouches[0].screenY;
          const diffX = touchEndX - touchStartX;
          const diffY = touchEndY - touchStartY;

          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
            if (diffX < 0 && activeIdx < total - 1) {
              updateDeck(activeIdx + 1); // Swiped Left -> Move Next
            } else if (diffX > 0 && activeIdx > 0) {
              updateDeck(activeIdx - 1); // Swiped Right -> Move Prev
            }
          }
        }, { passive: true });

        // 5. Keyboard arrows
        stage.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' && activeIdx < total - 1) {
            e.preventDefault();
            updateDeck(activeIdx + 1);
          } else if (e.key === 'ArrowLeft' && activeIdx > 0) {
            e.preventDefault();
            updateDeck(activeIdx - 1);
          }
        });
      }

      // Initialize
      updateDeck(activeIdx);

      // Listen for hash changes if user clicks an anchor link
      function handleHashChange() {
        if (window.location.hash) {
          const hashId = window.location.hash.substring(1);
          const foundIdx = ordered.findIndex(s => s.id === hashId);
          if (foundIdx !== -1) {
            switchDesktopTab(foundIdx);
            updateDeck(foundIdx);
          }
        }
      }

      handleHashChange();
      window.addEventListener('hashchange', handleHashChange);
    }

    normalizeRepoLinks();
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
