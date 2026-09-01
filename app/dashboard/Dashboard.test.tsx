import { render, screen } from "@testing-library/react";
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

jest.mock("./components/DashboardNavbar", () => ({
  __esModule: true,
  default: ({ isGuest }: { isGuest: boolean }) => (
    <nav data-testid="navbar">Navbar (Guest: {String(isGuest)})</nav>
  ),
}));

jest.mock("@/components/Jobcard", () => ({
  __esModule: true,
  default: ({ job }: { job: any }) => (
    <div data-testid="job-card">{job.title}</div>
  ),
}));

describe("Dashboard Page", () => {
  const mockPush = jest.fn();
  const mockSignOut = jest.fn();
  const mockMarkApplied = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("renders guest preview mode when unauthenticated", () => {
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

    render(<Dashboard />);

    expect(
      screen.getByText(/You're viewing sample matches/i),
    ).toBeInTheDocument();

    expect(screen.getAllByTestId("job-card")).toHaveLength(2);
  });
});
