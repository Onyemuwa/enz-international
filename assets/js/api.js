// Three modes, tried in this order — same contract as the React version's
// src/lib/api.js:
// 1. Real backend (config.API_BASE_URL set) — talks to ../../server/.
// 2. Web3Forms (config.WEB3FORMS_ACCESS_KEY set) — no backend at all, forms
//    email straight to your inbox. See config.js for setup.
// 3. Mock mode (neither set) — forms work locally, nothing is sent.
//
// ---------------------------------------------------------------------------
// MOCK MODE IS LOCAL-ONLY, AND THAT IS DELIBERATE.
// ---------------------------------------------------------------------------
// Mock mode resolves successfully, so the form shows "thanks, we'll be in
// touch within 24h" and nothing is sent anywhere. That is exactly what you
// want while developing, and the worst possible behaviour on a live site: a
// real buyer types a real enquiry, is told it arrived, and it goes nowhere.
// There is no error for anyone to notice — not the sender, not the owner.
//
// So mock mode now refuses to run off localhost. On a deployed host with
// neither backend configured, submissions reject with `notConfigured`, and
// site.js turns that into a visible "email us directly" fallback. A visitor
// who wants to reach you still can; they are never quietly dropped.
// ---------------------------------------------------------------------------
window.ENZ_API = (function () {
  var BASE = window.ENZ_CONFIG.API_BASE_URL;
  var WEB3FORMS_KEY = window.ENZ_CONFIG.WEB3FORMS_ACCESS_KEY;
  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  var MOCK_DELAY_MS = 700;

  function isLocalPreview() {
    return (
      location.protocol === 'file:' ||
      /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname) ||
      /\.local$/.test(location.hostname)
    );
  }

  function notConfigured() {
    var err = new Error('No form delivery configured (see assets/js/config.js)');
    err.notConfigured = true;
    return Promise.reject(err);
  }

  function mockResolve(payload) {
    // The guard lives here rather than at each call site so a future endpoint
    // cannot forget it.
    if (!isLocalPreview()) return notConfigured();
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

  function submitToWeb3Forms(payload) {
    return fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.assign({ access_key: WEB3FORMS_KEY }, payload)),
    }).then(function (res) {
      return res.json().then(function (body) {
        if (!res.ok || !body.success) throw new Error(body.message || 'Request failed');
        return body;
      });
    });
  }

  function submitFileToWeb3Forms(formData) {
    formData.append('access_key', WEB3FORMS_KEY);
    return fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body: formData }).then(function (res) {
      return res.json().then(function (body) {
        if (!res.ok || !body.success) throw new Error(body.message || 'Request failed');
        return body;
      });
    });
  }

  return {
    isMockMode: !BASE && !WEB3FORMS_KEY,

    submitBooking: function (data) {
      if (BASE) return request('/api/bookings', { method: 'POST', body: JSON.stringify(data) });
      if (WEB3FORMS_KEY) {
        return submitToWeb3Forms(
          Object.assign({ subject: 'New consultation request — ' + data.name, from_name: data.name }, data)
        ).then(function () {
          return { id: 'w3f_' + Date.now(), status: 'received' };
        });
      }
      return mockResolve({ id: 'mock_' + Date.now(), status: 'received' });
    },

    subscribeNewsletter: function (email) {
      if (BASE) return request('/api/newsletter', { method: 'POST', body: JSON.stringify({ email: email }) });
      if (WEB3FORMS_KEY) {
        return submitToWeb3Forms({ subject: 'New newsletter subscriber', from_name: email, email: email }).then(
          function () {
            return { status: 'subscribed' };
          }
        );
      }
      return mockResolve({ status: 'subscribed' });
    },

    submitCvApplication: function (formData) {
      if (BASE) {
        return fetch(BASE + '/api/careers/applications', { method: 'POST', body: formData }).then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          return res.json();
        });
      }
      if (WEB3FORMS_KEY) {
        formData.append('subject', 'New CV submission — ' + formData.get('name'));
        return submitFileToWeb3Forms(formData).then(function () {
          return { id: 'w3f_' + Date.now(), status: 'received' };
        });
      }
      return mockResolve({ id: 'mock_' + Date.now(), status: 'received' });
    },
  };
})();
