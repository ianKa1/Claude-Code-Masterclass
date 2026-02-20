import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHeist } from "@/lib/firebase/createHeist";
import type { CreateHeistInput } from "@/types/firestore/heist";

// Hoisted mocks
const mockAddDoc = vi.hoisted(() => vi.fn());
const mockServerTimestamp = vi.hoisted(() => vi.fn());
const mockCollection = vi.hoisted(() => vi.fn(() => ({ _type: "collection" })));

vi.mock("firebase/firestore", () => ({
  collection: mockCollection,
  addDoc: (ref: unknown, data: unknown) => mockAddDoc(ref, data),
  serverTimestamp: () => mockServerTimestamp(),
}));

// Mock config
vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

describe("createHeist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls addDoc with correct input and returns document ID", async () => {
    const mockDocRef = { id: "heist123" };
    mockAddDoc.mockResolvedValue(mockDocRef);
    mockServerTimestamp.mockReturnValue("TIMESTAMP_PLACEHOLDER");

    const input: CreateHeistInput = {
      title: "Museum Heist",
      description: "Steal the diamond",
      createdBy: "user1",
      createdByCodename: "Agent Smith",
      assignedTo: "user2",
      assignedToCodename: "Agent Jones",
      deadline: new Date("2026-02-22T12:00:00Z"),
      finalStatus: null,
      createdAt: mockServerTimestamp(),
    };

    const result = await createHeist(input);

    expect(mockAddDoc).toHaveBeenCalledWith(expect.anything(), input);
    expect(result).toBe("heist123");
  });

  it("propagates error when Firestore write fails", async () => {
    const firestoreError = new Error("Permission denied");
    mockAddDoc.mockRejectedValue(firestoreError);
    mockServerTimestamp.mockReturnValue("TIMESTAMP_PLACEHOLDER");

    const input: CreateHeistInput = {
      title: "Museum Heist",
      description: "Steal the diamond",
      createdBy: "user1",
      createdByCodename: "Agent Smith",
      assignedTo: "user2",
      assignedToCodename: "Agent Jones",
      deadline: new Date("2026-02-22T12:00:00Z"),
      finalStatus: null,
      createdAt: mockServerTimestamp(),
    };

    await expect(createHeist(input)).rejects.toThrow("Permission denied");
  });
});
