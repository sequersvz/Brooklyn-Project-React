describe('Login page', function () {
  beforeEach(() => {
    cy.fixture("users/login").as("login");
  });

  it('Should be able to login to the page', function () {
    
    cy.visit('');
    // Login
    cy.contains('Sign in to your account');

    cy
      .get('input[name="username"]')
      .type(this.login.username)
      .should("have.value", this.login.username);

    cy
      .get('input[name="password"]')
      .type(this.login.password)
      .should("have.value", this.login.password);

    cy.get('button').click();
    cy.location("pathname", {timeout: 10000}).should("eq", "/home");
  });
});