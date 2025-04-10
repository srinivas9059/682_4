import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch, ThemeProvider, createTheme } from "@mui/material";
import { Button } from "@mui/material";
import GroupCard from "./GroupCard";

function Settings({
  content,
  updateFormGroup,
  updateFormParentGroup,
  handleDeleteFormGroup,
  handleAddFormGroup,
  formParentGroups,
  handleAddParentFormGroup,
  handleDeleteParentFormGroup,
  handleAddChildFormGroup,
}) {
  const navigate = useNavigate();
  const [formIsAcceptingResponses, setFormIsAcceptingResponses] =
    useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  console.log("formParentGroups in Settings", formParentGroups);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#edbb5f",
        contrastText: "#000000",
      },
    },
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${BACKEND_URL}/getFormIsAcceptingResponses/${localStorage.getItem(
          "formID"
        )}`,
        { method: "GET" }
      );
      const json = await response.json();
      setFormIsAcceptingResponses(json.formIsAcceptingResponses);
    };
    fetchData();
  }, []);

  const handleDeleteForm = async () => {
    const id = localStorage.getItem("formID");
    const response = await fetch(`${BACKEND_URL}/deleteForm/${id}`, {
      method: "DELETE",
    });
    const json = await response.json();
    localStorage.removeItem("formID");
    navigate("/");
  };

  const handleFormIsAcceptingResponses = async (formIsAcceptingResponses) => {
    setFormIsAcceptingResponses(formIsAcceptingResponses);
    const id = localStorage.getItem("formID");
    const response = await fetch(`${BACKEND_URL}/setIsAcceptingResponses`, {
      method: "POST",
      body: JSON.stringify({
        formID: id,
        formIsAcceptingResponses: formIsAcceptingResponses,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
  };

  return (
    <div className="settings-page">
      <div className="settings-top-part">
        <div className="settings-page-inner">
          <div className="settings-heading">Settings</div>
          <div className="settings-divider"></div>
          <div className="d-flex justify-content-between align-items-center accepting-responses-div">
            <div>Accepting Responses</div>
            <ThemeProvider theme={theme}>
              <Switch
                color="primary"
                onChange={(e) =>
                  handleFormIsAcceptingResponses(e.target.checked)
                }
                checked={formIsAcceptingResponses}
              />
            </ThemeProvider>
          </div>
        </div>
      </div>
<<<<<<< HEAD
=======

>>>>>>> srinivas-backendd
      <GroupCard
        formParentGroup={formParentGroups}
        handleAddParentFormGroup={handleAddParentFormGroup}
        handleDeleteParentFormGroup={handleDeleteParentFormGroup}
        content={content}
        handleAddFormGroup={handleAddFormGroup}
        handleDeleteFormGroup={handleDeleteFormGroup}
        updateFormGroup={updateFormGroup}
        handleAddChildFormGroup={handleAddChildFormGroup}
        updateFormParentGroup={updateFormParentGroup}
<<<<<<< HEAD
      ></GroupCard>
=======
      />

>>>>>>> srinivas-backendd
      <div className="settings-delete-form-part">
        <div className="settings-page-delete-form-inner">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleDeleteForm}
          >
            Delete Form
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
