import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Radio } from "@mantine/core";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { TextInput } from "@mantine/core";
import DragHandleIcon from "@mui/icons-material/DragHandle";

export default function SortableOption({ id, value, onChange, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="option">
      <Radio className="align-self-center me-2" color="#4c8e7e" disabled />
      <TextInput
        variant="filled"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mb-2 w-100"
      />

      <div
        {...attributes}
        {...listeners}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        <Tooltip title="Drag">
          <IconButton>
            <DragHandleIcon />
          </IconButton>
        </Tooltip>
      </div>
      <Tooltip title="Remove">
        <IconButton onClick={onDelete}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
