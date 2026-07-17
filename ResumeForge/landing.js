/**
 * ResumeForge — Landing Page Script
 * Navbar scroll, reveal animations, counter animations, theme toggle
 */

/* ─────────────────────────────────────────
   THEME
───────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('rf-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ── Theme Toggle ── */
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('rf-theme', next);
    });
  }

  /* ── Navbar Scroll ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Intersection Observer — Reveal on scroll ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  }

  /* ── Animated Stat Counters ── */
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statResumes   = document.getElementById('stat-resumes');
    const statAts       = document.getElementById('stat-ats');
    const statInterviews= document.getElementById('stat-interviews');

    let counted = false;
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        if (statResumes)    animateCounter(statResumes,    0, 52000, 2000, '+');
        if (statAts)        animateCounter(statAts,        0, 34,    1800, '%');
        if (statInterviews) animateCounter(statInterviews, 0, 67,    1600, '%');
      }
    }, { threshold: 0.3 });
    counterObserver.observe(statsSection);
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

/* ─────────────────────────────────────────
   Counter animation utility (used from landing page)
───────────────────────────────────────── */
function animateCounter(el, from, to, duration, suffix = '') {
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const val = Math.round(from + (to - from) * easeOut(progress));
    el.textContent = val.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
