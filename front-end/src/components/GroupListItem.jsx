import { useState } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mantine/core";
import Modal from "@mui/material/Modal";
import { Input } from "@mantine/core";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import { notifications } from "@mantine/notifications";

function GroupListItem({
  content,
  updateFormGroup,
  handleDeleteFormGroup,
  parentGroup,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setGroupName("");
    setOpen(false);
  };
  const [groupName, setGroupName] = useState(content.groupName);

  const handleOnChangeUpdateForm = (groupName) => {
    const temp = {
      groupID: content.groupID,
      groupName: groupName,
      groupLink: content.groupLink,
    };
    updateFormGroup(temp);
  };

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

  return (
    <div className="group-list-item">
      <div className="group-name-list-item">
        {/* <input
          type="text"
          className="form-control"
          value={content.groupName}
          onChange={handleOnChangeUpdateForm}
        /> */}
        {/* <div
          className="bg-secondary-subtle rounded p-2 border border-dark pe-auto"
          onClick={handleOpen}
        >
          {content.groupName}
        </div> */}
        <div className="d-flex align-items-center">
          <Input
            disabled
            value={content.groupName}
            className="group-name-input"
          />
          <div>
            <Tooltip title="Update Group">
              <IconButton onClick={handleOpen}>
                <EditRoundedIcon />
              </IconButton>
            </Tooltip>
          </div>
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
                Update Sub Group Name
              </div>
              <div>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={content.groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <Button
                disabled={groupName.length === 0 ? true : false}
                variant="filled"
                onClick={() => {
                  handleOnChangeUpdateForm(groupName);
                  handleClose();
                }}
                color="#edbb5f"
              >
                Update Sub Group
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
      <div className="group-link-list-item">
        <a href={content.groupLink} className="text-black" target="_blank">
          {content.groupLink}
        </a>
        <Tooltip title="Copy Link">
          <IconButton
            className="ms-3"
            onClick={() => {
              navigator.clipboard.writeText(content.groupLink);
              notifications.show({
                color: "#edbb5f",
                message: "Copied to Clipboard",
                autoClose: 2500,
              });
            }}
          >
            <LinkRoundedIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className="delete-group-list-item">
        <Tooltip title="Delete Group">
          <IconButton
            onClick={() => {
              handleDeleteFormGroup(content.groupID, parentGroup.parentGroupID);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}

export default GroupListItem;
