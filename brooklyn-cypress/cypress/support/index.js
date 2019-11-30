// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

export const options = {
    Auth: {
      // Amazon Cognito Identity Pool ID
      identityPoolId: Cypress.env('identity_pool_id'),
      // Amazon Cognito Region
      region: Cypress.env("aws_region"),
      // Amazon Cognito User Pool ID
      userPoolId: Cypress.env("user_pool_id"),
      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: Cypress.env("user_pool_app_id"),
      // Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false
    }
  };
