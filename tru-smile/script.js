/* ============================================================
   TRU-SMILE DENTAL LAB — script.js  (v2)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. Navbar scroll + hamburger ─────────────────────── */
  const navbar     = document.querySelector('.navbar');
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (navbar) window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
    });
  }
  function closeMenu() {
    if (!hamburger) return;
    hamburger.classList.remove('open');
    mobileMenu && mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ── 2. Active nav link ────────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && href !== '#' && page && page !== '' && href.replace('.html','') !== '' && page.includes(href.replace('.html',''))) {
      link.classList.add('active');
    }
    if ((page === 'index.html' || page === '') && href === 'index.html') link.classList.add('active');
  });

  /* ── 3. Accordion ──────────────────────────────────────── */
  const accordionItems = document.querySelectorAll('.accordion-item');

  function openAccordion(item) {
    item.classList.add('open');
    const body = item.querySelector('.accordion-body');
    if (body) body.style.maxHeight = body.scrollHeight + 'px';
    const btn = item.querySelector('.accordion-header');
    if (btn) btn.setAttribute('aria-expanded','true');
  }
  function closeAccordion(item) {
    item.classList.remove('open');
    const body = item.querySelector('.accordion-body');
    if (body) body.style.maxHeight = '0';
    const btn = item.querySelector('.accordion-header');
    if (btn) btn.setAttribute('aria-expanded','false');
  }

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      accordionItems.forEach(i => closeAccordion(i));
      if (!isOpen) openAccordion(item);
    });
  });

  /* ── 4. Hash → accordion ───────────────────────────────── */
  function handleHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const target = document.getElementById(hash);
    if (!target) return;
    accordionItems.forEach(i => closeAccordion(i));
    if (target.classList.contains('accordion-item')) {
      openAccordion(target);
      setTimeout(() => target.scrollIntoView({ behavior:'smooth', block:'start' }), 150);
    } else {
      setTimeout(() => target.scrollIntoView({ behavior:'smooth', block:'start' }), 150);
    }
  }
  handleHash();
  window.addEventListener('hashchange', handleHash);

  /* ── 5. Fade-in on scroll ──────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── 6. Scanner carousel ───────────────────────────────── */
  const track = document.querySelector('.scanner-track');
  if (track) track.innerHTML += track.innerHTML; // duplicate for seamless loop

  /* ── 7. Tooth chart ────────────────────────────────────── */
  document.querySelectorAll('.tooth-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      const upperSel = [...document.querySelectorAll('.upper-teeth .tooth-btn.selected')].map(b=>b.dataset.tooth).join(',');
      const lowerSel = [...document.querySelectorAll('.lower-teeth .tooth-btn.selected')].map(b=>b.dataset.tooth).join(',');
      const ui = document.getElementById('upper_teeth'); if(ui) ui.value = upperSel;
      const li = document.getElementById('lower_teeth'); if(li) li.value = lowerSel;
    });
  });

  /* ── 8. Auto-fill Rx date ──────────────────────────────── */
  const rxDate = document.getElementById('rx_date');
  if (rxDate) rxDate.value = new Date().toISOString().split('T')[0];

  /* ── 9. Dynamic copyright year ─────────────────────────── */
  document.querySelectorAll('.copy-year').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ── 10. CONTACT FORM — Formspree ─────────────────────── */
  /*
    FORMSPREE ENDPOINT: https://formspree.io/f/mqevkylb
    Submissions go to: contact-us@tru-smile.ca
    Subject format: Website Ticket Inquiry - [Clinic Name]
  */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const msgEl = contactForm.querySelector('.form-msg');

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!validateForm(contactForm)) return;

      const clinicName = contactForm.querySelector('[name="clinic_name"]').value.trim();
      const data = new FormData(contactForm);

      // ── EMAIL SUBJECT injected as hidden field ──────────
      data.set('_subject', `Website Ticket Inquiry - ${clinicName}`);

      try {
        const res = await fetch('https://formspree.io/f/mqevkylb', {
          method:'POST', body: data, headers:{ 'Accept':'application/json' }
        });
        if (res.ok) {
          // ── SUCCESS MESSAGE ─────────────────────────────
          showMsg(msgEl, 'success', 'Thank you. Your message has been sent successfully.');
          contactForm.reset();
        } else {
          // ── ERROR MESSAGE ───────────────────────────────
          showMsg(msgEl, 'error', 'Something went wrong. Please try again or contact us directly.');
        }
      } catch {
        showMsg(msgEl, 'error', 'Something went wrong. Please try again or contact us directly.');
      }
    });

    const cancelBtn = contactForm.querySelector('.btn-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', () => { contactForm.reset(); hideMsg(msgEl); });
  }

  /* ── 11. SEND CASE FORM — Formspree ───────────────────── */
  /*
    FORMSPREE ENDPOINT: https://formspree.io/f/xkolnqba
    Submissions go to: digital@tru-smile.ca
    Subject format: Website Case Submission - [Clinic Name]

    CC NOTE:
    Formspree free/basic plans do not support CC natively.
    To copy dana.fraij@tru-smile.ca, do ONE of the following:
      Option A — In your Formspree dashboard → Form Settings → Notifications,
                 add dana.fraij@tru-smile.ca as an additional email recipient.
      Option B — Set up an email forwarding rule on digital@tru-smile.ca
                 to automatically forward to dana.fraij@tru-smile.ca.
  */
  const caseForm = document.getElementById('caseForm');
  if (caseForm) {
    const msgEl = caseForm.querySelector('.form-msg');

    caseForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!validateForm(caseForm)) return;

      const clinicName = caseForm.querySelector('[name="clinic_name"]').value.trim();
      const data = new FormData(caseForm);

      // ── EMAIL SUBJECT ───────────────────────────────────
      data.set('_subject', `Website Case Submission - ${clinicName}`);

      // Append selected teeth from hidden inputs
      const ut = document.getElementById('upper_teeth');
      const lt = document.getElementById('lower_teeth');
      if (ut) data.set('upper_teeth', ut.value);
      if (lt) data.set('lower_teeth', lt.value);

      try {
        const res = await fetch('https://formspree.io/f/xkolnqba', {
          method:'POST', body: data, headers:{ 'Accept':'application/json' }
        });
        if (res.ok) {
          // ── SUCCESS MESSAGE ─────────────────────────────
          showMsg(msgEl, 'success', 'Thank you. Your case has been submitted successfully.');
          caseForm.reset();
          document.querySelectorAll('.tooth-btn').forEach(b => b.classList.remove('selected'));
          const rx = document.getElementById('rx_date');
          if (rx) rx.value = new Date().toISOString().split('T')[0];
        } else {
          // ── ERROR MESSAGE ───────────────────────────────
          showMsg(msgEl, 'error', 'Something went wrong. Please try again or contact us directly.');
        }
      } catch {
        showMsg(msgEl, 'error', 'Something went wrong. Please try again or contact us directly.');
      }
    });

    const cancelBtn = caseForm.querySelector('.btn-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', () => {
      caseForm.reset();
      document.querySelectorAll('.tooth-btn').forEach(b => b.classList.remove('selected'));
      const rx = document.getElementById('rx_date');
      if (rx) rx.value = new Date().toISOString().split('T')[0];
      hideMsg(msgEl);
    });
  }

  /* ── 12. Form validation ───────────────────────────────── */
  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
    form.querySelectorAll('.error-msg').forEach(el => el.remove());

    form.querySelectorAll('[required]').forEach(field => {
      if (field.type === 'checkbox') {
        if (!field.checked) { markError(field,'Please confirm to proceed.'); valid=false; }
      } else if (!field.value.trim()) {
        markError(field,'This field is required.'); valid=false;
      } else if (field.type==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        markError(field,'Enter a valid email address.'); valid=false;
      }
    });
    if (!valid) {
      const first = form.querySelector('.field-error');
      if (first) first.scrollIntoView({ behavior:'smooth', block:'center' });
    }
    return valid;
  }

  function markError(field, msg) {
    const group = field.closest('.form-group') || field.parentElement;
    group.classList.add('field-error');
    const err = document.createElement('span');
    err.className = 'error-msg'; err.textContent = msg;
    group.appendChild(err);
  }

  function showMsg(el, type, text) {
    if (!el) return;
    el.className = 'form-msg ' + type;
    el.textContent = text;
    el.scrollIntoView({ behavior:'smooth', block:'center' });
  }
  function hideMsg(el) { if (el) { el.className='form-msg'; el.textContent=''; } }

});
