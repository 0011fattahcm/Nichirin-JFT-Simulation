# 🌏 JFT & SSW Simulation – Full System Documentation  
**Full English Version**

---

## 🎯 General Description

**JFT & SSW Simulation** is a web-based platform designed for Japanese language and *Tokutei Ginou (SSW)* skill test simulations.  
The system replicates the actual JFT (Japan Foundation Test for Basic Japanese) exam format, sessions, and timing.  
It supports a paid subscription model, user & admin dashboards, and automated QRIS payments through the **Xendit API**.

---

## 🧱 System Architecture

```
+-------------------+         HTTPS         +------------------+         MongoDB Atlas
|  Frontend (Next)  | <------------------> |  Backend (Express) | <---------------------> [ Database ]
|  React + Tailwind |       REST API       | Node.js + JWT Auth |
+-------------------+                      +------------------+
        |                                                |
        | QR Payment Request                             | Webhook Callback
        v                                                v
+-------------------+   Xendit API   +------------------+
|  User Browser     | <------------> |  Payment Gateway |
+-------------------+                +------------------+
```

The architecture connects the **Next.js frontend**, **Express.js backend**, and **MongoDB Atlas** database.  
QRIS payment flow occurs between the user → Xendit → backend webhook for automatic verification.

---

## 💻 Frontend (Next.js + Tailwind CSS)

### Folder Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/login, register
│   │   ├── dashboard/
│   │   ├── tes/simulasi/
│   │   ├── hasil-tes/
│   │   └── subscription/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   └── styles/
```

### Key Features
- Login & registration with email verification  
- User dashboard (subscription status, test history, results)  
- Full JFT simulation (4 sessions: Moji–Goi, Kaiwa, Dokkai, Choukai)  
- 90-minute timer with automatic submission  
- Dynamic question navigation  
- Payment popup with QRIS auto-polling (every 5 seconds)  
- Real-time payment confirmation  
- Result summary with passing score (200/250)  
- Fully responsive (optimized for mobile landscape)

---

## ⚙️ Backend (Express.js + Node.js)

### Folder Structure
```
backend/
├── controllers/
│   ├── userController.js
│   ├── simulationController.js
│   ├── paymentController.js
│   └── adminController.js
├── models/
│   ├── User.js
│   ├── JFTQuestion.js
│   ├── SimulationHistory.js
│   ├── PaymentHistory.js
│   └── LogActivity.js
├── routes/
│   ├── userRoutes.js
│   ├── simulationRoutes.js
│   ├── paymentRoutes.js
│   ├── xenditWebhookRoute.js
│   └── adminRoutes.js
└── middleware/
    ├── authMiddleware.js
    └── authAdminMiddleware.js
```

### Core Modules
- **UserController** → registration, login, subscription, profile update  
- **SimulationController** → start simulation, store answers, calculate score  
- **PaymentController** → QRIS creation, webhook verification, quota management  
- **AdminController** → manage users, tests, payments, and announcements  
- **Middleware** → authentication for both user and admin routes  

---

## 🧮 Database (MongoDB + Mongoose)

### Main Models
| Model | Description | Key Fields |
|--------|--------------|------------|
| `User` | User account data | name, email, password, subscriptionType, status |
| `JFTQuestion` | Test questions | category, questionText, options[4], answer, media |
| `SimulationHistory` | User test history | userId, score, answers[], session |
| `PaymentHistory` | Payment records | userId, referenceId, paymentStatus, amount, remainingExports |
| `LogActivity` | System logs | userId, action, timestamp |

All user, test, payment, and log data are stored in MongoDB collections.  
Relationships are handled via `userId` references across collections.

---

## 💳 Payment System (Xendit QRIS)

### Payment Flow
1. User selects a subscription package (2 weeks / 1 month)  
2. Backend generates a **dynamic QRIS** via `POST /create/qris`  
3. User scans the QR code to make a payment  
4. Xendit sends a webhook → backend automatically verifies  
5. Once status = `PAID`, user’s quota/subscription is activated  
6. Frontend polls every 5 seconds until payment confirmation  

---

## 🧑‍💼 Admin Panel

### Features
- Secure login via `/rx78gpo1p6`  
- Real-time dashboard (users, payments, test statistics)  
- CRUD operations for users, questions, and announcements  
- Payment logs (50 entries per page)  
- Complete activity logs (register, test, payment, etc.)

The admin panel provides total system control, real-time monitoring, and efficient data management.

---

## 🚀 Deployment Guide

### Backend – AWS EC2
1. SSH into your server:  
   ```bash
   ssh -i "key.pem" ubuntu@server-ip
   ```
2. Clone repository:  
   ```bash
   git clone https://github.com/...
   ```
3. Install dependencies:  
   ```bash
   npm install
   ```
4. Add `.env` file  
5. Start backend with PM2:
   ```bash
   pm2 start server.js --name jft-backend
   pm2 startup
   pm2 save
   ```

### Frontend – Niagahoster / VPS
1. Upload built Next.js folder to `public_html`  
2. Add `.htaccess` for clean route redirects  
3. Update `.env` on hosting to match backend API URL

### Database
- Use **MongoDB Atlas** with EC2 IP whitelisted  
- Store connection URI in `MONGO_URI`

---

## 🛠️ Environment Variables

| Key | Description | Example |
|------|--------------|----------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB Atlas URI | `mongodb+srv://user:pass@cluster.mongodb.net/jft` |
| `JWT_SECRET` | Security token | `supersecretkey` |
| `BASE_URL` | Backend domain | `https://api.jftsimulation.com` |
| `XENDIT_SECRET_KEY` | Xendit API Key | `xnd_development_123...` |
| `EMAIL_USER` | Email sender account | `noreply@jftsimulation.com` |
| `EMAIL_PASS` | App password for email | `app-password` |

---

## 📦 API Endpoint Summary

| Endpoint | Method | Auth | Description |
|-----------|--------|------|--------------|
| `/api/user/register` | POST | ❌ | Register new user |
| `/api/user/login` | POST | ❌ | User login |
| `/api/simulations/start` | POST | ✅ | Start simulation |
| `/api/payments/create/qris` | POST | ✅ | Generate QRIS |
| `/api/payments/check-status/:ref` | GET | ✅ | Check payment status |
| `/api/admin/users` | GET | ✅ Admin | Get user list |
| `/api/admin/payments` | GET | ✅ Admin | Payment history |

---

## 📊 Statistics & Activity Logs

### LogActivity Model
Tracks all user actions, including:
- Register / Login  
- Starting simulations  
- Completing tests  
- Making payments  

The admin dashboard displays monthly charts for all activity types.

---

## 🧩 Key Highlights

- Full 4-session simulation (Moji–Goi, Kaiwa, Dokkai, Choukai)  
- 90-minute timer with auto-submit  
- Real-time QRIS popup with polling  
- Automatic subscription activation  
- One-time answer key visibility for Kouhai/Senpai accounts  
- Admin PDF upload for automatic question parsing  

---

## 🧰 Development Roadmap

- SSW field integration (Construction, Agriculture, etc.)  
- Automatic certificate generation  
- Quick Practice mode  
- National leaderboard system  
- Full multilingual support (JP–ID–EN)

---
