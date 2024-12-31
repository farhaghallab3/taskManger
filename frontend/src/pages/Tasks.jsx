import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [tasks, setTasks] = useState([]); // List of tasks
  const [expandedTaskId, setExpandedTaskId] = useState(null); // Expanded task details
  const [dropdownOpen, setDropdownOpen] = useState(null); // Dropdown menu state
  const navigate = useNavigate();
  const [editingTask, setEditingTask] = useState(null);



  // Fetch tasks for the logged-in user
  useEffect(() => {
    const fetchTasks = async () => {
      const userId = localStorage.getItem("userId"); // Get user ID from localStorage
      if (!userId) {
       // alert("You must be logged in to view tasks.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${userId}`);
        if (!response.ok) {
          console.error("Failed to fetch tasks.");
          return;
        }
        const data = await response.json();
        console.log("Fetched Tasks:", data); // Debugging: Log fetched tasks
        setTasks(data.filter((task) => task.status !== "Completed")); // Show only non-completed tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Expand/collapse task details
  const toggleExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  // Mark a task as completed
  const handleCompleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (response.ok) {
        // Remove the task from the current list
        setTasks(tasks.filter((task) => task.id !== taskId));
       // alert("Task marked as completed!");
        navigate("/completed"); // Navigate to Completed Tasks page
      } else {
       // alert("Failed to mark task as completed.");
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId)); // Update task list
       // alert("Task deleted successfully!");
      } else {
       // alert("Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

    // Handle task editing
  const handleEditTask = (task) => {
    setEditingTask(task); // Open edit modal with task data
  };

const saveEditedTask = async (e) => {
  e.preventDefault();

  if (!editingTask.name || !editingTask.date) {
   // alert("Task name and date are required.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/tasks/${editingTask.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editingTask.name,
        date: editingTask.date,
        status: editingTask.status || "Pending", // Default status if not provided
      }),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setEditingTask(null); // Close the edit modal
      alert("Task updated successfully!");
    } else {
      const errorData = await response.json();
      console.error("Update Failed:", errorData);
     // alert(errorData.error || "Failed to update task.");
    }
  } catch (error) {
    console.error("Error editing task:", error);
   // alert("An error occurred while updating the task.");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 font-serif text-gray-100">Your Tasks</h1>
      <ul className="w-full max-w-3xl space-y-6">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-6 bg-gray-800 border border-gray-600 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            {/* Task Header */}
            <div
              className="flex justify-between items-center"
              onClick={() => toggleExpand(task.id)} // Expand/collapse task details
            >
              <h2 className="text-xl font-bold text-gray-100">{task.name}</h2>

              {/* Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent dropdown toggle from collapsing the task
                    setDropdownOpen(dropdownOpen === task.id ? null : task.id);
                  }}
                  className="text-gray-400 text-2xl font-bold hover:text-gray-200 focus:outline-none"
                >
                  ⋮
                </button>

                {/* Dropdown Options */}
                {dropdownOpen === task.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-gray-700 border border-gray-500 shadow-lg rounded-lg z-10">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-red-600"
                    >
                      🗑️ Delete
                    </button>
                    <button
                      onClick={() => handleEditTask(task)}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-blue-600"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-green-600"
                    >
                      ✅ Complete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Task Details */}
            {expandedTaskId === task.id && (
              <div className="mt-4 text-sm text-gray-300">
                <p>
                  <strong>Date:</strong> {task.date}
                </p>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
       {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={saveEditedTask}>
              <div className="mb-4">
                <label className="block text-gray-700">Task Name</label>
                <input
                  type="text"
                  value={editingTask.name}
                  onChange={(e) =>
                    setEditingTask((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Task Date</label>
                <input
                  type="date"
                  value={editingTask.date}
                  onChange={(e) =>
                    setEditingTask((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* No Tasks Message */}
      {tasks.length === 0 && (
        <div className="mt-12 text-center text-gray-300">
          <p>No tasks available. Add some tasks!</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
