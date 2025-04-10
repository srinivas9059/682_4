import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import GroupListItem from "./GroupListItem";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { Button } from "@mantine/core";

const ChildGroupCard = ({
  content,
  updateFormGroup,
  handleDeleteFormGroup,
  handleAddFormGroup,
  parentGroup,
}) => {
  const [groupName, setGroupName] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setGroupName("");
    setOpen(false);
  };

  useEffect(() => {
    setFilteredGroups(
      content.filter((group) => {
        if (parentGroup.childGroups.includes(group.groupID)) return true;
        else return false;
      })
    );
  }, [content]);

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
    <div>
      <div className="sub-groups-heading">Sub Groups</div>
      {/* <div className="settings-divider"></div> */}
      <div className="sub-groups-all-groups-list">
        {filteredGroups.map((group) => (
          <GroupListItem
            key={group.groupID}
            content={group}
            updateFormGroup={updateFormGroup}
            handleDeleteFormGroup={handleDeleteFormGroup}
            parentGroup={parentGroup}
          />
        ))}
        <div className="d-flex justify-content-end mt-3">
          <div className="add-sub-group-btn-div">
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
                  Enter a sub group name
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
                  variant="filled"
                  disabled={groupName.length === 0 ? true : false}
                  onClick={() => {
                    handleAddFormGroup(groupName, parentGroup.parentGroupID);
                    handleClose();
                  }}
                  color="#edbb5f"
                >
                  Add Sub Group
                </Button>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ChildGroupCard;
