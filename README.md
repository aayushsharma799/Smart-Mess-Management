# 🍽️ Smart Mess System — Quantum University

> **Reduce Food Waste. Optimize Meal Planning. Build a Sustainable Future.**

A full-stack web application built for **Quantum University** that allows students to pre-register their meal preferences (breakfast, lunch, dinner) so the mess/cafeteria can plan food preparation accurately — minimizing waste and improving efficiency.

---

![Smart Mess Banner](Quantum_University_Modern_Building_with_Quantum_Theme_Design.png)

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 About the Project

The **Smart Mess System** is a digital meal attendance and planning platform for university hostels. Students log in and mark whether they will be **eating or skipping** each meal for the day. Admins can view real-time attendance data through a dedicated dashboard to plan food quantities accordingly.

### 🎯 Problem It Solves
- **Food Waste** — Mess kitchens often prepare food for all students regardless of actual attendance.
- **Cost Efficiency** — Accurate headcounts reduce unnecessary expenditure.
- **Sustainability** — Less food waste = lower environmental impact.

---

## ✨ Features

### 👨‍🎓 Student Portal
- Register & Login with email/password
- Mark attendance for **Breakfast**, **Lunch**, and **Dinner**
- Add dietary preferences (vegetarian, vegan, etc.)
- View personal attendance history

### 👨‍💼 Admin Dashboard
- View all student attendance records
- Real-time meal headcount per meal slot
- Manage student accounts
- Export/analyze attendance data

### 🔐 Authentication & Security
- **JWT-based** authentication
- **Role-based access control** (Student / Admin / Super Admin)
- **Google OAuth 2.0** login support
- Secure password hashing with **bcryptjs**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT, Passport.js, Google OAuth 2.0 |
| **Security** | bcryptjs, express-session |
| **Dev Tools** | nodemon, dotenv |

---

## 📁 Project Structure

```
smart-mess-system/
│
├── config/
│   └── db.js                  # MongoDB connection setup
│
├── models/
│   └── Attendance.js          # Attendance schema (meals + dietary prefs)
│
├── routes/
│   ├── auth.js                # Register, Login, Google OAuth routes
│   └── attendance.js          # Attendance CRUD routes
│
├── public/  (or root)
│   ├── index.html             # Login & Register page
│   ├── dashboard.html         # Student dashboard
│   └── admin-dashboard.html   # Admin dashboard
│
├── .env                       # Environment variables (NOT committed to Git)
├── .gitignore                 # Files excluded from Git
├── server.js                  # Express app entry point
├── package.json               # Project metadata & dependencies
└── README.md                  # You are here!
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works) or local MongoDB

---

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/smart-mess-system.git
cd smart-mess-system
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) below):
```bash
cp .env.example .env
# Then edit .env with your actual values
```

**4. Start the development server**
```bash
npm run dev
```

**5. Open in browser**
```
https://smart-mess-management.vercel.app/
```

---



> ⚠️ **Never commit your `.env` file to GitHub.** It is already listed in `.gitignore`.

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register a new user (student/admin) | No |
| `POST` | `/login` | Login with email & password | No |
| `GET` | `/google` | Initiate Google OAuth login | No |
| `GET` | `/google/callback` | Google OAuth callback | No |

### Attendance Routes — `/api/attendance`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/mark` | Mark today's meal attendance | Yes (Student) |
| `GET` | `/my` | Get current student's attendance | Yes (Student) |
| `GET` | `/all` | Get all students' attendance | Yes (Admin) |
| `GET` | `/today` | Get today's meal headcount | Yes (Admin) |

---

## 🗂️ Data Model

### Attendance Schema

```js
{
  studentId:          String,      // Unique student identifier
  name:               String,      // Student's full name
  breakfast:          'eating' | 'skipping',
  lunch:              'eating' | 'skipping',
  dinner:             'eating' | 'skipping',
  dietaryPreferences: String,      // e.g., "vegetarian", "vegan"
  date:               Date,        // Auto-set to current date
  createdAt:          Date,        // Mongoose timestamp
  updatedAt:          Date         // Mongoose timestamp
}
```

---

## 🖥️ Screenshots

| Page | Description |
|------|-------------|
| `index.html` | Login & Registration with role selector (Student / Admin) |
| `dashboard.html` | Student meal marking interface |
| `admin-dashboard.html` | Admin view with attendance analytics |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: your feature description"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute it.

---

## 👨‍💻 Author

Built with ❤️ for **Quantum University**  
Smart Mess Waste Reduction Initiative

---

> 💡 *"Every meal skipped that goes unreported is food wasted. Smart Mess fixes that."*
