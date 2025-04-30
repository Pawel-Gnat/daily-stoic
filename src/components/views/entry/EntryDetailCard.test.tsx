import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EntryDetailCard } from "./EntryDetailCard";
import { mockEntry } from "../../../../tests/mocks/mocks";
import { questions } from "@/lib/question-helpers";

// --- Test Suite ---
describe("EntryDetailCard Component", () => {
  it("should render all entry details correctly", () => {
    render(<EntryDetailCard entry={mockEntry} />);

    expect(screen.getByText(questions[0].question)).toBeInTheDocument();
    expect(screen.getByText(questions[1].question)).toBeInTheDocument();
    expect(screen.getByText(questions[2].question)).toBeInTheDocument();

    expect(screen.getByText(mockEntry.what_matters_most)).toBeInTheDocument();
    expect(screen.getByText(mockEntry.fears_of_loss)).toBeInTheDocument();
    expect(screen.getByText(mockEntry.personal_goals)).toBeInTheDocument();

    expect(screen.getByText("Stoic Wisdom")).toBeInTheDocument();
    expect(screen.getByText(mockEntry.generated_sentence)).toBeInTheDocument();
  });
});
