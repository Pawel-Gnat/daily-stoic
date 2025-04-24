# REST API Plan

## 1. Resources

### 1.1 Users

Maps to the `users` table, representing authenticated users of the application. This table is managed by Supabase Auth.

### 1.2 Entries

Maps to the `entries` table, representing daily stoic reflections with generated AI responses.

## 2. Endpoints

### 2.1 Entries

#### Create Entry

- Method: `POST`
- Path: `/entries`
- Description: Create a new daily entry and generate stoic sentence
- Authentication: Required
- Request Body:

```json
{
  "what_matters_most": "string",
  "fears_of_loss": "string",
  "personal_goals": "string"
}
```

- Response (201 Created):

```json
{
  "id": "uuid",
  "what_matters_most": "string",
  "fears_of_loss": "string",
  "personal_goals": "string",
  "generated_sentence": "string",
  "generate_duration": number,
  "created_at": "timestamp"
}
```

- Error Codes:
  - 400: Invalid input (validation errors)
  - 401: Unauthorized
  - 409: Conflict (duplicate_entry) - entry for today already exists
  - 429: Too many requests
  - 500: AI generation error

#### List Entries

- Method: `GET`
- Path: `/entries`
- Description: Retrieve user's entries with pagination
- Authentication: Required
- Query Parameters:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `sort`: string (default: "created_at:desc")
- Response (200 OK):

```json
{
  "data": [{
    "id": "uuid",
    "what_matters_most": "string",
    "fears_of_loss": "string",
    "personal_goals": "string",
    "generated_sentence": "string",
    "generate_duration": number,
    "created_at": "timestamp"
  }],
  "pagination": {
    "current_page": number,
    "total_pages": number,
    "total_items": number,
    "has_next": boolean
  }
}
```

- Error Codes:
  - 401: Unauthorized
  - 400: Invalid query parameters

#### Get Entry

- Method: `GET`
- Path: `/entries/{id}`
- Description: Retrieve a specific entry
- Authentication: Required
- Response (200 OK):

```json
{
  "id": "uuid",
  "what_matters_most": "string",
  "fears_of_loss": "string",
  "personal_goals": "string",
  "generated_sentence": "string",
  "generate_duration": number,
  "created_at": "timestamp"
}
```

- Error Codes:
  - 401: Unauthorized
  - 403: Forbidden (not owner)
  - 404: Entry not found

#### Delete Entry

- Method: `DELETE`
- Path: `/entries/{id}`
- Description: Delete a specific entry
- Authentication: Required
- Response (204 No Content)
- Error Codes:
  - 401: Unauthorized
  - 403: Forbidden (not owner)
  - 404: Entry not found

#### Get Today's Entry

- Method: `GET`
- Path: `/entries/today`
- Description: Retrieve the entry created by the authenticated user for the current day
- Authentication: Required (JWT token)
- Query Parameters: None
- Response (200 OK):

```json
{
  "id": "uuid",
  "what_matters_most": "string",
  "fears_of_loss": "string",
  "personal_goals": "string",
  "generated_sentence": "string",
  "generate_duration": number,
  "created_at": "timestamp"
}
```

- Error Codes:
  - 401: Unauthorized (missing or invalid JWT token)
  - 404: Not Found (no entry exists for today)
  - 500: Internal Server Error

## 3. Authentication and Authorization

### 3.1 Authentication

- JWT-based authentication provided by Supabase
- JWT token must be included in Authorization header for protected endpoints:
  `Authorization: Bearer <token>`

### 3.2 Authorization

- Row Level Security (RLS) implemented at database level
- Users can only access and modify their own entries
- Authorization enforced through Supabase policies

## 4. Validation and Business Logic

### 4.1 Input Validation

- Email: Valid email format, unique in system
- Password: Minimum 8 characters (handled by Supabase)
- Entry fields:
  - `what_matters_most`: Required, max 500 characters
  - `fears_of_loss`: Required, max 500 characters
  - `personal_goals`: Required, max 500 characters

### 4.2 Business Logic

- AI sentence generation:
  - Triggered automatically on entry creation
  - Maximum processing time: 10 seconds
  - Generation duration tracked for monitoring
- Entry management:
  - Entries are immutable once created
  - Deletion requires confirmation (handled by frontend)
  - Chronological ordering by default

### 4.3 Rate Limiting

- Entry creation: 5 requests per hour per user
- Authentication endpoints: 20 requests per hour per IP
- General endpoints: 100 requests per hour per user

### 4.4 Error Handling

- Standardized error response format:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

- All errors logged for monitoring
- User-friendly error messages returned
- Separate monitoring for AI generation timing
