(function () {
  'use strict';
  var form = document.getElementById('login');
  var user = document.getElementById('user');
  var pass = document.getElementById('password');
  var err = document.getElementById('error');
  var btn = document.getElementById('submit');
  var toggle = document.getElementById('toggle');

  function show(message) {
    err.textContent = message;
    err.hidden = false;
  }

  toggle.addEventListener('click', function () {
    var reveal = pass.type === 'password';
    pass.type = reveal ? 'text' : 'password';
    toggle.textContent = reveal ? 'Hide' : 'Show';
    toggle.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
    toggle.setAttribute('aria-pressed', reveal ? 'true' : 'false');
    pass.focus();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.hidden = true;
    if (!user.value.trim() || !pass.value) {
      show('Enter your username and password.');
      (user.value.trim() ? pass : user).focus();
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    fetch(location.origin + '/api/admin/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-ENZ-Admin': '1' },
      body: JSON.stringify({ user: user.value.trim(), password: pass.value }),
    })
      .then(function (res) {
        if (res.ok) {
          location.replace('/admin/');
          return;
        }
        return res
          .json()
          .catch(function () { return {}; })
          .then(function (b) {
            show(b.message || 'Sign-in failed. Try again.');
            btn.disabled = false;
            btn.textContent = 'Sign in';
            pass.value = '';
            pass.focus();
          });
      })
      .catch(function () {
        show('Could not reach the server. Check your connection and try again.');
        btn.disabled = false;
        btn.textContent = 'Sign in';
      });
  });
})();
