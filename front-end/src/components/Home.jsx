import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
  
    localStorage.removeItem("formID");
  
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/getAllFormTitles`);
        const json = await response.json();
        setAllFormTitlesIDs(json); // No `.allFormTitlesIDs` anymore
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching form titles:", error);
        setIsLoading(false);
      }
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
  };

  const handleDeleteFormListItem = async (id) => {
    localStorage.removeItem("formID");
    const response = await fetch(`${BACKEND_URL}/deleteForm/${id}`, {
      method: "DELETE",
    });
    const json = await response.json();
    if (response.ok) {
      setAllFormTitlesIDs((titles) => {
        const newTitles = titles.filter((t) => t.formID !== id);
        return newTitles;
      });
    } else console.log(json.msg);
  };

  const handleDuplicateFormListItem = async (id) => {
    const response = await fetch(`${BACKEND_URL}/duplicateForm/${id}`, {
      method: "GET",
    });
    const json = await response.json();
    if (response.ok) {
      setAllFormTitlesIDs((titles) => {
        const newTitles = [...titles, json.form];
        return newTitles;
      });
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
            <a className="navbar-brand d-flex app-logo" href="/">
              <TextSnippetRoundedIcon className="m-1" />
              <span className="fs-4 ms-1">Forms</span>
            </a>
            <div className="email-and-logout-div">
              <div>
                <AccountMenu handleLogOut={handleLogOut} />
              </div>
            </div>
          </div>
        </nav>
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
