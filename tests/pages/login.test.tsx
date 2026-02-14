import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "@/app/(public)/login/page";

describe("LoginPage", () => {
  it("renders email input, password input, and Log In button", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("has a link to /signup", () => {
    render(<LoginPage />);
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("calls console.log with email and password on valid submit", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<LoginPage />);
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
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.submit(screen.getByRole("form"));
    expect(
      screen.getByText("Please enter a valid email address"),
    ).toBeInTheDocument();
  });
});
