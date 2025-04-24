import type { EntryListResponseDto } from "@/types";

export const sampleEntries = {
  data: [
    {
      id: "sample-entry-1",
      what_matters_most: "Living a life of virtue and wisdom",
      fears_of_loss: "Fear of wasting time on trivial matters",
      personal_goals: "Practice daily meditation and journaling",
      generate_duration: 1.1,
      generated_sentence: "The journey of a thousand miles begins with a single step.",
      created_at: "2024-03-20T10:00:00Z",
      user_id: "sample-user",
    },
    {
      id: "sample-entry-2",
      what_matters_most: "Building meaningful relationships",
      fears_of_loss: "Fear of not being present in important moments",
      personal_goals: "Spend quality time with family daily",
      generate_duration: 0.74,
      generated_sentence: "The journey of a thousand miles begins with a single step.",
      created_at: "2024-03-21T10:00:00Z",
      user_id: "sample-user",
    },
    {
      id: "sample-entry-3",
      what_matters_most: "Contributing to society meaningfully",
      fears_of_loss: "Fear of not reaching my full potential",
      personal_goals: "Start a community project to help others",
      generate_duration: 0.98,
      generated_sentence: "The journey of a thousand miles begins with a single step.",
      created_at: "2024-03-22T10:00:00Z",
      user_id: "sample-user",
    },
    {
      id: "sample-entry-4",
      what_matters_most: "Maintaining physical and mental health",
      fears_of_loss: "Fear of losing self-discipline",
      personal_goals: "Establish a consistent exercise routine",
      generate_duration: 1.03,
      generated_sentence: "The journey of a thousand miles begins with a single step.",
      created_at: "2024-03-23T10:00:00Z",
      user_id: "sample-user",
    },
  ],
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_items: 4,
    has_next: false,
  },
} satisfies EntryListResponseDto;
