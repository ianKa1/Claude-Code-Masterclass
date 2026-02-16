import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { User } from "firebase/auth";
import { AuthProvider, useUser } from "@/lib/firebase/auth-context";

// Prevent real Firebase initialization
vi.mock("@/lib/firebase/config", () => ({
  auth: {},
  db: {},
}));

// Use vi.hoisted so the variable is available inside the hoisted mock factory
const { mockOnAuthStateChanged } = vi.hoisted(() => ({
  mockOnAuthStateChanged: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: mockOnAuthStateChanged,
}));

function TestConsumer() {
  const { user, loading } = useUser();
  if (loading) return <div>loading</div>;
  return <div>{user ? user.email : "no user"}</div>;
}

describe("useUser", () => {
  beforeEach(() => {
    mockOnAuthStateChanged.mockReset();
  });

  it("returns null user when no one is signed in", () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, cb: (u: User | null) => void) => {
        cb(null);
        return () => {};
      },
    );
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByText("no user")).toBeInTheDocument();
  });

  it("returns user object when signed in", () => {
    const fakeUser = {
      uid: "123",
      email: "test@example.com",
      displayName: "Test User",
    } as unknown as User;
    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, cb: (u: User | null) => void) => {
        cb(fakeUser);
        return () => {};
      },
    );
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("throws when used outside AuthProvider", () => {
    mockOnAuthStateChanged.mockImplementation(() => () => {});
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useUser must be used within an AuthProvider",
    );
    spy.mockRestore();
  });
});
