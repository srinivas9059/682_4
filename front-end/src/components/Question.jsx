import MCQuestion from "./MCQuestion";
import { useState } from "react";
import SAQuestion from "./SAQuestion";
import DeleteIcon from "@mui/icons-material/Delete";
import { Select } from "@mantine/core";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { notifications } from "@mantine/notifications";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LSQuestion from "./LSQuestion";

function Question({
  handleDeleteQuestion,
  id,
  content,
  updateQuestion,
  handleDuplicateQuestion,
  dragHandle,
}) {

  const [questionType, setQuestionType] = useState(content.questionType);

  const handleDeleteQuestions = (id) => {
    console.log("iding", id);
    handleDeleteQuestion(id);
  };

  return (
    <div className="form-question">
      <div className="form-question-handle flex items-center cursor-grab">
        {dragHandle}
      </div>
      <div className="form-question-inner p-3">
        {questionType == 1 && (
          <MCQuestion content={content} updateQuestion={updateQuestion} />
        )}
        {questionType == 2 && (
          <SAQuestion content={content} updateQuestion={updateQuestion} />
        )}
        {questionType == 3 && (
          <LSQuestion content={content} updateQuestion={updateQuestion} />
        )}
        <div className="question-type-selection">
          <div className="question-types">
            <div>
              <Select
                data={["Multiple Choice", "Short Answer", "Likert Scale"]}
                defaultValue={
                  questionType == 1
                    ? "Multiple Choice"
                    : questionType == 2
                    ? "Short Answer"
                    : "Likert Scale"
                }
                allowDeselect={false}
                checkIconPosition="right"
                onChange={(_value) => {
                  if (questionType !== 1 && _value === "Multiple Choice") {
                    setQuestionType(1);
                    updateQuestion({
                      questionID: content.questionID,
                      questionType: 1,
                      question: content.question,
                      options: [{}],
                    });
                  } else if (questionType !== 2 && _value === "Short Answer") {
                    setQuestionType(2);
                    updateQuestion({
                      questionID: content.questionID,
                      questionType: 2,
                      question: content.question,
                    });
                  } else if (questionType !== 3 && _value === "Likert Scale") {
                    setQuestionType(3);
                    updateQuestion({
                      questionID: content.questionID,
                      questionType: 3,
                      question: content.question,
                      upperLimit: "5",
                      labels: ["", "", "", "", ""],
                    });
                  }
                }}
              />
            </div>
          </div>
          <div className="question-delete-div">
            <div>
              <Tooltip title="Duplicate Question">
                <IconButton
                  onClick={() => {
                    handleDuplicateQuestion(content);
                    notifications.show({
                      color: "#edbb5f",
                      message: "Question Duplicated",
                      autoClose: 2500,
                    });
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="Delete Question">
                <IconButton
                  onClick={() => {
                    handleDeleteQuestions(id);
                    notifications.show({
                      color: "#edbb5f",
                      message: "Question Deleted",
                      autoClose: 2500,
                    });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question;
