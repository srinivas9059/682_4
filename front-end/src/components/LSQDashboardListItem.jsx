import { BarChart } from "@mui/x-charts/BarChart";

function LSQDashboardListItem({ content }) {
  const dataPoints = [];
  content.labels.forEach((label, i) => {
    // if (content.norQuestion !== 0)
    //   var dataPoint = (
    //     (content.subData[i] / content.norQuestion) *
    //     100
    //   ).toFixed(1);
    // else var dataPoint = "0.0";

    // dataPoints.push(dataPoint);
    dataPoints.push(content.subData[i]);
  });

  const series = [
    {
      data: dataPoints,
    },
  ];

  const xAxisData = [];
  for (let i = 1; i <= content.upperLimit; i++) xAxisData.push(i.toString());

  return (
    <div className="lsq-dashboard">
      <div className="lsq-dashboard-inner p-3">
        <div className="lsq-dashboard-question">{content.question}</div>
        <div className="lsq-dashboard-norQuestion">
          {content.norQuestion} responses
        </div>
        <div className="lsq-dashboard-bar-chart">
          <BarChart
            xAxis={[{ scaleType: "band", data: xAxisData }]}
            series={series}
            width={500}
            height={300}
            colors={["#edbb5f"]}
          />
        </div>
      </div>
    </div>
  );
}

export default LSQDashboardListItem;
