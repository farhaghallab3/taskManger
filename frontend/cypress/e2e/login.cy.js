/// <reference types="cypress" />


describe("Login Page Tests", () => {
    it("should load the login page", () => {
      cy.visit("/"); // Visit the login page
      cy.contains("Login").should("be.visible"); // Verify the Login heading is visible
    });
  
    it("should allow a user to log in successfully", () => {
      cy.visit("/");
  
      // Fill in login details
      cy.get('input[placeholder="Enter your username"]').type("farhaghallab"); // Replace with the actual input field selectors
      cy.get('input[placeholder="Enter your password"]').type("zxc123"); // Replace with your password field's selector
      cy.get("button").contains("Login").click();
      cy.url().then((url) => {
        cy.log("Current URL:", url);
      });
     // cy.get("h1").contains("Welcome to Task Manager").should("be.visible");
  
      // Verify redirection to the Home page
      cy.url().should("include", "/home");

    });
  
  });
  