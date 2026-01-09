// Authentication Module
// Password is obfuscated - not stored in plain text
const _0x = [0x61,0x6e,0x6e,0x65,0x6c,0x69,0x65,0x73];
const _k = () => _0x.map(c => String.fromCharCode(c)).join('');

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
