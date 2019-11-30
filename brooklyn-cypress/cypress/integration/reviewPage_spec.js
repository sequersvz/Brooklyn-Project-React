import { options } from "../support/index";
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value"
).set;

describe("Review page test", function() {
  beforeEach(() => {
    cy.fixture("users/login").as("login");
  });
  it("Uses the review page", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    cy.getByText("Vendor Review").click({ force: true });

    cy.queryByText("Open Action Items").should("exist");
    cy.queryByText("Done Action Items").should("exist");
    cy.queryByText("Ready Review Items").should("not.exist", { timeout: 5000 });
    cy.queryByText("Covered Review Items").should("not.exist", {
      timeout: 5000
    });
  });

  it("Creates, pins and unpins a checkpoint", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");
    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");
    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="5"]').click();

    cy.getByText("Vendor Review").click({ force: true });
    //Go to Reference
    cy.get('svg[data-icon="clipboard-list"]').click();
    cy.wait(2000);
    //Create checkpoint
    cy.getByTestId("newReviewItemButton").trigger("mouseover");
    cy.wait(2000);
    cy.getByTestId("newReviewItemButton")
      .find('div[data-tip="Checkpoint"]')
      .click();
    cy.getByText("New Checkpoint")
      .parent()
      .siblings()
      .find('input[name="checkpointName"]')
      .type("checkpoint", { delay: 100 });
    cy.getByText("Save")
      .parent()
      .click();
    cy.wait(1000);
    //Pin checkpoint
    cy.getByText("checkpoint")
      .siblings()
      .find('svg[data-icon="thumbtack"]')
      .click()
      .should("have.class", "fa-inverse");
    cy.reload();
    cy.getByText("checkpoint", { timeout: 30000 })
      .siblings()
      .find('svg[data-icon="thumbtack"]')
      .should("have.class", "fa-inverse");
    cy.wait(1000);
    //Unpin checkpoint
    cy.getByText("checkpoint")
      .siblings()
      .find('svg[data-icon="thumbtack"]')
      .click()
      .should("not.have.class", "fa-inverse");
    cy.reload();
    cy.getByText("checkpoint", { timeout: 30000 })
      .siblings()
      .find('svg[data-icon="thumbtack"]')
      .should("not.have.class", "fa-inverse");

    //Go to delivery and check pinned items are first
    cy.get('svg[data-icon="box-open"]').click();
    cy.wait(5000);
    cy.get('div[id="flip-move-items"]')
      .children()
      .first()
      .within(() => {
        cy.contains("Accuracy");
        cy.get('svg[data-icon="thumbtack"]').should("have.class", "fa-inverse");
      });
    cy.get('div[id="flip-move-items"]')
      .children()
      .first()
      .next()
      .within(() => {
        cy.contains("MI Reports");
        cy.get('svg[data-icon="thumbtack"]').should("have.class", "fa-inverse");
      });
    cy.get('div[id="flip-move-items"]')
      .children()
      .first()
      .next()
      .next()
      .within(() => {
        cy.contains("Quantities");
        cy.get('svg[data-icon="thumbtack"]').should("have.class", "fa-inverse");
      });
    cy.get('div[id="flip-move-items"]')
      .children()
      .first()
      .next()
      .next()
      .next()
      .within(() => {
        cy.contains("Demand Planning");
        cy.get('svg[data-icon="thumbtack"]').should(
          "not.have.class",
          "fa-inverse"
        );
      });
  });

  it("Handles, RI, open, close, defer", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");
    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");
    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="5"]').click();

    cy.getByText("Vendor Review").click({ force: true });
    //Go to delivery
    cy.get('svg[data-icon="box-open"]').click();
    cy.wait(2000);
    //Drag and drop
    cy.scrollTo(0, 0);
    cy.wait(2000);
    cy.get('svg[data-icon="equals"]')
      .first()
      .trigger("mousedown", { which: 1 });
    cy.wait(1000);
    cy.getByText("Ready Review Items")
      .trigger("mousemove")
      .trigger("mouseup");
    cy.wait(5000);
    //Test ocd1 RI to be in first place
    cy.get('svg[data-icon="equals"]')
      .first()
      .siblings()
      .children()
      .should("have.text", "ocd1 RI");
    cy.wait(2000);
    //Delete ocd1 RI
    cy.get('div[data-target="#demo"]')
      .first()
      .find('svg[data-icon="trash"]')
      .click({ force: true });
    cy.wait(2000);
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(5000);
    cy.scrollTo(0, 0);
    //Mark as ready
    cy.getByText("ocd RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="arrow-alt-circle-down"]')
      .click({ force: true });
    cy.wait(5000);
    //Test not in Open Review Items
    cy.getByText("Open Review Items")
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText("ocd RI").should("not.exist", { timeout: 5000 });
      });
    //Test in Ready Review Items
    cy.getByText("Ready Review Items")
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText("ocd RI").should("exist");
      });
    //Mark as defer
    cy.getByText("ocd RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="clock"]')
      .click({ force: true });
    cy.wait(5000);
    //Test in Covered Review Items
    cy.getByText("Covered Review Items")
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText("ocd RI").should("exist");
      });
    //Remove defer mark
    cy.getByText("ocd RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="clock"]')
      .click({ force: true });
    cy.wait(5000);
    //Mark as Action
    cy.getByText("ocd RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="fire"]')
      .click({ force: true });
    cy.wait(5000);
    //Mark as closed with rating in Delivery - Accuracy
    cy.getByText("ocd RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="arrow-alt-circle-down"]')
      .trigger("mouseover", { force: true });
    cy.wait(1000);
    cy.getByText("ocd RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="arrow-alt-circle-down"]')
      .click({ force: true });
    cy.wait(5000);
    cy.getByText("Select Score")
      .parent()
      .siblings()
      .find('svg[data-icon="star"]')
      .first()
      .click({ force: true });
    cy.wait(2000);
    //Go to Action Log
    cy.get('svg[data-icon="users"]')
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="fire"]')
      .click();
    cy.wait(5000);
    //Test in Open Action Items
    cy.getByText("Open Action Items")
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText("ocd RI").should("exist");
      });
  });

  it("Sets a recurring RI", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");
    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");
    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="5"]').click();

    cy.getByText("Tier 5 - Review Test").click({ force: true });
    //Go to Delivery
    cy.get('svg[data-icon="box-open"]').click();
    cy.wait(8000);
    //mark as recurring
    cy.getByText("Recurring RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="redo"]')
      .click({ force: true });
  });

  it("Exports data review to PDF", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");
    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");
    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="5"]').click();
    //Download to PDF
    cy.getByText("Vendor Review").click({ force: true });
    cy.getAllByTestId("newReviewItemButton")
      .find('svg[data-icon="download"]')
      .trigger("mouseover");
    cy.wait(2000);
    cy.getAllByTestId("newReviewItemButton")
      .find('div[data-tip="PDF"]')
      .click();
    cy.wait(1000);
    cy.contains("Download Agenda");
  });

  it("Tests RI in next review", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");
    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="5"]').click();
    //Create next review
    cy.get('div[data-tip="New Review"]')
      .find("svg")
      .click();
    cy.contains("New Review");
    // cy.wait(3000);
    // cy.get('input[name="date"]').click();
    // cy.wait(3000);
    // cy.getByText('keyboard_arrow_right').click({ force: true });
    // cy.wait(1000);
    // cy.get('h4').parent().siblings().last().within(() => {
    //   cy.getByText('15').parent().click({ force: true });
    // });
    cy.wait(2000);
    cy.get('input[name="notes"]').click({ force: true });
    cy.wait(5000);
    cy.get('input[name="notes"]').type("VRP1", { delay: 100 });
    cy.contains("New Review");
    cy.get("#react-select-6-input")
      .first()
      .click({ force: true })
      .type("Vendor Tier 5 {enter}", { force: true });

    cy.getByText("Save")
      .parent()
      .click();

    cy.getByText("VRP1").click({ force: true });
    cy.wait(2000);
    //Go to Delivery
    cy.get('svg[data-icon="box-open"]').click();
    cy.wait(5000);
    //Test in Open Review Items
    cy.getByText("Open Review Items")
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText("Recurring RI").should("exist");
      });
    cy.wait(2000);
    //Mark as ready
    cy.getByText("Recurring RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="arrow-alt-circle-down"]')
      .click({ force: true });
    cy.wait(5000);
    //Test in Ready Review Items
    cy.getByText("Ready Review Items")
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText("Recurring RI").should("exist");
      });
    //Mark as closed with rating in Delivery - Accuracy
    cy.getByText("Recurring RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="arrow-alt-circle-down"]')
      .trigger("mouseover", { force: true });
    cy.wait(1000);
    cy.getByText("Recurring RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="arrow-alt-circle-down"]')
      .click({ force: true });
    cy.wait(5000);
    cy.getByText("Select Score")
      .parent()
      .siblings()
      .find('svg[data-icon="star"]')
      .last()
      .click({ force: true });
    cy.wait(2000);
    cy.get('input[name="reviewitemImportance"]').then($range => {
      const range = $range[0];
      nativeInputValueSetter.call(range, 7);
      range.dispatchEvent(new Event("change", { value: 7, bubbles: true }));
    });
    cy.wait(2000);
    //Go to Reviews/Scores
    cy.get('input[type="checkbox"]').click();
    cy.wait(7000);
    //Check title
    cy.getByText("Vendor Tier 5")
      .siblings()
      .find('span[class="scoreSquare"]')
      .should("have.attr", "style", "background: rgb(92, 184, 10);");
    cy.getByText("Vendor Tier 5")
      .siblings()
      .find('span[class="scoreSquare"]')
      .should("have.text", "10");
    cy.wait(2000);
    //Check Delivery
    cy.get('li[class="itemCategorySelected x"]')
      .find('span[class="scoreSquare"]')
      .should("have.attr", "style", "background: rgb(92, 184, 10);");
    cy.get('li[class="itemCategorySelected x"]')
      .find('span[class="scoreSquare"]')
      .should("have.text", "10");
    cy.wait(2000);
    //Check Accuracy
    cy.get('li[class="liScoreContainer"]')
      .first()
      .find('span[class="scoreSquare"]')
      .should("have.attr", "style", "background: rgb(92, 184, 10);");
    cy.get('li[class="liScoreContainer"]')
      .first()
      .find('span[class="scoreSquare"]')
      .should("have.text", "10");
    cy.wait(2000);
    //Go to review
    cy.get('input[type="checkbox"]').click();
    cy.wait(5000);
    //Delete RI
    cy.get('div[data-target="#demo"]')
      .find('svg[data-icon="trash"]')
      .click({ force: true });
    cy.wait(2000);
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(5000);
    //Test not in Covered Review Items
    cy.getByText("Covered Review Items")
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText("Recurring RI").should("not.exist", { timeout: 5000 });
      });
  });

  it("Removes RI and reviews", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");
    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");
    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="5"]').click();

    cy.getByText("VRP1").click({ force: true });
    //Deletes Testing Review
    cy.getAllByTestId("newReviewItemButton")
      .find('svg[data-icon="cog"]')
      .trigger("mouseover");
    cy.wait(2000);
    cy.getAllByTestId("newReviewItemButton")
      .find('div[data-tip="Delete Review"]')
      .click();
    cy.wait(1000);
    cy.contains("Are you sure you want to delete this review?");
    cy.wait(2000);
    cy.getByText("Delete")
      .parent()
      .click();

    cy.getByText("Vendor Review").click({ force: true });

    //Delete RI
    cy.get('div[data-target="#demo"]')
      .find('svg[data-icon="trash"]')
      .click({ force: true });
    cy.wait(2000);
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(2000);
    //Go to Delivey
    cy.get('svg[data-icon="box-open"]').click();
    cy.wait(2000);
    //Delete RI
    cy.get('div[data-target="#demo"]')
      .find('svg[data-icon="trash"]')
      .click({ force: true });
    cy.wait(2000);
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(2000);
    //Deletes Testing Review
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
    cy.wait(4000);
    cy.queryByText("Vendor Review").should("not.exist");
    cy.queryByText("VRP1").should("not.exist");
  });
});
