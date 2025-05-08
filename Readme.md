# FORMSLY – ( "forms"-"ly")

Welcome to Formsly, a dynamic and user-friendly web application built to simplify the creation, distribution, and analysis of custom forms. Developed using modern technologies such as React, Vite, Node.js, and MongoDB, the platform enables users to design forms with a variety of question types, including multiple choice (MCQ), short answer (SAQ), and Likert scale (LSQ) questions. With an intuitive interface and secure backend architecture, the system supports efficient data collection and group-based response analysis.

The initial version of the system, developed by the previous team, introduced essential functionalities such as custom form creation, real-time response capture, and comparative insights across multiple respondent groups. Their work laid a strong foundation for structured survey management and group-wise data visualization.

Building on that foundation, the current team has introduced several key enhancements to improve both functionality and user experience. These include an AI-powered dashboard assistant that answers data-driven queries in natural language, sentiment and keyword analysis for short answers, pie and gauge visualizations for improved readability, and PDF export options for dashboard insights. Additionally, new capabilities such as form expiration, customizable font and theme settings, and robust bug fixes have been added to strengthen overall performance and flexibility.

This documentation brings together the efforts of both development phases to provide a complete overview of the system’s architecture, features, and evolution, reflecting a collaborative progression toward a more intelligent and responsive form management solution


---
## Problem Statement

Many organizations struggle with collecting and analyzing data effectively. Traditional methods, like paper forms or basic online surveys, often lead to mistakes and inefficiencies. Managing data from different sources can be overwhelming and time-consuming. One major issue is the inability to compare and review responses from different groups easily.

For example, if a company conducts a survey across multiple departments, it becomes difficult to see how each department responded differently. This lack of comparison makes it hard to understand various perspectives and tailor strategies accordingly. Without a way to analyze these differences, valuable insights might be missed, leading to less informed decisions.

While existing solutions provide some level of support, they often lack features like customizable form themes, response expiration control, and tools for deeper interpretation of qualitative feedback. Many platforms also offer limited export options or generic dashboards that don’t highlight trends clearly. This results in missed opportunities to uncover patterns, especially in open-ended responses, where keyword clustering or sentiment analysis could provide sharper insights.

Our Form Management System addresses these issues by offering a user-friendly platform for creating forms, collecting data, and comparing responses across different groups. The system now includes features such as form expiry settings, theme customization, and keyword-based analysis for short answers, along with an AI assistant to help interpret results more effectively. These enhancements ensure that organizations can work with clean, structured, and meaningful data — leading to better understanding and smarter decision-making.

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
