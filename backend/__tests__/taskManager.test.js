const request = require("supertest");
const app = require("../server"); // Import your Express app
const fs = require("fs");
const path = require("path");

// Mock paths to your JSON files
const usersFilePath = path.join(__dirname, "../users.json");
const tasksFilePath = path.join(__dirname, "../tasks.json");

describe("Task Manager API Tests", () => {
  // Clean JSON files before each test
  beforeEach(() => {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
    fs.writeFileSync(tasksFilePath, JSON.stringify([]));
  });

  test("POST /api/auth/signup - Should create a new user", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "testuser@gmail.com",
      password: "123456",
      username: "Test User",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Signup successful!");
  });

  test("POST /api/tasks - Should add a new task", async () => {
    // Create a test user first
    const userResponse = await request(app).post("/api/auth/signup").send({
      email: "testuser@gmail.com",
      password: "123456",
      username: "Test User",
    });

    const userId = userResponse.body.id;

    // Add a task
    const response = await request(app).post("/api/tasks").send({
      name: "Test Task",
      date: "2024-01-01",
      status: "Pending",
      userId: userId.toString(),
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Test Task");
  });

  test("GET /api/tasks/:userId - Should fetch tasks for a specific user", async () => {
    // Create a test user and task
    const userResponse = await request(app).post("/api/auth/signup").send({
      email: "testuser@gmail.com",
      password: "123456",
      username: "Test User",
    });

    const userId = userResponse.body.id;

    await request(app).post("/api/tasks").send({
      name: "Test Task",
      date: "2024-01-01",
      status: "Pending",
      userId: userId.toString(),
    });

    // Fetch tasks for the user
    const response = await request(app).get(`/api/tasks/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe("Test Task");
  });

  test("PATCH /api/tasks/:id - Should update a task", async () => {
    // Create a test user and task
    const userResponse = await request(app).post("/api/auth/signup").send({
      email: "testuser@gmail.com",
      password: "123456",
      username: "Test User",
    });

    const userId = userResponse.body.id;

    const taskResponse = await request(app).post("/api/tasks").send({
      name: "Test Task",
      date: "2024-01-01",
      status: "Pending",
      userId: userId.toString(),
    });

    const taskId = taskResponse.body.id;

    // Update the task
    const response = await request(app).patch(`/api/tasks/${taskId}`).send({
      status: "Completed",
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("Completed");
  });

  test("DELETE /api/tasks/:id - Should delete a task", async () => {
    // Create a test user and task
    const userResponse = await request(app).post("/api/auth/signup").send({
      email: "testuser@gmail.com",
      password: "123456",
      username: "Test User",
    });

    const userId = userResponse.body.id;

    const taskResponse = await request(app).post("/api/tasks").send({
      name: "Test Task",
      date: "2024-01-01",
      status: "Pending",
      userId: userId.toString(),
    });

    const taskId = taskResponse.body.id;

    // Delete the task
    const response = await request(app).delete(`/api/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task deleted successfully.");
  });
});
