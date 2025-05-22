// Workflow Animation Controller
document.addEventListener('DOMContentLoaded', () => {
  // Initialize workflow animation interactions
  initWorkflowAnimation();
  
  // Add hover effects to workflow cards
  enhanceWorkflowCards();
  
  // Add interactive elements to SVG animations
  enhanceSvgAnimations();
});

function initWorkflowAnimation() {
  // Wait for SVG to load
  const workflowSVG = document.querySelector('.workflow-animation');
  if (!workflowSVG) return;

  // Handle SVG load event
  workflowSVG.addEventListener('load', () => {
    const svgDoc = workflowSVG.contentDocument;
    if (!svgDoc) return;

    // Fix SVG viewBox to ensure proper alignment
    const svgRoot = svgDoc.querySelector('svg');
    if (svgRoot) {
      // Set fixed dimensions to prevent unwanted movement
      svgRoot.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      
      // Add pulse animations to nodes
      setupNodeInteractions(svgDoc);
      
      // Add data flow animations
      setupDataFlowAnimations(svgDoc);
      
      // Add info panel system
      setupInfoPanel(svgDoc, workflowSVG);
    }
  });
}

function setupNodeInteractions(svgDoc) {
  // Find all nodes (typically circles or rectangles representing components)
  const nodes = svgDoc.querySelectorAll('.node, .component, circle, rect:not(.background)');
  
  nodes.forEach(node => {
    // Add pulse effect on hover
    node.addEventListener('mouseenter', () => {
      node.classList.add('pulse');
      
      // Highlight connections related to this node
      highlightConnections(svgDoc, node.id);
    });
    
    node.addEventListener('mouseleave', () => {
      node.classList.remove('pulse');
      
      // Reset connections
      resetConnections(svgDoc);
    });
    
    // Add click interaction to show component details
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      showComponentDetails(node.id, node);
    });
    
    // Add pulse animation style
    const style = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
        100% { opacity: 1; transform: scale(1); }
      }
      .pulse {
        animation: pulse 1.5s infinite ease-in-out;
        filter: drop-shadow(0 0 5px rgba(139, 92, 246, 0.8));
      }
      path.highlighted {
        stroke: rgba(139, 92, 246, 0.8) !important;
        stroke-width: 2.5 !important;
        filter: drop-shadow(0 0 3px rgba(139, 92, 246, 0.5));
      }
    `;
    svgDoc.querySelector('svg').appendChild(style);
  });
}

function setupDataFlowAnimations(svgDoc) {
  // Find all paths that represent data flow
  const dataFlowPaths = svgDoc.querySelectorAll('path');
  
  dataFlowPaths.forEach(path => {
    // Create animated markers for data flow
    if (path.getAttribute('stroke') && path.getAttribute('stroke') !== 'none') {
      const defs = svgDoc.querySelector('defs') || svgDoc.createElementNS("http://www.w3.org/2000/svg", "defs");
      const svg = svgDoc.querySelector('svg');
      
      if (!svgDoc.querySelector('defs')) {
        svg.appendChild(defs);
      }
      
      // Create marker for data flow animation
      const markerId = `dataflow-marker-${Math.random().toString(36).substr(2, 9)}`;
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", markerId);
      marker.setAttribute("viewBox", "0 0 10 10");
      marker.setAttribute("refX", "5");
      marker.setAttribute("refY", "5");
      marker.setAttribute("markerWidth", "4");
      marker.setAttribute("markerHeight", "4");
      marker.setAttribute("orient", "auto");
      
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "5");
      circle.setAttribute("cy", "5");
      circle.setAttribute("r", "3");
      circle.setAttribute("fill", path.getAttribute('stroke') || '#8b5cf6');
      
      marker.appendChild(circle);
      defs.appendChild(marker);
      
      // Apply marker to path
      // Don't animate immediately, only when relevant node is active
      path.setAttribute("marker-end", `url(#${markerId})`);
      
      // Store original attributes for reset
      path.dataset.originalStroke = path.getAttribute('stroke');
      path.dataset.originalStrokeWidth = path.getAttribute('stroke-width');
    }
  });
}

