import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateHeistPage from "@/app/(dashboard)/heists/create/page";

// Hoisted mocks
const mockFetchUsers = vi.hoisted(() => vi.fn());
const mockCreateHeist = vi.hoisted(() => vi.fn());
const mockRouterPush = vi.hoisted(() => vi.fn());
const mockServerTimestamp = vi.hoisted(() => vi.fn(() => "TIMESTAMP"));
const mockUser = vi.hoisted(() => ({
  uid: "currentUser",
  displayName: "Agent Current",
}));
const mockAuthLoading = vi.hoisted(() => ({ value: false }));

// Mock modules
vi.mock("@/lib/firebase/fetchUsers", () => ({
  fetchUsers: mockFetchUsers,
}));

vi.mock("@/lib/firebase/createHeist", () => ({
  createHeist: mockCreateHeist,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

vi.mock("@/lib/firebase/auth-context", () => ({
  useUser: () => ({
    user: mockUser,
    loading: mockAuthLoading.value,
  }),
}));

vi.mock("firebase/firestore", () => ({
  serverTimestamp: mockServerTimestamp,
}));

describe("CreateHeistPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthLoading.value = false;
    mockFetchUsers.mockResolvedValue([
      { id: "user1", codename: "Agent Smith" },
      { id: "user2", codename: "Agent Jones" },
    ]);
  });

  it("renders form with all input fields", async () => {
    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Assign To")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Heist" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("fetches users from Firestore on mount", async () => {
    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(mockFetchUsers).toHaveBeenCalledTimes(1);
    });
  });

  it("displays user codenames in assignee dropdown", async () => {
    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByText("Agent Smith")).toBeInTheDocument();
    });

    expect(screen.getByText("Agent Jones")).toBeInTheDocument();
  });

  it("excludes current user from assignee dropdown", async () => {
    mockFetchUsers.mockResolvedValue([
      { id: "currentUser", codename: "Agent Current" },
      { id: "user1", codename: "Agent Smith" },
      { id: "user2", codename: "Agent Jones" },
    ]);

    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByText("Agent Smith")).toBeInTheDocument();
    });

    expect(screen.getByText("Agent Jones")).toBeInTheDocument();
    expect(screen.queryByText("Agent Current")).not.toBeInTheDocument();
  });

  it("shows message when no other users exist", async () => {
    mockFetchUsers.mockResolvedValue([
      { id: "currentUser", codename: "Agent Current" },
    ]);

    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/No other agents available/i),
      ).toBeInTheDocument();
    });

    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup();
    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Create Heist" }),
      ).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", { name: "Create Heist" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });

    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(
      screen.getByText("Please select an agent to assign this heist to"),
    ).toBeInTheDocument();
  });

  it("shows error for title exceeding 20 characters", async () => {
    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;

    // Remove maxLength to test validation
    titleInput.removeAttribute("maxlength");

    // Trigger change event with long value
    fireEvent.change(titleInput, {
      target: { value: "This title is way too long for validation" },
    });
    fireEvent.blur(titleInput);

    await waitFor(() => {
      expect(
        screen.getByText("Title must be 20 characters or less"),
      ).toBeInTheDocument();
    });
  });

  it("shows error for description exceeding 200 characters", async () => {
    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
    });

    const descriptionInput = screen.getByLabelText(
      "Description",
    ) as HTMLTextAreaElement;
    const longText = "a".repeat(201);

    // Remove maxLength to test validation
    descriptionInput.removeAttribute("maxlength");

    // Trigger change event with long value
    fireEvent.change(descriptionInput, { target: { value: longText } });
    fireEvent.blur(descriptionInput);

    await waitFor(() => {
      expect(
        screen.getByText("Description must be 200 characters or less"),
      ).toBeInTheDocument();
    });
  });

  it("calls createHeist with correct CreateHeistInput structure", async () => {
    const user = userEvent.setup();
    mockCreateHeist.mockResolvedValue("heist123");

    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Title"), "Museum Heist");
    await user.type(screen.getByLabelText("Description"), "Steal the diamond");
    await user.selectOptions(screen.getByLabelText("Assign To"), "user1");

    const submitButton = screen.getByRole("button", { name: "Create Heist" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateHeist).toHaveBeenCalledTimes(1);
    });

    const callArgs = mockCreateHeist.mock.calls[0][0];
    expect(callArgs.title).toBe("Museum Heist");
    expect(callArgs.description).toBe("Steal the diamond");
    expect(callArgs.createdBy).toBe("currentUser");
    expect(callArgs.createdByCodename).toBe("Agent Current");
    expect(callArgs.assignedTo).toBe("user1");
    expect(callArgs.assignedToCodename).toBe("Agent Smith");
    expect(callArgs.finalStatus).toBe(null);
    expect(callArgs.createdAt).toBe("TIMESTAMP");
  });

  it("sets deadline to 48 hours from now", async () => {
    const user = userEvent.setup();
    mockCreateHeist.mockResolvedValue("heist123");

    const now = new Date("2026-02-20T12:00:00Z");
    vi.setSystemTime(now);

    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Title"), "Museum Heist");
    await user.type(screen.getByLabelText("Description"), "Steal the diamond");
    await user.selectOptions(screen.getByLabelText("Assign To"), "user1");

    const submitButton = screen.getByRole("button", { name: "Create Heist" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateHeist).toHaveBeenCalledTimes(1);
    });

    const callArgs = mockCreateHeist.mock.calls[0][0];
    const expectedDeadline = new Date("2026-02-22T12:00:00Z");
    expect(callArgs.deadline.getTime()).toBe(expectedDeadline.getTime());

    vi.useRealTimers();
  });

  it("redirects to /heists after successful submission", async () => {
    const user = userEvent.setup();
    mockCreateHeist.mockResolvedValue("heist123");

    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Title"), "Museum Heist");
    await user.type(screen.getByLabelText("Description"), "Steal the diamond");
    await user.selectOptions(screen.getByLabelText("Assign To"), "user1");

    const submitButton = screen.getByRole("button", { name: "Create Heist" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/heists");
    });
  });

  it("displays error message when Firestore write fails", async () => {
    const user = userEvent.setup();
    mockCreateHeist.mockRejectedValue(new Error("Permission denied"));

    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Title"), "Museum Heist");
    await user.type(screen.getByLabelText("Description"), "Steal the diamond");
    await user.selectOptions(screen.getByLabelText("Assign To"), "user1");

    const submitButton = screen.getByRole("button", { name: "Create Heist" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create heist. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during user fetch", async () => {
    let resolveFetchUsers: (value: unknown) => void;
    const fetchUsersPromise = new Promise((resolve) => {
      resolveFetchUsers = resolve;
    });
    mockFetchUsers.mockReturnValue(fetchUsersPromise);

    render(<CreateHeistPage />);

    expect(screen.getByText("Loading agents...")).toBeInTheDocument();

    resolveFetchUsers!([{ id: "user1", codename: "Agent Smith" }]);

    await waitFor(() => {
      expect(screen.queryByText("Loading agents...")).not.toBeInTheDocument();
    });
  });

  it("shows loading spinner during form submission", async () => {
    const user = userEvent.setup();
    let resolveCreateHeist: (value: unknown) => void;
    const createHeistPromise = new Promise((resolve) => {
      resolveCreateHeist = resolve;
    });
    mockCreateHeist.mockReturnValue(createHeistPromise);

    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Title"), "Museum Heist");
    await user.type(screen.getByLabelText("Description"), "Steal the diamond");
    await user.selectOptions(screen.getByLabelText("Assign To"), "user1");

    const submitButton = screen.getByRole("button", { name: "Create Heist" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    resolveCreateHeist!("heist123");

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalled();
    });
  });

  it("navigates to /heists when cancel button clicked", async () => {
    const user = userEvent.setup();
    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    expect(mockRouterPush).toHaveBeenCalledWith("/heists");
  });
});
