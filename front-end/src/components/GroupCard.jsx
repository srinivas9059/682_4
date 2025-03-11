import { useState, useEffect } from "react";
import { IconButton, Tooltip, Box, Typography } from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import GroupNameModal from "./GroupNameModal";
import ParentGroup from "./ParentGroup";
import ChildGroup from "./ChildGroup";
import LeafGroup from "./LeafGroup";

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
  // const [updateTrigger, setUpdateTrigger] = useState(false);

  //const forceUpdate = () => setUpdateTrigger((prev) => !prev);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  /* useEffect(() => {
    console.log("Component will re-render now");

    formParentGroups.map(renderTreeItem);

    console.log("Component will re-rendered");
  }, [updateTrigger]);

  const renderTreeItem = (parentGroup) => {
    console.log(
      parentGroup.groupID,
      "   ",
      parentGroup.groupName,
      "parentGroup's child groups",
      parentGroup.childGroups
    );
    parentGroup.childGroups?.map((childGroupID) => {
      const childGroup = formGroups.find(
        (group) => group.groupID === childGroupID
      );
      if (!childGroup) return null;
      return renderTreeItem(childGroup);
    });
  }; */

  useEffect(() => {
    console.log("group name changed");
  }, [groupName]);

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
    /*   const newGroupName = event.target.value;
    selectedGroup.groupName = newGroupName;
    updateFormGroups(selectedGroup);
    updateFormGroup(selectedGroup); */
  };
  const handleNameSave = () => {
    console.log("Saving changes for group:", selectedGroup.groupID);
    const updatedGroups = formGroups.map((group) =>
      group.groupID === selectedGroup.groupID
        ? { ...group, groupName: groupName }
        : group
    );
    setFormGroups(updatedGroups);
    selectedGroup.groupName = groupName;
    updateFormGroup(selectedGroup);
    // forceUpdate();
  };

  const handleParentNameSave = () => {
    console.log("Saving changes for group:", selectedGroup.groupID);
    const updatedGroups = formGroups.map((group) =>
      group.groupID === selectedGroup.groupID
        ? { ...group, groupName: groupName }
        : group
    );
    setFormParentGroups(updatedGroups);
    selectedGroup.groupName = groupName;
    updateFormParentGroup(selectedGroup);
    //forceUpdate();
  };

  const handleModalOpen = (action, groupID = null) => {
    setOpenModal(true);
    setModalAction(action);
    console.log("groupID", groupID);
    if (groupID) {
      var group = formParentGroups.find((g) => g.groupID === groupID);
      if (group === undefined) {
        group = formGroups.find((g) => g.groupID === groupID);
      }
      console.log(" Group", group);
      setSelectedGroup(group);
      console.log("Selected Group", selectedGroup);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setGroupName("");
    setSelectedGroup(null);
    setModalAction(null);
    setGroupLink("");
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
    //forceUpdate();
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
      //formGroups[childParentGroupIndex].childGroups.push(newGroup.groupID);
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
      //formGroups[childParentGroupIndex].childGroups.push(newGroup.groupID);
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

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setGroupName(group.groupName);
    //handleModalOpen("edit", group.groupID);
  };

  useEffect(() => {
    setFormParentGroups(formParentGroup);
    setFormGroups(content);
    // forceUpdate();
    console.log("Content refreshed  ", content);
  }, [formParentGroup, content]);

  const renderTreeItems = (parentGroup) => {
    if (!parentGroup) return null; // Guard clause to prevent rendering undefined groups

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
          if (!childGroup) return null; // Prevents rendering deleted child groups
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
            <Box sx={{ flex: 1, padding: 2, overflow: "auto" }}>
              {console.log(selectedGroup)}
              {selectedGroup &&
                (selectedGroup.groupCode === "1" ? (
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
                ))}
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
