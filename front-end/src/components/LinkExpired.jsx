import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const LinkExpired = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("formID"); // Clears old formID safely
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>⏰ Link Expired</h1>
      <p>This group link is no longer valid. Please contact the form owner.</p>
      <Button
  variant="contained"
  color="primary"
  onClick={() => {
    const lastFormID = localStorage.getItem("lastVisitedFormID");
    if (lastFormID) {
      navigate(`/form/${lastFormID}`);
    } else {
      navigate("/"); // fallback
    }
  }}
>
  Back to Home
</Button>

    </div>
  );
  
};

export default LinkExpired;
