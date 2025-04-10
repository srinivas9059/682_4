import { Box, Button, TextField, Typography, Link } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function LeafGroup({
  groupName,
  setGroupName,
  handleNameSave,
  groupLink,
  handleDeleteFormGroup,
  selectedGroup,
  handleGroupNameChange,
}) {
  return (
    <div>
      <div>Leaf Group</div>
      <Box sx={{ margin: "20px" }}>
        <TextField
          label="Group Name"
          value={groupName}
          onChange={handleGroupNameChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleNameSave}
          sx={{
            marginTop: 2,
            marginRight: "4%",
            backgroundColor: "#edbb5f",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#edbb5f",
            },
          }}
        >
          Save Changes
        </Button>

        <Typography sx={{ mt: 2 }}>
          Link: {groupLink && (
  <Link href={groupLink} target="_blank" rel="noopener noreferrer">
    {groupLink}
  </Link>
)}

        </Typography>

        {selectedGroup?.expiresAt && (
        <Typography sx={{ mt: 1 }}>
        Expires at: {new Date(selectedGroup.expiresAt).toLocaleString()}
        </Typography>
)}

<Button
  variant="contained"
  color="error"
  startIcon={<DeleteIcon />}
  onClick={() => {
    if (selectedGroup.groupID === "open_access") {
      alert("The default group cannot be deleted.");
      return;
    }
    handleDeleteFormGroup(
      selectedGroup.groupID,
      selectedGroup.parentGroupID
    );
  }}
  disabled={selectedGroup.groupID === "open_access"}
  sx={{ marginTop: 2 }}
>
  Delete Group
</Button>

      </Box>
    </div>
  );
}

export default LeafGroup;
