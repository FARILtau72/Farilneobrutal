/**
 * Three.js Developer Core / Orb Implementation
 * Performance-first, lightweight interactive 3D signature for Faril Putra Pratama
 */

export class DeveloperOrb {
  constructor(containerId = 'hero-three-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.host = document.getElementById('three-canvas-host');
    this.fallback = document.getElementById('three-fallback');
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.coreGroup = null;
    this.particles = null;
    this.techBadges = [];
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotationX = 0;
    this.targetRotationY = 0;
    this.isHovered = false;
    this.isVisible = true;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.innerWidth < 768;
    this.animationFrameId = null;

    this.init();
  }

  async init() {
    if (this.isReducedMotion) {
      this.showFallback();
      return;
    }

    try {
      // Dynamic import Three.js to keep initial bundle ultra-light
      const THREE = await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js');
      this.THREE = THREE;

      this.setupScene();
      this.createCore();
      this.createOrbitingParticles();
      this.createTechBadges();
      this.bindEvents();
      this.animate();

      if (this.fallback) this.fallback.style.display = 'none';
      if (this.host) this.host.style.display = 'block';
    } catch (err) {
      console.warn('Three.js failed to load or WebGL unsupported, showing CSS fallback:', err);
      this.showFallback();
    }
  }

  showFallback() {
    if (this.host) this.host.style.display = 'none';
    if (this.fallback) this.fallback.style.display = 'block';
  }

  setupScene() {
    const THREE = this.THREE;
    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 450;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = 7;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    // Performance rule: Cap DPR to 1.5
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);

    if (this.host) {
      this.host.innerHTML = '';
      this.host.appendChild(this.renderer.domElement);
    }

