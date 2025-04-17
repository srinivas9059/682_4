import { useState, useEffect } from "react";
import { TreeSelect } from "primereact/treeselect";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Badge, Button } from "@mantine/core";
import { Box } from "@mui/material";

import MCQDashboardListItem from "./MCQDashboardListItem";
import SAQDashboardListItem from "./SAQDashboardListItem";
import LSQDashboardListItem from "./LSQDashboardListItem";

import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

import ChatWindow from "./ChatWindow";

function Dashboard() {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/getSummaryDashboardData/${localStorage.getItem("formID")}`
        );
        const data = await response.json();
        if (response.ok) {
          setGroupsData(data.groupResponses);
          setNumberOfResponses(data.numberOfResponses);
          setOriginalFormSections(data.formSections);

          if (
            JSON.stringify(oldFormGroups) === JSON.stringify(data.formGroups) &&
            JSON.stringify(oldFormParentGroups) === JSON.stringify(data.formParentGroups)
          ) {
          } else {
            prepareOptions(data.formParentGroups, data.groupResponses);
            setOldFormGroups(data.formGroups);
            setOldFormParentGroups(data.formParentGroups);
          }
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  async function fetchAllResponses() {
    const formID = localStorage.getItem("formID");
    const response = await fetch(`${BACKEND_URL}/getAllFormResponses/${formID}`);
    if (!response.ok) {
      alert("Failed to fetch all responses!");
      return null;
    }
    return await response.json();
  }

  function convertToCSV(formTitle, formSections, formResponses) {
    const allQuestions = [];
    formSections.forEach((sec) => {
      sec.questions.forEach((q) => allQuestions.push(q));
    });

    const header = ["userResponseID"];
    allQuestions.forEach((q) => {
      header.push(`"${q.question}"`);
    });
    const rows = [header.join(",")];

    formResponses.forEach((resp) => {
      const row = [];
      row.push(resp.userResponseID);
      allQuestions.forEach((q) => {
        const ansObj = resp.userResponse.find(
          (uAns) => uAns.questionID === q.questionID
        );
        row.push(ansObj ? `"${ansObj.answer}"` : `""`);
      });
      rows.push(row.join(","));
    });

    return rows.join("\n");
  }

  async function handleDownloadCSV() {
    const data = await fetchAllResponses();
    if (!data) return;

    const { formTitle, formSections, formResponses } = data;
    const csvString = convertToCSV(formTitle, formSections, formResponses);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `Responses_${formTitle}.csv`);
  }

  async function handleDownloadPDF() {
    const data = await fetchAllResponses();
    if (!data) return;

    const { formTitle, formSections, formResponses } = data;
    const allQuestions = [];
    formSections.forEach((sec) => sec.questions.forEach((q) => allQuestions.push(q)));

    const doc = new jsPDF("l", "pt", "a4");
    doc.text(`Responses for: ${formTitle}`, 40, 40);

    const columns = [{ header: "userResponseID", dataKey: "userResponseID" }];
    allQuestions.forEach((q) => {
      columns.push({ header: q.question, dataKey: `q${q.questionID}` });
    });

    const rows = formResponses.map((resp) => {
      const rowObj = { userResponseID: resp.userResponseID };
      allQuestions.forEach((q) => {
        const ansObj = resp.userResponse.find(
          (uAns) => uAns.questionID === q.questionID
        );
        rowObj[`q${q.questionID}`] = ansObj ? ansObj.answer : "";
      });
      return rowObj;
    });

    autoTable(doc, {
      head: [columns.map((c) => c.header)],
      body: rows.map((r) => columns.map((c) => r[c.dataKey])),
      startY: 60,
      margin: { left: 40, right: 40 },
    });

    doc.save(`Responses_${formTitle}.pdf`);
  }

  async function handleDownloadDashboardPDF() {
    const dashboard = document.querySelector(".form-dashboard-tab");
    if (!dashboard) return;
    const canvas = await html2canvas(dashboard, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = { width: canvas.width, height: canvas.height };
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Dashboard_Report.pdf");
  }

  const prepareOptions = (parentGroups, childGroups) => {
    const findChildren = (group, level = 0) => {
      if (!group.childGroups || group.childGroups.length === 0) return [];
      return childGroups
        .filter((child) => group.childGroups.includes(child.groupID))
        .map((child) => ({
          key: child.groupID,
          label: child.groupName,
          children: findChildren(child, level + 1),
        }));
    };

    const formattedOptions = parentGroups.map((parent) => ({
      key: parent.groupID,
      label: parent.groupName,
      children: findChildren(parent),
    }));

    setOptions(formattedOptions);
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
      combinedResponses[question.questionID].responses.push(...question.responses);
      if (question.questionType === 1) {
        question.responses.forEach((r) => {
          combinedResponses[question.questionID].subData[r] =
            (combinedResponses[question.questionID].subData[r] || 0) + 1;
        });
      } else if (question.questionType === 2) {
        combinedResponses[question.questionID].subData.push(...question.responses);
      } else if (question.questionType === 3) {
        question.responses.forEach((r) => {
          const idx = parseInt(r) - 1;
          combinedResponses[question.questionID].subData[idx] =
            (combinedResponses[question.questionID].subData[idx] || 0) + 1;
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
            sectionMap[section.sectionID] = { ...section, questions: [] };
          }
          section.questions.forEach((q) => {
            const existingIndex = sectionMap[section.sectionID].questions.findIndex(
              (qq) => qq.questionID === q.questionID
            );
            if (existingIndex === -1) {
              sectionMap[section.sectionID].questions.push({
                ...q,
                responses: [],
                subData:
                  q.questionType === 1
                    ? {}
                    : q.questionType === 3
                    ? new Array(q.upperLimit).fill(0)
                    : [],
              });
            }
            const questionIndex = sectionMap[section.sectionID].questions.findIndex(
              (qq) => qq.questionID === q.questionID
            );
            sectionMap[section.sectionID].questions[questionIndex].responses.push(
              ...q.responses
            );
          });
        });
      });

    Object.values(sectionMap).forEach((sec) => {
      sec.questions = getCombinedResponses(sec.questions);
    });

    return sectionMap;
  };

  const handleGroupSelection1 = (val) => setSelectedNodes1(val);
  const handleGroupSelection2 = (val) => setSelectedNodes2(val);
  const addComparisonFilter = () => setShowSecondFilter(true);

  const renderResponseSections = (selectedNodes, identifier) =>
    originalFormSections.map((secInfo) => {
      const secData = getSections(selectedNodes)[secInfo.sectionID];
      if (!secData) return null;
      return renderSectionBox(secInfo, secData, identifier);
    });

  const renderResponseSection = (selNodes1, selNodes2, identifier) =>
    originalFormSections.map((secInfo) => {
      const sData1 = getSections(selNodes1)[secInfo.sectionID];
      const sData2 = getSections(selNodes2)[secInfo.sectionID];
      if (!sData1 || !sData2) return null;
      return renderSectionBoxes(secInfo, sData1, sData2, identifier);
    });

  const renderSectionBoxes = (secInfo, secData1, secData2, identifier) => (
    <Box
      key={`${secInfo.sectionID}-${identifier}`}
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
      <h3>{secInfo.sectionName}</h3>
      {secInfo.questions.map((qInfo) => {
        const qData1 = secData1.questions.find((x) => x.questionID === qInfo.questionID);
        const qData2 = secData2.questions.find((x) => x.questionID === qInfo.questionID);
        if (!qData1 || !qData2) return null;
        return renderQuestionItems(qInfo, qData1, qData2);
      })}
    </Box>
  );

  const renderSectionBox = (secInfo, secData, identifier) => (
    <Box
      key={`${secInfo.sectionID}-${identifier}`}
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
      <h3>{secInfo.sectionName}</h3>
      {secInfo.questions.map((qInfo) => {
        const qData = secData.questions.find((x) => x.questionID === qInfo.questionID);
        if (!qData) return null;
        return renderQuestionItems(qInfo, qData, null);
      })}
    </Box>
  );

  const selectedGroupNames1 = determineGroupNames(selectedNodes1);
  const selectedGroupNames2 = determineGroupNames(selectedNodes2);

  const surveyData = {
      title: localStorage.getItem("formTitle") || "Untitled Survey",
      questions: originalFormSections.flatMap(section =>
          section.questions.map(q => ({
              questionID: q.questionID,
              questionType: q.questionType,
              text: q.question,
              options: q.options || [],
              upperLimit: q.upperLimit || null,
              labels: q.labels || [],
          }))
      ),
      summary: groupsData.reduce((acc, group) => {
          const cleanGroupName =
            selectedGroupNames1[group.groupID] ||
            selectedGroupNames2[group.groupID] ||
            group.groupName ||
            group.groupID;

          acc[cleanGroupName] = {
              groupID: group.groupID,
              groupName: cleanGroupName,
              sections: {}
          };

          Object.entries(group.sections || {}).forEach(([sectionID, section]) => {
              acc[cleanGroupName].sections[sectionID] = {
                  sectionID,
                  questions: section.questions.map(q => ({
                      questionID: q.questionID,
                      question: q.question,
                      questionType: q.questionType,
                      subData: q.subData || {},
                      options: q.options || [],
                      labels: q.labels || [],
                      upperLimit: q.upperLimit || null
                  }))
              };
          });
//           console.log("🧠 Final surveyData:", surveyData);
          return acc;
      }, {})
  };


  return (
    <div className="form-dashboard-tab">
      {/* Heading + filters */}
      <div className="dashboard-heading">
        <div className="dashboard-heading-inner p-3">
          <div className="dashboard-number-of-responses-and-filter w-100">
            <div className="dashboard-number-of-responses-text">Number of responses</div>
            <Badge size="xl" color="#edbb5f" className="text-black fw-semibold" variant="filled">
              {numberOfResponses} responses
            </Badge>
          </div>
        </div>
      </div>

      <div className="dashboard-heading">
        <div className="dashboard-heading-inner p-3">
          <div className="dashboard-filters">
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
            <Button className="text-black h-100" size="sm" color="#edbb5f" onClick={addComparisonFilter}>
              Add to Comparison
            </Button>
          )}
        </div>
      </div>

      {/* ---------- DOWNLOAD BUTTONS ---------- */}
      <div style={{ margin: "1rem", display: "flex", justifyContent: "space-between" }}>
        <div>
          <Button color="#edbb5f" onClick={handleDownloadCSV}>📥 Responses CSV</Button>
          <Button color="#333333" style={{ marginLeft: "1rem" }} onClick={handleDownloadPDF}>
            📥 Responses PDF
          </Button>
        </div>
        <Button color="teal" onClick={handleDownloadDashboardPDF}>📄 Download Dashboard PDF</Button>
      </div>

      {/* ---------- DASHBOARD RENDERING ---------- */}
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
        <ChatWindow surveyData={surveyData} />
    </div>
  );
}

export default Dashboard;
