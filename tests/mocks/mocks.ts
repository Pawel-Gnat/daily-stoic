import type { CreateEntryDto } from "@/types";

import type { EntryDto, UserDto } from "@/types";

export const mockUser: UserDto = { id: "user-123", email: "test@example.com" };

export const mockEntry: EntryDto = {
  id: "entry-456",
  user_id: "user-123",
  fears_of_loss: "Existing fear",
  generated_sentence: "Generated sentence for existing",
  personal_goals: "Existing goal",
  what_matters_most: "Existing matter",
  created_at: new Date().toISOString(),
  generate_duration: 10,
};

export const mockNewEntryData: CreateEntryDto = {
  fears_of_loss: "New fear",
  personal_goals: "New goal",
  what_matters_most: "New matter",
};

export const mockCreatedEntry: EntryDto = {
  id: "entry-789",
  user_id: "user-123",
  fears_of_loss: mockNewEntryData.fears_of_loss,
  generated_sentence: "Generated sentence for new",
  personal_goals: mockNewEntryData.personal_goals,
  what_matters_most: mockNewEntryData.what_matters_most,
  created_at: new Date().toISOString(),
  generate_duration: 15,
};
