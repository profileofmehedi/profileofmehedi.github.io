/**
 * Cinema 3D Motion Graphics Engine (Global Standard Edition)
 * Features Dynamic Cinema Camera Dolly, Iridescent Glass Shaders, Orbiting Data Ribbons,
 * and Audio-Reactive Neural Core for YouTube Video Tutorials.
 */

class AISecurityVisualizer {
    constructor(canvasContainerId) {
        this.container = document.getElementById(canvasContainerId);
        this.currentTheme = 'threat-blue';
        
        // Colors
        this.targetColor = new THREE.Color(0x2563eb);
        this.activeColor = new THREE.Color(0x2563eb);
        this.shieldTargetOpacity = 0.0;
        
        // Camera cinematic motion targets
        this.camTargetPos = new THREE.Vector3(0, 0, 480);
        this.camCurrentPos = new THREE.Vector3(0, 0, 480);
        this.camLookTarget = new THREE.Vector3(120, 0, 0);
        this.camLookCurrent = new THREE.Vector3(120, 0, 0);

        this.initScene();
        this.createNeuralCore();
        this.createOrbitingRibbons();
        this.createFloatingGeometry();
        this.createDefenseShield();
        this.setupEventListeners();
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0xf8fafc, 0.0014);

        // Fixed 16:9 Broadcast Aspect Ratio (1920 x 1080)
        this.camera = new THREE.PerspectiveCamera(
            50,
            1920 / 1080,
            0.1,
            2500
        );
        this.camera.position.copy(this.camCurrentPos);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(1920, 1080);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.container.appendChild(this.renderer.domElement);

        // High-Key Studio Lighting
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(this.ambientLight);

        this.keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
        this.keyLight.position.set(350, 450, 350);
        this.scene.add(this.keyLight);

        this.rimLight = new THREE.DirectionalLight(0x3b82f6, 2.5);
        this.rimLight.position.set(-350, -250, 250);
        this.scene.add(this.rimLight);

