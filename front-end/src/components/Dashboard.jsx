import { useEffect, useRef, useState } from "react";
import SAQDashboardListItem from "./SAQDashboardListItem";
import MCQDashboardListItem from "./MCQDashboardListItem";
import Select from "react-select";
import LSQDashboardListItem from "./LSQDashboardListItem";
import { Badge } from "@mantine/core";

function Dashboard() {
  const [numberOfResponses, setNumberOfResponses] = useState(0);
  const [summaryData, setSummaryData] = useState([]);
  const [sdOriginal, setSdOriginal] = useState([]);
  const [formQuestions, setFormQuestions] = useState([]);
  const [formResponses, setFormResponses] = useState([]);
  const [options, setOptions] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [formParentGroups, setFormParentGroups] = useState([]);
  const [groupFilterList, setGroupFilterList] = useState([]);
  const [parentGroupFilterList, setParentGroupFilterList] = useState([]);
  const parentFilter = useRef();
  const childFilter = useRef();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${BACKEND_URL}/getSummaryDashboardData/${localStorage.getItem(
          "formID"
        )}`,
        {
          method: "GET",
        }
      );
      const json = await response.json();
      setNumberOfResponses(json.numberOfResponses);
      setSummaryData(json.summaryData);
      setSdOriginal(json.summaryData);
      setFormQuestions(json.formQuestions);
      setFormResponses(json.formResponses);
      setFormParentGroups(json.formParentGroups);
      var tempOptions = {};
      json.formGroups.forEach((group) => {
        if (
          tempOptions[getParentGroupID(group.groupID, json.formParentGroups)]
        ) {
          tempOptions[
            getParentGroupID(group.groupID, json.formParentGroups)
          ].push({
            value: group.groupID,
            label: `${group.groupName}`,
          });
        } else {
          tempOptions[getParentGroupID(group.groupID, json.formParentGroups)] =
            [
              {
                value: group.groupID,
                label: `${group.groupName}`,
              },
            ];
        }
      });
      const groupedOptions = [];
      json.formParentGroups.forEach((pg) => {
        groupedOptions.push({
          label: `${pg.parentGroupName}`,
          options: tempOptions[pg.parentGroupID],
        });
      });
      setOptions(groupedOptions);
      var tempParentOptions = [];
      json.formParentGroups.forEach((group) => {
        tempParentOptions.push({
          value: group.parentGroupID,
          label: `${group.parentGroupName}`,
        });
      });
      setParentOptions(tempParentOptions);
    };
    fetchData();
    const fetchInterval = setInterval(() => {
      if (
        parentFilter.current.getValue().length === 0 &&
        childFilter.current.getValue().length === 0
      ) {
        fetchData();
      }
    }, 2000);
    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  const getParentGroupID = (groupID, parentGroups) => {
    for (var i = 0; i < parentGroups.length; i++) {
      if (parentGroups[i].childGroups.includes(groupID))
        return parentGroups[i].parentGroupID;
    }
    return parentGroups[0].parentGroupID;
  };

  const handleGroupFilter = (groupsList) => {
    if (groupsList.length === 0) {
      setGroupFilterList(groupsList);
      if (parentGroupFilterList.length === 0) setSummaryData(sdOriginal);
      else {
        const filteredGroupIDs = [];
        formParentGroups.forEach((parentGroup) => {
          if (parentGroupFilterList.includes(parentGroup.parentGroupID)) {
            filteredGroupIDs.push(...parentGroup.childGroups);
          }
        });
        setSummaryData(filterGroups(filteredGroupIDs));
      }
    } else {
      const groupsListIDs = groupsList.map((i) => i.value);
      setGroupFilterList(groupsListIDs);
      const filteredGroupIDs = [];
      formParentGroups.forEach((parentGroup) => {
        if (parentGroupFilterList.includes(parentGroup.parentGroupID)) {
          filteredGroupIDs.push(...parentGroup.childGroups);
        }
      });
      groupsListIDs.forEach((groupID) => {
        if (!filteredGroupIDs.includes(groupID)) filteredGroupIDs.push(groupID);
      });
      setSummaryData(filterGroups(filteredGroupIDs));
    }
  };

  const handleParentGroupFilter = (groupsList) => {
    if (groupsList.length === 0) {
      setParentGroupFilterList(groupsList);
      if (groupFilterList.length === 0) setSummaryData(sdOriginal);
      else {
        const filteredGroupIDs = [];
        groupFilterList.forEach((groupID) => {
          if (!filteredGroupIDs.includes(groupID))
            filteredGroupIDs.push(groupID);
        });
        setSummaryData(filterGroups(filteredGroupIDs));
      }
    } else {
      const groupsListIDs = groupsList.map((i) => i.value);
      setParentGroupFilterList(groupsListIDs);
      const filteredGroupIDs = [];
      formParentGroups.forEach((parentGroup) => {
        if (groupsListIDs.includes(parentGroup.parentGroupID)) {
          filteredGroupIDs.push(...parentGroup.childGroups);
        }
      });
      groupFilterList.forEach((groupID) => {
        if (!filteredGroupIDs.includes(groupID)) filteredGroupIDs.push(groupID);
      });
      setSummaryData(filterGroups(filteredGroupIDs));
    }
  };

  const filterGroups = (groupsList) => {
    const summaryData = [];
    formQuestions.forEach((q) => {
      const norQuestionGroups = formResponses.filter((r) => {
        if (
          groupsList.includes(r.userGroupID) &&
          r.userResponse.filter((qr) => qr.questionID === q.questionID)
            .length === 1
        )
          return true;
        else return false;
      }).length;
      var subData;
      if (q.questionType == 1) {
        q.options.forEach((option) => {
          subData = { ...subData, [option.optionValue]: 0 };
        });
        formResponses.forEach((r) => {
          if (groupsList.includes(r.userGroupID)) {
            const temp = r.userResponse.filter(
              (qr) => qr.questionID === q.questionID
            );
            if (temp[0]) subData[temp[0].answer] += 1;
          }
        });
      } else if (q.questionType == 2) {
        subData = [];
        formResponses.forEach((r) => {
          if (groupsList.includes(r.userGroupID)) {
            const temp = r.userResponse.filter(
              (qr) => qr.questionID === q.questionID
            );
            if (temp[0]) subData.push(temp[0].answer);
          }
        });
      } else if (q.questionType == 3) {
        subData = new Array(parseInt(q.upperLimit)).fill(0);
        formResponses.forEach((r) => {
          if (groupsList.includes(r.userGroupID)) {
            const temp = r.userResponse.filter(
              (qr) => qr.questionID === q.questionID
            );
            if (temp[0]) subData[parseInt(temp[0].answer) - 1] += 1;
          }
        });
      }
      const totalData = {
        question: q.question,
        questionType: q.questionType,
        norQuestion: norQuestionGroups,
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
    return summaryData;
  };

  return (
    <div className="form-dashboard-tab">
      <div className="dashboard-heading">
        <div className="dashboard-heading-inner p-3">
          <div className="dashboard-number-of-responses-and-filter">
            <div className="dashboard-number-of-responses-text">
              Number of responses
            </div>
            <div className="dashboard-number-of-responses-text">
              {/* {numberOfResponses} responses */}
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
      </div>
      <div className="dashboard-heading">
        <div className="dashboard-heading-inner p-3">
          <div className="dashboard-filters">
            <div className="dashboard-group-filter">
              <div className="dashboard-groups-names-headings">Groups</div>
              <Select
                options={parentOptions}
                isMulti
                onChange={handleParentGroupFilter}
                ref={parentFilter}
              />
            </div>
            <div className="dashboard-group-filter">
              <div className="dashboard-groups-names-headings">Sub Groups</div>
              <Select
                options={options}
                isMulti
                onChange={handleGroupFilter}
                ref={childFilter}
              />
            </div>
          </div>
        </div>
      </div>
      {summaryData.map((sd, index) => {
        if (sd.questionType == 1)
          return <MCQDashboardListItem key={index} content={sd} />;
        else if (sd.questionType == 2)
          return <SAQDashboardListItem key={index} content={sd} />;
        else if (sd.questionType == 3)
          return <LSQDashboardListItem key={index} content={sd} />;
      })}
      <div className="pt-5 pb-5"></div>
    </div>
  );
}

export default Dashboard;
