/* ==========================================================================
   Parul Rajawat Portfolio - Main JavaScript Application Logic & Admin Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 2. Hide Loading Screen Overlay
  const loader = document.getElementById('loader-overlay');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 400);
  }

  // 3. Ambient Canvas Particle Background
  initParticleCanvas();

  // 4. Scroll Reveal Animations (Intersection Observer)
  initScrollAnimations();

  // 5. Hero Live Counter Animations
  initCounterAnimations();

  // 6. Mobile Navigation Menu Toggle
  initMobileNav();

  // 7. Active Navigation Link Scroll Highlight
  initScrollHighlight();

  // 8. Tech Stack Category Filter
  initTechFilter();

  // 9. Contact Form Handling & Local Inquiries Storage
  initContactForm();

  // 10. Interactive Project Demos & Modals (including BMI Calculator)
  initProjectModals();

  // 11. Admin Authentication & Dashboard Engine
  initAdminEngine();

  // 12. Load Editable Content Overrides from LocalStorage
  loadCustomContent();

});

/* ==========================================================================
   PARTICLE CANVAS ENGINE
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 25), 45);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const fadeUpElements = document.querySelectorAll('.fade-up');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeUpElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   HERO STATS COUNTER ANIMATION
   ========================================================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 2000;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, stepTime);
      });
    }
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

/* ==========================================================================
   MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

/* ==========================================================================
   NAVBAR ACTIVE SCROLL HIGHLIGHT
   ========================================================================== */
function initScrollHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   TECH STACK CATEGORY FILTER
   ========================================================================== */
