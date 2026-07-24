# ATLAS – Unified Infrastructure Monitoring and Security Platform

ATLAS is a web-based Linux infrastructure monitoring and security platform developed as an MCA final project.

It provides centralized monitoring of CPU, memory, disk, network, system information, services, and security-related information through a web dashboard.

---

## Technology Stack

- Ubuntu 24.04 LTS / WSL2
- Node.js v24.18.0
- Express.js
- PostgreSQL 16
- Firebase Authentication
- Firebase Admin SDK
- HTML5
- CSS3
- JavaScript
- Chart.js
- Socket.IO
- Git and GitHub

---

# Requirements

Before running ATLAS, install the required software and dependencies.

## Node.js and npm

Check whether Node.js and npm are installed:

```bash
node --version
npm --version
```

ATLAS was developed using Node.js v24.18.0.

If Node.js is not installed, install Node.js and npm before continuing.

---

## PostgreSQL

Install PostgreSQL:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
```

Check the PostgreSQL installation:

```bash
psql --version
sudo systemctl status postgresql
```

ATLAS was developed using PostgreSQL 16.

Start PostgreSQL if required:

```bash
sudo systemctl start postgresql
```

---

# Project Installation

Clone the ATLAS repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd atlas
```

If you downloaded the project as a ZIP file, extract it and open the ATLAS project directory instead.

---

# Backend Dependencies

Go to the backend directory:

```bash
cd backend
```

Install all backend dependencies:

```bash
npm install
```

The backend uses the following major Node.js packages:

- express
- pg
- firebase-admin
- systeminformation
- bcrypt
- cookie-parser
- cors
- dotenv
- express-validator
- helmet
- jsonwebtoken
- morgan
- socket.io

Development dependencies include:

- nodemon
- eslint
- prettier

You do not normally need to install these libraries individually.

Running:

```bash
npm install
```

automatically installs the dependencies listed in:

```text
backend/package.json
```

---

# Firebase Client Dependencies

If the project root contains `package.json`, install the root dependencies as well:

```bash
cd ~/atlas
npm install
```

The project uses Firebase Authentication for frontend authentication and Firebase Admin SDK for backend token verification.

---

# PostgreSQL Database Setup

Start PostgreSQL:

```bash
sudo systemctl start postgresql
```

The ATLAS database must be created and configured before starting the complete application.

Database-related files are available inside:

```text
database/
```

Use the provided database schema and seed files to initialize the database.

The ATLAS database contains structures for:

- users
- roles
- sessions
- servers
- services
- system_metrics
- network_metrics
- alerts
- logs
- audit_logs
- settings

The application uses the following roles:

- Admin
- Operator
- Viewer

---

# Environment Configuration

ATLAS uses environment variables for backend configuration.

Go to the backend directory:

```bash
cd ~/atlas/backend
```

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the environment configuration:

```bash
nano .env
```

Configure the required PostgreSQL and application settings according to your environment.

## Important Security Notice

Never upload the real `.env` file to GitHub.

The `.env` file may contain sensitive configuration such as database credentials.

---

# Firebase Admin Configuration

ATLAS uses Firebase Admin SDK for backend authentication verification.

The Firebase Admin service-account credential must be placed at:

```text
backend/firebase/serviceAccountKey.json
```

The real `serviceAccountKey.json` file is intentionally excluded from the public GitHub repository.

Users installing ATLAS must provide their own Firebase Admin credentials from their Firebase/Google Cloud project.

Never commit or publicly share:

```text
serviceAccountKey.json
.env
Firebase private keys
Database passwords
Authentication tokens
```

---

# Running ATLAS

Start PostgreSQL:

```bash
sudo systemctl start postgresql
```

Go to the ATLAS backend directory:

```bash
cd ~/atlas/backend
```

Start ATLAS in development mode:

```bash
npm run dev
```

Alternatively, start the application normally:

```bash
npm start
```

The ATLAS server should start at:

```text
http://localhost:3000
```

Open the address in a web browser to access the application.

---

# Monitoring APIs

ATLAS provides REST API endpoints for infrastructure monitoring.

