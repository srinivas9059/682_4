import { TextInput } from "@mantine/core";

function SAQuestion({ content, updateQuestion }) {
  var saQuestion = {
    questionID: content.questionID,
    questionType: content.questionType,
    question: content.question,
  };

  return (
    <div className="sa-question">
      <div className="question-sa-type">
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
            saQuestion.question = e.target.value;
            updateQuestion(saQuestion);
          }}
          value={content.question}
        />
      </div>
      <div className="short-answer">
        <TextInput
          variant="filled"
          placeholder="Short Answer"
          className="mb-3"
          disabled={true}
        />
      </div>
    </div>
  );
}

export default SAQuestion;