function highlightConnections(svgDoc, nodeId) {
  // Find all paths connected to this node based on your SVG structure
  // This may vary depending on your SVG, but generally paths might have
  // data attributes or naming conventions linking them to nodes
  const relatedPaths = svgDoc.querySelectorAll(`path[data-from="${nodeId}"], path[data-to="${nodeId}"]`);
  
  if (relatedPaths.length === 0) {
    // Fallback: try to find paths that visually connect to this node
    // This is more complex and would depend on your SVG structure
    // For now, just highlight all paths as an example
    const allPaths = svgDoc.querySelectorAll('path');
    allPaths.forEach(path => {
      path.classList.add('highlighted');
    });
    return;
  }
  
  relatedPaths.forEach(path => {
    path.classList.add('highlighted');
  });
}

function resetConnections(svgDoc) {
  const highlightedPaths = svgDoc.querySelectorAll('.highlighted');
  highlightedPaths.forEach(path => {
    path.classList.remove('highlighted');
  });
}

function showComponentDetails(componentId, element) {
  // Components details mapping
  const componentDetails = {
    'input': {
      title: 'Target Input',
      description: 'Accepts URLs, IP addresses, or domain names for scanning.',
      code: 'python vulnx.py -u example.com'
    },
    'scanner': {
      title: 'Vulnerability Scanner',
      description: 'Core scanning engine that identifies potential security issues.',
      code: 'python vulnx.py --cms --dns --dorks example.com'
    },
    'cms': {
      title: 'CMS Detection',
      description: 'Identifies Content Management Systems and their vulnerabilities.',
      code: 'python vulnx.py --cms example.com'
    },
    'exploit': {
      title: 'Exploit Module',
      description: 'Contains ready-to-use exploits for known vulnerabilities.',
      code: 'python vulnx.py --exploit example.com'
    },
    'output': {
      title: 'Results Output',
      description: 'Formats and presents scanning results in multiple formats.',
      code: 'python vulnx.py -u example.com --output=json'
    }
  };
  
  // Get details or use defaults
  const details = componentDetails[componentId] || {
    title: 'Component',
    description: 'Part of the Vulnx scanning workflow.',
    code: 'python vulnx.py -h'
  };
  
  // Create or update info panel
  updateInfoPanel(details);
  
  // Highlight related elements in the page
  highlightRelatedElements(componentId);
}

function updateInfoPanel(details) {
  // Get or create info panel
  let infoPanel = document.querySelector('.workflow-info-panel');
  
  if (!infoPanel) {
    infoPanel = document.createElement('div');
    infoPanel.className = 'workflow-info-panel bg-gray-900 p-4 rounded shadow-lg';
    document.querySelector('.workflow-animation-wrapper').appendChild(infoPanel);
  }
  
  // Update panel content
  infoPanel.innerHTML = `
    <h4 class="text-lg font-bold text-purple-500">${details.title}</h4>
    <p class="text-gray-300 my-2">${details.description}</p>
    <div class="bg-gray-800 p-2 rounded mt-2">
      <code class="text-green-400 text-sm">${details.code}</code>
    </div>
  `;
  
  // Animate panel
  infoPanel.style.opacity = '0';
  infoPanel.style.transition = 'opacity 0.3s ease-in-out';
  
  setTimeout(() => {
    infoPanel.style.opacity = '1';
  }, 10);
}

function setupInfoPanel(svgDoc, workflowSVG) {
  // Close info panel when clicking outside
  document.addEventListener('click', (e) => {
    const infoPanel = document.querySelector('.workflow-info-panel');
    if (infoPanel && !infoPanel.contains(e.target) && e.target !== workflowSVG) {
      infoPanel.style.opacity = '0';
      
      // Remove panel after fade-out
      setTimeout(() => {
        if (infoPanel.parentNode) {
          infoPanel.parentNode.removeChild(infoPanel);
        }
      }, 300);
      
      // Reset any highlighted elements
      resetHighlightedElements();
    }
  });
}

