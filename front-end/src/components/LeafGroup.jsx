import { Box, TextField, Typography } from "@mui/material";
import { Button, Anchor } from "@mantine/core";
import { useRef } from "react";
import QRCode from "react-qr-code";

function LeafGroup({
  groupName,
  setGroupName,
  handleNameSave,
  groupLink,
  handleDeleteFormGroup,
  selectedGroup,
  handleGroupNameChange,
  theme,
}) {
  const qrRef = useRef(null);

  const downloadSVG = () => {
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${groupName.replace(/\s+/g, "_")}-qrcode.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleThemeChange = (key, value) => {
    const updatedTheme = { ...selectedGroup.theme, [key]: value };
    selectedGroup.theme = updatedTheme;
    handleNameSave();
  };

  return (
    <div>
      <div className="settings-heading">Leaf Group</div>
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

        {groupLink ? (
          <Typography sx={{ mt: 3, mb: 2 }}>
            Link:{" "}
            <Anchor href={groupLink} target="_blank">
              {groupLink}
            </Anchor>
          </Typography>
        ) : (
          <Typography sx={{ mt: 3, mb: 2, color: "gray" }}>
            No group link available.
          </Typography>
        )}

        {groupLink && (
          <div
            ref={qrRef}
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "#fff",
              padding: 8,
              borderRadius: 4,
            }}
          >
            <QRCode value={groupLink} size={96} />
            <Button variant="outline" size="sm" onClick={downloadSVG}>
              Download QR
            </Button>
          </div>
        )}
      </Box>
    </div>
  );
}

export default LeafGroup;
