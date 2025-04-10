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
          Link: <Link href={groupLink}>{groupLink}</Link>
        </Typography>

        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() =>
            handleDeleteFormGroup(
              selectedGroup.groupID,
              selectedGroup.parentGroupID
            )
          }
          sx={{ marginTop: 2 }}
        >
          Delete Group
        </Button>
      </Box>
    </div>
  );
}

export default LeafGroup;
