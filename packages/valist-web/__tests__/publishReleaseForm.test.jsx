import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PublishReleaseForm from "../features/releases/PublishReleaseForm";
import { store } from '../app/store';
import { Provider } from 'react-redux';

describe("PublishReleaseForm", () => {
  const props = {
    teamNames: ["testAccount", "testAccount2"],
    projectID: "vfvdafvsfvasfvsfvasfvasfvas",
    projectNames: ["testProject", "testProject2"],
    releaseTeam: "testAccount",
    releaseProject: "testProject",
    releaseDescription: "An example description",
    releaseName: "0.0.1",
    releaseFiles: [],
    releaseImage: [],
    setProjectID: () => {},
    setImage: () => {},
    setFiles: () => {},
    submit: () => {}, 
  }
  
  it("Select's default account name", () => {
    render(
      <Provider store={store}>
        <PublishReleaseForm {...props} />
      </Provider>
    );

    const accountSelect = screen.getByLabelText('Account');
    expect(accountSelect.value === "testAccount");
  });

  it("Select's default project name", () => {
    render(
      <Provider store={store}>
        <PublishReleaseForm {...props}/>);
      </Provider>
    );

    const projectSelect = screen.getByLabelText('Project');
    expect(projectSelect.value === "testProject");
  });

  // it("On text input, dispatch description", () => {
  //   render(<PublishReleaseForm {...props}/>);
  //   fireEvent.change(input, {target: {value: 'Test description'}})
  // });

  // it("On submit, call props.submit function", () => {
  //   render(<PublishReleaseForm {...props}/>);

  //   fireEvent(
  //     getByText(container, 'Submit'),
  //     new MouseEvent('click', {
  //       bubbles: true,
  //       cancelable: true,
  //     }),
  //   )
  // });
});
