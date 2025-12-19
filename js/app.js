// ============================================
// PARTICLE BACKGROUND ANIMATION
// ============================================
class ParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 80;
    this.connectionDistance = 150;
    this.mousePosition = { x: null, y: null };
    this.animationId = null;
    
    this.init();
    this.animate();
    this.setupEventListeners();
  }

  init() {
    this.resize();
    this.createParticles();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mousePosition.x = null;
      this.mousePosition.y = null;
    });
  }

  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(222, 5, 138, ${particle.opacity})`;
    this.ctx.fill();
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = (1 - distance / this.connectionDistance) * 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(222, 5, 138, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  updateParticles() {
    for (let particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }

      // Mouse interaction
      if (this.mousePosition.x && this.mousePosition.y) {
        const dx = this.mousePosition.x - particle.x;
        const dy = this.mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx -= (dx / distance) * force * 0.02;
          particle.vy -= (dy / distance) * force * 0.02;
        }
      }

      // Speed limit
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > 2) {
        particle.vx = (particle.vx / speed) * 2;
        particle.vy = (particle.vy / speed) * 2;
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    this.drawConnections();
    
    for (let particle of this.particles) {
      this.drawParticle(particle);
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

// Initialize particles
const particles = new ParticleBackground('particles-canvas');

// ============================================
// PARALLAX SCROLL EFFECT
// ============================================
function initParallax() {
  const heroSection = document.querySelector('.bg-home-hack');
  const heroContent = document.querySelector('.bg-home-hack .container');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Hero parallax effect
    if (heroSection && heroContent) {
      const heroRect = heroSection.getBoundingClientRect();
      if (heroRect.top < windowHeight && heroRect.bottom > 0) {
        const parallaxValue = scrolled * 0.4;
        heroContent.style.transform = `translateY(${parallaxValue}px)`;
        heroContent.style.opacity = 1 - (scrolled / windowHeight) * 0.5;
      }
    }

    // About section parallax layers - DISABLED (causes issues)
    // const parallaxLayers = document.querySelectorAll('.parallax-layer');
    // parallaxLayers.forEach(layer => {
    //   // Parallax disabled for better readability
    // });

    // Floating elements parallax
    const floatElements = document.querySelectorAll('.float-elem');
    floatElements.forEach(elem => {
      const speed = elem.dataset.speed || 1;
      const rect = elem.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const yPos = scrolled * speed * 0.05;
        elem.style.transform = `translateY(${yPos}px)`;
      }
    });

    // Section fade-in on scroll
    const sections = document.querySelectorAll('.section, #about-us, #categories, #schedule, #jury, #contact, #faq');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      
      if (sectionTop < windowHeight * 0.85 && sectionBottom > 0) {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }
    });
  });
}

// ============================================
// SMOOTH REVEAL ANIMATION
// ============================================
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.slider-item, .prize-elem-outer, .accordion-item');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
var notification = document.getElementById('custom-notification');
if (notification) {
  notification.style.display = 'none';
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function windowScroll() {
  const navbar = document.getElementById("navbar");
  if (
    document.body.scrollTop >= 50 ||
    document.documentElement.scrollTop >= 50
  ) {
    navbar.classList.add("nav-sticky");
  } else {
    navbar.classList.remove("nav-sticky");
  }
}

// Mobile menu toggle
const navLinks = document.querySelectorAll(".nav-item");
const menuToggle = document.getElementById("navbarCollapse");
navLinks.forEach(l => {
  l.addEventListener("click", () => {
    const bsCollapse = new bootstrap.Collapse(menuToggle);
    bsCollapse.toggle();
  });
});

window.addEventListener("scroll", ev => {
  ev.preventDefault();
  windowScroll();
});

// ============================================
// SMOOTH SCROLL
// ============================================
var scroll = new SmoothScroll("#navbar-navlist a", {
  speed: 50,
  offset: 60
});

// ============================================
// NAVBAR ACTIVE CLASS (GUMSHOE)
// ============================================
var spy = new Gumshoe("#navbar-navlist a", {
  navClass: "active",
  contentClass: "active",
  offset: 70
});

// ============================================
// FADE IN HELPER
// ============================================
function fadeIn() {
  var fade = document.getElementById("error-msg");
  var opacity = 0;
  var intervalID = setInterval(function () {
    if (opacity < 1) {
      opacity = opacity + 0.5;
      fade.style.opacity = opacity;
    } else {
      clearInterval(intervalID);
    }
  }, 200);
}

// ============================================
// TINY SLIDER - JUDGES
// ============================================
const sliderJudges = tns({
  container: ".slider-jury",
  loop: true,
  items: 1,
  slideBy: "page",
  nav: true,
  navPosition: "bottom",
  autoplay: false,
  speed: 400,
  autoplayButtonOutput: false,
  mouseDrag: true,
  lazyload: true,
  controlsContainer: "#customize-controls-jury",
  responsive: {
    640: {
      items: 2
    },
    768: {
      items: 4
    }
  }
});

// ============================================
// TINY SLIDER - MENTORS
// ============================================
const sliderMentors = tns({
  container: ".slider-mentors",
  loop: true,
  items: 1,
  slideBy: "page",
  nav: true,
  navPosition: "bottom",
  autoplay: false,
  speed: 400,
  autoplayButtonOutput: false,
  mouseDrag: true,
  lazyload: true,
  controlsContainer: "#customize-controls-mentors",
  responsive: {
    640: {
      items: 2
    },
    768: {
      items: 4
    }
  }
});

// ============================================
// NEWSLETTER FUNCTIONALITY
// ============================================
const newsLetterEmailInput = document.getElementById("newsletter-email-input");
const newsLetterBtn = document.getElementById("newsletter-btn");
const checkbox1 = document.getElementById('checkbox1-newsletter');
const checkbox2 = document.getElementById('checkbox2-newsletter');

function checkConditions() {
  const isEmailValid = newsLetterEmailInput && newsLetterEmailInput.value.trim() !== '';
  const isCheckbox1Checked = checkbox1 && checkbox1.checked;

  if (isEmailValid && isCheckbox1Checked) {
    newsLetterBtn.classList.remove('disabled');
  } else {
    newsLetterBtn.classList.add('disabled');
  }
}

if (newsLetterEmailInput) {
  newsLetterEmailInput.addEventListener('input', checkConditions);
}
if (checkbox1) {
  checkbox1.addEventListener('change', checkConditions);
}
if (checkbox2) {
  checkbox2.addEventListener('change', checkConditions);
}

function showNotification() {
  if (notification) {
    notification.style.display = 'block';
    setTimeout(function () {
      notification.style.display = 'none';
    }, 5000);
  }
}

if (newsLetterBtn) {
  newsLetterBtn.addEventListener("click", () => {
    const email = newsLetterEmailInput.value;

    const data = {
      email_address: email,
    };

    const url = "https://ahkxlexqszfsqoe33tl5im4b4y0umhdv.lambda-url.us-east-1.on.aws/HubSpotService/listMembers";

    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        showNotification();
        newsLetterEmailInput.value = "";
        if (checkbox1) checkbox1.checked = false;
        if (checkbox2) checkbox2.checked = false;
      })
      .catch((error) => {
        console.error("Error:", error);
        newsLetterEmailInput.value = "";
        if (checkbox1) checkbox1.checked = false;
        if (checkbox2) checkbox2.checked = false;
      });
  });
}

// ============================================
// GLOW EFFECT ON HOVER FOR CARDS
// ============================================
function initGlowEffects() {
  const cards = document.querySelectorAll('.slider-item-inner, .prize-elem-outer, .accordion-item, .stat-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // Update glow position for stat cards
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.left = `${x - rect.width}px`;
        glow.style.top = `${y - rect.height}px`;
      }
    });
  });
}

// ============================================
// STAT CARD ANIMATIONS - ABOUT SECTION
// ============================================
function initStatCardAnimations() {
  const statCards = document.querySelectorAll('.stat-card');
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered fade-in animation
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          
          // Animate the numbers
          const statNumber = entry.target.querySelector('.stat-number');
          if (statNumber && !statNumber.classList.contains('animated')) {
            animateNumber(statNumber);
            statNumber.classList.add('animated');
          }
        }, index * 100);
        
        statObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.9)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    statObserver.observe(card);
  });
}

// Animate numbers in stat cards
function animateNumber(element) {
  const text = element.textContent;
  const hasPlus = text.includes('+');
  const hasDollar = text.includes('$');
  const hasK = text.includes('K');
  
  // Extract just the number
  const numberMatch = text.match(/[\d.]+/);
  if (!numberMatch) return;
  
  const finalNumber = parseFloat(numberMatch[0]);
  const duration = 1500;
  const steps = 60;
  const increment = finalNumber / steps;
  let current = 0;
  let step = 0;
  
  const timer = setInterval(() => {
    current += increment;
    step++;
    
    let displayValue = Math.min(current, finalNumber).toFixed(finalNumber < 10 ? 0 : 0);
    let displayText = displayValue;
    
    if (hasDollar) displayText = '$' + displayText;
    if (hasK) displayText = displayText + 'K';
    if (hasPlus) displayText = displayText + '+';
    
    element.textContent = displayText;
    
    if (step >= steps) {
      clearInterval(timer);
      // Set final value
      let finalText = finalNumber.toString();
      if (hasDollar) finalText = '$' + finalText;
      if (hasK) finalText = finalText + 'K';
      if (hasPlus) finalText = finalText + '+';
      element.textContent = finalText;
    }
  }, duration / steps);
}

// ============================================
// FLOATING ELEMENTS INTERACTION
// ============================================
function initFloatingElements() {
  const floatingElements = document.querySelectorAll('.float-elem');
  
  floatingElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      elem.style.animationPlayState = 'paused';
      elem.style.transform = 'scale(1.2) rotate(10deg)';
    });
    
    elem.addEventListener('mouseleave', () => {
      elem.style.animationPlayState = 'running';
      elem.style.transform = '';
    });
  });
}

// ============================================
// AOS-STYLE SCROLL ANIMATIONS
// ============================================
function initAOSAnimations() {
  const aosElements = document.querySelectorAll('[data-aos]');
  
  const aosOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        aosObserver.unobserve(entry.target);
      }
    });
  }, aosOptions);

  aosElements.forEach(elem => {
    aosObserver.observe(elem);
  });
}

// ============================================
// TRACK SELECTION INTERACTION
// ============================================
function initTrackSelection() {
  const trackCards = document.querySelectorAll('.track-card');
  const trackDetails = document.querySelectorAll('.track-detail');
  
  trackCards.forEach(card => {
    card.addEventListener('click', () => {
      const trackId = card.dataset.track;
      
      // Remove active class from all cards
      trackCards.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked card
      card.classList.add('active');
      
      // Hide all detail panels
      trackDetails.forEach(detail => {
        detail.style.display = 'none';
      });
      
      // Show selected detail panel
      const selectedDetail = document.getElementById(`detail-${trackId}`);
      if (selectedDetail) {
        selectedDetail.style.display = 'block';
      }
    });
  });
  
  // Set first track as active by default
  if (trackCards.length > 0) {
    trackCards[0].click();
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initRevealAnimations();
  initGlowEffects();
  initStatCardAnimations();
  initFloatingElements();
  initAOSAnimations();
  initTrackSelection();
  
  // Add initial styles for animated sections
  const sections = document.querySelectorAll('#about-us, #categories, #schedule, #jury, #contact, #faq');
  sections.forEach(section => {
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });
  
  // Smooth scroll behavior for CTA button
  const ctaButton = document.querySelector('.btn-glow-primary');
  if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(ctaButton.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
});

// ============================================
// TYPING EFFECT FOR HERO (OPTIONAL)
// ============================================
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}
