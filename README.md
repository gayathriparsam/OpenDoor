# 🏠 OpenDoor - Premium Real Estate CRM & AI Assistant

OpenDoor is a state-of-the-art Real Estate Management platform designed for modern agencies. It combines a premium, high-performance dashboard with an **AI-powered Voice Assistant** to automate lead qualification and client engagement.

---

## 🌟 Key Features

### 1. 🎙️ Interactive AI Call Simulator
*   **Powered by Groq & Llama 3.1**: The fastest AI inference engine in the world.
*   **Natural Speech Understanding**: Handles real-world nuances like abbreviations ("Hyd" for Hyderabad) and informal currency ("50k", "1 cr").
*   **Real-time CRM Sync**: Automatically extracts buyer intent, budget, and timeline from voice conversations.
*   **Sentiment Analysis**: Live thermal gauge tracking lead interest levels.

### 2. 📧 Outbound Automation
*   **Dynamic Email Campaigns**: Automated alerts for Price Drops, New Listings, and Appointment Reminders.
*   **Nodemailer Integration**: Professional HTML email templates sent directly via SMTP.

### 3. 🛡️ Secure Authentication
*   **Google Sign-In**: One-tap access using Google Identity Services.
*   **Dual-Layer Auth**: Secure email verification system for standard accounts.

### 4. 📊 Admin Dashboard
*   **Lead Pipeline**: Manage leads through stages from "New" to "Closed".
*   **Readiness Scoring**: AI-driven scores to help agents prioritize hot leads.
*   **Property Matching**: Instant property suggestions based on lead preferences.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js, Vite, Lucide Icons, Recharts (for Analytics).
*   **Backend**: Node.js, Express.js.
*   **Database**: PostgreSQL (Primary) with a Fail-safe local JSON fallback.
*   **AI Engine**: Llama 3.1 via Groq SDK.
*   **Email**: Nodemailer (Gmail SMTP).
*   **Styling**: Glassmorphism UI with Vanilla CSS.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16 or higher)
*   npm
*   A Groq API Key (Free)
*   A Gmail account with an "App Password" (for Emailing features)

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables. Open `backend/.env` and update:
    ```env
    PORT=3001
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-16-character-app-password
    DATABASE_URL=your-postgresql-url (Optional)
    ```
4.  Start the server:
    ```bash
    node server.js
    ```

### 2. Frontend Setup
1.  Return to the root directory:
    ```bash
    cd ..
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Groq API Key in `src/config/groqConfig.js`.
4.  Launch the application:
    ```bash
    npm run dev
    ```

---

## 👥 Meet the Team

*   **Backend & AI Architect**: Managed server logic, PostgreSQL integration, and Groq/Llama connections.
*   **Frontend Specialist**: Designed the Glassmorphism UI, Auth flows, and Call Simulator interface.
*   **Prompt Engineer & Data Strategist**: Developed the AI's "Master Prompt", training it for natural real estate consultation and data extraction.

---

© 2026 OpenDoor Real Estate Platforms. Created for excellence in property management.
