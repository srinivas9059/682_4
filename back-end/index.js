import express from "express";
import randomstring from "randomstring";
import cors from "cors";
import mongoose from "mongoose";
import Form from "./models/formModel.js";
import "dotenv/config.js";

const PORT = process.env.PORT;
const app = express();
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const forms = await Form.find({});
  res.json(forms);
});

app.get("/ping", async (req, res) => {
  res.json({ msg: "Active" });
});

app.get("/createNewForm", async (req, res) => {
  const { userID } = req.query;
  const formID = randomstring.generate(7);
  const formTitle = "";
  const formDescription = "";
  const formQuestions = [];
  const formResponses = [];
  const defaultGroupID = randomstring.generate(7);
  const formGroups = [
    {
      groupID: defaultGroupID,
      groupName: "Group 1",
      groupLink: `${CLIENT_BASE_URL}/#/userform/${formID}/${defaultGroupID}`,
    },
  ];
  const defaultParentGroupID = randomstring.generate(7);
  const formParentGroups = [
    {
      parentGroupID: defaultParentGroupID,
      parentGroupName: "Parent Group 1",
      childGroups: [defaultGroupID],
    },
  ];
  const formIsAcceptingResponses = true;
  try {
    const form = await Form.create({
      userID: userID,
      formID: formID,
      formTitle: formTitle,
      formDescription: formDescription,
      formQuestions: formQuestions,
      formResponses: formResponses,
      formGroups: formGroups,
      formParentGroups: formParentGroups,
      formIsAcceptingResponses: formIsAcceptingResponses,
    });
    res.status(200).json({ msg: "Form created.", form: form });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Form creation failed !", errorMsg: error.message });
  }
});

