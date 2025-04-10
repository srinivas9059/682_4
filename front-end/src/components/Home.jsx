import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import { useNavigate, Link } from "react-router-dom";
>>>>>>> srinivas-backendd
import FormListItem from "./FormListItem";
import { useAuth } from "../contexts/AuthContext";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AccountMenu from "./AccountMenu";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";

function Home() {
  const [allFormTitlesIDs, setAllFormTitlesIDs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
<<<<<<< HEAD
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (!currentUser) navigate("/login");
    localStorage.removeItem("formID");
    const fetchData = async () => {
      const response = await fetch(
        `${BACKEND_URL}/getAllFormTitlesIDs?userID=${
          currentUser && currentUser.uid
        }`,
        {
          method: "GET",
        }
      );
      const json = await response.json();
      setAllFormTitlesIDs(json.allFormTitlesIDs);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleCreateNewForm = async () => {
    const response = await fetch(
      `${BACKEND_URL}/createNewForm?userID=${currentUser.uid}`,
      {
        method: "GET",
      }
    );
    const json = await response.json();
    if (response.ok) {
      localStorage.setItem("formID", json.form.formID);
      navigate(`/form/${json.form.formID}`);
    } else console.log(json);
=======
  const auth = useAuth();
  
  // If auth is not yet initialized, show loading
  if (!auth) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <div className="loading-text">Please wait few moments ...</div>
      </div>
    );
  }
  
  const { currentUser, loading, logout } = auth;

  // Fetch forms data
  const fetchFormsData = async () => {
    if (!currentUser?.uid) return;
    
    try {
      const response = await fetch(
        `${BACKEND_URL}/getAllFormTitlesIDs?userID=${currentUser.uid}`
      );
      const json = await response.json();
      setAllFormTitlesIDs(json.allFormTitlesIDs);
    } catch (err) {
      console.error("Error fetching forms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle auth state and data fetching
  useEffect(() => {
    if (loading) return;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    localStorage.removeItem("formID");
    fetchFormsData();
  }, [currentUser, loading, navigate]);

  // Handle home navigation
  const handleHomeNavigation = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsLoading(true);
    await fetchFormsData();
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <div className="loading-text">Please wait few moments ...</div>
      </div>
    );
  }

  const handleCreateNewForm = async () => {
    try {
      const defaultTitle = "Untitled Form";
      const response = await fetch(
        `${BACKEND_URL}/createNewForm?userID=${
          currentUser.uid
        }&formTitle=${encodeURIComponent(defaultTitle)}`
      );
      const json = await response.json();
      if (response.ok && json?.form?.formID) {
        localStorage.setItem("formID", json.form.formID);
        navigate(`/form/${json.form.formID}`);
      } else {
        console.error("Failed to create form", json);
      }
    } catch (err) {
      console.error("Error creating form:", err);
    }
>>>>>>> srinivas-backendd
  };

  const handleDeleteFormListItem = async (id) => {
    localStorage.removeItem("formID");
    const response = await fetch(`${BACKEND_URL}/deleteForm/${id}`, {
      method: "DELETE",
    });
    const json = await response.json();
    if (response.ok) {
<<<<<<< HEAD
      setAllFormTitlesIDs((titles) => {
        const newTitles = titles.filter((t) => t.formID !== id);
        return newTitles;
      });
=======
      setAllFormTitlesIDs((titles) => titles.filter((t) => t.formID !== id));
>>>>>>> srinivas-backendd
    } else console.log(json.msg);
  };

  const handleDuplicateFormListItem = async (id) => {
<<<<<<< HEAD
    const response = await fetch(`${BACKEND_URL}/duplicateForm/${id}`, {
      method: "GET",
    });
    const json = await response.json();
    if (response.ok) {
      setAllFormTitlesIDs((titles) => {
        const newTitles = [...titles, json.form];
        return newTitles;
      });
=======
    const response = await fetch(`${BACKEND_URL}/duplicateForm/${id}`);
    const json = await response.json();
    if (response.ok) {
      setAllFormTitlesIDs((titles) => [...titles, json.form]);
>>>>>>> srinivas-backendd
    } else console.log(json.msg);
  };

  const handleLogOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Cannot log out !");
    }
  };

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Please wait few moments ...</div>
        </div>
      )}
      <div className="home-page">
        <nav className="navbar nav-custom-home-page">
          <div className="container-fluid">
<<<<<<< HEAD
            <a className="navbar-brand d-flex app-logo" href="/">
              <TextSnippetRoundedIcon className="m-1" />
              <span className="fs-4 ms-1">Forms</span>
            </a>
=======
            <button 
              className="navbar-brand d-flex app-logo border-0 bg-transparent"
              onClick={handleHomeNavigation}
              style={{ cursor: 'pointer', color: '#edbb5f' }}
            >
              <TextSnippetRoundedIcon className="m-1" />
              <span className="fs-4 ms-1">Forms</span>
            </button>
>>>>>>> srinivas-backendd
            <div className="email-and-logout-div">
              <div>
                <AccountMenu handleLogOut={handleLogOut} />
              </div>
            </div>
          </div>
        </nav>
<<<<<<< HEAD
=======

>>>>>>> srinivas-backendd
        <section className="create-new-form border-bottom border-dark-subtle">
          <div className="create-new-form-div">
            <div className="pb-3">Start a new form</div>
            <div className="create-new-form-card" onClick={handleCreateNewForm}>
              <Card
                className="w-100 h-100 d-flex align-items-center justify-content-center"
                sx={{ bgcolor: "#fff" }}
              >
                <CardContent>
                  <NoteAddIcon id="create-new-form-note-add-icon" />
                </CardContent>
              </Card>
            </div>
<<<<<<< HEAD
            {/* <Button
              variant="contained"
              disabled={isLoading}
              onClick={handleCreateNewForm}
            >
              <NoteAddIcon className="me-1" />
              Create new form
            </Button> */}
          </div>
        </section>
=======
          </div>
        </section>

>>>>>>> srinivas-backendd
        <section className="all-forms-list-section">
          <div className="all-forms-heading poppins-semibold">All forms</div>
          <div className="all-forms-list">
            {allFormTitlesIDs.map((form, index) => (
              <FormListItem
                key={index}
                title={form.formTitle}
                id={form.formID}
                handleDeleteFormListItem={handleDeleteFormListItem}
                handleDuplicateFormListItem={handleDuplicateFormListItem}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
