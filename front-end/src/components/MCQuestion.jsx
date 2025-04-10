import React, { useState, useRef } from "react";
import { TextInput } from "@mantine/core";
import { Radio } from "@mantine/core";
import { CSS } from "@dnd-kit/utilities";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  KeyboardSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import SortableOption from "./SortableOption";

function MCQuestion({ content, updateQuestion }) {
  var mcQuestion = {
    questionID: content.questionID,
    questionType: content.questionType,
    question: content.question,
    options: content.options,
  };

  const id = content.questionID;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: closestCenter })
  );



  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandle = (
    <div {...listeners} {...attributes} style={{ cursor: "grab" }}>
      <DragHandleIcon />
    </div>
  );



  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = content.options.findIndex(
        (option) => option.optionID === active.id
      );
      const newIndex = content.options.findIndex(
        (option) => option.optionID === over.id
      );
      const newOptions = arrayMove(content.options, oldIndex, newIndex);
      updateQuestion({
        ...content,
        options: newOptions,
      });
    }
  };

  const handleDeleteOption = (optionID) => {
    const updatedOptions = content.options.filter(
      (option) => option.optionID !== optionID
    );
    updateQuestion({
      ...content,
      options: updatedOptions,
    });
  };

  const handleOptionChange = (optionID, value) => {
    const updatedOptions = content.options.map((option) =>
      option.optionID === optionID ? { ...option, optionValue: value } : option
    );
    updateQuestion({
      ...content,
      options: updatedOptions,
    });
  };

  return (
    <div className="mcq-question">
      <div className="question-mcq-type">
        <TextInput
          variant="filled"
          label="Question"
          placeholder="Enter Question"
          className="mb-3"
          styles={{
            label: {
              color: "#585858",
              marginBottom: "7px",
              fontSize: 17,
            },
          }}
          onChange={(e) => {
            mcQuestion.question = e.target.value;
            //console.log(mcQuestion.question);
            updateQuestion(mcQuestion);
          }}
          value={content.question}
        />
      </div>
      <div className="all-options">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={content.options.map((opt) => opt.optionID)}
            strategy={verticalListSortingStrategy}
          >
            {content.options.map((option) => (
              <SortableOption
                key={option.optionID}
                id={option.optionID}
                value={option.optionValue}
                onChange={(newValue) =>
                  handleOptionChange(option.optionID, newValue)
                }
                onDelete={() => handleDeleteOption(option.optionID)}
              />
            ))}
          </SortableContext>
        </DndContext>
        <div className="add-option">
          <Radio className="align-self-center me-2" color="#edbb5f" disabled />
          <TextInput
            variant="filled"
            readOnly={true}
            placeholder={`Add option`}
            onClick={(e) => {
              mcQuestion.options.push({
                optionID: Math.random().toString(36).substring(2, 10),
                optionValue: "",
              });
              updateQuestion(mcQuestion);
              e.target.blur();
            }}
            className="w-100"
          />
        </div>
      </div>
    </div>
  );
}

export default MCQuestion;
