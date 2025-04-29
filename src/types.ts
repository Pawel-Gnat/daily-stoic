import type { Tables } from "./db/database.types";

import type { User as SupabaseUser } from "@supabase/supabase-js";
export type Entry = Tables<"entries">;

export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export type UserDto = Pick<SupabaseUser, "id" | "email">;

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export interface CreateEntryDto {
  what_matters_most: string;
  fears_of_loss: string;
  personal_goals: string;
}

export type EntryDto = Entry;

export interface PaginationMetadata {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
}

export interface EntryListResponseDto {
  data: EntryDto[];
  pagination: PaginationMetadata;
}

export interface ErrorResponseDto {
  error: {
    code: string;
    message: string;
  };
}

export interface EntryListQueryParams {
  page: number;
  limit: number;
  sort: string;
}
