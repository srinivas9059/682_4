import React from "react";
import { Button, Modal, Box, TextField, Typography, FormControl, InputLabel, Select, MenuItem} from "@mui/material";


const GroupNameModal = ({
  open,
  handleClose,
  groupName,
  setGroupName,
  handleSave,
  duration,
  setDuration,

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
        autoFocus
        />

        <FormControl fullWidth sx={{ mt: 3 }}>
  <InputLabel id="duration-label">Expires In</InputLabel>
  <Select
    labelId="duration-label"
    value={duration}
    label="Expires In"
    onChange={(e) => setDuration(e.target.value)}
  >
    <MenuItem value={null}>Never Expires</MenuItem>
    <MenuItem value={5}>5 Minutes</MenuItem>
    <MenuItem value={30}>30 Minutes</MenuItem>
    <MenuItem value={60}>1 Hour</MenuItem>
    <MenuItem value={1440}>1 Day</MenuItem>
    <MenuItem value={10080}>7 Days</MenuItem>
  </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          disabled={!groupName.trim()}
          onClick={handleSave}
        >
          Save Group
        </Button>
      </Box>
    </Modal>
  );
};

export default GroupNameModal;
