import { Box, TextField } from "@mui/material";
import { Button } from "@mantine/core";
import { ColorInput, Select, FileInput } from "@mantine/core";

function ParentGroup({
  groupName,
  handleGroupNameChange,
  handleParentNameSave,
  handleDeleteParentFormGroup,
  selectedGroup,
  openModal,
  theme,
  onThemeChange,
}) {
  const handleThemeChange = (key, value) => {
    if (onThemeChange) {
      onThemeChange({ ...theme, [key]: value });
    }
  };

  return (
    <div>
      <div className="settings-heading">Parent Group</div>
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
            onClick={handleParentNameSave}
            style={{
              backgroundColor: theme?.primaryColor || "#000000",
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
              backgroundColor: theme?.primaryColor || "#000000",
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
              backgroundColor: theme?.primaryColor || "#000000",
              color: "#FFFFFF",
              padding: "10px 20px",
            }}
          >
            Create Leaf
          </Button>

          <Button
            variant="filled"
            color="red"
            onClick={() => handleDeleteParentFormGroup(selectedGroup.groupID)}
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

export default ParentGroup;
