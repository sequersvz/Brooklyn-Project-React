import { options } from "../support/index";

describe("WDIHTDT page test", function() {
  beforeEach(() => {
    cy.fixture("users/login").as("login");
    cy.server();
    cy.route({
      method: "GET",
      url: "/users/accounts/1/vendors*"
    }).as("vendors");
  });

  it("Creates a Review", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="4"]').click({ force: true });

    cy.getByText("Vendor Manager")
      .siblings()
      .find("input")
      .type("No manager {enter}", { force: true });

    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .click();
    cy.wait("@vendors");
    cy.contains(/You last met with/);
    cy.getByText(/Create Review/).click();
    cy.contains("New Review");
    cy.wait(3000);
    cy.get('input[name="date"]').click();
    cy.wait(3000);
    cy.getByText("keyboard_arrow_right").click({ force: true });
    cy.wait(1000);
    cy.get("h4")
      .parent()
      .siblings()
      .last()
      .within(() => {
        cy.getByText("15")
          .parent()
          .click({ force: true });
      });
    cy.wait(2000);
    cy.get('input[name="notes"]').click({ force: true });
    cy.wait(5000);
    cy.get('input[name="notes"]').type("WDIHTDT4 Review", { delay: 100 });
    cy.contains("Vendor Tier 4");

    cy.getByText("Save")
      .parent()
      .click();
    cy.wait(1000);
    cy.get('[href="/assurance"]')
      .first()
      .click();
    cy.url().should("include", "/assurance");

    cy.getByText("WDIHTDT4 Review").should("exist");

    // //Creates action review item
    cy.getByText("WDIHTDT4 Review").click({ force: true });
    cy.wait(1000);
    cy.getByTestId("newReviewItemButton").trigger("mouseover");
    cy.wait(2000);
    cy.getByTestId("newReviewItemButton")
      .find('div[data-tip="Action Item"]')
      .click();
    cy.wait(5000);
    cy.getByText("Click to edit").click({ force: true });
    cy.wait(5000);
    cy.get('input[name="itemreviewName"]').type("New review item{enter}", {
      delay: 100
    });
  });

  it("Use the main WDIHTDT page", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('[href="/assurance"]')
      .first()
      .click();
    cy.url().should("include", "/assurance");
    //Active Vendor Tier 3
    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="3"]').click({ force: true });
    cy.getByText("Vendor Manager")
      .siblings()
      .find("input")
      .type("No manager {enter}", { force: true });

    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .click();
    cy.wait("@vendors");

    cy.contains("Vendor Tier 3");
  });

  it("Tests the WDIHTDT links", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="3"]').click();

    cy.getByText("Vendor Manager")
      .siblings()
      .find("input")
      .type("No manager {enter}", { force: true });

    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .click();
    cy.wait("@vendors");
    //Go to reference link
    cy.get('svg[data-icon="clipboard-list"]')
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="greater-than"]')
      .parent()
      .click();
    cy.contains("Reference");
    cy.wait(2000);
    cy.get('[href="/assurance"]')
      .first()
      .click();
    cy.url().should("include", "/assurance");
    //Go to Delivery
    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .parent()
      .click();
    cy.get('svg[data-icon="box-open"]')
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="greater-than"]')
      .parent()
      .click();
    cy.contains("Delivery");

    cy.get('[href="/assurance"]')
      .first()
      .click();
    cy.url().should("include", "/assurance");
    //Go to Quality
    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .parent()
      .click();
    cy.get('svg[data-icon="gem"]')
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="greater-than"]')
      .parent()
      .click();
    cy.contains("Quality");

    cy.get('[href="/assurance"]')
      .first()
      .click();
    cy.url().should("include", "/assurance");
    //Go to price
    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .parent()
      .click();
    cy.get('svg[data-icon="money-bill-alt"]')
      .first()
      .parent()
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="greater-than"]')
      .parent()
      .click();
    cy.contains("Price");

    cy.get('[href="/assurance"]')
      .first()
      .click();
    cy.url().should("include", "/assurance");
    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .parent()
      .click();

    cy.getByText("Load more...").click();
    cy.wait(1000);
    //Go to price
    cy.get('svg[data-icon="money-bill-alt"]')
      .last()
      .parent()
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="greater-than"]')
      .parent()
      .click();
    cy.contains("Price");

    cy.get('[href="/assurance"]')
      .first()
      .click();

    cy.url().should("include", "/assurance");
    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .parent()
      .click();

    cy.getByText("Load more...").click();
    cy.wait(1000);
    //Go to contract
    cy.get('svg[data-icon="file-signature"]')
      .last()
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="greater-than"]')
      .parent()
      .click();
    cy.contains("Contract");
  });

  it("Checks some elements in WDIHTDT page", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('[href="/assurance"]')
      .first()
      .click();

    cy.url().should("include", "/assurance");
    cy.getByText("Vendor Manager")
      .siblings()
      .find("input")
      .type("No manager {enter}", { force: true });

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="3"]').click();

    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .click();
    cy.contains("Vendor Tier 3");

    cy.getByText("Load more...").click();
    cy.wait(1000);

    // cy.queryByText(/in Action/).should('not.exist');
    cy.contains(/Utilization of purchased/)
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="thumbtack"]')
      .click();
    cy.wait(5000);
    cy.queryByText(/Utilization of purchased/).should("not.exist", {
      timeout: 5000
    });

    //Checks if RI is recurring
    cy.getByText("Reference RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="redo"]')
      .should(item => {
        expect(item[0].attributes[7].value).to.equal("#00d3ee");
      });

    //Sets RI not recurring
    cy.getByText("Reference RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="redo"]')
      .click({ force: true })
      .should(item => {
        expect(item[0].attributes[7].value).to.equal("gray");
      });

    //Mark Reference review item as Ready
    cy.getByText("Reference RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="arrow-alt-circle-down"]')
      .click();
    cy.wait(2000);
    cy.queryByText("Reference RI").should("not.exist");

    //Edit Second Action review item
    cy.getByText("Second RI").click({ force: true });
    cy.get('input[name="itemreviewName"]').type(" edition{enter}", {
      force: true,
      delay: 100
    });
    cy.wait(2000);
    cy.contains(" edition");
    cy.wait(1000);

    // Delete Reference review item
    cy.getByText("Second RI edition")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="trash"]')
      .click();
    cy.wait(1000);
    cy.contains("Confirm Review Item deletion");
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(5000);
    cy.queryByText("Second RI edition").should("not.exist");

    cy.get('[href="/assurance"]')
      .first()
      .click();

    cy.url().should("include", "/assurance");

    cy.getByText("WDIHTDT Review").click({ force: true });
    cy.wait(2000);
    cy.get('svg[data-icon="clipboard-list"]').click();
    cy.scrollTo(0, 0);
    cy.wait(1000);
    cy.getByText("Open Review Items")
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText("Reference RI").should("not.exist", { timeout: 5000 });
      });

    cy.getByText("Ready Review Items")
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText("Reference RI").should("exist");
      });
  });

  it("Tests the WDIHTDT filters", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    cy.get('[href="/assurance"]')
      .first()
      .click();

    cy.url().should("include", "/assurance");

    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .click();

    cy.getByText(/Andres*/)
      .siblings()
      .find("svg")
      .click();

    // --> Filter by Vendor Manager search
    // cy.getByText('Vendor Manager').find('svg').click({ force: true })

    cy.getByText("Vendor Manager")
      .siblings()
      .getByText("Select...")
      .click({ force: true });
    cy.getByText("Vendor Manager")
      .siblings()
      .find("input")
      .type("Leandro Miranda {enter}", { force: true });

    cy.contains("Vendor Tier 1");

    cy.getByText("Leandro Miranda")
      .siblings()
      .find("svg")
      .click();

    cy.getByText("Vendor Manager")
      .siblings()
      .getByText("Select...")
      .click({ force: true });
    cy.getByText("Vendor Manager")
      .siblings()
      .find("input")
      .type("No manager {enter}", { force: true });

    cy.contains("Vendor Tier 2");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");

    cy.getByText("No manager")
      .siblings()
      .find("svg")
      .click();

    cy.getByText("Vendor Manager")
      .find("svg")
      .click();

    // --> End Filter by Vendor Manager search <--

    // --> Filter by Strategic <--
    cy.get('svg[cy-data="filter_Strategic_plus"]').click();
    cy.contains("Strategic");
    cy.contains("Non-Strategic");

    // Active
    cy.get('input[name="Strategic"]').click();
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 2");

    // Deactive
    cy.get('input[name="Strategic"]').click();
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 2");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    // Filter by Non-Strategic

    // Active
    cy.get('input[name="Non-Strategic"]').click();
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    // Deactive
    cy.get('input[name="Non-Strategic"]').click();
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 2");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    cy.get('svg[cy-data="filter_Strategic_times"]').click();

    // --> End Filter by Strategic <--

    // --> Filter by Critical <--
    cy.get('svg[cy-data="filter_Critical_plus"]').click();
    cy.contains("Critical");
    cy.contains("Non-Critical");

    //Active
    cy.get('input[name="Critical"]').click();
    cy.contains("Vendor Tier 2");

    // Deactive
    cy.get('input[name="Critical"]').click();
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 2");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    // Filter by Non-Critical

    //Active
    cy.get('input[name="Non-Critical"]').click();
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    // Deactive
    cy.get('input[name="Non-Critical"]').click();
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 2");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    cy.get('svg[cy-data="filter_Critical_times"]').click();

    // --> End Filter by Critical <--

    // --> Filter by Tier <--
    cy.getByText("Vendor Tier")
      .find("svg")
      .click();

    cy.contains("1");
    cy.contains("2");
    cy.contains("3");
    cy.contains("4");
    cy.contains("5");

    //Active
    cy.get('input[name="1"]').click();
    cy.contains("Vendor Tier 1");

    //Deactive
    cy.get('input[name="1"]').click();
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 2");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    //Active
    cy.get('input[name="2"]').click();
    cy.contains("Vendor Tier 1");

    //Deactive
    cy.get('input[name="2"]').click();
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 2");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    //Active
    cy.get('input[name="3"]').click();
    cy.contains("Vendor Tier 3");

    //Deactive
    cy.get('input[name="3"]').click();
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 2");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    //Active
    cy.get('input[name="4"]').click();
    cy.contains("Vendor Tier 4");

    //Deactive
    cy.get('input[name="4"]').click();
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 2");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    //Active
    cy.get('input[name="5"]').click();
    cy.contains("Vendor Tier 5");

    //Deactive
    cy.get('input[name="5"]').click();
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 2");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();

    // --> End Filter by Tier <--

    // --> Filter by Vendor search
    cy.getByText("Vendor")
      .find("svg")
      .click();

    cy.getByText("Vendor")
      .siblings()
      .getByText("Select...")
      .click();
    cy.getByText("Vendor")
      .siblings()
      .find("input")
      .type("Vendor Tier 1", { force: true });

    cy.get("#react-select-6-option-0").type("{enter}");

    cy.contains("Vendor Tier 1");

    cy.getByText("Vendor Tier 1")
      .siblings()
      .find("svg")
      .click();

    cy.getByText("Vendor")
      .siblings()
      .getByText("Select...")
      .click();
    cy.getByText("Vendor")
      .siblings()
      .find("input")
      .type("Vendor Tier 2", { force: true });

    cy.get("#react-select-6-option-0").type("{enter}");

    cy.contains("Vendor Tier 2");

    cy.getByText("Vendor Tier 2")
      .siblings()
      .find("svg")
      .click();

    cy.getByText("Vendor")
      .siblings()
      .getByText("Select...")
      .click();
    cy.getByText("Vendor")
      .siblings()
      .find("input")
      .type("Vendor Tier 3", { force: true });

    cy.get("#react-select-6-option-0").type("{enter}");

    cy.contains("Vendor Tier 3");

    cy.getByText("Vendor Tier 3")
      .siblings()
      .find("svg")
      .click();

    cy.getByText("Vendor")
      .siblings()
      .getByText("Select...")
      .click();
    cy.getByText("Vendor")
      .siblings()
      .find("input")
      .type("Vendor Tier 4", { force: true });

    cy.get("#react-select-6-option-0").type("{enter}");

    cy.contains("Vendor Tier 4");

    cy.getByText("Vendor Tier 4")
      .siblings()
      .find("svg")
      .click();

    cy.getByText("Vendor")
      .siblings()
      .getByText("Select...")
      .click();
    cy.getByText("Vendor")
      .siblings()
      .find("input")
      .type("Vendor Tier 5", { force: true });

    cy.get("#react-select-6-option-0").type("{enter}");

    cy.contains("Vendor Tier 5");

    cy.getByText("Vendor Tier 5")
      .siblings()
      .find("svg")
      .click();

    cy.getByText("Vendor")
      .find("svg")
      .click();

    // --> End Filter by Vendor search <--
  });

  it("Deletes a Review", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    cy.get('[href="/assurance"]')
      .first()
      .click();

    cy.url().should("include", "/assurance");

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="4"]').click();

    cy.getByText("Vendor Manager")
      .siblings()
      .find("input")
      .type("No manager {enter}", { force: true });

    cy.wait("@vendors");
    cy.getByText("WDIHTDT4 Review").click({ force: true });
    //Deletes Action Item
    cy.get('div[data-target="#demo"]')
      .children()
      .find('svg[data-icon="trash"]')
      .click({ force: true });
    cy.wait(2000);
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(1000);
    //Deletes Review
    cy.getAllByTestId("newReviewItemButton")
      .find('svg[data-icon="cog"]')
      .trigger("mouseover");
    cy.wait(2000);
    cy.getAllByTestId("newReviewItemButton")
      .find('div[data-tip="Delete Review"]')
      .click();
    cy.wait(1000);
    cy.contains("Are you sure you want to delete this review?");
    cy.wait(1000);
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(2000);
    cy.queryByText("WDIHTDT4 Review").should("not.exist");
  });

  it("Tests all set in Review", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    cy.get('[href="/assurance"]')
      .first()
      .click();

    cy.url().should("include", "/assurance");

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="5"]').click();

    cy.get('[href="/assurance"]')
      .first()
      .click();

    cy.url().should("include", "/assurance");
    cy.getByText("Vendor Manager")
      .siblings()
      .find("input")
      .type("No manager {enter}", { force: true });

    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .click();
    cy.wait("@vendors");
    cy.contains(/You are all set/);
  });

  it("Tests empty Review", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    cy.get('[href="/assurance"]')
      .first()
      .click();

    cy.url().should("include", "/assurance");

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="2"]').click();

    cy.getByText("Vendor Manager")
      .siblings()
      .find("input")
      .type("No manager {enter}", { force: true });

    cy.get('div[data-tip="What do I have to do today"]')
      .find("svg")
      .click();
    cy.wait("@vendors");
    cy.contains(/This review has no pinned items/);
  });
});
