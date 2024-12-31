Cypress.Commands.add("login", (username, password) => {
    cy.visit("/");
    cy.get('input[placeholder="Enter name"]').type(username);
    cy.get('input[placeholder="Enter password"]').type(password);
    cy.get("button").contains("Login").click();
    cy.url().should("include", "/home");
  });
  