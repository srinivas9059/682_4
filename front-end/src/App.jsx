import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/auth/Login";
import Signup from "./components/auth/SignUp";
import UpdateProfile from "./components/auth/UpdateProfile";
import ForgotPassword from "./components/auth/ForgotPassword";
import Home from "./components/Home";
import Form from "./components/Form";
import SessionManager from "./components/SessionManager";
import UserForm from "./components/UserForm";
import NAResponses from "./components/NAResponses";
import ResponseSubmitted from "./components/ResponseSubmitted";
import DarkModeToggle from "./components/DarkModeToggle";

function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: "blue",
        defaultRadius: "md",
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications
        position="top-right"
        limit={3}
        autoClose={2500}
        containerWidth={300}
      />
      <AuthProvider>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <DarkModeToggle /> {/* ✅ Dark mode toggle inserted here */}
          <SessionManager />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/form/:formID" element={<Form />} />
            <Route path="/userform/:formID/:groupID" element={<UserForm />} />
            <Route
              path="/notAcceptingFormResponses"
              element={<NAResponses />}
            />
            <Route
              path="/formResponseSubmitted"
              element={<ResponseSubmitted />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
