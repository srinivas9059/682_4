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

  const renderSentimentPie = (summary) => (
    <div style={{ width: "330px", height: "240px" }}>
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
        {/* PDF Button */}
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

        {/* Question + Count */}
        <div style={{ padding: "0 0 0 0" }} className="saq-dashboard-question">{content.question}</div>
        <div>
          <div style={{ padding: "0 0 10px 0" }} className="saq-dashboard-norQuestion">
            {content.responses.length} responses
          </div>
        </div>

        {/* Sentiment Summary + Pie Chart (Single Group Mode) */}
        {!content2 && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "40px",
              marginTop: "0px",
              padding: "24px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 240px", padding: "50px 0px 0px 100px", minWidth: "220px" }}>
              <div style={{ fontWeight: "700", fontSize: "1rem", marginBottom: "6px" }}>
                Sentiment Analysis (Parent Group):
              </div>
              <ul style={{ paddingLeft: "18px", lineHeight: "2", margin: 0 }}>
                <li>😊 Positive: {contentProcessed.sentimentSummary.positive}%</li>
                <li>😐 Neutral: {contentProcessed.sentimentSummary.neutral}%</li>
                <li>😢 Negative: {contentProcessed.sentimentSummary.negative}%</li>
              </ul>
            </div>
            <div style={{ flex: "0 0 330px", padding: "0px 110px 0px 0px" }}>
              {renderSentimentPie(contentProcessed.sentimentSummary)}
            </div>
          </div>
        )}

        {/* Sentiment Summary + Pie Chart (Comparison Mode) */}
        {content2 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0px 10px 130px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              gap: "30px",
              flexWrap: "wrap",
            }}
          >
            {/* Parent Group */}
            <div style={{ flex: "1 1 300px", minWidth: "280px", padding: "5px 110px 0px 0px" }}>
              <div style={{ fontWeight: "700", fontSize: "1rem", marginBottom: "8px" }}>
                Sentiment Analysis (Parent Group):
              </div>
              <ul style={{ paddingLeft: "60px", lineHeight: "1.6", margin: 0 }}>
                <li>😊 Positive: {contentProcessed.sentimentSummary.positive}%</li>
                <li>😐 Neutral: {contentProcessed.sentimentSummary.neutral}%</li>
                <li>😢 Negative: {contentProcessed.sentimentSummary.negative}%</li>
              </ul>
              <div style={{ marginTop: "10px" }}>
                {renderSentimentPie(contentProcessed.sentimentSummary)}
              </div>
            </div>

            {/* Child Group */}
            <div style={{ flex: "1 1 300px", minWidth: "280px",  padding: "5px 110px 0px 0px" }}>
              <div style={{ fontWeight: "700", fontSize: "1rem", marginBottom: "8px" }}>
                Sentiment Analysis (Child Group):
              </div>
              <ul style={{ paddingLeft: "60px", lineHeight: "1.6", margin: 0 }}>
                <li>😊 Positive: {content2Processed.sentimentSummary.positive}%</li>
                <li>😐 Neutral: {content2Processed.sentimentSummary.neutral}%</li>
                <li>😢 Negative: {content2Processed.sentimentSummary.negative}%</li>
              </ul>
              <div style={{ marginTop: "10px" }}>
                {renderSentimentPie(content2Processed.sentimentSummary)}
              </div>
            </div>
          </div>
        )}

        {/* Word Clouds */}
        <div className="saq-dashboard-answers">
          {firstGroupName && <div style={{textAlign: "center", fontWeight: "700", fontSize: "1.3rem"}} className="p-3">{firstGroupName}</div>}
          <div className="word-cloud-container">
            <TagCloud
              minSize={12}
              maxSize={35}
              tags={useKeywordsOnly ? contentProcessed.keywordData : contentProcessed.rawWordData}
              onClick={(tag) => alert(`'${tag.value}' was selected!`)}
            />
          </div>

          {content2Processed && (
            <>
              {secondGroupName && <div style={{textAlign: "center", fontWeight: "700", fontSize: "1.3rem"}} className="p-3">{secondGroupName}</div>}
              <div className="word-cloud-container">
                <TagCloud
                  minSize={12}
                  maxSize={35}
                  tags={useKeywordsOnly ? content2Processed.keywordData : content2Processed.rawWordData}
                  onClick={(tag) => alert(`'${tag.value}' was selected!`)}
                />
              </div>
            </>
          )}
        </div>

        {/* Keyword Toggle */}
        <div style={{ textAlign: "right", marginBottom: "6px", marginTop: "4px" }}>
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
      </div>
    </div>
  );
}

export default SAQDashboardListItem;



