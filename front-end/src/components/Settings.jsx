import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button } from "@mantine/core";
import ChildGroupCard from "./ChildGroupCard";
import { Accordion } from "@mantine/core";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";

function Settings({
  content,
  updateFormGroup,
  handleDeleteFormGroup,
  handleAddFormGroup,
  formParentGroups,
  handleAddParentFormGroup,
  handleDeleteParentFormGroup,
}) {
  const navigate = useNavigate();
  const [formIsAcceptingResponses, setFormIsAcceptingResponses] =
    useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setGroupName("");
    setOpen(false);
  };

  const theme = createTheme({
    palette: {
      oliveGreen: {
        main: "#edbb5f",
        light: "#ebbc65",
        dark: "#ebb654",
        contrastText: "#000000",
      },
    },
  });
  const label = { inputProps: { "aria-label": "Switch demo" } };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: "1px solid #000",
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
        {
          method: "GET",
        }
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

  const parentGroups = formParentGroups.map((parentGroup) => (
    <Accordion.Item
      key={parentGroup.parentGroupID}
      value={parentGroup.parentGroupName}
      className="parent-group-dropdown"
    >
      <Accordion.Control>
        <div className="d-flex justify-content-between">
          <div>{parentGroup.parentGroupName}</div>
          <div>
            <Tooltip title="Delete Group">
              <div
                onClick={() => {
                  handleDeleteParentFormGroup(parentGroup.parentGroupID);
                }}
              >
                <DeleteIcon className="group-delete-icon" />
              </div>
            </Tooltip>
          </div>
        </div>
      </Accordion.Control>
      <Accordion.Panel>
        {
          <ChildGroupCard
            content={content}
            updateFormGroup={updateFormGroup}
            handleDeleteFormGroup={handleDeleteFormGroup}
            handleAddFormGroup={handleAddFormGroup}
            parentGroup={parentGroup}
          />
        }
      </Accordion.Panel>
    </Accordion.Item>
  ));

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
                {...label}
                color="oliveGreen"
                onChange={(e) =>
                  handleFormIsAcceptingResponses(e.target.checked)
                }
                checked={formIsAcceptingResponses}
              />
            </ThemeProvider>
          </div>
        </div>
      </div>
      <div className="settings-groups-part">
        <div className="settings-page-inner">
          <div className="settings-heading">Groups</div>
          <div className="settings-divider"></div>
          <div className="all-groups-list">
            <Accordion variant="separated" radius="md" chevronPosition="left">
              {parentGroups}
            </Accordion>
            <div className="d-flex justify-content-end mt-3">
              <div className="add-group-btn-div">
                <Tooltip title="Add Group">
                  <IconButton onClick={handleOpen} className="text-white">
                    <AddCircleOutlineRoundedIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <div>
                    <div className="mb-2 poppins-semibold text-secondary">
                      Enter a group name
                    </div>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <Button
                      disabled={groupName.length === 0 ? true : false}
                      variant="filled"
                      onClick={() => {
                        handleAddParentFormGroup(groupName);
                        handleClose();
                      }}
                      color="#edbb5f"
                    >
                      Add Group
                    </Button>
                  </div>
                </Box>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <div className="settings-delete-form-part">
        <div className="settings-page-delete-form-inner">
          <div className="w-50">
            <Button
              fullWidth
              variant="filled"
              color="#edbb5f"
              className="text-black"
              onClick={() => handleDeleteForm()}
            >
              Delete Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
