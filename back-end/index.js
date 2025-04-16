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

  app.put("/extendGroupExpiry/:formID/:groupID", async (req, res) => {
    const { formID, groupID } = req.params;
    const { extendByMinutes } = req.body;

    console.log("🛠️ BACKEND: Received extend request for:");
    console.log("Form ID:", formID);
    console.log("Group ID:", groupID);
    console.log("Extend by (mins):", extendByMinutes);    
  
    try {
      const form = await Form.findOne({ formID });

if (!form) {
  return res.status(404).json({ msg: "Form not found." });
}

const group = form.formGroups.find(g => g.groupID === groupID);
if (!group) {
  return res.status(404).json({ msg: "Group not found." });
}

// ✅ Extend even if it's expired
group.expiresAt = new Date(Date.now() + parseInt(extendByMinutes) * 60000);

await form.save();

    console.log("✅ New Expiry:", group.expiresAt);
  
      return res.status(200).json({
        msg: `Group expiry extended by ${extendByMinutes} minutes.`,
        newExpiresAt: group.expiresAt,
      });
    } catch (error) {
      return res.status(500).json({ msg: "Extension failed.", errorMsg: error.message });
    }
  });

  app.get("/createNewForm", async (req, res) => {
    const { userID } = req.query;
    const formID = randomstring.generate(7);
    const formTitle = "";
    const formDescription = "";
    const formSections = [];
    const formResponses = [];
    const defaultGroupID = randomstring.generate(7);
    const defaultParentGroupID = randomstring.generate(7);
  
    const duration = parseInt(req.query.durationInMinutes || "60");
    const expiresAt = new Date(Date.now() + duration * 60 * 1000);
  
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
        groupID: "open-access",
        groupCode: "0",
        parentGroupID: null,
        groupName: "Open Access Group",
        groupLink: `${CLIENT_BASE_URL}/#/userform/${formID}/open-access`,
        expiresAt: null,
        isPermanent: true,
      },
      {
        groupID: defaultGroupID,
        groupCode: "3",
        parentGroupID: defaultParentGroupID,
        groupName: "Group 1",
        groupLink: `${CLIENT_BASE_URL}/#/userform/${formID}/${defaultGroupID}`,
        expiresAt: expiresAt,
      },
    ];
  
    const formIsAcceptingResponses = true;
  
    try {
      const form = await Form.create({
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
      res.status(500).json({ msg: "Form creation failed !", errorMsg: error.message });
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

  /* app.get("/getFormData/:id", async (req, res) => {
    try {
      const form = await Form.findOne({ formID: req.params.id });
      if (form) res.status(200).json({ form: form });
      else res.status(404).json({ msg: "Form not found." });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "See error message !", errorMsg: error.message });
    }
  }); */

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

      let expiresAt = null;
      const durationStr = req.query.durationInMinutes;
      if (durationStr && durationStr !== "none") {
      const duration = parseInt(durationStr);
      expiresAt = new Date(Date.now() + duration * 60 * 1000);
      }
        
        
        const formGroup = {
          groupID: defaultGroupID,
          groupCode: "2", // or "3" depending on the route
          parentGroupID: groupID,
          groupName: groupName,
          childGroups: [], // only if it's a child group
          groupLink: `${CLIENT_BASE_URL}/#/userform/${req.params.id}/${defaultGroupID}`,
          expiresAt: expiresAt,
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

      let expiresAt = null;
      const durationStr = req.query.durationInMinutes;
      if (durationStr && durationStr !== "none") {
      const duration = parseInt(durationStr);
      expiresAt = new Date(Date.now() + duration * 60 * 1000);
     }


      const formGroup = {
      groupID: defaultGroupID,
      groupCode: "3",
      parentGroupID: groupID,
      groupName: groupName,
      groupLink: `${CLIENT_BASE_URL}/#/userform/${req.params.id}/${defaultGroupID}`,
      expiresAt: expiresAt,
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
      const refreshedForm = await Form.findOne({ formID: req.params.id });
  
      if (!refreshedForm) {
        return res.status(404).json({ msg: "Form not found." });
      }
  
      const groupID = req.query.groupID;
      let refreshedGroup = refreshedForm.formGroups.find(g => g.groupID === groupID);

// Try re-fetching if not found
if (!refreshedGroup) {
  const retryForm = await Form.findOne({ formID: req.params.id });
  refreshedGroup = retryForm.formGroups.find(g => g.groupID === groupID);
  if (!refreshedGroup) {
    return res.status(404).json({ msg: "Group not found." });
  }
  refreshedForm = retryForm;
}

  
      if (refreshedGroup.expiresAt && new Date() > new Date(refreshedGroup.expiresAt)) {
        const retryForm = await Form.findOne({ formID: req.params.id });
        const retryGroup = retryForm.formGroups.find(g => g.groupID === groupID);
      
        if (retryGroup && (!retryGroup.expiresAt || new Date() <= new Date(retryGroup.expiresAt))) {
          // ✅ Proceed with refreshed
          refreshedForm = retryForm;
          refreshedGroup = retryGroup;
        } else {
          return res.status(200).json({ expiredGroupID: groupID });
        }
      }
      
      
  
      const groupResponses = {};
  
      refreshedForm.formGroups.forEach((group) => {
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
  
      refreshedForm.formSections.forEach((section) => {
        section.questions.forEach((q) => {
          refreshedForm.formGroups.forEach((group) => {
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
                subData[option.optionValue] = 0;
              });
            } else if (q.questionType === 3) {
              subData = new Array(q.upperLimit).fill(0);
            }
  
            const questionObj = {
              questionID: q.questionID,
              question: q.question,
              questionType: q.questionType,
              responses: [],
              subData: subData,
            };
  
            if (q.questionType === 1) questionObj.options = q.options;
            if (q.questionType === 3) {
              questionObj.upperLimit = q.upperLimit;
              questionObj.labels = q.labels;
            }
  
            refreshedForm.formResponses.forEach((r) => {
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
        form: {
          formTitle: refreshedForm.formTitle,
          formDescription: refreshedForm.formDescription,
          formIsAcceptingResponses: refreshedForm.formIsAcceptingResponses,
          formSections: refreshedForm.formSections,
        },
        groupResponses: Object.values(groupResponses),
        numberOfResponses: refreshedForm.formResponses.length,
        formGroups: refreshedForm.formGroups,
        formParentGroups: refreshedForm.formParentGroups,
        msg: "Summary Data and number of responses sent.",
      });
    } catch (error) {
      res.status(500).json({ msg: "Error retrieving form data", errorMsg: error.message });
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
      const refreshedForm = await Form.findOne({ formID: req.params.id });
if (!refreshedForm) {
  return res.status(404).json({ msg: "Form not found." });
}



      const newFormID = randomstring.generate(7);
      const defaultGroupID = randomstring.generate(7);
      const duration = parseInt(req.query.durationInMinutes || "60");
  const expiresAt = new Date(Date.now() + duration * 60 * 1000);

  const defaultParentGroupID = randomstring.generate(7);
  const formGroups = [
    {
      groupID: defaultGroupID,
      groupCode: "3",
      parentGroupID: defaultParentGroupID,
      groupName: "Group 1",
      groupLink: `${CLIENT_BASE_URL}/#/userform/${newFormID}/${defaultGroupID}`,
      expiresAt: expiresAt,
    },
  ];


      

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

  app.delete("/cleanupExpiredGroups", async (req, res) => {
    try {
      const now = new Date();
      const forms = await Form.find({});
      let cleanedCount = 0;

      for (let form of forms) {
        const originalLength = form.formGroups.length;
        form.formGroups = form.formGroups.filter(
          (group) => !group.expiresAt || group.expiresAt > now
        );

        if (form.formGroups.length < originalLength) {
          await form.save();
          cleanedCount += originalLength - form.formGroups.length;
        }
      }

      res.status(200).json({
        msg: "Expired groups cleaned.",
        cleanedCount: cleanedCount,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Cleanup failed.",
        errorMsg: error.message,
      });
    }
  });
  app.get("/getAllFormTitles", async (req, res) => {
    try {
      const forms = await Form.find({}, { formTitle: 1, formID: 1, _id: 0 });
      res.status(200).json(forms);
    } catch (error) {
      res.status(500).json({ msg: "Failed to fetch form titles", errorMsg: error.message });
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
    .catch(err => {
      console.error('Error connecting to MongoDB:', err);
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
