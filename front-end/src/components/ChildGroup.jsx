import { Box, Button, TextField } from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteIcon from "@mui/icons-material/Delete";

function ChildGroup({
  groupName,
  handleGroupNameChange,
  handleNameSave,
  handleDeleteFormGroup,
  selectedGroup,
  openModal,
}) {
  return (
    <div>
      <div>Child Group</div>
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
              backgroundColor: "#edbb00",
            },
          }}
        >
          Save Changes
        </Button>

        <>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineRoundedIcon />}
            onClick={() => openModal("addChild", selectedGroup.groupID)}
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
            Add Child Group
          </Button>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineRoundedIcon />}
            onClick={() => openModal("addLeaf", selectedGroup.groupID)}
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
            Create Leaf
          </Button>
        </>

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

export default ChildGroup;