function highlightRelatedElements(componentId) {
  // Reset any previously highlighted elements
  resetHighlightedElements();
  
  // Look for related workflow cards and highlight them
  const relatedCards = document.querySelectorAll(`.workflow-card[data-component="${componentId}"]`);
  relatedCards.forEach(card => {
    card.classList.add('active-workflow');
  });
  
  // Look for related code blocks and highlight them
  const relatedCode = document.querySelectorAll(`.code-block[data-component="${componentId}"]`);
  relatedCode.forEach(code => {
    code.classList.add('highlight-code');
  });
}

function resetHighlightedElements() {
  document.querySelectorAll('.active-workflow').forEach(el => {
    el.classList.remove('active-workflow');
  });
  
  document.querySelectorAll('.highlight-code').forEach(el => {
    el.classList.remove('highlight-code');
  });
}

// Enhance workflow cards with interactive features
function enhanceWorkflowCards() {
  const workflowCards = document.querySelectorAll('.workflow-card');
  
  workflowCards.forEach(card => {
    card.addEventListener('click', function() {
      // Get workflow type
      const workflowTitle = card.querySelector('.workflow-title').textContent;
      
      // Update code examples with selected workflow
      const basicCode = document.getElementById('basic-code');
      if (basicCode) {
        const codeLines = basicCode.textContent.split('\n');
        if (codeLines.length >= 3) {
          codeLines[2] = `vulnx scan -f ${workflowTitle} -t sample.com`;
          basicCode.textContent = codeLines.join('\n');
        }
      }
      
      // Visual feedback
      card.classList.add('active-workflow');
      setTimeout(() => {
        card.classList.remove('active-workflow');
      }, 1000);
      
      // Highlight related code block
      const codeBlock = document.querySelector('.code-block');
      if (codeBlock) {
        codeBlock.classList.add('highlight-code');
        setTimeout(() => {
          codeBlock.classList.remove('highlight-code');
        }, 1000);
      }
    });
  });
}

// Enhance SVG animations with interactive features
function enhanceSvgAnimations() {
  // Add interaction to scan animation
  const scanAnimation = document.querySelector('.scan-animation-svg');
  if (scanAnimation) {
    scanAnimation.addEventListener('load', function() {
      const svgDoc = scanAnimation.contentDocument;
      if (!svgDoc) return;
      
      // Add interaction to nodes
      const nodes = svgDoc.querySelectorAll('circle[cx][cy][r]');
      
      nodes.forEach(node => {
        node.style.cursor = 'pointer';
        
        node.addEventListener('mouseenter', function() {
          node.setAttribute('stroke-width', '3');
          node.setAttribute('stroke-opacity', '1');
        });
        
        node.addEventListener('mouseleave', function() {
          node.setAttribute('stroke-width', '2');
          node.setAttribute('stroke-opacity', '0.7');
        });
        
        node.addEventListener('click', function() {
          // Create pulse effect on click
          const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          pulse.setAttribute('cx', node.getAttribute('cx'));
          pulse.setAttribute('cy', node.getAttribute('cy'));
          pulse.setAttribute('r', '5');
          pulse.setAttribute('fill', 'none');
          pulse.setAttribute('stroke', '#8b5cf6');
          pulse.setAttribute('stroke-width', '2');
          
          // Add animation
          const animateR = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
          animateR.setAttribute('attributeName', 'r');
          animateR.setAttribute('from', '5');
          animateR.setAttribute('to', '30');
          animateR.setAttribute('dur', '1s');
          animateR.setAttribute('begin', '0s');
          animateR.setAttribute('fill', 'freeze');
          
          const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
          animateOpacity.setAttribute('attributeName', 'opacity');
          animateOpacity.setAttribute('from', '1');
          animateOpacity.setAttribute('to', '0');
          animateOpacity.setAttribute('dur', '1s');
          animateOpacity.setAttribute('begin', '0s');
          animateOpacity.setAttribute('fill', 'freeze');
          
          pulse.appendChild(animateR);
          pulse.appendChild(animateOpacity);
          
          node.parentNode.appendChild(pulse);
          
          // Remove after animation completes
          setTimeout(() => {
            if (pulse.parentNode) {
              pulse.parentNode.removeChild(pulse);
            }
          }, 1000);
        });
      });
    });
  }
} 