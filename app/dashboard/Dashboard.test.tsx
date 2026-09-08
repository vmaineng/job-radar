import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "./page";
import { useJobs } from "../../hooks/useJobs";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

jest.mock("../../hooks/useJobs");
jest.mock("@/context/AuthContext");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// 2. Mock Child Components
jest.mock("./components/DashboardNavbar", () => ({
  __esModule: true,
  default: ({ isGuest }: { isGuest: boolean }) => (
    <nav data-testid="navbar">Navbar (Guest: {String(isGuest)})</nav>
  ),
}));

jest.mock("@/components/JobCard", () => ({
  __esModule: true,
  default: ({ job }: { job: any }) => (
    <div data-testid="job-card">{job.title}</div>
  ),
}));

describe("Dashboard Page", () => {
  const mockPush = jest.fn();
  const mockSignOut = jest.fn();
  const mockMarkApplied = jest.fn();

  const realJob = {
    id: "job-1",
    title: "Software Engineer I",
    company: "Real Co",
    location: "Los Angeles, CA",
    is_remote: false,
    relevance_score: 88,
    relevance_reason: "Good match",
    apply_url: "https://example.com/apply",
    status: "new",
    contact: {
      full_name: "Alex Kim",
      title: "Hiring Manager",
      email: null,
      linkedin_search_url: "https://linkedin.com/search",
      source: "hunter",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  describe("guest mode(unauthenticated)", () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        signOut: mockSignOut,
      });
      (useJobs as jest.Mock).mockReturnValue({
        jobs: [],
        loading: false,
        error: null,
        markApplied: mockMarkApplied,
      });
    });

    test("renders sample matches banner and sample job cards", () => {
      render(<Dashboard />);

      expect(
        screen.getByText(/You're viewing sample matches/i),
      ).toBeInTheDocument();
      expect(screen.getByText("Sample Matches")).toBeInTheDocument();
      expect(screen.getAllByTestId("job-card")).toHaveLength(2);
      expect(screen.getByText("Junior Frontend Engineer")).toBeInTheDocument();
      expect(
        screen.getByText("Associate Software Engineer"),
      ).toBeInTheDocument();
    });
  });

  describe("authenticated mode", () => {
    beforeEach(() => {
      (useAuth as jest.Mock).mockReturnValue({
        user: { id: "user-1" },
        loading: false,
        signOut: mockSignOut,
      });
    });
    test("shows loading copy while jobs are loading", () => {
      (useJobs as jest.Mock).mockReturnValue({
        jobs: [],
        loading: true,
        error: null,
        markApplied: mockMarkApplied,
      });

      render(<Dashboard />);

      expect(screen.getByText(/loading today's matches/i)).toBeInTheDocument();
      expect(screen.getByText("Today's Matches")).toBeInTheDocument();
      expect(
        screen.queryByText(/You're viewing sample matches/i),
      ).not.toBeInTheDocument();
    });

    test("shows an error message when the job fetch fails", () => {
      (useJobs as jest.Mock).mockReturnValue({
        jobs: [],
        loading: false,
        error: "Network timeout",
        markApplied: mockMarkApplied,
      });
      render(<Dashboard />);

      expect(
        screen.getByText(/Couldn.*t load jobs: Network timeout/i),
      ).toBeInTheDocument();
    });
  });
});
