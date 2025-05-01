import { useState, useEffect } from "react";
import { TreeSelect } from "primereact/treeselect";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Badge, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Box } from "@mui/material";

import MCQDashboardListItem from "./MCQDashboardListItem";
import SAQDashboardListItem from "./SAQDashboardListItem";
import LSQDashboardListItem from "./LSQDashboardListItem";

function Dashboard({ forceRefresh, setForceRefresh, formData }) {



  const [groupsData, setGroupsData] = useState([]);
  const [selectedNodes1, setSelectedNodes1] = useState({});
  const [selectedNodes2, setSelectedNodes2] = useState({});
  const [showSecondFilter, setShowSecondFilter] = useState(false);
  const [options, setOptions] = useState([]);
  const [numberOfResponses, setNumberOfResponses] = useState(0);
  const [originalFormSections, setOriginalFormSections] = useState([]);
  const [oldFormGroups, setOldFormGroups] = useState([]);
  const [oldFormParentGroups, setOldFormParentGroups] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [stopRetries, setStopRetries] = useState(false);




  useEffect(() => {
  let intervalId;
  let retryTimeout;

  const fetchData = async () => {
    try {
    const expiresAtString = localStorage.getItem("expiresAt");
    const formID = localStorage.getItem("formID");
    const groupID = localStorage.getItem("groupID");

    if (!groupID && (!formData?.form?.formGroups || formData.form.formGroups.length === 0)) {
      return;
    }
    
    
  
    if (!formID || !groupID || !expiresAtString) {
      // Suppress session expired warning if form is newly created
      if (!groupID && groupsData.length === 0) {
        return; // Don't show toast for new forms with no groups yet
      }
    
      notifications.show({
        title: "Session Expired",
        message: "Your session has expired. Please select a group again.",
        color: "red",
        autoClose: 4000,
      });
    
      localStorage.removeItem("formID");
      localStorage.removeItem("groupID");
      localStorage.removeItem("expiresAt");
    
      setGroupsData([]);
      setNumberOfResponses(0);
      return;
    }
    
    
  
    const expiresAt = new Date(expiresAtString);
    

    const formDataResult = await formRes.json();

const group = formDataResult.form.formGroups.find((g) => g.groupID === groupID);


if (!group) {
  console.warn(`❌ Group "${groupID}" not found. Stopping retries.`);
  clearTimeout(retryTimeout);
  retryTimeout = null;
  clearInterval(intervalId);
  setGroupsData([]);
  setNumberOfResponses(0);
  return;
}

    const now = new Date();
    if (expiresAt < now) {
      notifications.show({
        title: "Group Expired",
        message: "Retrying fetch in 10 seconds...",
        color: "blue",
        autoClose: 4000,
      });
      
      if (!retryTimeout) {
        retryTimeout = setTimeout(() => {
          fetchData();
        }, 10000);
      }
      if (stopRetries) {
        console.log("🚫 Stopping retries because group expired.");
        return;
      }
      
      setGroupsData([]);
      setNumberOfResponses(0);
      return;
    }
  
    if (group.expiresAt && new Date() > new Date(group.expiresAt)) {
      console.warn(`⚠️ Group "${group.groupName}" expired. Clearing and stopping.`);
    
      // Clear expired data from localStorage
      localStorage.removeItem("expiresAt");
      localStorage.removeItem("groupID");
    
      // Stop retries
      clearTimeout(retryTimeout);
      retryTimeout = null;
      
      setGroupsData([]);
      setNumberOfResponses(0);
    
      // Optional: show toast to user
      notifications.show({
        title: "Session Expired",
        message: `Group "${group.groupName}" expired. Please select another group.`,
        color: "red",
        autoClose: 4000,
      });
    
      return;
    }
    
    if (!formID || !groupID) {
      console.warn("Form ID or Group ID missing. Skipping dashboard fetch.");
      return;
    }
    
      const response = await fetch(`${BACKEND_URL}/getSummaryDashboardData/${formID}?groupID=${groupID}`);
      if (response.status === 410) {
        console.warn(`⚠️ Group "${groupID}" expired while fetching dashboard. Retrying in 10 seconds...`);
        clearInterval(intervalId); // 🔥 stop auto fetching
        if (!retryTimeout) {
          retryTimeout = setTimeout(() => {
            fetchData();
          }, 10000);
        }
        return;
      }
      
  
      const data = await response.json();
      if (response.ok) {
        clearTimeout(retryTimeout);
        retryTimeout = null;
  
        notifications.show({
          title: "Auto Refreshed!",
          message: "Dashboard refreshed after extension 🎉",
          color: "blue",
          autoClose: 3000,
        });
  
        setGroupsData(data.groupResponses);
        setNumberOfResponses(data.numberOfResponses);
        setOriginalFormSections(data.formSections);
  
        if (
          JSON.stringify(oldFormGroups) !== JSON.stringify(data.formGroups) ||
          JSON.stringify(oldFormParentGroups) !== JSON.stringify(data.formParentGroups)
        ) {
          prepareOptions(data.formParentGroups, data.groupResponses);
          setOldFormGroups(data.formGroups);
          setOldFormParentGroups(data.formParentGroups);
        }
      } else {
        throw new Error("Failed to fetch dashboard data.");
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    }
  };
  

  fetchData();
  intervalId = setInterval(fetchData, 2000);

  return () => {
    if (intervalId) clearInterval(intervalId);
    if (retryTimeout) clearTimeout(retryTimeout);
  };
  
}, [forceRefresh]);

  
  /*   const prepareOptions = (parentGroups, childGroups) => {
    const formattedOptions = parentGroups.map((parent) => ({
      key: parent.groupID,
      label: parent.groupName,
      children: childGroups
        .filter((child) => parent.childGroups.includes(child.groupID))
        .map((child) => ({
          key: child.groupID,
          label: child.groupName,
        })),
    }));
    setOptions(formattedOptions);
    console.log("Logging options", options);
  }; */
  /*  const prepareOptions = (parentGroups, childGroups) => {
    // Recursive function to find and structure children
    console.log("prepare options called");
    const findChildren = (group) => {
      return childGroups
        .filter((child) => group.childGroups.includes(child.groupID))
        .map((child) => ({
          key: child.groupID,
          label: child.groupName,
          children: findChildren(child), // Recursive call to find further nested children
        }));
    };

    // Map through the parent groups to assign children using the recursive function
    const formattedOptions = parentGroups.map((parent) => ({
      key: parent.groupID,
      label: parent.groupName,
      children: findChildren(parent), // Get the children for each parent
    }));

    setOptions(formattedOptions);
    console.log("Logging options", options);
  };
 */

  const prepareOptions = (parentGroups, childGroups) => {
    console.log(childGroups, "Initial childGroups");

    const findChildren = (group, level = 0) => {
      console.log(`Finding children for ${group.groupName} at level ${level}`);
      // Only proceed if childGroups is defined and not empty
      if (!group.childGroups || group.childGroups.length === 0) {
        console.log(`No children for ${group.groupName}`);
        return [];
      }
      return childGroups
        .filter((child) => {
          return group.childGroups.includes(child.groupID);
        })
        .map((child) => {
          console.log(
            `Found child ${child.groupName} for parent ${group.groupName}`
          );
          // Recursively finding children if any, incrementing level to track depth
          return {
            key: child.groupID,
            label: child.groupName,
            children: findChildren(child, level + 1),
          };
        });
    };

    const formattedOptions = parentGroups.map((parent) => ({
      key: parent.groupID,
      label: parent.groupName,
      children: findChildren(parent),
    }));

    setOptions(formattedOptions);
    console.log("Logging options after setOptions call", formattedOptions);
  };

  const determineGroupNames = (selectedNodes) => {
    let selectedGroupNames = {};
    options.forEach((option) => {
      const allChildrenSelected = option.children.every(
        (child) => selectedNodes[child.key]
      );
      if (allChildrenSelected) {
        selectedGroupNames[option.key] = option.label;
      } else {
        option.children.forEach((child) => {
          if (selectedNodes[child.key]) {
            selectedGroupNames[child.key] = child.label;
          }
        });
      }
    });
    return selectedGroupNames;
  };

  const renderQuestionItems = (questionInfo, questionData1, questionData2) => {
    // Determine group names for the selected nodes
    const selectedGroupNames1 = determineGroupNames(selectedNodes1);
    const selectedGroupNames2 = determineGroupNames(selectedNodes2);

    switch (questionInfo.questionType) {
      case 1:
        return (
          <MCQDashboardListItem
            key={questionInfo.questionID}
            content={questionData1}
            content2={questionData2}
            selectedGroupNames1={selectedGroupNames1}
            selectedGroupNames2={selectedGroupNames2}
          />
        );
      case 2:
        return (
          <SAQDashboardListItem
            key={questionInfo.questionID}
            content={questionData1}
            content2={questionData2}
            selectedGroupNames1={selectedGroupNames1}
            selectedGroupNames2={selectedGroupNames2}
          />
        );
      case 3:
        return (
          <LSQDashboardListItem
            key={questionInfo.questionID}
            content={questionData1}
            content2={questionData2}
            selectedGroupNames1={selectedGroupNames1}
            selectedGroupNames2={selectedGroupNames2}
          />
        );
      default:
        return null;
    }
  };

  const getCombinedResponses = (questions) => {
    const combinedResponses = {};

    questions.forEach((question) => {
      if (!combinedResponses[question.questionID]) {
        combinedResponses[question.questionID] = {
          ...question,
          responses: [],
          subData:
            question.questionType === 3
              ? new Array(question.upperLimit).fill(0)
              : question.questionType === 2
              ? []
              : {},
        };
      }
      combinedResponses[question.questionID].responses.push(
        ...question.responses
      );
      if (question.questionType === 1) {
        question.responses.forEach((response) => {
          combinedResponses[question.questionID].subData[response] =
            (combinedResponses[question.questionID].subData[response] || 0) + 1;
        });
      } else if (question.questionType === 2) {
        combinedResponses[question.questionID].subData.push(
          ...question.responses
        );
      } else if (question.questionType === 3) {
        question.responses.forEach((response) => {
          const index = parseInt(response) - 1;
          combinedResponses[question.questionID].subData[index] =
            (combinedResponses[question.questionID].subData[index] || 0) + 1;
        });
      }
    });

    return Object.values(combinedResponses);
  };

  const getSections = (selectedKeys) => {
    const sectionMap = {};

    groupsData
      .filter((group) => selectedKeys[group.groupID])
      .forEach((group) => {
        Object.values(group.sections).forEach((section) => {
          if (!sectionMap[section.sectionID]) {
            sectionMap[section.sectionID] = {
              ...section,
              questions: [],
            };
          }
          section.questions.forEach((question) => {
            const existingQuestionIndex = sectionMap[
              section.sectionID
            ].questions.findIndex((q) => q.questionID === question.questionID);
            if (existingQuestionIndex === -1) {
              sectionMap[section.sectionID].questions.push({
                ...question,
                responses: [],
                subData:
                  question.questionType === 1
                    ? {}
                    : question.questionType === 3
                    ? new Array(question.upperLimit).fill(0)
                    : [],
              });
            }
            const questionIndex = sectionMap[
              section.sectionID
            ].questions.findIndex((q) => q.questionID === question.questionID);
            sectionMap[section.sectionID].questions[
              questionIndex
            ].responses.push(...question.responses);
          });
        });
      });

    Object.values(sectionMap).forEach((section) => {
      section.questions = getCombinedResponses(section.questions);
    });

    return sectionMap;
  };

  const handleGroupSelection1 = (value) => {
    console.log("selected nodes", value);
    setSelectedNodes1(value);
  };

  const handleGroupSelection2 = (value) => {
    setSelectedNodes2(value);
  };

  const addComparisonFilter = () => {
    setShowSecondFilter(true);
  };

  const refreshDashboardData = () => {
    setForceRefresh((prev) => prev + 1);
  };
  

  // Helper function to render response sections based on selected nodes
  const renderResponseSections = (selectedNodes, identifier) =>
    originalFormSections.map((sectionInfo) => {
      // console.log("Selcted nodes", selectedNodes);
      const sectionData = getSections(selectedNodes)[sectionInfo.sectionID];
      if (!sectionData) return null;

      return renderSectionBox(sectionInfo, sectionData, identifier);
    });

  const renderResponseSection = (selectedNodes1, selectedNodes2, identifier) =>
    originalFormSections.map((sectionInfo) => {
      const sectionData1 = getSections(selectedNodes1)[sectionInfo.sectionID];
      if (!sectionData1) return null;
      const sectionData2 = getSections(selectedNodes2)[sectionInfo.sectionID];
      if (!sectionData2) return null;
      return renderSectionBoxes(
        sectionInfo,
        sectionData1,
        sectionData2,
        identifier
      );
    });

    const renderSectionBoxes = (
      sectionInfo,
      sectionData1,
      sectionData2,
      identifier
    ) => {
      if (!sectionData1 || !sectionData1.questions || !sectionData2 || !sectionData2.questions) return null;
    
      return (
        <Box
        key={`sectionbox-${sectionInfo.sectionID}-${identifier}`}

          className="section-box"
          sx={{
            border: "2px solid black",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
            backgroundColor: "#F0F0F0",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              borderColor: "#007BFF",
            },
          }}
        >
          <h3>{sectionInfo.sectionName}</h3>
          {sectionInfo.questions.map((questionInfo) => {
            const questionData1 = sectionData1.questions.find(
              (q) => q.questionID === questionInfo.questionID
            );
            const questionData2 = sectionData2.questions.find(
              (q) => q.questionID === questionInfo.questionID
            );
            if (!questionData1 || !questionData2) return null;
    
            return renderQuestionItems(questionInfo, questionData1, questionData2);
          })}
        </Box>
      );
    };
    

  const renderSectionBox = (sectionInfo, sectionData, identifier) => {
    if (!sectionData || !sectionData.questions) return null;  // ✅ Guard clause
  
    return (
      <Box
        key={`${sectionInfo.sectionID}-${identifier}`}
        className="section-box"
        sx={{
          border: "2px solid black",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          backgroundColor: "#F0F0F0",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
            borderColor: "#007BFF",
          },
        }}
      >
        <h3>{sectionInfo.sectionName}</h3>
        {sectionInfo.questions.map((questionInfo) => {
          const questionData = sectionData.questions.find(
            (q) => q.questionID === questionInfo.questionID
          );
          if (!questionData) return null;
          return renderQuestionItem(questionInfo, questionData);
        })}
      </Box>
    );
  };
  

  // Function to render items based on question types
  const renderQuestionItem = (questionInfo, questionData) => {
    switch (questionInfo.questionType) {
      case 1:
        return (
          <MCQDashboardListItem
            key={questionInfo.questionID}
            content={questionData}
            content2={null}
          />
        );
      case 2:
        return (
          <SAQDashboardListItem
            key={questionInfo.questionID}
            content={questionData}
            content2={null}
          />
        );
      case 3:
        return (
          <LSQDashboardListItem
            key={questionInfo.questionID}
            content={questionData}
            content2={null}
          />
        );
      default:
        return null;
    }
  };
  
  

  return (
    <div className="form-dashboard-tab">
      <div className="dashboard-heading">
        <div className="dashboard-heading-inner p-3">
          <div className="dashboard-number-of-responses-and-filter w-100">
            <div className="dashboard-number-of-responses-text">
              Number of responses
            </div>
            <Badge
              size="xl"
              color="#edbb5f"
              className="text-black fw-semibold"
              variant="filled"
            >
              {numberOfResponses} responses
            </Badge>
          </div>
        </div>
      </div>
      <div className="dashboard-heading">
        <div className="dashboard-heading-inner p-3">
          <div className="dashboard-filters ">
            <div className="dashboard-group-filter">
              <TreeSelect
                value={selectedNodes1}
                options={options}
                onChange={(e) => handleGroupSelection1(e.value)}
                selectionMode="checkbox"
                placeholder="Select Groups"
                className="dashboard-group-filter-select"
              />
            </div>
            {showSecondFilter && (
              <div className="dashboard-group-filter ms-3">
                <TreeSelect
                  value={selectedNodes2}
                  options={options}
                  onChange={(e) => handleGroupSelection2(e.value)}
                  selectionMode="checkbox"
                  placeholder="Select Groups"
                  className="dashboard-group-filter-select"
                />
              </div>
            )}
          </div>

          {!showSecondFilter && (
            <Button
              /* className="add-comparistion-btn"
              size="sm"
              color="blue" */
              className="text-black h-100"
              size="sm"
              color="#edbb5f"
              onClick={addComparisonFilter}
            >
              Add to Comparison
            </Button>
          )}
        </div>
      </div>

      {Object.keys(selectedNodes1).length > 0 &&
        Object.keys(selectedNodes2).length <= 0 &&
        renderResponseSections(selectedNodes1, "1")}
      {Object.keys(selectedNodes1).length > 0 &&
        Object.keys(selectedNodes2).length > 0 &&
        renderResponseSection(selectedNodes1, selectedNodes2, "2")}
      {Object.keys(selectedNodes1).length === 0 &&
        Object.keys(selectedNodes2).length === 0 && (
          <p className="dashboard-no-response text-center mt-3">
           Please select one or more groups to view the data.
          </p>

        )}
    </div>
  );
}

export default Dashboard;
