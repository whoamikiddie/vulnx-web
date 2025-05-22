// Architecture 3D Visualization Controller
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the 3D architecture visualization
  init3DArchitecture();
  
  // Setup the control buttons
  setupArchitectureControls();
});

// Initialize 3D architecture components
function init3DArchitecture() {
  // Create additional components
  createAdditionalComponents();
  
  // Add dynamic lighting effects
  addLightingEffects();
  
  // Add mouse interaction
  addMouseInteraction();
}

// Create additional architecture components
function createAdditionalComponents() {
  const scene = document.querySelector('.arch-3d-scene');
  if (!scene) return;
  
  // Component data
  const components = [
    {
      name: 'workflow',
      faces: [
        { type: 'front', text: 'Workflow Manager' },
        { type: 'back', text: 'Process Flow' },
        { type: 'right', text: 'Execution' },
        { type: 'left', text: 'Orchestration' },
        { type: 'top', text: 'Task Control' },
        { type: 'bottom', text: 'Scheduling' }
      ]
    },
    {
      name: 'modules',
      faces: [
        { type: 'front', text: 'Module System' },
        { type: 'back', text: 'Extensions' },
        { type: 'right', text: 'Plugins' },
        { type: 'left', text: 'Custom Scans' },
        { type: 'top', text: 'Integration' },
        { type: 'bottom', text: 'API Access' }
      ]
    },
    {
      name: 'reporting',
      faces: [
        { type: 'front', text: 'Reporting Engine' },
        { type: 'back', text: 'Analytics' },
        { type: 'right', text: 'Insights' },
        { type: 'left', text: 'Dashboards' },
        { type: 'top', text: 'Visualization' },
        { type: 'bottom', text: 'Export' }
      ]
    }
  ];
  
  // Create each component
  components.forEach(component => {
    const componentEl = document.createElement('div');
    componentEl.className = `arch-3d-component ${component.name}`;
    
    // Create faces for each component
    component.faces.forEach(face => {
      const faceEl = document.createElement('div');
      faceEl.className = `arch-3d-face ${face.type}`;
      faceEl.textContent = face.text;
      componentEl.appendChild(faceEl);
    });
    
    scene.appendChild(componentEl);
  });
}

// Add dynamic lighting effects
function addLightingEffects() {
  const container = document.querySelector('.arch-3d-container');
  if (!container) return;
  
  // Create a dynamic light source
  const light = document.createElement('div');
  light.className = 'arch-3d-light';
  container.appendChild(light);
  
  // Animate the light
  let lightX = 0;
  let lightY = 0;
  
  // Gradually move the light around
  setInterval(() => {
    lightX = Math.sin(Date.now() / 2000) * 100;
    lightY = Math.cos(Date.now() / 2000) * 100;
    
    light.style.left = `calc(50% + ${lightX}px)`;
    light.style.top = `calc(50% + ${lightY}px)`;
    
    updateFacesLighting(lightX, lightY);
  }, 50);
}

// Update each face's lighting based on the light position
function updateFacesLighting(lightX, lightY) {
  const faces = document.querySelectorAll('.arch-3d-face');
  
  faces.forEach(face => {
    // Get face position relative to center
    const rect = face.getBoundingClientRect();
    const containerRect = document.querySelector('.arch-3d-container').getBoundingClientRect();
    
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;
    
    const faceX = rect.left + rect.width / 2 - centerX;
    const faceY = rect.top + rect.height / 2 - centerY;
    
    // Calculate distance from light
    const distX = faceX - lightX;
    const distY = faceY - lightY;
    const dist = Math.sqrt(distX * distX + distY * distY);
    
    // Adjust brightness based on distance
    const brightness = Math.max(0.5, 1 - dist / 300);
    face.style.filter = `brightness(${brightness})`;
  });
}

// Add mouse interaction to control rotation
function addMouseInteraction() {
  const scene = document.querySelector('.arch-3d-scene');
  if (!scene) return;
  
  let isDragging = false;
  let previousX = 0;
  let previousY = 0;
  let rotationX = 20; // Initial rotation
  let rotationY = 0;
  
  // Save original animation
  const originalAnimation = scene.style.animation;
  
  // Mouse events for desktop
  scene.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
  
  // Touch events for mobile
  scene.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    startDrag({ clientX: touch.clientX, clientY: touch.clientY });
  });
  
  document.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    drag({ clientX: touch.clientX, clientY: touch.clientY });
  });
  
  document.addEventListener('touchend', stopDrag);
  
  function startDrag(e) {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
    
    // Stop the automatic rotation
    scene.style.animation = 'none';
  }
  
  function drag(e) {
    if (!isDragging) return;
    
    // Calculate rotation based on mouse movement
    const deltaX = e.clientX - previousX;
    const deltaY = e.clientY - previousY;
    
    rotationY += deltaX * 0.5;
    rotationX = Math.max(-30, Math.min(60, rotationX + deltaY * 0.5));
    
    // Apply the rotation
    scene.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
    
    previousX = e.clientX;
    previousY = e.clientY;
  }
  
  function stopDrag() {
    isDragging = false;
    
    // Optional: resume animation after some idle time
    const resumeTimeout = setTimeout(() => {
      scene.style.animation = originalAnimation;
    }, 5000);
    
    // Clear timeout if user interacts again
    scene.addEventListener('mousedown', () => {
      clearTimeout(resumeTimeout);
    }, { once: true });
  }
}

// Setup architecture control buttons
function setupArchitectureControls() {
  const controlButtons = document.querySelectorAll('.arch-control-btn');
  
  controlButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      controlButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get component name
      const componentName = button.getAttribute('data-component');
      
      // Show selected component
      showComponent(componentName);
    });
  });
}

// Show the selected architecture component
function showComponent(componentName) {
  const scene = document.querySelector('.arch-3d-scene');
  if (!scene) return;
  
  // Stop animation temporarily
  scene.style.animation = 'none';
  
  // Calculate rotation based on component
  let rotation = 0;
  
  switch (componentName) {
    case 'scanning-engine':
      rotation = 0;
      break;
    case 'workflow':
      rotation = 90;
      break;
    case 'modules':
      rotation = 180;
      break;
    case 'reporting':
      rotation = 270;
      break;
  }
  
  // Apply rotation with smooth transition
  scene.style.transition = 'transform 1s ease';
  scene.style.transform = `rotateY(${rotation}deg) rotateX(20deg)`;
  
  // Reset transition and resume animation after showing the component
  setTimeout(() => {
    scene.style.transition = 'none';
    
    // Resume animation after 5 seconds
    setTimeout(() => {
      scene.style.animation = 'rotate-arch 20s infinite linear';
    }, 5000);
  }, 1000);
} 