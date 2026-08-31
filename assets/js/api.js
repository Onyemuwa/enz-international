// Four delivery paths, tried in this order. The first one configured wins:
//
//   1. API_BASE_URL         your own backend in ../../server/
//   2. WEB3FORMS_ACCESS_KEY relayed to your inbox, needs a free key
//   3. FORMSUBMIT_EMAIL     relayed to your inbox, needs no key at all
//   4. nothing configured   opens the visitor's own mail app, pre-written
//
// Paths 1-3 are automatic: the visitor presses Submit and the enquiry arrives
// in the inbox with nobody else doing anything. Path 4 is a handoff — the
// visitor still has to press send in their mail app.
//
// ---------------------------------------------------------------------------
// EVERY AUTOMATIC PATH FALLS BACK TO THE HANDOFF
// ---------------------------------------------------------------------------
// A form once resolved successfully and sent nothing, so it said "thanks,
// we'll be in touch within 24h" while the enquiry reached nobody — and nothing
// surfaced for either side to notice. That failure mode is the one thing this
// file exists to prevent.
//
// So an automatic send that fails for any reason — offline visitor, ad blocker
// eating a third-party POST, relay having a bad day, address not yet activated
// — does not show an error and drop the enquiry. It falls through to the mail
// client, which is the one path that cannot fail quietly, and the success copy
// switches from "we'll be in touch" to "press send" so the visitor is never
// told a message is on its way when it is sitting in a drafts window.
//
// We only ever claim what we can actually know happened.
// ---------------------------------------------------------------------------
window.ENZ_API = (function () {
  var BASE = window.ENZ_CONFIG.API_BASE_URL;
  var WEB3FORMS_KEY = window.ENZ_CONFIG.WEB3FORMS_ACCESS_KEY;
  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  var FORMSUBMIT_EMAIL = window.ENZ_CONFIG.FORMSUBMIT_EMAIL;
  var FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/';

  var CONTACT_EMAIL = window.ENZ_CONFIG.CONTACT_EMAIL || '';

  // True when some path will deliver the submission on its own, with nobody
  // pressing send in a mail app.
  var AUTOMATIC = !!(BASE || WEB3FORMS_KEY || FORMSUBMIT_EMAIL);

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

  // FormSubmit relays a submission to FORMSUBMIT_EMAIL with no key and no
  // account. The address has to be confirmed once, from the first submission
  // — see the activation note in config.js.
  //
  // The underscore-prefixed fields are FormSubmit's own controls rather than
  // data: _subject sets the email subject, _template asks for the readable
  // table layout instead of a raw dump, and _captcha turns off the interstitial
  // challenge, which would otherwise strand a visitor who never sees it
  // because this is an AJAX post.
  function submitToFormSubmit(subject, payload) {
    var body = Object.assign({ _subject: subject, _template: 'table', _captcha: 'false' }, payload);
    return fetch(FORMSUBMIT_ENDPOINT + encodeURIComponent(FORMSUBMIT_EMAIL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    }).then(function (res) {
      return res
        .json()
        .catch(function () {
          throw new Error('Unexpected response from the form service');
        })
        .then(function (data) {
          // success comes back as either true or the string "true".
          if (!res.ok || !(data.success === true || data.success === 'true')) {
            throw new Error(data.message || 'Request failed (' + res.status + ')');
          }
          return data;
        });
    });
  }

  // Runs an automatic send, and if it fails for any reason falls back to the
  // visitor's mail client.
  //
  // This is the whole point of the wrapper: a blocked request, an offline
  // visitor, an ad blocker eating a third-party POST, or the relay having a bad
  // day would otherwise end with an error message and a lost enquiry. Instead
  // the enquiry is handed to the one mail path that cannot fail silently, and
  // the success copy switches to "press send" so nobody is told the message is
  // on its way when it is sitting in a drafts window.
  function autoSendOrHandOff(send, subject, fields) {
    return send().catch(function () {
      return openMailClient(subject, fields);
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
    isMockMode: false,
    isAutomatic: AUTOMATIC,

    submitBooking: function (data) {
      var subject = 'Consultation request — ' + (data.name || 'website enquiry');
      // Field order is deliberate — see openMailClient.
      var fields = {
        Name: data.name,
        Email: data.email,
        Phone: data.phone,
        Company: data.company,
        'Preferred date': data.date,
        Service: data.service,
        Message: data.message,
      };

      if (BASE) {
        return autoSendOrHandOff(
          function () {
            return request('/api/bookings', { method: 'POST', body: JSON.stringify(data) });
          },
          subject,
          fields
        );
      }
      if (WEB3FORMS_KEY) {
        return autoSendOrHandOff(
          function () {
            return submitToWeb3Forms(
              Object.assign({ subject: subject, from_name: data.name }, data)
            ).then(function () {
              return { id: 'w3f_' + Date.now(), status: 'received' };
            });
          },
          subject,
          fields
        );
      }
      if (FORMSUBMIT_EMAIL) {
        return autoSendOrHandOff(
          function () {
            return submitToFormSubmit(subject, fields).then(function () {
              return { id: 'fs_' + Date.now(), status: 'received' };
            });
          },
          subject,
          fields
        );
      }
      return openMailClient(subject, fields);
    },

    subscribeNewsletter: function (email) {
      var subject = 'Newsletter signup';
      var fields = { Email: email };

      if (BASE) {
        return autoSendOrHandOff(
          function () {
            return request('/api/newsletter', { method: 'POST', body: JSON.stringify({ email: email }) });
          },
          subject,
          fields
        );
      }
      if (WEB3FORMS_KEY) {
        return autoSendOrHandOff(
          function () {
            return submitToWeb3Forms({ subject: 'New newsletter subscriber', from_name: email, email: email }).then(
              function () {
                return { status: 'subscribed' };
              }
            );
          },
          subject,
          fields
        );
      }
      if (FORMSUBMIT_EMAIL) {
        return autoSendOrHandOff(
          function () {
            return submitToFormSubmit('New newsletter subscriber', fields).then(function () {
              return { status: 'subscribed' };
            });
          },
          subject,
          fields
        );
      }
      return openMailClient(subject, fields);
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
      // Note there is no FormSubmit branch here on purpose. Its AJAX endpoint
      // takes JSON, not a file, so a CV posted to it would be dropped while
      // the visitor was told the application went through. A backend or a
      // Web3Forms key both handle the upload properly; without one of those,
      // asking for the file as an attachment is the honest option.
      //
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
