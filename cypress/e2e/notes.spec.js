describe("Notes Functionality Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("#username").type("intern");
    cy.get("#password").type("letmein");
    cy.get('button[type="submit"]').click();

    cy.contains("My Notes").should("be.visible");
  });

  afterEach(() => {
    cy.contains("Logout").click();
  });

  it("should create a new note", () => {
    const noteTitle = `Test Note ${Date.now()}`;
    const noteContent = "This is a test note created by Cypress";

    cy.get('input[placeholder="Note title"]').type(noteTitle);
    cy.get('textarea[placeholder="Write your note here..."]').type(noteContent);

    cy.contains("Add Note").click();

    cy.contains("Note added").should("be.visible");

    cy.contains(noteTitle).should("be.visible");
    cy.contains(noteContent).should("be.visible");
  });

  it("should delete a note", () => {
    const noteTitle = `Delete Test ${Date.now()}`;
    const noteContent = "This note will be deleted";

    cy.get('input[placeholder="Note title"]').type(noteTitle);
    cy.get('textarea[placeholder="Write your note here..."]').type(noteContent);
    cy.contains("Add Note").click();

    cy.contains(noteTitle).should("be.visible");

    cy.contains(noteTitle)
      .parents(".card")
      .find('button[variant="outline"]')
      .click();

    cy.contains("Note deleted").should("be.visible");

    cy.contains(noteTitle).should("not.exist");
  });
});
