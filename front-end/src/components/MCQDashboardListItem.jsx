import { BarChart } from "@mui/x-charts/BarChart";

function MCQDashboardListItem({
  content,
  content2,
  selectedGroupNames1,
  selectedGroupNames2,
}) {
  const firstGroupName = content2
    ? Object.values(selectedGroupNames1).join(", ")
    : "Parent Group";
  const secondGroupName = content2
    ? Object.values(selectedGroupNames2).join(", ")
    : "Child Group";

  const totalResponses1 = content.responses.length;
  const totalResponses2 = content2 ? content2.responses.length : 0;
  const totalResponses = totalResponses1 + totalResponses2;

  const dataPoints1 = content
    ? Object.entries(content.subData).map(([option, count]) => ({
        option,
        count,
        percentage: totalResponses1 > 0 ? ((count / totalResponses1) * 100).toFixed(2) : 0,
      }))
    : [];

  const dataPoints2 = content2
    ? Object.entries(content2.subData).map(([option, count]) => ({
        option,
        count,
        percentage: totalResponses2 > 0 ? ((count / totalResponses2) * 100).toFixed(2) : 0,
      }))
    : [];

  const series = content2
    ? [
        { data: dataPoints1.map((d) => d.percentage), label: `${firstGroupName} (%)` },
        { data: dataPoints2.map((d) => d.percentage), label: `${secondGroupName} (%)` },
      ]
    : [{ data: dataPoints1.map((d) => d.percentage), label: "Responses (%)" }];

  const sortedData1 = [...dataPoints1].sort((a, b) => b.count - a.count);
  const mostSelected = sortedData1.length ? sortedData1[0] : null;
  const leastSelected = sortedData1.length > 1 ? sortedData1[sortedData1.length - 1] : null;

  let percentageDifference = null;
  if (sortedData1.length > 1) {
    const secondMostSelected = sortedData1[1];
    percentageDifference = ((mostSelected.count - secondMostSelected.count) / totalResponses1) * 100;
    percentageDifference = percentageDifference.toFixed(2);
  }

  let summaryText = "";
  if (sortedData1.length > 0) {
    summaryText += `<strong>${mostSelected.option}</strong> was the most preferred choice, receiving <strong>${mostSelected.percentage}%</strong> of responses.`;

    if (sortedData1.length > 1) {
      summaryText += ` It was followed by <strong>${sortedData1[1].option}</strong> at <strong>${sortedData1[1].percentage}%</strong>.`;
    }

    if (sortedData1.length > 2) {
      summaryText += ` The least chosen option was <strong>${leastSelected.option}</strong>, making up only <strong>${leastSelected.percentage}%</strong> of responses.`;
    }
  }

  let comparativeText = "";
  if (content2) {
    const differences = dataPoints1.map((d, index) => ({
      option: d.option,
      diff: Math.abs(d.percentage - (dataPoints2[index]?.percentage || 0)),
      preferredBy:
        d.percentage > (dataPoints2[index]?.percentage || 0) ? firstGroupName : secondGroupName,
    }));

    const largestDiff = differences.reduce((max, d) => (d.diff > max.diff ? d : max), differences[0]);

    comparativeText = `<strong>${largestDiff.preferredBy}</strong> shows the strongest preference difference for <strong>${largestDiff.option}</strong> with <strong>${largestDiff.diff}%</strong> gap.`;

    differences.forEach((d) => {
      comparativeText += `<br/>${d.preferredBy} prefers <strong>${d.option}</strong> more (${d.diff.toFixed(2)}% gap).`;
    });
  }

  const xAxisData = dataPoints1.map((d, index) => {
    if (content2) {
      return `${d.option}\n${firstGroupName}: ${d.count} | ${secondGroupName}: ${dataPoints2[index]?.count || 0}`;
    } else {
      return `${d.option} (${d.count})`;
    }
  });

  return (
    <div className="mcq-dashboard">
      <div
        className="mcq-dashboard-inner"
        style={{
          padding: "24px 32px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Bar Chart */}
        <div
          className="mcq-dashboard-bar-chart"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 10px",
            marginBottom: "24px",
          }}
        >
          <BarChart
            yAxis={[
              {
                scaleType: "band",
                data: xAxisData,
                labelStyle: {
                  fontSize: 14,
                  fontWeight: "bold",
                },
              },
            ]}
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

        {/* Summary Text */}
        <div
          className="mcq-dashboard-summary"
          style={{
            marginTop: "16px",
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
          dangerouslySetInnerHTML={{ __html: summaryText }}
        />

        {/* Comparative Analysis */}
        {content2 && (
          <div
            className="mcq-dashboard-comparative"
            style={{
              marginTop: "16px",
              padding: "16px",
              backgroundColor: "#f0f7ff",
              borderRadius: "8px",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
            dangerouslySetInnerHTML={{ __html: comparativeText }}
          />
        )}
      </div>
    </div>
  );
}

export default MCQDashboardListItem;