app.get("/getAllFormTitlesIDs", async (req, res) => {
  try {
    const { userID } = req.query;
    const allFormTitlesIDs = await Form.find(
      { userID: userID },
      { formID: true, formTitle: true, _id: false }
    );
    res.status(200).json({ allFormTitlesIDs: allFormTitlesIDs });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

app.delete("/deleteForm/:id", async (req, res) => {
  try {
    const result = await Form.deleteOne({ formID: req.params.id });
    if (result.deletedCount === 1)
      res.status(200).json({ msg: "Form Deleted." });
    else res.status(404).json({ msg: "Form not found." });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

app.get("/getFormData/:id", async (req, res) => {
  try {
    const form = await Form.findOne({ formID: req.params.id });
    if (form) res.status(200).json({ form: form });
    else res.status(404).json({ msg: "Form not found." });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

app.put("/updateForm", async (req, res) => {
  try {
    const updatedForm = {
      $set: {
        formTitle: req.body.formTitle,
        formDescription: req.body.formDescription,
        formQuestions: req.body.formQuestions,
        formGroups: req.body.formGroups,
        formParentGroups: req.body.formParentGroups,
      },
    };
    const result = await Form.updateOne(
      { formID: req.body.formID },
      updatedForm
    );
    if (result.modifiedCount === 1)
      res.status(200).json({ msg: "Form updated." });
    else res.status(404).json({ msg: "Form not found." });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

app.get("/createNewParentFormGroup/:id", async (req, res) => {
  try {
    const formParentGroupsObj = await Form.findOne(
      { formID: req.params.id },
      { formParentGroups: true, _id: false }
    );
    const formParentGroups = formParentGroupsObj.formParentGroups;
    const defaultParentGroupID = randomstring.generate(7);
    const parentGroupName = req.query.parentGroupName;
    const formParentGroup = {
      parentGroupID: defaultParentGroupID,
      parentGroupName: parentGroupName,
      childGroups: [],
    };
    formParentGroups.push(formParentGroup);
    const updatedForm = {
      $set: {
        formParentGroups: formParentGroups,
      },
    };
    const result = await Form.updateOne({ formID: req.params.id }, updatedForm);
    if (result.modifiedCount === 1)
      res.status(200).json({
        formParentGroup: formParentGroup,
        msg: "New parent form group created.",
      });
    else res.status(404).json({ msg: "Form not found." });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

app.get("/createNewFormGroup/:id", async (req, res) => {
  try {
    const formCombinedGroupsObj = await Form.findOne(
      { formID: req.params.id },
      { formGroups: true, formParentGroups: true, _id: false }
    );
    const formGroups = formCombinedGroupsObj.formGroups;
    const formParentGroups = formCombinedGroupsObj.formParentGroups;
    const defaultGroupID = randomstring.generate(7);
    const groupName = req.query.groupName;
    const parentGroupID = req.query.parentGroupID;
    const parentGroupIndex = formParentGroups.findIndex(
      (pg) => pg.parentGroupID === parentGroupID
    );
    formParentGroups[parentGroupIndex].childGroups.push(defaultGroupID);
    const formGroup = {
      groupID: defaultGroupID,
      groupName: groupName,
      groupLink: `${CLIENT_BASE_URL}/#/userform/${req.params.id}/${defaultGroupID}`,
    };
    formGroups.push(formGroup);
    const updatedForm = {
      $set: {
        formGroups: formGroups,
        formParentGroups: formParentGroups,
      },
    };
    const result = await Form.updateOne({ formID: req.params.id }, updatedForm);
    if (result.modifiedCount === 1)
      res.status(200).json({
        formGroup: formGroup,
        formParentGroups: formParentGroups,
        msg: "New form group created.",
      });
    else res.status(404).json({ msg: "Form not found." });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

app.post("/saveUserFormResponse", async (req, res) => {
  try {
    const formResponsesObj = await Form.findOne(
      { formID: req.body.formID },
      { formResponses: true, _id: false }
    );
    const formResponses = formResponsesObj.formResponses;
    formResponses.push(req.body.formResponse);
    const updatedForm = {
      $set: {
        formResponses: formResponses,
      },
    };
    const result = await Form.updateOne(
      { formID: req.body.formID },
      updatedForm
    );
    if (result.modifiedCount === 1)
      res.status(200).json({ msg: "Responses submitted." });
    else res.status(404).json({ msg: "Form not found." });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

app.get("/getSummaryDashboardData/:id", async (req, res) => {
  try {
    const form = await Form.findOne({ formID: req.params.id });
    console.log("form", form);
    if (form) {
      const numberOfResponses = form.formResponses.length;
      const summaryData = [];
      form.formQuestions.forEach((q) => {
        const norQuestion = form.formResponses.filter((r) => {
          if (
            r.userResponse.filter((qr) => qr.questionID === q.questionID)
              .length === 1
          )
            return true;
          else return false;
        }).length;
        var subData;
        if (q.questionType == 1) {
          console.log("q.options", q.options);
          q.options.forEach((option) => {
            subData = { ...subData, [option.optionValue]: 0 };
          });

          console.log("intial subData", subData);

          form.formResponses.forEach((r) => {
            const temp = r.userResponse.filter(
              (qr) => qr.questionID === q.questionID
            );
            if (temp[0]) subData[temp[0].answer] += 1;
          });

          console.log("safter  ubData", subData);
        } else if (q.questionType == 2) {
          subData = [];
          form.formResponses.forEach((r) => {
            const temp = r.userResponse.filter(
              (qr) => qr.questionID === q.questionID
            );
            if (temp[0]) subData.push(temp[0].answer);
          });
        } else if (q.questionType == 3) {
          subData = new Array(parseInt(q.upperLimit)).fill(0);
          form.formResponses.forEach((r) => {
            const temp = r.userResponse.filter(
              (qr) => qr.questionID === q.questionID
            );
            if (temp[0]) subData[parseInt(temp[0].answer) - 1] += 1;
          });
        }

        const totalData = {
          question: q.question,
          questionType: q.questionType,
          norQuestion: norQuestion,
          subData: subData,
        };
        if (q.questionType === 1) {
          totalData.options = q.options;
        }
        if (q.questionType === 3) {
          totalData.upperLimit = q.upperLimit;
          totalData.labels = q.labels;
        }
        summaryData.push(totalData);
      });
      res.status(200).json({
        summaryData: summaryData,
        numberOfResponses: numberOfResponses,
        formGroups: form.formGroups,
        formResponses: form.formResponses,
        formQuestions: form.formQuestions,
        formParentGroups: form.formParentGroups,
        msg: "Summary Data and number of responses sent.",
      });
    } else res.status(404).json({ msg: "Form not found." });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

app.post("/setIsAcceptingResponses", async (req, res) => {
  try {
    const updatedForm = {
      $set: {
        formIsAcceptingResponses: req.body.formIsAcceptingResponses,
      },
    };
    const result = await Form.updateOne(
      { formID: req.body.formID },
      updatedForm
    );
    if (result.modifiedCount === 1)
      res.status(200).json({ msg: "Updated FormIsAcceptingResponses." });
    else res.status(404).json({ msg: "Form not found." });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

app.get("/getFormIsAcceptingResponses/:id", async (req, res) => {
  try {
    const form = await Form.findOne({ formID: req.params.id });
    if (form)
      res
        .status(200)
        .json({ formIsAcceptingResponses: form.formIsAcceptingResponses });
    else res.status(404).json({ msg: "Form not found." });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

app.get("/duplicateForm/:id", async (req, res) => {
  try {
    const form = await Form.findOne({ formID: req.params.id });

    const newFormID = randomstring.generate(7);

    const defaultGroupID = randomstring.generate(7);
    const formGroups = [
      {
        groupID: defaultGroupID,
        groupName: "Group 1",
        groupLink: `${CLIENT_BASE_URL}/#/userform/${newFormID}/${defaultGroupID}`,
      },
    ];
    const defaultParentGroupID = randomstring.generate(7);
    const formParentGroups = [
      {
        parentGroupID: defaultParentGroupID,
        parentGroupName: "Parent Group 1",
        childGroups: [defaultGroupID],
      },
    ];

    const duplicateForm = await Form.create({
      userID: form.userID,
      formID: newFormID,
      formTitle: `Copy of ${form.formTitle}`,
      formDescription: form.formDescription,
      formQuestions: form.formQuestions,
      formResponses: [],
      formGroups: formGroups,
      formParentGroups: formParentGroups,
      formIsAcceptingResponses: form.formIsAcceptingResponses,
    });
    res.status(200).json({ msg: "Form Duplicated.", form: duplicateForm });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected to database.");
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT} ...`);
    });
  })
  .catch(() => {
    console.log("Connection to database failed !");
  });

/*

Form Array Object Template:

[
    {
      formID: formID,
      formTitle: formTitle,
      formDescription: formDescription,
      formQuestions: formQuestions,
      formResponses: formResponses,
      formGroups: formGroups
    }
]


Questions Array Object Template:

[
    {
        questionID: 1231
        questionType: 1,
        question: "aasdasdf sfsda  fsdfa",
        options: ["option1", "options2"]
    },
    {
        questionID: 1231
        questionType: 2,
        question: "aasdasdf sfsda  fsdfa"
    },
    {
        questionID: 1231
        questionType: 3,
        question: "aasdasdf sfsda  fsdfa",
        upperLimit: 5,
        labels: ["fas", "jhkjs", "asf", "fsad", "adfs"]
    }
]

Group Array Object Template:

[
    {
        groupID: "fsdfas",
        groupName: "fsadfsdf",
        groupLink: ".........."
    }
    {
      primaryGroupID: "fsdfas",
      primaryGroupName: "Campus 1",
      groups: [{
        groupID: "fsdfas",
        groupName: "fsadfsdf",
        groupLink: ".........."
    }]
    }
]

Response Array Object Template:

[
  {
    userResponseID: 4316
    userGroupID: "fkjsd"
    userResponse: [
      { questionID: 4333,
        answer: "gnskjd"
      }
    ]
  }
]

*/
