# **CS683 PROJECT** 

# **PROEJCT4: FORMS”LY**

---

## 

# **DOCUMENTATION**

# ---

# **Shivendra Tripathi** 

# **Venkata Srinivasa Reddy Gade** 

# **Sonal Dattraj Doiphode** 

# **Sai Teja**  

---

## **Table of Contents**

1. **Introduction**

2. **Problem Statement**

3. **System Architecture**

   * 3.1 Frontend (React)

   * 3.2 Backend (Express / Node.js)

   * 3.3 Database (MongoDB)

   * 3.4 Data Flow

4. **Key Features**

5. **Tech Stack**

6. **Installation Guide**

7. **Frontend Folder Structure**

8. **Component Structure**

   * 8.1 Form Creation & Editing

   * 8.2 Questions & Options

   * 8.3 Form Submission (User Side)

   * 8.4 Dashboard & Response Analysis

   * 8.5 AI Assistant Integration

   * 8.6 Grouping & Theme Settings

   * 8.7 Utilities & Behavior

   * 8.8 Authentication (Firebase)

9. **API Endpoints**

   * 9.1 General Routes

   * 9.2 Form Lifecycle

   * 9.3 Group Management

   * 9.4 Theme & Customization

   * 9.5 Response Handling

   * 9.6 Summary & Dashboard

   * 9.7 AI Integration

10. **MongoDB Schema (formModel.js)**

    * Schema Fields

    * Form Document Template

    * Questions Template

    * Group Template

    * Response Template

11. **Authorization**

    * Login.jsx

    * SignUp.jsx

    * UpdateProfile.jsx

    * ForgotPassword.jsx

    * AccountMenu.jsx

12. **Dashboard & Analysis**

    * Dashboard.jsx

    * SAQDashboardListItem.jsx

    * MCQDashboardListItem.jsx

    * LSQDashboardListItem.jsx

13. **AI Chat Assistant**

    * ChatWindow.jsx

14. **Backend Logic**

    * index.js (Route Explanations)

15. **PDF & Charting Libraries**

    * html2canvas, jsPDF

    * Chart.js, @mui/x-charts, ReactApexChart

16. **Home & Form Lifecycle**

    * Home.jsx

    * FormListItem.jsx

    * Form.jsx

    * FormTitleDescription.jsx

17. **Settings & Groups**

    * Settings.jsx

    * GroupListItem.jsx

    * ChildGroupCard.jsx

18. **Question Builders**

    * Question.jsx

    * MCQuestion.jsx

    * SAQuestion.jsx

    * LSQuestion.jsx

19. **User Forms**

    * UserForm.jsx

    * UserFormMCQ.jsx

    * UserFormSAQ.jsx

    * UserFormLSQ.jsx

    * ResponseSubmitted.jsx

    * NAResponses.jsx

20. **Conclusion**

    * Summary of Features

    * Comparison to Previous Version

    * Scalability & Maintainability Highlights

---

# 

# **INTRODUCTION**

Welcome to Formsly, a dynamic and user-friendly web application built to simplify the creation, distribution, and analysis of custom forms. Developed using modern technologies such as React, Vite, Node.js, and MongoDB, the platform enables users to design forms with a variety of question types, including multiple choice (MCQ), short answer (SAQ), and Likert scale (LSQ) questions. With an intuitive interface and secure backend architecture, the system supports efficient data collection and group-based response analysis.

The initial version of the system, developed by the previous team, introduced essential functionalities such as custom form creation, real-time response capture, and comparative insights across multiple respondent groups. Their work laid a strong foundation for structured survey management and group-wise data visualization.

Building on that foundation, the current team has introduced several key enhancements to improve both functionality and user experience. These include an AI-powered dashboard assistant that answers data-driven queries in natural language, sentiment and keyword analysis for short answers, pie and gauge visualizations for improved readability, and PDF export options for dashboard insights. Additionally, new capabilities such as form expiration, customizable font and theme settings, and robust bug fixes have been added to strengthen overall performance and flexibility.

This documentation brings together the efforts of both development phases to provide a complete overview of the system’s architecture, features, and evolution, reflecting a collaborative progression toward a more intelligent and responsive form management solution

---

## **Problem Statement**

Many organizations struggle with collecting and analyzing data effectively. Traditional methods, like paper forms or basic online surveys, often lead to mistakes and inefficiencies. Managing data from different sources can be overwhelming and time-consuming. One major issue is the inability to compare and review responses from different groups easily.

For example, if a company conducts a survey across multiple departments, it becomes difficult to see how each department responded differently. This lack of comparison makes it hard to understand various perspectives and tailor strategies accordingly. Without a way to analyze these differences, valuable insights might be missed, leading to less informed decisions.

While existing solutions provide some level of support, they often lack features like customizable form themes, response expiration control, and tools for deeper interpretation of qualitative feedback. Many platforms also offer limited export options or generic dashboards that don’t highlight trends clearly. This results in missed opportunities to uncover patterns, especially in open-ended responses, where keyword clustering or sentiment analysis could provide sharper insights.

Our Form Management System addresses these issues by offering a user-friendly platform for creating forms, collecting data, and comparing responses across different groups. The system now includes features such as form expiry settings, theme customization, and keyword-based analysis for short answers, along with an AI assistant to help interpret results more effectively. These enhancements ensure that organizations can work with clean, structured, and meaningful data — leading to better understanding and smarter decision-making.

---

## **Architecture**

### **1\. Frontend (React)**

* User Interface: Built using React, the frontend supports both admins and respondents. Admins can create forms, track responses, and analyze results, while users can access and submit surveys through dedicated form links.  
* Dashboard Visualization: React components dynamically render data visualizations (bar charts, pie charts, gauge charts) for MCQ, SAQ, and LSQ questions.  
* AI Assistant Integration: A dedicated ChatWindow component provides natural language answers based on collected survey data, enabled by backend processing.  
* Form Customization: New features include font and theme customization per form and group, along with support for form expiry control.  
* 

### **2\. Backend (Express / Node.js)**

* Express Server: The backend is powered by an Express server running on Node.js. Express handles HTTP requests and routes them to the appropriate endpoints.  
* API Endpoints: The backend exposes various API endpoints to handle operations such as creating, reading, updating, and deleting forms and responses. These endpoints process incoming requests, interact with the database, and send responses back to the frontend.  
* 

### **3\. Database (MongoDB)**

* Flexible Storage: Stores form data, user responses, group structures, AI summaries, and customization settings.  
* Mongoose Schemas: Define collections for forms, responses, themes, and expiry settings. Ensures consistency and validation during database operations.  
* 

### **4\. Data Flow**

* User/Admin Actions: Users and admins interact with the frontend by filling out forms, viewing dashboards, customizing themes, or asking questions through the AI chat interface.  
* API Requests: These interactions trigger API calls from the React frontend using fetch or Axios. Requests are routed to appropriate Express endpoints on the backend.  
* Backend Logic: The Express server handles incoming requests, applies validations and business logic (such as checking form expiry or building AI prompts), and prepares data for storage or analysis.  
* Database Transactions: Using Mongoose, the backend performs the necessary CRUD operations on MongoDB — for example, saving responses, retrieving summaries, or updating themes.  
* Response Handling: The backend sends structured JSON responses back to the frontend, which updates the user interface accordingly with the latest data or results.  
* AI Output: For AI-driven queries, the backend gathers relevant form structure and response summaries, formulates a contextual prompt, and sends it to the Grok AI API. The AI’s response is then returned to the frontend and displayed in the chat window.

---

## **Features**

* Create and manage surveys with multiple question types:  
  * Multiple Choice  
  * Short Answer  
  * Likert Scale (1–5 agreement scale)  
* Group-based survey links for targeted data collection  
* Interactive Dashboards:  
  * Bar charts for MCQs  
  * Pie charts & keyword clouds for SAQs  
  * Gauge charts for LSQs  
* Built-in AI Chat Assistant to answer questions like:  
  *“Which group has the highest satisfaction?”*  
* Export features:  
  * Download CSV of raw responses  
  * Export visual dashboards as PDF reports

---

## **Tech Stack**

* Frontend: React, Chart.js, Mantine UI, Tailwind CSS  
* Backend: Node.js, Express  
* Database: MongoDB  
* Authentication: Firebase (Google Sign-In)  
* AI Integration: Grok API ()

---

## **🛠️ Installation**

\# Clone the repo  
git clone https://github.com/srinivas9059/682\_4  
cd 682\_4

\# Install frontend dependencies  
cd front-end  
npm install

\# Install backend dependencies  
cd ../back-end  
npm install

\# Setup front-end environment variables in .env files  
VITE\_BACKEND\_URL=http://localhost:3000  
VITE\_CLIENT\_BASE\_URL=http://localhost:5173  
VITE\_API\_KEY=AIzaSyCOEh2M5ce1oIsTPhd-AlN9v3w\_-fkWH9U  
VITE\_AUTH\_DOMAIN=forms-project-auth.firebaseapp.com  
VITE\_PROJECT\_ID=forms-project-auth  
VITE\_STORAGE\_BUCKET=forms-project-auth.appspot.com  
VITE\_MESSAGING\_SENDER\_ID=525852451699  
VITE\_APP\_ID=1:525852451699:web:130efe1b21a3115f4d9b06v

