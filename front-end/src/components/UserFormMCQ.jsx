import { Radio } from "@mantine/core";

function UserFormMCQ({ content, updateUserResponse }) {
  const handleUpdateUserResponse = (e) => {
    const res = {
      questionID: content.questionID,
      // answer: content.options[e.target.value - 1],
      answer: content.options[e.target.value - 1].optionValue,
    };
    updateUserResponse(res);
  };

  console.log(content.options);

  return (
    <div className="user-form-mc-question w-100">
      <div className="user-form-mcq-text">{content.question}</div>
      <div className="user-form-mcq-all-options">
        <Radio.Group>
          {content.options.map((option, i) => (
            <div key={i} className="option mt-2">
              <Radio
                value={`${i + 1}`}
                className="align-self-center me-2"
                color="#edbb5f"
                onChange={handleUpdateUserResponse}
              />
              <div className="w-100">{option.optionValue}</div>
            </div>
          ))}
        </Radio.Group>
      </div>
    </div>
  );
}

export default UserFormMCQ;
