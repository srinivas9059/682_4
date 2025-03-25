import { BarChart } from "@mui/x-charts/BarChart";

function MCQDashboardListItem({
  content,
  content2,
  selectedGroupNames1,
  selectedGroupNames2,
}) {
  // Debug logs for developer reference
  console.log("Selected Group Names 1", selectedGroupNames1);

  // Determine group names for display
  const firstGroupName = content2
    ? Object.values(selectedGroupNames1).join(", ")
    : "Parent Group";
  const secondGroupName = content2
    ? Object.values(selectedGroupNames2).join(", ")
    : "Child Group";

  console.log("First Group Name", firstGroupName);

  // Total responses from each group
  const totalResponses1 = content.responses.length;
  const totalResponses2 = content2 ? content2.responses.length : 0;
  const totalResponses = totalResponses1 + totalResponses2;

  // Convert response counts into percentages for Group 1
  const dataPoints1 = content
    ? Object.entries(content.subData).map(([option, count]) => ({
        option,
        count,
        percentage: totalResponses1 > 0 ? ((count / totalResponses1) * 100).toFixed(2) : 0,
      }))
    : [];

  // Convert response counts into percentages for Group 2 (if present)
  const dataPoints2 = content2
    ? Object.entries(content2.subData).map(([option, count]) => ({
        option,
        count,
        percentage: totalResponses2 > 0 ? ((count / totalResponses2) * 100).toFixed(2) : 0,
      }))
    : [];

  console.log("Converted Data Points:", dataPoints1);

  // Define series data for bar chart (single or comparison mode)
  const series = content2
    ? [
        { data: dataPoints1.map((d) => d.percentage), label: `${firstGroupName} (%)` },
        { data: dataPoints2.map((d) => d.percentage), label: `${secondGroupName} (%)` },
      ]
    : [{ data: dataPoints1.map((d) => d.percentage), label: "Responses (%)" }];

  console.log("Series Data:", series);

  // Identify most and least selected options in Group 1
  const sortedData1 = [...dataPoints1].sort((a, b) => b.count - a.count);
  const mostSelected = sortedData1.length ? sortedData1[0] : null;
  const leastSelected = sortedData1.length > 1 ? sortedData1[sortedData1.length - 1] : null;

  // Calculate percentage gap between top 2 choices (F2)
  let percentageDifference = null;
  if (sortedData1.length > 1) {
    const secondMostSelected = sortedData1[1];
    percentageDifference = ((mostSelected.count - secondMostSelected.count) / totalResponses1) * 100;
    percentageDifference = percentageDifference.toFixed(2);
  }

  // Build summary text for single group case (F3)
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

  // Build comparison analysis for two groups (F4)
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

  // Construct x-axis labels including group-wise counts
  const xAxisData = dataPoints1.map((d, index) => {
    if (content2) {
      return `${d.option}\n${firstGroupName}: ${d.count} | ${secondGroupName}: ${dataPoints2[index]?.count || 0}`;
    } else {
      return `${d.option} (${d.count})`;
    }
  });

  return (
    <div className="mcq-dashboard">
      <div className="mcq-dashboard-inner p-3">
        {/* Question text and total responses */}
        <div className="mcq-dashboard-question">{content?.question}</div>
        <div className="mcq-dashboard-norQuestion">{totalResponses} responses</div>

        {/* Summary and comparison layout */}
        <div className="mcq-dashboard-summary-container" style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="mcq-dashboard-summary" style={{ width: "48%", textAlign: "left" }}>
            {mostSelected && (
              <p>
                <strong>Most Selected:</strong> {mostSelected.option} ({mostSelected.count} responses)
              </p>
            )}
            {leastSelected && (
              <p>
                <strong>Least Selected:</strong> {leastSelected.option} ({leastSelected.count} responses)
              </p>
            )}
            {percentageDifference && (
              <p>
                <strong>Percentage Difference:</strong> {percentageDifference}%
              </p>
            )}
          </div>

          {/* Render comparison or summary text */}
          <div
            className="mcq-dashboard-summary-text"
            style={{ width: "48%", textAlign: "left" }}
            dangerouslySetInnerHTML={{
              __html: content2 ? comparativeText : summaryText,
            }}
          ></div>
        </div>

        {/* Horizontal Bar Chart Visualization */}
        <div
          className="mcq-dashboard-bar-chart"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px 20px",
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
                  textAlign: "left",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.3",
                },
              },
            ]}
            layout="horizontal"
            series={series}
            width={750}
            height={450}
            colors={content2 ? ["#f4a261", "#2a9d8f"] : ["#f4a261"]}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "middle" },
                padding: 10,
              },
            }}
            margin={{ left: 220, right: 20, top: 30, bottom: 50 }}
          />
        </div>
      </div>
    </div>
  );
}

