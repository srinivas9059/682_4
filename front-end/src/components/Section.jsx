import React from "react";
import { Box } from "@mui/material";
import SortableQuestion from "./SortableQuestion";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function Section({
  section,
  updateQuestion,
  handleDragEnd,
  handleDeleteSection,
  handleAddQuestion,
  handleDeleteQuestion,
  handleDuplicateQuestion,
}) {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const handleDeleteQuestions = (questionID) => {
    handleDeleteQuestion(section.sectionID, questionID);
  };
  const updateQuestions = (question) => {
    updateQuestion(section.sectionID, question.questionID, question);
  };
  const handleDuplicateQuestions = (questionID) => {
    handleDuplicateQuestion(section.sectionID, questionID);
  };

  for (let i = 0; i < section.questions.length; i++) {
    console.log("Questionid", section.questions[i].questionID);
  }

  return (
    <Box
      className="section-box"
      sx={{
        /*  border: "2px solid black",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        backgroundColor: "#F0F0F0",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",

        "&:hover": {
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
          borderColor: "#007BFF", */
        border: "1px solid rgba(237, 187, 95, 0.2)",
        padding: "10px",
        borderRadius: "10px",
        margin: "30px",
        backgroundColor: "#F0F0F5", //"rgba(237, 187, 95, 0.2)",
        boxShadow: "1px 4px 6px rgba(0.1,0.1,0.1,0.2)",
        transition: "all 0.3s ease",

        "&:hover": {
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
          borderColor: "rgba(51,51,51,0.8)",
        },
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={section.questions.map((q) => {
            return { id: q.questionID, ...q };
          })}
          strategy={verticalListSortingStrategy}
        >
          {section.questions.length > 0 ? (
            section.questions.map((question, index) => (
              <SortableQuestion
                // key={question.questionID + "-" + index}
                key={question.questionID}
                id={question.questionID}
                index={index}
                content={question}
                updateQuestion={updateQuestions}
                handleDeleteQuestion={handleDeleteQuestions}
                handleDuplicateQuestion={handleDuplicateQuestions}
              />
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#333333" }}>
              No questions yet. Add some!
            </p>
          )}
        </SortableContext>
      </DndContext>
      <div className="add-question">
        <div className="add-question-inner">
          <div className="add-question-btn-div">
            <Tooltip title="Add Question">
              <IconButton
                onClick={() => handleAddQuestion(section.sectionID)}
                className="text-white"
              >
                <AddCircleOutlineRoundedIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default Section;
