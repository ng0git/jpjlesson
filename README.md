🚗 JPJ Lesson – Digital Driving School Platform

Experience it here: jpj-lesson.web.app

JPJ Lesson is a comprehensive digital ecosystem designed to modernise driver education in Malaysia. By replacing fragmented manual systems with a unified cloud-based platform, it bridges the gap between theoretical knowledge and real-world road safety.

The project directly supports SDG 3 (Target 3.6) by aiming to reduce road traffic injuries and SDG 11 (Target 11.2) by providing safe, sustainable transport systems.

🌟 Key Features
AI-Powered Tutor: A RAG-based chatbot grounded in official JPJ documentation to provide instant rule clarification and quiz assistance.
Driving Simulator: A realistic practice environment with rule alerts and performance feedback.
Progress Tracking: A structured digital stage tracker (KPP01, KPP02, etc.) to monitor student readiness.
Bilingual: Increased accessibility

🛠️ Technical Architecture
Frontend
React + TypeScript (Vite): For a fast, type-safe, and modular user interface.
Tailwind CSS: For responsive and modern UI styling.

Backend & Cloud
Firebase Hosting: Automated CI/CD pipeline via GitHub Actions.
Gemini 1.5 Flash: Powering the intelligent rule assistance via the Google AI SDK.

🚀 Getting Started
Prerequisites
Node.js (v18+)

Firebase CLI (npm install -g firebase-tools)

Installation
Clone the repository:

git clone https://github.com/ng0git/jpjlesson.git
cd JPJLesson
Install dependencies:

npm install
Configure Environment Variables:
Create a .env file in the root directory and add your Firebase and Gemini credentials:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=jpj-lesson
# ... other keys
Run locally:

npm run dev
Deploy to Firebase:

npm run build
firebase deploy

🛣️ Roadmap
Short-Term: Pilot program with selected driving schools and enhanced simulator scoring.
Mid-Term: Nationwide state-level route dropdown system and multi-school onboarding.
Long-Term: Official collaboration with JPJ Malaysia for standardized digital training.