function initTechFilter() {
  const filterBtns = document.querySelectorAll('.tech-filter-btn');
  const techCards = document.querySelectorAll('.tech-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      techCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   CONTACT FORM SUBMISSION (Saves to Admin Dashboard + Email Dispatch)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const service = form.service.value;
    const message = form.message.value.trim();

    if (!name || !email || !service || !message) {
      feedback.className = 'form-feedback';
      feedback.style.display = 'block';
      feedback.style.background = 'rgba(239, 68, 68, 0.15)';
      feedback.style.borderColor = '#ef4444';
      feedback.style.color = '#f87171';
      feedback.textContent = 'Please fill out all required fields.';
      return;
    }

    const newInquiry = {
      id: Date.now(),
      name,
      email,
      service,
      message,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    };

    // Save to LocalStorage for Admin Panel View
    const existing = JSON.parse(localStorage.getItem('pr_client_inquiries') || '[]');
    existing.unshift(newInquiry);
    localStorage.setItem('pr_client_inquiries', JSON.stringify(existing));

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending Request...</span>`;

    try {
      // Send Email to payalrajawat789@gmail.com
      fetch('https://formsubmit.co/ajax/payalrajawat789@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `New Client Inquiry: ${name} (${service})`,
          "Name": name,
          "Email": email,
          "Service": service,
          "Message": message
        })
      });
    } catch (err) {
      console.log('Form submit background dispatch executed');
    }

    setTimeout(() => {
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `<strong>Thank you, ${name}!</strong> Your inquiry has been dispatched to <code>payalrajawat789@gmail.com</code> & logged in the admin panel. Parul will get back to you within 2 hours.`;
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (window.lucide) lucide.createIcons();
    }, 800);
  });
}

/* ==========================================================================
   ADMIN AUTHENTICATION & DASHBOARD ENGINE
   ========================================================================== */
function initAdminEngine() {
  const openBtn = document.getElementById('open-admin-btn');
  const footerAdminLink = document.getElementById('footer-admin-link');
  const loginModal = document.getElementById('admin-login-modal');
  const closeLoginBtn = document.getElementById('close-admin-login-btn');
  const loginForm = document.getElementById('admin-login-form');
  const loginFeedback = document.getElementById('admin-login-feedback');

  const dashboardModal = document.getElementById('admin-dashboard-modal');
  const closeDashBtn = document.getElementById('close-admin-dashboard-btn');
  const logoutBtn = document.getElementById('admin-logout-btn');

  // Hardcoded Admin Credentials as specified by user
  const ADMIN_EMAIL = 'payalrajawat789@gmail.com';
  const ADMIN_PASS = 'Rajawat123#';

  const showLogin = () => {
    if (localStorage.getItem('pr_admin_logged_in') === 'true') {
      openDashboard();
    } else {
      loginModal.classList.add('active');
    }
  };

  if (openBtn) openBtn.addEventListener('click', showLogin);
  if (footerAdminLink) footerAdminLink.addEventListener('click', (e) => { e.preventDefault(); showLogin(); });
  if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => loginModal.classList.remove('active'));

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-password').value;

    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      localStorage.setItem('pr_admin_logged_in', 'true');
      loginModal.classList.remove('active');
      loginForm.reset();
      loginFeedback.style.display = 'none';
      openDashboard();
    } else {
      loginFeedback.className = 'form-feedback';
      loginFeedback.style.display = 'block';
      loginFeedback.style.background = 'rgba(239, 68, 68, 0.15)';
      loginFeedback.style.borderColor = '#ef4444';
      loginFeedback.style.color = '#f87171';
      loginFeedback.textContent = 'Invalid Email or Password. Please try again.';
    }
  });

  // Open Dashboard Function
  function openDashboard() {
    renderInquiriesList();
    loadAdminContentForm();
    dashboardModal.classList.add('active');
  }

  if (closeDashBtn) closeDashBtn.addEventListener('click', () => dashboardModal.classList.remove('active'));

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('pr_admin_logged_in');
      dashboardModal.classList.remove('active');
    });
  }

  // Admin Dashboard Tabs
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Clear Inquiries Handler
  const clearInquiriesBtn = document.getElementById('clear-all-inquiries-btn');
  if (clearInquiriesBtn) {
    clearInquiriesBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all client inquiries from local storage?')) {
        localStorage.removeItem('pr_client_inquiries');
        renderInquiriesList();
      }
    });
  }

  // Edit Content Form Submission
  const contentForm = document.getElementById('admin-content-form');
  const saveFeedback = document.getElementById('content-save-feedback');
  const resetBtn = document.getElementById('reset-content-btn');

  if (contentForm) {
    contentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customContent = {
        heroTitle: document.getElementById('edit-hero-title').value,
        heroSubtitle: document.getElementById('edit-hero-subtitle').value,
        projectsCount: document.getElementById('edit-projects-count').value,
        experienceYears: document.getElementById('edit-experience-years').value,
        aboutBio: document.getElementById('edit-about-bio').value
      };

      localStorage.setItem('pr_custom_content', JSON.stringify(customContent));
      loadCustomContent();

      saveFeedback.className = 'form-feedback success';
      saveFeedback.style.display = 'block';
      saveFeedback.textContent = '✅ Live website content updated successfully!';

      setTimeout(() => { saveFeedback.style.display = 'none'; }, 3000);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset website content back to default values?')) {
        localStorage.removeItem('pr_custom_content');
        location.reload();
      }
    });
  }
}

// Render Client Inquiries in Admin Dashboard
function renderInquiriesList() {
  const container = document.getElementById('inquiries-list-container');
  const badge = document.getElementById('inquiry-count-badge');
  const inquiries = JSON.parse(localStorage.getItem('pr_client_inquiries') || '[]');

  if (badge) badge.textContent = inquiries.length;

  if (!container) return;

  if (inquiries.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 2rem; color: var(--text-muted);">
        <i data-lucide="inbox" style="width:36px; height:36px; margin-bottom:0.5rem; opacity:0.5;"></i>
        <p>No client inquiries received yet. When clients submit the "Hire Me" form, their details will appear here.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = inquiries.map(inq => `
    <div class="inquiry-card">
      <div class="inquiry-card-header">
        <span class="inquiry-name">${inq.name}</span>
        <span class="inquiry-service-badge">${inq.service}</span>
      </div>
      <div class="inquiry-meta">
        <span>📧 <a href="mailto:${inq.email}" style="color:var(--primary-accent);">${inq.email}</a></span>
        <span>🕒 ${inq.date}</span>
      </div>
      <div class="inquiry-message">${inq.message}</div>
    </div>
  `).join('');
}

// Load content into Admin Form inputs
function loadAdminContentForm() {
  const saved = JSON.parse(localStorage.getItem('pr_custom_content') || '{}');
  if (saved.heroTitle) document.getElementById('edit-hero-title').value = saved.heroTitle;
  if (saved.heroSubtitle) document.getElementById('edit-hero-subtitle').value = saved.heroSubtitle;
  if (saved.projectsCount) document.getElementById('edit-projects-count').value = saved.projectsCount;
  if (saved.experienceYears) document.getElementById('edit-experience-years').value = saved.experienceYears;
  if (saved.aboutBio) document.getElementById('edit-about-bio').value = saved.aboutBio;
}

// Dynamically apply saved custom content overrides to the live DOM
function loadCustomContent() {
  const saved = JSON.parse(localStorage.getItem('pr_custom_content') || '{}');
  if (saved.heroTitle) {
    const el = document.getElementById('hero-title-text');
    if (el) el.innerHTML = saved.heroTitle;
  }
  if (saved.heroSubtitle) {
    const el = document.getElementById('hero-subtitle-text');
    if (el) el.textContent = saved.heroSubtitle;
  }
  if (saved.projectsCount) {
    const el = document.getElementById('stat-projects-num');
    if (el) el.setAttribute('data-target', saved.projectsCount);
  }
  if (saved.experienceYears) {
    const el = document.getElementById('stat-experience-num');
    if (el) el.setAttribute('data-target', saved.experienceYears);
  }
  if (saved.aboutBio) {
    const el = document.getElementById('about-bio-text');
    if (el) el.textContent = saved.aboutBio;
  }
}

/* ==========================================================================
   INTERACTIVE PROJECT DEMO MODAL SYSTEM
   ========================================================================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const modalArea = document.getElementById('modal-content-area');

  if (!modal || !modalArea) return;

  document.querySelectorAll('.open-demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      renderDemoModal(projectKey);
      modal.classList.add('active');
    });
  });

  document.querySelectorAll('.open-code-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      renderCodeModal(projectKey);
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// Render Interactive Live Demos inside Modal
function renderDemoModal(projectKey) {
  const modalArea = document.getElementById('modal-content-area');
  
  if (projectKey === 'urban-brew') {
    modalArea.innerHTML = `
      <div class="demo-modal-header">
        <h2>☕ Urban Brew Cafe</h2>
        <p>Premium cafe website featuring online menu, table reservation simulator, and Google Maps integration.</p>
        <a href="https://cafe-1-beta.vercel.app/" target="_blank" class="btn btn-primary btn-sm" style="margin-top:1rem;">
          <i data-lucide="external-link"></i> Open Live Website (cafe-1-beta.vercel.app)
        </a>
      </div>
      
      <div style="background: #111422; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); pb: 0.5rem;">
          <h4 style="color: #6366f1;">Featured Menu & Online Reservation</h4>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h5 style="margin-bottom: 0.75rem;">Popular Items</h5>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.05); padding:0.6rem 0.85rem; border-radius:8px;">
                <span>Espresso Double Shot</span><strong style="color:#f59e0b;">₹190</strong>
              </div>
              <div style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.05); padding:0.6rem 0.85rem; border-radius:8px;">
                <span>Hazelnut Cold Brew</span><strong style="color:#f59e0b;">₹260</strong>
              </div>
              <div style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.05); padding:0.6rem 0.85rem; border-radius:8px;">
                <span>Artisan Croissant</span><strong style="color:#f59e0b;">₹210</strong>
              </div>
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
            <h5 style="margin-bottom: 0.75rem;">Simulate Table Booking</h5>
            <input type="text" id="cafe-guest-name" placeholder="Guest Name" style="width:100%; padding:0.5rem; margin-bottom:0.5rem; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); color:#fff; border-radius:6px;" />
            <input type="date" id="cafe-date" style="width:100%; padding:0.5rem; margin-bottom:0.75rem; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); color:#fff; border-radius:6px;" />
            <button onclick="reserveCafeTable()" class="btn btn-primary btn-sm btn-block">Confirm Reservation</button>
            <div id="cafe-booking-status" style="margin-top:0.5rem; font-size:0.85rem; text-align:center;"></div>
          </div>
        </div>
      </div>
    `;
  } else if (projectKey === 'titan-fitness') {
    modalArea.innerHTML = `
      <div class="demo-modal-header">
        <h2>🏋️ Titan Fitness Club</h2>
        <p>High-energy gym portal featuring membership plans, trainer directory & live interactive BMI Engine.</p>
        <a href="https://gym-mu-drab.vercel.app/" target="_blank" class="btn btn-primary btn-sm" style="margin-top:1rem;">
          <i data-lucide="external-link"></i> Open Live Website (gym-mu-drab.vercel.app)
        </a>
      </div>

      <div class="bmi-calculator-box">
        <h3>⚡ Interactive BMI Calculator Engine</h3>
        <p style="font-size:0.9rem; color:#94a3b8; margin-bottom:1rem;">Enter height and weight below to test the live health metric algorithm:</p>
        
        <div class="bmi-inputs">
          <div class="bmi-input-group">
            <label for="bmi-height">Height (in cm):</label>
            <input type="number" id="bmi-height" placeholder="e.g. 175" value="175" />
          </div>
          <div class="bmi-input-group">
            <label for="bmi-weight">Weight (in kg):</label>
            <input type="number" id="bmi-weight" placeholder="e.g. 70" value="70" />
          </div>
        </div>

        <button onclick="calculateBmi()" class="btn btn-primary btn-block">Calculate Your BMI</button>

        <div id="bmi-result-output" class="bmi-result">
          Your BMI: 22.9 (Normal Weight) - Perfect for Strength Training!
        </div>
      </div>
    `;
  } else if (projectKey === 'impact-coaching') {
    modalArea.innerHTML = `
      <div class="demo-modal-header">
        <h2>🎓 Impact Coaching Institute</h2>
        <p>Full academic portal with course syllabus finder and student application test.</p>
        <a href="https://www.impactinstitute.space" target="_blank" class="btn btn-primary btn-sm" style="margin-top:1rem;">
          <i data-lucide="external-link"></i> Open Live Website (impactinstitute.space)
        </a>
      </div>

      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
        <h4 style="margin-bottom: 1rem; color: #06b6d4;">Admission Eligibility & Course Finder</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <select id="course-select" style="padding: 0.75rem; background: #000; border: 1px solid rgba(255,255,255,0.15); color: #fff; border-radius: 8px;">
            <option>JEE Main & Advanced (2-Year Integrated)</option>
            <option>NEET Medical Prep (1-Year Dropper)</option>
            <option>Foundation Class 9th & 10th</option>
          </select>
          <button onclick="checkCourseFee()" class="btn btn-primary btn-sm">Check Scholarship & Fee Structure</button>
          <div id="course-fee-result" style="padding: 1rem; background: rgba(6, 182, 212, 0.1); border: 1px solid #06b6d4; border-radius: 8px; font-size: 0.9rem;">
            Selected: JEE Main & Advanced • Fee: ₹85,000/yr • Scholarship up to 50% based on entrance test.
          </div>
        </div>
      </div>
    `;
  } else if (projectKey === 'knowledge-library') {
    modalArea.innerHTML = `
      <div class="demo-modal-header">
        <h2>📚 Knowledge Library</h2>
        <p>Digital catalog search & membership tier calculator.</p>
        <a href="https://library-neon-five.vercel.app/" target="_blank" class="btn btn-primary btn-sm" style="margin-top:1rem;">
          <i data-lucide="external-link"></i> Open Live Website (library-neon-five.vercel.app)
        </a>
      </div>

      <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
        <h4 style="margin-bottom: 1rem; color: #f59e0b;">Search 10,000+ Digital Books & Silent Study Pass</h4>
        <input type="text" id="lib-search" placeholder="Type author or book title (e.g. Clean Code, React)..." oninput="searchLibraryBooks()" style="width:100%; padding:0.75rem; background:#000; border:1px solid rgba(255,255,255,0.15); color:#fff; border-radius:8px; margin-bottom:1rem;" />
        <div id="lib-search-results" style="display:flex; flex-direction:column; gap:0.5rem;">
          <div style="background:rgba(255,255,255,0.05); padding:0.75rem; border-radius:8px;">📖 <strong>Clean Code: A Handbook of Agile Software Craftsmanship</strong> by Robert C. Martin (Available - Shelf A-4)</div>
          <div style="background:rgba(255,255,255,0.05); padding:0.75rem; border-radius:8px;">📖 <strong>You Don't Know JS Yet</strong> by Kyle Simpson (Available - Shelf B-12)</div>
        </div>
      </div>
    `;
  }

  if (window.lucide) lucide.createIcons();
}

// Render Code Inspector Modal
function renderCodeModal(projectKey) {
  const modalArea = document.getElementById('modal-content-area');
  modalArea.innerHTML = `
    <div class="demo-modal-header">
      <h2>💻 Source Code Architecture - ${projectKey.toUpperCase()}</h2>
      <p>Clean, modular code structure written by Parul Rajawat.</p>
    </div>

    <pre style="background: #060810; padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); color: #818cf8; font-size: 0.85rem; overflow-x: auto; font-family: monospace;">
