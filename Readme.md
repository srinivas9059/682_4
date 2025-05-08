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
## Architecture

### 1. **Frontend (React)**

 - User Interface: Built using React, the frontend supports both admins and respondents. Admins can create forms, track responses, and analyze results, while users can access and submit surveys through dedicated form links.

 - Dashboard Visualization: React components dynamically render data visualizations (bar charts, pie charts, gauge charts) for MCQ, SAQ, and LSQ questions.

 - AI Assistant Integration: A dedicated ChatWindow component provides natural language answers based on collected survey data, enabled by backend processing.

 - Form Customization: New features include font and theme customization per form and group, along with support for form expiry control.

-

### 2. **Backend (Express / Node.js)**  

 - Express Server: The backend is powered by an Express server running on Node.js. Express handles HTTP requests and routes them to the appropriate endpoints.

 - API Endpoints: The backend exposes various API endpoints to handle operations such as creating, reading, updating, and deleting forms and responses. These endpoints process incoming requests, interact with the database, and send responses back to the frontend.

-

### 3. **Database (MongoDB)**  

 - Flexible Storage: Stores form data, user responses, group structures, AI summaries, and customization settings.

 - Mongoose Schemas: Define collections for forms, responses, themes, and expiry settings. Ensures consistency and validation during database operations.

-

### 4. **Data Flow**  

 - User/Admin Actions: Users and admins interact with the frontend by filling out forms, viewing dashboards, customizing themes, or asking questions through the AI chat interface.

 - API Requests: These interactions trigger API calls from the React frontend using fetch or Axios. Requests are routed to appropriate Express endpoints on the backend.

 - Backend Logic: The Express server handles incoming requests, applies validations and business logic (such as checking form expiry or building AI prompts), and prepares data for storage or analysis.

 - Database Transactions: Using Mongoose, the backend performs the necessary CRUD operations on MongoDB — for example, saving responses, retrieving summaries, or updating themes.

 - Response Handling: The backend sends structured JSON responses back to the frontend, which updates the user interface accordingly with the latest data or results.

 - AI Output: For AI-driven queries, the backend gathers relevant form structure and response summaries, formulates a contextual prompt, and sends it to the Grok AI API. The AI’s response is then returned to the frontend and displayed in the chat window.

---

##  Features

- Create and manage surveys with multiple question types:  
  - Multiple Choice  
  - Short Answer  
  - Likert Scale (1–5 agreement scale)

- Group-based survey links for targeted data collection
- Interactive Dashboards:
  - Bar charts for MCQs  
  - Pie charts & keyword clouds for SAQs  
  - Gauge charts for LSQs

- Built-in AI Chat Assistant to answer questions like:  
  _“Which group has the highest satisfaction?”_

- Export features:
  - Download CSV of raw responses  
  - Export visual dashboards as PDF reports

---

## Tech Stack

- **Frontend:** React, Chart.js, Mantine UI, Tailwind CSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Authentication:** Firebase (Google Sign-In)  
- **AI Integration:** Grok API ()

---
