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

``` 
---

### 1. **Frontend**

#### 1.1 Tech Stack

* **React** with **Vite** for fast development and bundling (`vite.config.js`)
* **Firebase** for authentication (`firebase.js`, `.env`)
* **Charting Libraries**:

  * Bar, Pie, and Gauge charts for MCQ/SAQ/LSQ dashboards
* **PDF Export Tools**: `html2canvas`, `jsPDF`, and `autoTable` for exporting dashboards
* **Natural Language Interface**: AI chatbot (`ChatWindow.jsx`) powered by Grok

#### 1.2 Structure

* **Entry Point**: `main.jsx` boots `App.jsx`
* **Routing** handled via `react-router-dom` (Dashboard, Settings, FormBuilder, UserForm)
* **Key Directories**:

  * `components/`: All major UI components (dashboard items, form UI, settings, auth)
  * `contexts/`: AuthContext for Firebase authentication
  * `utils/`: AI keyword extraction, sentiment analysis, and chart utilities
  * `assets/`: Fonts, CSS, and theme files (e.g., `dark.css`, `fonts.css`)

#### 1.3 Key Components

* `Dashboard.jsx`: Visualizes group-wise MCQ, SAQ, LSQ summaries with charts
* `ChatWindow.jsx`: Embedded AI chat assistant that answers questions about survey results
* `Settings.jsx`: Manage groups, themes, and form expiry/acceptance
* `UserForm.jsx`: Public-facing form for respondents
* `Form.jsx`: Form builder with drag-and-drop support (using `dnd-kit`)
* `SortableQuestion.jsx`, `SortableOption.jsx`: Enables reordering sections/questions/options

#### 1.4 Enhancements

* **AI Assistant** via Grok to interpret dashboards
* **Theme Customization** per group (color, font, background)
* **Form Expiry Control** — disable submissions after deadline
* **Dashboard PDF Export** with consistent formatting
* **Real-time Filtering** via `TreeSelect` for group comparison

---

### 2. **Backend**

#### 2.1 Node.js + Express

* **Main file**: `back-end/index.js`
* Uses `dotenv` for environment configuration
* Uses `node-fetch` to call Grok’s API for AI insights
* Routes are RESTful and fully integrated with the frontend

#### 2.2 MongoDB + Mongoose

* Schema defined in `formModel.js`
* Includes sections, questions, responses, group hierarchy, theme, and expiry settings

#### 2.3 Key Routes

* `POST /ask-ai`: Sends form summary to Grok AI and returns insights
* `GET /getSummaryDashboardData/:id`: Summarizes form results by group/section/question
* `GET /getAllFormResponses/:id`: Returns raw response data for export
* `PUT /updateFormGroupTheme/:formID/:groupID`: Saves theme settings for group dashboards
* `POST /saveUserFormResponse`: Saves submitted form responses
* `GET /createNewForm`: Initializes a new form with default groups and sections

---

### 3. **Authentication (Firebase)**

* Set up via `AuthContext.jsx`
* Auth flow includes:

  * Email/password sign-up and login
  * Google Sign-in
  * Forgot Password
* State is shared via React Context (`useAuth()` hook)
* Protected routes only accessible if `currentUser` is authenticated

---

### 4. **Application Flow**

1. **Admin logs in** using Firebase auth.
2. **Admin creates a form**, configures sections, adds questions.
3. Groups are automatically generated or added via settings.
4. Each group gets a unique **shareable link**.
5. Respondents use their link and fill the **UserForm**.
6. Submissions are stored and **aggregated group-wise** in MongoDB.
7. Admin views dashboards in **Dashboard.jsx**:

   * MCQ → Bar Chart
   * SAQ → Word Cloud + Pie Sentiment Chart
   * LSQ → Gauge Chart
8. Admin can:

   * **Ask AI** to summarize insights (`ChatWindow`)
   * **Export** dashboard section as a PDF
   * **Toggle form expiry** or **customize themes**
9. Data updates every 2 seconds (using polling in `useEffect`).

---

##  Component Structure 

This section outlines how major components in the system interact with one another, along with the specific role each plays. The project is modular and organized for scalability, reusability, and feature-rich behavior.

---

### 1. **Form Creation & Editing**

**File:** `Form.jsx`
**Purpose:** Main form builder for adding/editing title, description, sections, and questions.

* **Uses:**

  * `Section.jsx`: Renders multiple `Question` blocks under a section
  * `SortableQuestion.jsx`: Enables drag-and-drop reordering of questions
  * `Question.jsx`: Determines type (MCQ, SAQ, LSQ) and renders appropriate input component
  * `FormTitleDescription.jsx`: Edits title and description

---

### 2. **Questions & Options**

**Section.jsx**
Groups multiple questions under a single section.

**SortableQuestion.jsx**
Wraps each question with draggable logic. Internally calls `Question.jsx`.

**Question.jsx**
Determines `questionType` and delegates rendering to:

* `MCQuestion.jsx`
* `SAQuestion.jsx`
* `LSQuestion.jsx`

**MCQuestion.jsx / SAQuestion.jsx / LSQuestion.jsx**
Render the actual input fields during form creation/editing.

**SortableOption.jsx**
Used inside `MCQuestion.jsx` for drag-and-drop of answer choices.

---

###  3. **Form Submission (User Side)**

**UserForm.jsx**
Displays the final public-facing form for respondents. Fetches form structure, renders questions, handles submit.

**UserFormMCQ.jsx / UserFormSAQ.jsx / UserFormLSQ.jsx**
Render individual question types as seen by respondents:

* MCQ: Radio buttons
* SAQ: Textarea input
* LSQ: Horizontal Likert scale radio group

**ResponseSubmitted.jsx**
Confirmation page after submission.

---

###  4. **Dashboard & Response Analysis**

**Dashboard.jsx**
The main analytics screen. Fetches summary data, renders charts per group/section.

**MCQDashboardListItem.jsx**
Renders bar/pie charts based on MCQ distribution.

**SAQDashboardListItem.jsx**

* Shows word clouds of responses
* Displays sentiment pie chart
* Integrates keyword extraction using `compromise`
* Allows export as PDF

**LSQDashboardListItem.jsx**
Renders Likert scale results using ApexCharts gauge chart. Supports group comparisons.

---

###  5. **AI Assistant Integration**

**ChatWindow\.jsx**
Displays the Grok-powered AI chat UI.

**ChatWindow\.css**
Handles chat interface styling.

* Allows natural language queries based on survey results
* Connects to `/ask-ai` backend route for context-aware answers

---

### 6. **Grouping & Theme Settings**

**Settings.jsx**

* Toggle “accepting responses”
* Delete form
* Launch modals for parent/child group edits
* Set group-level theme (font, background, etc.)

**GroupCard.jsx / GroupListItem.jsx / GroupNameModal.jsx**

* UI for parent/child group nesting
* Used to organize form recipients

**ParentGroup.jsx / ChildGroup.jsx / LeafGroup.jsx**

* Group logic abstractions used by dashboard & settings

---

###  7. **Utilities & Behavior**

**SessionManager.jsx**
Handles user session management (timeout, validation, redirection).

**DarkModeToggle.jsx**
Toggle switch to enable dark mode UI themes.

**Home.jsx**
Landing page post-login:

* List all forms
* Create new form
* Account menu via `AccountMenu.jsx`

**FormListItem.jsx**
Used inside Home to render each saved form with delete/duplicate/edit options.

**NAResponses.jsx**
Displayed when a form is no longer accepting responses (expiry triggered).

---

### 8. **Authentication (Firebase)**

**auth/AccountMenu.jsx**
Displays logout and profile update options.

* Authentication logic is handled globally via `AuthContext`
* Firebase integration connects login, signup, and password recovery to the UI

---
