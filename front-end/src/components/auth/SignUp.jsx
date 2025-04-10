import { useRef, useState, useEffect } from "react";
import { Form, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import { Button } from "@mantine/core";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(
        "Failed to create an account (Password must contain atleast 6 characters)"
      );
    }
    setLoading(false);
  }

  return (
    <div className="signup-page-complete">
      <nav className="navbar nav-custom-home-page">
        <div className="container-fluid">
          <a className="navbar-brand d-flex app-logo" href="/">
            <TextSnippetRoundedIcon className="m-1" />
            <span className="fs-4 ms-1">Forms</span>
          </a>
        </div>
      </nav>
      <div className="signup-page">
        <div className="signup-card">
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
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
                <Form.Group id="password-confirm" className="p-2">
                  <Form.Label className="text-secondary">
                    Password Confirmation
                  </Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    required
                  />
                </Form.Group>
                <div className="text-center mt-3">
                  <Button
                    variant="filled"
                    disabled={loading}
                    className="w-75 text-black"
                    type="submit"
                    color="#edbb5f"
                  >
                    Sign up
                  </Button>
                </div>
              </Form>
              <div className="w-100 text-center mt-5">
                Already have an account?{" "}
                <Link to="/login" className="text-info-emphasis">
                  Log In
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
