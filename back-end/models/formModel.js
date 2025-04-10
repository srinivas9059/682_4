import mongoose from "mongoose";
/* 
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
 */
// const QuestionSchema = new mongoose.Schema({
//   type: [mongoose.Schema.Types.Mixed],
//   _id: false,
// });

const SectionSchema = new mongoose.Schema({
  sectionID: String,
  questions: [{ type: mongoose.Schema.Types.Mixed }],
  _id: false,
});

const FormSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: false },
    formID: { type: String, required: true, unique: true },
    formTitle: { type: String },
    formDescription: { type: String },
    formSections: [SectionSchema], // Include sections in the form
    formResponses: [{ type: mongoose.Schema.Types.Mixed }],
    formGroups: [{ type: mongoose.Schema.Types.Mixed }],
    formParentGroups: [{ type: mongoose.Schema.Types.Mixed }],
    formIsAcceptingResponses: { type: Boolean },
    theme: {
      primaryColor: { type: String, default: "#ffffff" },
      fontFamily: { type: String, default: "Arial" },
      backgroundImage: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.model("Form", FormSchema);

export default Form;
