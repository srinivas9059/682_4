import { useEffect, useRef, useState } from "react";
import { Form, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import { Button } from "@mantine/core";
import googleLogo from "../../assets/google-logo.jpg";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser, signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (currentUser) navigate("/");
    const pingBackendServer = async () => {
      const response = await fetch(`${BACKEND_URL}/ping`, {});
      const json = await response.json();
    };
    pingBackendServer();
  }, [currentUser]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("Failed to log in");
    }
    setLoading(false);
  }

  async function handleSignInWithGoogle(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("Failed to log in");
    }
    setLoading(false);
  }

  return (
    <div className="login-page-complete">
      {/* <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src={logo}
              alt="Logo"
              width="30"
              height="24"
              className="d-inline-block align-text-top"
            />
            Forms Project
          </a>
        </div>
      </nav> */}
      <nav className="navbar nav-custom-home-page">
        <div className="container-fluid">
          <a className="navbar-brand d-flex app-logo" href="/">
            <TextSnippetRoundedIcon className="m-1" />
            <span className="fs-4 ms-1">Forms</span>
          </a>
        </div>
      </nav>
      <div className="login-page">
        <div className="login-card">
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="p-2">
                  <Form.Label className="text-secondary">Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password" className="p-2">
                  <Form.Label className="text-secondary">Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <div className="text-center mt-3">
                  <Button
                    variant="filled"
                    disabled={loading}
                    className="w-75 text-black"
                    type="submit"
                    color="#edbb5f"
                  >
                    Login
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <Button
                    variant="light"
                    disabled={loading}
                    className="w-75"
                    color="#edbb5f"
                    id="google-btn"
                    onClick={handleSignInWithGoogle}
                  >
                    <img
                      src={googleLogo}
                      alt="Google"
                      width={40}
                      height={30}
                      className="me-2 rounded-pill"
                    />
                    <span>Continue with Google</span>
                  </Button>
                </div>
              </Form>
              <div className="w-100 text-center mt-5 mb-3">
                Need an account?{" "}
                <Link to="/signup" className="text-info-emphasis">
                  Sign Up
                </Link>
              </div>
              <div className="w-100 mt-5">
                <Link to="/forgotPassword" className="text-info-emphasis">
                  Forgot Password?
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