        this.pointLight = new THREE.PointLight(0x2563eb, 3.0, 950);
        this.pointLight.position.set(280, 60, 200);
        this.scene.add(this.pointLight);

        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    }

    createNeuralCore() {
        this.coreGroup = new THREE.Group();
        this.scene.add(this.coreGroup);

        // 1. Central Refractive Glass Crystal
        const crystalGeo = new THREE.IcosahedronGeometry(74, 2);
        const crystalMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            emissive: 0x2563eb,
            emissiveIntensity: 0.4,
            roughness: 0.08,
            metalness: 0.1,
            transmission: 0.9,
            thickness: 2.0,
            transparent: true,
            opacity: 0.96
        });
        this.crystalCore = new THREE.Mesh(crystalGeo, crystalMat);
        this.coreGroup.add(this.crystalCore);

        // 2. Geometric Wireframe Nodes
        const wireGeo = new THREE.IcosahedronGeometry(100, 1);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });
        this.wireCage = new THREE.Mesh(wireGeo, wireMat);
        this.coreGroup.add(this.wireCage);

        // 3. Glowing Vertex Spheres
        const nodeGeo = new THREE.SphereGeometry(2.5, 12, 12);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0x2563eb });
        const posAttr = wireGeo.attributes.position;
        this.vertexNodes = [];
        
        for (let i = 0; i < posAttr.count; i += 3) {
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
            this.coreGroup.add(node);
            this.vertexNodes.push(node);
        }

        // 4. Soft Aura Glow Sprite
        const spriteMat = new THREE.SpriteMaterial({
            map: this.generateGlowTexture(),
            color: 0x3b82f6,
            transparent: true,
            blending: THREE.NormalBlending,
            opacity: 0.5
        });
        this.glowSprite = new THREE.Sprite(spriteMat);
        this.glowSprite.scale.set(420, 420, 1);
        this.coreGroup.add(this.glowSprite);
    }

    createOrbitingRibbons() {
        // Futuristic Cinema Data Ribbons
        this.ribbons = [];
        const ribbonConfigs = [
            { radius: 140, tube: 1.4, rx: 0.6, ry: 0.9, speedX: 0.005, speedY: 0.007 },
            { radius: 175, tube: 1.1, rx: 1.4, ry: 0.4, speedX: -0.006, speedY: 0.005 },
            { radius: 210, tube: 0.9, rx: 2.3, ry: 1.6, speedX: 0.004, speedY: -0.006 }
        ];

        ribbonConfigs.forEach(cfg => {
            const geo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 24, 140);
            const mat = new THREE.MeshStandardMaterial({
                color: 0x2563eb,
                roughness: 0.15,
                metalness: 0.8,
                transparent: true,
                opacity: 0.7
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.rotation.set(cfg.rx, cfg.ry, 0);
            mesh.userData = { sx: cfg.speedX, sy: cfg.speedY };
            this.coreGroup.add(mesh);
            this.ribbons.push(mesh);
        });
    }

    createDefenseShield() {
        // 3D Hexagonal Defense Shield (Active during defense slides)
        const shieldGeo = new THREE.DodecahedronGeometry(135, 2);
        const shieldMat = new THREE.MeshStandardMaterial({
            color: 0x059669,
            emissive: 0x10b981,
            emissiveIntensity: 0.6,
            wireframe: true,
            transparent: true,
            opacity: 0.0
        });
        this.defenseShield = new THREE.Mesh(shieldGeo, shieldMat);
        this.coreGroup.add(this.defenseShield);
    }

    createFloatingGeometry() {
        // Floating glass droplets & geometric particles
        this.floatingGroup = new THREE.Group();
        this.scene.add(this.floatingGroup);

        const sphereGeo = new THREE.SphereGeometry(3.5, 16, 16);
        this.floaters = [];

        for (let i = 0; i < 40; i++) {
            const mat = new THREE.MeshStandardMaterial({
                color: 0x93c5fd,
                roughness: 0.2,
                metalness: 0.5,
                transparent: true,
                opacity: 0.65 + Math.random() * 0.3
            });
            const mesh = new THREE.Mesh(sphereGeo, mat);
            mesh.position.set(
                (Math.random() - 0.5) * 1300,
                (Math.random() - 0.5) * 850,
                (Math.random() - 0.5) * 650
            );
            mesh.scale.setScalar(0.7 + Math.random() * 1.8);
            mesh.userData = {
                vy: (Math.random() - 0.5) * 0.25,
                vx: (Math.random() - 0.5) * 0.18,
                origY: mesh.position.y
            };
            this.floatingGroup.add(mesh);
            this.floaters.push(mesh);
        }
    }

    generateGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.7)');
        gradient.addColorStop(0.35, 'rgba(147, 197, 253, 0.35)');
        gradient.addColorStop(0.75, 'rgba(241, 245, 249, 0.08)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    // Cinematic Camera Dolly on slide transitions
    setCameraDolly(slideIndex) {
        // Modulate camera angle and position to create cinematic pan
        const angles = [
            { x: 0, y: 0, z: 490, lookX: 120 },
            { x: -40, y: 30, z: 460, lookX: 160 },
            { x: 30, y: -20, z: 480, lookX: 140 },
            { x: -50, y: -25, z: 470, lookX: 150 },
            { x: 40, y: 35, z: 460, lookX: 170 },
            { x: 0, y: -15, z: 450, lookX: 130 },
            { x: 0, y: 0, z: 490, lookX: 120 }
        ];

        const cfg = angles[slideIndex % angles.length];
        this.camTargetPos.set(cfg.x, cfg.y, cfg.z);
        this.camLookTarget.set(cfg.lookX, 0, 0);
    }

    setTheme(theme, slideIndex = 0) {
        this.currentTheme = theme;
        this.setCameraDolly(slideIndex);

        switch (theme) {
            case 'threat-red':
                this.targetColor.setHex(0xe11d48); // Rose / Crimson
                this.setShieldVisible(false);
                break;
            case 'threat-amber':
                this.targetColor.setHex(0xd97706); // Vivid Amber
                this.setShieldVisible(false);
                break;
            case 'threat-purple':
                this.targetColor.setHex(0x7c3aed); // Royal Violet
                this.setShieldVisible(false);
                break;
            case 'defense-green':
                this.targetColor.setHex(0x059669); // Emerald Shield
                this.setShieldVisible(true, 0x059669);
                break;
            case 'defense-cyan':
                this.targetColor.setHex(0x0284c7); // Sky Blue
                this.setShieldVisible(true, 0x0284c7);
                break;
            case 'threat-blue':
            default:
                this.targetColor.setHex(0x2563eb); // Electric Blue
                this.setShieldVisible(false);
                break;
        }
    }

    setShieldVisible(visible, hexColor = 0x059669) {
        if (!this.defenseShield) return;
        this.shieldTargetOpacity = visible ? 0.8 : 0.0;
        if (visible && this.defenseShield.material) {
            if (this.defenseShield.material.color && typeof this.defenseShield.material.color.setHex === 'function') {
                this.defenseShield.material.color.setHex(hexColor);
            }
            if (this.defenseShield.material.emissive && typeof this.defenseShield.material.emissive.setHex === 'function') {
                this.defenseShield.material.emissive.setHex(hexColor);
            }
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = 1920 / 1080;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(1920, 1080);
        });

        window.addEventListener('mousemove', (e) => {
            const stage = document.getElementById('stage-1080p');
            const rect = stage ? stage.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
            const scale = (rect.width || 1920) / 1920;
            const x = (e.clientX - (rect.left || 0)) / scale - 960;
            const y = (e.clientY - (rect.top || 0)) / scale - 540;
            this.mouse.targetX = x * 0.05;
            this.mouse.targetY = y * 0.05;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth color lerp
        this.activeColor.lerp(this.targetColor, 0.05);
        this.crystalCore.material.emissive.copy(this.activeColor);
        this.wireCage.material.color.copy(this.activeColor);
        this.pointLight.color.copy(this.activeColor);
        this.glowSprite.material.color.copy(this.activeColor);
        this.ribbons.forEach(r => r.material.color.copy(this.activeColor));
        this.vertexNodes.forEach(n => n.material.color.copy(this.activeColor));

        // Shield opacity lerp
        if (this.defenseShield && this.shieldTargetOpacity !== undefined) {
            this.defenseShield.material.opacity += (this.shieldTargetOpacity - this.defenseShield.material.opacity) * 0.05;
        }

        // Cinematic Camera Smooth Interpolation
        this.camCurrentPos.lerp(this.camTargetPos, 0.03);
        this.camLookCurrent.lerp(this.camLookTarget, 0.03);
        this.camera.position.copy(this.camCurrentPos);
        this.camera.lookAt(this.camLookCurrent);

        // Smooth Mouse Parallax
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

        // Core Rotations
        this.crystalCore.rotation.y += 0.007;
        this.crystalCore.rotation.x += 0.003;
        this.wireCage.rotation.y -= 0.004;

        if (this.defenseShield) {
            this.defenseShield.rotation.y += 0.008;
            this.defenseShield.rotation.x += 0.004;
        }

        this.ribbons.forEach(ribbon => {
            ribbon.rotation.x += ribbon.userData.sx;
            ribbon.rotation.y += ribbon.userData.sy;
        });

        // Floating particles motion
        this.floaters.forEach(f => {
            f.position.y += f.userData.vy;
            f.position.x += f.userData.vx;
            if (Math.abs(f.position.y - f.userData.origY) > 75) {
                f.userData.vy *= -1;
            }
        });

        // Position core gracefully on the right
        this.coreGroup.position.set(410 + this.mouse.x, 0 - this.mouse.y, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

window.AISecurityVisualizer = AISecurityVisualizer;