export default MCQDashboardListItem;


// import { BarChart } from "@mui/x-charts/BarChart";
//
// function MCQDashboardListItem({
//   content,
//   content2,
//   selectedGroupNames1,
//   selectedGroupNames2,
// }) {
//   console.log("Selected Group Names 1", selectedGroupNames1);
//
//   const firstGroupName = content2
//     ? Object.values(selectedGroupNames1).join(", ")
//     : "Parent Group";
//   const secondGroupName = content2
//     ? Object.values(selectedGroupNames2).join(", ")
//     : "Child Group";
//
//   console.log("First Group Name", firstGroupName);
//
//   // Total responses for each group
//   const totalResponses1 = content.responses.length;
//   const totalResponses2 = content2 ? content2.responses.length : 0;
//   const totalResponses = totalResponses1 + totalResponses2;
//
//   // Convert raw counts to percentages
//   const dataPoints1 = content
//     ? Object.entries(content.subData).map(([option, count]) => ({
//         option,
//         count,
//         percentage: totalResponses1 > 0 ? ((count / totalResponses1) * 100).toFixed(2) : 0,
//       }))
//     : [];
//
//   const dataPoints2 = content2
//     ? Object.entries(content2.subData).map(([option, count]) => ({
//         option,
//         count,
//         percentage: totalResponses2 > 0 ? ((count / totalResponses2) * 100).toFixed(2) : 0,
//       }))
//     : [];
//
//   console.log("Converted Data Points:", dataPoints1);
//
//   const series = content2
//     ? [
//         { data: dataPoints1.map((d) => d.percentage), label: `${firstGroupName} (%)` },
//         { data: dataPoints2.map((d) => d.percentage), label: `${secondGroupName} (%)` },
//       ]
//     : [{ data: dataPoints1.map((d) => d.percentage), label: "Responses (%)" }];
//
//   console.log("Series Data:", series);
//
//   // **Determine Most & Least Selected Options**
//   const sortedData1 = [...dataPoints1].sort((a, b) => b.count - a.count);
//   const mostSelected = sortedData1.length ? sortedData1[0] : null;
//   const leastSelected = sortedData1.length > 1 ? sortedData1[sortedData1.length - 1] : null;
//
//   // **Calculate Percentage Difference**
//   let percentageDifference = null;
//   if (sortedData1.length > 1) {
//     const secondMostSelected = sortedData1[1];
//     percentageDifference = ((mostSelected.count - secondMostSelected.count) / totalResponses1) * 100;
//     percentageDifference = percentageDifference.toFixed(2);
//   }
//
//   // **Generate Summary for F3**
//   let summaryText = "";
//   if (sortedData1.length > 0) {
//     summaryText += `<strong>${mostSelected.option}</strong> was the most preferred choice, receiving <strong>${mostSelected.percentage}%</strong> of responses.`;
//
//     if (sortedData1.length > 1) {
//       summaryText += ` It was followed by <strong>${sortedData1[1].option}</strong> at <strong>${sortedData1[1].percentage}%</strong>.`;
//     }
//
//     if (sortedData1.length > 2) {
//       summaryText += ` The least chosen option was <strong>${leastSelected.option}</strong>, making up only <strong>${leastSelected.percentage}%</strong> of responses.`;
//     }
//   }
//
//   // **Comparative Analysis for F4 (If Two Groups Exist)**
//   let comparativeText = "";
//   if (content2) {
//     const differences = dataPoints1.map((d, index) => ({
//       option: d.option,
//       diff: Math.abs(d.percentage - (dataPoints2[index]?.percentage || 0)),
//       preferredBy:
//         d.percentage > (dataPoints2[index]?.percentage || 0) ? firstGroupName : secondGroupName,
//     }));
//
//     const largestDiff = differences.reduce((max, d) => (d.diff > max.diff ? d : max), differences[0]);
//
//     comparativeText = `<strong>${largestDiff.preferredBy}</strong> shows the strongest preference difference for <strong>${largestDiff.option}</strong> with <strong>${largestDiff.diff}%</strong> gap.`;
//
//     differences.forEach((d) => {
//       comparativeText += `<br/>${d.preferredBy} prefers <strong>${d.option}</strong> more (${d.diff.toFixed(2)}% gap).`;
//     });
//   }
//
//   // **Updated X-Axis Labels with Proper Formatting**
//   const xAxisData = dataPoints1.map((d, index) => {
//     if (content2) {
//       return `${d.option}\n${firstGroupName}: ${d.count} | ${secondGroupName}: ${dataPoints2[index]?.count || 0}`;
//     } else {
//       return `${d.option} (${d.count})`;
//     }
//   });
//
//   return (
//     <div className="mcq-dashboard">
//       <div className="mcq-dashboard-inner p-3">
//         <div className="mcq-dashboard-question">{content?.question}</div>
//         <div className="mcq-dashboard-norQuestion">{totalResponses} responses</div>
//
//         {/* F2 and Either F3 (Summary) or F4 (Comparison) Side by Side */}
//         <div className="mcq-dashboard-summary-container" style={{ display: "flex", justifyContent: "space-between" }}>
//           <div className="mcq-dashboard-summary" style={{ width: "48%", textAlign: "left" }}>
//             {mostSelected && (
//               <p>
//                 <strong>Most Selected:</strong> {mostSelected.option} ({mostSelected.count} responses)
//               </p>
//             )}
//             {leastSelected && (
//               <p>
//                 <strong>Least Selected:</strong> {leastSelected.option} ({leastSelected.count} responses)
//               </p>
//             )}
//             {percentageDifference && (
//               <p>
//                 <strong>Percentage Difference:</strong> {percentageDifference}%
//               </p>
//             )}
//           </div>
//           <div
//             className="mcq-dashboard-summary-text"
//             style={{ width: "48%", textAlign: "left" }}
//             dangerouslySetInnerHTML={{
//               __html: content2 ? comparativeText : summaryText,
//             }} // Inject summary or comparative text dynamically
//           ></div>
//         </div>
//
//         <div
//           className="mcq-dashboard-bar-chart"
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             padding: "10px 20px",
//           }}
//         >
//           <BarChart
//             yAxis={[
//               {
//                 scaleType: "band",
//                 data: xAxisData,
//                 labelStyle: {
//                   fontSize: 14,
//                   fontWeight: "bold",
//                   textAlign: "left",
//                   whiteSpace: "pre-wrap",
//                   lineHeight: "1.3",
//                 },
//               },
//             ]}
//             layout="horizontal"
//             series={series}
//             width={750} // Increased width for better spacing
//             height={450} // Increased height for better readability
//             colors={content2 ? ["#f4a261", "#2a9d8f"] : ["#f4a261"]}
//             slotProps={{
//               legend: {
//                 direction: "row",
//                 position: { vertical: "bottom", horizontal: "middle" },
//                 padding: 10,
//               },
//             }}
//             margin={{ left: 220, right: 20, top: 30, bottom: 50 }} // Further increased left margin
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
//
// export default MCQDashboardListItem;