```text
GET /api/system
GET /api/cpu
GET /api/memory
GET /api/disk
GET /api/network
```

Test system monitoring:

```bash
curl http://localhost:3000/api/system
```

Test CPU monitoring:

```bash
curl http://localhost:3000/api/cpu
```

Test memory monitoring:

```bash
curl http://localhost:3000/api/memory
```

Test disk monitoring:

```bash
curl http://localhost:3000/api/disk
```

Test network monitoring:

```bash
curl http://localhost:3000/api/network
```

---

# Authentication

ATLAS supports:

- Email and password authentication
- Google authentication
- Firebase Authentication
- Firebase Admin token verification
- Backend authentication middleware
- PostgreSQL user synchronization

Firebase Authentication handles user identity.

Firebase Admin SDK verifies authenticated users on the backend.

Verified Firebase users are synchronized with the ATLAS PostgreSQL user system.

---

# Security

ATLAS uses several security mechanisms and libraries, including:

- Firebase Authentication
- Firebase Admin SDK
- Backend authentication middleware
- Helmet
- CORS
- Express Validator
- Environment variables
- PostgreSQL roles
- Application roles
- Protected Firebase Admin credentials

Sensitive credentials are excluded from Git using `.gitignore`.

---

# Important Files Not Included in GitHub

For security reasons, the following files and directories should NOT be committed:

```text
backend/.env
backend/firebase/serviceAccountKey.json
node_modules/
backend/node_modules/
```

The repository should instead contain files such as:

```text
backend/.env.example
backend/package.json
backend/package-lock.json
```

Node.js dependencies can be restored using:

```bash
npm install
```

---

# Project Structure

```text
atlas/
├── backend/
│   ├── firebase/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── modules/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── package-lock.json
│
├── database/
├── design/
├── docs/
├── frontend/
├── tests/
├── .gitignore
├── LICENSE
├── ATLAS_Project_Tree.txt
└── README.md
```

---

# Main Monitoring Module

The ATLAS monitoring module contains:

```text
monitoringController.js
monitoringRoutes.js
monitoringService.js
```

The monitoring service collects real Linux system information and provides the data through REST APIs.

ATLAS monitors:

- CPU information and utilization
- Memory utilization
- Disk information
- Network information
- Hostname
- Operating system platform
- System architecture
- System uptime
- Node.js version
- System and service status

---

# Database

ATLAS uses PostgreSQL as its relational database.

The database is used for application information including:

- Users
- Roles
- Sessions
- Servers
- Services
- System metrics
- Network metrics
- Alerts
- Logs
- Audit logs
- Settings

---

# Troubleshooting

## PostgreSQL is not running

Start PostgreSQL:

```bash
sudo systemctl start postgresql
```

Check PostgreSQL status:

```bash
sudo systemctl status postgresql
```

---

## Node.js dependencies are missing

Run:

```bash
cd ~/atlas/backend
npm install
```

---

## Backend does not start

Check the backend environment configuration:

```text
backend/.env
```

Verify that the PostgreSQL database is running and that the database credentials are correct.

---

## Firebase authentication fails

Verify:

- Firebase client configuration
- Firebase Authentication configuration
- Firebase Admin SDK configuration
- `serviceAccountKey.json`
- Authorized Firebase authentication providers

---

## Monitoring APIs are not responding

Make sure the backend is running:

```bash
cd ~/atlas/backend
npm run dev
```

Then test:

```bash
curl http://localhost:3000/api/system
```

---

# Documentation

Additional ATLAS documentation is available inside:

```text
docs/
```

The project documentation includes information about:

- Project overview
- System architecture
- Database design
- API documentation
- Module descriptions
- Installation
- Testing
- Security
- User manual

---

# Author

**M. V. Jeshwanth Varma**

Roll No: **24914120063**

Master of Computer Applications (MCA) – Cyber Security

KL CDOE, VJA Campus, India

Academic Year: **2024–2026**

---

# Project Title

**ATLAS – Unified Infrastructure Monitoring and Security Platform**

**MCA Final Project**