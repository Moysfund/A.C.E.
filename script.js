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
const yOffsets = [0.6, 1.6, 2.6, 3.6, 4.6];
stageLabels.forEach((text, i) => {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.color = '#b9c8e6';
    div.style.fontSize = '10px';
    div.style.fontWeight = '600';
    div.style.fontFamily = 'Inter, sans-serif';
    div.style.background = 'rgba(11, 15, 26, 0.6)';
    div.style.padding = '2px 12px';
    div.style.borderRadius = '20px';
    div.style.border = '1px solid rgba(0, 212, 255, 0.2)';
    div.style.backdropFilter = 'blur(4px)';
    div.style.letterSpacing = '0.5px';
    div.style.textShadow = '0 2px 8px rgba(0,0,0,0.8)';
    const label = new CSS2DObject(div);
    label.position.set(-5.8, yOffsets[i], 0.5);
    labelGroup.add(label);
});
buildingGroup.add(labelGroup);

// A.C.E. AI badge
const aiDiv = document.createElement('div');
aiDiv.textContent = '⚡ A.C.E. AI analyzing ...';
aiDiv.style.color = '#00d4ff';
aiDiv.style.fontSize = '11px';
aiDiv.style.fontWeight = '700';
aiDiv.style.background = 'rgba(11, 15, 26, 0.7)';
aiDiv.style.padding = '4px 16px';
aiDiv.style.borderRadius = '30px';
aiDiv.style.border = '1px solid #00d4ff';
aiDiv.style.backdropFilter = 'blur(4px)';
const aiLabel = new CSS2DObject(aiDiv);
aiLabel.position.set(0, 5.0, 4.2);
buildingGroup.add(aiLabel);

// warning label
const warnDiv = document.createElement('div');
warnDiv.textContent = '⚠️ Contravention: Column 2';
warnDiv.style.color = '#ff6b6b';
warnDiv.style.fontSize = '10px';
warnDiv.style.fontWeight = '700';
warnDiv.style.background = 'rgba(180, 30, 30, 0.25)';
warnDiv.style.padding = '2px 14px';
warnDiv.style.borderRadius = '30px';
warnDiv.style.border = '1px solid #ff6b6b';
warnDiv.style.backdropFilter = 'blur(4px)';
const warnLabel = new CSS2DObject(warnDiv);
warnLabel.position.set(-2.5, 2.8, 4.0);
buildingGroup.add(warnLabel);

scene.add(buildingGroup);

// particles
const particleCount = 400;
const particleGeo = new THREE.BufferGeometry();
const particlePos = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
    particlePos[i] = (Math.random() - 0.5) * 60;
    if (i % 3 === 1) particlePos[i] = Math.random() * 12;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
const particleMat = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.06,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// ===== SPLASH LOGIC =====
document.getElementById('enterBtn').addEventListener('click', () => {
    document.getElementById('splash-overlay').classList.add('hidden');
    controls.autoRotate = true;
});

// ===== RESIZE =====
window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    labelRenderer.setSize(w, h);
});

// ===== ANIMATION =====
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    const hookObj = craneGroup.children.find(c => c.geometry && c.geometry.type === 'SphereGeometry');
    if (hookObj) {
        hookObj.position.y = 5.8 + Math.sin(Date.now() * 0.0015) * 0.15;
    }
    particles.rotation.y += 0.0002;

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();

setTimeout(() => {
    controls.autoRotate = true;
}, 500);

// ===== GLOBAL FUNCTIONS (for inline onclick) =====
window.navigateTo = function(page) {
    // For now, just show a toast
    showToast('📄 Opening ' + page.replace('-', ' ') + '... (coming soon)');
};

window.syncGoogleSheet = function() {
    showToast('🔄 Syncing with Google Sheets... (simulated)');
};

