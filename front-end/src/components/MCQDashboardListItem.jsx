import { PieChart } from "@mui/x-charts/PieChart";

function MCQDashboardListItem({ content }) {
  const dataPoints = [];
  content.options.forEach((option) => {
    // if (content.norQuestion !== 0)
    //   var dataPoint = {
    //     value: ((content.subData[option] / content.norQuestion) * 100).toFixed(
    //       1
    //     ),
    //     label: option,
    //   };
    // else
    //   var dataPoint = {
    //     value: "0.0",
    //     label: option,
    //   };
    console.log("option323", option);
    console.log(content.subData[option.optionValue]);
    var dataPoint = {
      value: content.subData[option.optionValue],
      label: option.optionValue,
    };
    dataPoints.push(dataPoint);
  });

  console.log("subData", content.subData);

  const series = {
    data: dataPoints,
    highlightScope: { faded: "global", highlighted: "item" },
    faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
  };

  return (
    <div className="mcq-dashboard">
      <div className="mcq-dashboard-inner p-3">
        <div className="mcq-dashboard-question">{content.question}</div>
        <div className="mcq-dashboard-norQuestion">
          {content.norQuestion} responses
        </div>
        <div className="mcq-dashboard-pie-chart">
          <PieChart
            // colors={["#ff6b6b", "#4db6ac", "#ffd54f", "#607d8b"]}
            // colors={["#ff6b6b", "#304ffe", "#ffd54f", "#b0bec5"]}
            colors={[
              "#fbb4ae",
              "#b3cde3",
              "#ccebc5",
              "#decbe4",
              "#fed9a6",
              "#ffffcc",
              "#e5d8bd",
              "#fddaec",
              "#f2f2f2",
            ]}
            series={[series]}
            width={450}
            height={450}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "middle" },
                padding: 0,
              },
            }}
            margin={{ top: 100, bottom: 150, left: 100, right: 100 }}
          />
        </div>
      </div>
    </div>
  );
}

export default MCQDashboardListItem;
