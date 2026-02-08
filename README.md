🚀 Anonymous Feedback Platform (Next.js)

A full-stack anonymous feedback platform built using Next.js that allows users to receive honest feedback securely and anonymously. The application focuses on privacy, simplicity, and usability while providing meaningful message suggestions.

🌐 Live Demo

(Add your deployed link here)
Example: mistry-message-new.vercel.app

🛠 Tech Stack
Frontend & Backend

Next.js

Tailwind CSS (if used)

API Routes (Next.js)

Database

MongoDB

Mongoose

Authentication & Services

OTP Verification (Resend)

Secure Sign-In System

Message Suggestion API

Deployment

Vercel

MongoDB Atlas


✨ Features
User Authentication

Custom Sign Up with OTP verification

Secure Sign In system

Email verification using Resend

Anonymous Messaging

Receive feedback anonymously

No sender identity revealed

Clean inbox interface

Message Assistance

Built-in message suggestion API

Helps users write meaningful feedback

Platform

Responsive UI

User-friendly design

Fast and lightweight system


⚙️ Local Setup (For Developers)

1️⃣ Clone the Repository

git clone https://github.com/your-username/anonymous-feedback-platform.git
cd anonymous-feedback-platform


2️⃣ Install Dependencies

npm install


3️⃣ Environment Variables Setup

Create a .env.local file in the root directory:

MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000


4️⃣ Run the Development Server

npm run dev


Open in browser:

http://localhost:3000


🔒 Security

OTP-based authentication

Secure session handling

Protected API routes

Encrypted credentials

Environment-based secrets


📈 Key Learnings

Implementing OTP-based authentication with Resend

Building secure sign-in and verification flows

Integrating MongoDB with Next.js APIs

Structuring reusable components

Managing global app state

Developing a complete full-stack application using Next.js


👨‍💻 Author

Harsh Kumar Yadav
B.Tech CSE | Full Stack Developer

GitHub: https://github.com/itzharsh33