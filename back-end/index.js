import express from "express";
import randomstring from "randomstring";
import cors from "cors";
import mongoose from "mongoose";
import Form from "./models/formModel.js";
import "dotenv/config.js";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const PORT = process.env.PORT || 8000;
const app = express();
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;

app.use(express.json());
app.use(
  cors({
    origin: "*", // ⚠️ This allows all origins - use only for testing
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });

// Base Route
app.get("/", async (req, res) => {
  const forms = await Form.find({});
  res.json(forms);
});

app.get("/ping", async (req, res) => {
  res.json({ msg: "Active" });
});

// AI Assistant Route (Groq API)
app.post("/ask-ai", async (req, res) => {
  const { question, surveyData } = req.body;

  if (
    !question ||
    !surveyData ||
    !surveyData.questions ||
    !surveyData.summary
  ) {
    return res.status(400).json({
      error: "Missing required fields: 'question', 'questions', 'summary'.",
    });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("❌ Missing GROQ API key.");
    return res.status(500).json({ error: "Groq API key is not set." });
  }

  let summaryString = "Summary:\n";
  try {
    for (const [groupName, groupData] of Object.entries(surveyData.summary)) {
      summaryString += `\nGroup: ${groupName}\n`;
      for (const [sectionID, section] of Object.entries(groupData.sections || {})) {
        summaryString += `  Section ${sectionID}:\n`;
        section.questions?.forEach((q) => {
          summaryString += `    - Q: ${q.question}\n`;

          if (q.questionType === 1 && q.subData) {
            const options = Object.entries(q.subData)
              .map(([opt, count]) => `${opt}: ${count}`)
              .join(", ");
            summaryString += `      Options: ${options}\n`;
          }

          if (q.questionType === 3 && Array.isArray(q.subData)) {
            summaryString += `      Scale Counts: ${q.subData.join(", ")}\n`;
          }

          if (q.questionType === 2 && Array.isArray(q.subData)) {
            const answers = q.subData.join(", ");
            summaryString += `      Answers: ${answers}\n`;
          }
        });
      }
    }
  } catch (err) {
    summaryString += "⚠️ Error formatting summary.\n";
  }

  const systemPrompt = `
You are an expert AI assistant designed to analyze and interpret survey results.

Survey Title: ${surveyData.title}

Survey Questions:
${surveyData.questions
  .map((q, i) => `${i + 1}. ${q.text} [type=${q.questionType}]`)
  .join("\n")}

${summaryString}

Your job is to help the user understand group-wise survey patterns and summaries.
Provide clear, specific, and insightful answers based strictly on the provided survey data.

You may:
- Compare results across different respondent groups
- Summarize key trends or deviations
- Comment on response rates, biases, or engagement
- Avoid assumptions or generalizations not grounded in the summary

Keep your tone helpful, concise, and analytical.
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.choices?.[0]?.message?.content) {
      return res.status(500).json({
        error: `Groq error: ${data?.error?.message || "Unknown error"}`,
      });
    }

    res.status(200).json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error("❌ Groq Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// Get All Form Responses
app.get("/getAllFormResponses/:id", async (req, res) => {
  try {
    const form = await Form.findOne({ formID: req.params.id });
    if (!form) return res.status(404).json({ msg: "Form not found." });

    return res.status(200).json({
      formTitle: form.formTitle,
      formID: form.formID,
      formSections: form.formSections,
      formResponses: form.formResponses,
    });
  } catch (error) {
    console.error("Error fetching form responses:", error);
    return res
      .status(500)
      .json({ msg: "Failed to fetch form responses", error: error.message });
  }
});

// 🔥 createNewForm now reads formTitle from req.query or defaults to "Untitled Form"
app.get("/createNewForm", async (req, res) => {
  const { userID } = req.query;
  // Generate a random formID
  const formID = randomstring.generate(7);
  // If the front end provided ?formTitle=someValue, use it. Else "Untitled Form".
  let formTitle = req.query.formTitle || "Untitled Form";
  const groupName = req.query.groupName || "Group 1"; // fallback if not provided

  const formDescription = "";
  const formSections = []; // Initialize sections
  const formResponses = [];
  const defaultGroupID = randomstring.generate(7);
  console.log("Incoming formTitle param:", req.query.formTitle);
  console.log("Resolved final formTitle:", formTitle);
  const defaultParentGroupID = randomstring.generate(7);
  const formGroups = [
    {
      groupID: defaultGroupID,
      groupCode: "3",
      parentGroupID: defaultParentGroupID,
      groupName: groupName,
      groupLink: `${CLIENT_BASE_URL}/#/userform/${formID}/${defaultGroupID}`,

      childGroups: [], // ✅ always include this!
    },
  ];

  const formParentGroups = [
    {
      groupID: defaultParentGroupID,
      groupCode: "1", // ✅ must add
      groupName: "Parent Group 1",
      childGroups: [defaultGroupID],
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
  try {
    // Find and update *and* return the new document in one shot:
    const updatedForm = await Form.findOneAndUpdate(
      { formID: req.body.formID },
      {
        $set: {
          formTitle: req.body.formTitle,
          formDescription: req.body.formDescription,
          formSections: req.body.formSections,
          formGroups: req.body.formGroups,
          formParentGroups: req.body.formParentGroups,
        },
      },
      { new: true } // ← return the updated document
    );

    if (!updatedForm) {
      return res.status(404).json({ msg: "Form not found." });
    }

    // Send the *whole* updated form back
    res.status(200).json({
      msg: "Form updated successfully.",
      form: updatedForm,
    });
  } catch (error) {
    console.error("Error updating form:", error);
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
      parentGroupID: defaultParentGroupID,

      groupName: groupName,
      groupLink: `${CLIENT_BASE_URL}/#/userform/${formID}/${defaultGroupID}`,

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
    const form = await Form.findOne({ formID: req.params.id });
    if (!form) return res.status(404).json({ error: "Form not found" });

    const groupName = req.query.groupName;
    const parentGroupID = req.query.groupID;

    const newGroupID = randomstring.generate(7);

    const newGroup = {
      groupID: newGroupID,
      groupCode: "3", // leaf
      groupName,
      parentGroupID,
      groupLink: `${process.env.CLIENT_BASE_URL}/#/userform/${form.formID}/${newGroupID}`,
      childGroups: [],
    };

    const parentInPG = form.formParentGroups.find(
      (pg) => pg.groupID === parentGroupID
    );
    const parentInFG = form.formGroups.find(
      (fg) => fg.groupID === parentGroupID
    );

    if (parentInPG) {
      parentInPG.childGroups.push(newGroupID);
    } else if (parentInFG) {
      parentInFG.childGroups.push(newGroupID);
    } else {
      return res.status(400).json({ error: "Invalid groupID" });
    }

    form.formGroups.push(newGroup);
    await form.save();

    res.status(200).json({ msg: "Group created", formGroup: newGroup });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
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
          } else if (q.questionType === 2) {
            subData = []; // Initialize array to collect SAQ responses
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

          // Gather responses per group and update subData accordingly
          form.formResponses.forEach((r) => {
            if (r.userGroupID === group.groupID) {
              r.userResponse.forEach((uRes) => {
                if (uRes.questionID === q.questionID) {
                  questionObj.responses.push(uRes.answer);

                  if (q.questionType === 1 && subData.hasOwnProperty(uRes.answer)) {
                    subData[uRes.answer]++;
                  } else if (q.questionType === 3) {
                    const index = parseInt(uRes.answer) - 1;
                    if (index >= 0 && index < subData.length) {
                      subData[index]++;
                    }
                  } else if (q.questionType === 2 && Array.isArray(subData)) {
                    subData.push(uRes.answer); // Store SAQ responses
                  }
                }
              });
            }
          });

          groupSection[section.sectionID].questions.push(questionObj);
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
    const defaultParentGroupID = randomstring.generate(7);

    const formGroups = [
      {
        groupID: defaultGroupID,
        groupCode: "3",
        parentGroupID: defaultParentGroupID,
        groupName: "Group 1",
        groupLink: `${CLIENT_BASE_URL}/#/userform/${newFormID}/${defaultGroupID}`,
        childGroups: [],
        theme: {
          primaryColor: "#ffffff",
          fontFamily: "Arial",
          backgroundImage: "",
        },
      },
    ];

    const formParentGroups = [
      {
        groupID: defaultParentGroupID,
        groupCode: "1",
        groupName: "Parent Group 1",
        childGroups: [defaultGroupID],
        theme: {
          primaryColor: "#ffffff",
          fontFamily: "Arial",
          backgroundImage: "",
        },
      },
    ];

    const duplicateForm = await Form.create({
      userID: form.userID,
      formID: newFormID,
      formTitle: `Copy of ${form.formTitle}`,
      formDescription: form.formDescription,
      formSections: JSON.parse(JSON.stringify(form.formSections)),
      formResponses: [],
      formGroups,
      formParentGroups,
      formIsAcceptingResponses: form.formIsAcceptingResponses,
    });

    res.status(200).json({ msg: "Form Duplicated.", form: duplicateForm });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "See error message !", errorMsg: error.message });
  }
});
