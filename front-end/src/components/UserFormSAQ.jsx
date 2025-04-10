import { TextInput } from "@mantine/core";

function UserFormSAQ({ content, updateUserResponse }) {
  const handleUpdateUserResponse = (e) => {
    const res = {
      questionID: content.questionID,
      answer: e.target.value,
    };
    updateUserResponse(res);
  };

  // const theme = createTheme({
  //   palette: {
  //     primary: {
  //       main: "#606264",
  //     },
  //   },
  // });

  return (
    <div className="user-form-sa-question">
      <div className="user-form-sa-text">{content.question}</div>
      <div className="user-form-saq-answer">
        {/* <ThemeProvider theme={theme}>
          <TextField
            id="standard-basic"
            label="Answer"
            variant="standard"
            onChange={handleUpdateUserResponse}
            sx={{ width: "100%" }}
          />
        </ThemeProvider> */}
        <TextInput
          variant="filled"
          placeholder="Your Answer"
          onChange={handleUpdateUserResponse}
        />
      </div>
    </div>
  );
}

export default UserFormSAQ;
