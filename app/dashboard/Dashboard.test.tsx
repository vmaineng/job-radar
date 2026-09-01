import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "./page";
import { useJobs } from "../../hooks/useJobs";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

jest.mock("../../hooks/useJobs");
jest.mock("@/context/AuthContext");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Dashboard Page", () => {
  const mockPush = jest.fn();

  befforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });
});
