import { render, screen } from "@testing-library/react";
import App from "./App";

test("sends a logged out visitor to the login page", () => {
  localStorage.clear();
  render(<App />);
  expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
});
