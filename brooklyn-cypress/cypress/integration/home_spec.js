import { options } from '../support/index';

describe('App test', function () {
  beforeEach(function () {
    cy.fixture("users/login").as("login");
    cy.server();
    cy.route({
      method: "GET",
      url: "/users/accounts/1/datahome*"
    }).as("datahome");

  });
  it('Use some filters', function () {
    cy.login(this.login.username, this.login.password, options);
    cy.visit('');

    // Home
    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");

    cy.contains('Filters', { timeout: 10000 });

    // --> Filter by Strategic <--
    cy.get('svg[cy-data="filter_Strategic_plus"]').click();
    cy.contains('Strategic');
    cy.contains('Non-Strategic');

    // Active
    cy.get('input[name="Strategic"]').click();
    cy.contains('£ 20.03m');         // Invoiced YTD
    cy.contains('24 (£ 19k)');     // Cost Optimizations
    cy.contains('1');             // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 90m');         // Activity Pipeline
    cy.contains('1 : 2');        // Vendor No SRM : Total
    cy.contains('6.3');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    // Deactive
    cy.get('input[name="Strategic"]').click();

    // Filter by Non-Strategic

    // Active
    cy.get('input[name="Non-Strategic"]').click();
    cy.contains('£ 100k');             // Invoiced YTD
    cy.contains('68 (£ 12k)');       // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 60m');         // Activity Pipeline
    cy.contains('3 : 3');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    // Deactive
    cy.get('input[name="Non-Strategic"]').click();

    cy.get('svg[cy-data="filter_Strategic_times"]').click();

    // --> End Filter by Strategic <--

    // --> Filter by Critical <--
    cy.get('svg[cy-data="filter_Critical_plus"]').click();
    cy.contains('Critical');
    cy.contains('Non-Critical');

    //Active
    cy.get('input[name="Critical"]').click();
    cy.contains('£ 20m');         // Invoiced YTD
    cy.contains('12 (£ 9k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 40m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    // Deactive
    cy.get('input[name="Critical"]').click();

    // Filter by Non-Critical

    //Active
    cy.get('input[name="Non-Critical"]').click();
    cy.contains('£ 126k');             // Invoiced YTD
    cy.contains('80 (£ 22k)');       // Cost Optimizations
    cy.contains('1');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 110m');         // Activity Pipeline
    cy.contains('3 : 4');            // Vendor CSAT
    cy.contains('7.5');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    // Deactive
    cy.get('input[name="Non-Critical"]').click();

    cy.get('svg[cy-data="filter_Critical_times"]').click();

    // --> End Filter by Critical <--

    // --> Filter by Tier <--
    cy.getByText('Vendor Tier').find('svg').click();

    cy.contains('1');
    cy.contains('2');
    cy.contains('3');
    cy.contains('4');
    cy.contains('5');

    //Active
    cy.get('input[name="1"]').click();
    cy.contains('£ 26k');         // Invoiced YTD
    cy.contains('12 (£ 10k)');     // Cost Optimizations
    cy.contains('1');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 50m');         // Activity Pipeline
    cy.contains('0 : 1');           // Vendor CSAT
    cy.contains('7.5');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('Vendor Tier 1: Contrato #1');

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('£ 50m');

    //Deactive
    cy.get('input[name="1"]').click();

    //Active
    cy.get('input[name="2"]').click();
    cy.contains('£ 20m');         // Invoiced YTD
    cy.contains('12 (£ 9k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 40m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('Vendor Tier 2: Contrato #2');

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('£ 40m');

    //Deactive
    cy.get('input[name="2"]').click();

    //Active
    cy.get('input[name="3"]').click();
    cy.contains('£ 10k');         // Invoiced YTD
    cy.contains('35 (£ 5k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 30m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('Vendor Tier 3: Contrato #3');

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('£ 30m');

    //Deactive
    cy.get('input[name="3"]').click();

    //Active
    cy.get('input[name="4"]').click();
    cy.contains('£ 40k');         // Invoiced YTD
    cy.contains('23 (£ 2k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 20m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('Vendor Tier 4: Contrato #4');

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('£ 20m');

    //Deactive
    cy.get('input[name="4"]').click();

    cy.getByText('Vendor Tier').find('svg').click();

    // --> End Filter by Tier <--

    // --> Filter by PIP <--
    cy.get('svg[cy-data="filter_PIP_plus"]').click();
    cy.contains('Performance');
    cy.contains('Non-Performance');

    //Activate

    cy.get('input[name="Performance Improvement Plan"]').click()
    cy.contains('£ 0');         // Invoiced YTD
    cy.contains('0 (£ 0)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 0');         // Activity Pipeline
    cy.contains('0 : 0');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    //Deactivate

    cy.get('input[name="Performance Improvement Plan"]').click()

    //Activate
    cy.get('input[name="Non-Performance Improvement Plan"]').click()
    cy.contains('£ 20.13m');         // Invoiced YTD
    cy.contains('92 (£ 31k)');     // Cost Optimizations
    cy.contains('1');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 150m');         // Activity Pipeline
    cy.contains('4 : 5');           // Vendor CSAT
    cy.contains('6.3');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    //Deactivate

    cy.get('input[name="Non-Performance Improvement Plan"]').click()

    cy.get('svg[cy-data="filter_PIP_times"]').click();

    // --> End Filter by PIP <--

    // --> Collapse all filters <--
    cy.getByText('Filters').find('svg[data-icon="less-than"]').last().click({ force: true })
    cy.get('div[class="sk-layout__filters slideOut customBox"]').should('exist')
  });

  it('Use the search vendor filter', function () {
    cy.login(this.login.username, this.login.password, options);
    cy.visit('');

    // --> Filter by Vendor search
    cy.getByText('Vendor').find('svg').click()

    cy.getByText('Vendor').siblings().getByText('Select...').click()
    cy.getByText('Vendor').siblings().find('input').type('Vendor Tier 1', { force: true });

    cy
      .get('#react-select-2-option-0')
      .type('{enter}')

    cy.contains('£ 26k');         // Invoiced YTD
    cy.contains('12 (£ 10k)');     // Cost Optimizations
    cy.contains('1');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 50m');         // Activity Pipeline
    cy.contains('0 : 1');           // Vendor CSAT
    cy.contains('7.5');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('Vendor Tier 1: Contrato #1');

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('£ 50m');

    cy.getByText('Vendor Tier 1').siblings().find('svg').click()

    cy.getByText('Vendor').siblings().getByText('Select...').click()
    cy.getByText('Vendor').siblings().find('input').type('Vendor Tier 2', { force: true });

    cy
      .get('#react-select-2-option-0')
      .type('{enter}')

    cy.contains('£ 20m');         // Invoiced YTD
    cy.contains('12 (£ 9k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 40m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('Vendor Tier 2: Contrato #2');

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('£ 40m');

    cy.getByText('Vendor Tier 2').siblings().find('svg').click()


    cy.getByText('Vendor').siblings().getByText('Select...').click()
    cy.getByText('Vendor').siblings().find('input').type('Vendor Tier 3', { force: true });

    cy
      .get('#react-select-2-option-0')
      .type('{enter}')

    cy.contains('£ 10k');         // Invoiced YTD
    cy.contains('35 (£ 5k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 30m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('Vendor Tier 3: Contrato #3');

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('£ 30m');

    cy.getByText('Vendor Tier 3').siblings().find('svg').click()

    cy.getByText('Vendor').siblings().getByText('Select...').click()
    cy.getByText('Vendor').siblings().find('input').type('Vendor Tier 4', { force: true });

    cy
      .get('#react-select-2-option-0')
      .type('{enter}')

    cy.contains('£ 40k');         // Invoiced YTD
    cy.contains('23 (£ 2k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 20m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('Vendor Tier 4: Contrato #4');

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('£ 20m');

    cy.getByText('Vendor Tier 4').siblings().find('svg').click();

    cy.getByText('Vendor').find('svg').click();

    // --> End Filter by Vendor search <--
  });

  it('Use the BU owner filter', function () {
    cy.login(this.login.username, this.login.password, options);
    cy.visit('');

    // --> Filter by BU Owner search
    cy.getByText('BU Owner').find('svg').click()

    cy.getByText('BU Owner').siblings().getByText('Select...').click({ force: true })
    cy.getByText('BU Owner').siblings().find('input').type('Test BU', { force: true });

    cy
      .get('#react-select-3-option-0')
      .type('{enter}')

    cy.contains('£ 10k');         // Invoiced YTD
    cy.contains('35 (£ 5k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 30m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('Vendor Tier 3: Contrato #3');

    cy.getByText('Total Initiative Value (Proposed)')
      .siblings().contains('£ 30m');

    cy.getByText('Test BU').siblings().find('svg').click();

    cy.getByText('BU Owner').find('svg').click();

    // --> End Filter by BU Owner search <--
  });

  it('Test Vendor Manager filter', function () {
    cy.login(this.login.username, this.login.password, options);
    cy.visit('');

    // --> Filter by Vendor Manager search
    cy.getByText('Vendor Manager').find('svg').click()

    cy.getByText('Vendor Manager').siblings().getByText('Select...').click({ force: true })
    cy.getByText('Vendor Manager').siblings().find('input').type('Leandro Miranda', { force: true });

    cy
      .get('#react-select-4-option-0')
      .type('{enter}')

    cy.contains('£ 26k');         // Invoiced YTD
    cy.contains('12 (£ 10k)');     // Cost Optimizations
    cy.contains('1');          // Vendors Per SRM
    cy.contains('1 (100%)');      // Reviews YTD
    cy.contains('£ 50m');         // Activity Pipeline
    cy.contains('0 : 1');           // Vendor CSAT
    cy.contains('7.5');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Leandro Miranda').siblings().find('svg').click()
    cy.getByText('Vendor Manager').find('svg').click()

    // --> End Filter by Vendor Manager search <--
  });

  it('Tests the graphs', function () {
    cy.login(this.login.username, this.login.password, options);
    cy.visit('');

    // Home
    cy.location("pathname", { timeout: 10000 }).should("eq", "/home");
    cy.wait("@datahome");
    cy.contains('Total Initiative Value (Proposed)');
    cy.getByText('Vendor Tier 1: Contrato #1').parent().siblings().contains('£ 50m');
    cy.getByText('Vendor Tier 2: Contrato #2').parent().siblings().contains('£ 40m');
    cy.getByText('Vendor Tier 3: Contrato #3').parent().siblings().contains('£ 30m');
    cy.getByText('Vendor Tier 4: Contrato #4').parent().siblings().contains('£ 20m');
    cy.contains('Vendor Tier 5: Contrato #5 [Budgeted] £ 10m');
  });

  it('Creates new initiative', function () {
    cy.login(this.login.username, this.login.password, options);
    cy.visit('');

    cy.get('div[data-tip="Add Initiative"]').find('svg').click();

    cy.getByText('New Initiative').parent().siblings().find('select[name="vendorId"]')
      .select('Vendor Tier 5');

    cy.getByText('New Initiative').parent().siblings().find('input[name="name"]')
      .type('New Vendor Create').should("have.value", 'New Vendor Create');

    cy.getByText('New Initiative').parent().siblings().find('input[name="amount"]')
      .type('15').should("have.value", '15');

    cy.getByText('Start date').siblings().find('input').click();
    cy.getByText('OK').click();

    cy.getByText('End date').siblings().find('input').click();
    cy.get('h6').should('exist').then(($span) => {
      let year = $span.text();
      let nextYear = String(Number(year) + 1);

      cy.get('h6').click();
      cy.getByText(nextYear).click()

    });
    cy.getByText('OK').click({ force: true });
    cy.getByText('Save').parent().click({ force: true });

    cy.contains('Vendor Tier 5: New Vendor Create [Notional] £ 15m');

    cy.getByText('Vendor Tier').find('svg').click();

    //Active
    cy.get('input[name="5"]').click();
    cy.contains('£ 50k');         // Invoiced YTD
    cy.contains('10 (£ 5k)');     // Cost Optimizations
    cy.contains('1');              // Vendors Per SRM
    cy.contains('3 (75%)');      // Reviews YTD
    cy.contains('£ 25m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    //Deactive
    cy.get('input[name="5"]').click();

    cy.getByText('Vendor Tier').find('svg').click();
  });

  it('Edits an initiative', function () {
    cy.login(this.login.username, this.login.password, options);
    cy.visit('');
    cy.wait("@datahome");
    cy.getByText('Vendor Tier 5: New Vendor Create [Notional] £ 15m').parent().click({ force: true });

    cy.getByText('Edit Initiative').parent().siblings().find('input[name="name"]')
      .clear().type('New Vendor Edit').should("have.value", 'New Vendor Edit');

    cy.getByText('Edit Initiative').parent().siblings().find('input[name="amount"]')
      .clear().type('17').should("have.value", '17');

    cy.get('select[name="statusId"]').select('Business Case in hand');

    cy.getByText('Save').parent().click();

    cy.contains('Vendor Tier 5: New Vendor Edit [Business Case in hand] £ 17m')

  });

  it('Deletes an initiative', function () {
    cy.login(this.login.username, this.login.password, options);
    cy.visit('');
    cy.wait("@datahome");

    cy.getByText('Vendor Tier 5: New Vendor Edit [Business Case in hand] £ 17m').parent().click({ force: true });
    cy.getByText('Delete').parent().click();

    cy.contains('Vendor Tier 5: New Vendor Edit [Business Case in hand] £ 17m').not();

  });

  it('Filters in graph', function () {
    cy.login(this.login.username, this.login.password, options);
    cy.visit('');
    cy.wait("@datahome");

    cy.get('div[data-tip="Filter"]').find('svg').click();
    cy.getByText('Filter by status').siblings().children()
      .find('input').click({ force: true });

    cy.getByText('Filter by status').siblings().children()
      .find('input').type('Notional', { force: true }).should('have.value', 'Notional')
      .type('{enter}', { force: true });

    cy.contains('£ 26k');         // Invoiced YTD
    cy.contains('12 (£ 10k)');     // Cost Optimizations
    cy.contains('1');          // Vendors Per SRM
    cy.contains('7 (70%)');      // Reviews YTD
    cy.contains('£ 50m');         // Activity Pipeline
    cy.contains('0 : 1');           // Vendor CSAT
    cy.contains('6.3');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Filter by status').siblings().children()
      .find('svg').first().click();

    cy.getByText('Filter by status').siblings().children()
      .find('input').type('Business Case in hand', { force: true }).should('have.value', 'Business Case in hand')
      .type('{enter}', { force: true });

    cy.contains('£ 20m');         // Invoiced YTD
    cy.contains('12 (£ 9k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    // cy.contains('5 (84%)');      // Reviews YTD
    cy.contains('£ 40m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('6.3');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    cy.getByText('Filter by status').siblings().children()
      .find('svg').first().click();
  });

  it('Changes the KPIs', function () {
    cy.login(this.login.username, this.login.password, options);
    cy.visit('');

    //Modify Vendor Tier 3
    cy.get('[href="/vendor"]').click();

    cy.getByText('Vendor Tier 3').click({ force: true })

    cy.get('[href="/vendor/3/profile"]').click();

    cy.getByText('Total Cost Optimizations').siblings().find('input')
      .clear().type('10000');

    cy.getByText('Number of cost optimizations').siblings().find('input')
      .clear().type('14');

    cy.getByText('Save').click();

    cy.get('[href="/home"]').click();

    cy.getByText('Vendor Tier').find('svg').click();

    //Active
    cy.get('input[name="3"]').click();
    cy.contains('£ 10k');         // Invoiced YTD
    cy.contains('14 (£ 10k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    cy.contains('1 (50%)');      // Reviews YTD
    cy.contains('£ 30m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    //Deactive
    cy.get('input[name="3"]').click();
    cy.getByText('Vendor Tier').find('svg').click();

    //Modify Vendor Tier 4
    cy.get('[href="/vendor"]').click();

    cy.getByText('Vendor Tier 4').click({ force: true })

    cy.get('[href="/vendor/4/profile"]').click();

    cy.getByText('Invoiced YTD').siblings().find('input')
      .clear().type('30000');

    cy.getByText('Save').click();

    cy.get('[href="/home"]').click();

    cy.getByText('Vendor Tier').find('svg').click();

    //Active
    cy.get('input[name="4"]').click();
    cy.contains('£ 30k');         // Invoiced YTD
    cy.contains('23 (£ 2k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    cy.contains('1 (100%)');      // Reviews YTD
    cy.contains('£ 20m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    //Deactive
    cy.get('input[name="4"]').click();
    cy.getByText('Vendor Tier').find('svg').click();
  });

  it('Return to original KPIs', function () {
    cy.login(this.login.username, this.login.password, options);
    cy.visit('');

    //Return to original Vendor Tier 3

    cy.get('[href="/vendor"]').click();

    cy.getByText('Vendor Tier 3').click({ force: true })

    cy.get('[href="/vendor/3/profile"]').click();

    cy.getByText('Total Cost Optimizations').siblings().find('input')
      .clear().type('5000');

    cy.getByText('Number of cost optimizations').siblings().find('input')
      .clear().type('35');

    cy.getByText('Save').click();

    cy.get('[href="/home"]').click();

    cy.getByText('Vendor Tier').find('svg').click();

    //Active
    cy.get('input[name="3"]').click();
    cy.contains('£ 10k');         // Invoiced YTD
    cy.contains('35 (£ 5k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    cy.contains('1 (50%)');      // Reviews YTD
    cy.contains('£ 30m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    //Deactive
    cy.get('input[name="3"]').click();
    cy.getByText('Vendor Tier').find('svg').click();

    //Return to original Vendor Tier 4
    cy.get('[href="/vendor"]').click();

    cy.getByText('Vendor Tier 4').click({ force: true })

    cy.get('[href="/vendor/4/profile"]').click();

    cy.getByText('Invoiced YTD').siblings().find('input')
      .clear().type('40000');

    cy.getByText('Save').click();

    cy.get('[href="/home"]').click();

    cy.getByText('Vendor Tier').find('svg').click();

    //Active
    cy.get('input[name="4"]').click();
    cy.contains('£ 40k');         // Invoiced YTD
    cy.contains('23 (£ 2k)');     // Cost Optimizations
    cy.contains('0');          // Vendors Per SRM
    cy.contains('1 (100%)');      // Reviews YTD
    cy.contains('£ 20m');         // Activity Pipeline
    cy.contains('1 : 1');           // Vendor CSAT
    cy.contains('0');             // Vendors Score
    cy.contains('0');             // Checkpoints Closed

    //Deactive
    cy.get('input[name="4"]').click();
    cy.getByText('Vendor Tier').find('svg').click();

  });
});