window.showToast = function(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

// ===== ADD PAGES DYNAMICALLY =====
// We'll inject page content on demand
const pageTemplates = {
    'stage-report': `
        <h2><i class="fas fa-camera"></i> New Stage Report</h2>
        <form id="stageReportForm">
            <div class="form-group">
                <label>Project Name <span class="required">*</span></label>
                <input type="text" placeholder="e.g., Eko Tower Phase 2" required />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Stage <span class="required">*</span></label>
                    <select required>
                        <option value="">Select stage</option>
                        <option>Ground Floor</option>
                        <option>1st Floor</option>
                        <option>2nd Floor</option>
                        <option>3rd Floor</option>
                        <option>Roof</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Team <span class="required">*</span></label>
                    <select required>
                        <option value="">Select team</option>
                        <option>Team A</option>
                        <option>Team B</option>
                        <option>Team C</option>
                        <option>Special Team</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Upload Photos <span class="required">*</span></label>
                <div class="file-upload" onclick="document.getElementById('photoInput').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    Tap to upload photos<br />
                    <small style="color:#5a6f92;">JPEG, PNG (max 10 images)</small>
                    <input type="file" id="photoInput" multiple accept="image/*" style="display:none;" />
                </div>
            </div>
            <div class="form-group">
                <label>Additional Notes</label>
                <textarea placeholder="Any observations or special instructions..."></textarea>
            </div>
            <div class="ai-response">
                <h4>⚡ A.C.E. AI Analysis</h4>
                <div class="observation">✅ Structural integrity: Nominal</div>
                <div class="observation">⚠️ Rebar spacing: Check column 3</div>
                <div class="observation">ℹ️ Concrete curing: In progress</div>
            </div>
            <button type="submit" class="submit-btn"><i class="fas fa-paper-plane"></i> Submit Stage Report</button>
        </form>
    `,
    'contravention': `
        <h2><i class="fas fa-exclamation-triangle"></i> Contravention Report</h2>
        <form id="contraventionForm">
            <div class="form-group">
                <label>Project / Building <span class="required">*</span></label>
                <input type="text" placeholder="e.g., 12 Allen Avenue" required />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Stage <span class="required">*</span></label>
                    <select required>
                        <option value="">Select stage</option>
                        <option>Ground Floor</option>
                        <option>1st Floor</option>
                        <option>2nd Floor</option>
                        <option>3rd Floor</option>
                        <option>Roof</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Severity <span class="required">*</span></label>
                    <select required>
                        <option value="">Select severity</option>
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Contravention Details <span class="required">*</span></label>
                <textarea placeholder="Describe the violation..." required></textarea>
            </div>
            <div class="form-group">
                <label>Upload Evidence <span class="required">*</span></label>
                <div class="file-upload" onclick="document.getElementById('contraPhotoInput').click()">
                    <i class="fas fa-camera"></i>
                    Tap to upload evidence photos<br />
                    <input type="file" id="contraPhotoInput" multiple accept="image/*" style="display:none;" />
                </div>
            </div>
            <div class="form-group">
                <label>Recommended Action</label>
                <div class="toggle-group">
                    <button type="button" class="active">⚠️ Stop Work Order</button>
                    <button type="button">🔒 Seal-Up Notice</button>
                    <button type="button">🏚️ Demolition Notice</button>
                </div>
            </div>
            <div class="ai-response">
                <h4>⚡ A.C.E. AI Analysis</h4>
                <div class="observation">🚨 Violation: Structural column exposed rebar</div>
                <div class="observation">📋 Code Reference: LASBCA Regulation 7.2.1</div>
                <div class="observation">⚖️ Recommended: Stop Work Order</div>
            </div>
            <button type="submit" class="submit-btn"><i class="fas fa-gavel"></i> Submit Contravention</button>
        </form>
    `,
    'pca-audit': `
        <h2><i class="fas fa-clipboard-check"></i> Post-Construction Audit</h2>
        <form id="pcaForm">
            <div class="form-group">
                <label>Project Name <span class="required">*</span></label>
                <input type="text" placeholder="Completed project name" required />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Audit Date <span class="required">*</span></label>
                    <input type="date" required />
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select>
                        <option>Pass</option>
                        <option>Fail</option>
                        <option>Partial Pass</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Upload As-Built Photos</label>
                <div class="file-upload" onclick="document.getElementById('pcaPhotoInput').click()">
                    <i class="fas fa-images"></i>
                    Tap to upload as-built photos<br />
                    <input type="file" id="pcaPhotoInput" multiple accept="image/*" style="display:none;" />
                </div>
            </div>
            <div class="form-group">
                <label>Auditor's Notes</label>
                <textarea placeholder="Final observations and recommendations..."></textarea>
            </div>
            <div class="ai-response">
                <h4>⚡ A.C.E. AI Analysis</h4>
                <div class="observation">✅ Matches approved plans: 92%</div>
                <div class="observation">⚠️ Minor deviations: Window alignment</div>
                <div class="observation">📋 Recommendation: Issue Certificate of Completion</div>
            </div>
            <button type="submit" class="submit-btn"><i class="fas fa-check-circle"></i> Submit PCA Audit</button>
        </form>
    `
};

// Function to inject page content
window.navigateTo = function(page) {
    // Remove any existing page container
    const existing = document.querySelector('.page-container');
    if (existing) {
        existing.remove();
    }

    const container = document.createElement('div');
    container.className = 'page-container active';
    container.innerHTML = `
        <div class="page-header">
            <h2>${pageTemplates[page] ? pageTemplates[page].split('\n')[0] || 'Loading...' : 'Page'}</h2>
            <button class="close-btn" onclick="this.closest('.page-container').remove()">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
        <div class="page-content">
            ${pageTemplates[page] || '<p>Page under construction.</p>'}
        </div>
    `;
    document.body.appendChild(container);

    // Re-bind toggle buttons
    container.querySelectorAll('.toggle-group button').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.toggle-group').querySelectorAll('button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Handle form submissions
    const form = container.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('✅ Report submitted successfully!');
            setTimeout(() => {
                this.closest('.page-container').remove();
            }, 1500);
        });
    }
};

// Toast function
window.showToast = function(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};
