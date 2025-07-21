# 🏦 S n A Bank – Fingerprint-Based ATM System

A secure and smart ATM system where fingerprint hashes replace physical debit cards. Built using Python (Flask), HTML/CSS/JS, and MySQL.

---

## 🚀 Features

- 🔐 Biometric authentication (via fingerprint hash)
- 💳 Multiple cards per user
- 🔢 Secure 4-digit PIN verification
- 💰 Check balance, deposit, withdraw
- ❌ End session securely

---

## 🛠️ Tech Stack

| Layer     | Technology           |
|-----------|----------------------|
| Backend   | Python (Flask)       |
| Frontend  | HTML, CSS, JavaScript|
| Database  | MySQL                |
| Version Control | Git + GitHub  |

---

## 📁 Folder Structure

atm-fingerprint-system/
├── app.py
├── templates/
│ ├── index.html
│ ├── deposit.html
│ └── about.html
├── static/
│ ├── styles.css
│ └── script.js
├── database.sql
└── README.md

---

## 🗃️ Database Setup

1. Open MySQL Workbench
2. Create a schema named `atm_system`
3. Open `database.sql` and run the script
4. It will create two tables: `users` and `cards`, with dummy data
5. Make sure your `app.py` connects using the same database name and credentials

---

## 👨‍💻 Built By

- Sumit Malik
- Abbas Ali

---

## 🔧 How to Run the Project

1. Clone the repo:
```bash
git clone https://github.com/sumitmalik1409/atm-fingerprint-system.git
```

2. Move into the folder:
```bash
cd atm-fingerprint-system
```

3. Run the app:
```bash
python app.py
```

4. Open in your browser:
```cpp
http://127.0.0.1:5000/
```
