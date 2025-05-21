# 🏨 Hotel Management System

A modern, full-stack hotel management platform that streamlines daily hotel operations such as room reservations, guest tracking, billing, staff coordination, and predictive analytics for room pricing. Built using the MERN stack and enhanced with a Python-based machine learning module, this project offers smart features for real-world hospitality management.

---

## 🚀 Features

* 🛏️ **Room Management**: Track availability, types, and occupancy status in real-time.
* 🙍‍♂️ **Guest Management**: Handle check-in/check-out, guest data, and preferences.
* 💰 **Billing & Payments**: Automated invoicing and online payment integration.
* 👨‍💼 **Staff Management**: Add staff, assign roles, and manage schedules.
* 📈 **Admin Dashboard**: Visual insights, logs, and high-level overviews.
* 🧠 **ML-Based Price Prediction**: Predict room prices based on features such as room type, occupancy, seasonality, etc. using Python machine learning models.

---

## 🧠 ML Price Prediction Module

A Python-based ML service located in the `/ML_Backend` directory:

* Uses **Scikit-learn**, **Pandas**, and **Flask**.
* Accepts room-related data (e.g., room type, date, occupancy) and returns a **predicted price**.
* RESTful API endpoints to integrate seamlessly with the Node.js backend.

### Example Flow:

1. Hotel staff or admin enters room details.
2. Frontend sends the data to the `/predict` API endpoint.
3. ML model returns a recommended price.
4. Admin can accept or override the prediction.

> Useful for **dynamic pricing** and **revenue optimization**.

---

## 🛠️ Tech Stack

| Layer     | Technology                  |
| --------- | --------------------------- |
| Frontend  | React.js, Tailwind CSS      |
| Backend   | Node.js, Express.js         |
| Database  | MongoDB (Mongoose)          |
| ML Module | Python, Flask, Scikit-learn |
| Auth      | JWT                         |
| Payment   | Stripe API                  |

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js
* MongoDB
* Python 3.9+
* pip (Python package manager)

### 1. Clone Repository

```bash
git clone https://github.com/DTMVithana/Hotel_Management_System.git
cd Hotel_Management_System
```

### 2. Setup Backend

```bash
cd backend
npm install
npm start
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

### 4. Setup ML Backend

```bash
cd ../ML_Backend
pip install -r requirements.txt
python predict.py
```

### 5. Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories with your environment-specific settings (DB URI, ports, Stripe keys, etc.).
