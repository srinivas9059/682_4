import { Box, TextField } from "@mui/material";
import { Button } from "@mantine/core";
import { ColorInput, Select, FileInput } from "@mantine/core";

function ChildGroup({
  groupName,
  handleGroupNameChange,
  handleNameSave,
  handleDeleteFormGroup,
  selectedGroup,
  openModal,
  theme,
}) {
  const handleThemeChange = (key, value) => {
    const updatedTheme = { ...selectedGroup.theme, [key]: value };
    selectedGroup.theme = updatedTheme;
    handleNameSave();
  };

  return (
    <div>
      <div className="settings-heading">Child Group</div>
      <Box sx={{ margin: "20px" }}>
        <div className="group-name-section">
          <TextField
            label="Group Name"
            value={groupName}
            onChange={handleGroupNameChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </div>

        <div
          className="button-group"
          style={{ display: "flex", gap: "10px", marginTop: "20px" }}
        >
          <Button
            variant="filled"
            color="dark"
            onClick={handleNameSave}
            style={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              padding: "10px 20px",
            }}
          >
            Save Changes
          </Button>

          <Button
            variant="filled"
            color="dark"
            onClick={() => openModal("addChild", selectedGroup.groupID)}
            style={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              padding: "10px 20px",
            }}
          >
            Add Child Group
          </Button>

          <Button
            variant="filled"
            color="dark"
            onClick={() => openModal("addLeaf", selectedGroup.groupID)}
            style={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              padding: "10px 20px",
            }}
          >
            Create Leaf
          </Button>

          <Button
            variant="filled"
            color="red"
            onClick={() =>
              handleDeleteFormGroup(
                selectedGroup.groupID,
                selectedGroup.parentGroupID
              )
            }
            style={{
              padding: "10px 20px",
            }}
          >
            <span role="img" aria-label="delete" style={{ marginRight: "6px" }}>
              🗑️
            </span>
            DELETE GROUP
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default ChildGroup;
