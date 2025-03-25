import GaugeComponent from "react-gauge-component";
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

  // Mean and Std Dev
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

  const subArcs = [
    { limit: 20, color: "#5BE12C" },
    { limit: 40, color: "#B4E12C" },
    { limit: 60, color: "#E1DA2C" },
    { limit: 80, color: "#E17B2C" },
    { limit: 100, color: "#EA4228" },
  ];

  const ticks = Array.from({ length: content.upperLimit }, (_, i) => ({
    value: ((i + 1) / content.upperLimit) * 100,
  }));

  const leftLabel = content.labels?.[0] || "Strongly Disagree";
  const rightLabel =
    content.labels?.[content.labels.length - 1] || "Strongly Agree";

  const meanTag = interpretMean(mean);
  const stdTag = interpretStdDev(stdDeviation);

  // Comparison Mode
  const mean2 = content2
    ? (
        content2.responses.reduce((sum, val) => sum + parseInt(val), 0) /
        content2.responses.length
      ).toFixed(2)
    : 0;

  const avgPercentage2 = content2
    ? ((mean2 / content2.upperLimit) * 100).toFixed(2)
    : 0;

  const chartLabels = [firstGroupName, secondGroupName];
  const chartSeries = [parseFloat(avgPercentage), parseFloat(avgPercentage2)];

  const options = {
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "40%",
        },
        track: {
          background: "#e7e7e7",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "18px",
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: "16px",
            formatter: (val) => val.toFixed(2) + "%",
          },
        },
      },
    },
    stroke: {
      lineCap: "butt", // No rounded edges
      width: 10,
    },
    fill: {
      type: "solid",
      colors: ["#2ecc71", "#3498db"],
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
        <div className="lsq-dashboard-question">{content.question}</div>
        <div className="lsq-dashboard-norQuestion">
          {content.responses.length} responses
        </div>

        <div className="lsq-dashboard-stats">
          <p>
            <strong>Mean:</strong> {mean}{" "}
            <span style={{ fontSize: "1.2em" }}>🟡</span> — {meanTag}.
          </p>
          <p>
            <strong>Standard Deviation:</strong> {stdDeviation} — {stdTag}
          </p>
        </div>

        <div className="lsq-dashboard-bar-chart" style={{ marginBottom: "10px" }}>
          {content2 == null ? (
            <>
              <GaugeComponent
                value={parseFloat(avgPercentage)}
                type="radial"
                labels={{
                  tickLabels: {
                    type: "inner",
                    ticks: ticks,
                  },
                  valueLabel: {
                      formatTextValue: (value) => `${value.toFixed(1)}%`,
                      style: {
                          fontSize: "24px",
                          fontWeight: "600",
                          fill: "#333",
                          dominantBaseline: "central",
                          textAnchor: "middle",
                          transform: "translateY(10px)", // Move down if needed
                      },
                  },
                }}
                arc={{
                  subArcs: subArcs,
                  padding: 0,
                  width: 0.3,
                  cornerRadius: 0, // ✅ Makes the segments have straight edges
                }}
                pointer={{
                  elastic: true,
                  animationDelay: 0,
                }}
              />
              {/* End Labels Stacked */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 2rem",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  marginTop: "-10px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div>{leftLabel.split(" ")[0]}</div>
                  <div>{leftLabel.split(" ")[1]}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div>{rightLabel.split(" ")[0]}</div>
                  <div>{rightLabel.split(" ")[1]}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <ReactApexChart
                options={options}
                series={chartSeries}
                type="radialBar"
                height={350}
              />
              {/* End Labels Stacked */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 2rem",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  marginTop: "-10px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div>{leftLabel.split(" ")[0]}</div>
                  <div>{leftLabel.split(" ")[1]}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div>{rightLabel.split(" ")[0]}</div>
                  <div>{rightLabel.split(" ")[1]}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Interpretation */}
        <div
          style={{
            textAlign: "center",
            fontSize: "1rem",
            marginTop: "10px",
            fontWeight: 500,
          }}
        >
          <strong>Interpretation:</strong> {interpretationText}
        </div>

        {/* Comparison Summary */}
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
