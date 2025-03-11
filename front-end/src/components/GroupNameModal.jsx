import React from "react";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";

const GroupNameModal = ({
  open,
  handleClose,
  groupName,
  setGroupName,
  handleSave,
}) => {
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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Enter a group name
        </Typography>
        <TextField
          fullWidth
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          label="Group Name"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          disabled={!groupName}
          onClick={handleSave}
        >
          Save Group
        </Button>
      </Box>
    </Modal>
  );
};

export default GroupNameModal;
