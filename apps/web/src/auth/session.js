const SESSION_KEY = 'smartcampus.auth.session.v1';

function isSession(value) {
  return Boolean(value?.token && value?.user?.id);
}

function readFrom(storage) {
  try {
    const value = JSON.parse(storage.getItem(SESSION_KEY));
    if (isSession(value)) return value;
  } catch {
    storage.removeItem(SESSION_KEY);
  }
  return null;
}

export function readSession() {
  const persistent = readFrom(localStorage);
  if (persistent) return { ...persistent, persistent: true };

  const temporary = readFrom(sessionStorage);
  return temporary ? { ...temporary, persistent: false } : null;
}

export function saveSession(session, persistent) {
  clearSession();
  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export { SESSION_KEY };
