const pause = (ms = 1200) => cy.wait(ms);

describe('E2E: Complete User Flow (Demo)', () => {

  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage?.();
    cy.viewport(393, 851);
    cy.visit('http://localhost:8100');
    pause(1500);
  });

  it('Registers, logs in, manages lists and logs out', () => {
    // Registration
    cy.contains('Registrarse', { timeout: 10000 })
      .should('be.visible')
      .click();
    pause(800);

    cy.url().should('include', '/register');
    pause(500);

    cy.get('ion-input[formControlName="usuario"] input')
      .type('ValentinaTest', { force: true });
    pause(800);

    cy.get('ion-input[formControlName="password"] input')
      .type('1234', { force: true });
    pause(800);

    cy.get('ion-input[formControlName="confirmPassword"] input')
      .type('1234', { force: true });
    pause(800);

    cy.get('ion-select[formControlName="region"]').then(($sel) => {
      const el = $sel[0] as any;
      el.value = 'valparaiso';
      el.dispatchEvent(new CustomEvent('ionChange', {
        detail: { value: 'valparaiso' },
        bubbles: true,
        composed: true,
      }));
    });

    cy.get('ion-select[formControlName="region"]').should(($el) => {
      expect(($el[0] as any).value).to.eq('valparaiso');
    });
    pause(1200);

    cy.get('#open-date-modal').click({ force: true });
    pause(1200);

    cy.get('ion-modal.datetime-modal', { timeout: 10000 })
      .should('be.visible');
    pause(800);

    cy.get('ion-modal.datetime-modal ion-datetime').then(($dt) => {
      const el = $dt[0] as any;
      el.value = '2001-05-10';
      el.dispatchEvent(new CustomEvent('ionChange', {
        detail: { value: '2001-05-10' },
        bubbles: true,
        composed: true,
      }));
    });
    pause(800);

    cy.get('ion-modal.datetime-modal ion-datetime')
      .shadow()
      .contains('Confirmar')
      .click({ force: true });
    pause(1200);

    cy.get('ion-modal.datetime-modal')
      .should('have.class', 'overlay-hidden');
    pause(1000);

    cy.contains('ion-button', 'REGISTRARME', { timeout: 10000 })
      .should('be.visible')
      .should(($btn) => {
        expect($btn).to.not.have.attr('disabled');
      })
      .then(($btn) => {
        cy.wrap($btn).click({ force: true });
      });

    pause(2000);
    cy.url({ timeout: 15000 }).should('include', '/login');
    pause(200);

    // Login
    cy.get('ion-input[name="username"] input')
      .type('ValentinaTest', { force: true });
    pause(800);

    cy.get('ion-input[name="password"] input')
      .type('1234', { force: true });
    pause(800);

    cy.contains('Ingresar')
      .click({ force: true });
    pause(2000);

    cy.url({ timeout: 15000 }).should('include', '/home');
    cy.contains('Mis Listas').should('be.visible');
    pause(500);

    // Create list
    cy.contains('Crear una lista')
      .click({ force: true });
    pause(1200);

    cy.get('ion-alert').should('be.visible');
    pause(800);

    cy.get('ion-alert input.alert-input')
      .type('Lista Prueba', { force: true });
    pause(800);

    cy.get('ion-alert button')
      .contains('Crear')
      .click({ force: true });
    pause(1500);

    cy.contains('Lista Prueba')
      .should('be.visible')
      .click({ force: true });
    pause(800);

    // Add item
    cy.get('ion-input[placeholder="Ej: Leche, Pan..."] input')
      .type('Pizza', { force: true });
    pause(800);

    cy.get('ion-icon[name="add-circle"]')
      .click({ force: true });
    pause(1200);

    cy.contains('Pizza').should('be.visible');
    pause(500);

    cy.get('ion-back-button')
      .click({ force: true });
    pause(500);

    // Profile and logout
    cy.get('ion-icon[name="person-circle-outline"]')
      .click({ force: true });
    pause(1000);

    cy.contains('Mi Perfil').should('be.visible');
    pause(1000);

    cy.contains('Cerrar sesión')
      .click({ force: true });
    pause(1500);

    cy.url({ timeout: 15000 }).should('include', '/login');
    pause(200);
  });

it('Must manage unexistant routes (404)', () => {
    cy.clearAllLocalStorage();
    cy.window().then((win) => win.localStorage.clear());

    cy.visit('http://localhost:8100/ruta-falsa-123');
    
    cy.wait(2000); 
    cy.contains('Ups', { timeout: 10000 }).should('exist');

    cy.contains('Volver al Inicio').click({ force: true });
    cy.url({ timeout: 15000 }).should('include', '/login');
  });

});
