// storage.js - Handles all data persistence with localStorage
const STORAGE_KEYS = {
    PROJECTS: 'ace_projects',
    REPORTS: 'ace_reports',
    CONTRAVENTIONS: 'ace_contraventions',
    PCA: 'ace_pca',
    TEAMS: 'ace_teams',
    SETTINGS: 'ace_settings'
};

// Initialize with sample data if empty
function initStorage() {
    // Projects
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
        const sampleProjects = [
            { id: 1, name: 'Eko Tower Phase 2', location: '12 Allen Avenue, Ikeja', status: 'active', description: 'Commercial high-rise development', stages: ['Ground Floor', '1st Floor', '2nd Floor'], lastReport: '2026-06-18', progress: 65 },
            { id: 2, name: 'Victoria Island Plaza', location: '25 Ahmadu Bello Way, VI', status: 'pending', description: 'Mixed-use development', stages: ['Ground Floor'], lastReport: '2026-06-15', progress: 30 },
            { id: 3, name: 'Surulere Estate', location: '5 Bode Thomas Street, Surulere', status: 'completed', description: 'Residential estate with 20 units', stages: ['Ground Floor', '1st Floor', '2nd Floor', 'Roof'], lastReport: '2026-05-30', progress: 100 },
            { id: 4, name: 'Lekki Phase 1 Project', location: '3 Admiralty Way, Lekki', status: 'contravention', description: 'Luxury apartment complex', stages: ['Ground Floor', '1st Floor'], lastReport: '2026-06-12', progress: 55 }
        ];
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(sampleProjects));
    }

    // Reports (Stage Reports)
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
        const sampleReports = [
            { id: 'SR-2026-001', project: 'Eko Tower Phase 2', stage: '2nd Floor', team: 'Team A', location: '12 Allen Avenue, Ikeja', status: 'approved', date: '2026-06-18', observations: 'Structural integrity nominal. Rebar spacing within tolerance.' },
            { id: 'SR-2026-002', project: 'Victoria Island Plaza', stage: '1st Floor', team: 'Team C', location: '25 Ahmadu Bello Way, VI', status: 'pending', date: '2026-06-16', observations: 'Formwork alignment checked. Curing in progress.' },
            { id: 'SR-2026-003', project: 'Lekki Phase 1', stage: 'Roof', team: 'Special Team', location: '3 Admiralty Way, Lekki', status: 'rejected', date: '2026-06-14', observations: 'Safety issues detected. Edge protection missing.' }
        ];
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(sampleReports));
    }

    // Contraventions
    if (!localStorage.getItem(STORAGE_KEYS.CONTRAVENTIONS)) {
        const sampleContraventions = [
            { id: 'CV-2026-001', project: '12 Allen Avenue', stage: 'Ground Floor', team: 'Team B', severity: 'critical', status: 'active', date: '2026-06-17', details: 'Structural column exposed rebar', action: 'Demolition Notice' },
            { id: 'CV-2026-002', project: 'Ikeja Mall', stage: '1st Floor', team: 'Team B', severity: 'high', status: 'active', date: '2026-06-13', details: 'Inadequate fire safety measures', action: 'Stop Work Order' }
        ];
        localStorage.setItem(STORAGE_KEYS.CONTRAVENTIONS, JSON.stringify(sampleContraventions));
    }

    // PCA Audits
    if (!localStorage.getItem(STORAGE_KEYS.PCA)) {
        const samplePCA = [
            { id: 'PCA-2026-001', project: 'Surulere Estate', auditor: 'Engr. Adebayo', date: '2026-06-15', status: 'pass', score: 95, notes: 'All systems operational. Certificate issued.' },
            { id: 'PCA-2026-002', project: 'VI Tower', auditor: 'Engr. Femi', date: '2026-06-11', status: 'partial', score: 78, notes: 'Minor deviations in window alignment.' }
        ];
        localStorage.setItem(STORAGE_KEYS.PCA, JSON.stringify(samplePCA));
    }

    // Teams
    if (!localStorage.getItem(STORAGE_KEYS.TEAMS)) {
        const sampleTeams = [
            { id: 1, name: 'Team A', lead: 'Engr. Adebayo', members: 5, reports: 342, accuracy: 98 },
            { id: 2, name: 'Team B', lead: 'Engr. Chioma', members: 4, reports: 287, accuracy: 95 },
            { id: 3, name: 'Team C', lead: 'Engr. Femi', members: 4, reports: 198, accuracy: 91 },
            { id: 4, name: 'Special Team', lead: 'Engr. Ngozi', members: 5, reports: 156, accuracy: 97 }
        ];
        localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(sampleTeams));
    }
}

