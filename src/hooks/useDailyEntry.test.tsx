import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { toast } from "sonner";
import { useDailyEntry } from "./useDailyEntry";
import { mockCreatedEntry, mockEntry, mockNewEntryData, mockUser } from "../../tests/mocks/mocks";

// --- Mock Setup ---
// Mock the global fetch function
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Mock the sonner toast functions
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Helper to create mock Response objects
const createMockResponse = (body: unknown, ok: boolean, status: number): Response => {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
};

// --- Test Suite ---
describe("useDailyEntry Hook", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.mocked(toast.success).mockReset();
    vi.mocked(toast.error).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State and Fetching", () => {
    it("should not fetch if no user is provided", () => {
      renderHook(() => useDailyEntry({ user: undefined }));
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("should initialize with isLoading=true and call fetch for today's entry", () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      fetchMock.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useDailyEntry({ user: mockUser }));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.entry).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith("/api/entries/today");
    });

    it("should fetch and set entry when today's entry exists", async () => {
      fetchMock.mockResolvedValue(createMockResponse(mockEntry, true, 200));
      const { result } = renderHook(() => useDailyEntry({ user: mockUser }));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.entry).toEqual(mockEntry);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith("/api/entries/today");
    });

    it("should fetch and set entry to null when no today's entry exists (returns null)", async () => {
      fetchMock.mockResolvedValue(createMockResponse(null, true, 200));
      const { result } = renderHook(() => useDailyEntry({ user: mockUser }));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.entry).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith("/api/entries/today");
    });

    it("should handle fetch error when getting today's entry", async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const errorResponse = { error: { message: "Server blew up" } };
      fetchMock.mockResolvedValue(createMockResponse(errorResponse, false, 500));

      const { result } = renderHook(() => useDailyEntry({ user: mockUser }));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.entry).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Server blew up");
      consoleErrorSpy.mockRestore();
    });

    it("should handle network error during fetch", async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const networkError = new Error("Network connection lost");
      fetchMock.mockRejectedValue(networkError);

      const { result } = renderHook(() => useDailyEntry({ user: mockUser }));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.entry).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Network connection lost");
      consoleErrorSpy.mockRestore();
    });
  });

  describe("Creating New Entry", () => {
    let hookResult: { current: ReturnType<typeof useDailyEntry> };

    beforeEach(async () => {
      fetchMock.mockResolvedValue(createMockResponse(null, true, 200));
      const { result } = renderHook(() => useDailyEntry({ user: mockUser }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      hookResult = result;
      fetchMock.mockClear();
    });

    it("should not attempt to create entry if no user is provided", async () => {
      const { result } = renderHook(() => useDailyEntry({ user: undefined }));

      await act(async () => {
        await result.current.createEntry(mockNewEntryData);
      });

      expect(fetchMock).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("should call fetch with POST to create entry and update state on success", async () => {
      fetchMock.mockResolvedValue(createMockResponse(mockCreatedEntry, true, 201));

      await act(async () => {
        await hookResult.current.createEntry(mockNewEntryData);
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockNewEntryData),
      });
      expect(hookResult.current.entry).toEqual(mockCreatedEntry);
      expect(hookResult.current.isLoading).toBe(false);
      expect(toast.success).toHaveBeenCalledWith("Entry created successfully");
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("should handle API error (e.g., 409 Duplicate) during creation and show toast", async () => {
      const errorResponse = { error: { message: "Entry already exists today" } };
      fetchMock.mockResolvedValue(createMockResponse(errorResponse, false, 409));
      const initialEntry = hookResult.current.entry;

      try {
        await act(async () => {
          await hookResult.current.createEntry(mockNewEntryData);
        });
        expect.fail("Expected createEntry to throw");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Entry already exists today");
      }

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(hookResult.current.entry).toBe(initialEntry);
      expect(hookResult.current.isLoading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Entry already exists today");
      expect(toast.success).not.toHaveBeenCalled();
    });

    it("should handle generic server error (e.g., 500) during creation and show toast", async () => {
      const errorResponse = { error: { message: "Something went wrong on the server" } };
      fetchMock.mockResolvedValue(createMockResponse(errorResponse, false, 500));
      const initialEntry = hookResult.current.entry;

      try {
        await act(async () => {
          await hookResult.current.createEntry(mockNewEntryData);
        });
        expect.fail("Expected createEntry to throw");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Something went wrong on the server");
      }

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(hookResult.current.entry).toBe(initialEntry);
      expect(hookResult.current.isLoading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Something went wrong on the server");
      expect(toast.success).not.toHaveBeenCalled();
    });

    it("should handle network error during creation and show toast", async () => {
      const networkError = new Error("Connection failed");
      fetchMock.mockRejectedValue(networkError);
      const initialEntry = hookResult.current.entry;

      await expect(
        act(async () => {
          await hookResult.current.createEntry(mockNewEntryData);
        })
      ).rejects.toThrow("Connection failed");

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(hookResult.current.entry).toBe(initialEntry);
      expect(hookResult.current.isLoading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith("Connection failed");
      expect(toast.success).not.toHaveBeenCalled();
    });
  });
});
