describe("Authentication Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should login successfully with correct credentials", () => {
    // Locate and fill the login form
    cy.get("#username").type("intern");
    cy.get("#password").type("letmein");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify successful login
    cy.url().should("include", "/notes");
    cy.contains("My Notes").should("be.visible");
    cy.contains("Session expires in:").should("be.visible");

    // Clean up - log out
    cy.contains("Logout").click();
  });

  it("should fail login with incorrect credentials", () => {
    // Locate and fill the login form with wrong credentials
    cy.get("#username").type("wronguser");
    cy.get("#password").type("wrongpass");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify error toast appears
    cy.contains("Invalid credentials").should("be.visible");

    // Verify we're still on the login page
    cy.url().should("not.include", "/notes");
  });
});
