import { useEffect, useState } from "react";
import FormTitleDescription from "./FormTitleDescription";
import SortableQuestion from "./SortableQuestion";
import Settings from "./Settings";
import Dashboard from "./Dashboard";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function Form() {
  const [questions, setQuestions] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formGroups, setFormGroups] = useState([]);
  const [formParentGroups, setFormParentGroups] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!currentUser) navigate("/login");
    const fetchData = async () => {
      const response = await fetch(
        `${BACKEND_URL}/getFormData/${localStorage.getItem("formID")}`,
        {
          method: "GET",
        }
      );
      const json = await response.json();
      setFormTitle(json.form.formTitle);
      setFormDescription(json.form.formDescription);
      setFormGroups(json.form.formGroups);
      setFormParentGroups(json.form.formParentGroups);
      if (json.form.formQuestions.length !== 0)
        setQuestions(json.form.formQuestions);
    };
    fetchData();
  }, []);

  const storeTitleDescription = (arr) => {
    setFormTitle(arr[0]);
    setFormDescription(arr[1]);
  };

  const updateQuestion = (newQ) => {
    setQuestions((oldQuestions) => {
      const index = oldQuestions.findIndex(
        (q) => q.questionID === newQ.questionID
      );
      const newQuestions = [...oldQuestions];
      newQuestions[index] = newQ;
      return newQuestions;
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setQuestions((questions) => {
        const oldIndex = questions.findIndex((q) => q.questionID === active.id);
        const newIndex = questions.findIndex((q) => q.questionID === over.id);
        return arrayMove(questions, oldIndex, newIndex);
      });
    }
  };

  const handleDeleteQuestion = (id) => {
    setQuestions((oldQuestions) => {
      const newQuestions = oldQuestions.filter((q) => q.questionID !== id);
      return newQuestions;
    });
  };

  const handleAddQuestion = () => {
    setQuestions((q) => [
      ...q,
      {
        questionID: Math.floor(Math.random() * 9000) + 1000,
        questionType: 1,
        question: "",
        options: [
          {
            optionID: Math.random().toString(36).substring(2, 10),
            optionValue: "",
          },
        ],
      },
    ]);
  };

  const handleDuplicateQuestion = (q) => {
    let duplicateQuestion;
    if (q.questionType == 1)
      duplicateQuestion = {
        questionID: Math.floor(Math.random() * 9000) + 1000,
        questionType: 1,
        question: `[COPY] ${q.question}`,
        options: q.options,
      };
    else if (q.questionType == 2)
      duplicateQuestion = {
        questionID: Math.floor(Math.random() * 9000) + 1000,
        questionType: 2,
        question: `[COPY] ${q.question}`,
      };
    else if (q.questionType == 3)
      duplicateQuestion = {
        questionID: Math.floor(Math.random() * 9000) + 1000,
        questionType: 3,
        question: `[COPY] ${q.question}`,
        upperLimit: q.upperLimit,
        labels: q.labels,
      };
    setQuestions((q) => [...q, duplicateQuestion]);
  };

  const updateFormGroup = (newG) => {
    setFormGroups((oldGroups) => {
      const index = oldGroups.findIndex((g) => g.groupID === newG.groupID);
      const newGroups = [...oldGroups];
      newGroups[index] = newG;
      return newGroups;
    });
  };

  const handleDeleteParentFormGroup = (id) => {
    if (formParentGroups.length === 1)
      alert("Cannot delete. Only 1 form group is present !");
    else {
      setFormParentGroups((oldGroups) => {
        const newGroups = oldGroups.filter((g) => g.parentGroupID !== id);
        return newGroups;
      });
      notifications.show({
        color: "#edbb5f",
        message: "Group Deleted",
        autoClose: 2500,
      });
    }
  };

  const handleDeleteFormGroup = (id, parentGroupID) => {
    if (formGroups.length === 1)
      alert("Cannot delete. Only 1 form group is present !");
    else {
      setFormParentGroups((oldFormParentGroups) => {
        const indexTemp = oldFormParentGroups.findIndex(
          (parentGroup) => parentGroup.parentGroupID === parentGroupID
        );
        const newFormParentGroups = oldFormParentGroups;
        newFormParentGroups[indexTemp].childGroups = oldFormParentGroups[
          indexTemp
        ].childGroups.filter((groupID) => groupID !== id);
        return newFormParentGroups;
      });

      setFormGroups((oldGroups) => {
        return oldGroups.filter((g) => g.groupID !== id);
      });

      notifications.show({
        color: "#edbb5f",
        message: "Group Deleted",
        autoClose: 2500,
      });
    }
  };

  const handleAddFormGroup = async (groupName, parentGroupID) => {
    const id = localStorage.getItem("formID");
    const response = await fetch(
      `${BACKEND_URL}/createNewFormGroup/${id}?groupName=${groupName}&parentGroupID=${parentGroupID}`,
      {
        method: "GET",
      }
    );
    const json = await response.json();
    const newGroup = json.formGroup;
    setFormGroups((oldFormGroups) => [...oldFormGroups, newGroup]);
    setFormParentGroups(json.formParentGroups);
  };

  const handleAddParentFormGroup = async (parentGroupName) => {
    const id = localStorage.getItem("formID");
    const response = await fetch(
      `${BACKEND_URL}/createNewParentFormGroup/${id}?parentGroupName=${parentGroupName}`,
      {
        method: "GET",
      }
    );
    const json = await response.json();
    const newParentGroup = json.formParentGroup;
    setFormParentGroups((oldFormParentGroups) => [
      ...oldFormParentGroups,
      newParentGroup,
    ]);
  };

  const handleSave = async () => {
    const id = localStorage.getItem("formID");
    const response = await fetch(`${BACKEND_URL}/updateForm`, {
      method: "PUT",
      body: JSON.stringify({
        formID: id,
        formTitle: formTitle,
        formDescription: formDescription,
        formQuestions: questions,
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
          <div>
            <Button
              color="#edbb5f"
              variant="filled"
              className="text-black"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={questions.map((q) => q.questionID)}
                  strategy={verticalListSortingStrategy}
                >
                  {questions.map((question) => (
                    <SortableQuestion
                      key={question.questionID}
                      handleDeleteQuestion={handleDeleteQuestion}
                      id={question.questionID}
                      content={question}
                      updateQuestion={updateQuestion}
                      handleDuplicateQuestion={handleDuplicateQuestion}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              <div className="add-question">
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
              </div>
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
            <Settings
              content={formGroups}
              updateFormGroup={updateFormGroup}
              handleDeleteFormGroup={handleDeleteFormGroup}
              handleAddFormGroup={handleAddFormGroup}
              formParentGroups={formParentGroups}
              handleAddParentFormGroup={handleAddParentFormGroup}
              handleDeleteParentFormGroup={handleDeleteParentFormGroup}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
