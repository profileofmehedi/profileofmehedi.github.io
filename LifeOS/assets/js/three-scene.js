/**
 * LifeOS — Three.js 3D Ambient Visual Engine & Interactive Card FX
 * Features:
 * - Dynamic 3D ambient particle constellation reacting to mouse movement.
 * - Light and Dark theme palette synchronization.
 * - Interactive 3D tilt effects for fintech credit cards.
 * - Reduced motion support.
 */

const LifeThreeScene = (() => {
  let scene, camera, renderer, particles, animationFrameId;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let containerEl = null;
  let isRunning = false;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initAmbientParticles(canvasId = "login-three-canvas") {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.THREE) return;

    containerEl = canvas.parentElement;
    const width = containerEl ? containerEl.clientWidth : window.innerWidth;
    const height = containerEl ? containerEl.clientHeight : window.innerHeight;

    // Destroy existing scene if running
    destroy();

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.z = 800;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle geometry
    const particleCount = prefersReducedMotion ? 250 : 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const isDark = document.body.classList.contains("dark-mode");
    const primaryColor = isDark ? new THREE.Color("#818CF8") : new THREE.Color("#635BFF");
    const secondaryColor = isDark ? new THREE.Color("#38BDF8") : new THREE.Color("#16A36A");

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1800;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1200;

      const mixedColor = primaryColor.clone().lerp(secondaryColor, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Material
    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.55,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse listener
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onWindowResize);

    isRunning = true;
    animate();
  }

  function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.4;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.4;
  }

  function onWindowResize() {
    if (!renderer || !camera || !containerEl) return;
    const width = containerEl.clientWidth || window.innerWidth;
    const height = containerEl.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    if (!isRunning) return;
    animationFrameId = requestAnimationFrame(animate);

    if (!prefersReducedMotion && particles) {
      targetX = mouseX * 0.05;
      targetY = mouseY * 0.05;

      particles.rotation.x += 0.0006;
      particles.rotation.y += 0.001;

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
  }

  function updateThemeColors() {
    if (!particles || !particles.material) return;
    const isDark = document.body.classList.contains("dark-mode");
    particles.material.opacity = isDark ? 0.75 : 0.55;
  }

  function destroy() {
    isRunning = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onWindowResize);
    if (particles) {
      if (particles.geometry) particles.geometry.dispose();
      if (particles.material) particles.material.dispose();
      particles = null;
    }
    if (renderer) {
      renderer.dispose();
      renderer = null;
    }
    scene = null;
    camera = null;
  }

  /**
   * 3D Card Tilt Interaction for credit and debit cards
   */
  function bind3DCardTilt(cardSelector = ".life-card-3d") {
    if (prefersReducedMotion) return;

    $(document).on("mousemove", cardSelector, function (e) {
      const card = $(this);
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.css({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: "transform 0.1s ease-out"
      });
    });

    $(document).on("mouseleave", cardSelector, function () {
      $(this).css({
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: "transform 0.5s ease-out"
      });
    });
  }

  return {
    initAmbientParticles,
    updateThemeColors,
    bind3DCardTilt,
    destroy
  };
})();

if (typeof window !== "undefined") {
  window.LifeThreeScene = LifeThreeScene;
}
