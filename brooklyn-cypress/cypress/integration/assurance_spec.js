import { options } from "../support/index";

describe("Assurance page test", function() {
  beforeEach(() => {
    cy.fixture("users/login").as("login");
    cy.server();
    cy.route({
      method: "GET",
      url: "/users/reviews/timeline*"
    }).as("timeline");
    cy.route({
      method: "GET",
      url: "/users/accounts/1/checkpoints/statistics*"
    }).as("statistics");
  });

  it("Use the assurance part of the app", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 15000 }).should("eq", "/home");

    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    cy.contains("Reviews (Prior Yr)");
    cy.contains("Pinned Checkpoints (Prior Yr)");
    cy.contains("Actual Reviews");
    cy.contains("Closed Review Items");
  });

  it("Tests the filters", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    // --> Filter by Strategic <--
    cy.get('svg[cy-data="filter_Strategic_plus"]').click();
    cy.contains("Strategic");
    cy.contains("Non-Strategic");

    // Active
    cy.get('input[name="Strategic"]').click();
    cy.wait("@timeline");
    cy.contains("Tier 1 - Review Test");
    cy.contains("Tier 2 - Review Test");

    // Deactive
    cy.get('input[name="Strategic"]').click();
    cy.wait("@timeline");
    cy.contains("Tier 1 - Review Test");
    cy.contains("Tier 2 - Review Test");
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");
    cy.contains("Tier 5 - Review Test");

    // Filter by Non-Strategic

    // Active
    cy.get('input[name="Non-Strategic"]').click();
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");
    cy.contains("Tier 5 - Review Test");

    // Deactive
    cy.get('input[name="Non-Strategic"]').click();
    cy.wait("@timeline");
    cy.contains("Tier 1 - Review Test");
    cy.contains("Tier 2 - Review Test");
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");
    cy.contains("Tier 5 - Review Test");

    cy.get('svg[cy-data="filter_Strategic_times"]').click();

    // --> End Filter by Strategic <--

    // --> Filter by Critical <--
    cy.get('svg[cy-data="filter_Critical_plus"]').click();
    cy.contains("Critical");
    cy.contains("Non-Critical");

    //Active
    cy.get('input[name="Critical"]').click();
    cy.wait("@timeline");
    cy.contains("Tier 2 - Review Test");

    // Desactive
    cy.get('input[name="Critical"]').click();
    cy.wait("@timeline");

    cy.contains("Tier 1 - Review Test");
    cy.contains("Tier 2 - Review Test");
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");
    cy.contains("Tier 5 - Review Test");

    // Filter by Non-Critical

    //Active
    cy.get('input[name="Non-Critical"]').click();
    cy.wait("@timeline");

    cy.contains("Tier 1 - Review Test");
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");
    cy.contains("Tier 5 - Review Test");

    // Deactive
    cy.get('input[name="Non-Critical"]').click();

    cy.contains("Tier 1 - Review Test");
    cy.contains("Tier 2 - Review Test");
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");
    cy.contains("Tier 5 - Review Test");

    cy.get('svg[cy-data="filter_Critical_times"]').click();

    // --> End Filter by Critical <--
    cy.scrollTo(0, 0);
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
    cy.wait("@timeline");

    cy.contains("Tier 1 - Review Test");

    //Deactive
    cy.get('input[name="1"]').click();

    cy.contains("Tier 1 - Review Test");
    cy.contains("Tier 2 - Review Test");
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");
    cy.contains("Tier 5 - Review Test");

    //Active
    cy.get('input[name="2"]').click();
    cy.wait("@timeline");

    cy.contains("Tier 2 - Review Test");

    //Deactive
    cy.get('input[name="2"]').click();

    cy.contains("Tier 1 - Review Test");
    cy.contains("Tier 2 - Review Test");
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");
    cy.contains("Tier 5 - Review Test");

    //Active
    cy.get('input[name="3"]').click();
    cy.wait("@timeline");

    cy.contains("Tier 3 - Review Test");

    //Deactive
    cy.get('input[name="3"]').click();
    cy.contains("Tier 1 - Review Test");
    cy.contains("Tier 2 - Review Test");
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");
    cy.contains("Tier 5 - Review Test");

    //Active
    cy.get('input[name="4"]').click();
    cy.wait("@timeline");

    cy.contains("Tier 4 - Review Test");

    //Deactive
    cy.get('input[name="4"]').click();
    cy.contains("Tier 1 - Review Test");
    cy.contains("Tier 2 - Review Test");
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");
    cy.contains("Tier 5 - Review Test");

    //Active
    cy.get('input[name="5"]').click();
    cy.wait("@timeline");

    cy.contains("Tier 5 - Review Test");

    //Deactive
    cy.get('input[name="5"]').click();
    cy.wait("@timeline");
    cy.contains("Tier 1 - Review Test");
    cy.contains("Tier 2 - Review Test");
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");
    cy.contains("Tier 5 - Review Test");

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

    cy.get("#react-select-2-option-0").type("{enter}");
    cy.wait("@timeline");

    cy.contains("Tier 1 - Review Test");

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

    cy.get("#react-select-2-option-0").type("{enter}");
    cy.wait("@timeline");

    cy.contains("Tier 2 - Review Test");

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

    cy.get("#react-select-2-option-0").type("{enter}");
    cy.wait("@timeline");

    cy.contains("Tier 3 - Review Test");

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

    cy.get("#react-select-2-option-0").type("{enter}");
    cy.wait("@timeline");

    cy.contains("Tier 4 - Review Test");

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

    cy.get("#react-select-2-option-0").type("{enter}");
    cy.wait("@timeline");
    cy.contains("Tier 5 - Review Test");

    cy.getByText("Vendor Tier 5")
      .siblings()
      .find("svg")
      .click();

    cy.getByText("Vendor")
      .find("svg")
      .click();

    // --> End Filter by Vendor search <--

    // --> Filter by Vendor Manager search
    cy.getByText("Vendor Manager")
      .find("svg")
      .click();

    cy.getByText("Vendor Manager")
      .siblings()
      .getByText("Select...")
      .click({ force: true });
    cy.getByText("Vendor Manager")
      .siblings()
      .find("input")
      .type("Leandro Miranda", { force: true });

    cy.get("#react-select-4-option-0").type("{enter}");
    cy.wait("@timeline");

    cy.contains("Tier 1 - Review Test");

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
      .type("No manager", { force: true });

    cy.get("#react-select-4-option-1").type("{enter}");
    cy.wait("@timeline");
    cy.contains("Tier 2 - Review Test");
    cy.contains("Tier 3 - Review Test");
    cy.contains("Tier 4 - Review Test");

    cy.getByText("No manager")
      .siblings()
      .find("svg")
      .click();

    cy.getByText("Vendor Manager")
      .find("svg")
      .click();

    // --> End Filter by Vendor Manager search <--
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
    cy.get('input[name="5"]').click();
    cy.wait("@timeline");
    cy.get('div[data-tip="New Review"]')
      .find("svg")
      .click();
    cy.contains("New Review");
    cy.wait(2000);
    cy.get('input[name="notes"]', { timeout: 7000 }).click();
    cy.get('input[name="notes"]', { timeout: 7000 }).type("Testing Review", {
      delay: 100
    });
    cy.wait(2000);

    cy.get("#react-select-6-input")
      .first()
      .click({ force: true })
      .type("Vendor Tier 5 {enter}", { force: true });

    cy.wait(1000);
    cy.getByText("Save")
      .parent()
      .click();

    cy.getByText("Testing Review").click({ force: true });
    cy.wait(1000);
    cy.getAllByTestId("newReviewItemButton")
      .find('svg[data-icon="cog"]')
      .trigger("mouseover");
    cy.wait(1000);
    cy.getAllByTestId("newReviewItemButton")
      .find('div[data-tip="New Review"]')
      .click();
    cy.wait(1000);

    cy.contains("New Review");
    cy.get("#react-select-9-input")
      .first()
      .click({ force: true })
      .type("Vendor Tier 5 {enter}", { force: true });

    cy.wait(1000);
    cy.get('input[name="notes"]').click();
    cy.wait(5000);
    cy.get('input[name="notes"]').type("Testing Review 1", { delay: 100 });
    cy.getByText("Save")
      .parent()
      .click();
  });

  it("Tests the graphs", function() {
    let reviewsQty;
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    // Select Tier 1
    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="1"]').click();
    // cy.wait("@statistics");

    // Checks number of reviews in main graph

    cy.get(".timeLine")
      .find(".vis-axis")
      .within(() => {
        cy.get(".vis-group")
          .children()
          .should($item => {
            reviewsQty = $item.length;
            expect(reviewsQty).to.equal(1);
          });
      });
    cy.wait(2000);
    // Check first graphic, maximumm y axis value

    cy.getByText("Reviews (Prior Yr)")
      .parent()
      .siblings()
      .find(".y-axis-element")
      .within(() => {
        cy.get('g[transform="translate(0,0)"]')
          .find("text")
          .should($item => {
            expect($item[0].textContent).to.equal("1.0");
          });
      });
    cy.wait(2000);
    // First speedometer
    cy.getByTestId("actualReviewSpeedo")
      .children()
      // cy.get('svg[class="speedometer"]').first().children()
      .find('text[class="current-value"]')
      .should($item => {
        expect($item[0].textContent).to.equal("1");
      });

    cy.getByTestId("actualReviewSpeedo")
      .children()
      // cy.get('svg[class="speedometer"]').first()
      .find('g[class="pointer"]')
      .children()
      .should($item => {
        expect($item[0].transform.baseVal[0].angle).to.be.within(-77, -75);
      });

    // Deselect Tier 1

    cy.getByText("Vendor Tier")
      .find("svg")
      .click({ force: true });
    cy.get('input[name="1"]').click({ force: true });

    // Select Tier 2

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="2"]').click({ force: true });
    cy.wait(2000);
    // Check first graphic, number of blue points

    cy.getByText("Reviews (Prior Yr)")
      .parent()
      .siblings()
      .children()
      .find('circle[fill="rgb(0, 188, 212)"][cy="47"]')
      .should($item => {
        expect($item.length).to.be.within(2, 3);
      });

    // Check first graphic, maximumm y axis value

    cy.getByText("Reviews (Prior Yr)")
      .parent()
      .siblings()
      .find(".y-axis-element")
      .within(() => {
        cy.get('g[transform="translate(0,0)"]')
          .find("text")
          .should($item => {
            expect($item[0].textContent).to.equal("2.0");
          });
      });

    // Check second graphic, number of blue points

    cy.getByText("Pinned Checkpoints (Prior Yr)")
      .parent()
      .siblings()
      .find('circle[fill="rgb(0, 188, 212)"][cy="0"]')
      .should($item => {
        expect($item.length).to.equal(1);
      });

    // Check second graphic, maximumm y axis value

    cy.getByText("Pinned Checkpoints (Prior Yr)")
      .parent()
      .siblings()
      .find(".y-axis-element")
      .within(() => {
        cy.get('g[transform="translate(0,12.965517241379315)"]')
          .find("text")
          .should($item => {
            expect($item[0].textContent).to.equal("50");
          });
      });
    cy.wait(2000);
    // Second speedometer
    cy.getByTestId("closedReviewSpeedo")
      .children()
      .find('text[class="current-value"]')
      .should($item => {
        expect($item[0].textContent).to.equal("1");
      });

    cy.getByTestId("closedReviewSpeedo")
      .children()
      .find('g[class="pointer"]')
      .children()
      .should($item => {
        expect($item[0].transform.baseVal[0].angle).to.be.within(88, 90);
      });

    // Deselect Tier 2

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="2"]').click({ force: true });
  });

  it("Edits a Review", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="5"]').click();
    cy.wait("@timeline");
    cy.getByText("Testing Review").click({ force: true });
    cy.wait(1000);
    cy.getByTestId("newReviewItemButton").trigger("mouseover");
    cy.wait(1000);
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

  it("Deletes a Review", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    cy.getByText("Vendor Tier")
      .find("svg")
      .click();
    cy.get('input[name="5"]').click();
    cy.wait("@timeline");
    cy.getByText("Testing Review")
      .scrollIntoView()
      .click({ force: true });
    cy.wait(1000);
    //Deletes Item Review
    cy.get('div[data-target="#demo"]')
      .find('svg[data-icon="trash"]')
      .first()
      .click({ force: true });
    cy.wait(2000);
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(1000);
    //Deletes Testing Review
    cy.getAllByTestId("newReviewItemButton")
      .find('svg[data-icon="cog"]')
      .trigger("mouseover");
    cy.wait(1000);
    cy.getAllByTestId("newReviewItemButton")
      .find('div[data-tip="Delete Review"]')
      .click();
    cy.wait(1000);
    cy.contains("Are you sure you want to delete this review?");
    cy.wait(1000);
    cy.getByText("Delete")
      .parent()
      .click();
    //Deletes Testing Review 1
    cy.getByText("Testing Review 1")
      .scrollIntoView()
      .click({ force: true });
    cy.wait(1000);
    cy.getAllByTestId("newReviewItemButton")
      .find('svg[data-icon="cog"]')
      .trigger("mouseover");
    cy.wait(1000);
    cy.getAllByTestId("newReviewItemButton")
      .find('div[data-tip="Delete Review"]')
      .click();
    cy.contains("Are you sure you want to delete this review?");
    cy.wait(1000);
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(2000);
    cy.queryByText("Testing Review 1").should("not.exist", { timeout: 5000 });
    cy.queryByText("Testing Review").should("not.exist", { timeout: 5000 });
  });
});
