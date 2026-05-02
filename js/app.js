// ============ APP INITIALIZATION ============

window.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Smart Mess System Loaded');
    
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        const userData = JSON.parse(user);
        goToDashboard(userData.role || 'student');
    }
});

// ============ GLOBAL UTILITIES ============

function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
}

// Initialize app
log('Smart Mess System v3.0 Ready!');
