import React from "react";
import { Box } from "@mui/material";
import SortableQuestion from "./SortableQuestion";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
<<<<<<< HEAD
=======
import DeleteIcon from "@mui/icons-material/Delete"; // 🧩 Import your delete icon
>>>>>>> srinivas-backendd
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
<<<<<<< HEAD
  arrayMove,
  rectSortingStrategy,
=======
>>>>>>> srinivas-backendd
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function Section({
  section,
  updateQuestion,
  handleDragEnd,
<<<<<<< HEAD
  handleDeleteSection,
=======
  handleDeleteSection, // 🧩 We have this prop
>>>>>>> srinivas-backendd
  handleAddQuestion,
  handleDeleteQuestion,
  handleDuplicateQuestion,
}) {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
<<<<<<< HEAD
=======

>>>>>>> srinivas-backendd
  const handleDeleteQuestions = (questionID) => {
    handleDeleteQuestion(section.sectionID, questionID);
  };
  const updateQuestions = (question) => {
    updateQuestion(section.sectionID, question.questionID, question);
  };
  const handleDuplicateQuestions = (questionID) => {
    handleDuplicateQuestion(section.sectionID, questionID);
  };

<<<<<<< HEAD
  for (let i = 0; i < section.questions.length; i++) {
    console.log("Questionid", section.questions[i].questionID);
=======
  // 🧩 For debugging:
  for (let i = 0; i < section.questions.length; i++) {
    console.log("QuestionID", section.questions[i].questionID);
>>>>>>> srinivas-backendd
  }

  return (
    <Box
      className="section-box"
      sx={{
<<<<<<< HEAD
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
=======
>>>>>>> srinivas-backendd
        border: "1px solid rgba(237, 187, 95, 0.2)",
        padding: "10px",
        borderRadius: "10px",
        margin: "30px",
<<<<<<< HEAD
        backgroundColor: "#F0F0F5", //"rgba(237, 187, 95, 0.2)",
        boxShadow: "1px 4px 6px rgba(0.1,0.1,0.1,0.2)",
        transition: "all 0.3s ease",

=======
        backgroundColor: "#F0F0F5",
        boxShadow: "1px 4px 6px rgba(0.1,0.1,0.1,0.2)",
        transition: "all 0.3s ease",
>>>>>>> srinivas-backendd
        "&:hover": {
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
          borderColor: "rgba(51,51,51,0.8)",
        },
      }}
    >
<<<<<<< HEAD
=======
      {/* 🧩 We can add a small header with section ID or something */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* <h4>Section ID: {section.sectionID}</h4> */}

        {/* 🧩 Delete Entire Section */}
        <Tooltip title="Delete this entire section">
          <IconButton onClick={() => handleDeleteSection(section.sectionID)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>

>>>>>>> srinivas-backendd
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
<<<<<<< HEAD
          items={section.questions.map((q) => {
            return { id: q.questionID, ...q };
          })}
=======
          items={section.questions.map((q) => ({ id: q.questionID, ...q }))}
>>>>>>> srinivas-backendd
          strategy={verticalListSortingStrategy}
        >
          {section.questions.length > 0 ? (
            section.questions.map((question, index) => (
              <SortableQuestion
<<<<<<< HEAD
                // key={question.questionID + "-" + index}
=======
>>>>>>> srinivas-backendd
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
<<<<<<< HEAD
=======

>>>>>>> srinivas-backendd
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
