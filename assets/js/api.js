// Delivery paths, tried in this order until one succeeds:
//
//   1. own backend       server/ (Express + SQLite), same origin or API_BASE_URL
//   2. Web3Forms         relayed to your inbox, needs a free key
//   3. FormSubmit        relayed to your inbox, needs no key
//   4. the visitor's mail app, pre-written
//
// Paths 1-3 are automatic: the visitor presses Submit and the enquiry arrives
// with nobody else doing anything. Path 4 is a handoff — the visitor still has
// to press send in their mail app.
//
// ---------------------------------------------------------------------------
// EVERY PATH FAILS OVER TO THE NEXT, AND THE LAST IS THE MAIL APP
// ---------------------------------------------------------------------------
// A form once resolved successfully and sent nothing, so it said "thanks,
// we'll be in touch within 24h" while the enquiry reached nobody — and nothing
// surfaced for either side to notice. That failure mode is the one thing this
// file exists to prevent.
//
// So a send that fails for any reason — offline visitor, ad blocker eating a
// request, backend restarting, a relay having a bad day — does not show an
// error and drop the enquiry. It moves to the next configured path, and if
// every automatic path fails it opens the visitor's mail client, the one path
// that cannot fail quietly. The success copy then switches from "we'll be in
// touch" to "press send", so the visitor is never told a message is on its way
// when it is sitting in a drafts window.
//
// We only ever claim what we can actually know happened.
// ---------------------------------------------------------------------------
window.ENZ_API = (function () {
  var cfg = window.ENZ_CONFIG || {};
  var BASE = String(cfg.API_BASE_URL || '').replace(/\/+$/, '');
  // Same-origin means relative URLs: BASE stays '' and '/api/...' resolves
  // against whichever host served the page.
  var OWN_BACKEND = !!(BASE || cfg.API_SAME_ORIGIN);
  var WEB3FORMS_KEY = cfg.WEB3FORMS_ACCESS_KEY;
  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  var FORMSUBMIT_EMAIL = cfg.FORMSUBMIT_EMAIL;
  var FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/';
  var CONTACT_EMAIL = cfg.CONTACT_EMAIL || '';

  // A backend that hangs must not hang the form: after this, give up on it and
  // fail over. Long enough for a cold start, short enough that a visitor is
  // not left staring at a disabled button.
  var BACKEND_TIMEOUT_MS = Number(cfg.BACKEND_TIMEOUT_MS) || 12000;

  // True when some path will deliver the submission on its own, with nobody
  // pressing send in a mail app.
  var AUTOMATIC = !!(OWN_BACKEND || WEB3FORMS_KEY || FORMSUBMIT_EMAIL);

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

  // fetch() with a deadline. AbortController is in every browser this site
  // supports; if it is somehow missing the request simply has no deadline.
  function fetchWithTimeout(url, init, ms) {
    if (typeof AbortController === 'undefined') return fetch(url, init);
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, ms);
    return fetch(url, Object.assign({}, init, { signal: controller.signal })).then(
      function (res) { clearTimeout(timer); return res; },
      function (err) { clearTimeout(timer); throw err; }
    );
  }

  function readJson(res) {
    return res.json().catch(function () { return {}; });
  }

  // ---- path 1: own backend --------------------------------------------------
  function backendJson(path, payload) {
    return fetchWithTimeout(
      BASE + path,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
      BACKEND_TIMEOUT_MS
    ).then(function (res) {
      return readJson(res).then(function (body) {
        if (!res.ok) throw new Error(body.message || 'Request failed (' + res.status + ')');
        return body;
      });
    });
  }

  function backendForm(path, formData) {
    return fetchWithTimeout(BASE + path, { method: 'POST', body: formData }, BACKEND_TIMEOUT_MS * 2).then(function (res) {
      return readJson(res).then(function (body) {
        if (!res.ok) throw new Error(body.message || 'Request failed (' + res.status + ')');
        return body;
      });
    });
  }

  // ---- path 2: Web3Forms ----------------------------------------------------
  function submitToWeb3Forms(payload) {
    return fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.assign({ access_key: WEB3FORMS_KEY }, payload)),
    }).then(function (res) {
      return readJson(res).then(function (body) {
        if (!res.ok || !body.success) throw new Error(body.message || 'Request failed');
        return body;
      });
    });
  }

  function submitFileToWeb3Forms(formData) {
    formData.append('access_key', WEB3FORMS_KEY);
    return fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body: formData }).then(function (res) {
      return readJson(res).then(function (body) {
        if (!res.ok || !body.success) throw new Error(body.message || 'Request failed');
        return body;
      });
    });
  }

  // ---- path 3: FormSubmit ---------------------------------------------------
  // Relays a submission to FORMSUBMIT_EMAIL with no key and no account. The
  // address has to be confirmed once, from the first submission — see config.js.
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

  // Tries each sender in turn; the first to resolve wins. If every one fails,
  // the enquiry is handed to the visitor's mail client rather than lost.
  function deliver(senders, subject, fields) {
    function attempt(i) {
      if (i >= senders.length) return Promise.reject(new Error('All delivery paths failed'));
      return senders[i]().catch(function () { return attempt(i + 1); });
    }
    if (!senders.length) return openMailClient(subject, fields);
    return attempt(0).catch(function () { return openMailClient(subject, fields); });
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
      var senders = [];

      if (OWN_BACKEND) {
        senders.push(function () { return backendJson('/api/bookings', data); });
      }
      if (WEB3FORMS_KEY) {
        senders.push(function () {
          return submitToWeb3Forms(Object.assign({ subject: subject, from_name: data.name }, data)).then(function () {
            return { id: 'w3f_' + Date.now(), status: 'received' };
          });
        });
      }
      if (FORMSUBMIT_EMAIL) {
        senders.push(function () {
          return submitToFormSubmit(subject, fields).then(function () {
            return { id: 'fs_' + Date.now(), status: 'received' };
          });
        });
      }
      return deliver(senders, subject, fields);
    },

    subscribeNewsletter: function (email) {
      var subject = 'Newsletter signup';
      var fields = { Email: email };
      var senders = [];

      if (OWN_BACKEND) {
        senders.push(function () { return backendJson('/api/newsletter', { email: email }); });
      }
      if (WEB3FORMS_KEY) {
        senders.push(function () {
          return submitToWeb3Forms({ subject: 'New newsletter subscriber', from_name: email, email: email }).then(function () {
            return { status: 'subscribed' };
          });
        });
      }
      if (FORMSUBMIT_EMAIL) {
        senders.push(function () {
          return submitToFormSubmit('New newsletter subscriber', fields).then(function () {
            return { status: 'subscribed' };
          });
        });
      }
      return deliver(senders, subject, fields);
    },

    submitCvApplication: function (formData) {
      var subject = 'CV submission — ' + (formData.get('name') || '');
      var senders = [];

      if (OWN_BACKEND) {
        // FormData is not consumed by a failed fetch, so if this fails the
        // same object can still be handed to the next path.
        senders.push(function () { return backendForm('/api/careers/applications', formData); });
      }
      if (WEB3FORMS_KEY) {
        senders.push(function () {
          formData.append('subject', subject);
          return submitFileToWeb3Forms(formData).then(function () {
            return { id: 'w3f_' + Date.now(), status: 'received' };
          });
        });
      }
      // There is no FormSubmit path here on purpose. Its AJAX endpoint takes
      // JSON, not a file, so a CV posted to it would be dropped while the
      // visitor was told the application went through.
      //
      // A CV cannot travel in a mailto: body, so if every upload path fails
      // this asks for the file to be attached rather than pretending it was
      // uploaded.
      return deliver(senders, subject, {
        Name: formData.get('name'),
        Email: formData.get('email'),
        Message: formData.get('message'),
        'Please attach': 'your CV to this email before sending',
      });
    },
  };
})();
