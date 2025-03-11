import { TextInput } from "@mantine/core";
import { Radio, Group } from "@mantine/core";
import { Select } from "@mantine/core";

function LSQuestion({ content, updateQuestion }) {
  var lsQuestion = {
    questionID: content.questionID,
    questionType: content.questionType,
    question: content.question,
    upperLimit: content.upperLimit,
    labels: content.labels,
  };

  return (
    <div className="ls-question">
      <div className="question-ls-type">
        <TextInput
          variant="filled"
          label="Question"
          placeholder="Enter Question"
          className="mb-3"
          styles={{
            label: {
              color: "#585858",
              marginBottom: "7px",
              fontSize: 17,
            },
          }}
          onChange={(e) => {
            lsQuestion.question = e.target.value;
            updateQuestion(lsQuestion);
          }}
          value={content.question}
        />
      </div>
      <div className="ls-question-settings">
        <div className="mb-3 w-25">
          <Select
            label="Upper Limit"
            placeholder="Pick value"
            data={["2", "3", "4", "5", "6", "7", "8", "9", "10"]}
            defaultValue="5"
            allowDeselect={false}
            checkIconPosition="right"
            onChange={(_value) => {
              lsQuestion.upperLimit = _value;
              lsQuestion.labels = new Array(parseInt(_value)).fill("");
              updateQuestion(lsQuestion);
            }}
          />
        </div>
        <div>
          {content.labels.map((label, i) => (
            <div key={i} className="d-flex mt-2">
              <span className="me-1 p-1 align-self-center">{i + 1}</span>
              <TextInput
                variant="filled"
                placeholder="Label (Optional)"
                onChange={(e) => {
                  lsQuestion.labels[i] = e.target.value;
                  updateQuestion(lsQuestion);
                }}
                value={label}
                className="w-100"
              />
            </div>
          ))}
        </div>
        <div className="pt-2 pb-2 mt-4 ls-question-preview">
          <Radio.Group>
            <Group justify="space-around">
              {content.labels.map((label, i) => (
                <div className="d-flex flex-column align-items-center" key={i}>
                  <div className="pb-2">{label !== "" ? label : i + 1}</div>
                  <Radio color="#4c8e7e" disabled />
                </div>
              ))}
            </Group>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}

export default LSQuestion;
