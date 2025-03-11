import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserFormMCQ from "./UserFormMCQ";
import UserFormSAQ from "./UserFormSAQ";
import UserFormLSQ from "./UserFormLSQ";
import { Button } from "@mantine/core";

function UserForm() {
  const [formData, setFormData] = useState({});
  const { formID, groupID } = useParams();
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [formResponse, setFormResponse] = useState({
    userResponseID: Math.floor(Math.random() * 9000) + 1000,
    userGroupID: groupID,
    userResponse: [],
  });
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BACKEND_URL}/getFormData/${formID}`, {
        method: "GET",
      });
      const json = await response.json();
      console.log("logging json", json);
      if (response.ok) {
        if (!json.form.formIsAcceptingResponses)
          navigate(`/notAcceptingFormResponses?title=${json.form.formTitle}`);
        setFormData(json.form);
        setSections(json.form.formSections);
        //setQuestions(json.form.formQuestions);
      } else alert("Form not found !");
    };
    fetchData();
  }, []);

  const updateUserResponse = (res) => {
    setFormResponse((old) => {
      const temp = old.userResponse.filter(
        (r) => r.questionID !== res.questionID
      );
      const newR = old;
      newR.userResponse = temp;
      newR.userResponse.push(res);
      return newR;
    });
  };

  const handleSubmit = async () => {
    const response = await fetch(`${BACKEND_URL}/saveUserFormResponse`, {
      method: "POST",
      body: JSON.stringify({
        formID: formID,
        formResponse: formResponse,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    console.log(json);
    navigate(
      `/formResponseSubmitted?title=${formData.formTitle}&id=${formID}&groupID=${groupID}`
    );
  };

  return (
    <div className="user-form-page">
      <div className="user-form-title-description">
        <div className="user-form-title-description-inner p-3">
          <div className="user-form-title">{formData.formTitle}</div>
          <div className="user-form-description">
            {formData.formDescription}
          </div>
        </div>
      </div>
      <div className="user-form-all-questions">
        {sections.map((section) => (
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
        ))}
      </div>
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
      <div className="pt-5 pb-5"></div>
      <div className="user-form-footer">
        <div className="user-form-footer-text">
          This content is neither created nor endorsed by Cluster Forms. Report
          Abuse - Terms of Service - Privacy Policy
        </div>
        <div className="user-form-footer-text">
          <b>Cluster Forms</b>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