// ===== CRUD Functions =====

// Projects
function getProjects() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS)) || [];
}

function saveProject(project) {
    const projects = getProjects();
    projects.push(project);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

function updateProject(id, updatedData) {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
        projects[index] = { ...projects[index], ...updatedData };
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        return true;
    }
    return false;
}

function deleteProject(id) {
    let projects = getProjects();
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

// Reports (Stage Reports)
function getReports() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS)) || [];
}

function saveReport(report) {
    const reports = getReports();
    reports.push(report);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
}

function updateReport(id, updatedData) {
    const reports = getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index !== -1) {
        reports[index] = { ...reports[index], ...updatedData };
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
        return true;
    }
    return false;
}

// Contraventions
function getContraventions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTRAVENTIONS)) || [];
}

function saveContravention(contravention) {
    const contraventions = getContraventions();
    contraventions.push(contravention);
    localStorage.setItem(STORAGE_KEYS.CONTRAVENTIONS, JSON.stringify(contraventions));
}

function updateContravention(id, updatedData) {
    const contraventions = getContraventions();
    const index = contraventions.findIndex(c => c.id === id);
    if (index !== -1) {
        contraventions[index] = { ...contraventions[index], ...updatedData };
        localStorage.setItem(STORAGE_KEYS.CONTRAVENTIONS, JSON.stringify(contraventions));
        return true;
    }
    return false;
}

// PCA Audits
function getPCA() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PCA)) || [];
}

function savePCA(pca) {
    const pcas = getPCA();
    pcas.push(pca);
    localStorage.setItem(STORAGE_KEYS.PCA, JSON.stringify(pcas));
}

// Teams
function getTeams() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS)) || [];
}

// Settings
function getSettings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || {};
}

function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ===== Utility Functions =====

// Generate unique ID
function generateId(prefix) {
    const count = getReports().length + getContraventions().length + getPCA().length + 1;
    const padded = String(count).padStart(3, '0');
    return `${prefix}-${new Date().getFullYear()}-${padded}`;
}

// Format date
function formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
}

// Export all data as JSON (for backup)
function exportAllData() {
    return {
        projects: getProjects(),
        reports: getReports(),
        contraventions: getContraventions(),
        pca: getPCA(),
        teams: getTeams(),
        settings: getSettings()
    };
}

// Import data from JSON (for restore)
function importAllData(data) {
    if (data.projects) localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
    if (data.reports) localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(data.reports));
    if (data.contraventions) localStorage.setItem(STORAGE_KEYS.CONTRAVENTIONS, JSON.stringify(data.contraventions));
    if (data.pca) localStorage.setItem(STORAGE_KEYS.PCA, JSON.stringify(data.pca));
    if (data.teams) localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(data.teams));
    if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
}

// Clear all data (reset)
function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    initStorage();
}

// Initialize on load
initStorage();

// Make functions globally available
window.getProjects = getProjects;
window.saveProject = saveProject;
window.updateProject = updateProject;
window.deleteProject = deleteProject;
window.getReports = getReports;
window.saveReport = saveReport;
window.updateReport = updateReport;
window.getContraventions = getContraventions;
window.saveContravention = saveContravention;
window.updateContravention = updateContravention;
window.getPCA = getPCA;
window.savePCA = savePCA;
window.getTeams = getTeams;
window.getSettings = getSettings;
window.saveSettings = saveSettings;
window.generateId = generateId;
window.formatDate = formatDate;
window.exportAllData = exportAllData;
window.importAllData = importAllData;
window.clearAllData = clearAllData;
