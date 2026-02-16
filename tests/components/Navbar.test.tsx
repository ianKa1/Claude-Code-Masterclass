import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { User } from "firebase/auth";
import Navbar from "@/components/Navbar";

const { mockUseUser, mockSignOut } = vi.hoisted(() => ({
  mockUseUser: vi.fn(),
  mockSignOut: vi.fn(),
}));

vi.mock("@/lib/firebase/auth-context", () => ({
  useUser: mockUseUser,
}));

vi.mock("firebase/auth", () => ({
  signOut: mockSignOut,
}));

vi.mock("@/lib/firebase/config", () => ({
  auth: {},
}));

const fakeUser = { uid: "123", email: "test@example.com" } as unknown as User;

describe("Navbar", () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({ user: null, loading: false });
    mockSignOut.mockReset();
  });

  it("renders the main heading", () => {
    render(<Navbar />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the Create Heist link", () => {
    render(<Navbar />);
    const createLink = screen.getByRole("link", { name: /create heist/i });
    expect(createLink).toBeInTheDocument();
    expect(createLink).toHaveAttribute("href", "/heists/create");
  });

  it("does not render logout button when user is null", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });
    render(<Navbar />);
    expect(
      screen.queryByRole("button", { name: /log out/i }),
    ).not.toBeInTheDocument();
  });

  it("does not render logout button while loading", () => {
    mockUseUser.mockReturnValue({ user: fakeUser, loading: true });
    render(<Navbar />);
    expect(
      screen.queryByRole("button", { name: /log out/i }),
    ).not.toBeInTheDocument();
  });

  it("renders logout button when user is signed in", () => {
    mockUseUser.mockReturnValue({ user: fakeUser, loading: false });
    render(<Navbar />);
    expect(
      screen.getByRole("button", { name: /log out/i }),
    ).toBeInTheDocument();
  });

  it("calls signOut when logout button is clicked", async () => {
    mockUseUser.mockReturnValue({ user: fakeUser, loading: false });
    mockSignOut.mockResolvedValue(undefined);
    render(<Navbar />);
    fireEvent.click(screen.getByRole("button", { name: /log out/i }));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("stays mounted if signOut rejects", async () => {
    mockUseUser.mockReturnValue({ user: fakeUser, loading: false });
    mockSignOut.mockRejectedValue(new Error("network error"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Navbar />);
    fireEvent.click(screen.getByRole("button", { name: /log out/i }));
    expect(
      screen.getByRole("button", { name: /log out/i }),
    ).toBeInTheDocument();
    spy.mockRestore();
  });
});
