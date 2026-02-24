# 🚀 SubDub — Subscription Tracker App

A full-stack web application to manage, track, and analyze your subscriptions with ease.

---

## 🌐 Live Demo

🔗 Frontend: https://sub-dub.vercel.app
🔗 Backend API: https://subdub-kj3h.onrender.com

---

## 📌 Features

* 🔐 User Authentication (JWT-based)
* 📦 Manage Subscriptions (Create, Update, Delete)
* 🔄 Subscription Actions:

  * Renew
  * Cancel
  * Pause / Resume
  * Change Plan
* 📊 Subscription Statistics
* ⏰ Upcoming Renewal Tracking
* 📧 Email Notifications (Nodemailer)
* 🔁 Automated Reminders (Cron Jobs)
* 🛡️ Rate Limiting & Security (Arcjet Middleware)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* JavaScript
* Tailwind CSS (if used)

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📂 Project Structure

```
SubDub/
│
├── frontend/       # React (Vite) app
│
├── backend/        # Express API
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── database/
│   ├── cron/
│   └── config/
```

---

## ⚙️ Environment Variables

### Backend (.env)

```
NODE_ENV=production
PORT=5500

DB_URI=your_mongodb_uri

JWT_SECRET=your_secret
JWT_EXPIRE_IN=1d

ARCJET_ENV=production
ARCJET_KEY=your_key

EMAIL_USER=your_email
EMAIL_PASSWORD=your_app_password
```

### Frontend (.env)

```
VITE_API_URL=https://subdub-kj3h.onrender.com/api/v1
```

---

## 🚀 Installation & Setup

### 1. Clone Repository

```
git clone https://github.com/your-username/SubDub.git
cd SubDub
```

---

### 2. Backend Setup

```
cd backend
npm install
npm start
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🌍 Deployment

* Frontend deployed on **Vercel**
* Backend deployed on **Render**
* MongoDB hosted on **MongoDB Atlas**

---

## 🙌 Acknowledgements

This project was built as part of learning full-stack development and deployment workflows.

---

## 📬 Contact

If you have any feedback or suggestions, feel free to reach out!

---

⭐ If you like this project, consider giving it a star!
