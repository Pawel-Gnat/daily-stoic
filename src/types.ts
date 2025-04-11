import type { Tables } from "./db/database.types";

// -----------------------------------------------------------------------------
// Entity Types (based on database tables)
// -----------------------------------------------------------------------------

/**
 * User entity representing a user in the system
 */
export type User = Tables<"users">;

/**
 * Entry entity representing a daily stoic reflection
 */
export type Entry = Tables<"entries">;

// -----------------------------------------------------------------------------
// Authentication DTOs
// -----------------------------------------------------------------------------

/**
 * Data required to register a new user
 */
export interface RegisterUserDto {
  /** User's email (must be unique) */
  email: string;
  /** User's password (min 8 characters) */
  password: string;
  /** User's display name */
  name: string;
}

/**
 * Data required to authenticate a user
 */
export interface LoginUserDto {
  /** User's email */
  email: string;
  /** User's password */
  password: string;
}

/**
 * User data returned from the API (excludes sensitive information)
 */
export type UserDto = Pick<User, "id" | "email" | "name" | "created_at">;

/**
 * Response returned after successful authentication
 */
export interface AuthResponseDto {
  /** JWT token for authenticated requests */
  token: string;
  /** User information */
  user: UserDto;
}

// -----------------------------------------------------------------------------
// Entry DTOs
// -----------------------------------------------------------------------------

/**
 * Data required to create a new entry
 */
export interface CreateEntryDto {
  /** Answer to "What matters most to you?" (max 500 chars) */
  what_matters_most: string;
  /** Answer to "What do you fear losing?" (max 500 chars) */
  fears_of_loss: string;
  /** Answer to "What do you want to achieve?" (max 500 chars) */
  personal_goals: string;
}

/**
 * Entry data returned from the API
 */
export type EntryDto = Entry;

/**
 * Pagination metadata for list responses
 */
export interface PaginationMetadata {
  /** Current page number */
  current_page: number;
  /** Total number of pages */
  total_pages: number;
  /** Total number of items across all pages */
  total_items: number;
  /** Whether there are more pages after the current one */
  has_next: boolean;
}

/**
 * Response for paginated entry list
 */
export interface EntryListResponseDto {
  /** Array of entry items */
  data: EntryDto[];
  /** Pagination metadata */
  pagination: PaginationMetadata;
}

// -----------------------------------------------------------------------------
// Error DTOs
// -----------------------------------------------------------------------------

/**
 * Standard error response structure
 */
export interface ErrorResponseDto {
  error: {
    /** Error code (usually matches HTTP status code) */
    code: string;
    /** User-friendly error message */
    message: string;
  };
}

// -----------------------------------------------------------------------------
// Query Parameters
// -----------------------------------------------------------------------------

/**
 * Query parameters for paginated entry list
 */
export interface EntryListQueryParams {
  /** Page number (1-based indexing) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Sorting criteria (field:direction) */
  sort?: string;
}
