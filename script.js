// script.js — shared for index.html + creativecon + contact

// DOM helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// Tilt effect for elements with data-tilt
function initTilt(selector = '[data-tilt]') {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    let frameId = null;
    const updateTilt = (e) => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rotY = (px - 0.5) * 12; 
        const rotX = (py - 0.5) * -8; 
        el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
        frameId = null;
      });
    };
    const resetTilt = () => {
      if (frameId) cancelAnimationFrame(frameId);
      el.style.transform = 'none';
    };
    el.addEventListener('mousemove', updateTilt);
    el.addEventListener('mouseleave', resetTilt);
  });
}

// GSAP animations & ScrollTrigger
function initGSAP(){
  if(typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // --- HOME PAGE ANIMATIONS ---
  if(document.querySelector('.hero-centered')) {
    gsap.from('.hero-centered h1, .hero-centered p', { y: 40, opacity: 0, duration: 1.0, stagger: 0.12, ease: 'power3.out' });
    gsap.from('.hero-ctas', { scale: 0.9, opacity: 0, duration: 0.8, delay: 0.5 });
  }

  // Event card reveal
  const eventCard = document.querySelector('.event-card');
  if(eventCard) gsap.from(eventCard, { scrollTrigger: { trigger: eventCard, start: 'top 92%' }, opacity: 0, y: 30, duration: 0.8 });

  // About & Footer reveal
  if(document.querySelector('.writeup')) {
      gsap.from('.writeup', { scrollTrigger: { trigger: '.writeup', start: 'top 88%' }, opacity: 0, x: -40, duration: 0.9 });
  }
  if(document.querySelector('.mega-contact-footer')) {
      gsap.from('.mega-contact-footer', { scrollTrigger: { trigger: '.mega-contact-footer', start: 'top 95%' }, opacity: 0, y: 20, duration: 0.8 });
  }

  // --- CONTACT PAGE ANIMATIONS ---
  if(document.querySelector('.creative-contact-layout')) {
      gsap.from('.contact-hook h1, .contact-hook p', { x: -50, opacity: 0, duration: 1, stagger: 0.2 });
      gsap.from('.glass-form-wrapper', { x: 50, opacity: 0, duration: 1, delay: 0.3 });
      gsap.from('.bg-text-layer', { scale: 0.8, opacity: 0, duration: 2, ease: "power2.out" });
  }

  // --- CREATIVE CON PAGE ANIMATIONS ---
  if(document.querySelector('.con-hero-section')) {
    gsap.from('.con-hero-text h1, .con-hero-text p, .con-hero-text .con-tagline', {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out'
    });
    gsap.from('.floating-poster', {
        scale: 0.8, opacity: 0, rotation: -10, duration: 1.2, delay: 0.3, ease: 'back.out(1.7)'
    });
    gsap.utils.toArray('.role-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 90%' },
            y: 50, opacity: 0, duration: 0.6, delay: i * 0.1
        });
    });
  }
}

// Countdown helper
function countdownStart(targetDate, ids) {
  function updateOnce() {
    const now = new Date();
    const diff = targetDate - now;
    if(diff <= 0) return;
    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff / (1000*60*60)) % 24);
    const m = Math.floor((diff / (1000*60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    const elD = document.getElementById(ids.d); if(elD) elD.textContent = String(d).padStart(2,'0');
    const elH = document.getElementById(ids.h); if(elH) elH.textContent = String(h).padStart(2,'0');
    const elM = document.getElementById(ids.m); if(elM) elM.textContent = String(m).padStart(2,'0');
    const elS = document.getElementById(ids.s); if(elS) elS.textContent = String(s).padStart(2,'0');
  }
  updateOnce();
  return setInterval(updateOnce, 1000);
}

// --- UPDATED MODAL LOGIC (Works on all pages) ---
function initModal() {
  const modal = document.getElementById('subscribe-modal-overlay');
  
  if (modal) {
    const closeBtn = modal.querySelector('.modal-close-btn');
    const closeModal = () => modal.classList.remove('is-visible');
    const openModal = () => modal.classList.add('is-visible');

    // 1. Listen for the main ID button (Home Page Bottom)
    const mainBtn = document.getElementById('open-subscribe-modal');
    if(mainBtn) mainBtn.addEventListener('click', openModal);

    // 2. Listen for ANY button with class .btn-subscribe (Sub-Pages)
    document.querySelectorAll('.btn-subscribe, .btn-nav-subscribe').forEach(btn => {
        btn.addEventListener('click', (e) => {
             e.preventDefault();
             openModal();
        });
    });

    // Close logic
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
            closeModal();
        }
    });
  }
}

