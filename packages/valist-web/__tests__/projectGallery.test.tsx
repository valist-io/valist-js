import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectGallery from "../features/projects/ProjectGallery";

describe("ProjectGallery", () => {
  const props = {
    assets: [
      {
        name: 'logo.png',
        src: 'https://app.valist.io/images/logo.png',
        type: 'image/png',
      },
    ],
  };
  
  it("Image is loaded in gallery view", () => {
    render(<ProjectGallery {...props}/>);
    const imgElement = screen.getByAltText('logo.png');
    expect(imgElement);
  });

  it("Image is loaded in preview", () => {
    render(<ProjectGallery {...props}/>);
    const imgElement = screen.getByAltText('logo.png-preview');
    expect(imgElement);
  });
});
