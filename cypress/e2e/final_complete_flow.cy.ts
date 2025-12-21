describe('Final Complete User Flows', () => {

  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage?.();
    cy.viewport(393, 851);
    cy.visit('http://localhost:8100');
  });

  // TEST 1: Registration Flow
  it('Should register a new user successfully', () => {
    cy.contains('Registrarse', { timeout: 10000 }).should('be.visible').click();
    cy.url().should('include', '/register');

    cy.get('ion-input[formControlName="usuario"] input').type('ValentinaTest', { force: true });
    cy.get('ion-input[formControlName="password"] input').type('1234', { force: true });
    cy.get('ion-input[formControlName="confirmPassword"] input').type('1234', { force: true });

    cy.get('ion-select[formControlName="region"]').then(($sel) => {
      const el = $sel[0] as any;
      el.value = 'valparaiso';
      el.dispatchEvent(new CustomEvent('ionChange', { detail: { value: 'valparaiso' }, bubbles: true, composed: true }));
    });

    cy.get('#open-date-modal').click({ force: true });
    cy.get('ion-modal.datetime-modal ion-datetime').then(($dt) => {
      const el = $dt[0] as any;
      el.value = '2001-05-10';
      el.dispatchEvent(new CustomEvent('ionChange', { detail: { value: '2001-05-10' }, bubbles: true, composed: true }));
    });
    cy.get('ion-modal.datetime-modal ion-datetime').shadow().contains('Confirmar').click({ force: true });

    cy.contains('ion-button', 'REGISTRARME').click({ force: true });
    cy.url({ timeout: 15000 }).should('include', '/login');
  });

  // TEST 2: Main Flow (Login -> API Check -> Create List -> Logout)
  it('Should login, load API data, create a list and add items', () => {    
    cy.login('ValentinaTest', '1234');

    cy.url({ timeout: 15000 }).should('include', '/home');
    cy.contains('Mis Listas').should('be.visible');
    cy.contains('h3', 'Ideas para cocinar').should('be.visible');
    
    cy.get('.category-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

    const listName = 'Cypress List';
    cy.createList(listName);

    cy.contains(listName).should('be.visible').click({ force: true });

    cy.get('ion-input[placeholder*="Ej:"]').find('input').type('Pizza', { force: true });
    cy.get('ion-icon[name="add-circle"]').click({ force: true });
    
    cy.contains('Pizza').should('be.visible');

    cy.get('ion-back-button').click({ force: true });
    cy.get('ion-icon[name="person-circle-outline"]').click({ force: true });
    cy.contains('Cerrar sesión').click({ force: true });    
    cy.url().should('include', '/login');
  });

  // TEST 3: Error Handling
  it('Should handle non-existent routes (404)', () => {
    cy.window().then((win) => win.localStorage.clear());
    
    cy.visit('http://localhost:8100/fake-route-test');
    
    cy.contains('Ups', { timeout: 10000 }).should('exist');
    
    cy.contains('Volver al Inicio').click({ force: true });
    cy.url({ timeout: 15000 }).should('include', '/login');
  });
});