    // Ambient & directional lights with clean bright tones
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x2563EB, 1.5);
    dirLight1.position.set(5, 5, 4);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x22D3EE, 1.2);
    dirLight2.position.set(-5, -3, 3);
    this.scene.add(dirLight2);

    this.coreGroup = new THREE.Group();
    this.scene.add(this.coreGroup);
  }

  createCore() {
    const THREE = this.THREE;

    // Inner glowing sphere
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x2563EB,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      shininess: 90
    });
    this.innerMesh = new THREE.Mesh(innerGeo, innerMat);
    this.coreGroup.add(this.innerMesh);

    // Node points at vertices
    const pointsGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const pointsMat = new THREE.PointsMaterial({
      color: 0x38BDF8,
      size: 0.08,
      transparent: true,
      opacity: 0.95
    });
    this.nodePoints = new THREE.Points(pointsGeo, pointsMat);
    this.coreGroup.add(this.nodePoints);

    // Central core glowing orb (subtle transparent aura behind Faril's photo)
    const centerGeo = new THREE.SphereGeometry(1.1, 24, 24);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      emissive: 0x2563EB,
      emissiveIntensity: 0.15,
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.08
    });
    this.centerOrb = new THREE.Mesh(centerGeo, centerMat);
    this.coreGroup.add(this.centerOrb);

    // Orbit rings
    const ringGeo1 = new THREE.RingGeometry(2.3, 2.34, 48);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x22D3EE,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.ring1.rotation.x = Math.PI / 3;
    this.coreGroup.add(this.ring1);

    const ringGeo2 = new THREE.RingGeometry(2.7, 2.73, 48);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xA78BFA,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.ring2.rotation.y = Math.PI / 4;
    this.ring2.rotation.x = -Math.PI / 6;
    this.coreGroup.add(this.ring2);
  }

  createOrbitingParticles() {
    const THREE = this.THREE;
    const count = this.isMobile ? 50 : 110; // Max ~100-150 particles
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0x2563EB), // Blue
      new THREE.Color(0x38BDF8), // Sky Blue
      new THREE.Color(0x22D3EE), // Cyan
      new THREE.Color(0xA3E635), // Lime
      new THREE.Color(0xA78BFA)  // Violet
    ];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 2.1 + (Math.random() * 1.6);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    this.particles = new THREE.Points(geo, mat);
    this.coreGroup.add(this.particles);
  }

  createTechBadgeSprite(text, bgColor = '#0F172A', textColor = '#F8FAFC') {
    const THREE = this.THREE;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 84;
    const ctx = canvas.getContext('2d');

    // Rounded tag background
    ctx.fillStyle = bgColor;
    const r = 24;
    const x = 8, y = 8, w = 240, h = 68;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();

    // Subtle border
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Text styling
    ctx.fillStyle = textColor;
    ctx.font = 'bold 34px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 42);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1.1, 0.38, 1);
    return sprite;
  }

  createTechBadges() {
    const tags = ['Python', 'FastAPI', 'AI', 'Web', 'Git', 'API', 'ML'];
    const radius = 2.4;

    tags.forEach((tag, idx) => {
      const angle = (idx / tags.length) * Math.PI * 2;
      const yOffset = (Math.sin(idx * 1.5) * 0.7);
      const sprite = this.createTechBadgeSprite(tag);

      sprite.userData = {
        baseAngle: angle,
        radius: radius + (idx % 2 === 0 ? 0.3 : -0.2),
        speed: 0.005 + (idx % 3) * 0.002,
        y: yOffset
      };

      this.techBadges.push(sprite);
      this.coreGroup.add(sprite);
    });
  }

  bindEvents() {
    // Mouse movement rotation
    window.addEventListener('mousemove', (e) => {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      this.mouseX = (e.clientX - halfX) / halfX;
      this.mouseY = (e.clientY - halfY) / halfY;
      this.targetRotationY = this.mouseX * 0.6;
      this.targetRotationX = this.mouseY * 0.4;
    }, { passive: true });

    // Hover state speed-up
    this.container.addEventListener('mouseenter', () => {
      this.isHovered = true;
    });
    this.container.addEventListener('mouseleave', () => {
      this.isHovered = false;
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.onResize();
    }, { passive: true });

    // Scroll effect: shrink, rotate, and fade Three.js core
    window.addEventListener('scroll', () => {
      this.onScroll();
    }, { passive: true });

    // Visibility Observer to pause when hero is off-screen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(this.container);

    // Tab visibility check
    document.addEventListener('visibilitychange', () => {
      this.isVisible = (document.visibilityState === 'visible');
    });
  }

  onScroll() {
    if (!this.coreGroup) return;
    const scrollY = window.scrollY;
    const maxScroll = 600;
    const progress = Math.min(scrollY / maxScroll, 1);

    // Gently shrink, rotate, and fade away
    const scale = Math.max(0.2, 1 - progress * 0.75);
    this.coreGroup.scale.set(scale, scale, scale);
    this.coreGroup.position.y = progress * 1.5;
    
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.style.opacity = Math.max(0, 1 - progress * 1.2);
    }

    const photoContainer = document.querySelector('.hero-photo-container');
    if (photoContainer) {
      photoContainer.style.opacity = Math.max(0, 1 - progress * 1.2);
      photoContainer.style.transform = `scale(${Math.max(0.85, 1 - progress * 0.2)}) translateY(${progress * 24}px)`;
    }
  }

  onResize() {
    if (!this.camera || !this.renderer || !this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.isMobile = window.innerWidth < 768;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Performance rule: only render while visible
    if (!this.isVisible || !this.renderer || !this.scene || !this.camera) return;

    const baseSpeed = this.isHovered ? 0.016 : 0.007;

    // Smooth rotation
    this.coreGroup.rotation.y += baseSpeed;
    this.coreGroup.rotation.x += (this.targetRotationX - this.coreGroup.rotation.x) * 0.05;
    this.coreGroup.rotation.z += (this.targetRotationY - this.coreGroup.rotation.z) * 0.05;

    // Counter rotate inner elements
    if (this.innerMesh) this.innerMesh.rotation.y -= 0.003;
    if (this.ring1) this.ring1.rotation.z += 0.008;
    if (this.ring2) this.ring2.rotation.z -= 0.006;
    if (this.particles) this.particles.rotation.y += 0.004;

    // Orbit tech labels around core
    const time = performance.now() * 0.001;
    this.techBadges.forEach((badge) => {
      const data = badge.userData;
      const curAngle = data.baseAngle + (time * (this.isHovered ? 0.5 : 0.25));
      badge.position.x = Math.cos(curAngle) * data.radius;
      badge.position.z = Math.sin(curAngle) * data.radius;
      badge.position.y = data.y + Math.sin(time + curAngle) * 0.15;
    });

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
