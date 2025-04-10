import mongoose from "mongoose";

const FormSchema = mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
      unique: false,
    },
    formID: {
      type: String,
      required: true,
      unique: true,
    },
    formTitle: {
      type: String,
    },
    formDescription: {
      type: String,
    },
    formQuestions: {
      type: [mongoose.Schema.Types.Mixed],
    },
    formResponses: {
      type: [mongoose.Schema.Types.Mixed],
    },
    formGroups: {
      type: [mongoose.Schema.Types.Mixed],
    },
    formParentGroups: {
      type: [mongoose.Schema.Types.Mixed],
    },
    formIsAcceptingResponses: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.model("Form", FormSchema);

export default Form;
