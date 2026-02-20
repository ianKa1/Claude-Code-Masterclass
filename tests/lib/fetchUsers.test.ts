import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchUsers } from "@/lib/firebase/fetchUsers";

// Mock Firestore
const mockGetDocs = vi.fn();
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: (ref: unknown) => mockGetDocs(ref),
}));

// Mock config
vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

describe("fetchUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns array of UserDoc when users exist", async () => {
    const mockDocs = [
      {
        id: "user1",
        data: () => ({ codename: "Agent Smith" }),
      },
      {
        id: "user2",
        data: () => ({ codename: "Agent Jones" }),
      },
    ];

    mockGetDocs.mockResolvedValue({
      docs: mockDocs,
    });

    const result = await fetchUsers();

    expect(result).toEqual([
      { id: "user1", codename: "Agent Smith" },
      { id: "user2", codename: "Agent Jones" },
    ]);
  });

  it("returns empty array when no users", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [],
    });

    const result = await fetchUsers();

    expect(result).toEqual([]);
  });

  it("propagates error when Firestore fails", async () => {
    const firestoreError = new Error("Firestore connection failed");
    mockGetDocs.mockRejectedValue(firestoreError);

    await expect(fetchUsers()).rejects.toThrow("Firestore connection failed");
  });
});
