import ReactApexChart from "react-apexcharts";

function LSQDashboardListItem({
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

  const totalResponses = content.responses.length;
  const mean =
    totalResponses > 0
      ? (
          content.responses.reduce((sum, val) => sum + parseInt(val), 0) /
          totalResponses
        ).toFixed(2)
      : 0;

  const variance =
    totalResponses > 0
      ? (
          content.responses.reduce(
            (sum, val) =>
              sum + Math.pow(parseInt(val) - parseFloat(mean), 2),
            0
          ) / totalResponses
        ).toFixed(2)
      : 0;

  const stdDeviation = Math.sqrt(variance).toFixed(2);
  const avgPercentage = ((mean / content.upperLimit) * 100).toFixed(2);

  const interpretMean = (mean) => {
    if (mean >= content.upperLimit * 0.8) return "Strong agreement";
    if (mean >= content.upperLimit * 0.6) return "Moderate agreement";
    if (mean >= content.upperLimit * 0.4) return "Neutral/mixed responses";
    if (mean >= content.upperLimit * 0.2) return "Moderate disagreement";
    return "Strong disagreement";
  };

  const interpretStdDev = (std) => {
    if (std < 0.8) return "Responses were consistent.";
    if (std < 1.2) return "Responses showed some variation.";
    return "Responses were very diverse.";
  };

  const interpretationText = `A score of ${avgPercentage}% indicates participants are leaning towards ${interpretMean(
    mean
  ).toLowerCase()}.`;

  const leftLabel = content.labels?.[0] || "Strongly Disagree";
  const rightLabel =
    content.labels?.[content.labels.length - 1] || "Strongly Agree";

  const mean2 = content2
    ? (
        content2.responses.reduce((sum, val) => sum + parseInt(val), 0) /
        content2.responses.length
      ).toFixed(2)
    : 0;

  const avgPercentage2 = content2
    ? ((mean2 / content2.upperLimit) * 100).toFixed(2)
    : 0;

  const chartLabels = content2 ? [firstGroupName, secondGroupName] : [];
  const chartSeries = content2
    ? [parseFloat(avgPercentage), parseFloat(avgPercentage2)]
    : [parseFloat(avgPercentage)];

  const chartOptions = {
    chart: {
      height: 410,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "55%",
        },
        track: {
          background: "#f0f0f0",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: "20px",
            fontWeight: 600,
            offsetY: -35,
            offsetX: 6,
            formatter: (val) =>
              content2 ? `${val.toFixed(1)}%` : `${avgPercentage}%`,
          },
        },
      },
    },
    stroke: {
      lineCap: "butt",
      width: 10,
    },
    fill: {
      type: "solid",
      colors: content2 ? ["#2ecc71", "#3498db"] : ["#f39c12"],
    },
    labels: chartLabels,
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val.toFixed(2)}%`,
      },
    },
  };

  return (
    <div className="lsq-dashboard">
      <div className="lsq-dashboard-inner p-3">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            marginBottom: content2 == null ? "1rem" : "1.5rem",
            gap: "1rem",
          }}
        >
          <div style={{ flex: 1, minWidth: "250px", paddingTop: "4px" }}>
            <div
              className="lsq-dashboard-question"
              style={{ fontWeight: 600, fontSize: "1.rem" }}
            >
              {content.question}
            </div>
            <div
              className="lsq-dashboard-norQuestion"
              style={{ fontSize: "0.95rem", marginTop: "2px" }}
            >
              {totalResponses} responses
            </div>
          </div>

          {content2 == null && (
            <div
              className="lsq-dashboard-stats"
              style={{
                flex: 1,
                minWidth: "250px",
                textAlign: "right",
                fontSize: "1rem",
                lineHeight: "2.1",
                marginTop: "16px",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>Mean:</strong> {mean} <span style={{ fontSize: "1.1em" }}>🟡</span> — {interpretMean(mean)}.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Standard Deviation:</strong> {stdDeviation} — {interpretStdDev(stdDeviation)}
              </p>
            </div>
          )}
        </div>

        <div
          className="lsq-dashboard-bar-chart"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="radialBar"
            height={410}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "0.85rem",
              marginTop: "-28px",
              width: "360px",
            }}
          >
            <div style={{ textAlign: "center", flex: 1, minWidth: "100px" }}>
              <div>{leftLabel.split(" ")[0]}</div>
              <div>{leftLabel.split(" ")[1]}</div>
            </div>
            <div style={{ textAlign: "center", flex: 1, minWidth: "100px" }}>
              <div>{rightLabel.split(" ")[0]}</div>
              <div>{rightLabel.split(" ")[1]}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: 500,
            marginBottom: "0.5rem",
          }}
        >
          <strong>Interpretation:</strong> {interpretationText}
        </div>

        {content2 && (
          <div
            style={{
              textAlign: "center",
              marginTop: "10px",
              fontSize: "1rem",
            }}
          >
            <span style={{ color: "#2ecc71", fontWeight: 600 }}>
              {firstGroupName}: {avgPercentage}%
            </span>{" "}
            |{" "}
            <span style={{ color: "#3498db", fontWeight: 600 }}>
              {secondGroupName}: {avgPercentage2}%
            </span>
            <br />
            {parseFloat(avgPercentage) > parseFloat(avgPercentage2)
              ? `${firstGroupName} shows higher agreement.`
              : parseFloat(avgPercentage) < parseFloat(avgPercentage2)
              ? `${secondGroupName} shows higher agreement.`
              : "Both groups show equal agreement."}
          </div>
        )}
      </div>
    </div>
  );
}

export default LSQDashboardListItem;


// import ReactApexChart from "react-apexcharts";
//
// function LSQDashboardListItem({
//   content,
//   content2,
//   selectedGroupNames1,
//   selectedGroupNames2,
// }) {
//   const firstGroupName = content2
//     ? Object.values(selectedGroupNames1).join(", ")
//     : "Parent Group";
//   const secondGroupName = content2
//     ? Object.values(selectedGroupNames2).join(", ")
//     : "Child Group";
//
//   const totalResponses = content.responses.length;
//   const mean =
//     totalResponses > 0
//       ? (
//           content.responses.reduce((sum, val) => sum + parseInt(val), 0) /
//           totalResponses
//         ).toFixed(2)
//       : 0;
//
//   const variance =
//     totalResponses > 0
//       ? (
//           content.responses.reduce(
//             (sum, val) =>
//               sum + Math.pow(parseInt(val) - parseFloat(mean), 2),
//             0
//           ) / totalResponses
//         ).toFixed(2)
//       : 0;
//
//   const stdDeviation = Math.sqrt(variance).toFixed(2);
//   const avgPercentage = ((mean / content.upperLimit) * 100).toFixed(2);
//
//   const interpretMean = (mean) => {
//     if (mean >= content.upperLimit * 0.8) return "Strong agreement";
//     if (mean >= content.upperLimit * 0.6) return "Moderate agreement";
//     if (mean >= content.upperLimit * 0.4) return "Neutral/mixed responses";
//     if (mean >= content.upperLimit * 0.2) return "Moderate disagreement";
//     return "Strong disagreement";
//   };
//
//   const interpretStdDev = (std) => {
//     if (std < 0.8) return "Responses were consistent.";
//     if (std < 1.2) return "Responses showed some variation.";
//     return "Responses were very diverse.";
//   };
//
//   const interpretationText = `A score of ${avgPercentage}% indicates participants are leaning towards ${interpretMean(
//     mean
//   ).toLowerCase()}.`;
//
//   const leftLabel = content.labels?.[0] || "Strongly Disagree";
//   const rightLabel =
//     content.labels?.[content.labels.length - 1] || "Strongly Agree";
//
//   const mean2 = content2
//     ? (
//         content2.responses.reduce((sum, val) => sum + parseInt(val), 0) /
//         content2.responses.length
//       ).toFixed(2)
//     : 0;
//
//   const avgPercentage2 = content2
//     ? ((mean2 / content2.upperLimit) * 100).toFixed(2)
//     : 0;
//
//   const chartLabels = content2 ? [firstGroupName, secondGroupName] : [];
//   const chartSeries = content2
//     ? [parseFloat(avgPercentage), parseFloat(avgPercentage2)]
//     : [parseFloat(avgPercentage)];
//
//   const chartOptions = {
//     chart: {
//       height: 410,
//       type: "radialBar",
//     },
//     plotOptions: {
//       radialBar: {
//         startAngle: -90,
//         endAngle: 90,
//         hollow: {
//           size: "55%", // ✅ Increased for padding inside arc
//         },
//         track: {
//           background: "#f0f0f0",
//           strokeWidth: "100%",
//         },
//         dataLabels: {
//           name: {
//             show: false,
//           },
//           value: {
//             show: true,
//             fontSize: "20px",
//             fontWeight: 600,
//             offsetY: -35, // ✅ Better centering
//             offsetX: 6,   // ✅ Horizontal nudge
//             formatter: (val) =>
//               content2 ? `${val.toFixed(1)}%` : `${avgPercentage}%`,
//           },
//         },
//       },
//     },
//     stroke: {
//       lineCap: "butt",
//       width: 10,
//     },
//     fill: {
//       type: "solid",
//       colors: content2 ? ["#2ecc71", "#3498db"] : ["#f39c12"],
//     },
//     labels: chartLabels,
//     tooltip: {
//       enabled: true,
//       y: {
//         formatter: (val) => `${val.toFixed(2)}%`,
//       },
//     },
//   };
//
//   return (
//     <div className="lsq-dashboard">
//       <div className="lsq-dashboard-inner p-3">
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             flexWrap: "wrap",
//             marginBottom: content2 == null ? "1rem" : "1.5rem",
//             gap: "1rem",
//           }}
//         >
//           <div style={{ flex: 1, minWidth: "250px", paddingTop: "2px" }}>
//             <div
//               className="lsq-dashboard-question"
//               style={{ fontWeight: 600, fontSize: "1.1rem" }}
//             >
//               {content.question}
//             </div>
//             <div
//               className="lsq-dashboard-norQuestion"
//               style={{ fontSize: "0.95rem", marginTop: "4px" }}
//             >
//               {totalResponses} responses
//             </div>
//           </div>
//
//           {content2 == null && (
//             <div
//               className="lsq-dashboard-stats"
//               style={{
//                 flex: 1,
//                 minWidth: "250px",
//                 textAlign: "right",
//                 fontSize: "0.9rem",
//                 lineHeight: "1.5",
//               }}
//             >
//               <p style={{ margin: 0 }}>
//                 <strong>Mean:</strong> {mean}{" "}
//                 <span style={{ fontSize: "1.1em" }}>🟡</span> —{" "}
//                 {interpretMean(mean)}.
//               </p>
//               <p style={{ margin: 0 }}>
//                 <strong>Standard Deviation:</strong> {stdDeviation} —{" "}
//                 {interpretStdDev(stdDeviation)}
//               </p>
//             </div>
//           )}
//         </div>
//
//         <div
//           className="lsq-dashboard-bar-chart"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             marginBottom: "0.75rem",
//           }}
//         >
//           <ReactApexChart
//             options={chartOptions}
//             series={chartSeries}
//             type="radialBar"
//             height={410}
//           />
//
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               padding: "0 2rem",
//               fontWeight: "bold",
//               fontSize: "0.95rem",
//               marginTop: "-5px", // ✅ Less negative margin
//               width: "100%",
//             }}
//           >
//             <div style={{ textAlign: "center", flex: 1, minWidth: "100px" }}>
//               <div>{leftLabel.split(" ")[0]}</div>
//               <div>{leftLabel.split(" ")[1]}</div>
//             </div>
//             <div style={{ textAlign: "center", flex: 1, minWidth: "100px" }}>
//               <div>{rightLabel.split(" ")[0]}</div>
//               <div>{rightLabel.split(" ")[1]}</div>
//             </div>
//           </div>
//         </div>
//
//         <div
//           style={{
//             textAlign: "center",
//             fontSize: "1rem",
//             fontWeight: 500,
//             marginBottom: "0.5rem",
//           }}
//         >
//           <strong>Interpretation:</strong> {interpretationText}
//         </div>
//
//         {content2 && (
//           <div
//             style={{
//               textAlign: "center",
//               marginTop: "10px",
//               fontSize: "1rem",
//             }}
//           >
//             <span style={{ color: "#2ecc71", fontWeight: 600 }}>
//               {firstGroupName}: {avgPercentage}%
//             </span>{" "}
//             |{" "}
//             <span style={{ color: "#3498db", fontWeight: 600 }}>
//               {secondGroupName}: {avgPercentage2}%
//             </span>
//             <br />
//             {parseFloat(avgPercentage) > parseFloat(avgPercentage2)
//               ? `${firstGroupName} shows higher agreement.`
//               : parseFloat(avgPercentage) < parseFloat(avgPercentage2)
//               ? `${secondGroupName} shows higher agreement.`
//               : "Both groups show equal agreement."}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
//
// export default LSQDashboardListItem;
