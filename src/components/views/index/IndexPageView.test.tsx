import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import IndexPageView from "./IndexPageView";
import { useDailyEntry } from "../../../hooks/useDailyEntry";
import type { UserDto } from "@/types";
import { mockEntry, mockUser } from "../../../../tests/mocks/mocks";
import userEvent from "@testing-library/user-event";
import { questions } from "@/lib/question-helpers";

// --- Mocks ---
// Mock the useDailyEntry hook
vi.mock("../../../hooks/useDailyEntry");

// Define the type for the hook's return value
type UseDailyEntryReturn = ReturnType<typeof useDailyEntry>;

// --- Test Suite ---
describe("IndexPageView Component", () => {
  let mockCreateEntryFn: ReturnType<typeof vi.fn>;
  let defaultHookReturnValue: UseDailyEntryReturn;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateEntryFn = vi.fn().mockResolvedValue(mockEntry);
    defaultHookReturnValue = {
      entry: null,
      isLoading: false,
      createEntry: mockCreateEntryFn,
    };
    vi.mocked(useDailyEntry).mockReturnValue(defaultHookReturnValue);
  });

  const renderComponent = (user: UserDto | undefined) => {
    render(<IndexPageView user={user} />);
  };

  it("should render Spinner when user exists and isLoading is true", () => {
    const loadingState: UseDailyEntryReturn = {
      ...defaultHookReturnValue,
      isLoading: true,
    };
    vi.mocked(useDailyEntry).mockReturnValue(loadingState);
    renderComponent(mockUser);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(screen.queryByText(/Reflect on your today's entry/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /View Example Reflections/i })).not.toBeInTheDocument();
  });

  it("should render ReflectionForm (disabled) and NavLink when no user exists", () => {
    renderComponent(undefined);

    expect(screen.getByTestId("reflection-form")).toBeInTheDocument();

    const formButton = screen.getByRole("button", { name: /Sign in to add reflection/i });
    expect(formButton).toBeInTheDocument();
    expect(formButton).toBeDisabled();

    const navLink = screen.getByRole("link", { name: /View Example Reflections/i });
    expect(navLink).toBeInTheDocument();
    expect(navLink).toHaveAttribute("href", "/entries");

    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    expect(screen.queryByText(/Reflect on your today's entry/i)).not.toBeInTheDocument();
  });

  it("should render ReflectionForm (enabled) when user exists and no entry exists", () => {
    renderComponent(mockUser);

    expect(screen.getByTestId("reflection-form")).toBeInTheDocument();

    const formButton = screen.getByRole("button", { name: /Add Reflection/i });
    expect(formButton).toBeInTheDocument();
    expect(formButton).toBeEnabled();

    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /View Example Reflections/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Reflect on your today's entry/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Discover ancient wisdom/i)).toBeInTheDocument();
  });

  it("should render EntryDetailCard when user exists and entry exists", () => {
    const entryState: UseDailyEntryReturn = {
      ...defaultHookReturnValue,
      entry: mockEntry,
    };
    vi.mocked(useDailyEntry).mockReturnValue(entryState);
    renderComponent(mockUser);

    expect(screen.getByText(/Reflect on your today's entry/i)).toBeInTheDocument();
    expect(screen.getByText(mockEntry.fears_of_loss)).toBeInTheDocument();
    expect(screen.getByText(mockEntry.generated_sentence)).toBeInTheDocument();

    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    expect(screen.queryByTestId("reflection-form")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /View Example Reflections/i })).not.toBeInTheDocument();
  });

  it("should call createEntry from hook when ReflectionForm's onEntryCreated is invoked", async () => {
    const user = userEvent.setup();
    renderComponent(mockUser);

    await user.type(screen.getByRole("textbox", { name: questions[0].question }), "test");
    await user.type(screen.getByRole("textbox", { name: questions[1].question }), "test");
    await user.type(screen.getByRole("textbox", { name: questions[2].question }), "test");

    const formButton = screen.getByRole("button", { name: /Add Reflection/i });
    await user.click(formButton);

    expect(mockCreateEntryFn).toHaveBeenCalledTimes(1);
    expect(mockCreateEntryFn).toHaveBeenCalledWith({
      fears_of_loss: "test",
      personal_goals: "test",
      what_matters_most: "test",
    });
  });
});
