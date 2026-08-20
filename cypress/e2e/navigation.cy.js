describe('Navigation', () => {
  it('redirects the bare domain to the default language', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/en');
    cy.get('h1').should('contain.text', 'Global Sourcing');
  });

  it('navigates to Services and Insights via the header', () => {
    cy.visit('/en');
    cy.get('nav[aria-label="Primary"]').first().contains('Services').click();
    cy.location('pathname').should('eq', '/en/services');
    cy.get('h1').should('contain.text', 'Core Services');

    cy.get('nav[aria-label="Primary"]').first().contains('Insights').click();
    cy.location('pathname').should('eq', '/en/insights');
  });

  it('opens an insight post and links back to the list', () => {
    cy.visit('/en/insights');
    cy.contains('a', 'Read more').first().click();
    cy.location('pathname').should('include', '/en/insights/');
    cy.contains('a', 'Back to Insights').click();
    cy.location('pathname').should('eq', '/en/insights');
  });

  it('shows a 404 page for an unknown path', () => {
    cy.visit('/en/this-page-does-not-exist', { failOnStatusCode: false });
    cy.contains('404').should('be.visible');
    cy.contains('a', 'Back to homepage').click();
    cy.location('pathname').should('eq', '/en');
  });
});
