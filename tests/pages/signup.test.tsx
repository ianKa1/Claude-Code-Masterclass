import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SignupPage from "@/app/(public)/signup/page";

const { mockSignUpUser, mockRouterPush } = vi.hoisted(() => ({
  mockSignUpUser: vi.fn(),
  mockRouterPush: vi.fn(),
}));

vi.mock("@/lib/firebase/signup", () => ({
  signUpUser: mockSignUpUser,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

describe("SignupPage", () => {
  beforeEach(() => {
    mockSignUpUser.mockReset();
    mockRouterPush.mockReset();
  });

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

  it("calls signUpUser with email and password on valid submit", async () => {
    mockSignUpUser.mockResolvedValue(undefined);
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(mockSignUpUser).toHaveBeenCalledWith(
        "test@example.com",
        "secret123",
      );
    });
  });

  it("redirects to /heists on successful signup", async () => {
    mockSignUpUser.mockResolvedValue(undefined);
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/heists");
    });
  });

  it("shows inline error when email is already registered", async () => {
    mockSignUpUser.mockRejectedValue({ code: "auth/email-already-in-use" });
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "taken@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(
        screen.getByText("Email is already registered"),
      ).toBeInTheDocument();
    });
  });

  it("shows password error for weak password", async () => {
    mockSignUpUser.mockRejectedValue({ code: "auth/weak-password" });
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "abc" },
    });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 6 characters"),
      ).toBeInTheDocument();
    });
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
