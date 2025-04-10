/* import { BarChart } from "@mui/x-charts/BarChart";

function MCQDashboardListItem({ content, content2 }) {
  const dataPoints = Object.values(content.subData);
  if (content2 != null) var dataPoints2 = Object.values(content2.subData);

  const series =
    content == null
      ? [
          {
            data: dataPoints,
          },
        ]
      : [
          {
            data: dataPoints,
          },
          {
            data: dataPoints2,
          },
        ];

  const xAxisData = Array.from(
    { length: content.options.length },
    (_, i) => Object.keys(content.subData)[i]
  );

  console.log(dataPoints);

  return (
    <div className="mcq-dashboard">
      <div className="mcq-dashboard-inner p-3">
        <div className="mcq-dashboard-question">{content.question}</div>
        <div className="mcq-dashboard-norQuestion">
          {content.responses.length} responses
        </div>
        <div className="mcq-dashboard-pie-chart">
          {content2 == null ? (
            <BarChart
              yAxis={[{ scaleType: "band", data: xAxisData }]}
              layout="horizontal"
              series={series}
              width={500}
              height={300}
              colors={["#edbb5f"]}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "bottom", horizontal: "middle" },
                  padding: 0,
                },
              }}
            ></BarChart>
          ) : (
            <BarChart
              yAxis={[{ scaleType: "band", data: xAxisData }]}
              layout="horizontal"
              series={series}
              width={500}
              height={300}
              colors={["#edbb5f", "#4db6ac"]}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "bottom", horizontal: "middle" },
                  padding: 0,
                },
              }}
            ></BarChart>
          )}
        </div>
      </div>
    </div>
  );
}

export default MCQDashboardListItem; */

/* import { BarChart } from "@mui/x-charts/BarChart";

function MCQDashboardListItem({ content }) {
  // Assume content.subData is now an array of objects, each representing a filter's data
  const series = content.subData.map((subData, index) => ({
    name: `Filter ${index + 1}`, // Name each series according to the filter number
    data: Object.values(subData),
  }));

  // Assume all filters share the same set of options
  const xAxisData = Array.from(
    { length: content.options.length },
    (_, i) => content.options[i] // This should correspond to option labels
  );

  return (
    <div className="mcq-dashboard">
      <div className="mcq-dashboard-inner p-3">
        <div className="mcq-dashboard-question">{content.question}</div>
        <div className="mcq-dashboard-norQuestion">
          {content.responses.length} responses
        </div>
        <div className="mcq-dashboard-bar-chart">
          <BarChart
            yAxis={[{ scaleType: "band", data: xAxisData }]}
            layout="horizontal"
            series={series}
            width={500}
            height={300}
            colors={["#edbb5f", "#4db6ac"]} // Different color for each filter
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "middle" },
                padding: 0,
              },
            }}
          ></BarChart>
        </div>
      </div>
    </div>
  );
}

export default MCQDashboardListItem;
 */

import { BarChart } from "@mui/x-charts/BarChart";

function MCQDashboardListItem({
  content,
  content2,
  selectedGroupNames1,
  selectedGroupNames2,
}) {
  console.log("Selected Group Names 1", selectedGroupNames1);
  //  console.log("Selected Group Names 2", selectedGroupNames2);

  const firstGroupName = content2
    ? Object.values(selectedGroupNames1).join(", ")
    : null;
  const secondGroupName = content2
    ? Object.values(selectedGroupNames2).join(", ")
    : null;

  console.log("First Group Name", firstGroupName);

  const numberOfResponses = content2
    ? content2.responses.length + content.responses.length
    : content.responses.length;
  // Ensure there is always valid data to avoid errors.
  const dataPoints = content ? Object.values(content.subData) : [];
  const dataPoints2 = content2 ? Object.values(content2.subData) : [];

  // Adjusted logic for determining series based on content2's presence
  const series = content2
    ? [
        { data: dataPoints, label: firstGroupName },
        { data: dataPoints2, label: secondGroupName },
      ]
    : [{ data: dataPoints }];

  console.log("content2 ", content2);
  console.log("datapoints", dataPoints);

  // Assume content always has valid options for xAxisData; adjust if not the case.
  const xAxisData = content
    ? Array.from(
        { length: content.options.length },
        (_, i) => Object.keys(content.subData)[i]
      )
    : [];

  return (
    <div className="mcq-dashboard">
      <div className="mcq-dashboard-inner p-3">
        <div className="mcq-dashboard-question">{content?.question}</div>
        <div className="mcq-dashboard-norQuestion">
          {numberOfResponses} responses
        </div>
        <div className="mcq-dashboard-pie-chart">
          <BarChart
            yAxis={[{ scaleType: "band", data: xAxisData }]}
            layout="horizontal"
            series={series}
            width={500}
            height={300}
            colors={content2 ? ["#edbb5f", "#4db6ac"] : ["#edbb5f"]}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "middle" },
                padding: 0,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MCQDashboardListItem;
