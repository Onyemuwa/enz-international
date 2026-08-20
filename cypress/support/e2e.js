// Every cy.visit() pre-accepts the cookie-consent banner (essential-only) so
// it doesn't obscure the page in specs that aren't specifically testing it —
// mirrors a returning visitor, not a first-time one.
Cypress.Commands.overwrite('visit', (originalFn, url, options = {}) => {
  return originalFn(url, {
    ...options,
    onBeforeLoad(win) {
      win.localStorage.setItem('enz_cookie_consent', 'essential');
      options.onBeforeLoad?.(win);
    },
  });
});