\# Setup back-end environment variables in .env files  
PORT=3000  
MONGODB\_URI  
CLIENT\_BASE\_URL=http://localhost:5173  
GROQ\_API\_KEY (llama-3.3-70b-versatile get free API KEY from https://groq.com/)

\# Start servers  
cd ../back-end  
npm start

cd ../front-end  
npm run dev

---

### **1\. Frontend**

#### **1.1 Tech Stack**

* React with Vite for fast development and bundling (vite.config.js)  
* Firebase for authentication (firebase.js, .env)  
* Charting Libraries:  
  * Bar, Pie, and Gauge charts for MCQ/SAQ/LSQ dashboards  
* PDF Export Tools: html2canvas, jsPDF, and autoTable for exporting dashboards  
* Natural Language Interface: AI chatbot (ChatWindow.jsx) powered by Grok

#### **1.2 Structure**

* Entry Point: main.jsx boots App.jsx  
* Routing handled via react-router-dom (Dashboard, Settings, FormBuilder, UserForm)  
* Key Directories:  
  * components/: All major UI components (dashboard items, form UI, settings, auth)  
  * contexts/: AuthContext for Firebase authentication  
  * utils/: AI keyword extraction, sentiment analysis, and chart utilities  
  * assets/: Fonts, CSS, and theme files (e.g., dark.css, fonts.css)

#### **1.3 Key Components**

* Dashboard.jsx: Visualizes group-wise MCQ, SAQ, LSQ summaries with charts  
* ChatWindow.jsx: Embedded AI chat assistant that answers questions about survey results  
* Settings.jsx: Manage groups, themes, and form expiry/acceptance  
* UserForm.jsx: Public-facing form for respondents  
* Form.jsx: Form builder with drag-and-drop support (using dnd-kit)  
* SortableQuestion.jsx, SortableOption.jsx: Enables reordering sections/questions/options

#### **1.4 Enhancements**

* AI Assistant via Grok to interpret dashboards  
* Theme Customization per group (color, font, background)  
* Form Expiry Control — disable submissions after deadline  
* Dashboard PDF Export with consistent formatting  
* Real-time Filtering via TreeSelect for group comparison

---

### **2\. Backend**

#### **2.1 Node.js \+ Express**

* Main file: back-end/index.js  
* Uses dotenv for environment configuration  
* Uses node-fetch to call Grok’s API for AI insights  
* Routes are RESTful and fully integrated with the frontend

#### **2.2 MongoDB \+ Mongoose**

* Schema defined in formModel.js  
* Includes sections, questions, responses, group hierarchy, theme, and expiry settings

#### **2.3 Key Routes**

* POST /ask-ai: Sends form summary to Grok AI and returns insights  
* GET /getSummaryDashboardData/:id: Summarizes form results by group/section/question  
* GET /getAllFormResponses/:id: Returns raw response data for export  
* PUT /updateFormGroupTheme/:formID/:groupID: Saves theme settings for group dashboards  
* POST /saveUserFormResponse: Saves submitted form responses  
* GET /createNewForm: Initializes a new form with default groups and sections

---

### **3\. Authentication (Firebase)**

* Set up via AuthContext.jsx  
* Auth flow includes:  
  * Email/password sign-up and login  
  * Google Sign-in  
  * Forgot Password  
* State is shared via React Context (useAuth() hook)  
* Protected routes only accessible if currentUser is authenticated

---

### **4\. Application Flow**

1. Admin logs in using Firebase auth.  
2. Admin creates a form, configures sections, adds questions.  
3. Groups are automatically generated or added via settings.  
4. Each group gets a unique shareable link.  
5. Respondents use their link and fill the UserForm.  
6. Submissions are stored and aggregated group-wise in MongoDB.  
7. Admin views dashboards in Dashboard.jsx:  
   * MCQ → Bar Chart  
   * SAQ → Word Cloud \+ Pie Sentiment Chart  
   * LSQ → Gauge Chart  
8. Admin can:  
   * Ask AI to summarize insights (ChatWindow)  
   * Export dashboard section as a PDF  
   * Toggle form expiry or customize themes  
9. Data updates every 2 seconds (using polling in useEffect).

---

## **Component Structure**

This section outlines how major components in the system interact with one another, along with the specific role each plays. The project is modular and organized for scalability, reusability, and feature-rich behavior.

---

### **1\. Form Creation & Editing**

File: Form.jsx Purpose: Main form builder for adding/editing title, description, sections, and questions.

* Uses:  
  * Section.jsx: Renders multiple Question blocks under a section  
  * SortableQuestion.jsx: Enables drag-and-drop reordering of questions  
  * Question.jsx: Determines type (MCQ, SAQ, LSQ) and renders appropriate input component  
  * FormTitleDescription.jsx: Edits title and description

---

### **2\. Questions & Options**

Section.jsx Groups multiple questions under a single section.

SortableQuestion.jsx Wraps each question with draggable logic. Internally calls Question.jsx.

Question.jsx Determines questionType and delegates rendering to:

* MCQuestion.jsx  
* SAQuestion.jsx  
* LSQuestion.jsx

MCQuestion.jsx / SAQuestion.jsx / LSQuestion.jsx Render the actual input fields during form creation/editing.

SortableOption.jsx Used inside MCQuestion.jsx for drag-and-drop of answer choices.

---

### **3\. Form Submission (User Side)**

UserForm.jsx Displays the final public-facing form for respondents. Fetches form structure, renders questions, handles submit.

UserFormMCQ.jsx / UserFormSAQ.jsx / UserFormLSQ.jsx Render individual question types as seen by respondents:

* MCQ: Radio buttons  
* SAQ: Textarea input  
* LSQ: Horizontal Likert scale radio group

ResponseSubmitted.jsx Confirmation page after submission.

---

### **4\. Dashboard & Response Analysis**

Dashboard.jsx The main analytics screen. Fetches summary data, renders charts per group/section.

MCQDashboardListItem.jsx Renders bar/pie charts based on MCQ distribution.

SAQDashboardListItem.jsx

* Shows word clouds of responses  
* Displays sentiment pie chart  
* Integrates keyword extraction using compromise  
* Allows export as PDF

LSQDashboardListItem.jsx Renders Likert scale results using ApexCharts gauge chart. Supports group comparisons.

---

### **5\. AI Assistant Integration**

ChatWindow.jsx Displays the Grok-powered AI chat UI.

ChatWindow.css Handles chat interface styling.

* Allows natural language queries based on survey results  
* Connects to /ask-ai backend route for context-aware answers

---

### **6\. Grouping & Theme Settings**

Settings.jsx

* Toggle “accepting responses”  
* Delete form  
* Launch modals for parent/child group edits  
* Set group-level theme (font, background, etc.)

GroupCard.jsx / GroupListItem.jsx / GroupNameModal.jsx

* UI for parent/child group nesting  
* Used to organize form recipients

ParentGroup.jsx / ChildGroup.jsx / LeafGroup.jsx

* Group logic abstractions used by dashboard & settings

---

### **7\. Utilities & Behavior**

SessionManager.jsx Handles user session management (timeout, validation, redirection).

DarkModeToggle.jsx Toggle switch to enable dark mode UI themes.

Home.jsx Landing page post-login:

* List all forms  
* Create new form  
* Account menu via AccountMenu.jsx

FormListItem.jsx Used inside Home to render each saved form with delete/duplicate/edit options.

NAResponses.jsx Displayed when a form is no longer accepting responses (expiry triggered).

---

### **8\. Authentication (Firebase)**

auth/AccountMenu.jsx Displays logout and profile update options.

* Authentication logic is handled globally via AuthContext  
* Firebase integration connects login, signup, and password recovery to the UI

Perfect. Based on your updated `index.js`, here’s the **updated and complete API Endpoints section** for the **Spring 2025 version**, ready to go into your `README.md`:

---

##  **API Endpoints**

All endpoints are part of the Express backend. They interact with MongoDB via Mongoose and support features like AI-powered analysis, group hierarchy, response summaries, and customization.

---

###  **General Routes**

#### **1\. `GET /`**

* **Purpose:** Retrieve all forms in the database.

* **Returns:** Array of all form documents.

* **Params:** None

#### **2\. `GET /ping`**

* **Purpose:** Health check to verify the server is running.

* **Returns:** `{ msg: "Active" }`

* **Params:** None

---

###  **Form Lifecycle**

#### **3\. `GET /createNewForm`**

* **Purpose:** Create a new form with default settings and groups.

* **Params (query):**

  * `userID`: Creator's ID

  * `formTitle` (optional): Title of the new form

  * `groupName` (optional): Default group name

#### **4\. `PUT /updateForm`**

* **Purpose:** Update form metadata, sections, and groups.

* **Body:** `formID`, `formTitle`, `formDescription`, `formSections`, `formGroups`, `formParentGroups`

#### **5\. `DELETE /deleteForm/:id`**

* **Purpose:** Delete a form by ID.

* **Params (URL):** `id` \= Form ID

#### **6\. `GET /getFormData/:id`**

* **Purpose:** Retrieve full data for a specific form.

#### **7\. `GET /duplicateForm/:id`**

* **Purpose:** Clone a form and create a duplicate with new IDs.

---

###  **Group Management**

#### **8\. `GET /createNewParentFormGroup/:id`**

* **Purpose:** Add a new parent group to a form.

* **Params:**

  * `id` (URL): Form ID

  * `parentGroupName` (query): Name of new parent group

#### **9\. `GET /createNewChildFormGroup/:id`**

* **Purpose:** Add a new child group under an existing group or parent.

#### **10\. `GET /createNewFormGroup/:id`**

* **Purpose:** Add a leaf-level group (final group link to share).

---

###  **Customization & Themes**

#### **11\. `PUT /updateFormGroupTheme/:formID/:groupID`**

* **Purpose:** Update theme (color, font, background) for a group.

* **Body:** Theme settings object

#### **12\. `POST /setIsAcceptingResponses`**

* **Purpose:** Toggle whether a form is currently accepting responses.

#### **13\. `GET /getFormIsAcceptingResponses/:id`**

* **Purpose:** Check if the form is open for new responses.

---

###  **User Response Handling**

#### **14\. `POST /saveUserFormResponse`**

* **Purpose:** Save submitted responses from users.

* **Body:** `formID`, `formResponse` (user's answers)

#### **15\. `GET /getAllFormResponses/:id`**

* **Purpose:** Export full raw data (responses \+ form structure).

---

###  **Summary & Dashboard**

#### **16\. `GET /getSummaryDashboardData/:id`**

* **Purpose:** Return group-wise summary (MCQ/SAQ/LSQ).

* **Includes:**

  * Group-wise response aggregation

  * Section-wise question stats

  * Count of all responses

---

###  **AI Integration**

#### **17\. `POST /ask-ai`**

* **Purpose:** Send form summary and user question to Grok AI.

* **Body:**

  * `question`: User's natural language query

  * `surveyData`: Contains form title, questions, and structured summaries

* **Returns:** AI-generated text-based insights about form trends, comparisons, or summaries.

---

##  **Model Schema**

The `formModel.js` file defines the structure of form documents stored in MongoDB using Mongoose. The current schema includes enhancements introduced in Spring 2025, such as **section-based question organization**, **theme customization**, and **support for hierarchical group structures**.

---

### **📋 Schema Fields**

1. **userID**

   * **Type:** String

   * **Required:** Yes

   * **Unique:** No

   * Identifies the user who created the form.

2. **formID**

   * **Type:** String

   * **Required:** Yes

   * **Unique:** Yes

   * Unique identifier for each form, used to distinguish and retrieve forms.

3. **formTitle**

   * **Type:** String

   * The title/name of the form.

4. **formDescription**

   * **Type:** String

   * A description or summary explaining the form’s purpose.

5. **formSections**

   * **Type:** Array of `SectionSchema`

   * Organizes questions into named sections for better structure.

   * Each section includes:

     * `sectionID` (String)

     * `questions`: Array of mixed-type question objects

6. **formResponses**

   * **Type:** Array of Mixed Types

   * Stores each user's full response set, grouped by groupID.

7. **formGroups**

   * **Type:** Array of Mixed Types

   * Contains all groups (child/leaf) used to distribute the form and collect segmented data.

8. **formParentGroups**

   * **Type:** Array of Mixed Types

   * Defines higher-level (parent) groups which may contain child groups.

9. **formIsAcceptingResponses**

   * **Type:** Boolean

   * Flag to toggle whether the form is currently open for responses.

10. **theme**

* **Type:** Object

* Customization settings applied to a form or group dashboard.

* Fields:

  * `primaryColor` (String, default: "\#ffffff")

  * `fontFamily` (String, default: "Arial")

  * `backgroundImage` (String, default: "")

11. **timestamps**

* **Type:** Object (Auto-generated by Mongoose)

* Tracks `createdAt` and `updatedAt` for each form.

---

### **🧾 Form Document Template**

{  
  "formID": "form123",  
  "formTitle": "Spring Feedback Survey",  
  "formDescription": "Collecting feedback for Spring term.",  
  "formSections": \[ ... \],  
  "formResponses": \[ ... \],  
  "formGroups": \[ ... \],  
  "formParentGroups": \[ ... \],  
  "formIsAcceptingResponses": true,  
  "theme": {  
    "primaryColor": "\#0055ff",  
    "fontFamily": "Roboto",  
    "backgroundImage": ""  
  }  
}

---

###  **Questions Array Example (Inside `formSections`)**

\[  
  {  
    "sectionID": "s1",  
    "questions": \[  
      {  
        "questionID": 1001,  
        "questionType": 1,  
        "question": "What genre of music do you prefer?",  
        "options": \[  
          { "optionID": 1, "optionValue": "Pop" },  
          { "optionID": 2, "optionValue": "Rock" }  
        \]  
      },  
      {  
        "questionID": 1002,  
        "questionType": 2,  
        "question": "Any additional feedback?"  
      },  
      {  
        "questionID": 1003,  
        "questionType": 3,  
        "question": "Rate your satisfaction",  
        "upperLimit": 5,  
        "labels": \["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"\]  
      }  
    \]  
  }  
\]

---

###  **Group Array Template**

\[  
  {  
    "groupID": "grp123",  
    "groupCode": "3",  
    "groupName": "Freshmen",  
    "parentGroupID": "pg001",  
    "groupLink": "https://.../\#/userform/form123/grp123",  
    "childGroups": \[\],  
    "theme": {  
      "primaryColor": "\#ffcc00",  
      "fontFamily": "Poppins",  
      "backgroundImage": ""  
    }  
  }  
\]

---

###  **Response Array Template**

\[  
  {  
    "userGroupID": "grp123",  
    "userResponse": \[  
      { "questionID": 1001, "answer": "Pop" },  
      { "questionID": 1002, "answer": "Loved the experience\!" },  
      { "questionID": 1003, "answer": "4" }  
    \]  
  }  
\]

---

## **Methods Overview** 

Below is the detailed explanation of each method used in our project, organized by file. This will help you understand the purpose and functionality of each method within the context of the project's structure.

---

Here's the unpacked version for the **Authorization** section — formatted precisely for inclusion in your documentation PDF:

---

##  **Authorization**

This section includes the authentication flow for login, signup, password reset, and profile management. Firebase Authentication is used to securely manage users.

---

###  **Login.jsx**

#### **1\. `useEffect`**

* **Purpose**: Executes when the component mounts or when the authenticated user (`currentUser`) changes.

* **Functionality**:

  * If the user is already logged in, it redirects them to the home page.

  * Sends a `GET /ping` request to the backend to verify server health.

#### **2\. `handleSubmit`**

* **Purpose**: Handles the login form submission for email/password authentication.

* **Functionality**:

  * Prevents default form behavior.

  * Calls `login(email, password)` from the custom `useAuth` context.

  * On success, redirects the user to the homepage.

  * If an error occurs (e.g., invalid credentials), sets the error message state to display an alert.

#### **3\. `handleSignInWithGoogle`**

* **Purpose**: Handles sign-in via Google OAuth.

* **Functionality**:

  * Calls `signInWithGoogle()` from `useAuth`.

  * On success, navigates the user to the homepage.

  * On error, displays an appropriate alert.

---

###  **SignUp.jsx**

#### **1\. `useEffect`**

* **Purpose**: Prevents logged-in users from accessing the signup page.

* **Functionality**:

  * On mount, checks if `currentUser` exists.

  * If authenticated, navigates directly to the homepage.

#### **2\. `handleSubmit`**

* **Purpose**: Handles the signup form submission.

* **Functionality**:

  * Prevents default behavior.

  * Validates if `password` and `confirmPassword` match.

  * Calls `signup(email, password)` from `useAuth`.

  * Redirects to the home page on successful registration.

  * Displays an error message on failure (e.g., weak password or email already in use).

---

###  **UpdateProfile.jsx**

#### **1\. `useEffect`**

* **Purpose**: Prevents unauthenticated users from accessing the profile update page.

* **Functionality**:

  * Redirects to `/login` if no user is logged in (`!currentUser`).

#### **2\. `handleSubmit`**

* **Purpose**: Handles password update request.

* **Functionality**:

  * Validates that `password` and `confirmPassword` match.

  * Calls `updatePassword(password)` from `useAuth`.

  * On success, redirects the user to the homepage.

  * On error, sets an error message state.

#### **3\. `handleDeleteAccount`**

* **Purpose**: Deletes the user's account.

* **Functionality**:

  * Checks if the user has forms (prevents deletion if forms are present).

  * Calls `deleteAccount()` from `useAuth`.

  * On success, redirects to login and clears user state.

  * On error, sets error message for feedback.

---

###  **ForgotPassword.jsx**

#### **1\. `useEffect`**

* **Purpose**: Prevents access to password reset page if already logged in.

* **Functionality**:

  * Redirects to home page if `currentUser` exists.

#### **2\. `handleSubmit`**

* **Purpose**: Triggers password recovery email.

* **Functionality**:

  * Uses `resetPassword(email)` from `useAuth`.

  * On success, shows confirmation message.

  * On failure, displays error in an alert.

---

###  **AccountMenu.jsx**

#### **1\. `navigate`**

* **Purpose**: Provides programmatic route control using `useNavigate` from `react-router-dom`.

* **Functionality**:

  * Routes to `/updateProfile` when the user selects “Update Profile.”

  * Routes to `/login` after logout.

#### **2\. `handleLogOut`**

* **Purpose**: Logs the user out.

* **Functionality**:

  * Calls `logout()` from `useAuth` context.

  * Redirects the user to login screen upon successful logout.

---

Here’s the unpacked documentation for the **`Dashboard.jsx`** file, formatted for inclusion in the final documentation PDF:

---

##  **Dashboard.jsx**

The `Dashboard.jsx` component is the central location for analyzing form responses. It supports group-wise comparisons, dynamic filtering, and visual summaries (bar, pie, gauge), as well as AI-generated insights through an integrated chat assistant. The dashboard is capable of exporting raw and visualized data as CSV or PDF.

---

###  **`useEffect`**

* **Purpose**: Initializes dashboard state by loading response summaries and form details.

* **Functionality**:

  * On mount or when form ID changes, it fetches:

    * Summary data using `/getSummaryDashboardData/:id`

    * Questions, groups, and total responses

  * Sets state variables like `summaryData`, `formQuestions`, and `formResponses`.

  * Sets up periodic re-fetching every few seconds (used when filters are not applied).

  * Ensures UI is up-to-date in near-real-time.

---

###  **`fetchData`**

* **Purpose**: Fetches and parses structured response summary data from the backend.

* **Functionality**:

  * Sends `GET` request to `/getSummaryDashboardData/:id`.

  * Parses and stores:

    * `formQuestions`

    * `formResponses`

    * `formGroups` and `formParentGroups`

    * `groupResponses` for group-wise aggregation

  * Populates group filter options (`parentOptions` and `options`).

---

###  **`handleDownloadCSV`**

* **Purpose**: Allows exporting of raw user response data for offline analysis.

* **Functionality**:

  * Fetches raw data from `/getAllFormResponses/:id`.

  * Converts it into a well-formatted CSV string.

  * Triggers download using `Blob` and `file-saver`.

---

###  **`handleDownloadPDF`**

* **Purpose**: Allows admin to export a clean PDF view of all submitted user responses.

* **Functionality**:

  * Converts the DOM content for the responses section using `html2canvas`.

  * Renders it to a PDF using `jsPDF` and `autoTable`.

  * Prompts a download of the generated document.

---

###  **`handleDownloadDashboardPDF`**

* **Purpose**: Exports the full dashboard analysis—including MCQ, SAQ, and LSQ sections—as a PDF.

* **Functionality**:

  * Captures the entire dashboard DOM structure.

  * Converts visuals (charts, text, word clouds) into a multi-page PDF layout.

  * Saves all analytics, group comparisons, and visual elements in one downloadable file.

---

###  **`renderResponseSections`**

* **Purpose**: Parent wrapper to dynamically map form sections to respective visualizations.

* **Functionality**:

  * Loops through selected groups and sections.

  * Passes relevant props to child components:

    * `MCQDashboardListItem`

    * `SAQDashboardListItem`

    * `LSQDashboardListItem`

  * Ensures correct rendering per group and section structure.

---

###  **`renderResponseSection`**

* **Purpose**: Main logic to render each question type within a section.

* **Functionality**:

  * Filters and renders based on:

    * `questionType` (1: MCQ, 2: SAQ, 3: LSQ)

    * Group selection

  * Enables comparison view if `content2` (second group data) is passed.

  * Delegates rendering to the correct child component.

---

###  **`<ChatWindow />`**

* **Purpose**: Embeds an AI assistant for interpreting survey summaries.

* **Functionality**:

  * Sends structured form data \+ summaries to `/ask-ai` endpoint.

  * Groq AI processes it and returns textual insights based on form sections and group patterns.

  * Users can ask questions like:

    * “Which group was more positive?”

    * “What’s the most mentioned keyword in SAQ?”

    * “Summarize LSQ trends between groups.”

---

##  **SAQDashboardListItem.jsx**

The `SAQDashboardListItem` component is used to render and analyze Short Answer Questions (SAQ) in the dashboard. It provides sentiment analysis, keyword extraction, and word cloud visualizations, along with PDF export functionality. A toggle allows users to switch between raw responses and extracted keywords.

---

###  **`useState(useKeywordsOnly)`**

* **Purpose**: Manages the toggle between raw text word cloud and AI-extracted keyword cloud.

* **Functionality**:

  * When set to `true`, the component displays only key terms extracted using the `compromise` NLP library.

  * When `false`, displays all words (excluding stopwords).

  * Controlled by a checkbox in the UI labeled “Keywords only.”

---

###  **`useRef(dashboardRef)`**

* **Purpose**: Provides a reference to the entire SAQ dashboard section for PDF generation.

* **Functionality**:

  * Used by `html2canvas` to capture the DOM element and render it as an image.

  * Enables full-section export via the `handleDownloadPDF()` method.

---

###  **`extractRawWordData()`**

* **Purpose**: Prepares raw textual data for the basic word cloud visualization.

* **Functionality**:

  * Loops through all SAQ answers (`subData`).

  * Tokenizes and lowercases each word.

  * Removes stopwords using the `stopword` package.

  * Generates a frequency map for each remaining word.

---

###  **`processResponses()`**

* **Purpose**: Processes SAQ responses for advanced NLP-based insights.

* **Functionality**:

  * Extracts keywords using the `compromise` library for each short answer.

  * Analyzes sentiment polarity of all responses using the `sentiment` package:

    * Calculates counts of Positive, Neutral, and Negative responses.

  * Also applies `stopword` filtering if displaying raw word cloud.

  * Output is used to render:

    * Sentiment pie chart

    * Keyword word cloud or raw word cloud

---

###  **`renderSentimentPie(summary)`**

* **Purpose**: Displays sentiment breakdown in a pie chart format.

* **Functionality**:

  * Takes the `summary` object generated by `sentiment`.

  * Uses `Chart.js` (via `react-chartjs-2`) to render a pie showing:

    * Positive responses

    * Neutral responses

    * Negative responses

  * Visually helps users understand emotional tone in responses.

---

###  **`handleDownloadPDF()`**

* **Purpose**: Exports the full SAQ section (sentiment chart \+ word cloud) as a standalone PDF.

* **Functionality**:

  * Captures the dashboard area using `html2canvas`.

  * Renders it to a downloadable `.pdf` using `jsPDF`.

  * Useful for including SAQ insights in presentations or reports.

---

##  **LSQDashboardListItem.jsx**

The `LSQDashboardListItem` component handles the analysis and visualization of Likert Scale Questions (LSQ) in the dashboard. It presents both single-group and comparison views using half-circle gauge charts, enriched with interpretation logic for mean, standard deviation, and visual alignment of scale labels.

---

###  **`interpretMean()`**

* **Purpose**: Converts the numeric mean value of Likert responses into a human-readable interpretation.

* **Functionality**:

  * Analyzes the calculated mean for the question.

  * Outputs interpretations like:

    * “Generally positive”

    * “Neutral leaning”

    * “Mixed feedback”

  * Useful for summarizing trends in Likert data without needing to interpret raw numbers.

---

###  **`interpretStdDev()`**

* **Purpose**: Evaluates the standard deviation to comment on response consistency.

* **Functionality**:

  * Interprets how spread out the responses are.

  * Examples of output:

    * “High agreement among respondents”

    * “Diverse opinions observed”

  * Adds qualitative value to numerical standard deviation.

---

###  **`avgPercentage`**

* **Purpose**: Converts the raw mean into a percentage to fit the gauge chart’s scale.

* **Functionality**:

  * Normalizes the mean value using the Likert scale's upper limit.

  * Ensures that values are scaled 0–100% regardless of whether the scale is 5-point or 7-point.

  * Supports uniform rendering across all LSQ questions.

---

###  **`Comparison View`**

* **Purpose**: Enables side-by-side visualization of two group responses on the same Likert question.

* **Functionality**:

  * Renders **two gauge charts** with the same scale, each representing one group.

  * Aligns both charts with vertically stacked labels (“Strongly Disagree” on the left, “Strongly Agree” on the right).

  * Visual design ensures:

    * Matching arc length and width

    * Equal spacing

    * Consistent gradient color transitions

  * Helps users quickly identify group-level shifts in sentiment or agreement.

---

## **MCQDashboardListItem.jsx**

The `MCQDashboardListItem` component processes and visualizes Multiple Choice Question (MCQ) data for both single and comparison views. It generates response distribution charts using the `@mui/x-charts` library and supports textual summaries that help identify trends and differences between respondent groups.

---

###  **`dataPoints1`, `dataPoints2`**

* **Purpose**: Extract the distribution of responses to an MCQ per group.

* **Functionality**:

  * For each group (Group 1 and Group 2 in comparison view), counts how many times each option was selected.

  * Builds a dataset of counts or percentages for each option.

  * Ensures uniform structure for consistent visual comparison in bar charts.

  * Used to populate the `series` in the `BarChart`.

---

###  **`summaryText`**

* **Purpose**: Provides a written summary of which MCQ options were most or least selected.

* **Functionality**:

  * Analyzes the frequency distribution of responses in `dataPoints1`.

  * Outputs phrases like:

    * “Most selected: Option A”

    * “Least selected: Option D”

  * Offers a quick textual insight without needing to read the chart.

---

###  **`comparativeText`**

* **Purpose**: Compares how the two groups responded to the same MCQ.

* **Functionality**:

  * Calculates absolute and percentage differences for each MCQ option between `dataPoints1` and `dataPoints2`.

  * Identifies:

    * Most diverged options

    * Common agreements

  * Outputs insights like:

    * “Group A preferred Option 2 more than Group B by 25%”

    * “Both groups favored Option 1 equally”

  * Aids in comparative behavioral analysis across demographics or departments.

---

###  **`BarChart` (via `@mui/x-charts`)**

* **Purpose**: Visually displays MCQ option distributions.

* **Functionality**:

  * Renders bar graphs with color-coded options and value labels.

  * Automatically adjusts width and height to accommodate multiple options.

  * Supports dual-series rendering for side-by-side group comparisons.

  * Integrates directly with `dataPoints1`, `dataPoints2`, and `xAxisData`.

---

###  **`xAxisData`**

* **Purpose**: Defines the label set for the x-axis of the bar chart.

* **Functionality**:

  * Collects the text values of all MCQ options (e.g., “Strongly Agree,” “Neutral”).

  * Ensures consistent label rendering across charts.

  * In comparison view, aligns both group data with shared labels.

---

## **ChatWindow.jsx**

The `ChatWindow` component provides an AI-powered chat assistant embedded directly within the dashboard. It enables users (typically survey creators) to ask natural language questions about survey results, receive Groq-generated insights, and interpret group-wise trends dynamically. It communicates with the `/ask-ai` backend endpoint using the current form structure and response summaries.

---

###  **`handleSendMessage()`**

* **Purpose**: Manages the interaction between the user and the AI backend.

* **Functionality**:

  * Triggered when the user submits a new message.

  * Sends a `POST` request to the `/ask-ai` route with:

    * The user’s question (from input)

    * A JSON object containing:

      * All survey questions

      * Form title

      * Group-wise response summaries

  * Waits for a Groq API response.

  * On receiving an answer:

    * Appends it to the chat window.

    * Triggers `scrollToBottom()` to ensure visibility of the new response.

  * Error handling displays a fallback message if the API fails.

---

###  **`generatePrompt()`**

* **Purpose**: Builds a structured prompt to ensure the Groq AI understands the form context.

* **Functionality**:

  * Assembles the system message based on:

    * The survey title

    * List of questions and their types

    * Group-wise summary statistics

  * Ensures the prompt follows a consistent format with clear role separation:

    * `system`: “You are an AI assistant helping analyze survey responses.”

    * `user`: Contains the raw question entered by the admin.

  * The Groq model uses this to respond with grounded insights (e.g., comparative trends, dominant sentiment, or response distribution).

---

###  **`scrollToBottom()`**

* **Purpose**: Automatically scrolls the chat view to the latest message.

* **Functionality**:

  * Uses a `ref` to point to the end of the chat log.

  * On new message render, ensures that the window scrolls smoothly to the most recent entry.

  * Maintains chat usability by preventing users from manually scrolling every time.

---

###  **`useEffect`**

* **Purpose**: Initializes chat interface when the component is mounted.

* **Functionality**:

  * Loads any persisted chat history (optional).

  * Sets up initial system instructions (optional customization).

  * Invoked again if reset is triggered or form ID changes.

---

##  **Backend – `index.js`**

The backend is built using **Node.js \+ Express** and interfaces with **MongoDB** via **Mongoose**. It exposes RESTful endpoints to create, retrieve, update, and analyze survey forms and responses. New Spring 2025 additions include AI-based insights, theme customization, CSV/PDF exporting, and hierarchical group creation.

---

###  **`POST /ask-ai`**

* **Purpose**: Sends survey structure and response summaries to Groq's AI model and returns an AI-generated answer.

* **Functionality**:

  * Expects a `question` string and `surveyData` object in the request body.

  * Formats a prompt containing:

    * Form title

    * All questions with types

    * Group-wise summaries

  * Sends the prompt to Groq’s `llama-3.3-70b-versatile` model.

  * Returns AI-generated insights in the `answer` field.

* **Used In**: `ChatWindow.jsx`

---

###  **`GET /getAllFormResponses/:id`**

* **Purpose**: Retrieves **raw responses** submitted to a form for CSV export.

* **Functionality**:

  * Finds form by `formID`.

  * Returns:

    * Form title

    * Form sections

    * All form responses (groupID \+ answers)

* **Used In**: `handleDownloadCSV` in `Dashboard.jsx`

---

###  **`PUT /updateFormGroupTheme/:formID/:groupID`**

* **Purpose**: Updates theme (color, font, background) for a specific group within a form.

* **Functionality**:

  * Accepts a `theme` object in the body.

  * Locates the correct group or parent group by `groupID`.

  * Merges the new theme into existing structure and saves the form.

* **Use Case**: Allows individual branding per group (e.g., department, class).

---

###  **`PUT /updateSection`**

* **Purpose**: Updates all questions within a specific section of a form.

* **Functionality**:

  * Accepts `formID`, `sectionID`, and updated `questions[]` in the request body.

  * Locates the section and updates it atomically.

* **Used In**: `Form.jsx` after reordering or editing questions.

---

###  **`GET /getSummaryDashboardData/:id`**

* **Purpose**: Provides structured, group-wise data summaries for all form questions.

* **Functionality**:

  * Processes form responses grouped by `groupID`.

  * For each section and question:

    * Tallies MCQ counts

    * Gathers SAQ answers

    * Computes LSQ averages

  * Returns:

    * `groupResponses`: Main data for visualization

    * `formGroups`, `formParentGroups`

    * `formSections`

* **Used In**: `Dashboard.jsx`, all analysis components

---

###  **`GET /duplicateForm/:id`**

* **Purpose**: Clones an entire form (structure only, no responses).

* **Functionality**:

  * Copies all fields from original form.

  * Generates new `formID`, default groups, and resets responses.

* **Used In**: `handleDuplicateFormListItem` in `Home.jsx`

---

###  **`GET /createNewParentFormGroup/:id`**

* **Purpose**: Adds a new parent group to an existing form.

* **Functionality**:

  * Accepts `parentGroupName` as a query parameter.

  * Adds a new group object to the form’s `formParentGroups[]`.

* **Used In**: `Settings.jsx`

---

###  **`GET /createNewFormGroup/:id`**

* **Purpose**: Creates a new **leaf group** linked to a parent or another group.

* **Functionality**:

  * Accepts `groupName` and `groupID` of the parent in the query.

  * Generates a new `groupID`, link, and updates relationships.

* **Used In**: `ChildGroupCard.jsx`, `Settings.jsx`

---

###  **`GET /createNewChildFormGroup/:id`**

* **Purpose**: Creates a child group under an existing parent or nested group.

* **Functionality**:

  * Similar to `createNewFormGroup`, but also updates nested structures.

  * Supports multi-level hierarchy.

* **Used In**: `Settings.jsx`

---

###  **`POST /saveUserFormResponse`**

* **Purpose**: Submits a user’s form response to the database.

* **Functionality**:

  * Appends a new `formResponse` object to the form’s `formResponses[]`.

  * Includes metadata like `userGroupID` and array of question–answer pairs.

* **Used In**: `UserForm.jsx`

---

###  **`POST /setIsAcceptingResponses`**

* **Purpose**: Toggles whether a form can currently accept new responses.

* **Functionality**:

  * Accepts `formID` and boolean `formIsAcceptingResponses`.

  * Updates the flag in the database.

* **Used In**: `Settings.jsx` (form status toggle)

---

## **PDF & Charting Tools**

This section outlines the visualization and export libraries integrated throughout the Spring 2025 version of the project. These tools enable dynamic chart rendering for response analysis and high-fidelity exports of dashboard insights as PDF files. Together, they significantly enhance the usability and presentability of survey data.

---

###  **`html2canvas` \+ `jsPDF`**

* **Purpose**: Export full dashboard sections (SAQ, full dashboard) as static PDFs.

* **Functionality**:

  * `html2canvas` captures a specified DOM node and converts it into a canvas image.

  * `jsPDF` embeds the canvas into a `.pdf` document, optionally with headers, tables, or multi-page handling.

* **Used In**:

  * `SAQDashboardListItem.jsx`: To export sentiment pie \+ word cloud.

  * `Dashboard.jsx`: To export the entire dashboard (MCQ, SAQ, LSQ) as one document.

* **Supporting Utility**: `jspdf-autotable` is optionally used to generate tabular content.

---

###  **`Chart.js` (Pie)**

* **Purpose**: Displays sentiment distribution for Short Answer Questions.

* **Functionality**:

  * Integrated via `react-chartjs-2`.

  * Used to render a pie chart with three segments:

    * Positive

    * Neutral

    * Negative

  * Dynamically updates based on sentiment analysis from the `sentiment` package.

* **Used In**: `SAQDashboardListItem.jsx`

---

###  **`@mui/x-charts` (BarChart)**

* **Purpose**: Visualizes MCQ response counts per option and per group.

* **Functionality**:

  * Clean, responsive bar charts styled to match MUI design.

  * Supports grouped comparisons when `dataPoints1` and `dataPoints2` are passed.

  * Automatically adjusts bar width and label size.

* **Used In**: `MCQDashboardListItem.jsx`

---

###  **`ReactApexChart` (Gauge)**

* **Purpose**: Renders average Likert scores as semi-circular gauge meters.

* **Functionality**:

  * Used for both single-group and comparison views.

  * Accepts a scaled percentage value (`avgPercentage`) to position the needle.

  * Supports gradient fills, custom labels (“Strongly Disagree” to “Strongly Agree”), and animation.

* **Used In**: `LSQDashboardListItem.jsx`

---

 **Home.jsx**

The `Home.jsx` component serves as the landing page for authenticated users. It displays all their created forms, allows them to create, delete, or duplicate forms, and includes user account controls. This component is central to form lifecycle management in the application.

---

###  **`useEffect`**

* **Purpose**: Initializes component state and handles session setup.

* **Functionality**:

  * Executes on component mount.

  * If no user is authenticated, redirects to the login page.

  * Clears any residual `formID` stored in `localStorage`.

  * Sends a request to the backend (`/getAllFormTitlesIDs?userID=...`) to load all form titles and IDs for the logged-in user.

  * Sets the result in `allFormTitlesIDs` state.

---

###  **`handleCreateNewForm`**

* **Purpose**: Creates a new blank form document in the backend.

* **Functionality**:

  * Calls the API: `GET /createNewForm?userID=...`

  * Receives a new `formID` and default structure (including group info).

  * Stores `formID` in `localStorage` for later reference.

  * Redirects the user to the form builder (`/form/:formID`).

* **Used In**: “Create New Form” button on the homepage.

---

###  **`handleDeleteFormListItem`**

* **Purpose**: Deletes a form selected by the user.

* **Functionality**:

  * Sends a `DELETE` request to `/deleteForm/:formID`.

  * If successful:

    * Removes the form from the frontend’s local list (`allFormTitlesIDs`).

    * Triggers a toast notification using Mantine.

  * Displays error if deletion fails.

---

###  **`handleDuplicateFormListItem`**

* **Purpose**: Clones an existing form (structure only, no responses).

* **Functionality**:

  * Sends a `GET` request to `/duplicateForm/:formID`.

  * Receives a newly duplicated form object from the backend.

  * Adds the duplicated form’s ID and title to the state (`allFormTitlesIDs`) to reflect it on the UI.

  * Notifies the user that the form was duplicated.

---

###  **`handleLogOut`**

* **Purpose**: Logs the user out of the application.

* **Functionality**:

  * Calls `logout()` from the `useAuth` context.

  * Redirects to the login page (`/login`) upon successful logout.

---

 **Form.jsx**

The `Form.jsx` component provides the main interface for building and editing survey forms. Users can update the form title and description, manage sections and questions, and perform drag-and-drop operations to reorder questions. It integrates with the backend to fetch and persist form data.

---

###  **`useEffect`**

* **Purpose**: Initializes the form editing interface by loading form data from the backend.

* **Functionality**:

  * Executes on component mount.

  * Verifies that the user is authenticated using `useAuth`.

  * Sends a `GET` request to `/getFormData/:formID` where the `formID` is retrieved from `localStorage`.

  * On success, populates state variables:

    * `formTitle`

    * `formDescription`

    * `formSections` (including all questions)

    * `formGroups` and `formParentGroups`

---

###  **`storeTitleDescription`**

* **Purpose**: Updates the form’s title and description based on user input.

* **Functionality**:

  * Invoked by the `FormTitleDescription` child component.

  * Accepts an array `[title, description]` and updates the local React state.

  * Used to reflect title/description changes in real-time as the user types.

---

###  **`updateQuestion`**

* **Purpose**: Updates a specific question object within its section.

* **Functionality**:

  * Takes a new question object as input.

  * Finds the matching section and replaces the target question with the updated version.

  * Maintains immutability by cloning arrays before modifying state.

---

###  **`handleDragEnd`**

* **Purpose**: Updates question order after drag-and-drop operation completes.

* **Functionality**:

  * Receives a `dragEndEvent` from `DndKit`.

  * Identifies `active` and `over` question IDs.

  * Swaps their positions within the appropriate section.

  * Updates the section state with the reordered question list.

---

###  **`handleDeleteQuestion`**

* **Purpose**: Removes a question from a section.

* **Functionality**:

  * Accepts the `questionID` of the question to be deleted.

  * Iterates through all sections to find and remove the matching question.

  * Updates the state to reflect the change instantly in the form UI.

---

###  **`fetchData`**

* **Purpose**: Sends a request to retrieve the full form definition from the backend.

* **Functionality**:

  * Sends a `GET` request to `/getFormData/:formID`.

  * Parses and loads the response into state variables.

  * Ensures consistency between backend and frontend state upon loading the form.

---

**FormTitleDescription.jsx**

The `FormTitleDescription` component is a lightweight, focused UI element that allows users to update the title and description of their form. It provides real-time updates to parent state through controlled inputs, ensuring a responsive and synchronized editing experience.

---

###  **Functionality Overview**

* **Purpose**: Capture user input for the form’s **title** and **description**, and update the parent component (`Form.jsx`) in real time.

* **Props**:

  * `store`: Callback function passed from `Form.jsx` to update the form title and description in state.

  * `formContent`: An array `[title, description]` representing the current values of the form.

---

###  **Title Field (`TextInput`)**

* **Purpose**: Allows editing of the form title.

* **Functionality**:

  * Uses the first element of `formContent` (`formContent[0]`) as the default value.

  * On change, it calls `store([newTitle, currentDescription])` to update the state in the parent.

  * Configured with:

    * `variant: "filled"`

    * `label: "Title"`

    * `size: "md"`

    * Custom styling for visual consistency.

---

###  **Description Field (`TextInput`)**

* **Purpose**: Allows editing of the form description.

* **Functionality**:

  * Uses the second element of `formContent` (`formContent[1]`) as the default value.

  * On change, it calls `store([currentTitle, newDescription])` to update the state in the parent.

  * Configured with:

    * `variant: "filled"`

    * `label: "Description"`

    * `size: "md"`

    * Similar styling to the title input.

---

###  **Live Feedback & Styling**

* **Behavior**: Changes to title and description propagate instantly to the parent component, ensuring live synchronization between the UI and internal state.

* **UI Library**: Built using `TextInput` from the **Mantine** component library for modern design and accessibility.

---

## **Settings.jsx**

The `Settings.jsx` component provides administrative controls for managing a form’s settings. This includes toggling whether the form is accepting responses, deleting the form entirely, and managing group hierarchies (parent/child groups). It features modal-based interactions for adding new parent groups and uses notifications for user feedback.

---

###  **`useEffect`**

* **Purpose**: Initializes the form settings page with data from the backend.

* **Functionality**:

  * Sends a `GET` request to `/getFormIsAcceptingResponses/:formID` on component mount.

  * Sets the state variable `formIsAcceptingResponses` to reflect the backend flag.

  * Ensures that the toggle switch displays the correct status when the page loads.

---

###  **`handleDeleteForm`**

* **Purpose**: Permanently deletes the current form from the system.

* **Functionality**:

  * Retrieves `formID` from `localStorage`.

  * Sends a `DELETE` request to `/deleteForm/:formID`.

  * On success:

    * Removes `formID` from localStorage.

    * Redirects the user to the homepage.

    * Displays a success notification.

  * On failure, shows an error message.

---

###  **`handleFormIsAcceptingResponses`**

* **Purpose**: Toggles whether the form is open to receiving new submissions.

* **Functionality**:

  * Sends a `POST` request to `/setIsAcceptingResponses` with:

    * `formID`

    * New boolean `formIsAcceptingResponses`

  * Updates the state and UI toggle.

  * Used in real-time scenarios to open/close surveys without deleting them.

---

###  **`handleDeleteParentFormGroup`**

* **Purpose**: Removes a parent group and its associated child group links.

* **Functionality**:

  * Accepts `parentGroupID` as input.

  * Updates the `formParentGroups` state to remove the specified group.

  * Displays a Mantine notification indicating successful deletion.

  * Can also handle state updates for group re-linking, if needed.

---

###  **`handleAddParentFormGroup`**

* **Purpose**: Adds a new parent group to the form.

* **Functionality**:

  * Triggers a `GET` request to `/createNewParentFormGroup/:formID` with a group name from modal input.

  * Appends the new parent group object to `formParentGroups` state.

  * Shows success notification.

  * Supports dynamic parent group creation for more advanced group analysis setups.

---

###  **`handleClose`, `handleOpen`**

* **Purpose**: Toggles visibility of the modal used for adding a new parent group.

* **Functionality**:

  * `handleOpen`: Sets the `open` state to `true`, displaying the modal.

  * `handleClose`: Resets the modal’s state and closes it by setting `open` to `false`.

---

###  **Additional UI Structure**

* Uses Mantine and Material UI components for layout and styling.

* Includes:

  * A toggle switch for response status

  * Accordion layout for parent group management

  * Modal with input and button to add new parent groups

  * Delete button styled for form removal

---

**GroupListItem.jsx**

The `GroupListItem` component manages individual group entries within a form’s group hierarchy. It allows form creators to rename groups, copy shareable links, and delete groups through an intuitive interface. This component is typically rendered inside parent-child group editing structures in `Settings.jsx`.

---

###  **`handleOpen`, `handleClose`**

* **Purpose**: Control the visibility of the modal used to rename a group.

* **Functionality**:

  * `handleOpen`: Sets the `open` state to `true`, making the modal visible.

  * `handleClose`: Resets the modal’s state (clears group name input) and closes the modal by setting `open` to `false`.

---

###  **`handleOnChangeUpdateForm`**

* **Purpose**: Submits the updated group name to the parent form’s state.

* **Functionality**:

  * Accepts the updated `groupName` input from the modal.

  * Constructs a temporary group object with the new name and current group ID.

  * Calls the `updateFormGroup()` function passed as a prop to apply the update in the parent component.

  * Closes the modal after update.

---

###  **Copy Link Logic**

* **Purpose**: Enables users to quickly copy the group’s shareable form link.

* **Functionality**:

  * Uses `navigator.clipboard.writeText()` to copy the `groupLink` string.

  * Displays a success notification (e.g., “Copied\!”) using Mantine or native alerts.

  * Helpful for distributing group-specific response links externally.

---

###  **Delete Logic**

* **Purpose**: Allows removal of a group from the form.

* **Functionality**:

  * On clicking the delete icon:

    * Calls the `handleDeleteFormGroup()` function passed as a prop.

    * Triggers a confirmation and shows a feedback notification.

  * Ensures only valid, unlinkable groups are deleted.

---

###  **UI & Modal Overview**

* **Main Rendered Elements**:

  * Disabled input showing the group’s current name.

  * Icons for:

    *  Edit (opens modal)

    *  Delete

    *  Copy Link

  * Modal with:

    * Editable group name input

    * Confirm button to trigger `handleOnChangeUpdateForm`

* **Styling**:

  * Uses Material UI `Modal`, `Box`, and `TextField`

  * Dynamically styled for dark/light modes

---

**ChildGroupCard.jsx**

The `ChildGroupCard` component is responsible for displaying and managing **child groups** within a parent group in the form structure. It allows form creators to add, edit, and delete child groups interactively. This component works in coordination with `GroupListItem.jsx` and is primarily used inside the `Settings.jsx` panel.

---

###  **`useState`: `groupName`, `filteredGroups`, `open`**

* **`groupName`**

  * **Purpose**: Stores the name of a new child group being added via the modal.

  * **Usage**: Bound to the input field in the modal. Cleared after submission.

* **`filteredGroups`**

  * **Purpose**: Holds the list of child groups linked to the specific parent group.

  * **Usage**: Derived by filtering the full group list and updating in `useEffect`.

* **`open`**

  * **Purpose**: Controls the visibility of the modal for adding a new child group.

  * **Usage**: Set to `true` when the “Add Group” button is clicked and reset to `false` on modal close.

---

###  **`handleOpen`, `handleClose`**

* **`handleOpen()`**

  * **Purpose**: Opens the modal to input a new child group name.

  * **Functionality**: Sets `open = true`.

* **`handleClose()`**

  * **Purpose**: Closes the modal and clears input.

  * **Functionality**:

    * Sets `open = false`

    * Resets `groupName = ""`

---

###  **`useEffect`**

* **Purpose**: Filters and sets the list of child groups associated with the parent group.

* **Functionality**:

  * Runs when either `content` (the full list of groups) or `parentGroup` (current parent group object) changes.

  * Filters `content` to include only those groups whose `groupID` is found inside `parentGroup.childGroups`.

  * Updates the `filteredGroups` state with the result.

* **Effect**: Ensures that only relevant child groups are shown under each parent group dynamically.

---

###  **Additional UI Overview**

* **Child Group List**

  * Rendered using multiple instances of `GroupListItem.jsx`.

  * Each group has options to edit, copy link, or delete.

* **Add Group Modal**

  * Triggered via a button (typically a “+” icon or `Add Group`).

  * Contains:

    * Text input for `groupName`

    * Submit button that triggers the `handleAddFormGroup()` prop method

  * Closed by clicking outside or on cancel.

* **Styling**

  * Modal uses Material UI’s `Box`, `Modal`, and inline styling.

  * Respects dark/light mode styling using theme-aware values.

---

## **Question.jsx**

The `Question.jsx` component acts as a **controller** for rendering specific types of questions within a section. It conditionally loads either MCQ, SAQ, or LSQ components based on the `questionType` field of each question. It also provides UI actions to duplicate or delete a question during form building.

---

###  **`useState`: `questionType`**

* **Purpose**: Tracks the type of the current question being rendered.

* **Functionality**:

  * Initialized from the `questionType` field of the question content passed via props.

  * Updates when the user changes the question type from the dropdown.

  * Dynamically determines which sub-component to render:

    * `1` → `MCQuestion.jsx`

    * `2` → `SAQuestion.jsx`

    * `3` → `LSQuestion.jsx`

---

###  **Conditional Rendering of Question Types**

* **MCQuestion.jsx**

  * Rendered when `questionType === 1`

  * Displays multiple-choice options

  * Allows option reordering and editing

* **SAQuestion.jsx**

  * Rendered when `questionType === 2`

  * Displays short text input preview

* **LSQuestion.jsx**

  * Rendered when `questionType === 3`

  * Displays Likert scale editor with label and range input

Each component receives `content` and `updateQuestion` props for two-way binding with the parent section.

---

###  **`handleDuplicateQuestion`**

* **Purpose**: Triggers duplication of the current question.

* **Functionality**:

  * Calls the `handleDuplicateQuestion` function passed as a prop.

  * Typically clones the question object, assigns a new ID, and appends it to the section.

  * Used when user clicks the “Duplicate” icon in the question toolbar.

  * A notification is shown upon duplication (e.g., via Mantine).

---

###  **`handleDeleteQuestion`**

* **Purpose**: Deletes the current question from its section.

* **Functionality**:

  * Calls the `handleDeleteQuestion` function passed as a prop with the current `questionID`.

  * Used when user clicks the “Delete” icon.

  * Instantly removes the question from the UI and triggers state update in parent.

---

###  **UI Structure**

* **Select Dropdown**: Lets user switch between MCQ, SAQ, and LSQ.

* **Drag Handle**: Provided to enable drag-and-drop reordering via `SortableQuestion.jsx`.

* **Action Buttons**: Includes duplicate and delete icons (typically Material UI IconButtons).

* **Styling**: Modular and responsive, fits cleanly within section editing panel.

---

##  **MCQuestion.jsx**

The `MCQuestion` component handles the creation and editing of **Multiple Choice Questions (MCQs)** within a form. It supports option reordering using drag-and-drop, dynamic addition/removal of options, and real-time synchronization with the parent question state.

---

###  **`useSensors`, `useSortable` (DND-Kit)**

* **Purpose**: Enables interactive drag-and-drop for MCQ options.

* **Functionality**:

  * `useSensors`: Configures the sensors required for pointer and keyboard-based sorting.

  * `useSortable`: Wraps each option in a sortable context.

  * Allows users to reorder MCQ options visually with smooth animations.

  * Drag handles appear next to each option for intuitive UX.

---

###  **`handleDragEnd`**

* **Purpose**: Reorders the MCQ options after a drag operation completes.

* **Functionality**:

  * Triggered by the DND-Kit’s `onDragEnd` event.

  * Retrieves the active and target option IDs.

  * Repositions the options in the internal array.

  * Calls `updateQuestion()` with the updated order to sync with parent.

---

###  **`handleDeleteOption`**

* **Purpose**: Removes a selected option from the MCQ list.

* **Functionality**:

  * Triggered by clicking the delete icon (trash can) next to an option.

  * Filters out the selected option from the array.

  * Updates parent component via `updateQuestion()`.

---

###  **`handleOptionChange`**

* **Purpose**: Updates the text of a specific MCQ option.

* **Functionality**:

  * Triggered on input change for an option’s value.

  * Identifies the option using its unique `optionID`.

  * Updates its `optionValue` with the new input.

  * Sends updated question object to parent for re-render.

---

###  **`handleAddOption`**

* **Purpose**: Appends a new option to the MCQ.

* **Functionality**:

  * Triggered when the user clicks an “Add Option” area or placeholder.

  * Generates a unique `optionID` for the new option.

  * Adds a new object `{ optionID, optionValue: "" }` to the list.

  * Immediately updates parent state via `updateQuestion()`.

---

###  **UI Structure**

* **Input Field**: One for the MCQ question text.

* **SortableOption Components**: Each option is wrapped in a draggable container using `SortableOption.jsx`.

* **Add Option Field**: Styled as a non-editable input that acts as a button.

* **Drag Handles**: Rendered next to each option using sortable props.

* **Styling**:

  * Clean, accessible, and mobile-responsive.

  * Uses Mantine’s `TextInput` and custom CSS.

---

## **LSQuestion.jsx**

The `LSQuestion` component allows users to create and configure **Likert Scale Questions (LSQ)** within a survey form. It supports defining the scale size (e.g., 1–5, 1–7), assigning custom labels to each point, and provides a live preview using a radio group.

---

###  **Input for Likert Question Text**

* **Purpose**: Captures the main text of the Likert scale question.

* **Functionality**:

  * Uses `TextInput` from Mantine to collect the user-defined question.

  * On change, updates the `question` property inside the local `lsQuestion` object.

  * Triggers `updateQuestion(lsQuestion)` to sync the changes with the parent component.

---

###  **`Select` for `upperLimit`**

* **Purpose**: Defines how many points the Likert scale should have (e.g., 1–5).

* **Functionality**:

  * Renders a dropdown selection (e.g., values 3, 5, 7).

  * On change:

    * Updates the `upperLimit` value in the `lsQuestion` object.

    * Initializes or resets the `labels[]` array with that many empty strings.

    * Calls `updateQuestion(lsQuestion)` to sync updates.

* **Behavior**:

  * Changing the scale size clears old labels and requires user re-entry.

---

###  **Input Fields for Custom Labels**

* **Purpose**: Lets users name each point on the Likert scale.

* **Functionality**:

  * For each label index (from 0 to `upperLimit - 1`), renders a `TextInput` field.

  * On typing, updates the corresponding index in the `labels[]` array.

  * All changes are sent upward via `updateQuestion()`.

* **Use Case**: Allows full customization such as:

  * 1 \= "Strongly Disagree", 5 \= "Strongly Agree"

  * 1 \= "Low", 5 \= "High"

---

###  **Radio Group Preview**

* **Purpose**: Provides a visual representation of how the Likert question will appear to respondents.

* **Functionality**:

  * Renders a horizontal row of radio buttons.

  * Each radio button:

    * Displays a label from `labels[]`, or falls back to its number if the label is blank.

    * Is disabled (read-only), used for preview only.

* **Implementation**: Uses Mantine’s `<Radio.Group>` and `<Radio>` components inside a `<Group>` layout for even spacing.

---

###  **UI & Behavior Summary**

* **Live Update**: Every input is connected to the parent via `updateQuestion()`.

* **Validation**: Can enforce minimum scale size or limit characters in labels.

* **Styling**:

  * Responsive and consistent with other question editors (MCQ, SAQ).

  * Aligns with form builder layout in `Form.jsx`.

---

## **SAQuestion.jsx**

The `SAQuestion` component is used to create and edit **Short Answer Questions (SAQ)** within the form builder. It provides a simple interface for setting the prompt text and displays a non-editable preview of the expected input field for respondents.

---

###  **Input Field for Question Prompt**

* **Purpose**: Allows the form creator to define the short answer question text.

* **Functionality**:

  * Uses a `TextInput` field from **Mantine**.

  * Binds to the `question` property of the `saQuestion` object.

  * On change:

    * Updates the question text in the local `saQuestion` object.

    * Triggers `updateQuestion(saQuestion)` to sync with the parent component.

* **Example**: `"What is your favorite book?"` or `"Any additional comments?"`

---

###  **Preview of Short Answer Input**

* **Purpose**: Visually represents how the question will appear to respondents.

* **Functionality**:

  * Renders a second `TextInput` field marked as **disabled** and **read-only**.

  * Serves as a mock input box to simulate the short answer response field.

* **Note**: The preview field does not capture or affect state — it’s purely for visual reference.

---

###  **Component Behavior**

* **Real-Time Sync**: All changes are immediately pushed to the parent form state via `updateQuestion()`.

* **Minimalist Design**: Simple and clean layout ensures users focus on question clarity.

* **Consistency**: Styled uniformly with other question editors (MCQ, LSQ) for a cohesive UI experience.

---

**UserForm.jsx**

The `UserForm.jsx` component renders the **public-facing survey form** that respondents interact with. It dynamically loads the form’s structure using `formID` and `groupID`, renders the appropriate question types, and captures user responses before submitting them to the backend.

---

###  **`useParams`**

* **Purpose**: Retrieves URL parameters to identify which form and group the respondent is accessing.

* **Functionality**:

  * Extracts `formID` and `groupID` from the URL using React Router’s `useParams()` hook.

  * These are essential for fetching the correct form structure and linking responses to the appropriate group.

---

###  **`useEffect`**

* **Purpose**: Initializes form data for the respondent view.

* **Functionality**:

  * Runs once on mount.

  * Sends a `GET` request to `/getFormData/:formID` to fetch:

    * Title, description

    * Sections and questions

    * Acceptance status

  * If `formIsAcceptingResponses === false`, redirects to the **NAResponses** page.

  * Populates `formData`, `questions`, and `formResponse` state variables.

---

###  **`fetchData`**

* **Purpose**: Asynchronously retrieves full form structure and metadata.

* **Functionality**:

  * Makes API call to `/getFormData/:formID`.

  * Stores the results in:

    * `formData` → Title and description

    * `questions` → Full list of questions across all sections

    * `formResponse` → Prepares an object that includes:

      * Unique `userResponseID`

      * `userGroupID`

      * An empty `userResponse` array

---

###  **`updateUserResponse`**

* **Purpose**: Adds or updates a respondent’s answer to a specific question.

* **Functionality**:

  * Accepts an object with `{ questionID, answer }`.

  * Removes any existing answer for the same `questionID`.

  * Appends the new answer to the `formResponse.userResponse` array.

  * Keeps the response list clean and free of duplicates.

---

###  **`handleSubmit`**

* **Purpose**: Submits the full set of user responses to the backend.

* **Functionality**:

  * Sends a `POST` request to `/saveUserFormResponse`.

  * Payload includes the full `formResponse` object.

  * On success:

    * Redirects to the **ResponseSubmitted** page.

    * Appends `formTitle`, `formID`, and `groupID` as query params in the URL.

---

###  **UI Structure**

* **Form Header**: Displays `formTitle` and `formDescription`.

* **Question Renderer**:

  * Iterates through `questions[]`

  * Based on `questionType`, renders:

    * `UserFormMCQ.jsx`

    * `UserFormSAQ.jsx`

    * `UserFormLSQ.jsx`

* **Submit Button**:

  * Sends all collected answers using `handleSubmit`.

---

**UserFormMCQ.jsx / UserFormSAQ.jsx / UserFormLSQ.jsx**

These components are responsible for rendering **individual survey questions** of type **Multiple Choice (MCQ)**, **Short Answer (SAQ)**, or **Likert Scale (LSQ)** in the public-facing user form. They allow respondents to input their answers and communicate changes to the parent component (`UserForm.jsx`).

---

###  **`handleUpdateUserResponse`**

* **Purpose**: Called when the respondent selects or types an answer.

* **Functionality**:

  * Constructs a response object:  
     `{ questionID, answer }`

  * Passes it to the parent via the `updateUserResponse()` prop.

  * Ensures every response is tied to the correct `questionID`.

---

##  **UserFormMCQ.jsx**

* **Component Role**: Displays MCQ-style questions with radio buttons.

* **UI Elements**:

  * `Question Text`: Rendered at the top.

  * `Radio.Group`: Contains options from the `options[]` array.

  * Each radio button is labeled with `optionValue`.

* **Interaction**:

  * Selecting a radio option triggers `handleUpdateUserResponse`.

---

##  **UserFormSAQ.jsx**

* **Component Role**: Displays open-ended short answer questions.

* **UI Elements**:

  * `Question Text`: Rendered at the top.

  * `TextInput`: For free-form text response.

* **Interaction**:

  * Typing into the input field triggers `handleUpdateUserResponse`.

---

##  **UserFormLSQ.jsx**

* **Component Role**: Displays Likert scale questions using labeled radio groups.

* **UI Elements**:

  * `Question Text`: Rendered at the top.

  * `Radio.Group`: Renders `n` radio buttons, based on `upperLimit`.

  * Each button shows a label from `labels[]`, or falls back to a number if label is missing.

* **Interaction**:

  * Selecting a scale point triggers `handleUpdateUserResponse`.

---

## **ResponseSubmitted.jsx**

The `ResponseSubmitted.jsx` component is displayed after a respondent submits a form. It confirms successful submission and provides a link to re-submit the form (if desired). This screen personalizes the response experience by displaying form-specific metadata using URL parameters.

---

###  **`useLocation`**

* **Purpose**: Retrieves the full location object from the browser’s current URL.

* **Functionality**:

  * Used to access query parameters (e.g., `?title=...&id=...&groupID=...`).

  * Enables form-specific confirmation messages and actions.

---

###  **`qParams`**

* **Purpose**: Parses query parameters from the URL string.

* **Functionality**:

  * Uses `URLSearchParams` to extract:

    * `formTitle` → Displayed as the submitted form’s name

    * `formID` → Used to build a return link

    * `formGroupID` → Maintains group context for follow-up responses

---

###  **Rendered Content**

* **Header Section**:

  * Displays the submitted form’s title.

  * Acknowledges successful submission.

* **Description Message**:

  * A thank-you or acknowledgment message (static).

  * Optionally customized to reflect organization branding.

* **Return Link**:

  * Shows a link that allows the user to **submit another response**.

  * Constructed using:  
     `${CLIENT_BASE_URL}/#/userform/${formID}/${formGroupID}`

  * Preserves original group association.

---

###  **Styling & Layout**

* **Wrapper Div**: Encapsulates the layout and centers content.

* **Consistent UI**: Styled similarly to `NAResponses` for a seamless user experience.

* **Lightweight & Instant**: Loads quickly with minimal logic post-submission.

---

## **NAResponses.jsx**

The `NAResponses.jsx` component serves as a fallback screen shown to users when a form is **not currently accepting responses**. It uses query parameters to personalize the message, indicating which form is closed and why the user cannot proceed further.

---

###  **`useLocation`**

* **Purpose**: Accesses the full URL of the current route.

* **Functionality**:

  * Captures the query string containing form metadata.

  * Enables contextual display of the form title or other relevant info.

---

###  **`qParams` (`URLSearchParams`)**

* **Purpose**: Extracts specific parameters from the URL to personalize the screen.

* **Functionality**:

  * Reads:

    * `formTitle`: The title of the form (e.g., "Course Feedback Survey")

  * This is then displayed to let users know which form they attempted to access.

---

###  **Rendered Content**

* **Header Section**:

  * Shows the form title retrieved from the query parameter.

  * Helps clarify which survey is unavailable.

* **Message Area**:

  * Static message like:

     “This form is no longer accepting responses.”

  * Designed to inform without implying user error.

* **Optional**: Can be extended in the future to include:

  * Admin contact information

  * Reopen timestamps

  * Return to home link

---

###  **Styling & Behavior**

* **Minimal Design**: Clean layout focused on clarity.

* **Consistent UX**: Shares structure and styling with `ResponseSubmitted.jsx`.

* **Immediate Load**: No API calls; all data is pulled from the URL.

---

## **Final Conclusion**

This documentation presents a complete and detailed breakdown of the **Spring 2025 version** of our **Form Management System** — a full-stack, survey-based web application built using **MERN stack** technologies (MongoDB, Express, React, Node.js).

Compared to the previous version, this release introduces a series of **critical enhancements**:

*  **Advanced Dashboard Analytics**  
   Enhanced visualizations for MCQ, SAQ, and LSQ questions using bar charts, pie charts, and gauges. Includes comparison mode across respondent groups.

*  **AI-Powered Insights**  
   A built-in chatbot (`ChatWindow.jsx`) powered by **Groq’s LLaMA 3.3 model** offers instant, contextual interpretations of survey results.

*  **Export Capabilities**  
   Users can now download raw responses (CSV), section summaries (PDF), or complete dashboards (consolidated PDF) for reporting and analysis.

*  **Form Customization Features**  
   Each form or group can have its own theme, including custom fonts and colors. Forms can now also be temporarily closed via an expiry toggle.

*  **Smart SAQ Word Clouds**  
   Short answer questions benefit from keyword extraction (via `compromise`) and sentiment breakdown, making qualitative data more meaningful.

*  **Stable and Scalable Architecture**  
   All endpoints, components, and schemas have been modularized, tested, and aligned for scalability and long-term maintainability.

Throughout this documentation, every function, method, route, and UI element has been covered in detail — ensuring the system is **transparent, developer-friendly, and extensible**.

---

