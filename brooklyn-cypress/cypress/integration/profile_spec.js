import { options } from "../support/index";

describe("Profile tests", function() {
  beforeEach(() => {
    cy.fixture("users/login").as("login");
  });
  it("Tests profile page", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('img[alt="profile"]').trigger("mouseover");
    cy.contains("Profile");
    cy.contains("Configuration");
    cy.wait(1000);
    cy.getByText("Profile")
      .parent()
      .click();
    cy.url().should("include", "/profile");
    cy.wait(3000);
    cy.getByText("Andres").click();
    cy.focused()
      .clear()
      .type("Andres")
      .blur();
    cy.wait(1000);

    cy.getByText("Notification Preference")
      .children()
      .click();
    cy.wait(1000);
    cy.focused()
      .clear()
      .type("none{enter}");
    cy.wait(1000);
    cy.getByText("Test group")
      .siblings()
      .click();
    cy.wait(1000);
    cy.get("#react-select-6-input").click({ force: true });
    cy.focused()
      .clear({ force: true })
      .type("Test group{enter}", { force: true });
    //Create user
  });
});
