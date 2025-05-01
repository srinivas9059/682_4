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
  handleExtendExpiry,           // NEW
  extendDurations,              // NEW
  setExtendDurations,           // NEW
  getRemainingMinutes,
  extendingGroupID,
  refreshDashboardData 
}) {

  const formID = localStorage.getItem("formID");

 const [groupLink, setGroupLink] = useState("");
  const [formParentGroups, setFormParentGroups] = useState(formParentGroup);
  const [formGroups, setFormGroups] = useState(content);
  const [openModal, setOpenModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [duration, setDuration] = useState(60); // default 60 minutes
  
  const isGroupExpired = (group) => {
  return group?.expiresAt && new Date(group.expiresAt) < new Date();
    };
    

    
  
  

  // const [updateTrigger, setUpdateTrigger] = useState(false);

  //const forceUpdate = () => setUpdateTrigger((prev) => !prev);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  console.log("✅ BACKEND_URL loaded in GroupCard.jsx:", BACKEND_URL);


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
    if (!selectedGroup || !selectedGroup.groupID) {
      console.warn("❌ selectedGroup is undefined or missing groupID");
      return;
    }
  
    if (selectedGroup.groupID === "open_access") {
      alert("You cannot rename the default group.");
      return;
    }
  
    console.log("Saving changes for group:", selectedGroup.groupID);
    const updatedGroups = (formGroups || []).map((group) => {
      return group.groupID === selectedGroup.groupID
        ? { ...group, groupName: groupName }
        : group;
    });
  
    setFormGroups(updatedGroups);
    selectedGroup.groupName = groupName;
    updateFormGroup(selectedGroup);
  };
  
  
  const handleParentNameSave = () => {
    if (!selectedGroup || !selectedGroup.groupID) {
      console.warn("❌ selectedGroup is undefined or missing groupID");
      return;
    }
  
    if (selectedGroup.groupID === "open_access") {
      alert("You cannot rename the default group.");
      return;
    }
  
    console.log("Saving changes for group:", selectedGroup.groupID);
    const updatedGroups = (formParentGroups || []).map((group) => {
      return group.groupID === selectedGroup.groupID
        ? { ...group, groupName: groupName }
        : group;
    });
  
    setFormParentGroups(updatedGroups);
    selectedGroup.groupName = groupName;
    updateFormParentGroup(selectedGroup);
  };
  
  
  
  const handleModalOpen = (action, groupID = null) => {
    setOpenModal(true);
    setModalAction(action);
    console.log("groupID", groupID);
  
    if (groupID) {
      let group = formParentGroups.find((g) => g.groupID === groupID) 
                || formGroups.find((g) => g.groupID === groupID);
  
      if (!group) {
        console.warn(`⚠️ No group found for groupID: ${groupID}`);
        return; // prevent undefined being set
      }
  
      console.log("✅ Found Group:", group);
      setSelectedGroup(group);
    }
  };
  

  const handleModalClose = () => {
    setOpenModal(false);
    setGroupName("");
    setSelectedGroup(null);
    setModalAction(null);
    setDuration(60); // reset to default

  };
  const handleSave = () => {
    if (!selectedGroup && modalAction !== "addParent") {
      console.warn("🚫 No group selected — aborting save.");
      return;
    }
  
    console.log("Selected Group after clicking save", selectedGroup);
  
    if (modalAction === "addParent") {
      handleAddParentFormGroups(groupName);
    } else if (modalAction === "addChild") {
      handleAddChildFormGroups(selectedGroup.groupID, groupName, duration);
    } else if (modalAction === "addLeaf") {
      handleLocalAddFormGroup(selectedGroup.groupID, groupName, duration);
    }
  
    handleModalClose();
  };
  
  const handleLocalAddFormGroup = async (groupID, groupName, duration) => {
    const id = localStorage.getItem("formID");
    console.log("Hitting API:", `${BACKEND_URL}/createNewFormGroup/${id}`);
    const response = await fetch(`${BACKEND_URL}/createNewFormGroup/${id}`, {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupName,
        groupID,
        durationInMinutes: duration,
      }),
    });
  
    const json = await response.json();
    const newGroup = json.formGroup;
  
    setFormGroups((oldFormGroups) => [...oldFormGroups, newGroup]);
    
    const parentGroupIndex = formParentGroups.findIndex(
      (pg) => pg.groupID === groupID
    );
  
    if (parentGroupIndex === -1) {
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
  

  const handleAddChildFormGroups = async (groupID, groupName, duration) => {
    const id = localStorage.getItem("formID");
  
    const response = await fetch(`${BACKEND_URL}/createNewChildFormGroup/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupName,
        groupID,
        durationInMinutes: duration,
      }),
    });
  
    const json = await response.json();
    const newGroup = json.formGroup;
  
    setFormGroups((oldFormGroups) => [...oldFormGroups, newGroup]);
  
    const parentGroupIndex = formParentGroups.findIndex(
      (pg) => pg.groupID === groupID
    );
  
    if (parentGroupIndex === -1) {
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
  
    const response = await fetch(`${BACKEND_URL}/createNewParentFormGroup/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parentGroupName,
      }),
    });
  
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
    if (!parentGroup) return null;
  
    return (
      <TreeItem
  key={`treeitem-${parentGroup.groupID}-${Math.random()}`} // avoids duplicate keys
  itemId={parentGroup.groupID}


        label={
          <div>
            <span
              style={
                isGroupExpired(parentGroup)
                  ? { color: "red", textDecoration: "line-through" }
                  : {}
              }
            >
              {parentGroup.groupName}
            </span>
            {parentGroup.expiresAt && (
              <Typography
                variant="caption"
                sx={{ display: "block", color: "#666", fontSize: "11px" }}
              >
                {parentGroup.groupID === "open_access"
                  ? "🟢 Never Expires (Default Group)"
                  : `⏰ Expires at: ${new Date(
                      parentGroup.expiresAt
                    ).toLocaleString()}`}
              </Typography>
            )}
          </div>
        }
        onClick={() => handleSelectGroup(parentGroup)}
      >
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
            <div
              style={{
                width: "240px",
                overflow: "auto",
                borderRight: "1px solid #ccc",
              }}
            >
              <SimpleTreeView>
              {([...formParentGroups].sort((a, b) => {
    if (a.groupID === "open_access") return -1;
    if (b.groupID === "open_access") return 1;
    return 0;
  })).map(renderTreeItems)}


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
                    formID={formID}
                    groupName={groupName}
                    setGroupName={setGroupName}
                    handleNameSave={handleNameSave}
                    groupLink={selectedGroup.groupLink}
                    handleDeleteFormGroup={handleDeleteFormGroup}
                    selectedGroup={selectedGroup}
                    handleGroupNameChange={handleGroupNameChange}
                    handleExtendExpiry={handleExtendExpiry} // new
                    extendDurations={extendDurations}       // new
                    setExtendDurations={setExtendDurations} // new
                    getRemainingMinutes={getRemainingMinutes} // new
                    extendingGroupID={extendingGroupID} 
                    refreshDashboardData={refreshDashboardData}
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
          duration={duration}
          setDuration={setDuration}
        />
      </div>
    </div>
  );
}

export default GroupCard;
