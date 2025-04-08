import { TagCloud } from "react-tagcloud";
import { removeStopwords } from "stopword";

function SAQDashboardListItem({
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
  const words = content.subData.join(" ").split(/\s+/);
  const filteredWords = removeStopwords(words);

  const counts = filteredWords.reduce((acc, word) => {
    word = word.toLowerCase();
    acc[word] = acc[word] ? acc[word] + 1 : 1;
    return acc;
  }, {});

  const wordData = Object.entries(counts).map(([value, count]) => ({
    value,
    count,
  }));

  const getContent2 = () => {
    if (content2 == null) {
      return null;
    }
    const words2 = content2.subData.join(" ").split(/\s+/);

    const filteredWords2 = removeStopwords(words2);

    const counts2 = filteredWords2.reduce((acc, word) => {
      word = word.toLowerCase();
      acc[word] = acc[word] ? acc[word] + 1 : 1;
      return acc;
    }, {});

    const wordData2 = content2
      ? Object.entries(counts2).map(([value, count]) => ({
          value,
          count,
        }))
      : null;

    return wordData2;
  };

  return (
    <div className="saq-dashboard">
      <div className="saq-dashboard-inner p-3">
        <div className="saq-dashboard-question">{content.question}</div>
        <div className="saq-dashboard-norQuestion">
          {content.responses.length} responses
        </div>
        <div className="saq-dashboard-answers">
          {/*       {content.subData.map((a, index) => (
            <div key={index} className="saq-dashboard-answer-list-item">
              {a}
            </div>
          ))} */}
          <div className="p-3">{firstGroupName}</div>
          <div className="word-cloud-container">
            <TagCloud
              minSize={12}
              maxSize={35}
              tags={wordData}
              onClick={(tag) => alert(`'${tag.value}' was selected!`)}
            />
          </div>
          <div className="p-3">{secondGroupName}</div>
          <div className="word-cloud-container">
            {console.log("---conetent2---", content2)}
            {content2 != null && (
              <TagCloud
                minSize={12}
                maxSize={35}
                tags={getContent2()}
                onClick={(tag) => alert(`'${tag.value}' was selected!`)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SAQDashboardListItem;
