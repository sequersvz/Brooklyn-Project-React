import { options } from "../support/index";

describe("Configuration tests", function() {
  beforeEach(() => {
    cy.fixture("users/login").as("login");
  });

  it("Creates user", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('img[alt="profile"]').trigger("mouseover");
    cy.contains("Profile");
    cy.contains("Configuration");
    cy.wait(1000);
    cy.getByText("Configuration")
      .parent()
      .click();
    //Create user
    cy.getByTestId("newReviewItemButton").click();
    cy.contains("New user");
    //Name field
    cy.get('input[name="nameCreate"]').click();
    cy.focused()
      .type("New test user")
      .blur();
    cy.wait(1000);
    //Email field
    cy.get('input[name="email"]').click();
    cy.focused()
      .type("newtest@brooklynva.com")
      .blur();
    cy.wait(1000);
    //Country
    cy.get(".selected-flag").click();
    cy.wait(1000);
    cy.get('li[data-country-code="ar"]')
      .scrollIntoView()
      .click();
    cy.focused().type("3515123456");
    cy.wait(1000);
    //Select role
    cy.get('select[name="role"]')
      .select("User")
      .should("have.value", "user");
    cy.wait(1000);
    //Vendors select
    cy.getByText("Vendors")
      .siblings()
      .find("input")
      .type("Vendor Tier 2 {enter}", { force: true });
    cy.wait(1000);
    // TODO: Cant find groups input, try to get it in another way
    //Groups select
    // cy.getByText("Groups")
    //   .siblings()
    //   .find("input")
    //   .type("Test group {enter}", { force: true })
    //   .blur();
    // cy.wait(1000);

    cy.getByText("Save")
      .parent()
      .click();
    cy.wait(2000);
    cy.contains("New test user");
    cy.contains("newtest@brooklynva.com");
  });
  it("Edits user", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('img[alt="profile"]').trigger("mouseover");
    cy.contains("Profile");
    cy.contains("Configuration");
    cy.wait(1000);
    cy.getByText("Configuration")
      .parent()
      .click();

    //Edit user
    cy.getByText("New test user")
      .parent()
      .siblings()
      .find('svg[data-icon="edit"]')
      .click();
    cy.contains("Edit user");
    //Edit name
    cy.get('input[name="nameCreate"]').click();
    cy.focused()
      .clear()
      .type("New test user1")
      .blur();
    cy.wait(1000);
    //Edit email
    // cy.get('input[name="email"]').click();
    // cy.focused()
    //   .clear()
    //   .type("newtest1@brooklynva.com")
    //   .blur();
    // cy.wait(1000);
    cy.get('input[type="tel"]').click();
    cy.focused()
      .clear()
      .type("543515123457")
      .blur();
    cy.wait(1000);
    cy.getByText("Save")
      .parent()
      .click();
    cy.wait(3000);
    cy.contains("New test user1");
  });
  it("Deletes user", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('img[alt="profile"]').trigger("mouseover");
    cy.contains("Profile");
    cy.contains("Configuration");
    cy.wait(1000);
    cy.getByText("Configuration")
      .parent()
      .click();
    //Delete user
    cy.getByText("New test user1")
      .parent()
      .siblings()
      .find('svg[data-icon="trash"]')
      .click();
    cy.wait(2000);
    cy.getByText("Confirm user deletion?")
      .parent()
      .siblings()
      .within(() => {
        cy.getByText("Delete")
          .parent()
          .click();
      });
    cy.wait(3000);
    cy.queryByText("New test user1").should("not.exist");
    cy.queryByText("newtest1@brooklynva.com").should("not.exist");
  });
  it("Tests all tabs", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    cy.wait(4000);
    cy.get('img[alt="profile"]').trigger("mouseover");
    cy.contains("Profile");
    cy.contains("Configuration");
    cy.getByText("Configuration")
      .parent()
      .click();
    cy.get('img[alt="profile"]')
      .first()
      .click();
    cy.get('img[alt="profile"]')
      .first()
      .trigger("mouseleave");
    cy.getByText("Name").trigger("mouseover");
    //Click second tab
    cy.getByText("Business Units")
      .parentsUntil("button")
      .first()
      .trigger("mouseover");
    cy.getByText("Business Units")
      .parentsUntil("button")
      .first()
      .click();
    cy.contains("id");
    cy.contains("name");
    cy.contains("Actions");
    cy.contains("Test BU");
    //Click third tab
    cy.getByText("Categories")
      .parentsUntil("button")
      .first()
      .click();
    cy.contains("id");
    cy.contains("name");
    cy.contains("description");
    cy.contains("enabled");
    cy.contains("iconClassName");
    cy.contains("Reference");
    cy.contains("Delivery");
    //Click fourth tab
    cy.getByText("Checkpoints")
      .parentsUntil("button")
      .first()
      .click();
    cy.contains("Checkpoints Tier 1");
    cy.contains("Checkpoints Tier 2");
    cy.contains("Checkpoints Tier 3");
    cy.contains("Checkpoints Tier 4");
    cy.contains("Checkpoints Tier 5");
    //Click fifth tab
    cy.getByText("Internal Service")
      .parentsUntil("button")
      .first()
      .click({ force: true });
    cy.contains("Data Center");
    cy.contains("Enterprise Data Center");
    cy.contains("Compute");
    //Click sixth tab
    cy.getByText("Sourcing Category")
      .parentsUntil("button")
      .first()
      .click({ force: true });
    cy.contains("Data Center");
    cy.contains("Enterprise Data Center");
    cy.contains("Compute");
    //Click seventh tab
    cy.getByText("Groups")
      .parentsUntil("button")
      .first()
      .click();
    cy.contains("Test group");
    //Right arrow
    cy.get('svg[viewBox="0 0 24 24"]')
      .parent()
      .last()
      .click({ force: true });
    cy.wait(1000);
    //Click eighth tab
    cy.getByText("Escalation")
      .parentsUntil("button")
      .first()
      .click();
    cy.wait(2000);
    cy.get('img[alt="Scalation Matrix"]').should("exist");
    //Click ninth tab
    cy.getByText("Risk")
      .parentsUntil("button")
      .first()
      .click();
    cy.wait(2000);
    cy.contains("Likelihood / Probability");
    cy.contains("Impact");
    cy.contains("Appetite / Tolerance");
    //Click tenth tab
    cy.getByText("Approval")
      .parentsUntil("button")
      .first()
      .click({ force: true });
    cy.wait(2000);
    cy.get('img[alt="Approval Matrix"]').should("exist");
  });
});
