const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Paths to JSON files
const usersFilePath = path.join(__dirname, "users.json");
const tasksFilePath = path.join(__dirname, "tasks.json");

// Utility to read JSON files
const readJsonFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8"); // Create the file if it doesn't exist
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

// Utility to write JSON files
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// ----------------------------------------
// USER AUTHENTICATION ROUTES
// ----------------------------------------

app.post("/api/auth/signup", (req, res) => {
  const { email, password, username } = req.body;

  // Read existing users
  const users = readJsonFile(usersFilePath);

  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

  const newUser = {
    id: newUserId,
    email,
    password,
    username,
  };

  users.push(newUser);
  writeJsonFile(usersFilePath, users);

  res.status(201).json({ message: "Signup successful!", id: newUserId });
});

app.get("/api/auth/users", (req, res) => {
  const users = readJsonFile(usersFilePath);
  res.json(users);
});

// ----------------------------------------
// TASK MANAGEMENT ROUTES
// ----------------------------------------

app.get("/api/tasks/:userId", (req, res) => {
  const { userId } = req.params;
  const tasks = readJsonFile(tasksFilePath);
  const userTasks = tasks.filter((task) => task.userId === userId);
  res.json(userTasks);
});

app.post("/api/tasks", (req, res) => {
  const { name, date, status, userId } = req.body;

  if (!name || !date || !userId) {
    return res.status(400).json({ error: "Name, date, and userId are required." });
  }

  const tasks = readJsonFile(tasksFilePath);

  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    name,
    date,
    status: status || "Pending",
    userId,
  };

  tasks.push(newTask);
  writeJsonFile(tasksFilePath, tasks);

  res.status(201).json(newTask);
});

app.patch("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { name, date, status } = req.body;

  if (!name && !date && !status) {
    return res.status(400).json({ error: "At least one field is required." });
  }

  const tasks = readJsonFile(tasksFilePath);
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found." });
  }

  if (name) tasks[taskIndex].name = name;
  if (date) tasks[taskIndex].date = date;
  if (status) tasks[taskIndex].status = status;

  writeJsonFile(tasksFilePath, tasks);

  res.status(200).json(tasks[taskIndex]);
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;

  const tasks = readJsonFile(tasksFilePath);
  const updatedTasks = tasks.filter((task) => task.id !== parseInt(id));

  if (tasks.length === updatedTasks.length) {
    return res.status(404).json({ error: "Task not found." });
  }

  writeJsonFile(tasksFilePath, updatedTasks);

  res.status(200).json({ message: "Task deleted successfully." });
});

// Export the app for testing
module.exports = app;

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}