// Three modes, tried in this order — same contract as the React version's
// src/lib/api.js:
// 1. Real backend (config.API_BASE_URL set) — talks to ../../server/.
// 2. Web3Forms (config.WEB3FORMS_ACCESS_KEY set) — no backend at all, forms
//    email straight to your inbox. See config.js for setup.
// 3. Neither set — the submission opens the visitor's own email client.
//
// ---------------------------------------------------------------------------
// WHY THE THIRD PATH IS A MAILTO HANDOFF AND NOT A MOCK
// ---------------------------------------------------------------------------
// This used to resolve successfully and send nothing, so the form said
// "thanks, we'll be in touch within 24h" while the enquiry reached nobody.
// No error surfaced for anyone to notice: not the sender, not the owner.
//
// So there is a fourth path, and it is the one that runs today: with neither
// backend configured, a submission opens the visitor's own email client with
// the enquiry already written — recipient, subject and body filled in from the
// form. They press send in their mail app and it lands in your inbox.
//
// This needs no key, no backend and no account, so the forms work the moment
// the site is hosted. Two honest limits: the visitor has to press send
// themselves, so it is a handover rather than a silent submission, and a
// device with no mail client configured will do nothing visible. The success
// screen therefore says "we've opened your email app — press send", never
// "thanks, we'll be in touch", because we cannot know that they sent it.
//
// Setting WEB3FORMS_ACCESS_KEY still upgrades every form to a true background
// submission. This is the floor, not the ceiling.
// ---------------------------------------------------------------------------
window.ENZ_API = (function () {
  var BASE = window.ENZ_CONFIG.API_BASE_URL;
  var WEB3FORMS_KEY = window.ENZ_CONFIG.WEB3FORMS_ACCESS_KEY;
  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  var CONTACT_EMAIL = window.ENZ_CONFIG.CONTACT_EMAIL || '';

  // Builds a mailto: URL and hands off to the visitor's mail client.
  //
  // Field order is deliberate: whatever a mail client truncates, the name and
  // the contact details survive, because a reply is impossible without them.
  function openMailClient(subject, fields) {
    var lines = [];
    Object.keys(fields).forEach(function (label) {
      var value = fields[label];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        lines.push(label + ': ' + value);
      }
    });
    var body = lines.join('\r\n');
    // ~1900 chars keeps the whole URL inside the shortest limit in practice
    // (older Windows mail handlers cut off around 2000).
    if (body.length > 1900) body = body.slice(0, 1900) + '\r\n[...]';
    var url =
      'mailto:' + encodeURIComponent(CONTACT_EMAIL) +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    return new Promise(function (resolve, reject) {
      if (!CONTACT_EMAIL) {
        var e = new Error('No contact email configured');
        e.notConfigured = true;
        reject(e);
        return;
      }
      try {
        window.location.href = url;
      } catch (err) {
        var e2 = new Error('Could not open a mail client');
        e2.notConfigured = true;
        reject(e2);
        return;
      }
      // Resolve with a flag so the UI can say "we opened your email app"
      // rather than claiming the message was sent.
      resolve({ handedOffToMailClient: true });
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
      return openMailClient('Consultation request — ' + (data.name || 'website enquiry'), {
        Name: data.name,
        Email: data.email,
        Phone: data.phone,
        Company: data.company,
        'Preferred date': data.date,
        Service: data.service,
        Message: data.message,
      });
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
      return openMailClient('Newsletter signup', { Email: email });
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
      // A CV cannot travel in a mailto: body, so this one asks for the file
      // to be attached rather than pretending it was uploaded.
      return openMailClient('CV submission — ' + (formData.get('name') || ''), {
        Name: formData.get('name'),
        Email: formData.get('email'),
        Message: formData.get('message'),
        'Please attach': 'your CV to this email before sending',
      });
    },
  };
})();
