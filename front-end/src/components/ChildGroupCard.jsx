function ChildGroupCard({
  group,
  handleAddFormGroup,
  handleDeleteFormGroup,
  openModal,
  handleOpenModal,
  handleCloseModal,
}) {
  const [groupName, setGroupName] = useState("Sub Group");

  const handleOpenModals = (groupID) => {
    console.log("Opening modal for group ID:", groupID);
    handleOpenModal(groupID);
  };

  const handleAddGroup = () => {
    console.log("Adding group with name:", groupName);
    handleAddFormGroup(groupName, group.groupID);
    handleCloseModal();
  };

  const handleClose = () => {
    handleCloseModal();
    setGroupName("Sub Group");
  };

  return (
    <TreeItem
      key={group.groupID}
      itemId={group.groupID.toString()}
      label={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {group.groupName}
          <div>
            <Tooltip title="Add Child Group">
              <IconButton
                onClick={() => handleOpenModals(group.groupID)}
                color="primary"
              >
                <AddCircleOutlineRoundedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Group">
              <IconButton
                onClick={() =>
                  handleDeleteFormGroup(group.groupID, group.parentID)
                }
                color="secondary"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      }
    >
      {group.childGroups?.map((childGroup) => (
        <ChildGroupCard
          key={childGroup.groupID}
          group={childGroup}
          handleAddFormGroup={handleAddFormGroup}
          handleDeleteFormGroup={handleDeleteFormGroup}
          openModal={openModal === childGroup.groupID}
          handleOpenModal={handleOpenModal}
          handleCloseModal={handleCloseModal}
        />
      ))}
      {openModal === group.groupID && (
        <Modal open onClose={handleClose}>
          <Box sx={{ padding: 2 }}>
            <TextField
              label="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              fullWidth
            />
            <Button
              onClick={handleAddGroup}
              color="primary"
              variant="contained"
              style={{ marginTop: 20 }}
            >
              Add Group
            </Button>
          </Box>
        </Modal>
      )}
    </TreeItem>
  );
}

export default ChildGroupCard;
