import React, { useState, useEffect } from "react";

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const userId = localStorage.getItem("userId"); // Get logged-in user ID
      if (!userId) {
        alert("You must be logged in to view tasks.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${userId}`);
        const tasks = await response.json();

        // Filter tasks with status "Completed"
        const completed = tasks.filter((task) => task.status === "Completed");
        setCompletedTasks(completed);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-center">✨ Completed Tasks ✨</h1>

      {completedTasks.length === 0 ? (
        <p className="text-lg text-gray-300">No completed tasks yet. Keep working! 💪</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {completedTasks.map((task) => (
            <li
              key={task.id}
              className="bg-gradient-to-br from-green-500 to-green-400 p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-900">{task.name}</h2>
              <p className="text-md text-gray-800 font-medium mb-4">
                Completed on: <span className="font-semibold">{task.date}</span>
              </p>
              <div className="flex items-center justify-end">
                <span className="bg-green-800 text-white py-1 px-3 rounded-full text-sm font-medium">
                  Completed
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedTasks;
