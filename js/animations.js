// Preloader Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Animate the preloader progress bar
  const preloaderBar = document.getElementById('preloader-bar');
  let width = 0;
  const maxWidth = 100;
  const increment = 1;
  const interval = 30;
  
  const loadingProgress = setInterval(function() {
    if (width >= maxWidth) {
      clearInterval(loadingProgress);
      // Wait a bit after 100% before hiding the preloader
      setTimeout(function() {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('fade-out');
      }, 500);
    } else {
      width += increment;
      preloaderBar.style.width = width + '%';
    }
  }, interval);
  
  // Remove preloader after animation completes
  window.addEventListener('load', function() {
    setTimeout(function() {
      startTerminalAnimation();
    }, 1500);
  });
});

// Terminal Typing Animation
function startTerminalAnimation() {
  const terminalLines = document.querySelectorAll('#terminal-animation .line');
  let currentLineIndex = 0;
  
  function typeLine() {
    if (currentLineIndex >= terminalLines.length) {
      return;
    }
    
    const currentLine = terminalLines[currentLineIndex];
    const text = currentLine.getAttribute('data-text');
    
    if (!text) {
      currentLineIndex++;
      setTimeout(typeLine, 100);
      return;
    }
    
    let charIndex = 0;
    currentLine.textContent = '';
    
    // Add command prefix if it's a command line
    if (currentLine.classList.contains('command')) {
      currentLine.textContent = '$ ';
    }
    
    // Create typing animation
    const typingInterval = setInterval(function() {
      if (charIndex < text.length) {
        currentLine.textContent += text[charIndex];
        charIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Add blinking cursor to the last line being typed
        if (currentLineIndex === terminalLines.length - 1) {
          const cursor = document.createElement('span');
          cursor.className = 'cursor';
          currentLine.appendChild(cursor);
        }
        
        // Move to next line after a delay
        currentLineIndex++;
        setTimeout(typeLine, 300);
      }
    }, 50);
  }
  
  // Start typing animation
  typeLine();
}

// Add animated elements to architecture diagram
document.addEventListener('DOMContentLoaded', function() {
  // Create animated connection lines
  function animateArchitectureDiagram() {
    const archDiagram = document.querySelector('.architecture-diagram');
    
    if (!archDiagram) return;
    
    // Add data particles dynamically
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'data-particle';
      particle.style.left = (Math.random() * 80 + 10) + '%';
      particle.style.animationDelay = (Math.random() * 3) + 's';
      
      const dataFlow = document.querySelector('.data-flow');
      if (dataFlow) {
        dataFlow.appendChild(particle);
      }
    }
  }
  
  // Initialize architecture animations when diagram is in viewport
  function initArchitectureAnimation() {
    const archDiagram = document.querySelector('.architecture-diagram');
    
    if (!archDiagram) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateArchitectureDiagram();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(archDiagram);
  }
  
  // Initialize SVG interactions
  function initSvgInteractions() {
    // Add hover effects to SVG components
    const svgObjects = document.querySelectorAll('object[type="image/svg+xml"]');
    
    svgObjects.forEach(obj => {
      obj.addEventListener('load', function() {
        const svgDoc = obj.contentDocument;
        if (!svgDoc) return;
        
        // Add interaction to SVG elements
        const interactiveElements = svgDoc.querySelectorAll('.hexagon, .hexagon-inner, .scan-line, .arch-connect');
        
        interactiveElements.forEach(el => {
          el.addEventListener('mouseenter', function() {
            this.style.stroke = '#6d28d9';
            this.style.strokeWidth = '3';
            this.style.transition = 'all 0.3s ease';
          });
          
          el.addEventListener('mouseleave', function() {
            this.style.stroke = '#8b5cf6';
            this.style.strokeWidth = '2';
          });
        });
      });
    });
  }
  
  // Execute all animations
  setTimeout(function() {
    initArchitectureAnimation();
    initSvgInteractions();
  }, 2000); // Delay to ensure preloader completes
  
  // Retrigger terminal animation when terminal comes into view
  const terminalWindow = document.querySelector('.terminal-window');
  if (terminalWindow) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Only start terminal animation if preloader is gone
          if (document.getElementById('preloader').classList.contains('fade-out')) {
            startTerminalAnimation();
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(terminalWindow);
  }
});

// Enhanced scroll animations
window.addEventListener('scroll', function() {
  // Parallax effect for hero section
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const scrollPosition = window.scrollY;
    heroSection.style.backgroundPosition = `center ${scrollPosition * 0.05}px`;
  }
  
  // Fade in elements on scroll
  const fadeElements = document.querySelectorAll('.fade-in-scroll');
  fadeElements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (elementPosition < screenPosition) {
      element.classList.add('visible');
    }
  });
});
