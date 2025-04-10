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
  // Early return if no content
  if (!content) {
    return null;
  }

  console.log("Selected Group Names 1", selectedGroupNames1);

  const firstGroupName = content2 && selectedGroupNames1
    ? Object.values(selectedGroupNames1).join(", ")
    : null;
  const secondGroupName = content2 && selectedGroupNames2
    ? Object.values(selectedGroupNames2).join(", ")
    : null;

  console.log("First Group Name", firstGroupName);

  const numberOfResponses = content2
    ? (content2.responses?.length || 0) + (content.responses?.length || 0)
    : content.responses?.length || 0;

  // Ensure there is always valid data to avoid errors
  const dataPoints = content?.subData ? Object.values(content.subData) : [0];
  const dataPoints2 = content2?.subData ? Object.values(content2.subData) : [0];

  // Create series only if we have valid data
  const series = content2
    ? [
        { data: dataPoints, label: firstGroupName || 'Group 1' },
        { data: dataPoints2, label: secondGroupName || 'Group 2' },
      ]
    : [{ data: dataPoints, label: 'Responses' }];

  // Ensure xAxisData is always valid
  const xAxisData = content?.options?.length > 0
    ? Array.from(
        { length: content.options.length },
        (_, i) => content.subData ? Object.keys(content.subData)[i] : `Option ${i + 1}`
      )
    : ['No Data'];

  return (
    <div className="mcq-dashboard">
      <div className="mcq-dashboard-inner p-3">
        <div className="mcq-dashboard-question">{content?.question || 'No Question'}</div>
        <div className="mcq-dashboard-norQuestion">
          {numberOfResponses} responses
        </div>
        <div className="mcq-dashboard-pie-chart">
          {dataPoints.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default MCQDashboardListItem;
