# 📊 FormEase – AI-Powered Survey & Dashboard App

FormEase is a Google Forms–like web application built using the **MERN stack (MongoDB, Express, React, Node.js)**. It enables survey creation, multi-group response tracking, and insightful visual dashboards, enhanced with an **AI Assistant** for dynamic, natural language–based data analysis.

---

## 🚀 Features

- 🎯 Create and manage surveys with multiple question types:  
  - Multiple Choice  
  - Short Answer  
  - Likert Scale (1–5 agreement scale)

- 👥 Group-based survey links for targeted data collection
- 📈 Interactive Dashboards:
  - Bar charts for MCQs  
  - Pie charts & keyword clouds for SAQs  
  - Gauge charts for LSQs

- 🤖 Built-in AI Chat Assistant to answer questions like:  
  _“Which group has the highest satisfaction?”_

- 📄 Export features:
  - Download CSV of raw responses  
  - Export visual dashboards as PDF reports

---

## 🧱 Tech Stack

- **Frontend:** React, Chart.js, Mantine UI, Tailwind CSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Authentication:** Firebase (Google Sign-In)  
- **AI Integration:** Grok / OpenAI API

---

## 🛠️ Installation

```bash
# Clone the repo
git clone https://github.com/your-username/formease.git
cd formease

# Install frontend dependencies
cd front-end
npm install

# Install backend dependencies
cd ../back-end
npm install

# Setup environment variables in .env files
# - Firebase credentials
# - MongoDB URI
# - Grok API key (for /ask-ai route)

# Start servers
cd ../back-end
npm start

cd ../front-end
npm run dev
