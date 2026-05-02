async function loginStudent() {
    const email = document.getElementById('stdEmail').value.trim();
    const password = document.getElementById('stdPassword').value.trim();

    if (!email || !password) {
        showError('Please fill all fields');
        return;
    }

    try {
        console.log('🔐 Attempting login...');
        const data = await apiLogin(email, password);

        if (data.token) {
            console.log('✅ Login successful, storing token');
            
            // Store token and user
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Debug: Verify storage
            console.log('🔑 Token stored:', localStorage.getItem('authToken').substring(0, 20) + '...');
            console.log('👤 User stored:', data.user.name);
            
            showSuccess('Login successful!');
            setTimeout(() => goToDashboard('student'), 1000);
        } else {
            showError(data.error || 'Login failed');
        }
    } catch (error) {
        const errorMsg = await handleApiError(error);
        showError(errorMsg);
    }
}

async function registerStudent() {
    const name = document.getElementById('regName').value.trim();
    const studentId = document.getElementById('regStudentId').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('regConfirmPassword').value.trim();

    if (!name || !studentId || !email || !phone || !password || !confirmPassword) {
        showError('Please fill all fields', 'regErrorMsg');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match', 'regErrorMsg');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters', 'regErrorMsg');
        return;
    }

    try {
        console.log('📝 Attempting registration...');
        const data = await apiRegister(name, studentId, email, phone, password);

        if (data.token) {
            console.log('✅ Registration successful');
            
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showSuccess('Registration successful! Logging in...', 'successMsg');
            
            setTimeout(() => {
                // Clear form
                document.getElementById('regName').value = '';
                document.getElementById('regStudentId').value = '';
                document.getElementById('regEmail').value = '';
                document.getElementById('regPhone').value = '';
                document.getElementById('regPassword').value = '';
                document.getElementById('regConfirmPassword').value = '';
                
                goToDashboard('student');
            }, 2000);
        } else {
            showError(data.error || 'Registration failed', 'regErrorMsg');
        }
    } catch (error) {
        const errorMsg = await handleApiError(error);
        showError(errorMsg, 'regErrorMsg');
    }
}

async function submitAttendance() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.id) {
        showError('User not found - Please login again');
        return;
    }
    
    try {
        console.log('📤 Submitting attendance...');
        
        const result = await apiMarkAttendance(
            user.id,
            selectedMeals.breakfast || 'skipping',
            selectedMeals.lunch || 'skipping',
            selectedMeals.dinner || 'skipping'
        );

        if (result.message) {
            showSuccess('✅ Attendance submitted successfully!');
        } else {
            showError('Failed to submit attendance');
        }
    } catch (error) {
        const errorMsg = await handleApiError(error);
        showError('Error: ' + errorMsg);
    }
}