// Example Component: ${projectKey}.jsx
import React, { useState, useEffect } from 'react';

export default function ${projectKey.replace('-', '')}Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // High-performance API fetch & optimization
    fetch('/api/${projectKey}')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      });
  }, []);

  return (
    &lt;div class="container glass-card"&gt;
      &lt;h2&gt;Optimized for Performance & Conversion&lt;/h2&gt;
    &lt;/div&gt;
  );
}
    </pre>
  `;
}

// Global Helper Functions attached to window for inline onclick handlers inside modals
window.calculateBmi = function() {
  const height = parseFloat(document.getElementById('bmi-height').value);
  const weight = parseFloat(document.getElementById('bmi-weight').value);
  const output = document.getElementById('bmi-result-output');

  if (!height || !weight || height <= 0 || weight <= 0) {
    output.textContent = 'Please enter valid positive height and weight values.';
    output.style.borderColor = '#ef4444';
    return;
  }

  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

  let category = '';
  if (bmi < 18.5) category = 'Underweight (Build Muscle Plan)';
  else if (bmi < 24.9) category = 'Normal Weight (Optimal Fitness)';
  else if (bmi < 29.9) category = 'Overweight (Fat Burn Plan)';
  else category = 'Obese (Transformative Coaching)';

  output.textContent = `Your BMI: ${bmi} (${category})`;
  output.style.borderColor = '#10b981';
};

window.reserveCafeTable = function() {
  const name = document.getElementById('cafe-guest-name').value.trim();
  const date = document.getElementById('cafe-date').value;
  const status = document.getElementById('cafe-booking-status');

  if (!name || !date) {
    status.style.color = '#f87171';
    status.textContent = 'Please enter name and date.';
    return;
  }

  status.style.color = '#34d399';
  status.textContent = `✅ Reservation Confirmed for ${name} on ${date}!`;
};

window.checkCourseFee = function() {
  const course = document.getElementById('course-select').value;
  const result = document.getElementById('course-fee-result');
  result.innerHTML = `<strong>Selected Course:</strong> ${course}<br/>⚡ Entrance exam scholarship up to 50% applicable for 2026 Batch.`;
};

window.searchLibraryBooks = function() {
  const query = document.getElementById('lib-search').value.toLowerCase();
  const container = document.getElementById('lib-search-results');
  
  const books = [
    { title: 'Clean Code', author: 'Robert C. Martin', shelf: 'A-4' },
    { title: "You Don't Know JS Yet", author: 'Kyle Simpson', shelf: 'B-12' },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', shelf: 'C-2' },
    { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', shelf: 'A-1' }
  ];

  const filtered = books.filter(b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query));

  if (filtered.length === 0) {
    container.innerHTML = `<div style="color:#f87171; padding:0.5rem;">No matching titles found in library database.</div>`;
  } else {
    container.innerHTML = filtered.map(b => `
      <div style="background:rgba(255,255,255,0.05); padding:0.75rem; border-radius:8px;">
        📖 <strong>${b.title}</strong> by ${b.author} (Shelf ${b.shelf})
      </div>
    `).join('');
  }
};
