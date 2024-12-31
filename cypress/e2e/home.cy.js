/// <reference types="cypress" />

describe("Home Page Tests", () => {
    beforeEach(() => {
      // Mock login by setting a userId in localStorage
      localStorage.setItem("userId", "123");
      cy.visit("/home");
    });
  
    it("should load the Home page with all elements visible", () => {
      // Check the page header
      cy.get("h1").contains("Welcome to Task Manager").should("be.visible");
  
      // Verify buttons exist
      cy.contains("➕ Add Task").should("be.visible");
      cy.contains("📋 View Tasks").should("be.visible");
      cy.contains("✅ Completed Tasks").should("be.visible");
  
      // Verify the "Log Out" button is present
      cy.contains("Log Out").should("be.visible");
    });
  
    it("should redirect to the login page when 'Log Out' is clicked", () => {
      cy.contains("Log Out").click();
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });
  
    it("should open and close the Add Task modal", () => {
      // Open the modal
      cy.contains("➕ Add Task").click();
      cy.get("h2").contains("Add New Task").should("be.visible");
  
      // Close the modal
      cy.contains("Cancel").click();
     
    });
  
    it("should add a new task and redirect to the tasks page", () => {
      // Open the modal
      cy.contains("➕ Add Task").click();
  
      // Fill in the task form
      cy.get('input[placeholder="Enter task name"]').type("Test Task");
      cy.get('input[type="date"]').type("2024-12-25");
  
      // Intercept the API call
      cy.intercept("POST", "http://localhost:5000/api/tasks", {
        statusCode: 201,
        body: { message: "Task added successfully!" },
      }).as("addTask");
  
      // Submit the form
      cy.contains("Save Task").click();
  
      // Wait for the API call
      cy.wait("@addTask");
  
      // Verify redirection to the tasks page
      cy.url().should("include", "/tasks");
    });
  
    it("should navigate to the tasks page when '📋 View Tasks' is clicked", () => {
      cy.contains("📋 View Tasks").click();
      cy.url().should("include", "/tasks");
    });
  
    it("should navigate to the completed tasks page when '✅ Completed Tasks' is clicked", () => {
      cy.contains("✅ Completed Tasks").click();
      cy.url().should("include", "/completed");
    });
  });
  