import { TextInput } from "@mantine/core";

function FormTitleDescription({ store, formContent }) {
  return (
    <div className="form-title-description">
      <div className="form-title-description-inner p-3">
        {/* <input
          type="text"
          id="form-title"
          placeholder="Form Title"
          className="form-control"
          defaultValue={formContent[0]}
          onChange={(e) => {
            store([e.target.value, formContent[1]]);
          }}
        /> */}
        <TextInput
          variant="filled"
          label="Title"
          size="md"
          placeholder="Enter Title"
          className="mb-4"
          styles={{
            label: {
              fontSize: 20,
              color: "#585858",
              marginBottom: "7px",
              fontWeight: "bold",
            },
          }}
          defaultValue={formContent[0]}
          onChange={(e) => {
            store([e.target.value, formContent[1]]);
          }}
        />
        <TextInput
          variant="filled"
          label="Description"
          size="md"
          placeholder="Enter Description"
          className="mb-3"
          styles={{
            label: {
              color: "#585858",
              marginBottom: "7px",
            },
          }}
          defaultValue={formContent[1]}
          onChange={(e) => {
            store([formContent[0], e.target.value]);
          }}
        />
        {/* <input
          type="text"
          id="form-description"
          placeholder="Form Description"
          className="form-control"
          defaultValue={formContent[1]}
          onChange={(e) => {
            store([formContent[0], e.target.value]);
          }}
        /> */}
      </div>
    </div>
  );
}

export default FormTitleDescription;
