// storage.js - Data Persistence

const STORAGE_KEYS = {
    STAGE_REPORTS: 'ace_stage_reports',
    CONTRAVENTIONS: 'ace_contraventions',
    PCA_AUDITS: 'ace_pca_audits',
    PROJECTS: 'ace_projects'
};

// Initialize storage
function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.STAGE_REPORTS)) {
        localStorage.setItem(STORAGE_KEYS.STAGE_REPORTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTRAVENTIONS)) {
        localStorage.setItem(STORAGE_KEYS.CONTRAVENTIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PCA_AUDITS)) {
        localStorage.setItem(STORAGE_KEYS.PCA_AUDITS, JSON.stringify([]));
    }
}

// ===== STAGE REPORTS =====
function getStageReports() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STAGE_REPORTS)) || [];
}

function saveStageReport(report) {
    const reports = getStageReports();
    reports.push(report);
    localStorage.setItem(STORAGE_KEYS.STAGE_REPORTS, JSON.stringify(reports));
}

// ===== CONTRAVENTIONS =====
function getContraventions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTRAVENTIONS)) || [];
}

function saveContravention(contravention) {
    const contraventions = getContraventions();
    contraventions.push(contravention);
    localStorage.setItem(STORAGE_KEYS.CONTRAVENTIONS, JSON.stringify(contraventions));
}

// ===== PCA AUDITS =====
function getPCAAudits() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PCA_AUDITS)) || [];
}

function savePCAAudit(pca) {
    const pcas = getPCAAudits();
    pcas.push(pca);
    localStorage.setItem(STORAGE_KEYS.PCA_AUDITS, JSON.stringify(pcas));
}

// Initialize
initStorage();

// Make functions globally available
window.getStageReports = getStageReports;
window.saveStageReport = saveStageReport;
window.getContraventions = getContraventions;
window.saveContravention = saveContravention;
window.getPCAAudits = getPCAAudits;
window.savePCAAudit = savePCAAudit;
