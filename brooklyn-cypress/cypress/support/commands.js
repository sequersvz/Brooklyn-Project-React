// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
import 'cypress-testing-library/add-commands';

import Amplify, { Auth } from 'aws-amplify';

Cypress.Commands.add("login", (email, password, options) => {
    Amplify.configure(options);
    return Auth.signIn(email, password)
        .then(user => {
            console.log('===> user', user);
            let session = Auth.currentSession();
            console.log('===> session', session);
        })
        .catch(err => console.log('===> err', err));
});

Cypress.Commands.add("createReviewItem", (title) => {

    cy.getByTestId('newReviewItemButton').trigger('mouseover');
    cy.wait(2000);
    cy.getByTestId('newReviewItemButton').find('div[data-tip="Review item"]').click();
    cy.wait(5000);
    cy.getByText('Click to edit').click({ force: true });
    cy.wait(5000);
    cy.focused().type(title, { delay: 100 }).blur();
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
