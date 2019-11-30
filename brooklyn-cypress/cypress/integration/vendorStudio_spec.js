import { options } from "../support/index";
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value"
).set;

describe("Vendor page test", function() {
  beforeEach(() => {
    cy.fixture("users/login").as("login");
  });
  it("Use the vendor part of the app", function() {
    cy.login(this.login.username, this.login.password, options);
    cy.visit("");
    // Home
    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    // Vendor Studio
    cy.get('[href="/vendor"]').click();
    cy.url().should("include", "/vendor");

    cy.contains("Name");
    cy.contains("Tier");
    cy.contains("Next Review");
    cy.contains("Delete");
    cy.contains("Journey");
    cy.contains("Vendor Tier 1");
    cy.contains("Vendor Tier 2");
    cy.contains("Vendor Tier 3");
    cy.contains("Vendor Tier 4");
    cy.contains("Vendor Tier 5");

    // Add new vendor
    cy.getByTestId("newReviewItemButton").click();
    cy.getByText("New Vendor")
      .parent()
      .siblings()
      .find('input[name="name"]')
      .click();
    cy.wait(3000);
    cy.getByText("New Vendor")
      .parent()
      .siblings()
      .find('input[name="name"]')
      .type("Testing Vendor", { delay: 100 });
    cy.getByText("Save")
      .parent()
      .click();

    //Edit vendor
    cy.getByText("Testing Vendor").click();

    cy.get('input[name="tierSlider1"]').then($range => {
      const range = $range[0];
      nativeInputValueSetter.call(range, 1);
      range.dispatchEvent(new Event("change", { value: 1, bubbles: true }));
    });
    //Critical Service Layer
    cy.get('input[name="tierSlider2"]').then($range => {
      const range = $range[0];
      nativeInputValueSetter.call(range, 2);
      range.dispatchEvent(new Event("change", { value: 2, bubbles: true }));
    });

    //Regulatory
    cy.get('input[name="tierSlider3"]').then($range => {
      const range = $range[0];
      nativeInputValueSetter.call(range, 3);
      range.dispatchEvent(new Event("change", { value: 3, bubbles: true }));
    });

    cy.get('input[name="tierSlider4"]').then($range => {
      const range = $range[0];
      nativeInputValueSetter.call(range, 4);
      range.dispatchEvent(new Event("change", { value: 4, bubbles: true }));
    });

    cy.get('input[name="tierSlider5"]').then($range => {
      const range = $range[0];
      nativeInputValueSetter.call(range, 5);
      range.dispatchEvent(new Event("change", { value: 5, bubbles: true }));
    });

    cy.wait(1000);

    cy.getByText("SCORE")
      .siblings()
      .find("text")
      .should($item => {
        expect($item[0].textContent).to.equal("15");
      });

    cy.getByText("TIER")
      .siblings()
      .find("text")
      .should($item => {
        expect($item[0].textContent).to.equal("3");
      });
    cy.get("a.tabButton")
      .first()
      .siblings()
      .first()
      .click();

    cy.getByText("Total Cost Optimizations")
      .siblings()
      .find("input")
      .clear()
      .type("10000");

    cy.getByText("Total Cost Optimizations")
      .siblings()
      .find("input")
      .clear()
      .type("10000");

    cy.getByText("Invoiced YTD")
      .siblings()
      .find("input")
      .clear()
      .type("30000");

    cy.getByText("CSAT")
      .siblings()
      .find("input")
      .clear()
      .type("10");

    cy.getByText("Total Contract Value")
      .siblings()
      .find("input")
      .clear()
      .type("50");

    cy.getByText("Number of cost optimizations")
      .siblings()
      .find("input")
      .clear()
      .type("14");

    cy.getByText("SRM Lead")
      .siblings()
      .click();
    cy.getByText("Leandro Miranda").click();
    cy.wait(1000);

    cy.getByText("Business Unit")
      .parent()
      .parent()
      .click();
    cy.getByText("Test BU").click();

    cy.getByText("Save").click();

    //Test journey link
    cy.get("button")
      .first()
      .click({ force: true });

    cy.get('[href="/vendor"]')
      .eq(1)
      .click();

    cy.getByText("Testing Vendor")
      .parent()
      .siblings()
      .find('svg[data-icon="angle-double-up"]')
      .click();
    cy.url().should("include", "/journey");
    cy.get(".vendorJourney").should("exist");

    //Deletes vendor
    cy.get('[href="/vendor"]')
      .first()
      .click();
    cy.url().should("include", "/vendor");

    cy.getByText("Testing Vendor")
      .parent()
      .siblings()
      .find('svg[data-icon="trash"]')
      .click();

    cy.contains("Confirm vendor deletion?");
    cy.wait(2000);
    cy.getByText("Confirm vendor deletion?")
      .parent()
      .siblings()
      .within(() => {
        cy.getByText("Delete")
          .parent()
          .click();
      });
    cy.wait(2000);
    cy.queryByText("Testing Vendor").should("not.exist");
  });
});
