import { useState, useEffect } from "react";
import { IconButton, Tooltip, Box, Button } from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import GroupNameModal from "./GroupNameModal";
import ParentGroup from "./ParentGroup";
import ChildGroup from "./ChildGroup";
import LeafGroup from "./LeafGroup";
import debounce from "lodash/debounce";

// Default theme to fallback if user resets
const defaultTheme = {
  primaryColor: "#000000", // black by default
  fontFamily: "Arial",
  backgroundImage: "",
};

function GroupCard({
  formParentGroup,
  content,
  handleAddParentFormGroup,
  handleAddChildFormGroup,
  handleAddFormGroup,
  updateFormParentGroup,
  updateFormGroup,
  handleDeleteParentFormGroup,
  handleDeleteFormGroup,
}) {
  const [formParentGroups, setFormParentGroups] = useState(formParentGroup);
  const [formGroups, setFormGroups] = useState(content);
  const [openModal, setOpenModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  // State to track if theme panel is expanded
  const [themeOpen, setThemeOpen] = useState(true);

  // Built-in font list (plus any custom fonts)
  const [fontOptions, setFontOptions] = useState([
    "Arial",
    "Roboto",
    "Georgia",
    "Courier New",
  ]);
  const [newFont, setNewFont] = useState("");
  const [newFontUrl, setNewFontUrl] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  /*
    Removed fetch("/fonts") because it caused 404
    If you decide to add a fonts route, uncomment it
  */

  useEffect(() => {
    setFormParentGroups(formParentGroup);
    setFormGroups(content);
    if (selectedGroup) {
      const updated = content.find((g) => g.groupID === selectedGroup.groupID);
      if (updated) {
        setSelectedGroup(updated);
      }
    }
  }, [formParentGroup, content]);

  // Debounced save to backend
  const debouncedThemeUpdate = debounce(async (groupID) => {
    const formID = localStorage.getItem("formID");
    if (!formID) {
      console.error("No formID found in localStorage");
      return;
    }

    const updated = formGroups.find((g) => g.groupID === groupID);
    if (!updated) {
      console.warn("No matching group found for groupID:", groupID);
      return;
    }

    try {
      const res = await fetch(
        `${BACKEND_URL}/updateFormGroupTheme/${formID}/${groupID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: updated.theme }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `updateFormGroupTheme failed with status ${res.status}:`,
          errorText
        );
      } else {
        const json = await res.json();
        console.log("Theme saved (debounced):", json);
        // notifications.show({ message: "Theme Saved" }) if you import from Mantine
      }
    } catch (err) {
      console.error("Network error while saving theme:", err);
    }
  }, 500);

  // Manually triggered Save
  const handleThemeSave = async () => {
    if (!selectedGroup) return;
    const formID = localStorage.getItem("formID");
    if (!formID) {
      console.error("Form ID is missing. Cannot save theme.");
      return;
    }

    const groupID = selectedGroup.groupID;
    try {
      const res = await fetch(
        `${BACKEND_URL}/updateFormGroupTheme/${formID}/${groupID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: selectedGroup.theme }),
        }
      );
      const json = await res.json();
      if (res.ok) {
        console.log("Theme saved:", json);
      } else {
        console.error("Failed to save theme:", json.error);
      }
    } catch (err) {
      console.error("Network error while saving theme:", err.message);
    }
  };

  // For custom fonts from user
  const handleAddFont = async () => {
    if (newFont.trim() !== "" && newFontUrl.trim() !== "") {
      // Insert a <link> for this font
      const link = document.createElement("link");
      link.href = newFontUrl;
      link.rel = "stylesheet";
      document.head.appendChild(link);

      // Add to fontOptions in memory
      setFontOptions((prev) => [...new Set([...prev, newFont])]);

      // If there's no route, skip:
      /*
      await fetch(`${BACKEND_URL}/fonts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFont, url: newFontUrl }),
      });
      */

      setNewFont("");
      setNewFontUrl("");
    }
  };

  // Called if user tries to remove a custom font from list
  // We skip the backend call to avoid 404
  const handleDeleteFont = async (name) => {
    setFontOptions((prev) => prev.filter((f) => f !== name));
  };

  // Called on color/font/bg changes
  const handleThemeChange = (groupID, field, value) => {
    setFormGroups((prev) =>
      prev.map((g) =>
        g.groupID === groupID
          ? {
              ...g,
              theme: {
                ...defaultTheme,
                ...g.theme,
                [field]: value,
              },
            }
          : g
      )
    );

    if (selectedGroup?.groupID === groupID) {
      setSelectedGroup((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          [field]: value,
        },
      }));
    }

    // Trigger the debounced save
    debouncedThemeUpdate(groupID);
  };

  // Reset theme to default
  const handleResetTheme = () => {
    if (!selectedGroup) return;
    const resetTheme = { ...defaultTheme };

    // local update
    setFormGroups((prev) =>
      prev.map((g) =>
        g.groupID === selectedGroup.groupID ? { ...g, theme: resetTheme } : g
      )
    );
    setSelectedGroup((prev) => ({
      ...prev,
      theme: resetTheme,
    }));
    // auto save
    debouncedThemeUpdate(selectedGroup.groupID);
  };

  // Basic group logic
  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleNameSave = () => {
    if (!selectedGroup) return;
    const updatedGroups = formGroups.map((group) =>
      group.groupID === selectedGroup.groupID
        ? { ...group, groupName: groupName }
        : group
    );
    setFormGroups(updatedGroups);
    selectedGroup.groupName = groupName;
    updateFormGroup(selectedGroup);
  };

  const handleParentNameSave = () => {
    if (!selectedGroup) return;
    const updatedGroups = formGroups.map((group) =>
      group.groupID === selectedGroup.groupID
        ? { ...group, groupName: groupName }
        : group
    );
    setFormParentGroups(updatedGroups);
    selectedGroup.groupName = groupName;
    updateFormParentGroup(selectedGroup);
  };

  const handleModalOpen = (action, gid = null) => {
    setOpenModal(true);
    setModalAction(action);
    if (gid) {
      const found =
        formParentGroups.find((pg) => pg.groupID === gid) ||
        formGroups.find((cg) => cg.groupID === gid);
      setSelectedGroup(found || null);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setGroupName("");
    setSelectedGroup(null);
    setModalAction(null);
  };

  const handleAddFormGroups = async (groupID, groupName) => {
    const id = localStorage.getItem("formID");
    const response = await fetch(
      `${BACKEND_URL}/createNewFormGroup/${id}?groupName=${groupName}&groupID=${groupID}`,
      { method: "GET" }
    );
    const json = await response.json();
    const newGroup = json.formGroup;

    setFormGroups((oldFormGroups) => [...oldFormGroups, newGroup]);

    const parentGroupIndex = formParentGroups.findIndex(
      (pg) => pg.groupID === groupID
    );

    if (parentGroupIndex === -1) {
      console.log(" Not in Parent Groups");

      const childParentGroupIndex = formGroups.findIndex(
        (g) => g.groupID === groupID
      );
      console.log("childParentGroupIndex", childParentGroupIndex);
      
      setFormGroups((oldFormGroups) => {
        return oldFormGroups.map((parentGroup) => {
          if (parentGroup.groupID === groupID) {
            const updatedParentGroup = {
              ...parentGroup,
              childGroups: [
                ...(parentGroup.childGroups || []),
                newGroup.groupID,
              ],
            };
            return updatedParentGroup;
          }
          return parentGroup;
        });
      });
    } else {
      console.log("In Parent Groups");
      setFormParentGroups((oldFormParentGroups) => {
        return oldFormParentGroups.map((parentGroup) => {
          if (parentGroup.groupID === groupID) {
            const updatedParentGroup = {
              ...parentGroup,
              childGroups: [
                ...(parentGroup.childGroups || []),
                newGroup.groupID,
              ],
            };
            return updatedParentGroup;
          }
          return parentGroup;
        });
      });
    }
  };

  const handleAddChildFormGroups = async (groupID, groupName) => {
    const id = localStorage.getItem("formID");
    const response = await fetch(
      `${BACKEND_URL}/createNewChildFormGroup/${id}?groupName=${groupName}&groupID=${groupID}`,
      { method: "GET" }
    );
    const json = await response.json();
    const newGroup = json.formGroup;

    setFormGroups((oldFormGroups) => [...oldFormGroups, newGroup]);

    const parentGroupIndex = formParentGroups.findIndex(
      (pg) => pg.groupID === groupID
    );

    if (parentGroupIndex === -1) {
      console.log(" Not in Parent Groups");

      const childParentGroupIndex = formGroups.findIndex(
        (g) => g.groupID === groupID
      );
      console.log("childParentGroupIndex", childParentGroupIndex);
      
      setFormGroups((oldFormGroups) => {
        return oldFormGroups.map((parentGroup) => {
          if (parentGroup.groupID === groupID) {
            const updatedParentGroup = {
              ...parentGroup,
              childGroups: [
                ...(parentGroup.childGroups || []),
                newGroup.groupID,
              ],
            };
            return updatedParentGroup;
          }
          return parentGroup;
        });
      });
    } else {
      console.log("In Parent Groups");
      setFormParentGroups((oldFormParentGroups) => {
        return oldFormParentGroups.map((parentGroup) => {
          if (parentGroup.groupID === groupID) {
            const updatedParentGroup = {
              ...parentGroup,
              childGroups: [
                ...(parentGroup.childGroups || []),
                newGroup.groupID,
              ],
            };
            return updatedParentGroup;
          }
          return parentGroup;
        });
      });
    }
  };

  const handleAddParentFormGroups = async (parentGroupName) => {
    console.log(parentGroupName, "to be added");
    const id = localStorage.getItem("formID");
    const response = await fetch(
      `${BACKEND_URL}/createNewParentFormGroup/${id}?parentGroupName=${parentGroupName}`,
      { method: "GET" }
    );
    const json = await response.json();
    const newParentGroup = json.formParentGroup;

    setFormParentGroups((oldFormParentGroups) => [
      ...oldFormParentGroups,
      newParentGroup,
    ]);
  };

  const handleSave = () => {
    console.log("Selected Group after clicking save", selectedGroup);
    if (modalAction === "addParent") {
      handleAddParentFormGroups(groupName);
    } else if (modalAction === "addChild") {
      handleAddChildFormGroups(selectedGroup.groupID, groupName);
    } else if (modalAction === "addLeaf") {
      handleAddFormGroups(selectedGroup.groupID, groupName);
    }
    handleModalClose();
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setGroupName(group.groupName);
  };

  // Tree view recursion
  const renderTreeItems = (parentGroup) => {
    if (!parentGroup) return null;

    return (
      <TreeItem
        key={parentGroup.groupID}
        itemId={parentGroup.groupID}
        label={parentGroup.groupName}
        onClick={() => handleSelectGroup(parentGroup)}
      >
        {console.log(
          parentGroup.groupID,
          "   ",
          parentGroup.groupName,
          "parentGroup's child groups",
          parentGroup.childGroups
        )}
        {parentGroup.childGroups?.map((childGroupID) => {
          const childGroup = formGroups.find(
            (group) => group.groupID === childGroupID
          );
          if (!childGroup) return null;
          return renderTreeItems(childGroup);
        })}
      </TreeItem>
    );
  };

  return (
    <div className="settings-groups-part">
      <div className="settings-page-inner">
        <div className="settings-heading-div">
          <div className="settings-heading">Groups</div>
          <Tooltip title="Add Parent Group">
            <IconButton
              onClick={() => handleModalOpen("addParent")}
              color="primary"
            >
              <AddCircleOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div className="group-card" style={{ height: "600px", width: "100%" }}>
          <div style={{ display: "flex", height: "100%", width: "100%" }}>
            {/* Left Panel: Tree */}
            <div
              style={{
                width: "240px",
                overflow: "auto",
                borderRight: "1px solid #ccc",
              }}
            >
              <SimpleTreeView>
                {formParentGroups.map(renderTreeItems)}
              </SimpleTreeView>
            </div>

            {/* Right Panel: Group Editor */}
            <Box sx={{ flex: 1, padding: 2, overflow: "auto" }}>
              {selectedGroup && (
                <div>
                  {selectedGroup.groupCode === "1" ? (
                    <ParentGroup
                      groupName={groupName}
                      handleGroupNameChange={handleGroupNameChange}
                      handleParentNameSave={handleParentNameSave}
                      handleDeleteParentFormGroup={handleDeleteParentFormGroup}
                      selectedGroup={selectedGroup}
                      openModal={handleModalOpen}
                    />
                  ) : selectedGroup.groupCode === "2" ? (
                    <ChildGroup
                      groupName={groupName}
                      handleGroupNameChange={handleGroupNameChange}
                      handleNameSave={handleNameSave}
                      handleDeleteFormGroup={handleDeleteFormGroup}
                      selectedGroup={selectedGroup}
                      openModal={handleModalOpen}
                    />
                  ) : (
                    <>
                      <LeafGroup
                        groupName={groupName}
                        setGroupName={setGroupName}
                        handleNameSave={handleNameSave}
                        groupLink={selectedGroup.groupLink}
                        handleDeleteFormGroup={handleDeleteFormGroup}
                        selectedGroup={selectedGroup}
                        handleGroupNameChange={handleGroupNameChange}
                      />

                      {/* Theme Panel */}
                      <div className="theme-settings mt-3 p-3 border rounded">
                        <h4 className="mb-3">
                          🎨 Theme for {selectedGroup.groupName}
                        </h4>

                        <label className="form-label">Font Color</label>
                        <input
                          type="color"
                          value={
                            selectedGroup.theme?.primaryColor ||
                            defaultTheme.primaryColor
                          }
                          onChange={(e) =>
                            handleThemeChange(
                              selectedGroup.groupID,
                              "primaryColor",
                              e.target.value
                            )
                          }
                          className="form-control form-control-color mb-2"
                        />

                        <label className="form-label">Font Family</label>
                        <select
                          value={
                            selectedGroup.theme?.fontFamily ||
                            defaultTheme.fontFamily
                          }
                          onChange={(e) =>
                            handleThemeChange(
                              selectedGroup.groupID,
                              "fontFamily",
                              e.target.value
                            )
                          }
                          className="form-select mb-2"
                        >
                          {fontOptions.map((font, idx) => (
                            <option key={idx} value={font}>
                              {font}
                            </option>
                          ))}
                        </select>

                        {/* Add Custom Font */}
                        <div className="mb-2">
                          <label className="form-label">Add Custom Font</label>
                          <div className="d-flex mb-2">
                            <input
                              type="text"
                              className="form-control me-2"
                              placeholder="Font Name (e.g., MyFont)"
                              value={newFont}
                              onChange={(e) => setNewFont(e.target.value)}
                            />
                          </div>
                          <div className="d-flex">
                            <input
                              type="text"
                              className="form-control me-2"
                              placeholder="Font URL (Google Fonts)"
                              value={newFontUrl}
                              onChange={(e) => setNewFontUrl(e.target.value)}
                            />
                            <Button onClick={handleAddFont}>ADD</Button>
                          </div>
                        </div>

                        <label className="form-label">
                          Background Image URL
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            selectedGroup.theme?.backgroundImage ||
                            defaultTheme.backgroundImage
                          }
                          onChange={(e) =>
                            handleThemeChange(
                              selectedGroup.groupID,
                              "backgroundImage",
                              e.target.value
                            )
                          }
                        />

                        {/* Save & Reset Buttons */}
                        <div className="mt-3 d-flex gap-2">
                          <Button onClick={handleThemeSave}>
                            💾 Save Theme
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={handleResetTheme}
                          >
                            Reset
                          </Button>
                        </div>

                        {/*
                          Removed the link block here as requested,
                          so no duplicate link is displayed.
                        */}
                      </div>
                    </>
                  )}
                </div>
              )}
            </Box>
          </div>
        </div>

        <GroupNameModal
          open={openModal}
          handleClose={handleModalClose}
          groupName={groupName}
          setGroupName={setGroupName}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
}

export default GroupCard;
