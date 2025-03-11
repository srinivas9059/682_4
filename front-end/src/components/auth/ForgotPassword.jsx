import React, { useRef, useState, useEffect } from "react";
import { Form, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }
    setLoading(false);
  }

  return (
    <div className="forgot-password-page-complete">
      <nav className="navbar nav-custom-home-page">
        <div className="container-fluid">
          <a className="navbar-brand d-flex app-logo" href="/">
            <TextSnippetRoundedIcon className="m-1" />
            <span className="fs-4 ms-1">Forms</span>
          </a>
        </div>
      </nav>
      <div className="forgot-password-page">
        <div className="forgot-password-card">
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Password Reset</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="p-2">
                  <Form.Label className="text-secondary">Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <div className="text-center mt-4">
                  <Button
                    variant="filled"
                    disabled={loading}
                    className="w-75 text-black"
                    type="submit"
                    color="#edbb5f"
                  >
                    Reset Password
                  </Button>
                </div>
              </Form>
              <div className="w-100 text-center mt-5">
                <Link to="/login" className="text-info-emphasis">
                  Login
                </Link>
              </div>
              <div className="w-100 text-center mt-3">
                Need an account?{" "}
                <Link to="/signup" className="text-info-emphasis">
                  Sign Up
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
