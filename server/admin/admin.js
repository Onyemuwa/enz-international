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
    { id: 'subscribers', label: 'Subscribers' },
  ];
  var state = { tab: 'inquiries', status: '', q: '', rows: [], total: 0, openId: null, summary: null, flash: null };

  var $tabs = document.getElementById('tabs');
  var $banners = document.getElementById('banners');
  var $view = document.getElementById('view');
  // The toolbar (search box, filters) is built once per tab and never rebuilt
  // while typing — re-rendering it would steal focus from the search input.
  var $tools = el('div', { class: 'tools' });
  var $list = el('div');
  var $count = el('span', { class: 'count' });
  $view.appendChild($tools);
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
    renderTabs();
    buildTools();
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
      statusSel = el('select', { 'aria-label': 'Filter by status', onchange: function (e) { state.status = e.target.value; load(true); } },
        el('option', { value: '', text: 'All statuses' }),
        el('option', { value: 'new', text: 'New' }),
        el('option', { value: 'contacted', text: 'Contacted' }),
        el('option', { value: 'closed', text: 'Closed' }));
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
    var csv = state.tab === 'applications' ? null
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
      $list.appendChild(el('div', { class: 'empty', text: state.q || state.status ? 'Nothing matches those filters.' : 'Nothing here yet.' }));
      return;
    }
    var table = el('table');
    var cols = { inquiries: ['Received', 'Name', 'Contact', 'About', 'Status'], applications: ['Received', 'Name', 'Email', 'CV', 'Status'], subscribers: ['Subscribed', 'Email', ''] }[state.tab];
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
    var cls = 'row' + (row.status === 'new' ? ' is-new' : '');
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

  // ---- boot -----------------------------------------------------------------
  renderTabs();
  buildTools();
  loadSummary().then(function () { return load(true); }).catch(function (e) {
    $list.appendChild(el('div', { class: 'empty', text: 'Could not load: ' + e.message }));
  });
})();
