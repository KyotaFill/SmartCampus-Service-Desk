import { beforeEach, describe, expect, it } from 'vitest';
import { clearSession, readSession, saveSession, SESSION_KEY } from './session.js';

const session = {
  token: 'test-token',
  user: { id: 'user-1', fullName: 'Nguyễn Văn An' }
};

describe('auth session storage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('stores a remembered session persistently', () => {
    saveSession(session, true);

    expect(JSON.parse(localStorage.getItem(SESSION_KEY))).toEqual(session);
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
    expect(readSession()).toEqual({ ...session, persistent: true });
  });

  it('stores a non-remembered session for the current tab only', () => {
    saveSession(session, false);

    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(JSON.parse(sessionStorage.getItem(SESSION_KEY))).toEqual(session);
    expect(readSession()).toEqual({ ...session, persistent: false });
  });

  it('clears both storage locations and ignores malformed data', () => {
    localStorage.setItem(SESSION_KEY, '{broken');
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

    expect(readSession()).toEqual({ ...session, persistent: false });
    clearSession();
    expect(readSession()).toBeNull();
  });
});
