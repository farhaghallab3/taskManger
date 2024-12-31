const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}", // Match your test files
    baseUrl: "http://localhost:3000" // Adjust the base URL for your app
  },
});
