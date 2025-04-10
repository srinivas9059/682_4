function SAQDashboardListItem({ content }) {
  return (
    <div className="saq-dashboard">
      <div className="saq-dashboard-inner p-3">
        <div className="saq-dashboard-question">{content.question}</div>
        <div className="saq-dashboard-norQuestion">
          {content.norQuestion} responses
        </div>
        <div className="saq-dashboard-answers">
          {content.subData.map((a, index) => {
            return (
              <div key={index} className="saq-dashboard-answer-list-item">
                {a}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SAQDashboardListItem;
