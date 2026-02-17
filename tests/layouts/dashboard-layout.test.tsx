import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { User } from "firebase/auth";
import DashboardLayout from "@/app/(dashboard)/layout";

const { mockUseUser, mockRouterReplace } = vi.hoisted(() => ({
  mockUseUser: vi.fn(),
  mockRouterReplace: vi.fn(),
}));

vi.mock("@/lib/firebase/auth-context", () => ({
  useUser: mockUseUser,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
}));

vi.mock("@/lib/firebase/config", () => ({ auth: {}, db: {} }));

vi.mock("firebase/auth", () => ({
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

const fakeUser = { uid: "123", displayName: "SwiftCrimsonFox" } as User;

describe("Dashboard Layout", () => {
  beforeEach(() => {
    mockUseUser.mockReset();
    mockRouterReplace.mockReset();
  });

  it("renders children when signed in (user: fakeUser, loading: false)", () => {
    mockUseUser.mockReturnValue({ user: fakeUser, loading: false });
    render(<DashboardLayout>page content</DashboardLayout>);
    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("renders spinner when loading: true", () => {
    mockUseUser.mockReturnValue({ user: fakeUser, loading: true });
    render(<DashboardLayout>page content</DashboardLayout>);
    expect(screen.queryByText("page content")).not.toBeInTheDocument();
  });

  it("calls router.replace('/login') when guest (user: null, loading: false)", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });
    render(<DashboardLayout>page content</DashboardLayout>);
    expect(mockRouterReplace).toHaveBeenCalledWith("/login");
  });
});
