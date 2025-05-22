// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animation library
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Nav links smooth scrolling
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
      
      // If it's an anchor link
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  }

  // Copy code functionality
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const codeType = this.getAttribute('data-code');
      const codeElement = document.getElementById(`${codeType}-code`);
      
      if (codeElement) {
        const textToCopy = codeElement.textContent;
        
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            // Change icon to checkmark temporarily
            const icon = this.querySelector('i');
            icon.classList.remove('fa-copy');
            icon.classList.add('fa-check');
            
            // Reset after 2 seconds
            setTimeout(() => {
              icon.classList.remove('fa-check');
              icon.classList.add('fa-copy');
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
          });
      }
    });
  });

  // Terminal animation effects
  function typeWriterEffect() {
    const terminalLines = document.querySelectorAll('.terminal-content .line');
    let lineIndex = 0;
    let charIndex = 0;
    
    function typeChar() {
      if (lineIndex < terminalLines.length) {
        const currentLine = terminalLines[lineIndex];
        const text = currentLine.getAttribute('data-text');
        
        if (!text) {
          // If no data-text attribute, move to next line
          lineIndex++;
          charIndex = 0;
          setTimeout(typeChar, 100);
          return;
        }
        
        if (charIndex < text.length) {
          currentLine.textContent += text.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, 50);
        } else {
          // Move to next line
          lineIndex++;
          charIndex = 0;
          setTimeout(typeChar, 500);
        }
      }
    }
    
    // Start typing
    typeChar();
  }
  
  // Add scroll animation for terminal
  function animateTerminalOnScroll() {
    const terminal = document.querySelector('.terminal-window');
    
    if (terminal) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(terminal);
    }
  }
  
  animateTerminalOnScroll();

  // Animate architecture diagram on scroll
  const archComponents = document.querySelectorAll('.arch-component');
  
  archComponents.forEach((component, index) => {
    component.style.transitionDelay = `${index * 150}ms`;
  });

  // Initialize countUp animation for statistics
  function initCountUp() {
    const countElements = document.querySelectorAll('.count-up');
    
    countElements.forEach(element => {
      const target = parseInt(element.getAttribute('data-target'));
      let count = 0;
      const duration = 2000; // 2 seconds
      const interval = duration / target;
      
      const counter = setInterval(() => {
        count++;
        element.textContent = count;
        
        if (count === target) {
          clearInterval(counter);
        }
      }, interval);
    });
  }
  
  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Initialize particles background
  function initParticles() {
    const particlesContainer = document.getElementById('particles-js');
    
    if (particlesContainer && typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: {
            value: 40,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: '#3b82f6'
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000'
            }
          },
          opacity: {
            value: 0.5,
            random: true
          },
          size: {
            value: 3,
            random: true
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#3b82f6',
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'grab'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          }
        },
        retina_detect: true
      });
    }
  }
  
  // Run animations that require viewport checking
  function runScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach(element => {
      if (isInViewport(element) && !element.classList.contains('animated')) {
        element.classList.add('animated');
        
        const animationType = element.getAttribute('data-animate');
        if (animationType === 'countUp') {
          initCountUp();
        }
      }
    });
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', runScrollAnimations);
  
  // Run initial check
  runScrollAnimations();
  
  // Initialize optional components
  if (typeof particlesJS !== 'undefined') {
    initParticles();
  }

  // Initialize on DOM load
  initDarkMode();
  
  // Initialize animations
  initAnimations();
  
  // Initialize 3D architecture visualization
  init3DArchitecture();
  
  // Initialize workflow animation
  initWorkflowAnimation();
  
  // Setup page event handlers
  setupEventHandlers();
});
