import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import App from "../App";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    // Check if the component renders by looking for any element in the document
    expect(document.body).toBeTruthy();
  });
});
