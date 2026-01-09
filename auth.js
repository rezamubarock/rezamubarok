// Authentication Module
// Passwords are obfuscated - not stored in plain text

// Main login password: annelies
const _0x = [0x61, 0x6e, 0x6e, 0x65, 0x6c, 0x69, 0x65, 0x73];
const _k = () => _0x.map(c => String.fromCharCode(c)).join('');

// Private folder password: M0j0punkr0cker/.,
const _1x = [0x4d, 0x30, 0x6a, 0x30, 0x70, 0x75, 0x6e, 0x6b, 0x72, 0x30, 0x63, 0x6b, 0x65, 0x72, 0x2f, 0x2e, 0x2c];
const _pk = () => _1x.map(c => String.fromCharCode(c)).join('');

// Main login validation
function validateAccess(input) {
  const h = Array.from(input).reduce((a, c) => a + c.charCodeAt(0), 0);
  const v = _0x.reduce((a, c) => a + c, 0);
  if (h !== v) return false;
  return input === _k();
}

function checkAuth() {
  return sessionStorage.getItem('_auth') === btoa(_k() + new Date().toDateString());
}

function setAuth() {
  sessionStorage.setItem('_auth', btoa(_k() + new Date().toDateString()));
}

function clearAuth() {
  sessionStorage.removeItem('_auth');
}

// Private folder validation
function validatePrivate(input) {
  const h = Array.from(input).reduce((a, c) => a + c.charCodeAt(0), 0);
  const v = _1x.reduce((a, c) => a + c, 0);
  if (h !== v) return false;
  return input === _pk();
}

function checkPrivateAuth() {
  return sessionStorage.getItem('_priv') === btoa(_pk() + new Date().toDateString());
}

function setPrivateAuth() {
  sessionStorage.setItem('_priv', btoa(_pk() + new Date().toDateString()));
}

function clearPrivateAuth() {
  sessionStorage.removeItem('_priv');
}
