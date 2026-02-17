import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "@/app/(public)/login/page";

const { mockLoginUser } = vi.hoisted(() => ({
  mockLoginUser: vi.fn(),
}));

vi.mock("@/lib/firebase/login", () => ({
  loginUser: mockLoginUser,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockLoginUser.mockReset();
  });

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

  it("calls loginUser with email and password on valid submit", async () => {
    mockLoginUser.mockResolvedValue("SwiftCrimsonFox");
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith(
        "test@example.com",
        "secret123",
      );
    });
  });

  it("shows success message with codename after sign-in", async () => {
    mockLoginUser.mockResolvedValue("SwiftCrimsonFox");
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(
        screen.getByText("Welcome back, SwiftCrimsonFox!"),
      ).toBeInTheDocument();
    });
  });

  it("shows 'Welcome back, Agent!' when displayName is null", async () => {
    mockLoginUser.mockResolvedValue(null);
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(screen.getByText("Welcome back, Agent!")).toBeInTheDocument();
    });
  });

  it("shows inline error for invalid credentials", async () => {
    mockLoginUser.mockRejectedValue({ code: "auth/invalid-credential" });
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrongpass" },
    });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  it("shows inline error for too many requests", async () => {
    mockLoginUser.mockRejectedValue({ code: "auth/too-many-requests" });
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(
        screen.getByText("Too many attempts. Please try again later"),
      ).toBeInTheDocument();
    });
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
