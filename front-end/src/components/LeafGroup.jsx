import { Box, Button, TextField, Typography, Link } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { QRCodeCanvas } from "qrcode.react";
import { Modal } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useState, useRef } from "react";




function LeafGroup({
  formID,
  groupName,
  setGroupName,
  handleNameSave,
  groupLink,
  handleDeleteFormGroup,
  selectedGroup,
  handleGroupNameChange,
  handleExtendExpiry,        // add
  extendDurations,           // add
  setExtendDurations,        // add
  getRemainingMinutes, 
  extendingGroupID,
  refreshDashboardData     
}) {

  const [qrOpen, setQrOpen] = useState(false);

  const qrRef = useRef();

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL("image/png");
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr_code.png";
    link.click();
  };
  


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

        <Button
  variant="outlined"
  sx={{ mt: 2 }}
  onClick={() => setQrOpen(true)}
>
  Show QR Code
</Button>


        {selectedGroup?.expiresAt && (  
        <Typography sx={{ mt: 1 }}>
        Expires at: {new Date(selectedGroup.expiresAt).toLocaleString()}
        </Typography>
)}

<Box sx={{ mt: 2 }}>
  {!selectedGroup.expiresAt ? (
    <Typography variant="body2" color="text.secondary">
      🟢 Never Expires — cannot extend.
    </Typography>
  ) : (
    <>
      <TextField
        label="Extend by Minutes"
        type="number"
        size="small"
        value={extendDurations[selectedGroup.groupID] || ""}
        onChange={(e) =>
          setExtendDurations((prev) => ({
            ...prev,
            [selectedGroup.groupID]: e.target.value,
          }))
        }
        sx={{ width: "150px", marginRight: "10px" }}
      />
      <Button
  variant="outlined"
  onClick={async () => {
    await handleExtendExpiry(selectedGroup.groupID, formID);

    const extendedMinutes = extendDurations[selectedGroup.groupID];
    if (extendedMinutes) {
      const newExpiry = new Date();
      newExpiry.setMinutes(newExpiry.getMinutes() + parseInt(extendedMinutes));
      selectedGroup.expiresAt = newExpiry.toISOString();
      localStorage.setItem("expiresAt", newExpiry.toISOString());
      localStorage.setItem("groupID", selectedGroup.groupID);
    }

    if (typeof refreshDashboardData === "function") {
      refreshDashboardData(); 
    }
  }}
  disabled={!extendDurations[selectedGroup.groupID] || extendingGroupID === selectedGroup.groupID}
>
{extendingGroupID === selectedGroup.groupID ? (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <CircularProgress size={16} color="inherit" />
    Extending...
  </Box>
) : (
  "Extend"
)}

</Button>

      <Typography sx={{ mt: 1, fontSize: "0.8rem", color: "#666" }}>
        {getRemainingMinutes(selectedGroup.expiresAt)}
      </Typography>
    </>
  )}
</Box>


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

      <Modal open={qrOpen} onClose={() => setQrOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Typography variant="h6" gutterBottom>
      Scan QR to Open Form
    </Typography>
    <QRCodeCanvas
      id="qrCode"
      ref={qrRef}
      value={groupLink}
      size={200}
    />

    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <Button variant="contained" onClick={() => setQrOpen(false)}>Close</Button>
      <Button
  variant="outlined"
  onClick={downloadQRCode}
  sx={{
    transition: "transform 0.3s ease, background-color 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
      backgroundColor: "#edbb5f",
    },
  }}
>
  Download QR
</Button>

    </Box>
  </Box>
</Modal>


    </div>
  );
}

export default LeafGroup;
