import DragHandleIcon from "@mui/icons-material/DragHandle";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Question from "./Question";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
function SortableQuestion({
  id,
  content,
  updateQuestion,
  handleDeleteQuestion,
  handleDuplicateQuestion,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandle = (
    <div
      className="drag-handle display-flex justify-center align-center"
      {...listeners}
      {...attributes}
      style={{
        cursor: "grab",
        alignContent: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <DragIndicatorIcon />
    </div>
  );
  return (
    <div ref={setNodeRef} style={style}>
      <Question
        id={id}
        content={content}
        updateQuestion={updateQuestion}
        handleDeleteQuestion={handleDeleteQuestion}
        handleDuplicateQuestion={handleDuplicateQuestion}
        dragHandle={dragHandle}
      />
    </div>
  );
}
export default SortableQuestion;
