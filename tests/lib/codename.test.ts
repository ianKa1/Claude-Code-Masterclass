import { describe, it, expect, vi, afterEach } from "vitest";
import { generateCodename } from "@/lib/utils/codename";

describe("generateCodename", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a non-empty string", () => {
    expect(generateCodename()).toBeTruthy();
  });

  it("returns three PascalCase words joined together", () => {
    expect(generateCodename()).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+[A-Z][a-z]+$/);
  });

  it("returns first word from each array when Math.random returns 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const codename = generateCodename();
    // With index 0 from each array: "Swift" + "Amber" + "Fox"
    expect(codename).toBe("SwiftAmberFox");
  });
});
