import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Hoisted mocks
const mockUseHeists = vi.hoisted(() => vi.fn());

// Mock modules
vi.mock("@/lib/firebase/useHeists", () => ({
  useHeists: mockUseHeists,
}));

import HeistsPage from "@/app/(dashboard)/heists/page";

describe("HeistsPage", () => {
  const mockActiveHeists = [
    {
      id: "heist-1",
      title: "Active Bank Heist",
      description: "Test",
      createdBy: "user-1",
      createdByCodename: "Leader",
      assignedTo: "test-user",
      assignedToCodename: "Agent",
      deadline: new Date("2026-12-31"),
      finalStatus: null,
      createdAt: new Date(),
    },
  ];

  const mockAssignedHeists = [
    {
      id: "heist-2",
      title: "Assigned Vault Heist",
      description: "Test",
      createdBy: "test-user",
      createdByCodename: "Boss",
      assignedTo: "user-2",
      assignedToCodename: "Crew",
      deadline: new Date("2026-11-30"),
      finalStatus: null,
      createdAt: new Date(),
    },
  ];

  const mockExpiredHeists = [
    {
      id: "heist-3",
      title: "Expired Museum Heist",
      description: "Test",
      createdBy: "user-3",
      createdByCodename: "Old Leader",
      assignedTo: "user-4",
      assignedToCodename: "Old Crew",
      deadline: new Date("2020-01-01"),
      finalStatus: "success" as const,
      createdAt: new Date("2019-12-01"),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders three section headers", () => {
    mockUseHeists.mockReturnValue({
      heists: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<HeistsPage />);

    expect(
      screen.getByRole("heading", { name: "Your Active Heists" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Heists You've Assigned" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "All Expired Heists" }),
    ).toBeInTheDocument();
  });

  it("calls useHeists three times with correct filters", () => {
    mockUseHeists.mockReturnValue({
      heists: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<HeistsPage />);

    expect(mockUseHeists).toHaveBeenCalledTimes(3);
    expect(mockUseHeists).toHaveBeenCalledWith("active");
    expect(mockUseHeists).toHaveBeenCalledWith("assigned");
    expect(mockUseHeists).toHaveBeenCalledWith("expired");
  });

  it("displays heist titles under correct sections", () => {
    mockUseHeists.mockImplementation((filter) => {
      if (filter === "active") {
        return {
          heists: mockActiveHeists,
          loading: false,
          error: null,
          refetch: vi.fn(),
        };
      }
      if (filter === "assigned") {
        return {
          heists: mockAssignedHeists,
          loading: false,
          error: null,
          refetch: vi.fn(),
        };
      }
      if (filter === "expired") {
        return {
          heists: mockExpiredHeists,
          loading: false,
          error: null,
          refetch: vi.fn(),
        };
      }
      return { heists: [], loading: false, error: null, refetch: vi.fn() };
    });

    render(<HeistsPage />);

    // Verify all heist titles are displayed
    expect(screen.getByText("Active Bank Heist")).toBeInTheDocument();
    expect(screen.getByText("Assigned Vault Heist")).toBeInTheDocument();
    expect(screen.getByText("Expired Museum Heist")).toBeInTheDocument();
  });

  it("shows loading state when hook returns loading: true", () => {
    mockUseHeists.mockImplementation((filter) => {
      if (filter === "active") {
        return {
          heists: [],
          loading: true,
          error: null,
          refetch: vi.fn(),
        };
      }
      return { heists: [], loading: false, error: null, refetch: vi.fn() };
    });

    render(<HeistsPage />);

    const loadingTexts = screen.getAllByText("Loading...");
    expect(loadingTexts.length).toBeGreaterThan(0);
  });

  it("shows error message when hook returns error", () => {
    mockUseHeists.mockImplementation((filter) => {
      if (filter === "assigned") {
        return {
          heists: [],
          loading: false,
          error: "Failed to load heists. Please try again.",
          refetch: vi.fn(),
        };
      }
      return { heists: [], loading: false, error: null, refetch: vi.fn() };
    });

    render(<HeistsPage />);

    expect(
      screen.getByText("Failed to load heists. Please try again."),
    ).toBeInTheDocument();
  });

  it("shows empty state when no heists", () => {
    mockUseHeists.mockReturnValue({
      heists: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<HeistsPage />);

    const emptyMessages = screen.getAllByText("No heists found.");
    // Should have 3 empty states (one for each section)
    expect(emptyMessages).toHaveLength(3);
  });

  it("displays heist titles as list items when heists exist", () => {
    mockUseHeists.mockImplementation((filter) => {
      if (filter === "active") {
        return {
          heists: mockActiveHeists,
          loading: false,
          error: null,
          refetch: vi.fn(),
        };
      }
      return { heists: [], loading: false, error: null, refetch: vi.fn() };
    });

    render(<HeistsPage />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBeGreaterThan(0);
    expect(listItems[0]).toHaveTextContent("Active Bank Heist");
    expect(listItems[0].tagName).toBe("LI");
  });
});
