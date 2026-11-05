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
    const isMarketplace = variant === 'marketplace';

    const geoDefaults = geo === 'international' ? config.calculator.defaults.usd : config.calculator.defaults.inr;
    const improvementPct = config.calculator.improvementPct || 10;

    // Elements
    const spendSlider = document.getElementById('calc-spend-slider');
    const spendInput = document.getElementById('calc-spend-input');
    const metricSlider = document.getElementById('calc-metric-slider');
    const metricInput = document.getElementById('calc-metric-input');
    const metricLabel = document.getElementById('calc-metric-label');
    const metricUnit = document.getElementById('calc-metric-unit');
    const outputLift = document.getElementById('calc-output-lift');
    const outputRevenue = document.getElementById('calc-output-revenue');
    const outputNote = document.getElementById('calc-note');

    if (!spendSlider || !spendInput || !metricSlider || !metricInput) return;

    // Set Spend slider ranges
    spendSlider.min = geoDefaults.minSpend;
    spendSlider.max = geoDefaults.maxSpend;
    spendSlider.step = geoDefaults.stepSpend;
    spendSlider.value = geoDefaults.defaultSpend;
    spendInput.value = geoDefaults.defaultSpend;

    // Set Metric ranges: ROAS or ACOS
    if (isMarketplace) {
      if (metricLabel) metricLabel.textContent = 'Current Marketplace TACoS / ACOS';
      if (metricUnit) metricUnit.textContent = '%';
      metricSlider.min = 10;
      metricSlider.max = 70;
      metricSlider.step = 1;
      metricSlider.value = Math.round(config.calculator.defaults.defaultAcos);
      metricInput.value = Math.round(config.calculator.defaults.defaultAcos);
    } else {
      if (metricLabel) metricLabel.textContent = 'Current Blended ROAS';
      if (metricUnit) metricUnit.textContent = 'x';
      metricSlider.min = 1.0;
      metricSlider.max = 8.0;
      metricSlider.step = 0.1;
      metricSlider.value = config.calculator.defaults.defaultRoas.toFixed(1);
      metricInput.value = config.calculator.defaults.defaultRoas.toFixed(1);
    }

    if (outputNote) {
      outputNote.textContent = config.calculator.note;
    }

    function calculate() {
      const spend = parseFloat(spendInput.value) || geoDefaults.defaultSpend;
      let roas;

      if (isMarketplace) {
        const acos = parseFloat(metricInput.value) || config.calculator.defaults.defaultAcos;
        // ROAS = 1 / (ACOS / 100)
        roas = acos > 0 ? (100 / acos) : 3.0;
      } else {
        roas = parseFloat(metricInput.value) || config.calculator.defaults.defaultRoas;
      }

      const totalRevenue = spend * roas;
      const additionalLift = totalRevenue * (improvementPct / 100);

      if (outputLift) {
        outputLift.textContent = window.SquiredEngine.formatCurrency(additionalLift, geo);
      }
      if (outputRevenue) {
        outputRevenue.textContent = window.SquiredEngine.formatCurrency(totalRevenue + additionalLift, geo);
      }
    }

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
      if (isNaN(val)) val = isMarketplace ? config.calculator.defaults.defaultAcos : config.calculator.defaults.defaultRoas;
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

          // Show inline success state with "what happens next"
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
                <h3>Audit Request Received</h3>
                <p>Thank you, <strong>${payload.name}</strong>. Here is what happens next:</p>
                <div class="next-steps-list">
                  <div class="step-row"><span class="step-num">01</span><span>Anirban Roy reviews your storefront & ad presence within 24 hours.</span></div>
                  <div class="step-row"><span class="step-num">02</span><span>We email/WhatsApp you with initial margin observations and schedule a 45-min diagnostic call.</span></div>
                  <div class="step-row"><span class="step-num">03</span><span>You receive a transparent margin roadmap and execution scope.</span></div>
                </div>
                <div style="margin-top: 18px;">
                  <a href="https://wa.me/919836578989?text=Hi%20Anirban,%20I%20just%20submitted%20a%20growth%20audit%20request%20for%20my%20brand." target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.85rem; padding:8px 14px; width:100%;">
                    <span>Connect directly on WhatsApp &rarr;</span>
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
              <h3>Comprehensive Brief Received</h3>
              <p>Thank you, <strong>${payload.contactName}</strong>. We have logged your brief for <strong>${payload.brandName}</strong>.</p>
              <div class="next-steps-list">
                <div class="step-row"><span class="step-num">01</span><span>Anirban Roy is reviewing your storefront and channels.</span></div>
                <div class="step-row"><span class="step-num">02</span><span>We will prepare a customized 45-minute growth diagnostic session.</span></div>
                <div class="step-row"><span class="step-num">03</span><span>Expect a personal message within 24–48 hours at <strong>${payload.contactEmail}</strong>.</span></div>
              </div>
              <div style="margin-top: 18px;">
                <a href="https://wa.me/919836578989?text=Hi%20Anirban,%20I%20just%20submitted%20a%20detailed%20growth%20brief%20for%20my%20brand." target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.85rem; padding:8px 14px; width:100%;">
                  <span>Connect directly on WhatsApp &rarr;</span>
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
      navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isOpen);
        mobileMenu.classList.toggle('is-open', !isOpen);
        document.body.classList.toggle('nav-locked', !isOpen);
      });

      // Close menu on link click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navToggle.setAttribute('aria-expanded', 'false');
          mobileMenu.classList.remove('is-open');
          document.body.classList.remove('nav-locked');
        });
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

    // Sticky bottom bar CTA action
    const stickyBottomBar = document.getElementById('mobile-sticky-cta-bar');
    if (stickyBottomBar) {
      const heroForm = document.querySelector('.hero-form-card');
      const stickyBtn = stickyBottomBar.querySelector('.js-sticky-cta-btn');

      if (stickyBtn) {
        stickyBtn.addEventListener('click', (e) => {
          if (heroForm) {
            e.preventDefault();
            heroForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            heroForm.classList.add('highlight-pulse');
            setTimeout(() => heroForm.classList.remove('highlight-pulse'), 1500);
            heroForm.querySelector('input')?.focus();
          }
        });
      }
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
