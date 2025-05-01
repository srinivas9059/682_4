import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch, ThemeProvider, createTheme } from "@mui/material";
import { Button } from "@mui/material";
import GroupCard from "./GroupCard";
import { notifications } from "@mantine/notifications";
import { Tooltip } from "@mui/material";


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
  refreshDashboardData,
}) {
  
  const navigate = useNavigate();
  const [formIsAcceptingResponses, setFormIsAcceptingResponses] = useState(true);
  const [extendDurations, setExtendDurations] = useState({});
  const [tick, setTick] = useState(0); // used to force re-render every minute
  const [extendingGroupID, setExtendingGroupID] = useState(null);

  

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getRemainingMinutes = (expiresAt) => {
    if (!expiresAt) return "🟢 Never Expires";
    const diff = new Date(expiresAt) - new Date();
    if (diff <= 0) return "🔴 Expired";
    return `🕒 Expires in ${Math.ceil(diff / 60000)} mins`;
  };

  useEffect(() => {
    const formID = localStorage.getItem("formID");
  
    if (!formID) {
      console.error("Form ID is missing in localStorage");
      return;
    }
  
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/getFormIsAcceptingResponses/${formID}`);
        const json = await response.json();
        setFormIsAcceptingResponses(json.formIsAcceptingResponses);
      } catch (error) {
        console.error("Error fetching accepting responses status:", error);
      }
    };
  
    fetchData();
  
    const interval = setInterval(() => {
      setTick((prev) => prev + 1); // force re-render every minute
    }, 60000);
  
    return () => clearInterval(interval);  // 🛡️ Clear timer properly
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
  
    try {
      const response = await fetch(`${BACKEND_URL}/setIsAcceptingResponses`, {
        method: "POST",
        body: JSON.stringify({
          formID: id,
          formIsAcceptingResponses: formIsAcceptingResponses,
        }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to update accepting responses.");
      }
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Could not update accepting responses. Please try again.",
        color: "red",
        autoClose: 3000,
      });
      // revert the toggle if API fails
      setFormIsAcceptingResponses(!formIsAcceptingResponses);
    }
  };
  

  const handleExtendExpiry = async (groupID, formID) => {
    const duration = extendDurations[groupID];
  
    // Ensure both formID and groupID are valid
    if (!formID || !groupID) {
      notifications.show({
        title: "Extension Failed",
        message: "Cannot extend. Your session has expired. Please refresh.",
        color: "red",
        autoClose: 4000,
      });
      return;
    }
  
    // Ensure duration is valid
    if (!duration || isNaN(duration) || parseInt(duration) <= 0) {
      notifications.show({
        title: "Invalid Duration",
        message: "Please enter a valid number of minutes.",
        color: "red",
        autoClose: 3000,
      });
      return;
    }
  
    // Start a spinner or loading state while we extend the expiry
    setExtendingGroupID(groupID);
  
    try {
      // API call to extend expiry
      const response = await fetch(`${BACKEND_URL}/extendGroupExpiry/${formID}/${groupID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extendByMinutes: parseInt(duration) }),
      });
  
      // Get the JSON response
      const json = await response.json();
  
      if (response.ok) {
        notifications.show({
          title: "Success",
          message: `Expiry extended by ${duration} minutes!`,
          color: "green",
          autoClose: 3000,
        });
  
        // Remove expired status from localStorage after extension
        localStorage.removeItem("expiredGroupID");
  
        // Redirect the user to the form page (not expired page)
        const lastVisitedFormID = localStorage.getItem("lastVisitedFormID");
        const lastVisitedGroupID = localStorage.getItem("lastVisitedGroupID");
  
        if (lastVisitedFormID && lastVisitedGroupID) {
          window.location.href = `/#/userform/${lastVisitedFormID}/${lastVisitedGroupID}`;
        }
  
        // Refresh dashboard to reflect the updated expiry
        if (typeof refreshDashboardData === "function") {
          refreshDashboardData();
        }
  
        // Clear the duration input
        setExtendDurations((prev) => ({ ...prev, [groupID]: "" }));
  
      } else {
        notifications.show({
          title: "Error",
          message: json.msg || "Extension failed.",
          color: "red",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error",
        message: "An error occurred while extending expiry.",
        color: "red",
        autoClose: 3000,
      });
    } finally {
      // Stop spinner or loading state
      setExtendingGroupID(null);
    }
  };
  
  const theme = createTheme({
    palette: {
      primary: {
        main: "#edbb5f",
        contrastText: "#000000",
      },
    },
  });

  if (!content || content.length === 0) {
    return <div style={{ padding: "20px" }}>Please wait 2 seconds while refreshing expiry status...</div>;
  }
  
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
  onChange={(e) => handleFormIsAcceptingResponses(e.target.checked)}
  checked={!!formIsAcceptingResponses}
/>

            </ThemeProvider>
          </div>
        </div>
      </div>
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
  handleExtendExpiry={handleExtendExpiry}
  extendDurations={extendDurations}
  setExtendDurations={setExtendDurations}
  getRemainingMinutes={getRemainingMinutes}
  extendingGroupID={extendingGroupID}
/>   {/* ✅ close GroupCard properly here */}

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
