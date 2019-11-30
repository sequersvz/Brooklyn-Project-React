import { options } from "../support/index";

describe("App test", function() {
  beforeEach(function() {
    cy.fixture("users/login").as("login");
  });
  it("Creates review", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");
    //Create review
    cy.get('div[data-tip="New Review"]')
      .find("svg")
      .click();
    cy.contains("New Review");
    cy.wait(2000);
    cy.get('input[name="notes"]').click();
    cy.wait(5000);
    cy.get('input[name="notes"]').type("MOR", { delay: 100 });
    cy.get("#react-select-6-input")
      .first()
      .click({ force: true })
      .type("Vendor Tier 5 {enter}", { force: true });

    cy.wait(2000);
    cy.getByText("Save")
      .parent()
      .click();
  });
  it("Edits data in review", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    cy.getByText("MOR").click({ force: true });

    //Go to reference
    cy.get('svg[data-icon="clipboard-list"]').click();
    cy.wait(2000);
    // Create RI
    cy.createReviewItem("MO RI");
    cy.wait(2000);
    //Mark RI as ready
    cy.getByText("MO RI")
      .parent()
      .parent()
      .siblings()
      .find('svg[data-icon="arrow-alt-circle-down"]')
      .click({ force: true });
    cy.wait(3000);
    //Test in Ready Review Items
    cy.getByText("Ready Review Items")
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText("MO RI").should("exist");
      });
  });

  it("Edits data in meeting organiser", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    cy.getByText("MeetingOrg - Review")
      .scrollIntoView()
      .click({ force: true });
    //Meeting Organiser
    cy.get('svg[data-icon="users"]').click();
    //Edit title
    cy.getByText("Title:")
      .parent()
      .siblings()
      .click();
    cy.wait(2000);
    cy.get('input[name="notes"]')
      .clear()
      .type("MeetingOrg - Review", { delay: 100 })
      .should("have.value", "MeetingOrg - Review");
    //Edit date
    cy.getByText("Review Date:")
      .siblings()
      .last()
      .click();
    cy.wait(2000);
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
    cy.getByText("OK")
      .parent()
      .click();
    cy.wait(2000);
    //Edit time
    cy.getByText("Time:")
      .siblings()
      .click();
    cy.wait(2000);
    //Edit hour
    cy.get('div[role="menu"]').click("bottom");
    cy.wait(2000);
    //Edit minutes
    cy.get('div[role="menu"]').click("right");
    cy.getByText("OK").click();
    cy.wait(2000);
    // Edit group
    cy.getByText(/Edit Group/).click();
    cy.wait(5000);
    cy.getByText(/Group/)
      .parent()
      .find('svg[data-icon="caret-down"]')
      .click({ force: true });
    cy.wait(5000);
    cy.get("#react-select-6-option-1").type("{enter}");
    cy.getByText(/Group/).click();

    //Add attendee
    cy.getByText("Add Attendees")
      .parent()
      .click();
    cy.wait(1000);
    cy.getByText("Select...")
      .parent()
      .click();
    cy.wait(1000);
    cy.get('input[id="react-select-2-input"]');

    cy.get("#react-select-2-option-1").type("{enter}");
    //Click somewhere else
    cy.getByText(/Attendees:/).click();
    cy.wait(2000);
    // Add non preloaded attendee
    cy.getByText(/Leandro Miranda/).click();
    cy.get('input[id="react-select-3-input"]').type("Pablo Dominguez{enter}", {
      delay: 100
    });
    cy.getByText(/Attendees:/).click();
    cy.wait(2000);
    // Check attendees added
    cy.getByText(/Leandro Miranda/)
      .siblings()
      .find('svg[data-icon="user-check"]');
    cy.getByText(/Pablo Dominguez/)
      .siblings()
      .find('svg[data-icon="user-check"]');
    //Mark attendee as non
    cy.getByText(/Pablo Dominguez/)
      .siblings()
      .find('svg[data-icon="user-check"]')
      .click();
    //Check non attendee
    cy.getByText(/Pablo Dominguez/)
      .siblings()
      .find('svg[data-icon="user-times"]');
    //Edit Objectives
    cy.getByText("Objectives:")
      .parent()
      .siblings()
      .click();
    cy.wait(1000);
    cy.get('div[role="textbox"]').type("Meeting Objectives{enter}");
    cy.wait(1000);
    //Go to summary agenda
    cy.getByText("Summary Agenda")
      .parent()
      .click();
    cy.wait(5000);
    //Edit RI title
    cy.getByText("MeetingOrg RI").click();
    cy.wait(2000);
    cy.get('input[name="itemreviewName"]')
      .clear()
      .type("Subject{enter}");
    cy.wait(5000);
    //Time Slot
    cy.getByText(/Click to edit/)
      .first()
      .click();
    cy.wait(4000);
    cy.get('input[name="itemreviewTimeSlot"]').type("10:00 - 11:00{enter}");
    cy.wait(5000);
    //By
    cy.getByText(/Click to edit/).click();
    cy.wait(4000);
    cy.get('input[name="itemreviewBy"]').type("LM{enter}");
    cy.wait(2000);
    //Add another item
    cy.getByText(/Add Meeting Item/).click();
    cy.wait(5000);
    //Edit item name
    cy.getByText(/Click to edit/).click({ force: true });
    cy.wait(4000);
    cy.get('input[name="itemreviewName"]').type("Break{enter}");
    cy.wait(5000);
    //Edit time slot
    cy.getByText(/Click to edit/).click({ force: true });
    cy.wait(4000);
    cy.get('input[name="itemreviewTimeSlot"]')
      .last()
      .type("11:00 - 11:15{enter}");
    cy.wait(2000);
    //Mark as action RI
    cy.get('div[data-target="#demo"]')
      .first()
      .find('svg[data-icon="fire"]')
      .click({ force: true });
    cy.wait(2000);
    //Create item description
    cy.getByText("Reference / Governance").dblclick();
    cy.wait(2000);
    //Edit description
    cy.getByText("Click to edit description").click({ force: true });
    cy.wait(2000);
    cy.get('div[class="DraftEditor-root"]').click();
    cy.focused()
      .type("Test description")
      .blur();
    cy.wait(6000);
    //Download agenda
    cy.getByText(/Download Agenda/)
      .parent()
      .click();
    cy.wait(4000);
    cy.get("h3")
      .parent()
      .siblings()
      .first()
      .within(() => {
        cy.contains(/6:15/);
        cy.contains(/Leandro Miranda/);
        cy.contains(/Pablo Dominguez/);
        cy.contains(/Meeting Objectives/);

        cy.getByText(/SUMMARY AGENDA/)
          .parent()
          .within(() => {
            cy.contains(/Break/);
            cy.contains(/11:00 - 11:15/);
            cy.contains(/Subject/);
            cy.contains(/10:00 - 11:00/);
          });
        cy.getByText(/SUMMARY ACTIONS/)
          .parent()
          .within(() => {
            cy.contains(/Subject/);
          });
      });
    cy.getByText(/Cancel/)
      .parent()
      .click();
    //Actions
    cy.getByText(/Action Items/).click();
    cy.wait(1000);
    cy.getByText(/New Actions/).click();
    cy.wait(3000);
    cy.getByText(/New Actions/)
      .parent()
      .parent()
      .siblings()
      .within(() => {
        cy.contains("Subject");
      });
    cy.getByText(/New Actions/)
      .parent()
      .parent()
      .siblings()
      .within(() => {
        cy.getByText(/Add Action/).click({ force: true });
        cy.wait(2000);
        cy.getByText(/Click to edit/)
          .parent()
          .click("left");
        cy.wait(4000);
        cy.focused().type("Subject2{enter}");
        cy.wait(2000);
      });
    cy.wait(1000);
    //Close new actions
    cy.getByText(/New Actions/).click();
    cy.wait(1000);
    //Download minutes
    cy.getByText(/Download Minutes/)
      .parent()
      .click();
    cy.wait(3000);
    cy.get("h3")
      .parent()
      .siblings()
      .first()
      .within(() => {
        cy.contains(/6:15/);
        cy.contains(/Leandro Miranda/);
        cy.contains(/Pablo Dominguez/);
        cy.contains(/Meeting Objectives/);

        cy.getByText(/SUMMARY ACTIONS/)
          .parent()
          .within(() => {
            cy.contains(/Subject/);
            cy.contains(/Subject2/);
          });
        cy.getByText(/Detailed Minutes/)
          .parent()
          .within(() => {
            cy.contains(/Subject/);
            cy.contains(/Test description/);
            cy.contains(/Subject2/);
          });
      });
    cy.getByText(/Cancel/)
      .parent()
      .click();
  });

  it("Deletes review & elements inside", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");

    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.get('[href="/assurance"]').click();
    cy.url().should("include", "/assurance");

    cy.getByText("MeetingOrg - Review").click({ force: true });
    //Meeting Organiser
    cy.get('svg[data-icon="users"]').click();
    cy.wait(5000);
    //Remove attendees
    cy.getByText(/Leandro Miranda/).click();
    cy.wait(5000);
    cy.getByText(/Leandro Miranda/)
      .siblings()
      .find("svg")
      .click();
    cy.wait(2000);
    cy.getByText(/Pablo Dominguez/)
      .siblings()
      .find("svg")
      .click();
    cy.wait(2000);
    cy.focused().blur();
    //Check attendees removed
    cy.getByText("Attendees:")
      .parent()
      .within(() => {
        cy.queryByText(/Leandro Miranda/).should("not.exist", {
          timeout: 5000
        });
        cy.queryByText(/Pablo Dominguez/).should("not.exist", {
          timeout: 5000
        });
      });
    //Go to summary agenda
    cy.getByText("Summary Agenda")
      .parent()
      .click();
    cy.wait(5000);
    //Delete Subject item
    cy.get('svg[data-icon="trash"]')
      .first()
      .click();
    cy.wait(2000);
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(5000);
    //Delete Break item
    cy.get('svg[data-icon="trash"]')
      .first()
      .click();
    cy.wait(2000);
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(5000);
    //Check items removed
    cy.getByText("Summary Agenda")
      .parent()
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText(/Subject/).should("not.exist", { timeout: 5000 });
        cy.queryByText(/Break/).should("not.exist", { timeout: 5000 });
      });
    //Go to action items
    cy.getByText(/Action Items/).click();
    cy.wait(1000);
    cy.getByText(/New Actions/).click();
    cy.wait(3000);
    //Delete Subject2 item
    cy.get('svg[data-icon="trash"]')
      .first()
      .click();
    cy.wait(2000);
    cy.getByText("Delete")
      .parent()
      .click();
    cy.wait(5000);
    // Check action item removed
    cy.getByText("Action Items")
      .parent()
      .parent()
      .siblings()
      .within(() => {
        cy.queryByText(/Subject/).should("not.exist", { timeout: 5000 });
      });
  });
});
