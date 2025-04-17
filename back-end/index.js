import express from "express";
import randomstring from "randomstring";
import cors from "cors";
import mongoose from "mongoose";
import Form from "./models/formModel.js";
import "dotenv/config.js";

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("Connection to database failed !", err);
  });

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

// 🔥 createNewForm now reads formTitle from req.query or defaults to "Untitled Form"
app.get("/createNewForm", async (req, res) => {
  const { userID } = req.query;
  // Generate a random formID
  const formID = randomstring.generate(7);
  // If the front end provided ?formTitle=someValue, use it. Else "Untitled Form".
  let formTitle = req.query.formTitle || "Untitled Form";
  const formDescription = "";
  const formSections = []; // Initialize sections
  const formResponses = [];
  const defaultGroupID = randomstring.generate(7);
  console.log("Incoming formTitle param:", req.query.formTitle);
  console.log("Resolved final formTitle:", formTitle);
  const defaultParentGroupID = randomstring.generate(7);
  const formParentGroups = [
    {
      groupID: defaultParentGroupID,
      groupCode: "1",
      groupName: "Parent Group 1",
      childGroups: [defaultGroupID],
    },
  ];
  const formGroups = [
    {
      groupID: defaultGroupID,
      groupCode: "3",
      parentGroupID: defaultParentGroupID,
      groupName: "Group 1",
      groupLink: `${CLIENT_BASE_URL}/#/userform/${formID}/${defaultGroupID}`,
    },
  ];
  const formIsAcceptingResponses = true;

  try {
    const form = await Form.create({
      theme: {
        primaryColor: "#ffffff",
        fontFamily: "Arial",
        backgroundImage: "",
      },
      userID: userID,
      formID: formID,
      formTitle: formTitle,
      formDescription: formDescription,
      formSections: formSections,
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

app.put("/updateFormGroupTheme/:formID/:groupID", async (req, res) => {
  const { formID, groupID } = req.params;
  const { theme } = req.body;

  try {
    const form = await Form.findOne({ formID });
    if (!form) return res.status(404).json({ error: "Form not found" });

    let updated = false;

    form.formGroups = form.formGroups.map((group) => {
      if (group.groupID === groupID) {
        updated = true;
        return { ...group, theme: { ...group.theme, ...theme } };
      }
      return group;
    });

    form.formParentGroups = form.formParentGroups.map((parent) => {
      if (parent.groupID === groupID) {
        updated = true;
        return { ...parent, theme: { ...parent.theme, ...theme } };
      }
      return parent;
    });

    if (!updated) {
      return res.status(404).json({ error: "Group not found in the form" });
    }

    await form.save();
    res.status(200).json({ msg: "Theme updated", form });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/updateSection", async (req, res) => {
  const { formID, sectionID, questions } = req.body;
  try {
    const updatedForm = await Form.findOneAndUpdate(
      { formID: formID, "formSections.sectionID": sectionID },
      {
        $set: {
          "formSections.$.questions": questions,
        },
      },
      { new: true }
    );
    if (updatedForm) {
      res.status(200).json({ msg: "Section updated.", form: updatedForm });
    } else {
      res.status(404).json({ msg: "Form not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Updating section failed !", errorMsg: error.message });
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
    if (form) {
      res.status(200).json({ form: form });
    } else {
      res.status(404).json({ msg: "Form not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});

app.put("/updateForm", async (req, res) => {
  console.log("UPDATE FORM STARTED");
  console.log("PUT request received");
  console.log("Form Sections Received:", req.body.formSections);

  try {
    const form = await Form.findOne({ formID: req.body.formID });
    if (!form) {
      return res.status(404).json({ msg: "Form not found." });
    }

    console.log("Before Update:", JSON.stringify(form.formSections, null, 2));

    // Update sections and questions
    req.body.formSections.forEach((incomingSection, idx) => {
      let sectionIndex = form.formSections.findIndex(
        (s) => s.sectionID === incomingSection.sectionID
      );

      if (sectionIndex !== -1) {
        // Update existing section and questions
        form.formSections[sectionIndex] = incomingSection;
        form.markModified(`formSections.${sectionIndex}`);
      } else {
        // Add new section
        form.formSections.push(incomingSection);
        form.markModified(`formSections`);
      }
    });

    // Update other form properties
    form.formTitle = req.body.formTitle;
    form.formDescription = req.body.formDescription;
    form.formGroups = req.body.formGroups;
    form.formParentGroups = req.body.formParentGroups;

    // Save the entire document
    await form.save();

    console.log("After Update:", JSON.stringify(form.formSections, null, 2));
    console.log("UPDATE FORM ENDED");

    res.status(200).json({
      msg: "Form updated successfully.",
      updatedCount: form.formSections.length,
    });
  } catch (error) {
    console.error("Error during form update:", error);
    res
      .status(500)
      .json({ msg: "Error updating form", errorMsg: error.message });
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
    const groupName = req.query.parentGroupName;
    const formParentGroup = {
      groupID: defaultParentGroupID,
      groupCode: "1",
      groupName: groupName,
      childGroups: [],
    };
    console.log("Form Parent Group", formParentGroup);
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

app.get("/createNewChildFormGroup/:id", async (req, res) => {
  console.log("Create New Child Group API");
  try {
    const formCombinedGroupsObj = await Form.findOne(
      { formID: req.params.id },
      { formGroups: true, formParentGroups: true, _id: false }
    );
    console.log("Form Combined Groups", formCombinedGroupsObj);
    const formGroups = formCombinedGroupsObj.formGroups;
    const formParentGroups = formCombinedGroupsObj.formParentGroups;
    const defaultGroupID = randomstring.generate(7);
    const groupName = req.query.groupName;
    const groupID = req.query.groupID;
    console.log("Received Group ID", groupID);
    const parentGroupIndex = formParentGroups.findIndex(
      (pg) => pg.groupID === groupID
    );
    console.log(" Form Parent Groups group Index", parentGroupIndex);
    if (parentGroupIndex === -1) {
      console.log(" Not in Parent Groups");

      console.log(
        " Form child Parent Groups",
        formParentGroups[parentGroupIndex]
      );
      const childParentGroupIndex = formGroups.findIndex(
        (g) => g.groupID === groupID
      );
      console.log(" Form child Groups group Index", childParentGroupIndex);
      console.log(
        " Form child Groups before adding ",
        formGroups[childParentGroupIndex].childGroups
      );
      formGroups[childParentGroupIndex].childGroups.push(defaultGroupID);
      console.log(
        "New Child Group Added in form groups at the ",
        childParentGroupIndex,
        "position in formGroups"
      );
      console.log(
        " Form child Groups after adding",
        formGroups[childParentGroupIndex].childGroups
      );
    } else {
      console.log(" Form Groups group Index", parentGroupIndex);
      console.log(" Form Parent Groups", formParentGroups[parentGroupIndex]);
      console.log(
        " Form Parent Groups child Groups before adding",
        formParentGroups[parentGroupIndex].childGroups
      );
      formParentGroups[parentGroupIndex].childGroups.push(defaultGroupID);
      console.log(
        "New Child Group Added in form parent groups at the ",
        parentGroupIndex,
        "position in formGroups"
      );
      console.log(
        " Form Parent Groups child Groups after adding",
        formParentGroups[parentGroupIndex].childGroups
      );
    }
    const formGroup = {
      groupID: defaultGroupID,
      groupCode: "2",
      parentGroupID: groupID,
      groupName: groupName,
      childGroups: [],
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
    const groupID = req.query.groupID;
    const parentGroupIndex = formParentGroups.findIndex(
      (pg) => pg.groupID === groupID
    );
    if (parentGroupIndex === -1) {
      const childParentGroupIndex = formGroups.findIndex(
        (g) => g.groupID === groupID
      );
      console.log(
        " Form child Groups before adding ",
        formGroups[childParentGroupIndex].childGroups
      );
      formGroups[childParentGroupIndex].childGroups.push(defaultGroupID);
      console.log(
        "New Child Group Added in form groups at the ",
        childParentGroupIndex,
        "position in formGroups"
      );
      console.log(
        " Form child Groups after adding",
        formGroups[childParentGroupIndex].childGroups
      );
    } else {
      console.log(
        " Form Parent Groups child Groups before adding",
        formParentGroups[parentGroupIndex].childGroups
      );
      formParentGroups[parentGroupIndex].childGroups.push(defaultGroupID);
      console.log(
        "New Child Group Added in form parent groups at the ",
        parentGroupIndex,
        "position in formGroups"
      );
      console.log(
        " Form Parent Groups child Groups after adding",
        formParentGroups[parentGroupIndex].childGroups
      );
    }
    const formGroup = {
      groupID: defaultGroupID,
      groupCode: "3",
      parentGroupID: groupID,
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
    console.log("Updated Form groups", formGroups);
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
    if (!form) {
      return res.status(404).json({ msg: "Form not found." });
    }

    const groupResponses = {};

    // Initialize groupResponses with group IDs
    form.formGroups.forEach((group) => {
      if (group.groupCode === "3") {
        groupResponses[group.groupID] = {
          groupID: group.groupID,
          groupName: group.groupName,
          sections: {},
        };
      } else {
        groupResponses[group.groupID] = {
          groupID: group.groupID,
          groupName: group.groupName,
          childGroups: group.childGroups,
          sections: {},
        };
      }
    });

    // Process each section and question
    form.formSections.forEach((section) => {
      section.questions.forEach((q) => {
        // Initialize sections and questions for each group
        form.formGroups.forEach((group) => {
          const groupSection = groupResponses[group.groupID].sections;
          if (!groupSection[section.sectionID]) {
            groupSection[section.sectionID] = {
              sectionID: section.sectionID,
              questions: [],
            };
          }

          let subData = {};
          if (q.questionType === 1) {
            q.options.forEach((option) => {
              subData[option.optionValue] = 0; // Initialize option counts for MCQ
            });
          } else if (q.questionType === 3) {
            subData = new Array(q.upperLimit).fill(0); // Initialize scale counts
          }

          const questionObj = {
            questionID: q.questionID,
            question: q.question,
            questionType: q.questionType,
            responses: [],
            subData: subData,
          };

          if (q.questionType === 1) {
            questionObj.options = q.options;
          }

          if (q.questionType === 3) {
            questionObj.upperLimit = q.upperLimit;
            questionObj.labels = q.labels;
          }

          console.log("Question Type", q.questionType);
          console.log("Question Obj", questionObj);
          console.log("-----------------done-----------------");

          // Gather responses per group and update subData accordingly
          form.formResponses.forEach((r) => {
            if (r.userGroupID === group.groupID) {
              r.userResponse.forEach((uRes) => {
                if (uRes.questionID === q.questionID) {
                  questionObj.responses.push(uRes.answer);
                  if (
                    q.questionType === 1 &&
                    subData.hasOwnProperty(uRes.answer)
                  ) {
                    subData[uRes.answer]++;
                  } else if (q.questionType === 3) {
                    const index = parseInt(uRes.answer) - 1;
                    if (index >= 0 && index < subData.length) {
                      subData[index]++;
                    }
                  }
                }
              });
            }
          });

          groupSection[section.sectionID].questions.push(questionObj);
        });
      });
    });

    form.formSections.forEach((section) => {
      section.questions.forEach((q) => {
        form.formGroups.forEach((group) => {
          console.log(
            "groupResponses[group.groupID].sections",
            groupResponses[group.groupID].sections
          );
          console.log(
            "groupResponses[group.groupID].questions",
            groupResponses[group.groupID].sections[section.sectionID].questions
          );
        });
      });
    });

    res.status(200).json({
      groupResponses: Object.values(groupResponses),
      numberOfResponses: form.formResponses.length,
      formGroups: form.formGroups,
      formParentGroups: form.formParentGroups,
      formSections: form.formSections,
      msg: "Summary Data and number of responses sent.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error retrieving form data", errorMsg: error.message });
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
        groupID: defaultParentGroupID,
        groupName: "Parent Group 1",
        childGroups: [defaultGroupID],
      },
    ];

    const duplicateForm = await Form.create({
      userID: form.userID,
      formID: newFormID,
      formTitle: `Copy of ${form.formTitle}`,
      formDescription: form.formDescription,
      formSections: JSON.parse(JSON.stringify(form.formSections)), // Duplicate sections
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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ...`);
});
