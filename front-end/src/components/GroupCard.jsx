// import { useState, useEffect } from "react";
// import { IconButton, Tooltip, Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import {
  IconButton,
  Tooltip,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import GroupNameModal from "./GroupNameModal";
import ParentGroup from "./ParentGroup";
import ChildGroup from "./ChildGroup";
import LeafGroup from "./LeafGroup";
import debounce from "lodash/debounce";

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
  // start “empty” and let useEffect fill us in
  const [formParentGroups, setFormParentGroups] = useState([]);
  const [formGroups, setFormGroups] = useState([]);

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
  // right under your imports
  const defaultTheme = {
    primaryColor: "#000000",
    fontFamily: "Arial",
    backgroundImage: "",
  };

  /*
    Removed fetch("/fonts") because it caused 404
    If you decide to add a fonts route, uncomment it
  */
  // whenever the parent (Form.jsx) re-passes props, copy them into our local state
  useEffect(() => {
    setFormParentGroups(formParentGroup);
    setFormGroups(content);

    // if a group is currently selected, re-resolve it from the fresh props
    if (selectedGroup) {
      const reselected =
        content.find((g) => g.groupID === selectedGroup.groupID) ||
        formParentGroup.find((pg) => pg.groupID === selectedGroup.groupID);
      setSelectedGroup(reselected || null);
    }
  }, [formParentGroup, content]);

  // useEffect(() => {
  //   // Update local state when props change
  //   setFormParentGroups(formParentGroup);
  //   setFormGroups(content);

  //   if (selectedGroup) {
  //     // Try to find in child groups first
  //     const updatedChild = content.find(
  //       (g) => g.groupID === selectedGroup.groupID
  //     );
  //     if (updatedChild) {
  //       setSelectedGroup(updatedChild);
  //       return;
  //     }

  //     // Then check in parent groups
  //     const updatedParent = formParentGroup.find(
  //       (pg) => pg.groupID === selectedGroup.groupID
  //     );
  //     if (updatedParent) {
  //       setSelectedGroup(updatedParent);
  //     }
  //   }
  // }, [formParentGroup, content]);

  // Debounced save to backend
  // debounce saving the theme so we don’t hammer the server on every slider/color-pick change
  const debouncedThemeUpdate = debounce(async (groupID) => {
    const formID = localStorage.getItem("formID");
    const updated = formGroups.find((g) => g.groupID === groupID);
    if (!formID || !updated) return;
    await fetch(`${BACKEND_URL}/updateFormGroupTheme/${formID}/${groupID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: updated.theme }),
    });
  }, 300);

  const handleThemeChange = (groupID, field, value) => {
    setFormGroups((prev) =>
      prev.map((g) =>
        g.groupID === groupID
          ? { ...g, theme: { ...defaultTheme, ...g.theme, [field]: value } }
          : g
      )
    );
    if (selectedGroup?.groupID === groupID) {
      setSelectedGroup((s) => ({
        ...s,
        theme: { ...s.theme, [field]: value },
      }));
    }
    debouncedThemeUpdate(groupID);
  };

  const handleResetTheme = () => {
    if (!selectedGroup) return;
    setFormGroups((prev) =>
      prev.map((g) =>
        g.groupID === selectedGroup.groupID ? { ...g, theme: defaultTheme } : g
      )
    );
    setSelectedGroup((s) => ({ ...s, theme: defaultTheme }));
    debouncedThemeUpdate(selectedGroup.groupID);
  };

  // const handleThemeSave = async () => {
  //   if (!selectedGroup) return;
  //   debouncedThemeUpdate.cancel();
  //   const formID = localStorage.getItem("formID");
  //   await fetch(
  //     `${BACKEND_URL}/updateFormGroupTheme/${formID}/${selectedGroup.groupID}`,
  //     {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ theme: selectedGroup.theme }),
  //     }
  //   );
  // };

  // Manually triggered Save
  const handleThemeSave = async () => {
    if (!selectedGroup) return;

    // 🛡️ Cancel any pending debounce
    debouncedThemeUpdate.cancel();

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
        console.log("Theme saved manually:", json);
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
  console.log("🧩 Rendering Tree: formParentGroups", formParentGroups);

  // Called on color/font/bg changes
  // const handleThemeChange = (groupID, field, value) => {
  //   setFormGroups((prev) =>
  //     prev.map((g) =>
  //       g.groupID === groupID
  //         ? {
  //             ...g,
  //             theme: {
  //               ...defaultTheme,
  //               ...g.theme,
  //               [field]: value,
  //             },
  //           }
  //         : g
  //     )
  //   );

  //   if (selectedGroup?.groupID === groupID) {
  //     setSelectedGroup((prev) => ({
  //       ...prev,
  //       theme: {
  //         ...prev.theme,
  //         [field]: value,
  //       },
  //     }));
  //   }

  //   // Trigger the debounced save
  //   debouncedThemeUpdate(groupID);
  // };

  // Reset theme to default
  // const handleResetTheme = () => {
  //   if (!selectedGroup) return;
  //   const resetTheme = { ...defaultTheme };

  //   // local update
  //   setFormGroups((prev) =>
  //     prev.map((g) =>
  //       g.groupID === selectedGroup.groupID ? { ...g, theme: resetTheme } : g
  //     )
  //   );
  //   setSelectedGroup((prev) => ({
  //     ...prev,
  //     theme: resetTheme,
  //   }));
  //   // auto save
  //   debouncedThemeUpdate(selectedGroup.groupID);
  // };

  // Basic group logic
  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleSave = async () => {
    try {
      const id = localStorage.getItem("formID");
      if (!id) {
        console.error("No formID found in localStorage");
        return;
      }

      // Save the current state of groups
      const response = await fetch(`${BACKEND_URL}/updateForm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formID: id,
          formGroups: formGroups,
          formParentGroups: formParentGroups,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.statusText}`);
      }

      const json = await response.json();
      console.log("Groups saved successfully:", json);

      // Close the modal after successful save
      handleModalClose();
    } catch (error) {
      console.error("Error saving groups:", error);
    }
  };

  const handleAddParentFormGroups = async (parentGroupName) => {
    try {
      const id = localStorage.getItem("formID");
      if (!id) {
        console.error("No formID found in localStorage");
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/createNewParentFormGroup/${id}?parentGroupName=${parentGroupName}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to create parent group: ${response.statusText}`
        );
      }

      const json = await response.json();
      if (!json.formParentGroup) {
        throw new Error("Invalid response from server");
      }

      const newParentGroup = json.formParentGroup;

      // Update local state
      setFormParentGroups((oldFormParentGroups) => [
        ...oldFormParentGroups,
        newParentGroup,
      ]);

      // Save the updated state
      await handleSave();

      // Close the modal
      handleModalClose();
    } catch (error) {
      console.error("Error creating parent group:", error);
    }
  };

  const handleAddChildFormGroups = async (groupID, groupName) => {
    try {
      const id = localStorage.getItem("formID");
      if (!id) {
        console.error("No formID found in localStorage");
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/createNewChildFormGroup/${id}?groupName=${groupName}&groupID=${groupID}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`Failed to create child group: ${response.statusText}`);
      }

      const json = await response.json();
      if (!json.formGroup) {
        throw new Error("Invalid response from server");
      }

      const newGroup = json.formGroup;

      // Update local state
      setFormGroups((oldFormGroups) => [...oldFormGroups, newGroup]);

      // Update parent group's childGroups
      setFormParentGroups((oldFormParentGroups) => {
        return oldFormParentGroups.map((parentGroup) => {
          if (parentGroup.groupID === groupID) {
            return {
              ...parentGroup,
              childGroups: [
                ...(parentGroup.childGroups || []),
                newGroup.groupID,
              ],
            };
          }
          return parentGroup;
        });
      });

      // Save the updated state
      await handleSave();

      // Close the modal
      handleModalClose();
    } catch (error) {
      console.error("Error creating child group:", error);
    }
  };

  const handleSelectGroup = (group) => {
    if (!group || !group.groupID) {
      console.log("Invalid group selected:", group);
      return;
    }

    console.log("Select group called with:", group);
    console.log("Current formParentGroups:", formParentGroups);
    console.log("Current formGroups:", formGroups);

    // First check in parent groups
    const parentGroup = formParentGroups.find(
      (pg) => pg.groupID === group.groupID
    );
    if (parentGroup) {
      console.log("Found parent group:", parentGroup);
      setSelectedGroup(parentGroup);
      setGroupName(parentGroup.groupName);
      return;
    }

    // Then check in regular groups
    const childGroup = formGroups.find((g) => g.groupID === group.groupID);
    if (childGroup) {
      console.log("Found child group:", childGroup);
      setSelectedGroup(childGroup);
      setGroupName(childGroup.groupName);
      return;
    }

    console.log("No matching group found");
    setSelectedGroup(null);
    setGroupName("");
  };

  const handleAddFormGroups = async (groupID, groupName) => {
    try {
      const formID = localStorage.getItem("formID");
      if (!formID) {
        console.error("No formID found in localStorage");
        return;
      }

      console.log(
        "Creating leaf group with formID:",
        formID,
        "parentID:",
        groupID
      );

      // Ensure we have a selected group
      if (!selectedGroup || selectedGroup.groupID !== groupID) {
        throw new Error("Please select a valid parent group first");
      }

      // First verify the parent group exists on the server
      const formResponse = await fetch(`${BACKEND_URL}/getFormData/${formID}`);
      if (!formResponse.ok) {
        throw new Error("Failed to fetch form data");
      }
      const formData = await formResponse.json();

      // Check if the parent group exists in the backend data
      const parentExists =
        formData.form.formParentGroups.some((pg) => pg.groupID === groupID) ||
        formData.form.formGroups.some((fg) => fg.groupID === groupID);

      if (!parentExists) {
        console.log(
          "Parent group not found in backend. Saving parent groups first..."
        );
        // Save the current parent groups to ensure they're in the backend
        await handleSave();
      }

      // Create the new leaf group
      const response = await fetch(
        `${BACKEND_URL}/createNewFormGroup/${formID}?groupName=${encodeURIComponent(
          groupName
        )}&groupID=${groupID}`,
        { method: "GET" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "Failed to create leaf group");
        } catch (e) {
          throw new Error(`Failed to create leaf group: ${errorText}`);
        }
      }

      const json = await response.json();
      if (!json.formGroup) {
        throw new Error("Invalid response from server");
      }

      const newGroup = json.formGroup;

      // Update local state
      setFormGroups((oldFormGroups) => [...oldFormGroups, newGroup]);

      // Update parent group's childGroups
      setFormParentGroups((oldFormParentGroups) => {
        return oldFormParentGroups.map((parentGroup) => {
          if (parentGroup.groupID === groupID) {
            return {
              ...parentGroup,
              childGroups: [
                ...(parentGroup.childGroups || []),
                newGroup.groupID,
              ],
            };
          }
          return parentGroup;
        });
      });

      // Save the updated state to ensure new group is persisted
      await handleSave();

      // Close the modal
      handleModalClose();
    } catch (error) {
      console.error("Error creating leaf group:", error);
      alert(error.message);
    }
  };

  const handleModalSave = () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    if (modalAction === "addParent") {
      handleAddParentFormGroups(groupName);
    } else {
      // Only require parent group selection for child and leaf groups
      if (!selectedGroup || !selectedGroup.groupID) {
        alert("Please select a parent group first");
        return;
      }

      if (modalAction === "addChild") {
        handleAddChildFormGroups(selectedGroup.groupID, groupName);
      } else if (modalAction === "addLeaf") {
        handleAddFormGroups(selectedGroup.groupID, groupName);
      }
    }
  };

  const handleNameSave = () => {
    if (!selectedGroup) return;

    // Update local state
    if (selectedGroup.groupCode === "1") {
      // Parent group
      const updatedGroups = formParentGroups.map((group) =>
        group.groupID === selectedGroup.groupID
          ? { ...group, groupName: groupName }
          : group
      );
      setFormParentGroups(updatedGroups);
      selectedGroup.groupName = groupName;
      updateFormParentGroup(selectedGroup);
    } else {
      // Child or Leaf group
      const updatedGroups = formGroups.map((group) =>
        group.groupID === selectedGroup.groupID
          ? { ...group, groupName: groupName }
          : group
      );
      setFormGroups(updatedGroups);
      selectedGroup.groupName = groupName;
      updateFormGroup(selectedGroup);
    }

    // Save changes
    handleSave();
  };

  const handleParentNameSave = () => {
    if (!selectedGroup) return;

    // Update local state
    const updatedGroups = formParentGroups.map((group) =>
      group.groupID === selectedGroup.groupID
        ? { ...group, groupName: groupName }
        : group
    );
    setFormParentGroups(updatedGroups);
    selectedGroup.groupName = groupName;
    updateFormParentGroup(selectedGroup);

    // Save changes
    handleSave();
  };

  const handleModalOpen = (action, gid = null) => {
    console.log("Modal opening with action:", action, "and groupID:", gid);
    setOpenModal(true);
    setModalAction(action);
    if (gid) {
      const found =
        formParentGroups.find((pg) => pg.groupID === gid) ||
        formGroups.find((cg) => cg.groupID === gid);
      console.log("Found group for modal:", found);
      setSelectedGroup(found || null);
    } else {
      setSelectedGroup(null);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setGroupName("");
    setSelectedGroup(null);
    setModalAction(null);
  };

  // Tree view recursion
  const renderTreeItems = (parentGroup) => {
    if (!parentGroup || !parentGroup.groupID) return null;

    return (
      <TreeItem
        key={parentGroup.groupID}
        itemId={parentGroup.groupID}
        label={parentGroup.groupName}
        onClick={() => handleSelectGroup(parentGroup)}
      >
        {(parentGroup.childGroups || []).map((childGroupID) => {
          // ✅ now uses your state “formGroups”
          const childGroup = formGroups.find(
            (group) => group.groupID === childGroupID
          );

          if (!childGroup) return null;
          return renderTreeItems(childGroup);
        })}
      </TreeItem>
    );
  };

  useEffect(() => {
    console.log("Form Parent Groups updated:", formParentGroups);
    console.log("Form Groups updated:", formGroups);
  }, [formParentGroups, formGroups]);

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
                {formParentGroups && formParentGroups.length > 0 ? (
                  formParentGroups.map(renderTreeItems)
                ) : (
                  <div style={{ padding: "10px" }}>No groups created yet</div>
                )}
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
                    <LeafGroup
                      groupName={groupName}
                      setGroupName={setGroupName}
                      handleNameSave={handleNameSave}
                      groupLink={selectedGroup.groupLink}
                      handleDeleteFormGroup={handleDeleteFormGroup}
                      selectedGroup={selectedGroup}
                      handleGroupNameChange={handleGroupNameChange}
                    />
                  )}

                  {/* ── Theme Settings Panel (only for leaves) ────────────── */}
                  {selectedGroup.groupCode === "3" && (
                    <Accordion
                      expanded={themeOpen}
                      onChange={(_, expanded) => setThemeOpen(expanded)}
                      className="mt-4"
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>
                          🎨 Theme for {selectedGroup.groupName}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {/* ——— Custom Google-Font Adder ——— */}
                        <div className="d-flex mb-3">
                          <input
                            type="text"
                            placeholder="Font name (e.g. Merriweather)"
                            value={newFont}
                            onChange={(e) => setNewFont(e.target.value)}
                            className="form-control me-2"
                          />
                          <input
                            type="text"
                            placeholder="URL (https://fonts.googleapis.com/…)"
                            value={newFontUrl}
                            onChange={(e) => setNewFontUrl(e.target.value)}
                            className="form-control me-2"
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={handleAddFont}
                          >
                            Add Font
                          </button>
                        </div>
                        {/* ——————————————— */}

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
                          className="form-control form-control-color mb-3"
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
                          className="form-select mb-3"
                        >
                          {fontOptions.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>

                        <label className="form-label">
                          Background Image URL
                        </label>
                        <input
                          type="text"
                          value={selectedGroup.theme?.backgroundImage || ""}
                          onChange={(e) =>
                            handleThemeChange(
                              selectedGroup.groupID,
                              "backgroundImage",
                              e.target.value
                            )
                          }
                          placeholder="https://…"
                          className="form-control mb-3"
                        />

                        <div className="d-flex justify-content-between">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleResetTheme}
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={handleThemeSave}
                          >
                            Save Theme
                          </button>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  )}
                  {/* ─────────────────────────────────────────────────────── */}
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
          handleSave={handleModalSave}
        />
      </div>
    </div>
  );
}

export default GroupCard;
