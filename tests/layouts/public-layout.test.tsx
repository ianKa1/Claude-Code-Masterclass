import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { User } from "firebase/auth";
import PublicLayout from "@/app/(public)/layout";

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

describe("Public Layout", () => {
  beforeEach(() => {
    mockUseUser.mockReset();
    mockRouterReplace.mockReset();
  });

  it("renders children when guest (user: null, loading: false)", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });
    render(<PublicLayout>page content</PublicLayout>);
    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("renders spinner when loading: true", () => {
    mockUseUser.mockReturnValue({ user: null, loading: true });
    render(<PublicLayout>page content</PublicLayout>);
    expect(screen.queryByText("page content")).not.toBeInTheDocument();
  });

  it("calls router.replace('/heists') when signed-in user, loading: false", () => {
    mockUseUser.mockReturnValue({ user: fakeUser, loading: false });
    render(<PublicLayout>page content</PublicLayout>);
    expect(mockRouterReplace).toHaveBeenCalledWith("/heists");
  });
});
