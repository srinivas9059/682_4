import { useRef, useState, useEffect } from "react";
import { Form, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updatePassword, deleteAccount } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser]);

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    const promises = [];
    setLoading(true);
    setError("");
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }
    Promise.all(promises)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${BACKEND_URL}/getAllFormTitlesIDs?userID=${currentUser.uid}`,
      {
        method: "GET",
      }
    );
    const json = await response.json();
    if (response.ok) {
      if (json.allFormTitlesIDs.length !== 0)
        return setError("Delete all forms before deleting the account !");
    } else {
      console.log(json);
      return;
    }
    const promises = [];
    setLoading(true);
    setError("");
    promises.push(deleteAccount());
    Promise.all(promises)
      .then(() => {
        alert("Account Deleted successfully !");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to Delete account");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="update-profile-page-complete">
      <nav className="navbar nav-custom-home-page">
        <div className="container-fluid">
          <a className="navbar-brand d-flex app-logo" href="/">
            <TextSnippetRoundedIcon className="m-1" />
            <span className="fs-4 ms-1">Forms</span>
          </a>
        </div>
      </nav>
      <div className="update-profile-page">
        <div className="update-profile-card">
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Update Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="p-2">
                  <Form.Label className="text-secondary">Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    required
                    defaultValue={currentUser && currentUser.email}
                    disabled={true}
                  />
                </Form.Group>
                <Form.Group id="password" className="p-2">
                  <Form.Label className="text-secondary">
                    New Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    //   placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Form.Group id="password-confirm" className="p-2">
                  <Form.Label className="text-secondary">
                    New Password Confirmation
                  </Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    //   placeholder="Leave blank to keep the same"
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
                    Update
                  </Button>
                </div>
                <div className="text-center mt-3">
                  <Button
                    variant="filled"
                    disabled={loading}
                    className="w-75"
                    color="#333333"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </div>
              </Form>
              <div className="w-100 text-center mt-5">
                <Link to="/" className="text-info-emphasis">
                  Cancel
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
