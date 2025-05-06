import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { notifications } from "@mantine/notifications";

function FormListItem({
  title,
  id,
  handleDeleteFormListItem,
  handleDuplicateFormListItem,
}) {
  const navigate = useNavigate();
  const handleOpenForm = () => {
    localStorage.setItem("formID", id);
    navigate(`/form/${id}`);
  };

  return (
    <div className="form-list-item">
      <div className="form-title-list-item" onClick={handleOpenForm}>
        {title}
      </div>
      <div
        className="duplicate-form-list-item"
        onClick={() => {
          handleDuplicateFormListItem(id);
          notifications.show({
            color: "#edbb5f",
            message: "Form Duplicated",
            autoClose: 2500,
          });
        }}
      >
        <ContentCopyIcon />
      </div>
      <div
        className="delete-form-list-item"
        onClick={() => {
          handleDeleteFormListItem(id);
          notifications.show({
            color: "#edbb5f",
            message: "Form Deleted",
            autoClose: 2500,
          });
        }}
      >
        <DeleteIcon />
      </div>
    </div>
  );
}

export default FormListItem;
