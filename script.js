// ========== THREE.JS 3D SCENE ==========
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// ----- setup scene -----
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0f1a);

// ----- camera -----
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(18, 12, 22);
camera.lookAt(0, 0, 0);

// ----- renderers -----
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.left = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

// ----- controls -----
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;
controls.target.set(0, 3, 0);
controls.maxPolarAngle = Math.PI / 2.2;
controls.minDistance = 10;
controls.maxDistance = 40;

// ----- lights -----
const ambientLight = new THREE.AmbientLight(0x404066, 0.6);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffeedd, 1.8);
mainLight.position.set(10, 20, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x4488ff, 0.4);
fillLight.position.set(-10, 5, -10);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffaa55, 0.5);
rimLight.position.set(-5, 10, -15);
scene.add(rimLight);

// ----- ground -----
const groundGeo = new THREE.PlaneGeometry(40, 40);
const groundMat = new THREE.MeshStandardMaterial({
    color: 0x141d2b,
    roughness: 0.8,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
ground.receiveShadow = true;
scene.add(ground);

// grid - A.C.E. cyan theme
const gridHelper = new THREE.GridHelper(32, 20, 0x00d4ff, 0x1a2a44);
gridHelper.position.y = 0;
scene.add(gridHelper);

// ===== BUILDING =====
const buildingGroup = new THREE.Group();

// slab
const slabMat = new THREE.MeshStandardMaterial({ color: 0x4a5a7a, roughness: 0.6, metalness: 0.3 });
const slabGeo = new THREE.BoxGeometry(10, 0.4, 7);
const slab = new THREE.Mesh(slabGeo, slabMat);
slab.position.set(0, 0.2, 0);
slab.castShadow = true;
slab.receiveShadow = true;
buildingGroup.add(slab);

// columns with rebar (A.C.E. cyan highlights)
const colMat = new THREE.MeshStandardMaterial({ color: 0x8a9bb5, roughness: 0.3, metalness: 0.7 });
const rebarMat = new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 0.1 });
const positions = [
    [-4, -2.5],
    [-4, 2.5],
    [0, -2.5],
    [0, 2.5],
    [4, -2.5],
    [4, 2.5]
];
positions.forEach(([x, z]) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 2.8, 8), colMat);
    col.position.set(x, 1.6, z);
    col.castShadow = true;
    buildingGroup.add(col);

    for (let h = 0.4; h < 2.8; h += 0.7) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.04, 6, 12), rebarMat);
        ring.position.set(x, h + 0.3, z);
        ring.rotation.x = Math.PI / 2;
        buildingGroup.add(ring);
    }
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const rx = x + 0.3 * Math.cos(angle);
        const rz = z + 0.3 * Math.sin(angle);
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.8, 4), rebarMat);
        stick.position.set(rx, 1.6, rz);
        buildingGroup.add(stick);
    }
});

// floors
const floorMat = new THREE.MeshStandardMaterial({
    color: 0x3a4a6a,
    roughness: 0.5,
    metalness: 0.2,
    transparent: true,
    opacity: 0.5
});
const floorGeo = new THREE.BoxGeometry(9.2, 0.2, 6.2);
for (let i = 1; i <= 3; i++) {
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, 0.6 + i * 1.0, 0);
    floor.castShadow = true;
    floor.receiveShadow = true;
    buildingGroup.add(floor);
    const edges = new THREE.EdgesGeometry(floorGeo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.15 }));
    line.position.copy(floor.position);
    buildingGroup.add(line);
}

// roof
const roofMat = new THREE.MeshStandardMaterial({ color: 0x5a6a8a, roughness: 0.4, metalness: 0.2 });
const roof = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.3, 6.6), roofMat);
roof.position.set(0, 4.2, 0);
roof.castShadow = true;
roof.receiveShadow = true;
buildingGroup.add(roof);

// crane with A.C.E. theme
const craneGroup = new THREE.Group();
const craneMat = new THREE.MeshStandardMaterial({ color: 0x88aacc, roughness: 0.4, metalness: 0.6 });
const tower = new THREE.Mesh(new THREE.BoxGeometry(0.3, 7, 0.3), craneMat);
tower.position.set(6.5, 3.5, 3.5);
craneGroup.add(tower);
const jib = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.15, 0.15), craneMat);
jib.position.set(8.2, 7, 3.5);
craneGroup.add(jib);
const hookMat = new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 0.15 });
const hook = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), hookMat);
hook.position.set(9.5, 5.8, 3.5);
craneGroup.add(hook);
const cableMat = new THREE.MeshStandardMaterial({ color: 0x555577 });
const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 4), cableMat);
cable.position.set(9.5, 6.4, 3.5);
craneGroup.add(cable);
buildingGroup.add(craneGroup);

// labels
const labelGroup = new THREE.Group();
const stageLabels = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', 'Roof'];
const yOffsets = [0.6, 1.6,
