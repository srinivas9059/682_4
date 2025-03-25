import { useState, useRef } from "react";
import { TagCloud } from "react-tagcloud";
import { removeStopwords } from "stopword";
import Sentiment from "sentiment";
import { extractKeywordsFromResponses } from "../utils/aiKeywordUtils";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(ArcElement, Tooltip, Legend);

function SAQDashboardListItem({
  content,
  content2,
  selectedGroupNames1,
  selectedGroupNames2,
}) {
  const sentiment = new Sentiment();
  const [useKeywordsOnly, setUseKeywordsOnly] = useState(false);
  const dashboardRef = useRef(null);

  const firstGroupName = content2 ? Object.values(selectedGroupNames1).join(", ") : null;
  const secondGroupName = content2 ? Object.values(selectedGroupNames2).join(", ") : null;

  function extractRawWordData(responses) {
    const words = responses.join(" ").split(/\s+/);
    const filteredWords = removeStopwords(words);
    const counts = filteredWords.reduce((acc, word) => {
      word = word.toLowerCase();
      acc[word] = acc[word] ? acc[word] + 1 : 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([value, count]) => ({ value, count }));
  }

  function processResponses(responses) {
    const rawWordData = extractRawWordData(responses);
    const keywordData = extractKeywordsFromResponses(responses);
    const sentimentScores = responses.map((r) => sentiment.analyze(r).score);
    const total = sentimentScores.length;
    const positive = sentimentScores.filter((s) => s > 0).length;
    const neutral = sentimentScores.filter((s) => s === 0).length;
    const negative = sentimentScores.filter((s) => s < 0).length;

    return {
      rawWordData,
      keywordData,
      sentimentSummary: {
        positive: ((positive / total) * 100).toFixed(2),
        neutral: ((neutral / total) * 100).toFixed(2),
        negative: ((negative / total) * 100).toFixed(2),
      },
    };
  }

  const contentProcessed = processResponses(content.subData);
  const content2Processed = content2 ? processResponses(content2.subData) : null;

  const renderSentimentPie = (summary) => {
    return (
      <div style={{ width: "260px", margin: "auto" }}>
        <Pie
          data={{
            labels: ["Positive 😊", "Neutral 😐", "Negative 😢"],
            datasets: [
              {
                data: [summary.positive, summary.neutral, summary.negative],
                backgroundColor: ["#66bb6a", "#ffee58", "#ef5350"],
                borderColor: "#fff",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } },
          }}
        />
      </div>
    );
  };

  const handleDownloadPDF = () => {
    if (!dashboardRef.current) return;
    html2canvas(dashboardRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgWidth = 550;
      const pageHeight = 780;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 20;

      pdf.addImage(imgData, "PNG", 30, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 30, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("SAQ_Analysis.pdf");
    });
  };

  return (
    <div className="saq-dashboard">
      <div ref={dashboardRef} className="saq-dashboard-inner p-3" style={{ position: "relative" }}>
        {/* ✅ Button properly inside top-right of analysis section */}
        <button
          onClick={handleDownloadPDF}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#007bff",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: "6px",
            fontWeight: "600",
            fontSize: "0.9rem",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          📥 Download (PDF)
        </button>

        <div className="saq-dashboard-question">{content.question}</div>
        <div className="saq-dashboard-norQuestion">
          {content.responses.length} responses
        </div>

        {/* Sentiment Summary + Pie Chart Side by Side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            marginTop: "20px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div className="saq-dashboard-sentiment-summary">
            <strong>Sentiment Analysis (Parent Group):</strong>
            <ul>
              <li>😊 Positive: {contentProcessed.sentimentSummary.positive}%</li>
              <li>😐 Neutral: {contentProcessed.sentimentSummary.neutral}%</li>
              <li>😢 Negative: {contentProcessed.sentimentSummary.negative}%</li>
            </ul>
          </div>
          <div style={{ height: "180px", flex: "0 0 260px" }}>
            {renderSentimentPie(contentProcessed.sentimentSummary)}
          </div>
        </div>

        {/* Toggle */}
        <div style={{ textAlign: "right", marginBottom: "10px" }}>
          <label style={{ fontWeight: "500" }}>
            <input
              type="checkbox"
              checked={useKeywordsOnly}
              onChange={() => setUseKeywordsOnly((prev) => !prev)}
              style={{ marginRight: "8px" }}
            />
            Show Only Keywords
          </label>
        </div>

        {/* Word Cloud */}
        <div className="saq-dashboard-answers">
          <div className="p-3">{firstGroupName}</div>
          <div className="word-cloud-container">
            <TagCloud
              minSize={12}
              maxSize={35}
              tags={
                useKeywordsOnly
                  ? contentProcessed.keywordData
                  : contentProcessed.rawWordData
              }
              onClick={(tag) => alert(`'${tag.value}' was selected!`)}
            />
          </div>

          {/* Comparison Mode */}
          {content2Processed && (
            <>
              <div className="p-3">{secondGroupName}</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "40px",
                  marginTop: "20px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div className="saq-dashboard-sentiment-summary">
                  <strong>Sentiment Analysis (Child Group):</strong>
                  <ul>
                    <li>😊 Positive: {content2Processed.sentimentSummary.positive}%</li>
                    <li>😐 Neutral: {content2Processed.sentimentSummary.neutral}%</li>
                    <li>😢 Negative: {content2Processed.sentimentSummary.negative}%</li>
                  </ul>
                </div>
                <div style={{ height: "180px", flex: "0 0 260px" }}>
                  {renderSentimentPie(content2Processed.sentimentSummary)}
                </div>
              </div>
              <div className="word-cloud-container">
                <TagCloud
                  minSize={12}
                  maxSize={35}
                  tags={
                    useKeywordsOnly
                      ? content2Processed.keywordData
                      : content2Processed.rawWordData
                  }
                  onClick={(tag) => alert(`'${tag.value}' was selected!`)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SAQDashboardListItem;



// import { useState } from "react";
// import { TagCloud } from "react-tagcloud";
// import { removeStopwords } from "stopword";
// import Sentiment from "sentiment";
// import { extractKeywordsFromResponses } from "../utils/aiKeywordUtils";
//
// function SAQDashboardListItem({
//   content,
//   content2,
//   selectedGroupNames1,
//   selectedGroupNames2,
// }) {
//   const sentiment = new Sentiment();
//   const [useKeywordsOnly, setUseKeywordsOnly] = useState(false);
//
//   const firstGroupName = content2
//     ? Object.values(selectedGroupNames1).join(", ")
//     : null;
//   const secondGroupName = content2
//     ? Object.values(selectedGroupNames2).join(", ")
//     : null;
//
//   // ✅ Extract full word cloud
//   function extractRawWordData(responses) {
//     const words = responses.join(" ").split(/\s+/);
//     const filteredWords = removeStopwords(words);
//
//     const counts = filteredWords.reduce((acc, word) => {
//       word = word.toLowerCase();
//       acc[word] = acc[word] ? acc[word] + 1 : 1;
//       return acc;
//     }, {});
//
//     return Object.entries(counts).map(([value, count]) => ({ value, count }));
//   }
//
//   // ✅ Process responses for sentiment and both clouds
//   function processResponses(responses) {
//     const rawWordData = extractRawWordData(responses);
//     const keywordData = extractKeywordsFromResponses(responses);
//
//     const sentimentScores = responses.map((r) => sentiment.analyze(r).score);
//     const total = sentimentScores.length;
//     const positive = sentimentScores.filter((s) => s > 0).length;
//     const neutral = sentimentScores.filter((s) => s === 0).length;
//     const negative = sentimentScores.filter((s) => s < 0).length;
//
//     return {
//       rawWordData,
//       keywordData,
//       sentimentSummary: {
//         positive: ((positive / total) * 100).toFixed(2),
//         neutral: ((neutral / total) * 100).toFixed(2),
//         negative: ((negative / total) * 100).toFixed(2),
//       },
//     };
//   }
//
//   const contentProcessed = processResponses(content.subData);
//   const content2Processed = content2 ? processResponses(content2.subData) : null;
//
//   return (
//     <div className="saq-dashboard">
//       <div className="saq-dashboard-inner p-3">
//         <div className="saq-dashboard-question">{content.question}</div>
//         <div className="saq-dashboard-norQuestion">
//           {content.responses.length} responses
//         </div>
//
//         <div className="saq-dashboard-sentiment-summary">
//           <strong>Sentiment Analysis (Parent Group):</strong>
//           <ul>
//             <li>😊 Positive: {contentProcessed.sentimentSummary.positive}%</li>
//             <li>😐 Neutral: {contentProcessed.sentimentSummary.neutral}%</li>
//             <li>😢 Negative: {contentProcessed.sentimentSummary.negative}%</li>
//           </ul>
//         </div>
//
//         {/* ✅ Keyword toggle */}
//         <div style={{ textAlign: "right", marginBottom: "10px" }}>
//           <label style={{ fontWeight: "500" }}>
//             <input
//               type="checkbox"
//               checked={useKeywordsOnly}
//               onChange={() => setUseKeywordsOnly((prev) => !prev)}
//               style={{ marginRight: "8px" }}
//             />
//             Show Only Keywords
//           </label>
//         </div>
//
//         <div className="saq-dashboard-answers">
//           <div className="p-3">{firstGroupName}</div>
//           <div className="word-cloud-container">
//             <TagCloud
//               minSize={12}
//               maxSize={35}
//               tags={
//                 useKeywordsOnly
//                   ? contentProcessed.keywordData
//                   : contentProcessed.rawWordData
//               }
//               onClick={(tag) => alert(`'${tag.value}' was selected!`)}
//             />
//           </div>
//
//           {content2Processed && (
//             <>
//               <div className="p-3">{secondGroupName}</div>
//               <div className="saq-dashboard-sentiment-summary">
//                 <strong>Sentiment Analysis (Child Group):</strong>
//                 <ul>
//                   <li>😊 Positive: {content2Processed.sentimentSummary.positive}%</li>
//                   <li>😐 Neutral: {content2Processed.sentimentSummary.neutral}%</li>
//                   <li>😢 Negative: {content2Processed.sentimentSummary.negative}%</li>
//                 </ul>
//               </div>
//               <div className="word-cloud-container">
//                 <TagCloud
//                   minSize={12}
//                   maxSize={35}
//                   tags={
//                     useKeywordsOnly
//                       ? content2Processed.keywordData
//                       : content2Processed.rawWordData
//                   }
//                   onClick={(tag) => alert(`'${tag.value}' was selected!`)}
//                 />
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
//
// export default SAQDashboardListItem;
