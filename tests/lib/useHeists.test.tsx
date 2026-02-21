import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { User } from "firebase/auth";

// Hoisted mocks
const mockUseUser = vi.hoisted(() => vi.fn());
const mockOnSnapshot = vi.hoisted(() => vi.fn());
const mockQuery = vi.hoisted(() => vi.fn());
const mockWhere = vi.hoisted(() => vi.fn());
const mockOrderBy = vi.hoisted(() => vi.fn());
const mockLimit = vi.hoisted(() => vi.fn());
const mockCollection = vi.hoisted(() => vi.fn());
const mockTimestampNow = vi.hoisted(() =>
  vi.fn(() => ({ seconds: Date.now() / 1000 })),
);
const mockWithConverter = vi.hoisted(() => vi.fn());

// Mock modules
vi.mock("@/lib/firebase/auth-context", () => ({
  useUser: mockUseUser,
}));

vi.mock("firebase/firestore", () => ({
  collection: mockCollection,
  query: mockQuery,
  where: mockWhere,
  orderBy: mockOrderBy,
  limit: mockLimit,
  onSnapshot: mockOnSnapshot,
  Timestamp: {
    now: mockTimestampNow,
  },
}));

vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

vi.mock("@/types/firestore/heist", () => ({
  heistConverter: { toFirestore: vi.fn(), fromFirestore: vi.fn() },
}));

import { useHeists } from "@/lib/firebase/useHeists";

describe("useHeists", () => {
  const mockUser: User = {
    uid: "test-user-123",
  } as User;

  const mockHeists = [
    {
      id: "heist-1",
      title: "Bank Heist",
      description: "Test description",
      createdBy: "user-1",
      createdByCodename: "Leader",
      assignedTo: "test-user-123",
      assignedToCodename: "Agent",
      deadline: new Date("2026-12-31"),
      finalStatus: null,
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock setup
    mockCollection.mockReturnValue({});
    mockWithConverter.mockReturnValue({});
    mockCollection.mockImplementation(() => ({
      withConverter: mockWithConverter,
    }));
    mockWithConverter.mockReturnValue("converted-ref");
    mockQuery.mockReturnValue("query-result");
    mockWhere.mockReturnValue("where-result");
    mockOrderBy.mockReturnValue("orderBy-result");
    mockLimit.mockReturnValue("limit-result");

    // Default onSnapshot: no-op unsubscribe
    mockOnSnapshot.mockReturnValue(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty array when user is null", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });

    const { result } = renderHook(() => useHeists("active"));

    expect(result.current.heists).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it("shows loading state while fetching data", () => {
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const { result } = renderHook(() => useHeists("active"));

    // Initially loading
    expect(result.current.loading).toBe(true);
  });

  it("'active' filter queries by assignedTo and future deadline", () => {
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    renderHook(() => useHeists("active"));

    expect(mockWhere).toHaveBeenCalledWith("assignedTo", "==", "test-user-123");
    expect(mockWhere).toHaveBeenCalledWith("deadline", ">", expect.anything());
    expect(mockOrderBy).toHaveBeenCalledWith("deadline", "asc");
    expect(mockLimit).toHaveBeenCalledWith(50);
  });

  it("'assigned' filter queries by createdBy and future deadline", () => {
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    renderHook(() => useHeists("assigned"));

    expect(mockWhere).toHaveBeenCalledWith("createdBy", "==", "test-user-123");
    expect(mockWhere).toHaveBeenCalledWith("deadline", ">", expect.anything());
    expect(mockOrderBy).toHaveBeenCalledWith("deadline", "asc");
    expect(mockLimit).toHaveBeenCalledWith(50);
  });

  it("'expired' filter queries by past deadline (no user filter)", () => {
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    renderHook(() => useHeists("expired"));

    // Should NOT filter by user
    expect(mockWhere).not.toHaveBeenCalledWith(
      "assignedTo",
      expect.anything(),
      expect.anything(),
    );
    expect(mockWhere).not.toHaveBeenCalledWith(
      "createdBy",
      expect.anything(),
      expect.anything(),
    );

    // Should filter by past deadline
    expect(mockWhere).toHaveBeenCalledWith("deadline", "<=", expect.anything());
    expect(mockOrderBy).toHaveBeenCalledWith("deadline", "desc");
    expect(mockLimit).toHaveBeenCalledWith(50);
  });

  it("hook updates when onSnapshot callback fires (real-time)", async () => {
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    let snapshotCallback:
      | ((snapshot: { docs: { data: () => unknown }[] }) => void)
      | null = null;

    mockOnSnapshot.mockImplementation((query, successCb) => {
      snapshotCallback = successCb;
      return vi.fn();
    });

    const { result } = renderHook(() => useHeists("active"));

    // Initially empty
    expect(result.current.heists).toEqual([]);

    // Simulate Firestore snapshot
    const mockSnapshot = {
      docs: [{ data: () => mockHeists[0] }],
    };

    if (snapshotCallback) {
      snapshotCallback(mockSnapshot);
    }

    await waitFor(() => {
      expect(result.current.heists).toEqual([mockHeists[0]]);
      expect(result.current.loading).toBe(false);
    });
  });

  it("hook cleans up listener on unmount (unsubscribe called)", () => {
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const mockUnsubscribe = vi.fn();
    mockOnSnapshot.mockReturnValue(mockUnsubscribe);

    const { unmount } = renderHook(() => useHeists("active"));

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("hook handles Firestore errors gracefully", async () => {
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    let errorCallback:
      | ((error: { code: string; message: string }) => void)
      | null = null;

    mockOnSnapshot.mockImplementation((query, successCb, errorCb) => {
      errorCallback = errorCb;
      return vi.fn();
    });

    const { result } = renderHook(() => useHeists("active"));

    // Simulate Firestore error
    const mockError = { code: "permission-denied", message: "Access denied" };
    if (errorCallback) {
      errorCallback(mockError);
    }

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Failed to load heists. Please try again.",
      );
      expect(result.current.loading).toBe(false);
    });
  });

  it("hook re-subscribes when filter parameter changes", () => {
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const mockUnsubscribe = vi.fn();
    mockOnSnapshot.mockReturnValue(mockUnsubscribe);

    const { rerender } = renderHook(({ filter }) => useHeists(filter), {
      initialProps: { filter: "active" as const },
    });

    expect(mockOnSnapshot).toHaveBeenCalledTimes(1);

    // Change filter
    rerender({ filter: "assigned" as const });

    // Old subscription should be cleaned up
    expect(mockUnsubscribe).toHaveBeenCalled();

    // New subscription should be created
    expect(mockOnSnapshot).toHaveBeenCalledTimes(2);
  });

  it("refetch function triggers new query", async () => {
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const { result } = renderHook(() => useHeists("active"));

    expect(mockOnSnapshot).toHaveBeenCalledTimes(1);

    // Trigger refetch
    result.current.refetch();

    await waitFor(() => {
      expect(mockOnSnapshot).toHaveBeenCalledTimes(2);
    });
  });
});
