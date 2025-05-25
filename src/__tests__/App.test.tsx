import { describe, it, expect, vi, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import App from "../App";

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock Supabase to prevent environment variable errors
vi.mock("@/lib/supabase", () => ({
  default: {
    auth: {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(),
  },
}));

// Mock AuthProvider to avoid Supabase initialization issues
vi.mock("@/contexts/authProvider", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

describe("App Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it("renders main app structure", () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
  });
});
