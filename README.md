# Synergy Enterprise ERP System


## Overview
Synergy Enterprise ERP is a comprehensive, Flask-based backend web application designed to streamline business operations. Built with modern web development practices, it features an interactive dashboard, robust data management, and an elegant user interface. This project combines various operational modules into a single, cohesive system, simulating real-world SAP-style business processes.

## Features

### 1. Secure Authentication
- **Admin Login:** Role-based access control ensuring secure entry into the dashboard.
- **Session Management:** Safeguards user data and enforces secure sessions.


### 2. Interactive Dashboard
- **Real-time Statistics:** View summary metrics such as Total Inventory, Active Students, and Total Sales.
- **Dynamic Layout:** A responsive design that provides quick access to core modules.

### 3. Core Modules
- **Inventory Management System:** Track stock levels, categorize items, and manage unit pricing.
- **Student ERP System:** Manage student enrollments, course assignments, and active statuses.
- **Billing & Sales System:** Generate invoices, track sales amounts, and monitor payment statuses.

## Technology Stack
- **Backend:** Python, Flask, Flask-CORS
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Architecture:** Blueprint routing, RESTful APIs

## Setup & Installation

### Prerequisites
- Python 3.8+
- MySQL Server

### 1. Database Configuration
1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or terminal).
2. Execute the `schema.sql` file to create the `erp_db` database and necessary tables (`users`, `inventory`, `students`, `billing`).
3. Add an initial admin user to the `users` table to enable login.

### 2. Environment Setup
1. Clone the repository and navigate to the project directory.
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Update the `config.py` (or `.env` file) with your MySQL database credentials:
   ```python
   DB_HOST = 'localhost'
   DB_USER = 'your_mysql_username'
   DB_PASSWORD = 'your_mysql_password'
   DB_NAME = 'erp_db'
   ```

### 3. Running the Application
1. Start the Flask server:
   ```bash
   python app.py
   ```
2. Open your web browser and navigate to `http://localhost:5000`.

## Project Structure
```text
EPR/
├── app.py               # Main application entry point
├── routes.py            # API routes and business logic
├── config.py            # Configuration settings
├── schema.sql           # Database schema definition
├── requirements.txt     # Python dependencies
├── static/              # CSS, JS, and image assets
└── templates/           # HTML templates (login, dashboard)
```

