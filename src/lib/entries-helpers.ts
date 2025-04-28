import type { EntryListResponseDto } from "@/types";

export const sampleEntries = {
  data: [
    {
      id: "sample-entry-1",
      what_matters_most: "Living a life of virtue and wisdom",
      fears_of_loss: "Fear of wasting time on trivial matters",
      personal_goals: "Practice daily meditation and journaling",
      generate_duration: 1.1,
      generated_sentence:
        "Remember, time is the only resource you cannot recover. Instead of worrying about trivial matters, devote each day to cultivating virtue and wisdom.",
      created_at: "2024-03-20T10:00:00Z",
      user_id: "sample-user",
    },
    {
      id: "sample-entry-2",
      what_matters_most: "Building meaningful relationships",
      fears_of_loss: "Fear of not being present in important moments",
      personal_goals: "Spend quality time with family daily",
      generate_duration: 0.74,
      generated_sentence:
        "Do not be absent in moments that truly matter. Every moment spent with loved ones is precious. Strengthen bonds through presence, not words.",
      created_at: "2024-03-21T10:00:00Z",
      user_id: "sample-user",
    },
    {
      id: "sample-entry-3",
      what_matters_most: "Contributing to society meaningfully",
      fears_of_loss: "Fear of not reaching my full potential",
      personal_goals: "Start a community project to help others",
      generate_duration: 0.98,
      generated_sentence:
        "Do not measure your life by numbers, but by how much good you bring into the world. Your actions have the power to change reality, even if they start with just one person.",
      created_at: "2024-03-22T10:00:00Z",
      user_id: "sample-user",
    },
    {
      id: "sample-entry-4",
      what_matters_most: "Maintaining physical and mental health",
      fears_of_loss: "Fear of losing self-discipline",
      personal_goals: "Establish a consistent exercise routine",
      generate_duration: 1.03,
      generated_sentence:
        "Your body and mind are tools you must respect. Do not neglect them, and you will not only grow physically stronger but mentally resilient, ready to face any challenge.",
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

export const findEntryById = (id: string) => {
  return sampleEntries.data.find((entry) => entry.id === id);
};
