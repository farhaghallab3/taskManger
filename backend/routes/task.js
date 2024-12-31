const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Path to tasks.json
const tasksFilePath = path.join(__dirname, "../tasks.json");

// Helper function to read tasks from tasks.json
const readTasks = () => {
  const data = fs.readFileSync(tasksFilePath, "utf8");
  return JSON.parse(data || "[]");
};

// Helper function to write tasks to tasks.json
const writeTasks = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), "utf8");
};

// GET: Fetch all tasks for a specific user
app.get("/api/tasks/:userId", (req, res) => {
  const { userId } = req.params;

  const tasks = readJsonFile(tasksFilePath);

  console.log("User ID:", userId);
  console.log("All Tasks:", tasks);

  const userTasks = tasks.filter((task) => task.userId === userId);

  console.log("Filtered Tasks:", userTasks);

  res.json(userTasks);
});



// POST: Add a new task
app.post("/api/tasks", (req, res) => {
  const { name, date, status, userId } = req.body;

  if (!name || !date || !userId) {
    return res.status(400).json({ error: "Name, date, and userId are required." });
  }

  const tasks = readJsonFile(tasksFilePath);

  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1, // Auto-increment ID
    name,
    date,
    status: status || "Pending",
    userId, // Associate task with the logged-in user
  };

  tasks.push(newTask);
  writeJsonFile(tasksFilePath, tasks);

  res.status(201).json(newTask);
});


// PATCH: Update task status
router.patch("/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(taskId));

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found." });
  }

  tasks[taskIndex].status = status;
  writeTasks(tasks);

  res.status(200).json(tasks[taskIndex]);
});

// DELETE: Remove a task
router.delete("/:taskId", (req, res) => {
  const { taskId } = req.params;

  const tasks = readTasks();
  const filteredTasks = tasks.filter((task) => task.id !== parseInt(taskId));

  if (tasks.length === filteredTasks.length) {
    return res.status(404).json({ error: "Task not found." });
  }

  writeTasks(filteredTasks);
  res.status(200).json({ message: "Task deleted successfully." });
});

module.exports = router;
