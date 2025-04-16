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
  

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getRemainingMinutes = (expiresAt) => {
    if (!expiresAt) return "🟢 Never Expires";
    const diff = new Date(expiresAt) - new Date();
    if (diff <= 0) return "🔴 Expired";
    return `🕒 Expires in ${Math.ceil(diff / 60000)} mins`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${BACKEND_URL}/getFormIsAcceptingResponses/${localStorage.getItem("formID")}`,
        { method: "GET" }
      );
      const json = await response.json();
      setFormIsAcceptingResponses(json.formIsAcceptingResponses);
    };
    fetchData();

    const interval = setInterval(() => {
      setTick((prev) => prev + 1); // force re-render every minute
    }, 60000);
    

    return () => clearInterval(interval);
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
  

  const handleExtendExpiry = async (groupID) => {
    const duration = extendDurations[groupID];
    const formID = localStorage.getItem("formID");


    
    if (!duration || isNaN(duration) || parseInt(duration) <= 0) {
      notifications.show({
        title: "Invalid Duration",
        message: "Please enter a valid number of minutes.",
        color: "red",
        autoClose: 3000,
      });
      return;
    }
    
    

    try {
      
      console.log("Extending group:", groupID);
      console.log("Form ID from localStorage:", formID);
      console.log("Duration to extend by:", duration);

      const response = await fetch(
        `${BACKEND_URL}/extendGroupExpiry/${formID}/${groupID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ extendByMinutes: duration === "none" ? 0 : parseInt(duration) }),

        }
      );

      const json = await response.json();
      if (response.ok) {
        notifications.show({
          title: "Success",
          message: `Expiry extended by ${duration} minutes!`,
          color: "green",
          autoClose: 3000,
        });
        if (typeof refreshDashboardData === "function") {
          notifications.show({
            title: "Refreshing...",
            message: "Please wait 2 seconds while refreshing expiry status...",
            color: "blue",
            autoClose: 2000,
          });
        
          setTimeout(() => {
            refreshDashboardData(); // Trigger dashboard update after delay
          }, 2000);
        }
        
        setExtendDurations((prev) => ({ ...prev, [groupID]: "" }));
      
        // Reload the page or trigger a refresh to get new expiry time
        if (typeof refreshDashboardData === "function") {
          refreshDashboardData(); // refresh Dashboard without reload
        }
        
      }
      else {
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
                checked={formIsAcceptingResponses}
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
      ></GroupCard>
      <div className="p-4">
        <h5>Extend Expiry of Any Group</h5>
        {content.map((group) => {
  const isNeverExpiring = !group.expiresAt;

  return (
    <div key={group.groupID} className="mb-3">
      <strong>{group.groupName}</strong> &nbsp;
      <span style={{ fontSize: "0.9rem", color: "gray" }}>
        {getRemainingMinutes(group.expiresAt)}
      </span>
      <Tooltip title={group.expiresAt ? new Date(group.expiresAt).toLocaleString() : "Never Expires"}>
  <span style={{ fontSize: "0.75rem", color: "#888", cursor: "help", marginLeft: "8px" }}>
    📅
  </span>
</Tooltip>

      <div className="d-flex gap-2 mt-1">
        <input
          type="number"
          min="1"
          placeholder="Enter minutes"
          value={extendDurations[group.groupID] || ""}
          onChange={(e) =>
            setExtendDurations((prev) => ({
              ...prev,
              [group.groupID]: e.target.value,
            }))
          }
          disabled={isNeverExpiring} // disable if never expiring
        />
        <Button
          variant="outlined"
          color="primary"
          disabled={isNeverExpiring} // disable if never expiring
          onClick={() => handleExtendExpiry(group.groupID)}
        >
          Extend
        </Button>
      </div>
      {!group.expiresAt && (
  <Tooltip title="This group has no expiry set. You cannot extend it.">
    <span style={{ fontSize: "0.75rem", color: "#888", cursor: "help" }}>
      ⛔ Cannot extend — group never expires.
    </span>
  </Tooltip>
)}


    </div>
  );
})}

      </div>
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
