import { render, screen } from "@testing-library/react";
import Tabs from "../../../components/Tabs";

describe("Tabs", () => {
  const props = {
    view: 'Tab1',
    setView: () => {},
    tabs: [
      {
        text: 'Tab1',
        disabled: false,
      },
      { 
        text: 'Tab2',
        disabled: true,
      },
    ],
  };
  
  it("Tabs are rendered in list", () => {
    render(<Tabs {...props}/>);

    const tab1Element = screen.getByText('Tab1');
    const tab2Element = screen.getByText('Tab2');
    expect(tab1Element && tab2Element);
  });

  it("Active tab has class text-indigo-500", () => {
    render(<Tabs {...props}/>);

    const tab1Element = screen.getByText('Tab1');
    expect(tab1Element.className.includes('text-indigo-500'));
  });

  it("Enabled tab has class cursor-pointer", () => {
    render(<Tabs {...props}/>);

    const tab1Element = screen.getByText('Tab1');
    expect(tab1Element.className.includes('cursor-pointer'));
  });

  it("Disabled tab has class cursor-not-allowed", () => {
    render(<Tabs {...props}/>);

    const tab2Element = screen.getByText('Tab2');
    expect(tab2Element.className.includes('cursor-not-allowed'));
  });
});
