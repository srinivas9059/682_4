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
    : null;
  const secondGroupName = content2
    ? Object.values(selectedGroupNames2).join(", ")
    : null;
  const avg =
    (content.responses.reduce((a, b) => a + parseInt(b), 0) * 100) /
    (content.responses.length * content.upperLimit);

  const subArcs = Array.from({ length: content.upperLimit }, () => ({}));

  const total = content.responses.reduce((a, b) => a + parseInt(b), 0);

  const ticks = Array.from({ length: content.upperLimit }, (_, i) => ({
    value: (100 / content.upperLimit) * (i + 1),
  }));

  console.log("Content", content.subData);

  const dataPoints = content.subData.map((data, i) =>
    content.norQuestion !== 0
      ? ((data / content.norQuestion) * 100).toFixed(1)
      : "0.0"
  );

  console.log("Data Points", dataPoints);

  const series = [
    {
      data: dataPoints,
    },
  ];

  console.log("Series", series);

  const avg2 = content2
    ? (content2.responses.reduce((a, b) => a + parseInt(b), 0) * 100) /
      (content2.responses.length * content.upperLimit)
    : 0;

  const chartLabels = [firstGroupName, secondGroupName];
  const chartSeries = [avg, avg2];

  var options = {
    series: chartSeries,
    chart: {
      height: 350,
      type: "radialBar",
    },

    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Average",
          },
        },
      },
    },

    labels: chartLabels,
  };

  return (
    <div className="lsq-dashboard">
      <div className="lsq-dashboard-inner p-3">
        <div className="lsq-dashboard-question">{content.question}</div>
        <div className="lsq-dashboard-norQuestion">
          {content.responses.length} responses
        </div>
        <div className="lsq-dashboard-bar-chart">
          {content2 == null && (
            <GaugeComponent
              value={avg}
              type="radial"
              labels={{
                tickLabels: {
                  type: "inner",
                  ticks: ticks,
                },
              }}
              arc={{
                colorArray: ["#5BE12C", "#EA4228"],
                subArcs: subArcs,
                padding: 0.02,
                width: 0.3,
              }}
              pointer={{
                elastic: true,
                animationDelay: 0,
              }}
            />
          )}

          {content2 != null && (
            <ReactApexChart
              options={options}
              series={chartSeries}
              type="radialBar"
              height={350}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default LSQDashboardListItem;

/* import React from "react";
import {
  CircularGaugeComponent,
  AxesDirective,
  AxisDirective,
  Inject,
  PointersDirective,
  PointerDirective,
  AnnotationsDirective,
  AnnotationDirective,
  Annotations,
} from "@syncfusion/ej2-react-circulargauge";

function LSQDashboardListItem({ content, content2 }) {
  const avg1 =
    content.responses.reduce((a, b) => a + parseInt(b), 0) /
    content.responses.length;
  const avgPercentage1 = (avg1 * 100) / content.upperLimit;

  const avg2 = content2
    ? content2.responses.reduce((a, b) => a + parseInt(b), 0) /
      content2.responses.length
    : null;
  const avgPercentage2 = content2 ? (avg2 * 100) / content2.upperLimit : null;

  return (
    <div className="lsq-dashboard">
      <div className="lsq-dashboard-inner p-3">
        <div className="lsq-dashboard-question">{content.question}</div>
        <div className="lsq-dashboard-norQuestion">
          {content.responses.length} responses
        </div>
        <div className="lsq-dashboard-gauge">
          <CircularGaugeComponent load={loadGauge} id="gauge">
            <Inject services={[Annotations]} />
            <AxesDirective>
              <AxisDirective
                startAngle={-90}
                endAngle={90}
                radius="80%"
                minimum={0}
                maximum={100}
              >
                <PointersDirective>
                  <PointerDirective
                    value={avgPercentage1}
                    radius="70%"
                    pointerWidth={7}
                    cap={{ radius: 8 }}
                    color="#00A8B5"
                  />
                  {content2 && (
                    <PointerDirective
                      value={avgPercentage2}
                      radius="60%"
                      pointerWidth={7}
                      cap={{ radius: 8 }}
                      color="#FF4081"
                    />
                  )}
                </PointersDirective>
                <AnnotationsDirective>
                  <AnnotationDirective
                    content={`<div style="text-align:center;"><span style="font-size:14px;color:#067BC2;">Primary: ${avgPercentage1.toFixed(
                      2
                    )}%</span></div>`}
                    radius="30%"
                    angle={0}
                    zIndex="1"
                  />
                  {content2 && (
                    <AnnotationDirective
                      content={`<div style="text-align:center;"><span style="font-size:14px;color:#FF4081;">Secondary: ${avgPercentage2.toFixed(
                        2
                      )}%</span></div>`}
                      radius="50%"
                      angle={180}
                      zIndex="1"
                    />
                  )}
                </AnnotationsDirective>
              </AxisDirective>
            </AxesDirective>
          </CircularGaugeComponent>
        </div>
      </div>
    </div>
  );

  function loadGauge(args) {
    let selectedTheme = localStorage.getItem("selected-theme");
    if (selectedTheme === "dark") {
      args.gauge.theme = "HighContrast";
    } else {
      args.gauge.theme = "Material";
    }
  }
}

export default LSQDashboardListItem; */