// import { useState, useRef } from "react";
// import { TagCloud } from "react-tagcloud";
// import { removeStopwords } from "stopword";
// import Sentiment from "sentiment";
// import { extractKeywordsFromResponses } from "../utils/aiKeywordUtils";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
//
// ChartJS.register(ArcElement, Tooltip, Legend);
//
// function SAQDashboardListItem({
//   content,
//   content2,
//   selectedGroupNames1,
//   selectedGroupNames2,
// }) {
//   const sentiment = new Sentiment();
//   const [useKeywordsOnly, setUseKeywordsOnly] = useState(false);
//   const dashboardRef = useRef(null);
//
//   const firstGroupName = content2 ? Object.values(selectedGroupNames1).join(", ") : null;
//   const secondGroupName = content2 ? Object.values(selectedGroupNames2).join(", ") : null;
//
//   function extractRawWordData(responses) {
//     const words = responses.join(" ").split(/\s+/);
//     const filteredWords = removeStopwords(words);
//     const counts = filteredWords.reduce((acc, word) => {
//       word = word.toLowerCase();
//       acc[word] = acc[word] ? acc[word] + 1 : 1;
//       return acc;
//     }, {});
//     return Object.entries(counts).map(([value, count]) => ({ value, count }));
//   }
//
//   function processResponses(responses) {
//     const rawWordData = extractRawWordData(responses);
//     const keywordData = extractKeywordsFromResponses(responses);
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
//   const renderSentimentPie = (summary) => {
//     return (
//       <div style={{ width: "330px", height: "240px" }}>
//         <Pie
//           data={{
//             labels: ["Positive 😊", "Neutral 😐", "Negative 😢"],
//             datasets: [
//               {
//                 data: [summary.positive, summary.neutral, summary.negative],
//                 backgroundColor: ["#66bb6a", "#ffee58", "#ef5350"],
//                 borderColor: "#fff",
//               },
//             ],
//           }}
//           options={{
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: { legend: { position: "bottom" } },
//           }}
//         />
//       </div>
//     );
//   };
//
//   const handleDownloadPDF = () => {
//     if (!dashboardRef.current) return;
//     html2canvas(dashboardRef.current, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "pt", "a4");
//       const imgWidth = 550;
//       const pageHeight = 780;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 20;
//
//       pdf.addImage(imgData, "PNG", 30, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//
//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 30, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }
//
//       pdf.save("SAQ_Analysis.pdf");
//     });
//   };
//
//   return (
//     <div className="saq-dashboard">
//       <div ref={dashboardRef} className="saq-dashboard-inner p-3" style={{ position: "relative" }}>
//         {/* PDF Download Button */}
//         <button
//           onClick={handleDownloadPDF}
//           style={{
//             position: "absolute",
//             top: "10px",
//             right: "10px",
//             background: "#007bff",
//             color: "#fff",
//             padding: "8px 14px",
//             borderRadius: "6px",
//             fontWeight: "600",
//             fontSize: "0.9rem",
//             cursor: "pointer",
//             zIndex: 10,
//           }}
//         >
//           📥 Download (PDF)
//         </button>
//
//         {/* Question and Count */}
//         <div style={{ padding: "0px 0px 0px 00px" }} className="saq-dashboard-question">{content.question}</div>
//         <div>
//             <div style={{ padding: "0px 0px 10px 00px" }} className="saq-dashboard-norQuestion">
//           {content.responses.length} responses
//         </div>
//         </div>
//
//
//
//
//         {/* Sentiment + Pie Chart */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "flex-start",
//             justifyContent: "space-between",
//             gap: "40px",
//             marginTop: "0px",
//             padding: "24px",
//             borderRadius: "8px",
//             backgroundColor: "#f9f9f9",
//             flexWrap: "wrap",
//           }}
//         >
//           <div style={{ flex: "1 1 240px",padding: "50px 0px 0px 100px", minWidth: "220px" }}>
//             <div style={{ fontWeight: "700", fontSize: "1rem", marginBottom: "6px" }}>
//               Sentiment Analysis (Parent Group):
//             </div>
//             <ul style={{ paddingLeft: "18px", lineHeight: "2", margin: 0 }}>
//               <li>😊 Positive: {contentProcessed.sentimentSummary.positive}%</li>
//               <li>😐 Neutral: {contentProcessed.sentimentSummary.neutral}%</li>
//               <li>😢 Negative: {contentProcessed.sentimentSummary.negative}%</li>
//             </ul>
//           </div>
//           <div style={{ flex: "0 0 330px",padding: "0px 110px 0px 0px", }}>{renderSentimentPie(contentProcessed.sentimentSummary)}</div>
//         </div>
//
//         {/* Word Cloud */}
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
//           {/* Toggle */}
//         <div style={{ textAlign: "right", marginBottom: "6px", marginTop: "4px" }}>
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
//           {/* Comparison Mode */}
//           {content2Processed && (
//             <>
//               <div className="p-3">{secondGroupName}</div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-start",
//                   justifyContent: "space-between",
//                   gap: "40px",
//                   marginBottom: "25px",
//                   padding: "24px",
//                   borderRadius: "8px",
//                   backgroundColor: "#f9f9f9",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <div style={{ flex: "1 1 240px", minWidth: "220px" }}>
//                   <div style={{ fontWeight: "700", fontSize: "1rem", marginBottom: "6px" }}>
//                     Sentiment Analysis (Child Group):
//                   </div>
//                   <ul style={{ paddingLeft: "18px", lineHeight: "1.6", margin: 0 }}>
//                     <li>😊 Positive: {content2Processed.sentimentSummary.positive}%</li>
//                     <li>😐 Neutral: {content2Processed.sentimentSummary.neutral}%</li>
//                     <li>😢 Negative: {content2Processed.sentimentSummary.negative}%</li>
//                   </ul>
//                 </div>
//                 <div style={{ flex: "0 0 330px" }}>{renderSentimentPie(content2Processed.sentimentSummary)}</div>
//               </div>
//
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