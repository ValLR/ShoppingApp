/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(username?: string, password?: string): Chainable<Element>;
    createList(listName: string): Chainable<Element>;
  }
}

// COMMAND: Login
Cypress.Commands.add('login', (username = 'ValentinaTest', password = '123') => {
  cy.url().then((url) => {
    if (!url.includes('/login')) {
      cy.visit('/login');
    }
  });

  cy.get('ion-input[name="username"] input').clear().type(username, { force: true });
  cy.get('ion-input[name="password"] input').clear().type(password, { force: true });
  
  cy.contains('Ingresar').click({ force: true });
});

// COMMAND: Create List
Cypress.Commands.add('createList', (listName) => {
  cy.contains('ion-button', 'Crear').click({ force: true }); 
  
  cy.get('ion-alert').should('be.visible');
  cy.get('ion-alert input.alert-input').type(listName, { force: true });
  cy.get('ion-alert button').contains('Crear').click({ force: true });
});
