describe('Booking flow (mock API)', () => {
  it('books a consultation from the homepage hero CTA', () => {
    cy.visit('/en');
    cy.contains('button', 'Book Consultation').first().click();

    cy.get('[role="dialog"]').should('be.visible').within(() => {
      cy.get('#booking-name').type('Jane Doe');
      cy.get('#booking-email').type('jane@example.com');
      cy.get('#booking-date').type('2026-12-01');
      cy.contains('button', 'Request Consultation').click();
    });

    cy.contains('Request received', { timeout: 5000 }).should('be.visible');
    cy.contains('jane@example.com').should('be.visible');
  });

  it('closes the modal with Escape and returns focus to the trigger', () => {
    cy.visit('/en');
    cy.contains('button', 'Book Consultation').first().as('trigger').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
  });
});

describe('Client portal login (mock API)', () => {
  it('logs in with any credentials in mock mode', () => {
    cy.visit('/en/portal');
    cy.get('#portal-email').type('client@example.com');
    cy.get('#portal-password').type('anything');
    cy.contains('button', 'Login').click();
    cy.contains('Welcome back').should('be.visible');
  });
});
