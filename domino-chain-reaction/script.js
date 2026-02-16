// Three.js + Cannon.js 3D 骨牌遊戲

class DominoGame {
    constructor() {
        this.container = document.getElementById('container');
        this.dominoes = [];
        this.bodies = [];
        this.activeDomino = null;
        this.placeMode = true;
        this.lastFallenCount = 0;
        this.frameCount = 0;
        this.lastTime = Date.now();

        // 物理參數
        this.params = {
            gravity: 20,
            dominoHeight: 5,
            dominoThickness: 0.5,
            dominoWidth: 1,
            dominoDepth: 0.3
        };

        // 三維視角控制
        this.camera3DControls = {
            phi: Math.PI / 4,
            theta: Math.PI / 4,
            radius: 30,
            target: { x: 0, y: 0, z: 0 },
            isDragging: false,
            lastX: 0,
            lastY: 0
        };

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Three.js 場景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a14);
        this.scene.fog = new THREE.Fog(0x0a0a14, 100, 200);

        // 相機
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.updateCameraPosition();

        // 渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // 光照
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(20, 30, 20);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);

        // 地面
        this.createGround();

        // 物理世界
        this.world = new CANNON.World();
        this.world.gravity.set(0, -this.params.gravity, 0);
        this.world.defaultContactMaterial.friction = 0.3;
        this.world.defaultContactMaterial.restitution = 0.3;

        // 地面物理體
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(groundBody);

        window.addEventListener('resize', () => this.onWindowResize());
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a3a52,
            metalness: 0.1,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // 網格幫手
        const gridHelper = new THREE.GridHelper(100, 20, 0x00d4ff, 0x004477);
        gridHelper.position.y = 0.01;
        this.scene.add(gridHelper);
    }

    updateCameraPosition() {
        const { phi, theta, radius, target } = this.camera3DControls;
        this.camera.position.x = target.x + radius * Math.sin(phi) * Math.cos(theta);
        this.camera.position.y = target.y + radius * Math.cos(phi);
        this.camera.position.z = target.z + radius * Math.sin(phi) * Math.sin(theta);
        this.camera.lookAt(target.x, target.y, target.z);
    }

    createDomino(x, z, rotationY = 0) {
        const { dominoHeight, dominoWidth, dominoDepth, dominoThickness } = this.params;

        // Three.js 視覺
        const geometry = new THREE.BoxGeometry(dominoThickness, dominoHeight, dominoDepth);
        const material = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.5 ? 0xff6b6b : 0x00ff88,
            metalness: 0.3,
            roughness: 0.4
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.set(x, dominoHeight / 2, z);
        mesh.rotation.y = rotationY;
        this.scene.add(mesh);

        // Cannon.js 物理體
        const shape = new CANNON.Box(
            new CANNON.Vec3(dominoThickness / 2, dominoHeight / 2, dominoDepth / 2)
        );
        const body = new CANNON.Body({
            mass: 1,
            shape: shape,
            linearDamping: 0.3,
            angularDamping: 0.3
        });
        body.position.set(x, dominoHeight / 2, z);
        body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotationY);
        this.world.addBody(body);

        this.dominoes.push(mesh);
        this.bodies.push(body);

        return { mesh, body };
    }

    placeDominoAtMouse(event) {
        if (!this.placeMode) return;

        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // 與地面相交
        const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
        const plane = new THREE.Mesh(planeGeometry);
        plane.rotation.x = -Math.PI / 2;

        const intersects = this.raycaster.ray.intersectPlane(
            new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
        );

        if (intersects) {
            const x = intersects.x;
            const z = intersects.z;
            const rotationY = (Math.random() - 0.5) * 0.5;
            this.createDomino(x, z, rotationY);
            this.updateStats();
        }
    }

    activateFirstDomino() {
        if (this.dominoes.length === 0) return;

        const randomIndex = Math.floor(Math.random() * this.dominoes.length);
        const body = this.bodies[randomIndex];

        // 施加強大的推力
        body.velocity.set(
            (Math.random() - 0.5) * 15,
            5,
            (Math.random() - 0.5) * 15
        );
        body.angularVelocity.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
        );
    }

    clearScene() {
        // 移除 Three.js 物體
        this.dominoes.forEach(domino => {
            this.scene.remove(domino);
        });
        this.dominoes = [];

        // 移除物理體
        this.bodies.forEach(body => {
            this.world.removeBody(body);
        });
        this.bodies = [];

        this.updateStats();
    }

    updatePhysics() {
        this.world.step(1 / 60);

        // 同步 Three.js 與 Cannon.js
        for (let i = 0; i < this.dominoes.length; i++) {
            const mesh = this.dominoes[i];
            const body = this.bodies[i];

            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        }

        // 計算倒下的骨牌
        let fallenCount = 0;
        this.bodies.forEach((body, index) => {
            const mesh = this.dominoes[index];
            const angle = Math.abs(mesh.rotation.x) + Math.abs(mesh.rotation.z);
            if (angle > 0.5) fallenCount++;
        });
        this.lastFallenCount = fallenCount;
    }

    updateStats() {
        document.getElementById('dominoCount').textContent = this.dominoes.length;
        document.getElementById('fallenCount').textContent = this.lastFallenCount;

        this.frameCount++;
        const now = Date.now();
        if (now - this.lastTime >= 1000) {
            document.getElementById('fps').textContent = this.frameCount;
            this.frameCount = 0;
            this.lastTime = now;
        }
    }

    setupEventListeners() {
        // 放置模式
        document.getElementById('placeModeBtn').addEventListener('click', (e) => {
            this.placeMode = !this.placeMode;
            e.target.classList.toggle('active');
        });

        // 清空場景
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearScene();
        });

        // 啟動連鎖反應
        document.getElementById('activateBtn').addEventListener('click', () => {
            this.activateFirstDomino();
        });

        // 重置
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.clearScene();
            this.placeMode = true;
            document.getElementById('placeModeBtn').classList.add('active');
        });

        // 滑塊控制
        document.getElementById('gravitySlider').addEventListener('input', (e) => {
            this.params.gravity = parseFloat(e.target.value);
            this.world.gravity.y = -this.params.gravity;
            document.getElementById('gravityValue').textContent = e.target.value;
        });

        document.getElementById('heightSlider').addEventListener('input', (e) => {
            this.params.dominoHeight = parseFloat(e.target.value);
            document.getElementById('heightValue').textContent = e.target.value;
        });

        document.getElementById('thicknessSlider').addEventListener('input', (e) => {
            this.params.dominoThickness = parseFloat(e.target.value);
            document.getElementById('thicknessValue').textContent = e.target.value;
        });

        // 鼠標互動
        this.renderer.domElement.addEventListener('click', (e) => {
            if (e.button === 0) { // 左鍵
                this.placeDominoAtMouse(e);
            }
        });

        this.renderer.domElement.addEventListener('mousedown', (e) => {
            if (e.button === 2) { // 右鍵
                this.camera3DControls.isDragging = true;
                this.camera3DControls.lastX = e.clientX;
                this.camera3DControls.lastY = e.clientY;
            }
        });

        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (this.camera3DControls.isDragging) {
                const deltaX = e.clientX - this.camera3DControls.lastX;
                const deltaY = e.clientY - this.camera3DControls.lastY;

                this.camera3DControls.theta -= deltaX * 0.01;
                this.camera3DControls.phi -= deltaY * 0.01;

                // 限制 phi
                this.camera3DControls.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.camera3DControls.phi));

                this.camera3DControls.lastX = e.clientX;
                this.camera3DControls.lastY = e.clientY;

                this.updateCameraPosition();
            }
        });

        this.renderer.domElement.addEventListener('mouseup', () => {
            this.camera3DControls.isDragging = false;
        });

        // 滑輪縮放
        this.renderer.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera3DControls.radius += e.deltaY * 0.05;
            this.camera3DControls.radius = Math.max(10, Math.min(100, this.camera3DControls.radius));
            this.updateCameraPosition();
        });

        // 右鍵菜單
        this.renderer.domElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updatePhysics();
        this.updateStats();
        this.renderer.render(this.scene, this.camera);
    }
}

// 初始化
window.addEventListener('load', () => {
    new DominoGame();
});
