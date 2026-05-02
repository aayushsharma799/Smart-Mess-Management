// ============ DASHBOARD NAVIGATION ============

function goToDashboard(role) {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('appPage').classList.remove('hidden');

    if (role === 'student') {
        document.getElementById('studentDash').classList.remove('hidden');
        document.getElementById('adminDash').classList.add('hidden');
        loadStudentDashboard();
    } else {
        document.getElementById('adminDash').classList.remove('hidden');
        document.getElementById('studentDash').classList.add('hidden');
        loadAdminDashboard();
    }

    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('userDisplay').textContent = `Welcome, ${user.name || 'User'}`;
}

// ============ STUDENT DASHBOARD ============

function loadStudentDashboard() {
    loadMeals();
    loadNGOs();
}

async function loadMeals() {
    try {
        const meals = await apiGetMeals();
        const mealsList = document.getElementById('mealsList');
        mealsList.innerHTML = '';

        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        const mealNames = {
            breakfast: '🌅 Breakfast - 8:00 AM',
            lunch: '🍲 Lunch - 1:00 PM',
            dinner: '🍽️ Dinner - 7:30 PM'
        };

        mealTypes.forEach(type => {
            mealsList.innerHTML += `
                <div class="meal-item">
                    <div>
                        <h4>${mealNames[type]}</h4>
                        <p>${meals[type] || 'Menu not available'}</p>
                    </div>
                    <div class="meal-buttons">
                        <button class="meal-btn inactive" onclick="selectMeal('${type}', 'eating')">Eating</button>
                        <button class="meal-btn inactive" onclick="selectMeal('${type}', 'skip')">Skip</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Load meals error:', error);
    }
}

const selectedMeals = {};

function selectMeal(mealType, status) {
    selectedMeals[mealType] = status;
    const buttons = event.target.parentElement.querySelectorAll('.meal-btn');
    buttons.forEach(btn => btn.classList.remove('eating', 'skip'));
    event.target.classList.add(status);
}

async function submitAttendance() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
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
        showError('Error submitting attendance: ' + error.message);
    }
}

async function loadNGOs() {
    try {
        const ngos = await apiGetNearbyNGOs();
        const ngosList = document.getElementById('ngosList');
        ngosList.innerHTML = '';

        ngos.forEach(ngo => {
            ngosList.innerHTML += `
                <div class="card">
                    <h3>${ngo.name}</h3>
                    <p>📍 Distance: ${ngo.distance} km</p>
                    <p>👥 Capacity: ${ngo.capacity} meals</p>
                    <p>📞 ${ngo.phone}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error('Load NGOs error:', error);
    }
}

// ============ TAB SWITCHING ============

function switchTab(tabName) {
    const tabs = document.querySelectorAll('#studentDash .tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    const buttons = document.querySelectorAll('#studentDash .tab');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function switchAdminTab(tabName) {
    const tabs = document.querySelectorAll('#adminDash .tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    const buttons = document.querySelectorAll('#adminDash .tab');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// ============ ADMIN DASHBOARD ============

function loadAdminDashboard() {
    // Load admin stats
    document.getElementById('totalStudents').textContent = '500';
    document.getElementById('todayEating').textContent = '420';
    document.getElementById('attendancePercent').textContent = '84%';
    document.getElementById('wasteReduced').textContent = '85%';
}
