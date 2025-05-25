import { describe, it, expect, vi, beforeEach } from "vitest";
import { addApplication } from "../data/applications";
import { Application } from "../types/application";

// Mock Supabase - define mocks inside the factory function
vi.mock("@/lib/supabase", () => ({
  default: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Mock crypto.randomUUID
vi.stubGlobal("crypto", {
  randomUUID: vi.fn(() => "mock-uuid-123"),
});

describe("addApplication", () => {
  // Mock user and application data
  const mockUser = {
    id: "user-123",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated" as const,
    created_at: "2023-01-01T00:00:00.000Z",
  };
  // mocks the Application type
  const mockApplication: Application = {
    company: "Test Company",
    position: "Software Engineer",
    notes: "Test notes",
    url: "https://example.com",
    date: Date.now(),
    company_id: "company-123",
    contact_id: "contact-123",
    favorite: false,
    is_archived: false,
    id: "",
    user_id: "",
    currentStage: 0,
    stages: [],
    is_deleted: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully add application without stages", async () => {
    // Get the mocked supabase instance
    const supabase = (await import("@/lib/supabase")).default;

    // Mock successful user authentication
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock successful application insert
    const mockInsertedApp = {
      ...mockApplication,
      id: "app-123",
      auth_user: mockUser.id,
    };

    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: mockInsertedApp,
          error: null,
        }),
      }),
    });

    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
      select: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      // Add required properties/methods to satisfy the type
      url: "",
      headers: {},
      // Optionally add other PostgrestQueryBuilder methods if needed
      // ... add more if your code/tests require them
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const result = await addApplication(mockApplication);

    expect(result).toEqual(mockInsertedApp);
    expect(supabase.auth.getUser).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith("applications");
  });

  it("should return null when user authentication fails", async () => {
    const supabase = (await import("@/lib/supabase")).default;

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: {
        message: "Auth error",
        name: "AuthError",
        status: 401,
        code: "auth_error",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const result = await addApplication(mockApplication);

    expect(result).toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("should return null when required fields are missing", async () => {
    const supabase = (await import("@/lib/supabase")).default;

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const incompleteApp = { ...mockApplication, company: "" };
    const result = await addApplication(incompleteApp);

    expect(result).toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
