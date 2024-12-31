/// <reference types="cypress" />

describe("Signup Page Tests", () => {
    it("should load the signup page", () => {
      cy.visit("/signup");
      cy.contains("Signup").should("be.visible"); // Verify the Signup heading is visible
    });

    it("should allow a new user to sign up", () => {
      cy.visit("/signup");

      // Fill in signup details
      cy.get('input[placeholder="Enter your username"]').type("noor");
      cy.get('input[placeholder="Enter your email"]').type("noor@gmail.com");
      cy.get('input[placeholder="Enter your password"]').type("123456");
      cy.get('input[placeholder="Confirm your password"]').type("123456");
      cy.contains("Signup").click();
      //cy.url().should("include", "/");

    cy.url().then((url) => {
        cy.log("Current URL:", url);
      });
      // Verify redirection to the Login page
      cy.url().should("include", "/");

    });


    });

  