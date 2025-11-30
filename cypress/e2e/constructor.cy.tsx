/// <reference types="cypress" />

describe('add ingredients to constructor works properly', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  it('should add a bun', () => {
    cy.get('[data-cy=bun-ingredient]').contains('Добавить').click();
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Ingredient 1')
      .should('exist');
  });

  it('should add a main', () => {
    cy.get('[data-cy=main-ingredient]').contains('Добавить').click();
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Ingredient 2')
      .should('exist');
  });

  it('should add a sauce', () => {
    cy.get('[data-cy=sauce-ingredient]').contains('Добавить').click();
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Ingredient 3')
      .should('exist');
  });
});

describe('modal tests', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  it('should open the correct modal', () => {
    cy.contains('Ingredient 1').click({ force: true });
    cy.get('[data-cy=modal]').contains('Ingredient 1').should('be.visible');
  });

  it('should close the modal by click on the "Close" button', () => {
    cy.contains('Ingredient 1').click({ force: true });
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('should close the modal by click on the overlay', () => {
    cy.contains('Ingredient 1').click();
    cy.get('[data-cy=modal-close-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });
});

describe('order test', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' });

    window.localStorage.setItem('refreshToken', 'mockRefreshToken');
    cy.setCookie('accessToken', 'mockAccessToken');
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearCookies();
  });

  it('should place an order', () => {
    // making a burger in a constructor
    cy.get('[data-cy=bun-ingredient]').contains('Добавить').click();
    cy.get('[data-cy=main-ingredient]').contains('Добавить').click();

    // clicking the Order button and checking the order number
    cy.get('[data-cy=order-button]').click();
    cy.get('[data-cy=order-number]').contains('123456').should('exist');
  });
});
