/* SSV Print Pack — interactions and motion.
   No dependencies besides Lenis (smooth scrolling), loaded before this file. */
(() => {
  'use strict';

  // Where quote requests go.
  // WhatsApp: international format, digits only.
  const WHATSAPP_NUMBER = '917030363555';
  // Email: delivered by FormSubmit (formsubmit.co, free, no server needed). The first submission sends an
  // activation link to this inbox; click it once. FormSubmit then emails a random-string alias: put it in
  // place of the address below to keep the address out of the page source.
  const QUOTE_EMAIL = 'shetekunal22@gmail.com';
  const QUOTE_ENDPOINT = `https://formsubmit.co/ajax/${QUOTE_EMAIL}`;
  const PHONE_DISPLAY = '+91 70303 63555';

  const html = document.documentElement;
  const motion = html.classList.contains('motion');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ---------- intro: wait for fonts so the headline animates in its real shape ---------- */
  const ready = () => html.classList.add('is-ready');
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(ready);
  } else {
    ready();
  }

  /* ---------- smooth scrolling ---------- */
  let lenis = null;
  if (motion && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
  const scrollToEl = (el) => {
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.5, easing: easeOutQuart });
    else el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'start' });
  };

  /* ---------- mobile menu ---------- */
  const menu = $('[data-menu]');
  const menuBtn = $('[data-menu-toggle]');
  const menuLabel = $('[data-menu-label]');
  let menuOpen = false;
  const setMenu = (open) => {
    if (!menu || open === menuOpen) return;
    menuOpen = open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuLabel.textContent = open ? 'Close menu' : 'Open menu';
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
      if (lenis) lenis.stop(); else html.style.overflow = 'hidden';
      const first = $('a', menu);
      if (first) first.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      if (lenis) lenis.start(); else html.style.overflow = '';
      const done = () => { if (!menuOpen) menu.hidden = true; };
      if (motion) menu.addEventListener('transitionend', done, { once: true }); else done();
    }
  };
  if (menuBtn) menuBtn.addEventListener('click', () => setMenu(!menuOpen));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- in-page links ---------- */
  const preselectFamily = (family) => {
    const radio = $(`input[name="family"][value="${family}"]`);
    if (radio) radio.checked = true;
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    if (a.dataset.family) preselectFamily(a.dataset.family);
    const wasOpen = menuOpen;
    setMenu(false);
    // Let the menu start closing before the page glides away.
    setTimeout(() => {
      scrollToEl(target);
      if (id !== 'top') {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }, wasOpen ? 120 : 0);
  });

  /* ---------- reveal on scroll ---------- */
  if (motion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    $$('[data-r]').forEach((el) => io.observe(el));
    html.classList.add('io');
  }

  /* ---------- scroll-linked scenes ---------- */
  const head = $('[data-head]');
  const fold = $('[data-fold]');
  const scrubs = motion ? $$('[data-scrub]') : [];
  const pars = motion ? $$('[data-par]') : [];
  // Pin the fold scene only where the screen is tall enough to hold it (not phones in landscape).
  let pinned = false;
  const updatePin = () => {
    const on = motion && !!fold && window.innerHeight >= 560;
    if (on === pinned) return;
    pinned = on;
    html.classList.toggle('pin', on);
    if (!on && fold) { fold.style.removeProperty('--p'); delete fold.dataset.step; }
    if (lenis) lenis.resize();
  };
  updatePin();

  let lastY = window.scrollY;
  let queued = false;
  const frame = () => {
    queued = false;
    const vh = window.innerHeight;
    const y = window.scrollY;

    if (pinned) {
      const r = fold.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
      fold.style.setProperty('--p', p.toFixed(4));
      fold.dataset.step = String(Math.min(3, Math.floor(p * 4)));
    }
    scrubs.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      el.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height), 0, 1).toFixed(4));
    });
    pars.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -300 || r.top > vh + 300) return;
      const k = parseFloat(el.dataset.par) || 0.1;
      el.style.setProperty('--py', ((r.top + r.height / 2 - vh / 2) * -k).toFixed(1) + 'px');
    });

    html.style.setProperty('--sp', (y / Math.max(1, document.documentElement.scrollHeight - vh)).toFixed(4));
    if (head) {
      head.toggleAttribute('data-scrolled', y > 24);
      if (Math.abs(y - lastY) > 4) head.toggleAttribute('data-hide', !menuOpen && y > lastY && y > 600);
    }
    lastY = y;
  };
  const requestFrame = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', () => { updatePin(); requestFrame(); });
  frame();

  /* ---------- pointer details: magnetic buttons, tilting dieline ---------- */
  if (motion && finePointer) {
    let magnet = null;
    const release = (el) => { el.style.setProperty('--tx', '0px'); el.style.setProperty('--ty', '0px'); };
    document.addEventListener('pointermove', (e) => {
      const m = e.target.closest('[data-magnet]');
      if (magnet && magnet !== m) release(magnet);
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.setProperty('--tx', ((e.clientX - r.left - r.width / 2) * 0.2).toFixed(1) + 'px');
        m.style.setProperty('--ty', ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px');
      }
    }, { passive: true });

    const tilt = $('[data-tilt]');
    if (tilt) {
      tilt.addEventListener('pointermove', (e) => {
        const r = tilt.getBoundingClientRect();
        tilt.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2) + 'deg');
        tilt.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -8).toFixed(2) + 'deg');
      }, { passive: true });
      tilt.addEventListener('pointerleave', () => {
        tilt.style.setProperty('--rx', '0deg');
        tilt.style.setProperty('--ry', '0deg');
      });
    }
  }

  /* ---------- sample book: touch screens fan it open when it comes into view ---------- */
  const fan = $('[data-fan]');
  if (fan && !finePointer) {
    if ('IntersectionObserver' in window) {
      const fio = new IntersectionObserver(([entry]) => fan.classList.toggle('is-open', entry.isIntersecting), { threshold: 0.6 });
      fio.observe(fan);
    } else {
      fan.classList.add('is-open');
    }
  }

  /* ---------- spec sheet filter ---------- */
  const spec = $('[data-spec]');
  const filterBtns = $$('[data-filter]');
  const filterStatus = $('[data-filter-status]');
  if (spec && filterBtns.length) {
    const rows = $$('tbody tr', spec);
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const fam = btn.dataset.filter;
        filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        let shown = 0;
        rows.forEach((row) => {
          const on = fam === 'all' || row.dataset.fam === fam;
          row.hidden = !on;
          if (on) row.style.setProperty('--i', String(shown++));
        });
        // Replay the deal-in animation for the rows now on show.
        spec.classList.remove('is-dealing');
        void spec.offsetWidth;
        spec.classList.add('is-dealing');
        if (filterStatus) filterStatus.textContent = `Showing ${shown} ${fam === 'all' ? '' : btn.firstChild.textContent.trim().toLowerCase() + ' '}formats`;
        if (lenis) lenis.resize();
        requestFrame();
      });
    });
  }

  /* ---------- quote docket → email (FormSubmit) or WhatsApp ---------- */
  const form = $('[data-quote]');
  if (form) {
    const note = $('[data-form-note]', form);
    const emailBtn = $('[data-send-email]', form);
    const emailLabel = $('[data-label]', emailBtn);
    const waBtn = $('[data-send-whatsapp]', form);
    const stampDate = $('[data-stamp-date]', form);
    const setNote = (text, kind) => {
      note.textContent = text;
      note.classList.toggle('is-error', kind === 'error');
      note.classList.toggle('is-ok', kind === 'ok');
    };

    // Returns the details, or null after flagging what is missing.
    const collect = () => {
      const data = new FormData(form);
      const v = (key) => String(data.get(key) || '').trim();
      const d = { name: v('name'), phone: v('phone'), email: v('email'), family: v('family') || '-', quantity: v('quantity'), notes: v('notes'), honey: v('_honey') };
      const bad = [];
      [['name', !d.name], ['phone', !d.phone], ['email', d.email && !form.elements.email.checkValidity()]].forEach(([field, invalid]) => {
        form.elements[field].setAttribute('aria-invalid', String(Boolean(invalid)));
        if (invalid) bad.push(form.elements[field]);
      });
      if (bad.length) {
        setNote(bad[0].name === 'email' ? 'That email address doesn’t look right.' : 'Please add your name and phone number.', 'error');
        bad[0].focus();
        return null;
      }
      return d;
    };

    const busy = (on) => {
      form.classList.toggle('is-sending', on);
      [emailBtn, waBtn].forEach((b) => { b.disabled = on; });
      emailBtn.setAttribute('aria-busy', String(on));
      emailLabel.textContent = on ? 'Sending…' : 'Email the docket';
    };

    form.addEventListener('input', () => form.classList.remove('is-sent'));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const d = collect();
      if (!d) return;
      busy(true);
      setNote('Sending your docket…');
      const done = () => {
        form.reset();
        if (stampDate) stampDate.textContent = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        form.classList.remove('is-sent');
        void form.offsetWidth;
        form.classList.add('is-sent');
        setNote(`Thanks, ${d.name.split(' ')[0]}. Your docket is with SSV Print Pack — expect a reply on ${d.phone}${d.email ? ' or by email' : ''}.`, 'ok');
      };
      // Bots fill the hidden field; let them think it worked.
      if (d.honey) { busy(false); done(); return; }
      const payload = {
        _subject: `Quote request: ${d.family} — ${d.name}`,
        _template: 'table',
        _captcha: 'false',
        Name: d.name,
        Phone: d.phone,
        Packaging: d.family,
        'Quantity & size': d.quantity || '-',
        Notes: d.notes || '-',
        'Sent from': window.location.href
      };
      if (d.email) payload.email = d.email; // FormSubmit uses this as the Reply-To address
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch(QUOTE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
          signal: ctrl.signal
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || String(out.success) !== 'true') throw new Error(out.message || `HTTP ${res.status}`);
        done();
      } catch (err) {
        const why = err.name === 'AbortError' ? 'the connection timed out.'
          : err.name === 'TypeError' ? 'the connection failed.'
          : (err.message || 'something went wrong.').replace(/([^.!?])$/, '$1.');
        setNote(`Couldn’t send by email: ${why} Use “WhatsApp instead” or call ${PHONE_DISPLAY}.`, 'error');
      } finally {
        clearTimeout(timer);
        busy(false);
      }
    });

    waBtn.addEventListener('click', () => {
      const d = collect();
      if (!d) return;
      const lines = [
        'Hello SSV Print Pack, I would like a quote.',
        '',
        `Name: ${d.name}`,
        `Phone: ${d.phone}`,
        d.email ? `Email: ${d.email}` : null,
        `Packaging: ${d.family}`,
        `Quantity & size: ${d.quantity || '-'}`,
        `Notes: ${d.notes || '-'}`
      ].filter((l) => l !== null);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
      const win = window.open(url, '_blank');
      if (win) {
        win.opener = null;
        setNote('WhatsApp opened in a new tab. Send the message there to finish.', 'ok');
      } else {
        // Pop-up blocked: continue in this tab instead.
        window.location.href = url;
      }
    });
  }

  /* ---------- footer year ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
