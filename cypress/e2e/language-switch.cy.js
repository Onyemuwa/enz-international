describe('Language switching', () => {
  it('switches the whole UI to French via the header selector and updates the URL', () => {
    cy.visit('/en');
    cy.get('#lang-select-desktop').select('fr');
    cy.location('pathname').should('eq', '/fr');
    cy.contains('a', 'Accueil').should('be.visible');
    cy.get('h1').should('contain.text', 'Approvisionnement mondial');
  });

  it('preserves the current page when switching language', () => {
    cy.visit('/en/services');
    cy.get('#lang-select-desktop').select('zh');
    cy.location('pathname').should('eq', '/zh/services');
  });
});
