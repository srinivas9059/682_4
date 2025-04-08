import { Radio, Group } from "@mantine/core";

function UserFormLSQ({ content, updateUserResponse }) {
  const handleUpdateUserResponse = (e) => {
    const res = {
      questionID: content.questionID,
      answer: e.target.value,
    };
    updateUserResponse(res);
  };

  return (
    <div className="user-form-ls-question w-100">
      <div className="user-form-lsq-text">{content.question}</div>
      <div className="pt-2 pb-2 mt-2">
        <Radio.Group>
          <Group justify="space-around">
            {content.labels.map((label, i) => (
              <div className="d-flex flex-column align-items-center" key={i}>
                <div className="pb-2">{label !== "" ? label : i + 1}</div>
                <Radio
                  value={`${i + 1}`}
                  color="#edbb5f"
                  onChange={handleUpdateUserResponse}
                />
              </div>
            ))}
          </Group>
        </Radio.Group>
      </div>
    </div>
  );
}

export default UserFormLSQ;
