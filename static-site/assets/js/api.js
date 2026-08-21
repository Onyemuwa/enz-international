// Mock-first API client — same contract as the React version's src/lib/api.js.
// See ../../server/README.md for the real backend this talks to when configured.
window.ENZ_API = (function () {
  var BASE = window.ENZ_CONFIG.API_BASE_URL;
  var MOCK_DELAY_MS = 700;

  function mockResolve(payload) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(payload);
      }, MOCK_DELAY_MS);
    });
  }

  function request(path, options) {
    return fetch(BASE + path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, options)).then(
      function (res) {
        if (!res.ok) {
          return res
            .json()
            .catch(function () {
              return {};
            })
            .then(function (body) {
              throw new Error(body.message || 'Request failed (' + res.status + ')');
            });
        }
        return res.json();
      }
    );
  }

  return {
    isMockMode: !BASE,

    submitBooking: function (data) {
      if (!BASE) return mockResolve({ id: 'mock_' + Date.now(), status: 'received' });
      return request('/api/bookings', { method: 'POST', body: JSON.stringify(data) });
    },

    subscribeNewsletter: function (email) {
      if (!BASE) return mockResolve({ status: 'subscribed' });
      return request('/api/newsletter', { method: 'POST', body: JSON.stringify({ email: email }) });
    },

    portalLogin: function (email, password) {
      if (!BASE) return mockResolve({ token: 'mock-token', user: { name: email.split('@')[0], email: email } });
      return request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: email, password: password }) });
    },

    submitCvApplication: function (formData) {
      if (!BASE) return mockResolve({ id: 'mock_' + Date.now(), status: 'received' });
      return fetch(BASE + '/api/careers/applications', { method: 'POST', body: formData }).then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      });
    },
  };
})();