// --- NEW: MOBILE MENU LOGIC ---
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.navlinks');

    if (hamburger && navMenu) {
        // Toggle Menu
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle Icon (Bars <-> Times)
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close when link clicked
        navMenu.querySelectorAll('a, button').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// --- NEW: B.M.A MANUAL SCROLL LOGIC ---
function initServiceScroll() {
    const ribbon = document.querySelector('.service-ribbon');
    if (!ribbon) return;

    // We attach this to the window so the onclick="" in HTML can find it
    window.scrollServices = (direction) => {
        // 1. Stop the infinite animation so it doesn't fight the JS
        ribbon.style.animation = 'none';

        // 2. Get current position
        const style = window.getComputedStyle(ribbon);
        const matrix = new WebKitCSSMatrix(style.transform);
        const currentX = matrix.m41;

        // 3. Move left or right (approx card width + gap = 344px)
        const moveAmount = 344; 
        const newX = direction === 'next' ? currentX - moveAmount : currentX + moveAmount;

        // 4. Apply new transform with transition
        ribbon.style.transform = `translateX(${newX}px)`;
        ribbon.style.transition = 'transform 0.5s ease-out';
    };
}

// Forms wiring
function initForms(){
  document.querySelectorAll('form').forEach(f=>{
    f.addEventListener('submit', (e)=>{
      e.preventDefault();
      const btn = f.querySelector('button[type="submit"], button');
      const oldHTML = btn ? btn.innerHTML : null;
      if(btn) {
          if(btn.classList.contains('btn-submit-innovative')) {
             btn.innerHTML = '<span>Message Sent!</span><div class="btn-bg"></div>';
             btn.style.borderColor = '#6AFFD1'; 
             btn.style.color = '#6AFFD1';
          } else {
             btn.innerHTML = 'Message Sent!';
             btn.style.backgroundColor = '#6AFFD1';
             btn.style.color = '#3B0458';
          }
      }
      setTimeout(()=>{ 
          if(btn) {
              btn.innerHTML = oldHTML; 
              btn.style.borderColor = '';
              btn.style.backgroundColor = '';
              btn.style.color = '';
          }
      }, 2000);
      f.reset();
    });
  });
}

// --- INITIALIZATION BLOCK ---
document.addEventListener('DOMContentLoaded', ()=> {
  initTilt();
  initGSAP();
  initModal();
  initForms();
  initMobileMenu(); 
  initServiceScroll(); // <--- Added BMA Scroll Logic

  // Date
  document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

  // Countdown Logic
  if(document.getElementById('d-days')){
    const homeTarget = new Date(); homeTarget.setDate(homeTarget.getDate() + 45);
    countdownStart(homeTarget, {d:'d-days', h:'d-hours', m:'d-mins', s:'d-secs'});
  }
  if(document.getElementById('c-days')){
    const conTarget = new Date(); conTarget.setDate(conTarget.getDate() + 45);
    countdownStart(conTarget, {d:'c-days', h:'c-hours', m:'c-mins', s:'c-secs'});
  }

  // Textarea logic
  const textareas = document.querySelectorAll('.innovative-form textarea');
  textareas.forEach(ta => {
    ta.addEventListener('blur', () => {
        if(ta.value !== "") ta.classList.add('has-content');
        else ta.classList.remove('has-content');
    });
  });
});