import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReflectionForm } from "./ReflectionForm";
import type { CreateEntryDto } from "@/types";
import { questions } from "@/lib/question-helpers";

describe("ReflectionForm Component", () => {
  let mockOnEntryCreated: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnEntryCreated = vi.fn().mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  const renderForm = (props: Partial<React.ComponentProps<typeof ReflectionForm>> = {}) => {
    return render(<ReflectionForm onEntryCreated={mockOnEntryCreated} disabled={false} {...props} />);
  };

  it("should render form fields and submit button", () => {
    renderForm();
    expect(screen.getByLabelText(questions[0].question)).toBeInTheDocument();
    expect(screen.getByLabelText(questions[1].question)).toBeInTheDocument();
    expect(screen.getByLabelText(questions[2].question)).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: questions[0].question })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: questions[1].question })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: questions[2].question })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Add Reflection/i })).toBeInTheDocument();
  });

  it("should allow typing into textareas", async () => {
    const user = userEvent.setup();
    renderForm();

    const field1 = screen.getByRole("textbox", { name: questions[0].question });
    const field2 = screen.getByRole("textbox", { name: questions[1].question });
    const field3 = screen.getByRole("textbox", { name: questions[2].question });

    await user.type(field1, "This really matters.");
    await user.type(field2, "Losing my keys.");
    await user.type(field3, "Learn testing.");

    expect(field1).toHaveValue("This really matters.");
    expect(field2).toHaveValue("Losing my keys.");
    expect(field3).toHaveValue("Learn testing.");
  });

  it("should call onEntryCreated with form data on valid submission", async () => {
    const user = userEvent.setup();
    renderForm();

    const formData: CreateEntryDto = {
      what_matters_most: "Valid input 1",
      fears_of_loss: "Valid input 2",
      personal_goals: "Valid input 3",
    };

    await user.type(screen.getByRole("textbox", { name: questions[0].question }), formData.what_matters_most);
    await user.type(screen.getByRole("textbox", { name: questions[1].question }), formData.fears_of_loss);
    await user.type(screen.getByRole("textbox", { name: questions[2].question }), formData.personal_goals);

    const submitButton = screen.getByRole("button", { name: /Add Reflection/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnEntryCreated).toHaveBeenCalledTimes(1);
    });
    expect(mockOnEntryCreated).toHaveBeenCalledWith(formData);
  });

  it("should NOT call onEntryCreated if form is invalid (e.g., empty required fields)", async () => {
    const user = userEvent.setup();
    renderForm();

    const submitButton = screen.getByRole("button", { name: /Add Reflection/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnEntryCreated).not.toHaveBeenCalled();
    });
  });

  describe("when disabled prop is true", () => {
    it("should disable textareas and submit button", () => {
      renderForm({ disabled: true });

      expect(screen.getByRole("textbox", { name: questions[0].question })).toBeDisabled();
      expect(screen.getByRole("textbox", { name: questions[1].question })).toBeDisabled();
      expect(screen.getByRole("textbox", { name: questions[2].question })).toBeDisabled();

      expect(screen.getByRole("button", { name: /Sign in to add reflection/i })).toBeDisabled();
    });

    it("should not call onEntryCreated when disabled button is clicked", async () => {
      const user = userEvent.setup();
      renderForm({ disabled: true });

      const submitButton = screen.getByRole("button", { name: /Sign in to add reflection/i });
      await user.click(submitButton);

      expect(mockOnEntryCreated).not.toHaveBeenCalled();
    });
  });
});
