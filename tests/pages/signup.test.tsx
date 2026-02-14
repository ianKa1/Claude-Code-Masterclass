import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SignupPage from "@/app/(public)/signup/page";

describe("SignupPage", () => {
  it("renders email input, password input, and Sign Up button", () => {
    render(<SignupPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("has a link to /login", () => {
    render(<SignupPage />);
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("calls console.log with email and password on valid submit", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret" },
    });
    fireEvent.submit(screen.getByRole("form"));
    expect(spy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "secret",
    });
    spy.mockRestore();
  });

  it("shows inline error when invalid email is submitted", () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.submit(screen.getByRole("form"));
    expect(
      screen.getByText("Please enter a valid email address"),
    ).toBeInTheDocument();
  });
});
