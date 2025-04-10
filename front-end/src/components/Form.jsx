import { useEffect, useState } from "react";
import FormTitleDescription from "./FormTitleDescription";
import Settings from "./Settings";
import Dashboard from "./Dashboard";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import Section from "./Section";

import { arrayMove } from "@dnd-kit/sortable";

function Form() {
  const [questions, setQuestions] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formGroups, setFormGroups] = useState([]);
  const [formParentGroups, setFormParentGroups] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({ formSections: [] });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      fetchFormData();
    }
  }, [currentUser, navigate, BACKEND_URL]);

  useEffect(() => {
    console.log("Form Data updated:", formData);
  }, [formData]);

  const fetchFormData = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/getFormData/${localStorage.getItem("formID")}`
      );

      if (response.ok) {
        const data = await response.json();
        setFormData(data.form);
        setFormTitle(data.form.formTitle);
        setFormDescription(data.form.formDescription);
        setFormGroups(data.form.formGroups);
        setFormParentGroups(data.form.formParentGroups);
        console.log("Form Data fetched:", data.form);
      } else {
        console.error("Failed to load form data.");
      }
    } catch (error) {
      console.error("Error fetching form data: ", error);
    }
    setLoading(false);
  };

  // Update a specific question
  const updateQuestion = (sectionID, questionID, updatedQuestion) => {
    setFormData((currentFormData) => {
      const newSections = currentFormData.formSections.map((section) => {
        if (section.sectionID === sectionID) {
          const newQuestions = section.questions.map((question) => {
            if (question.questionID === questionID) {
              return updatedQuestion;
            }
            return question;
          });
          return { ...section, questions: newQuestions };
        }
        return section;
      });
      return { ...currentFormData, formSections: newSections };
    });
  };

  // Add a new section
  const handleAddSection = () => {
    const newSection = {
      sectionID: Math.floor(Math.random() * 9000) + 1000,
      questions: [],
    };
    const updatedSections = [...formData.formSections, newSection];
    setFormData({ ...formData, formSections: updatedSections });
  };

  // Delete Section
  const handleDeleteSection = async (sectionID) => {
    const updatedSections = formData.formSections.filter(
      (section) => section.sectionID !== sectionID
    );
    setFormData({ ...formData, formSections: updatedSections });
    // optionally handleSave() right away
  };

  // DnD: reorder questions
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const fromQuestionId = active.id;
      const toQuestionId = over.id;

      let fromSectionIndex = -1,
        fromQuestionIndex = -1,
        toQuestionIndex = -1;

      formData.formSections.forEach((section, sectionIndex) => {
        const fromIndex = section.questions.findIndex(
          (q) => q.questionID === fromQuestionId
        );
        const toIndex = section.questions.findIndex(
          (q) => q.questionID === toQuestionId
        );

        if (fromIndex !== -1) {
          fromSectionIndex = sectionIndex;
          fromQuestionIndex = fromIndex;
        }
        if (toIndex !== -1 && fromSectionIndex === sectionIndex) {
          toQuestionIndex = toIndex;
        }
      });

      if (
        fromSectionIndex !== -1 &&
        toQuestionIndex !== -1 &&
        fromQuestionIndex !== -1
      ) {
        const newQuestions = arrayMove(
          formData.formSections[fromSectionIndex].questions,
          fromQuestionIndex,
          toQuestionIndex
        );

        const newSections = formData.formSections.map((section, index) => {
          if (index === fromSectionIndex) {
            return { ...section, questions: newQuestions };
          }
          return section;
        });

        setFormData({ ...formData, formSections: newSections });
      }
    }
  };

  if (loading) {
    return <div>Loading form...</div>;
  }

  // Title & description changes
  const storeTitleDescription = (arr) => {
    setFormTitle(arr[0]);
    setFormDescription(arr[1]);
  };

  // Delete question in a section
  const handleDeleteQuestion = (sectionID, questionID) => {
    const newSections = formData.formSections.map((section) => {
      if (section.sectionID === sectionID) {
        const filteredQuestions = section.questions.filter(
          (question) => question.questionID !== questionID
        );
        return { ...section, questions: filteredQuestions };
      }
      return section;
    });
    setFormData({ ...formData, formSections: newSections });
  };

  // Add question in a section
  const handleAddQuestion = (sectionID) => {
    const newQuestion = {
      questionID: Math.floor(Math.random() * 9000) + 1000,
      questionType: 1,
      question: "",
      options: [],
    };

    const newSections = formData.formSections.map((section) => {
      if (section.sectionID === sectionID) {
        return { ...section, questions: [...section.questions, newQuestion] };
      }
      return section;
    });

    setFormData({ ...formData, formSections: newSections });
  };

  // Duplicate question in a section
  const handleDuplicateQuestion = (sectionID, q) => {
    const newSections = formData.formSections.map((section) => {
      if (section.sectionID === sectionID) {
        let duplicateQuestion;
        if (q.questionType === 1)
          duplicateQuestion = {
            questionID: Math.floor(Math.random() * 9000) + 1000,
            questionType: 1,
            question: `[COPY] ${q.question}`,
            options: q.options,
          };
        else if (q.questionType === 2)
          duplicateQuestion = {
            questionID: Math.floor(Math.random() * 9000) + 1000,
            questionType: 2,
            question: `[COPY] ${q.question}`,
          };
        else if (q.questionType === 3)
          duplicateQuestion = {
            questionID: Math.floor(Math.random() * 9000) + 1000,
            questionType: 3,
            question: `[COPY] ${q.question}`,
            upperLimit: q.upperLimit,
            labels: q.labels,
          };
        return {
          ...section,
          questions: [...section.questions, duplicateQuestion],
        };
      }
      return section;
    });
    setFormData({ ...formData, formSections: newSections });
  };

  // Called by <Settings />: update an existing group
  const updateFormGroup = (newG) => {
    setFormGroups((oldGroups) => {
      const index = oldGroups.findIndex((g) => g.groupID === newG.groupID);
      const newGroups = [...oldGroups];
      newGroups[index] = newG;
      return newGroups;
    });
    handleSave();
  };

  // Called by <Settings />: update a parent group
  const updateFormParentGroup = (newG) => {
    setFormParentGroups((oldGroups) => {
      const index = oldGroups.findIndex((g) => g.groupID === newG.groupID);
      const newGroups = [...oldGroups];
      newGroups[index] = newG;
      return newGroups;
    });
    handleSave();
  };

  // Called by <Settings />: delete a parent group
  const handleDeleteParentFormGroup = (id) => {
    if (formParentGroups.length === 1) {
      alert("Cannot delete. Only 1 parent form group is present !");
    } else {
      setFormParentGroups((oldGroups) =>
        oldGroups.filter((g) => g.groupID !== id)
      );
      notifications.show({
        color: "#edbb5f",
        message: "Parent group deleted Don't forget to save the form!",
        autoClose: 2500,
      });
    }
    //handleSave();
  };

  const handleDeleteFormGroup = (id, groupID) => {
    if (formGroups.length === 1) {
      alert("Cannot delete. Only 1 form group is present !");
    } else {
      console.log("Deleting form group", id, groupID);
      setFormGroups((oldGroups) => oldGroups.filter((g) => g.groupID !== id));

      setFormParentGroups((oldFormParentGroups) => {
        return oldFormParentGroups.map((parentGroup) => {
          if (parentGroup.groupID === groupID) {
            return {
              ...parentGroup,
              childGroups: parentGroup.childGroups.filter(
                (groupID) => groupID !== id
              ),
            };
          }
          return parentGroup;
        });
      });

      notifications.show({
        color: "#edbb5f",
        message: "Subgroup deleted  Don't forget to save the form!",
        autoClose: 2500,
      });
    }
    // handleSave();
  };

  // Called by <Settings />: add parent group
  const handleAddParentFormGroup = async (parentGroupName) => {
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
    console.log("Form Parent Groups after adding", formParentGroups);
  };

  // Called by the user or from other places to save entire form
  const handleSave = async () => {
    const id = localStorage.getItem("formID");
    console.log("Form Data to be saved", formData);
    const bodyjson = JSON.stringify({
      formID: id,
      formTitle: formTitle,
      formDescription: formDescription,
      formSections: formData.formSections,
      formGroups: formGroups,
      formParentGroups: formParentGroups,
    });
    console.log("Form Data to be saved", bodyjson);

    const response = await fetch(`${BACKEND_URL}/updateForm`, {
      method: "PUT",
      body: JSON.stringify({
        formID: id,
        formTitle: formTitle,
        formDescription: formDescription,
        formSections: formData.formSections,
        formGroups: formGroups,
        formParentGroups: formParentGroups,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    notifications.show({
      color: "#edbb5f",
      message: "Form Saved",
      autoClose: 2500,
    });
  };

  return (
    <div className="form-main-page">
      <nav className="navbar" id="nav-custom-styles">
        <div className="container-fluid navbar-container-tabs pt-2">
          <a className="navbar-brand d-flex app-logo" href="/">
            <TextSnippetRoundedIcon className="m-1" />
            <span className="fs-4 ms-1">Forms</span>
          </a>
          {/* <div>
            <Button
              color="#edbb5f"
              variant="filled"
              className="text-black"
              onClick={handleSave}
            >
              Save
            </Button>
          </div> */}
        </div>
        <div className="w-100 navbar-container-tabs">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <Link to="/" className="nav-link">
                <HomeRoundedIcon />
              </Link>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="questions-tab"
                data-bs-toggle="tab"
                data-bs-target="#questions-tab-pane"
                type="button"
                role="tab"
                aria-controls="questions-tab-pane"
                aria-selected="true"
              >
                Questions
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="dashboard-tab"
                data-bs-toggle="tab"
                data-bs-target="#dashboard-tab-pane"
                type="button"
                role="tab"
                aria-controls="dashboard-tab-pane"
                aria-selected="false"
              >
                Dashboard
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="settings-tab"
                data-bs-toggle="tab"
                data-bs-target="#settings-tab-pane"
                type="button"
                role="tab"
                aria-controls="settings-tab-pane"
                aria-selected="false"
              >
                Settings
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="h-100">
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="questions-tab-pane"
            role="tabpanel"
            aria-labelledby="questions-tab"
            tabIndex="0"
          >
            <div className="form-questions-tab">
              <FormTitleDescription
                store={storeTitleDescription}
                formContent={[formTitle, formDescription]}
              />
              {console.log("formTitle", formTitle)}
              {console.log("formDescription", formDescription)}

              {formData.formSections.map((section) => (
                <Section
                  key={section.sectionID}
                  section={section}
                  handleDragEnd={handleDragEnd}
                  handleAddSection={handleAddSection}
                  updateQuestion={updateQuestion}
                  handleDeleteSection={handleDeleteSection}
                  handleAddQuestion={handleAddQuestion}
                  handleDeleteQuestion={handleDeleteQuestion}
                  handleDuplicateQuestion={handleDuplicateQuestion}
                />
              ))}
              {/*  <Button onClick={handleAddSection} style={{ marginTop: "20px" }}>
                Add New Section
              </Button> */}

              <div className="p-5 text-center">
                <Button
                  onClick={handleAddSection}
                  color="#333333"
                  style={{ marginRight: "8%" }}
                >
                  Add New Section
                </Button>

                <Button
                  color="#edbb5f"
                  variant="filled"
                  className="text-black wide-button"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>

              {/* <div className="add-question">
                <div className="add-question-inner">
                  <div className="add-question-btn-div">
                    <Tooltip title="Add Question">
                      <IconButton
                        onClick={handleAddQuestion}
                        className="text-white"
                      >
                        <AddCircleOutlineRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="dashboard-tab-pane"
            role="tabpanel"
            aria-labelledby="dasboard-tab"
            tabIndex="0"
          >
            <Dashboard />
          </div>
          <div
            className="tab-pane fade"
            id="settings-tab-pane"
            role="tabpanel"
            aria-labelledby="settings-tab"
            tabIndex="0"
          >
            {console.log("Form Groups", formGroups)}
            {console.log("Form Parent Groups", formParentGroups)}
            <Settings
              content={formGroups}
              updateFormGroup={updateFormGroup}
              updateFormParentGroup={updateFormParentGroup}
              handleDeleteFormGroup={handleDeleteFormGroup}
              handleAddFormGroup={handleAddFormGroup}
              formParentGroups={formParentGroups}
              handleAddParentFormGroup={handleAddParentFormGroup}
              handleDeleteParentFormGroup={handleDeleteParentFormGroup}
              handleAddChildFormGroup={handleAddFormGroup}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
