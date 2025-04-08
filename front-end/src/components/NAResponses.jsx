import { useLocation } from "react-router-dom";

function NAResponses() {
  const location = useLocation();
  const qParams = new URLSearchParams(location.search);
  const formTitle = qParams.get("title");

  return (
    <div className="na-responses-page">
      <div className="na-responses">
        <div className="na-responses-inner">
          <div className="na-responses-form-title">{formTitle}</div>
          <div className="na-responses-description">
            This form is no longer accepting responses.
          </div>
        </div>
      </div>
    </div>
  );
}

export default NAResponses;
