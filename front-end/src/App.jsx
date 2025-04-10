import LinkExpired from "./components/LinkExpired"; 
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Form from "./components/Form";
import "./App.css";
import UserForm from "./components/UserForm";
import NAResponses from "./components/NAResponses";
import ResponseSubmitted from "./components/ResponseSubmitted";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/auth/Login";
import Signup from "./components/auth/SignUp";
import UpdateProfile from "./components/auth/UpdateProfile";
import ForgotPassword from "./components/auth/ForgotPassword";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

function App() {
  return (
    <>
      <HashRouter>
        <AuthProvider>
          <MantineProvider>
            <Notifications />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Home />} />
              <Route path="/form/:id" element={<Form />} />
              <Route path="/userform/:formID/:groupID" element={<UserForm />} />
              <Route path="/linkExpired" element={<LinkExpired />} />
              <Route
                path="/notAcceptingFormResponses"
                element={<NAResponses />}
              />
              <Route
                path="/formResponseSubmitted"
                element={<ResponseSubmitted />}
              />
              <Route path="/updateProfile" element={<UpdateProfile />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
            </Routes>
          </MantineProvider>
        </AuthProvider>
      </HashRouter>
    </>
  );
}

export default App;
