import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PasswordInput from "@/components/PasswordInput";

describe("PasswordInput", () => {
  it("renders with type password by default", () => {
    render(<PasswordInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("••••••••")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("toggles to type text when toggle button is clicked", () => {
    render(<PasswordInput value="" onChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByPlaceholderText("••••••••")).toHaveAttribute(
      "type",
      "text",
    );
  });

  it("toggle button aria-label updates after toggle", () => {
    render(<PasswordInput value="" onChange={() => {}} />);
    const btn = screen.getByRole("button", { name: "Show password" });
    fireEvent.click(btn);
    expect(btn).toHaveAccessibleName("Hide password");
  });
});
