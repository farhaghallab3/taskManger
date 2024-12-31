import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Tasks from "../src/pages/Tasks";

describe("Tasks Component Tests", () => {
  test("renders tasks heading", () => {
    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const heading = screen.getByText(/Your Tasks/i);
    expect(heading).toBeInTheDocument();
  });

  test("shows no tasks message if task list is empty", async () => {
    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const message = screen.getByText(/No tasks available. Add some tasks!/i);
    expect(message).toBeInTheDocument();
  });

  test("renders tasks when provided", async () => {
    const mockTasks = [
      { id: 1, name: "Test Task 1", date: "2024-01-01", status: "Pending" },
    ];

    // Mock fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockTasks),
      })
    );

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const task = await screen.findByText(/Test Task 1/i);
    expect(task).toBeInTheDocument();
  });
});
