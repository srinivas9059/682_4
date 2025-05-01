import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserFormMCQ from "./UserFormMCQ";
import UserFormSAQ from "./UserFormSAQ";
import UserFormLSQ from "./UserFormLSQ";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Loader } from "@mantine/core";
import Confetti from "react-confetti";




function UserForm() {
  const [formData, setFormData] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formResponse, setFormResponse] = useState({

    userResponseID: Math.floor(Math.random() * 9000) + 1000,
    userGroupID: useParams().groupID,
    userResponse: [],
  });
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);



  const { formID, groupID } = useParams();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const checkIfExpired = (groupID) => {
    const expiredGroupID = localStorage.getItem("expiredGroupID");
    return expiredGroupID && expiredGroupID === groupID;
  };


  useEffect(() => {
    const formID = localStorage.getItem("formID");
    const groupID = localStorage.getItem("groupID");
  
    if (!formID || !groupID) {
      console.error("Form ID or Group ID is missing in localStorage.");
      navigate("/linkexpired"); // Redirect to the expired link if missing
      return; // Exit the function if IDs are missing
    }
  
    const expiredGroupID = localStorage.getItem("expiredGroupID");
    if (expiredGroupID && expiredGroupID === groupID) {
      console.warn("⚡ Local storage says expired. Redirecting...");
      navigate("/linkexpired"); // If expired, redirect to the expired link
      return;
    }
  
    // Continue with the data fetching process
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/getSummaryDashboardData/${formID}?groupID=${groupID}`
        );
        const json = await response.json();
        // Handle the rest of your data and error checking here
      } catch (error) {
        console.error("Error fetching form:", error);
      }
    };
  
    fetchData();
  }, [formID, groupID]); // Dependencies should be formID and groupID
  
  
  


  const updateUserResponse = (res) => {
    setFormResponse((old) => {
      const temp = old.userResponse.filter((r) => r.questionID !== res.questionID);
      return {
        ...old,
        userResponse: [...temp, res],
      };
    });
  };

  const handleSubmit = async () => {
    const response = await fetch(
      `${BACKEND_URL}/saveUserFormResponse`, {
      method: "POST",
      body: JSON.stringify({
        formID,
        formResponse,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const json = await response.json();
    const group = json.form.formGroups?.find(g => g.groupID === groupID);

const isExpired =
  group?.expiresAt &&
  new Date(group.expiresAt).getTime() < new Date().getTime();

if (isExpired) {
  console.warn("🛑 This group link is expired based on updated expiresAt.");
  setRedirecting(true);
  navigate("/linkexpired");
  return;
}

    console.log(json);
    notifications.show({
      color: "green",
      title: "Submission Successful",
      message: "Your form has been submitted!",
      autoClose: 3000,
    });

    // 🎉 Trigger Confetti
    setShowConfetti(true);

    setTimeout(() => {
      navigate(`/formResponseSubmitted?title=${formData.formTitle}&id=${formID}&groupID=${groupID}`);
    }, 2000);
    
    
    navigate(
      `/formResponseSubmitted?title=${formData.formTitle}&id=${formID}&groupID=${groupID}`
    );
  };
  if (errorOccurred) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", fontWeight: 500 }}>
        This form is no longer available or may have been deleted.
      </div>
    );
  }
  
  if (redirecting) return null;

  if (loading) return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <Loader size="lg" color="#edbb5f" />
      <div style={{ marginTop: "1rem", fontSize: "1rem" }}>Loading form...</div>
      
    </div>
  );
  
  if (!formData) return <div>No form content found.</div>;

  const hasNoQuestions =
    sections.length === 0 || sections.every((sec) => sec.questions.length === 0);

  return (
    <div className="user-form-page">
      {showConfetti && (
  <Confetti
    width={window.innerWidth}
    height={window.innerHeight}
    recycle={false}
    numberOfPieces={400}
  />
)}

      <div className="user-form-title-description">
        <div className="user-form-title-description-inner p-3">
          <div className="user-form-title">{formData.formTitle}</div>
          <div className="user-form-description">{formData.formDescription}</div>
        </div>
      </div>

      <div className="user-form-all-questions">
        {hasNoQuestions ? (
          <div className="p-4 text-center">
            <h5>This form has no questions yet. Please check back later.</h5>
          </div>
        ) : (
          sections.map((section) => (
            <div key={section.sectionID} className="user-form-section">
              {section.questions.map((q) => (
                <div className="user-form-question" key={q.questionID}>
                  <div className="user-form-question-inner p-3">
                    {(() => {
                      switch (q.questionType) {
                        case 1:
                          return (
                            <UserFormMCQ
                              content={q}
                              updateUserResponse={updateUserResponse}
                            />
                          );
                        case 2:
                          return (
                            <UserFormSAQ
                              content={q}
                              updateUserResponse={updateUserResponse}
                            />
                          );
                        case 3:
                          return (
                            <UserFormLSQ
                              content={q}
                              updateUserResponse={updateUserResponse}
                            />
                          );
                        default:
                          return <div>Unsupported question type.</div>;
                      }
                    })()}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {!hasNoQuestions && (
        <div className="user-form-submit">
          <div className="user-form-submit-btn">
            <Button
              color="#edbb5f"
              variant="filled"
              className="text-black"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      <div className="pt-5 pb-5"></div>
      <div className="user-form-footer">
        <div className="user-form-footer-text">
          This content is neither created nor endorsed by Cluster Forms. Report Abuse - Terms of Service - Privacy Policy
        </div>
        <div className="user-form-footer-text">
          <b>Cluster Forms</b>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
