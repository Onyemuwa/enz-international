// The admin page. Vanilla JS, no dependencies, no external requests.
//
// SECURITY: everything shown here was typed by a stranger on the public form.
// Nothing is ever assigned to innerHTML — every value goes in through
// textContent (via el()), so a message like "<img onerror=...>" is displayed as
// those characters and never parsed as markup. The page's CSP forbids inline
// script as a second line of defence.
(function () {
  'use strict';

  var PAGE = 50;
  var TABS = [
    { id: 'inquiries', label: 'Enquiries' },
    { id: 'applications', label: 'Applications' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'subscribers', label: 'Subscribers' },
  ];
  var state = { tab: 'inquiries', status: '', q: '', rows: [], total: 0, openId: null, summary: null, flash: null, showAdd: false };

  var $tabs = document.getElementById('tabs');
  var $banners = document.getElementById('banners');
  var $view = document.getElementById('view');
  // The toolbar (search box, filters) is built once per tab and never rebuilt
  // while typing — re-rendering it would steal focus from the search input.
  var $tools = el('div', { class: 'tools' });
  var $list = el('div');
  var $count = el('span', { class: 'count' });
  // Above the list on the Testimonials tab only: how to ask a client, and the
  // form for adding one a client already sent by WhatsApp or email.
  var $panel = el('div');
  $view.appendChild($tools);
  $view.appendChild($panel);
  $view.appendChild($list);

  // ---- tiny DOM helper ------------------------------------------------------
  function el(tag, props) {
    var node = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (k === 'text') node.textContent = v;
      else if (k === 'class') node.className = v;
      else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), v);
      else if (v !== false && v !== null && v !== undefined) node.setAttribute(k, v === true ? '' : v);
    });
    function append(kid) {
      if (kid === null || kid === undefined || kid === false) return;
      if (Array.isArray(kid)) return kid.forEach(append);
      node.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    }
    for (var i = 2; i < arguments.length; i++) append(arguments[i]);
    return node;
  }

  function api(path, options) {
    options = options || {};
    var init = { method: options.method || 'GET', headers: {}, credentials: 'same-origin' };
    if (options.body !== undefined) {
      init.headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(options.body);
    }
    // Absolute URL from location.origin (which carries no credentials): a page
    // opened as https://user:pass@host/admin/ would otherwise make every relative
    // fetch throw "Request cannot be constructed from a URL that includes credentials".
    return fetch(location.origin + '/api/admin' + path, init).then(function (res) {
      if (res.status === 401) {
        location.reload();
        throw new Error('Signed out');
      }
      if (!res.ok) {
        return res
          .json()
          .catch(function () { return {}; })
          .then(function (b) { throw new Error(b.message || 'Request failed (' + res.status + ')'); });
      }
      return res.status === 204 ? null : res.json();
    });
  }

  function fmtDate(iso) {
    var d = new Date(iso);
    return isNaN(d) ? iso : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }

  function pill(text, cls) {
    return el('span', { class: 'pill ' + (cls || ''), text: text });
  }

  // ---- chrome ---------------------------------------------------------------
  function renderTabs() {
    $tabs.textContent = '';
    var s = state.summary;
    TABS.forEach(function (t) {
      var news = 0;
      if (s && t.id === 'inquiries') news = s.inquiries.new || 0;
      if (s && t.id === 'applications') news = s.applications.new || 0;
      if (s && t.id === 'testimonials') news = (s.testimonials && s.testimonials.pending) || 0;
      $tabs.appendChild(
        el('button', {
          class: 'tab',
          type: 'button',
          'aria-current': state.tab === t.id ? 'true' : 'false',
          onclick: function () { switchTab(t.id); },
        }, t.label, news ? el('span', { class: 'badge', text: String(news) }) : null)
      );
    });
  }

  function renderBanners() {
    $banners.textContent = '';
    var s = state.summary;
    if (!s) return;
    if (s.storageIsEphemeral) {
      $banners.appendChild(el('div', { class: 'banner banner-bad', role: 'alert',
        text: 'No persistent storage is attached. Everything here will be erased on the next deploy. Add a Railway Volume (mount path /data) to this service.' }));
    }
    if (!s.notificationsConfigured) {
      $banners.appendChild(el('div', { class: 'banner banner-warn',
        text: 'Email notifications are off. New enquiries are saved here, but nobody is emailed. Set RESEND_API_KEY to turn them on.' }));
    } else if (s.notifyFailures) {
      $banners.appendChild(el('div', { class: 'banner banner-warn',
        text: s.notifyFailures + ' notification email(s) failed to send. The enquiries are safe here; open them and check the delivery line.' }));
    }
  }

  function loadSummary() {
    return api('/summary').then(function (s) {
      state.summary = s;
      renderTabs();
      renderBanners();
    });
  }

  // ---- list views -----------------------------------------------------------
  function switchTab(id) {
    state.tab = id;
    state.status = '';
    state.q = '';
    state.openId = null;
    state.showAdd = false;
    renderTabs();
    buildTools();
    buildPanel();
    load(true);
  }

  function query(offset) {
    var p = new URLSearchParams();
    if (state.status) p.set('status', state.status);
    if (state.q) p.set('q', state.q);
    p.set('limit', String(PAGE));
    p.set('offset', String(offset));
    return p.toString();
  }

  function load(reset) {
    var offset = reset ? 0 : state.rows.length;
    return api('/' + state.tab + '?' + query(offset)).then(function (data) {
      state.rows = reset ? data.rows : state.rows.concat(data.rows);
      state.total = data.total;
      render();
    }).catch(function (e) {
      $list.textContent = '';
      $list.appendChild(el('div', { class: 'empty', text: 'Could not load: ' + e.message }));
    });
  }

  function buildTools() {
    var statusSel = null;
    if (state.tab !== 'subscribers') {
      var opts = state.tab === 'testimonials'
        ? [['pending', 'Waiting for approval'], ['approved', 'Published'], ['hidden', 'Hidden']]
        : [['new', 'New'], ['contacted', 'Contacted'], ['closed', 'Closed']];
      statusSel = el('select', { 'aria-label': 'Filter by status', onchange: function (e) { state.status = e.target.value; load(true); } },
        el('option', { value: '', text: 'All statuses' }),
        opts.map(function (o) { return el('option', { value: o[0], text: o[1] }); }));
      statusSel.value = state.status;
    }
    var timer;
    var search = el('input', { type: 'search', placeholder: 'Search…', 'aria-label': 'Search', value: state.q,
      oninput: function (e) {
        clearTimeout(timer);
        var v = e.target.value;
        timer = setTimeout(function () { state.q = v.trim(); load(true); }, 300);
      } });
    // The export honours whatever filters are active at the moment of the click.
    var csv = (state.tab === 'applications' || state.tab === 'testimonials') ? null
      : el('a', { class: 'btn btn-quiet', href: '/api/admin/' + state.tab + '.csv', text: 'Export CSV',
          onclick: function (e) {
            e.currentTarget.href = '/api/admin/' + state.tab + '.csv?' + new URLSearchParams({ status: state.status, q: state.q });
          } });
    $tools.textContent = '';
    [statusSel, search, $count, el('span', { class: 'spacer' }), csv].forEach(function (n) { if (n) $tools.appendChild(n); });
  }

  function render() {
    $count.textContent = state.total + ' total';
    $list.textContent = '';
    if (!state.rows.length) {
      $list.appendChild(el('div', { class: 'empty', text: state.q || state.status ? 'Nothing matches those filters.'
        : state.tab === 'testimonials' ? 'No testimonials yet. Use the box above to ask a client, or add one you already have.' : 'Nothing here yet.' }));
      return;
    }
    var table = el('table');
    var cols = { inquiries: ['Received', 'Name', 'Contact', 'About', 'Status'], applications: ['Received', 'Name', 'Email', 'CV', 'Status'], testimonials: ['Received', 'Name', 'From', 'What they said', 'Status'], subscribers: ['Subscribed', 'Email', ''] }[state.tab];
    table.appendChild(el('thead', {}, el('tr', {}, cols.map(function (c, i) { return el('th', { class: i === 2 || i === 3 ? 'hide-sm' : '', text: c }); }))));
    var body = el('tbody');
    state.rows.forEach(function (row) {
      body.appendChild(rowFor(row));
      if (state.openId === row.id && state.tab !== 'subscribers') body.appendChild(detailFor(row));
    });
    table.appendChild(body);
    $list.appendChild(table);
    if (state.rows.length < state.total) {
      $list.appendChild(el('div', { class: 'more' }, el('button', { class: 'btn btn-quiet', type: 'button', text: 'Load more', onclick: function () { load(false); } })));
    }
  }

  function statusPill(row) {
    return pill(row.status, 'pill-' + row.status);
  }

  function rowFor(row) {
    var toggle = function () { state.openId = state.openId === row.id ? null : row.id; render(); };
    if (state.tab === 'subscribers') {
      return el('tr', {},
        el('td', { class: 'muted', text: fmtDate(row.created_at) }),
        el('td', { text: row.email }),
        el('td', {}, el('button', { class: 'btn btn-danger', type: 'button', text: 'Remove', onclick: function () {
          if (!confirm('Remove ' + row.email + ' from the list?')) return;
          api('/subscribers/' + row.id, { method: 'DELETE' }).then(function () { return load(true); }).then(loadSummary);
        } })));
    }
    var cls = 'row' + (row.status === 'new' || row.status === 'pending' ? ' is-new' : '');
    if (state.tab === 'testimonials') {
      var snippet = row.quote.length > 90 ? row.quote.slice(0, 90).trim() + '\u2026' : row.quote;
      return el('tr', { class: cls, onclick: toggle },
        el('td', { class: 'muted', text: fmtDate(row.created_at) }),
        el('td', {}, row.name, row.role ? el('div', { class: 'muted', text: row.role }) : null),
        el('td', { class: 'hide-sm', text: [row.company, row.country].filter(Boolean).join(', ') }),
        el('td', { class: 'hide-sm muted', text: snippet }),
        el('td', {}, pill(row.status === 'pending' ? 'waiting' : row.status === 'approved' ? 'published' : 'hidden', 'pill-' + row.status)));
    }
    if (state.tab === 'applications') {
      return el('tr', { class: cls, onclick: toggle },
        el('td', { class: 'muted', text: fmtDate(row.created_at) }),
        el('td', { text: row.name }),
        el('td', { class: 'hide-sm', text: row.email }),
        el('td', { class: 'hide-sm muted', text: row.cv_original_name || 'none' }),
        el('td', {}, statusPill(row)));
    }
    return el('tr', { class: cls, onclick: toggle },
      el('td', { class: 'muted', text: fmtDate(row.created_at) }),
      el('td', {}, row.name, row.company ? el('div', { class: 'muted', text: row.company }) : null),
      el('td', { class: 'hide-sm' }, row.email, row.phone ? el('div', { class: 'muted', text: row.phone }) : null),
      el('td', { class: 'hide-sm' }, row.kind === 'quote' ? pill('quote', 'pill-quote') : null, row.kind === 'quote' ? ' ' : null,
        row.product || row.service || ''),
      el('td', {}, statusPill(row)));
  }

  function field(dl, label, value) {
    if (value === undefined || value === null || String(value).trim() === '') return;
    dl.appendChild(el('dt', { text: label }));
    dl.appendChild(el('dd', { text: String(value) }));
  }

  function detailFor(row) {
    if (state.tab === 'testimonials') return testimonialDetail(row);
    var isInquiry = state.tab === 'inquiries';
    var dl = el('dl', { class: 'grid' });
    field(dl, 'Name', row.name);
    field(dl, 'Email', row.email);
    if (isInquiry) {
      field(dl, 'Phone', row.phone);
      field(dl, 'Company', row.company);
      field(dl, 'Product', row.product);
      field(dl, 'Service', row.service);
      field(dl, 'Preferred date', row.preferred_date);
    } else {
      field(dl, 'CV', row.cv_original_name ? row.cv_original_name + ' (' + Math.round(row.cv_size / 1024) + ' KB)' : 'not attached');
    }
    field(dl, 'Received', fmtDate(row.created_at));
    field(dl, 'Email alert', row.notify_status + (row.notify_error ? ' — ' + row.notify_error : ''));

    var status = el('select', { 'aria-label': 'Status' },
      el('option', { value: 'new', text: 'New' }),
      el('option', { value: 'contacted', text: 'Contacted' }),
      el('option', { value: 'closed', text: 'Closed' }));
    status.value = row.status;
    var notes = el('textarea', { placeholder: 'Internal notes (never shown to the visitor)', 'aria-label': 'Internal notes' });
    notes.value = row.notes || '';
    var saved = el('span', { class: 'notice' });
    if (state.flash && state.flash.id === row.id) {
      saved.textContent = state.flash.text;
      state.flash = null;
    }

    var subject = isInquiry
      ? (row.kind === 'quote' ? 'Your quote request: ' + row.product : 'Your consultation request')
      : 'Your application to ENZ INTERNATIONAL';

    var save = el('button', { class: 'btn', type: 'button', text: 'Save', onclick: function (e) {
      var btn = e.target;
      btn.disabled = true;
      api('/' + state.tab + '/' + row.id, { method: 'PATCH', body: { status: status.value, notes: notes.value } })
        .then(function (updated) {
          Object.assign(row, updated);
          state.flash = { id: row.id, text: 'Saved' };
          return loadSummary();
        })
        .then(function () { render(); })
        .catch(function (err) { saved.textContent = err.message; })
        .then(function () { btn.disabled = false; });
    } });

    var actions = el('div', { class: 'actions' },
      el('a', { class: 'btn btn-quiet', href: 'mailto:' + encodeURIComponent(row.email) + '?subject=' + encodeURIComponent(subject), text: 'Reply by email' }),
      !isInquiry && row.cv_stored_name ? el('a', { class: 'btn btn-quiet', href: '/api/admin/applications/' + row.id + '/cv', text: 'Download CV' }) : null,
      status, notes, save, saved,
      el('button', { class: 'btn btn-danger', type: 'button', text: 'Delete', onclick: function () {
        if (!confirm('Permanently delete this ' + (isInquiry ? 'enquiry' : 'application') + '? This cannot be undone.')) return;
        api('/' + state.tab + '/' + row.id, { method: 'DELETE' }).then(function () {
          state.openId = null;
          return load(true);
        }).then(loadSummary);
      } }));

    return el('tr', { class: 'detail' },
      el('td', { colspan: '5' }, dl, row.message ? el('div', { class: 'message', text: row.message }) : null, actions));
  }

  // ---- testimonials ---------------------------------------------------------
  function setTestimonialStatus(row, status) {
    return api('/testimonials/' + row.id, { method: 'PATCH', body: { status: status } })
      .then(function (updated) { Object.assign(row, updated); return loadSummary(); })
      .then(function () { return load(true); });
  }

  function testimonialDetail(row) {
    var dl = el('dl', { class: 'grid' });
    field(dl, 'Name', row.name);
    field(dl, 'Email (private)', row.email);
    field(dl, 'Role', row.role);
    field(dl, 'Company', row.company);
    field(dl, 'Country', row.country);
    field(dl, 'Sourced', row.project);
    field(dl, 'Will publish as', row.display === 'anonymous'
      ? (row.role || 'ENZ client') + (row.country ? ', ' + row.country : '') + ' \u2014 name and company withheld'
      : 'Named');
    field(dl, 'Permission', row.consent ? 'Given' + (row.source === 'admin' ? ' (confirmed by ENZ when added)' : ' (ticked on the form)') : 'MISSING');
    field(dl, 'Came from', row.source === 'admin' ? 'Added by ENZ' : 'Submitted by the client');
    field(dl, 'Received', fmtDate(row.created_at));
    if (row.source === 'form') field(dl, 'Email alert', row.notify_status + (row.notify_error ? ' \u2014 ' + row.notify_error : ''));

    var notes = el('textarea', { placeholder: 'Private notes \u2014 e.g. how you checked they were a client', 'aria-label': 'Private notes' });
    notes.value = row.notes || '';
    var flash = el('span', { class: 'notice' });
    if (state.flash && state.flash.id === row.id) { flash.textContent = state.flash.text; state.flash = null; }

    var busy = function (btn, work) {
      btn.disabled = true;
      work().catch(function (err) { flash.textContent = err.message; btn.disabled = false; });
    };

    var buttons = [];
    if (row.status !== 'approved') {
      buttons.push(el('button', { class: 'btn', type: 'button', text: 'Approve and publish', onclick: function (e) {
        busy(e.target, function () { state.flash = { id: row.id, text: 'Published' }; return setTestimonialStatus(row, 'approved'); });
      } }));
    }
    if (row.status === 'approved') {
      buttons.push(el('button', { class: 'btn btn-quiet', type: 'button', text: 'Unpublish', onclick: function (e) {
        busy(e.target, function () { state.flash = { id: row.id, text: 'Hidden from the site' }; return setTestimonialStatus(row, 'hidden'); });
      } }));
    } else if (row.status === 'pending') {
      buttons.push(el('button', { class: 'btn btn-quiet', type: 'button', text: 'Hide', onclick: function (e) {
        busy(e.target, function () { return setTestimonialStatus(row, 'hidden'); });
      } }));
    }
    buttons.push(el('button', { class: 'btn btn-quiet', type: 'button', text: 'Save notes', onclick: function (e) {
      busy(e.target, function () {
        return api('/testimonials/' + row.id, { method: 'PATCH', body: { notes: notes.value } }).then(function (u) {
          Object.assign(row, u); flash.textContent = 'Notes saved'; e.target.disabled = false;
        });
      });
    } }));

    var children = [];
    if (row.email) {
      children.push(el('a', { class: 'btn btn-quiet', text: 'Email them to confirm',
        href: 'mailto:' + encodeURIComponent(row.email) + '?subject=' + encodeURIComponent('Your feedback on ENZ INTERNATIONAL') }));
    }
    children = children.concat(buttons, [notes, flash,
      el('button', { class: 'btn btn-danger', type: 'button', text: 'Delete', onclick: function () {
        if (!confirm('Permanently delete this testimonial? This cannot be undone.')) return;
        api('/testimonials/' + row.id, { method: 'DELETE' }).then(function () { state.openId = null; return load(true); }).then(loadSummary);
      } })]);

    return el('tr', { class: 'detail' }, el('td', { colspan: '5' },
      row.status === 'pending'
        ? el('div', { class: 'banner banner-warn banner-flush', text: 'Not public yet. Before approving, check this person really was a client \u2014 anyone can submit the form.' })
        : null,
      dl,
      el('div', { class: 'message', text: row.quote }),
      el('div', { class: 'actions' }, children)));
  }

  function copyText(value, btn) {
    var done = function () {
      var old = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = old; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(value).then(done, function () {});
    else done();
  }

  function addTestimonialForm() {
    var f = {};
    var input = function (key, label, type, attrs) {
      f[key] = el(type === 'textarea' ? 'textarea' : 'input', Object.assign({ id: 'add-' + key, type: type === 'textarea' ? null : (type || 'text') }, attrs || {}));
      return el('div', {}, el('label', { for: 'add-' + key, class: 'lbl', text: label }), f[key]);
    };
    f.display = el('select', { id: 'add-display' },
      el('option', { value: 'named', text: 'Show their name and company' }),
      el('option', { value: 'anonymous', text: 'Anonymous \u2014 role and country only' }));
    f.consent = el('input', { type: 'checkbox', id: 'add-consent' });
    var msg = el('span', { class: 'notice' });
    var submit = el('button', { class: 'btn', type: 'submit', text: 'Add and publish' });

    var form = el('form', { class: 'addform', onsubmit: function (e) {
      e.preventDefault();
      submit.disabled = true;
      msg.textContent = '';
      var body = {};
      ['quote', 'name', 'role', 'company', 'country', 'project'].forEach(function (k) { body[k] = f[k].value; });
      body.display = f.display.value;
      body.consent = f.consent.checked;
      api('/testimonials', { method: 'POST', body: body })
        .then(function () { state.showAdd = false; buildPanel(); return loadSummary(); })
        .then(function () { return load(true); })
        .catch(function (err) { msg.textContent = err.message; submit.disabled = false; });
    } },
      el('p', { class: 'muted', text: 'Paste what they actually sent, word for word. Do not tidy it up \u2014 uneven, specific wording is what makes it believable.' }),
      input('quote', 'Their words', 'textarea', { rows: '5', required: true }),
      el('div', { class: 'two' }, input('name', 'Name', 'text', { required: true }), input('role', 'Role', 'text')),
      el('div', { class: 'two' }, input('company', 'Company', 'text'), input('country', 'Country', 'text')),
      input('project', 'What they sourced (optional)', 'text'),
      el('div', {}, el('label', { for: 'add-display', class: 'lbl', text: 'How to show them' }), f.display),
      el('label', { class: 'check' }, f.consent, el('span', { text: 'I have this person\u2019s permission to publish this.' })),
      el('div', { class: 'actions' }, submit,
        el('button', { class: 'btn btn-quiet', type: 'button', text: 'Cancel', onclick: function () { state.showAdd = false; buildPanel(); } }), msg));
    return form;
  }

  function buildPanel() {
    $panel.textContent = '';
    if (state.tab !== 'testimonials') return;

    var link = location.origin + '/en/feedback/';
    var template =
      'Hi [name], I hope the [what they bought] arrived well.\n\n' +
      'I would really value your honest feedback on how we did \u2014 what went well, and anything that did not. ' +
      'If you are happy for us to share it, there is a short form here: ' + link + '\n\n' +
      'It takes a couple of minutes and nothing is published without your OK. Thank you.';

    var linkInput = el('input', { type: 'text', readonly: true, value: link, 'aria-label': 'Feedback link', class: 'mono' });
    var tplBox = el('textarea', { rows: '6', readonly: true, 'aria-label': 'Suggested message' });
    tplBox.value = template;

    var ask = el('div', { class: 'card-box' },
      el('h2', { text: 'Ask a client' }),
      el('p', { class: 'muted', text: 'Send this to people you have genuinely worked with, by WhatsApp or email. Ask for what happened \u2014 not for praise \u2014 and do not send them a draft to sign off: real testimonials sound like the person who wrote them.' }),
      el('div', { class: 'copyrow' }, linkInput, el('button', { class: 'btn btn-quiet', type: 'button', text: 'Copy link', onclick: function (e) { copyText(link, e.target); } })),
      tplBox,
      el('div', { class: 'actions' },
        el('button', { class: 'btn btn-quiet', type: 'button', text: 'Copy message', onclick: function (e) { copyText(template, e.target); } }),
        el('a', { class: 'btn btn-quiet', href: link, target: '_blank', rel: 'noopener', text: 'Preview the form' }),
        el('button', { class: 'btn', type: 'button', text: state.showAdd ? 'Close' : 'Add one I already have', onclick: function () { state.showAdd = !state.showAdd; buildPanel(); } })));

    $panel.appendChild(ask);
    if (state.showAdd) $panel.appendChild(el('div', { class: 'card-box' }, el('h2', { text: 'Add a testimonial you already have' }), addTestimonialForm()));
  }

  // ---- boot -----------------------------------------------------------------
  renderTabs();
  buildTools();
  loadSummary().then(function () { return load(true); }).catch(function (e) {
    $list.appendChild(el('div', { class: 'empty', text: 'Could not load: ' + e.message }));
  });
})();
