import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showModal, setShowModal] = useState(false); // Add Task modal state
  const [taskName, setTaskName] = useState(""); // Task name
  const [taskDate, setTaskDate] = useState(""); // Task date
  const [alertMessage, setAlertMessage] = useState(""); // Success/error message for form submission

  const modalRef = useRef(null); // Ref for the modal
  const lastFocusedElement = useRef(null); // Track the last focused element
  const navigate = useNavigate();

  // Handle Add Task logic
  const handleAddTask = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setAlertMessage("You must be logged in to add tasks.");
      return;
    }

    const newTask = {
      name: taskName,
      date: taskDate,
      status: "Pending",
      userId,
    };

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setAlertMessage("Task added successfully!");
        setShowModal(false);
        setTaskName("");
        setTaskDate("");

        // Redirect to View Tasks page after saving
        navigate("/tasks");
      } else {
        setAlertMessage("Failed to add task.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setAlertMessage("Something went wrong!");
    }
  };

  // Trap focus within the modal when it's open
  useEffect(() => {
    if (showModal) {
      lastFocusedElement.current = document.activeElement;
      modalRef.current?.focus();
    }
  }, [showModal]);

  // Return focus to the last focused element when the modal closes
  const handleCloseModal = () => {
    setShowModal(false);
    lastFocusedElement.current?.focus();
  };

  // Handle "Escape" key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showModal) {
        handleCloseModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-gray-800 to-gray-600 flex flex-col items-center justify-center text-white"
      role="main"
    >
      {/* Header Section */}
      <header role="banner" className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
          aria-label="Log Out"
        >
          Log Out
        </button>
      </header>

      <h1 className="text-5xl font-bold mb-10 text-center tracking-wider">
        Welcome to <span className="text-purple-400">Task Manager</span>
      </h1>

      {/* Alert Message */}
      {alertMessage && (
        <div
          className="absolute top-20 bg-green-500 text-white px-4 py-2 rounded-md shadow-md"
          role="alert"
          aria-live="polite"
        >
          {alertMessage}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl px-4">
        {/* Add Task Button */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-10 py-6 rounded-lg shadow-lg hover:scale-105 hover:bg-blue-600 transition-all"
          aria-label="Add a new task"
        >
          <span className="text-xl font-semibold">➕ Add Task</span>
        </button>

        {/* View Tasks Button */}
        <button
          onClick={() => navigate("/tasks")}
          className="bg-green-500 text-white px-10 py-6 rounded-lg shadow-lg hover:scale-105 hover:bg-green-600 transition-all"
          aria-label="View your tasks"
        >
          <span className="text-xl font-semibold">📋 View Tasks</span>
        </button>

        {/* Completed Tasks Button */}
        <button
          onClick={() => navigate("/completed")}
          className="bg-purple-500 text-white px-10 py-6 rounded-lg shadow-lg hover:scale-105 hover:bg-purple-600 transition-all"
          aria-label="View completed tasks"
        >
          <span className="text-xl font-semibold">✅ Completed Tasks</span>
        </button>
      </div>

      {/* Modal for Adding Task */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          role="dialog"
        >
          <div
            className="bg-white p-8 rounded-md shadow-lg w-full max-w-md"
            tabIndex="-1"
            ref={modalRef}
          >
            <h2
              id="modal-title"
              className="text-3xl font-bold text-gray-800 mb-6 text-center"
            >
              Add New Task
            </h2>
            <p id="modal-description" className="sr-only">
              Fill in the form to add a new task.
            </p>
            <form onSubmit={handleAddTask}>
              {/* Task Name Input */}
              <div className="mb-4">
                <label
                  htmlFor="taskName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Task Name
                </label>
                <input
                  id="taskName"
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Enter task name"
                  required
                />
              </div>

              {/* Task Date Input */}
              <div className="mb-4">
                <label
                  htmlFor="taskDate"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Task Date
                </label>
                <input
                  id="taskDate"
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="w-full text-black px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                aria-label="Save task"
              >
                Save Task
              </button>
            </form>

            {/* Cancel Button */}
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
              aria-label="Cancel adding task"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer role="contentinfo" className="mt-10 text-gray-400 text-sm">
        Task Manager © 2024. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Home;
