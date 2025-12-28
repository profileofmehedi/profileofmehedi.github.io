/**
 * Scroll-based Video Animation and Interactive IT Elements
 * Animates the hero video and interactive elements based on scroll position and mouse movements
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get the video element
  const video = document.getElementById('scroll-video');
  
  // Get the hero section
  const heroSection = document.getElementById('hero');
  
  // Get interactive elements
  const techIcons = document.querySelectorAll('.tech-icon');
  const dataPackets = document.querySelectorAll('.data-packet');
  const connectionLines = document.querySelectorAll('.connection-line');
  const hubConnections = document.querySelectorAll('.hub-connection');
  const cursorFollower = document.getElementById('cursor-follower');
  const hubCenter = document.querySelector('.hub-center');
  const techParticles = document.getElementById('tech-particles');
  
  // Set up variables for scroll animation
  let lastScrollTop = 0;
  let ticking = false;
  let scale = 1;
  let rotation = 0;
  
  // Create tech particles
  if (techParticles) {
    createTechParticles();
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', function() {
    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        animateOnScroll(lastScrollTop);
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Add mouse move parallax effect
  if (heroSection) {
    heroSection.addEventListener('mousemove', function(e) {
      if (window.innerWidth < 992) return; // Don't apply on mobile
      
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      // Animate video with mouse movement
      if (video) {
        video.style.transform = `translateX(${-50 + mouseX * 8}%) translateY(${-50 + mouseY * 8}%) scale(${scale}) rotate(${rotation}deg)`;
      }
      
      // Animate tech icons with mouse
      animateTechElements(mouseX, mouseY);
      
      // Animate IT hub
      animateITHub(mouseX, mouseY);
      
      // Update cursor follower
      updateCursorFollower(e);
    });
    
    // Add mouse enter/leave events for cursor follower
    heroSection.addEventListener('mouseenter', function() {
      if (cursorFollower) {
        cursorFollower.style.opacity = 1;
      }
    });
    
    heroSection.addEventListener('mouseleave', function() {
      if (cursorFollower) {
        cursorFollower.style.opacity = 0;
      }
    });
    
    // Add interactive effects for hub connections
    hubConnections.forEach(connection => {
      connection.addEventListener('mouseenter', function() {
        // Pulse effect when hovering connections
        if (hubCenter) {
          hubCenter.querySelector('i').style.transform = 'scale(1.2)';
          const pulse = hubCenter.querySelector('.pulse-circle');
          if (pulse) {
            pulse.style.animationDuration = '1s';
          }
        }
        
        // Highlight data path
        const randomLine = connectionLines[Math.floor(Math.random() * connectionLines.length)];
        if (randomLine) {
          randomLine.style.height = '3px';
          randomLine.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.7)';
          randomLine.style.opacity = '1';
          
          // Reset after animation
          setTimeout(() => {
            if (randomLine) {
              randomLine.style.height = '2px';
              randomLine.style.boxShadow = 'none';
              randomLine.style.opacity = '0.7';
            }
          }, 1000);
        }
      });
      
      connection.addEventListener('mouseleave', function() {
        if (hubCenter) {
          hubCenter.querySelector('i').style.transform = 'scale(1)';
          const pulse = hubCenter.querySelector('.pulse-circle');
          if (pulse) {
            pulse.style.animationDuration = '2s';
          }
        }
      });
    });
  }
  
  // Function to animate elements on scroll
  function animateOnScroll(scrollPos) {
    if (!heroSection) return;
    
    // Calculate animation values based on scroll
    const heroHeight = heroSection.offsetHeight;
    const scrollPercentage = Math.min(scrollPos / heroHeight, 1);
    
    // Update scale and rotation based on scroll
    scale = 1 + scrollPercentage * 0.15; // Scale between 1 and 1.15
    rotation = scrollPercentage * 5; // Rotate between 0 and 5 degrees
    
    // Apply the transformation to video
    if (video) {
      video.style.transform = `translateX(-50%) translateY(-50%) scale(${scale}) rotate(${rotation}deg)`;
      
      // Adjust the playback rate based on scroll
      if (!video.paused) {
        // Speed up video slightly when scrolling down
        video.playbackRate = 1 + scrollPercentage * 0.8;
      }
    }
    
    // Animate hero content based on scroll
    animateHeroContent(scrollPercentage);
    
    // Animate tech elements based on scroll
    animateTechElementsOnScroll(scrollPercentage);
    
    // Change overlay opacity based on scroll
    const overlay = document.querySelector('.video-overlay');
    if (overlay) {
      const startOpacity = 0.1;
      const endOpacity = 0.35;
      const newOpacity = startOpacity + (endOpacity - startOpacity) * scrollPercentage;
      overlay.style.background = `linear-gradient(135deg, rgba(255, 0, 0, ${newOpacity}), rgba(255, 119, 0, ${newOpacity}))`;
    }
    
    // Animate interactive IT hub on scroll
    const itHub = document.querySelector('.interactive-it-hub');
    if (itHub) {
      itHub.style.transform = `rotateY(${scrollPercentage * 180}deg) rotateX(${scrollPercentage * 20}deg)`;
    }
    
    // Hide scroll indicator when scrolling down
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator && scrollPercentage > 0.1) {
      scrollIndicator.style.opacity = 0;
    }
  }
  
  // Function to animate hero content
  function animateHeroContent(scrollPercentage) {
    const heroContent = document.querySelector('.hero-content');
    const heroInteractive = document.querySelector('.hero-interactive-container');
    
    if (heroContent) {
      // Fade out and move up as user scrolls
      heroContent.style.opacity = 1 - scrollPercentage * 1.5;
      heroContent.style.transform = `translateY(${scrollPercentage * -70}px)`;
    }
    
    if (heroInteractive) {
      // Fade out and move up as user scrolls
      heroInteractive.style.opacity = 1 - scrollPercentage * 1.5;
      heroInteractive.style.transform = `translateY(${scrollPercentage * -50}px) rotateY(${scrollPercentage * 45}deg)`;
    }
  }
  
  // Function to animate tech elements based on mouse position
  function animateTechElements(mouseX, mouseY) {
    // Animate tech icons with mouse
    techIcons.forEach((icon, index) => {
      const depth = index * 0.05 + 0.5;
      const moveX = mouseX * 40 * depth;
      const moveY = mouseY * 40 * depth;
      icon.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    // Animate data packets with mouse
    dataPackets.forEach((packet, index) => {
      const depth = (index * 0.1) + 0.8;
      const moveX = mouseX * 25 * depth;
      const moveY = mouseY * 25 * depth;
      packet.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    // Animate connection lines with mouse
    connectionLines.forEach((line, index) => {
      const angle = index * 15;
      const newAngle = angle + (mouseX * 10);
      line.style.transform = `rotate(${newAngle}deg)`;
    });
  }
  
  // Function to animate tech elements based on scroll
  function animateTechElementsOnScroll(scrollPercentage) {
    // Make tech icons spread out when scrolling
    techIcons.forEach((icon, index) => {
      const spread = 100 * scrollPercentage;
      const angle = (index / techIcons.length) * Math.PI * 2;
      const x = Math.cos(angle) * spread;
      const y = Math.sin(angle) * spread;
      
      // Combine with current transform
      const currentTransform = icon.style.transform || '';
      const matches = currentTransform.match(/translate\(([^)]+)\)/);
      
      if (matches && matches[1]) {
        const [currentX, currentY] = matches[1].split(',').map(val => parseFloat(val));
        icon.style.transform = `translate(${currentX + x}px, ${currentY + y}px)`;
      }
    });
    
    // Speed up data packets when scrolling
    dataPackets.forEach(packet => {
      packet.style.animationDuration = `${5 - (scrollPercentage * 3)}s`;
    });
  }
  
  // Function to animate the IT hub with mouse movement
  function animateITHub(mouseX, mouseY) {
    const itHub = document.querySelector('.interactive-it-hub');
    if (itHub) {
      // 3D rotation effect following the mouse
      const rotateY = mouseX * 15;
      const rotateX = mouseY * -15;
      itHub.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    }
  }
  
  // Function to update cursor follower
  function updateCursorFollower(e) {
    if (!cursorFollower) return;
    
    // Get mouse position
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Update cursor follower position
    cursorFollower.style.left = `${mouseX}px`;
    cursorFollower.style.top = `${mouseY}px`;
    
    // Check if hovering over interactive elements
    const isOverInteractive = e.target.closest('.connection-icon') || 
                             e.target.closest('.hub-center') || 
                             e.target.closest('.tech-icon');
    
    if (isOverInteractive) {
      cursorFollower.style.width = '50px';
      cursorFollower.style.height = '50px';
      cursorFollower.style.background = 'rgba(255, 0, 0, 0.3)';
    } else {
      cursorFollower.style.width = '30px';
      cursorFollower.style.height = '30px';
      cursorFollower.style.background = 'rgba(255, 0, 0, 0.2)';
    }
  }
  
  // Function to create tech particles
  function createTechParticles() {
    const particleCount = 50;
    const symbols = ['01', '10', '#', '{', '}', '<', '>', '0', '1', '/', '*'];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'tech-particle';
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random size
      const size = Math.random() * 20 + 10;
      
      // Random symbol and color
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const red = Math.floor(Math.random() * 155) + 100; // Reddish hue
      
      // Set styles
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.fontSize = `${size}px`;
      particle.style.color = `rgba(${red}, 0, 0, 0.2)`;
      particle.textContent = symbol;
      
      // Random floating animation
      const animDuration = Math.random() * 10 + 10;
      const animDelay = Math.random() * 5;
      particle.style.animation = `float ${animDuration}s infinite ease-in-out ${animDelay}s`;
      
      // Add to container
      techParticles.appendChild(particle);
    }
  }
  
  // Initialize on page load
  animateOnScroll(0);
}); 