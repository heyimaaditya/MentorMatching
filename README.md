# Mentorship Matching Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built With](https://img.shields.io/badge/Built%20With-Node.js%20%7C%20Express%20%7C%20PostgreSQL%20%7C%20Vanilla%20JS-blue)](https://github.com/)



Frontend Link=https://tubular-salamander-9226f3.netlify.app/login.html

Backend Link=https://mentorship-backend-g4sf.onrender.com/

## Description

The Mentorship Matching Platform is a full-stack web application that allows users to register, create a mentor or mentee profile, and connect with others for mentorship opportunities. The platform is designed with a responsive and clean user interface built using vanilla HTML, CSS, and JavaScript, while the backend is powered by Node.js, Express, and PostgreSQL.

## Features

- **User Registration & Authentication:** Secure registration, login, and logout using JWT and bcrypt.
- **Profile Management:** Create, update, and delete your mentor/mentee profile; specify skills, interests, and a brief bio.
- **User Discovery:** Browse and filter other user profiles based on role, skills, and interests.
- **Mentorship Requests:** Send and manage mentorship requests (sending, accepting, declining).

## Tech Stack

| **Category**  | **Technology**                             |
|---------------|--------------------------------------------|
| **Frontend**  | HTML, CSS, Vanilla JavaScript              |
| **Backend**   | Node.js, Express                           |
| **Database**  | PostgreSQL                                 |
| **Auth**      | JWT, bcrypt                                |

## Local Setup

### 1. Clone the Repository
```
git clone repo
cd folder

2. Database Setup
Ensure you have PostgreSQL installed.

Create a new database (e.g., mentorship_db).

Run the following SQL commands in your PostgreSQL client to create the required tables:


-- Create Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Profiles Table
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('mentor', 'mentee')),
  skills TEXT,
  interests TEXT,
  bio TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Mentorship Requests Table
CREATE TABLE mentorship_requests (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER REFERENCES users(id),
  mentee_id INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
3. Setting Up the Backend
Navigate to the backend directory:


cd backend
Install the backend dependencies:

npm install
Create a .env file in the backend folder (use a .env.example as a guide):

.env file content:
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/mentorship_db
JWT_SECRET=your_secure_jwt_secret


Start the backend server:

npm start
Your backend API should now run on http://localhost:5000.

4. Setting Up the Frontend
Navigate to the frontend folder:


cd ../frontend
Open any HTML file (e.g., index.html, login.html, register.html) in your browser, or serve the folder using a simple local server (for example, the Live Server extension in VS Code).

Ensure that in your frontend/scripts/app.js file, the API base URL is set correctly:

const API_BASE = 'http://localhost:5000/api';
Test the application by signing up, logging in, creating a profile, and exploring discovery/mentorship features.
