// Get API base URL from environment or use localhost
const API_BASE_URL = 'http://localhost:5000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

// ============ AUTH APIs ============

async function apiRegister(name, studentId, email, phone, password) {
    try {
        console.log('📤 Sending register request...');
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                studentId,
                email,
                phone,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Register error:', data.error);
            throw new Error(data.error || 'Registration failed');
        }

        console.log('✅ Register successful:', data.user.name);
        return data;
    } catch (error) {
        console.error('❌ Register request error:', error);
        throw error;
    }
}

async function apiLogin(email, password) {
    try {
        console.log('📤 Sending login request...');
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Login error:', data.error);
            throw new Error(data.error || 'Login failed');
        }

        console.log('✅ Login successful:', data.user.name);
        return data;
    } catch (error) {
        console.error('❌ Login request error:', error);
        throw error;
    }
}

// ============ ATTENDANCE APIs ============

async function apiMarkAttendance(studentId, breakfast, lunch, dinner) {
    try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            throw new Error('No authentication token found');
        }

        console.log('📤 Sending attendance request...');

        const response = await fetch(`${API_BASE_URL}/attendance/mark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                studentId,
                breakfast,
                lunch,
                dinner
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Attendance error:', data.error);
            throw new Error(data.error || 'Failed to mark attendance');
        }

        console.log('✅ Attendance marked successfully');
        return data;
    } catch (error) {
        console.error('❌ Attendance request error:', error);
        throw error;
    }
}

async function apiGetAttendance(studentId) {
    try {
        const token = localStorage.getItem('authToken');

        const response = await fetch(`${API_BASE_URL}/attendance/${studentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('✅ Attendance retrieved');
        return data;
    } catch (error) {
        console.error('❌ Get attendance error:', error);
        throw error;
    }
}

// ============ ERROR HANDLER ============

async function handleApiError(error) {
    console.error('API Error:', error.message);
    
    if (error.message.includes('Failed to fetch')) {
        return 'Connection error - Backend not running';
    }
    if (error.message.includes('No token')) {
        return 'Please login first';
    }
    if (error.message.includes('Invalid token')) {
        return 'Session expired - Please login again';
    }
    
    return error.message;
}
