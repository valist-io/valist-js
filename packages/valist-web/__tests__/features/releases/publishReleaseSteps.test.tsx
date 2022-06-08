import { render, screen } from "@testing-library/react";
import PublishReleaseSteps from "../../../features/releases/PublishReleaseSteps";

describe("PublishReleaseForm", () => {
  it("Renders correct publish code", () => {
    render(<PublishReleaseSteps />);
    const codeBlock = screen.getByText(/Initialize your project/);
    
    expect(codeBlock);
  });
});
