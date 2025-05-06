import { useLocation } from "react-router-dom";

function ResponseSubmitted() {
  const location = useLocation();
  const qParams = new URLSearchParams(location.search);
  const formTitle = qParams.get("title");
  const formID = qParams.get("id");
  const formGroupID = qParams.get("groupID");
  const CLIENT_BASE_URL = import.meta.env.VITE_CLIENT_BASE_URL;

  return (
    <div className="response-submitted-page">
      <div className="response-submitted">
        <div className="response-submitted-inner">
          <div className="response-submitted-form-title">{formTitle}</div>
          <div className="response-submitted-description">
            Your response has been submitted.
          </div>
          <a
            className="response-submitted-sar"
            href={`${CLIENT_BASE_URL}/#/userform/${formGroupID}/${formID}`}
          >
            Submit another response
          </a>
        </div>
      </div>
    </div>
  );
}

export default ResponseSubmitted;
