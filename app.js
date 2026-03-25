// ========================================
// LESA Labs — App Script
// ========================================

// Initialize Lucide icons
lucide.createIcons();

// ========================================
// Cursor Glow (desktop only)
// ========================================
const cursorGlow = document.getElementById('cursorGlow');
if (window.matchMedia('(hover: hover)').matches && cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// ========================================
// Mobile Menu
// ========================================
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobile() {
  mobileMenu.classList.remove('active');
}

mobileToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});

// ========================================
// Scroll Reveal Animation
// ========================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

initScrollReveal();

// ========================================
// Stats Counter Animation
// ========================================
function animateCounters() {
  const counters = document.querySelectorAll('.stat__number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1500;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const current = Math.round(eased * target);
          el.textContent = current + '+';
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

animateCounters();

// ========================================
// Particles Canvas
// ========================================
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const count = Math.min(60, Math.floor(canvas.width * canvas.height / 15000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    animId = requestAnimationFrame(animate);
  }

  animate();

  // Pause when not visible
  const heroEl = document.querySelector('.hero');
  const heroObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) animate();
    } else {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0 });

  heroObserver.observe(heroEl);
}

initParticles();

// ========================================
// GSAP Scroll Animations (enhanced)
// ========================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Hero text stagger
  gsap.from('.hero__title', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    delay: 0.3
  });

  gsap.from('.hero__badge', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.1
  });

  gsap.from('.hero__description', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.5
  });

  gsap.from('.hero__actions', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.7
  });

  // Portfolio cards scale in
  gsap.utils.toArray('.portfolio-card').forEach((card, i) => {
    gsap.set(card, { opacity: 0, scale: 0.95, y: 20 });
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      delay: i * 0.12
    });
  });

  // Process steps
  gsap.utils.toArray('.process-step').forEach((step, i) => {
    gsap.set(step, { opacity: 0, y: 30 });
    gsap.to(step, {
      scrollTrigger: {
        trigger: step,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: i * 0.15
    });
  });

  // Service cards
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 30 });
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      delay: i * 0.1
    });
  });

  // Sector cards
  gsap.utils.toArray('.sector-card').forEach((card, i) => {
    gsap.set(card, { opacity: 0, x: -20 });
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      x: 0,
      duration: 0.5,
      ease: 'power2.out',
      delay: i * 0.08
    });
  });
}

// ========================================
// Smooth scroll for anchor links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========================================
// Nav scroll behavior
// ========================================
let lastScrollY = 0;
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > 100) {
    nav.style.boxShadow = 'var(--shadow-md)';
  } else {
    nav.style.boxShadow = 'none';
  }
  lastScrollY = current;
}, { passive: true });
