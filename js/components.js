/**
 * Squired Marketing - Interactive UI Components
 * 
 * Includes:
 * 1. Growth Economics Calculator (Spend x ROAS/ACOS x Improvement)
 * 2. Accessible FAQ Accordion & JSON-LD injection
 * 3. Quick Form Handler (Inline Hero & Footer)
 * 4. Multi-Step Detailed Brief Form (Step 1 of 3, back button, state preservation)
 * 5. Mobile Navigation & Sticky Bottom CTA Bar
 * 6. Global Schema.org Structured Data
 */

(function () {
  'use strict';

  // Ensure window.dataLayer exists
  window.dataLayer = window.dataLayer || [];

  function trackEvent(eventName, payload = {}) {
    try {
      window.dataLayer.push({
        event: eventName,
        variant: window.SquiredEngine ? window.SquiredEngine.getVariant() : 'default',
        timestamp: new Date().toISOString(),
        ...payload
      });
    } catch (e) {
      // safe fallback
    }
  }

  /* ========================================================
   * 1. Growth Economics Calculator
   * ======================================================== */
  function initCalculator() {
    const calcSection = document.getElementById('calculator-module');
    if (!calcSection || !window.SQUIRED_CONFIG) return;

    const config = window.SQUIRED_CONFIG;
    const geo = window.SquiredEngine ? window.SquiredEngine.getGeo() : 'india';
    const variant = window.SquiredEngine ? window.SquiredEngine.getVariant() : 'default';
    let currentMode = (variant === 'marketplace') ? 'tacos' : 'roas';

    const geoDefaults = geo === 'international' ? config.calculator.defaults.usd : config.calculator.defaults.inr;
    const improvementPct = config.calculator.improvementPct || 10;

    // Elements
    const spendSlider = document.getElementById('calc-spend-slider');
    const spendInput = document.getElementById('calc-spend-input');
    const metricSlider = document.getElementById('calc-metric-slider');
    const metricInput = document.getElementById('calc-metric-input');
    const metricLabel = document.getElementById('calc-metric-label');
    const metricUnit = document.getElementById('calc-metric-unit');
    const metricExplainer = document.getElementById('calc-metric-explainer');
    const metricTooltip = document.getElementById('calc-metric-tooltip');
    const outputLift = document.getElementById('calc-output-lift');
    const outputRevenue = document.getElementById('calc-output-revenue');
    const outputNote = document.getElementById('calc-note');
    const roasBtn = document.getElementById('calc-mode-roas');
    const tacosBtn = document.getElementById('calc-mode-tacos');

    if (!spendSlider || !spendInput || !metricSlider || !metricInput) return;

    // Set Spend slider ranges
    spendSlider.min = geoDefaults.minSpend;
    spendSlider.max = geoDefaults.maxSpend;
    spendSlider.step = geoDefaults.stepSpend;
    spendSlider.value = geoDefaults.defaultSpend;
    spendInput.value = geoDefaults.defaultSpend;

    function updateMetricMode(mode) {
      currentMode = mode;

      if (roasBtn && tacosBtn) {
        if (mode === 'tacos') {
          tacosBtn.classList.add('active');
          tacosBtn.setAttribute('aria-selected', 'true');
          roasBtn.classList.remove('active');
          roasBtn.setAttribute('aria-selected', 'false');
        } else {
          roasBtn.classList.add('active');
          roasBtn.setAttribute('aria-selected', 'true');
          tacosBtn.classList.remove('active');
          tacosBtn.setAttribute('aria-selected', 'false');
        }
      }

      if (mode === 'tacos') {
        if (metricLabel) metricLabel.textContent = 'Current Marketplace TACoS';
        if (metricUnit) metricUnit.textContent = '%';
        if (metricExplainer) metricExplainer.textContent = 'Total ad spend ÷ Total marketplace sales (Amazon / Flipkart).';
        if (metricTooltip) {
          metricTooltip.innerHTML = '<strong>TACoS (Total ACOS)</strong> = Total Ad Spend ÷ Total Marketplace Sales. A 25% TACoS means 25% of your total revenue is spent on ads. Lower TACoS indicates stronger organic momentum.';
        }
        metricSlider.min = 10;
        metricSlider.max = 60;
        metricSlider.step = 1;
        const defaultAcos = Math.round(config.calculator.defaults.defaultAcos) || 25;
        metricSlider.value = defaultAcos;
        metricInput.value = defaultAcos;
      } else {
        if (metricLabel) metricLabel.textContent = 'Current Blended ROAS';
        if (metricUnit) metricUnit.textContent = 'x';
        if (metricExplainer) metricExplainer.textContent = 'Total revenue ÷ Total ad spend across channels.';
        if (metricTooltip) {
          metricTooltip.innerHTML = '<strong>ROAS (Return on Ad Spend)</strong> = Total Revenue ÷ Ad Spend. A 3.0x ROAS means ₹300 revenue for every ₹100 spent on advertising.';
        }
        metricSlider.min = 1.0;
        metricSlider.max = 8.0;
        metricSlider.step = 0.1;
        const defaultRoas = config.calculator.defaults.defaultRoas || 3.0;
        metricSlider.value = defaultRoas.toFixed(1);
        metricInput.value = defaultRoas.toFixed(1);
      }

      calculate();
    }

    if (roasBtn) {
      roasBtn.addEventListener('click', () => {
        updateMetricMode('roas');
        trackEvent('calculator_mode_change', { mode: 'roas' });
      });
    }
    if (tacosBtn) {
      tacosBtn.addEventListener('click', () => {
        updateMetricMode('tacos');
        trackEvent('calculator_mode_change', { mode: 'tacos' });
      });
    }

    if (outputNote) {
      outputNote.textContent = config.calculator.note;
    }

    function calculate() {
      const spend = parseFloat(spendInput.value) || geoDefaults.defaultSpend;
      let totalRevenue = 0;
      let additionalLift = 0;

      if (currentMode === 'tacos') {
        const tacos = parseFloat(metricInput.value) || 25;
        // Total Marketplace Revenue = spend / (tacos / 100)
        totalRevenue = tacos > 0 ? (spend / (tacos / 100)) : (spend * 4);
        additionalLift = totalRevenue * (improvementPct / 100);
      } else {
        const roas = parseFloat(metricInput.value) || config.calculator.defaults.defaultRoas;
        totalRevenue = spend * roas;
        additionalLift = totalRevenue * (improvementPct / 100);
      }

      if (outputLift) {
        outputLift.textContent = window.SquiredEngine.formatCurrency(additionalLift, geo);
      }
      if (outputRevenue) {
        outputRevenue.textContent = window.SquiredEngine.formatCurrency(totalRevenue + additionalLift, geo);
      }
    }

    // Initialize with active mode
    updateMetricMode(currentMode);

    // Spend Sync
    spendSlider.addEventListener('input', () => {
      spendInput.value = spendSlider.value;
      calculate();
      trackEvent('calculator_use', { input: 'spend', value: spendSlider.value });
    });
    spendInput.addEventListener('change', () => {
      let val = parseFloat(spendInput.value) || geoDefaults.defaultSpend;
      if (val < geoDefaults.minSpend) val = geoDefaults.minSpend;
      if (val > geoDefaults.maxSpend) val = geoDefaults.maxSpend;
      spendInput.value = val;
      spendSlider.value = val;
      calculate();
      trackEvent('calculator_use', { input: 'spend', value: val });
    });

    // Metric Sync
    metricSlider.addEventListener('input', () => {
      metricInput.value = metricSlider.value;
      calculate();
      trackEvent('calculator_use', { input: 'metric', value: metricSlider.value });
    });
    metricInput.addEventListener('change', () => {
      let val = parseFloat(metricInput.value);
      if (isNaN(val)) val = currentMode === 'tacos' ? 25 : config.calculator.defaults.defaultRoas;
      metricInput.value = val;
      metricSlider.value = val;
      calculate();
      trackEvent('calculator_use', { input: 'metric', value: val });
    });

    // Initial calculation
    calculate();
  }

  /* ========================================================
   * 2. Accessible FAQ Accordion & FAQPage Schema
   * ======================================================== */
  function initFaq() {
    const faqContainer = document.getElementById('faq-accordion-container');
    if (!faqContainer || !window.SQUIRED_CONFIG?.faq) return;

    const faqs = window.SQUIRED_CONFIG.faq;

    // Render items
    faqContainer.innerHTML = faqs.map((item, idx) => `
      <div class="faq-item" id="faq-item-${idx}">
        <button type="button" class="faq-question" id="faq-btn-${idx}" aria-expanded="false" aria-controls="faq-ans-${idx}">
          <span class="faq-q-text">${item.question}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer" id="faq-ans-${idx}" role="region" aria-labelledby="faq-btn-${idx}" hidden>
          <div class="faq-answer-inner">
            <p>${item.answer}</p>
          </div>
        </div>
      </div>
    `).join('');

    // Accordion toggle events
    const buttons = faqContainer.querySelectorAll('.faq-question');
    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        const targetId = btn.getAttribute('aria-controls');
        const answerEl = document.getElementById(targetId);

        // Close other items for neatness
        buttons.forEach(otherBtn => {
          if (otherBtn !== btn) {
            otherBtn.setAttribute('aria-expanded', 'false');
            const otherAns = document.getElementById(otherBtn.getAttribute('aria-controls'));
            if (otherAns) otherAns.hidden = true;
            otherBtn.querySelector('.faq-icon').textContent = '+';
          }
        });

        // Toggle clicked
        if (isExpanded) {
          btn.setAttribute('aria-expanded', 'false');
          if (answerEl) answerEl.hidden = true;
          btn.querySelector('.faq-icon').textContent = '+';
        } else {
          btn.setAttribute('aria-expanded', 'true');
          if (answerEl) answerEl.hidden = false;
          btn.querySelector('.faq-icon').textContent = '−';
          trackEvent('faq_open', { question: faqs[index].question, index: index });
        }
      });
    });

    // Inject FAQPage Schema JSON-LD
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);
  }

  /* ========================================================
   * 3. Form Handling (Quick Form & Detailed Multi-Step)
   * ======================================================== */
  function getHiddenFieldData() {
    const utms = window.SquiredEngine ? window.SquiredEngine.getAllUtms() : {};
    return {
      variant: window.SquiredEngine ? window.SquiredEngine.getVariant() : 'default',
      source: window.SquiredEngine ? window.SquiredEngine.getSource() : 'dashboard',
      geo: window.SquiredEngine ? window.SquiredEngine.getGeo() : 'india',
      page: window.location.pathname,
      referrer: document.referrer || 'direct',
      ...utms
    };
  }

  function initQuickForms() {
    const forms = document.querySelectorAll('.js-quick-form');
    if (!forms.length) return;

    forms.forEach(form => {
      let started = false;

      form.addEventListener('focusin', () => {
        if (!started) {
          started = true;
          trackEvent('form_start', { form_type: 'quick_form', form_id: form.id });
        }
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Honeypot check
        const honeypot = form.querySelector('[name="website_url_hp"]');
        if (honeypot && honeypot.value.trim() !== '') {
          console.warn('Bot submission blocked');
          return;
        }

        const nameInput = form.querySelector('[name="client_name"]');
        const contactInput = form.querySelector('[name="client_contact"]');
        const brandInput = form.querySelector('[name="brand_link"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const errorEl = form.querySelector('.js-form-error');
        const successEl = form.querySelector('.js-form-success');

        if (errorEl) errorEl.textContent = '';

        // Basic Client Validation
        if (!nameInput || !nameInput.value.trim()) {
          showError(errorEl, 'Please enter your name.');
          nameInput?.focus();
          return;
        }

        const contactVal = contactInput ? contactInput.value.trim() : '';
        if (!contactVal || (!contactVal.includes('@') && contactVal.replace(/\D/g, '').length < 8)) {
          showError(errorEl, 'Please provide a valid email or WhatsApp phone number.');
          contactInput?.focus();
          return;
        }

        if (!brandInput || !brandInput.value.trim()) {
          showError(errorEl, 'Please provide your brand or store link.');
          brandInput?.focus();
          return;
        }

        // Form Payload with FormSubmit integration fields
        const payload = {
          name: nameInput.value.trim(),
          contact: contactVal,
          brandLink: brandInput.value.trim(),
          formType: 'quick_form',
          submittedAt: new Date().toISOString(),
          _subject: `New Squired Growth Audit: ${brandInput.value.trim()} (${nameInput.value.trim()})`,
          _template: 'table',
          _captcha: 'false',
          ...getHiddenFieldData()
        };

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.dataset.originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = 'Submitting Request...';
        }

        try {
          // Attempt POST to configured endpoint
          const endpoint = window.SQUIRED_CONFIG?.formEndpoint || 'https://formsubmit.co/ajax/anirban@squiredmarketing.com';
          try {
            await fetch(endpoint, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(payload)
            });
          } catch (postErr) {
            // Log for edge environments without live backend
            console.log('Enquiry logged (client-side fallback):', payload);
          }

          // Track form submission
          trackEvent('form_submit', {
            form_type: 'quick_form',
            variant: payload.variant
          });

          // Show inline success state
          if (form.querySelector('.js-form-body')) {
            form.querySelector('.js-form-body').style.display = 'none';
          }
          if (successEl) {
            successEl.style.display = 'block';
            successEl.innerHTML = `
              <div class="form-success-card">
                <div class="success-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E56315" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3>Request Received</h3>
                <p>Thanks, <strong>${payload.name}</strong>. We will review your store and reply within 48 hours.</p>
                <div style="margin-top: 18px;">
                  <a href="https://wa.me/919836578989?text=Hi%20Anirban,%20I%20just%20submitted%20a%20growth%20audit%20request%20for%20my%20brand." target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.85rem; padding:8px 14px; width:100%;">
                    <span>Message us on WhatsApp &rarr;</span>
                  </a>
                </div>
              </div>
            `;
          }
        } catch (err) {
          showError(errorEl, 'Something went wrong. Please reach out directly to anirban@squiredmarketing.com or +91 98365 78989');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.originalText;
          }
        }
      });
    });
  }

  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
  }

  /* ========================================================
   * 4. Multi-Step Detailed Brief Form (Contact Page)
   * ======================================================== */
  function initDetailedForm() {
    const form = document.getElementById('detailed-brief-form');
    if (!form) return;

    let currentStep = 1;
    const totalSteps = 3;
    let started = false;

    // Form data store for answers preserved between steps
    const briefData = {};

    const progressIndicator = document.getElementById('step-indicator-text');
    const progressBarFill = document.getElementById('step-progress-fill');
    const prevBtn = document.getElementById('brief-prev-btn');
    const nextBtn = document.getElementById('brief-next-btn');
    const submitBtn = document.getElementById('brief-submit-btn');
    const errorEl = document.getElementById('brief-form-error');
    const successEl = document.getElementById('brief-form-success');
    const steps = [
      document.getElementById('brief-step-1'),
      document.getElementById('brief-step-2'),
      document.getElementById('brief-step-3')
    ];

    form.addEventListener('focusin', () => {
      if (!started) {
        started = true;
        trackEvent('form_start', { form_type: 'detailed_brief' });
      }
    });

    function updateStepUI() {
      if (progressIndicator) {
        progressIndicator.textContent = `Step ${currentStep} of ${totalSteps}`;
      }
      if (progressBarFill) {
        progressBarFill.style.width = `${(currentStep / totalSteps) * 100}%`;
      }

      steps.forEach((stepEl, idx) => {
        if (!stepEl) return;
        stepEl.style.display = (idx + 1 === currentStep) ? 'block' : 'none';
      });

      if (prevBtn) {
        prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
      }
      if (nextBtn) {
        nextBtn.style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
      }
      if (submitBtn) {
        submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
      }
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }

    function validateCurrentStep() {
      if (errorEl) errorEl.style.display = 'none';

      if (currentStep === 1) {
        const brandName = form.querySelector('[name="brand_name"]');
        const storeUrl = form.querySelector('[name="store_url"]');
        if (!brandName || !brandName.value.trim()) {
          showError(errorEl, 'Please enter your brand name.');
          brandName?.focus();
          return false;
        }
        if (!storeUrl || !storeUrl.value.trim()) {
          showError(errorEl, 'Please enter your storefront or catalog URL.');
          storeUrl?.focus();
          return false;
        }
        briefData.brandName = brandName.value.trim();
        briefData.storeUrl = storeUrl.value.trim();
        briefData.primaryPlatform = form.querySelector('[name="primary_platform"]')?.value || 'Shopify';
      } else if (currentStep === 2) {
        const monthlySpend = form.querySelector('[name="monthly_spend"]');
        const primaryGoal = form.querySelector('[name="primary_goal"]');
        if (!monthlySpend || !monthlySpend.value.trim()) {
          showError(errorEl, 'Please select or enter your monthly ad spend range.');
          monthlySpend?.focus();
          return false;
        }
        briefData.monthlySpend = monthlySpend.value.trim();
        briefData.primaryGoal = primaryGoal?.value || 'Scale Revenue profitably';
        briefData.targetTimeline = form.querySelector('[name="target_timeline"]')?.value || 'Immediately';
      } else if (currentStep === 3) {
        const fullName = form.querySelector('[name="contact_name"]');
        const contactEmail = form.querySelector('[name="contact_email"]');
        if (!fullName || !fullName.value.trim()) {
          showError(errorEl, 'Please enter your full name.');
          fullName?.focus();
          return false;
        }
        const emailVal = contactEmail ? contactEmail.value.trim() : '';
        if (!emailVal || (!emailVal.includes('@') && emailVal.replace(/\D/g, '').length < 8)) {
          showError(errorEl, 'Please enter a valid work email or WhatsApp phone number.');
          contactEmail?.focus();
          return false;
        }
        briefData.contactName = fullName.value.trim();
        briefData.contactEmail = emailVal;
        briefData.notes = form.querySelector('[name="brief_notes"]')?.value.trim() || '';
      }
      return true;
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (validateCurrentStep()) {
          trackEvent('step_complete', {
            form_type: 'detailed_brief',
            step_completed: currentStep
          });
          currentStep++;
          updateStepUI();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          updateStepUI();
        }
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot check
      const honeypot = form.querySelector('[name="company_tax_hp"]');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Bot submission blocked');
        return;
      }

      if (!validateCurrentStep()) return;

      const payload = {
        ...briefData,
        formType: 'detailed_brief',
        submittedAt: new Date().toISOString(),
        _subject: `New Detailed Squired Brief: ${briefData.brandName} (${briefData.contactName})`,
        _template: 'table',
        _captcha: 'false',
        ...getHiddenFieldData()
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Submitting Brief...';
      }

      try {
        const endpoint = window.SQUIRED_CONFIG?.formEndpoint || 'https://formsubmit.co/ajax/anirban@squiredmarketing.com';
        try {
          await fetch(endpoint, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (fetchErr) {
          console.log('Brief logged (client fallback):', payload);
        }

        trackEvent('form_submit', {
          form_type: 'detailed_brief',
          variant: payload.variant
        });

        // Hide form fields & show success state
        form.querySelector('.brief-steps-wrapper').style.display = 'none';
        if (progressIndicator) progressIndicator.parentElement.style.display = 'none';

        if (successEl) {
          successEl.style.display = 'block';
          successEl.innerHTML = `
            <div class="brief-success-card">
              <div class="success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E56315" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3>Brief Received</h3>
              <p>Thanks, <strong>${payload.contactName}</strong>. We have your brief for <strong>${payload.brandName}</strong> and will reply within 48 hours at <strong>${payload.contactEmail}</strong>.</p>
              <div style="margin-top: 18px;">
                <a href="https://wa.me/919836578989?text=Hi%20Anirban,%20I%20just%20submitted%20a%20detailed%20growth%20brief%20for%20my%20brand." target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.85rem; padding:8px 14px; width:100%;">
                  <span>Message us on WhatsApp &rarr;</span>
                </a>
              </div>
            </div>
          `;
        }
      } catch (err) {
        showError(errorEl, 'Unable to submit brief. Please contact us directly at anirban@squiredmarketing.com or +91 98365 78989');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitBtn.dataset.originalText;
        }
      }
    });

    // Form toggle on Contact page (Quick Enquiry vs Detailed Brief)
    const tabQuick = document.getElementById('contact-tab-quick');
    const tabDetailed = document.getElementById('contact-tab-detailed');
    const panelQuick = document.getElementById('contact-panel-quick');
    const panelDetailed = document.getElementById('contact-panel-detailed');

    if (tabQuick && tabDetailed && panelQuick && panelDetailed) {
      tabQuick.addEventListener('click', () => {
        tabQuick.classList.add('active');
        tabQuick.setAttribute('aria-selected', 'true');
        tabDetailed.classList.remove('active');
        tabDetailed.setAttribute('aria-selected', 'false');
        panelQuick.style.display = 'block';
        panelDetailed.style.display = 'none';
      });

      tabDetailed.addEventListener('click', () => {
        tabDetailed.classList.add('active');
        tabDetailed.setAttribute('aria-selected', 'true');
        tabQuick.classList.remove('active');
        tabQuick.setAttribute('aria-selected', 'false');
        panelDetailed.style.display = 'block';
        panelQuick.style.display = 'none';
        updateStepUI();
      });
    }

    updateStepUI();
  }

  /* ========================================================
   * 5. Navigation & Mobile Sticky CTA Bar
   * ======================================================== */
  function initNavAndStickyBar() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navToggle && mobileMenu) {
      function toggleMenu(open) {
        const isOpen = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('is-open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileMenu.classList.toggle('is-open', isOpen);
        document.body.classList.toggle('nav-locked', isOpen);
      }

      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });

      // Close menu on link click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          toggleMenu(false);
        });
      });

      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
          toggleMenu(false);
          navToggle.focus();
        }
      });

      // Close menu if window is resized above mobile breakpoint
      window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && mobileMenu.classList.contains('is-open')) {
          toggleMenu(false);
        }
      });
    }

    // CTA tracking
    document.querySelectorAll('.js-cta-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        trackEvent('cta_click', {
          cta_text: btn.textContent.trim(),
          href: btn.getAttribute('href') || ''
        });
      });
    });

    // Smart Sticky Bottom Bar
    initSmartStickyCtaBar();
  }

  function initSmartStickyCtaBar() {
    const stickyBottomBar = document.getElementById('mobile-sticky-cta-bar');
    if (!stickyBottomBar) return;

    // Completely suppress sticky bar on Contact page where form is already primary
    const isContactPage = window.location.pathname.includes('/contact') || 
                          document.getElementById('contact-forms-area') !== null ||
                          document.body.classList.contains('page-contact');
    if (isContactPage) {
      stickyBottomBar.style.display = 'none';
      return;
    }

    const heroForm = document.querySelector('.hero-form-card');
    const stickyBtn = stickyBottomBar.querySelector('.js-sticky-cta-btn') || stickyBottomBar.querySelector('a');

    if (stickyBtn && heroForm) {
      stickyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        heroForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        heroForm.classList.add('highlight-pulse');
        setTimeout(() => heroForm.classList.remove('highlight-pulse'), 1500);
        heroForm.querySelector('input')?.focus();
      });
    }

    // Auto-hide sticky bar whenever Hero or an on-page CTA / audit form is in view
    const inPageCtaTargets = document.querySelectorAll(
      '#hero, .hero-section, .hero-form-card, #hero-primary-cta, .hero-cta-group, #hero-cta-btn, #final-cta, .closing-band, .calc-cta-wrap, .service-stage-cta'
    );

    if (inPageCtaTargets.length > 0 && 'IntersectionObserver' in window) {
      const visibleTargets = new Set();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            visibleTargets.add(entry.target);
          } else {
            visibleTargets.delete(entry.target);
          }
        });

        // Hide sticky bar if any prominent in-page CTA is visible
        if (visibleTargets.size > 0) {
          stickyBottomBar.classList.add('is-hidden');
        } else {
          stickyBottomBar.classList.remove('is-hidden');
        }
      }, {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.05
      });

      inPageCtaTargets.forEach(el => observer.observe(el));
    }
  }

  /* ========================================================
   * 6. Global Organization Schema
   * ======================================================== */
  function injectOrgSchema() {
    const config = window.SQUIRED_CONFIG;
    if (!config) return;

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": config.brand.name,
      "url": "https://squiredmarketing.com",
      "logo": "https://squiredmarketing.com/assets/logo.png",
      "email": config.brand.email,
      "telephone": config.brand.phone,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kolkata",
        "addressRegion": "West Bengal",
        "addressCountry": "IN"
      },
      "sameAs": [
        config.brand.socials.linkedin,
        config.brand.socials.twitter
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(orgSchema);
    document.head.appendChild(script);
  }

  // Initialize all components once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    if (window.SquiredEngine) {
      window.SquiredEngine.applyConfig();
    }
    initCalculator();
    initFaq();
    initQuickForms();
    initDetailedForm();
    initNavAndStickyBar();
    injectOrgSchema();
  });

})();
