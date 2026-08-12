import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
import { createApp } from '../src/app.js';
import { verifyPassword } from '../src/auth/password.js';

const JWT_SECRET = 'test-secret-with-at-least-thirty-two-characters';

function createMemoryAuthRepository() {
  const users = new Map();

  return {
    users,

    async findByEmail(email) {
      return [...users.values()].find((user) => user.email === email) ?? null;
    },

    async findById(id) {
      return users.get(id) ?? null;
    },

    async createStudent(input) {
      if ([...users.values()].some((user) => user.email === input.email)) {
        const error = new Error('Unique constraint failed');
        error.code = 'P2002';
        throw error;
      }

      const user = {
        id: randomUUID(),
        email: input.email,
        passwordHash: input.passwordHash,
        fullName: input.fullName,
        isActive: true,
        createdAt: new Date(),
        role: { name: 'STUDENT' }
      };
      users.set(user.id, user);
      return user;
    }
  };
}

async function withApi(run) {
  const repository = createMemoryAuthRepository();
  const app = createApp({ authRepository: repository, jwtSecret: JWT_SECRET });
  const server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();

  try {
    await run({ baseUrl: `http://127.0.0.1:${port}/api`, repository });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

async function postJson(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
}

test('happy path: register STUDENT, hash password, login and read current user', async () => {
  await withApi(async ({ baseUrl, repository }) => {
    const credentials = {
      fullName: '  Nguyễn Văn An  ',
      email: '  AN@example.edu.vn ',
      password: 'correct-horse-battery-staple'
    };

    const registerResponse = await postJson(`${baseUrl}/auth/register`, credentials);
    const registerBody = await registerResponse.json();

    assert.equal(registerResponse.status, 201);
    assert.equal(registerBody.user.email, 'an@example.edu.vn');
    assert.equal(registerBody.user.fullName, 'Nguyễn Văn An');
    assert.equal(registerBody.user.role, 'STUDENT');
    assert.equal('password' in registerBody.user, false);
    assert.equal('passwordHash' in registerBody.user, false);

    const storedUser = [...repository.users.values()][0];
    assert.notEqual(storedUser.passwordHash, credentials.password);
    assert.equal(await verifyPassword(credentials.password, storedUser.passwordHash), true);

    const loginResponse = await postJson(`${baseUrl}/auth/login`, {
      email: credentials.email,
      password: credentials.password
    });
    const loginBody = await loginResponse.json();

    assert.equal(loginResponse.status, 200);
    assert.equal(loginBody.tokenType, 'Bearer');
    assert.equal(loginBody.token.split('.').length, 3);
    assert.equal(loginBody.user.id, registerBody.user.id);
    assert.equal('passwordHash' in loginBody.user, false);

    const meResponse = await fetch(`${baseUrl}/auth/me`, {
      headers: { authorization: `Bearer ${loginBody.token}` }
    });
    const meBody = await meResponse.json();

    assert.equal(meResponse.status, 200);
    assert.deepEqual(meBody.user, loginBody.user);
  });
});

test('login returns the standard error for wrong or unknown credentials', async () => {
  await withApi(async ({ baseUrl }) => {
    await postJson(`${baseUrl}/auth/register`, {
      fullName: 'Nguyễn Văn An',
      email: 'an@example.edu.vn',
      password: 'valid-password'
    });

    for (const credentials of [
      { email: 'an@example.edu.vn', password: 'wrong-password' },
      { email: 'unknown@example.edu.vn', password: 'wrong-password' }
    ]) {
      const response = await postJson(`${baseUrl}/auth/login`, credentials);
      assert.equal(response.status, 401);
      assert.deepEqual(await response.json(), {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email hoặc mật khẩu không đúng'
        }
      });
    }
  });
});

test('register validates input and rejects a duplicated email', async () => {
  await withApi(async ({ baseUrl }) => {
    const invalidResponse = await postJson(`${baseUrl}/auth/register`, {
      fullName: 'A',
      email: 'not-an-email',
      password: 'short'
    });
    const invalidBody = await invalidResponse.json();

    assert.equal(invalidResponse.status, 400);
    assert.equal(invalidBody.error.code, 'VALIDATION_ERROR');
    assert.deepEqual(
      invalidBody.error.details.map((detail) => detail.field),
      ['fullName', 'email', 'password']
    );

    const validUser = {
      fullName: 'Nguyễn Văn An',
      email: 'an@example.edu.vn',
      password: 'valid-password'
    };
    assert.equal((await postJson(`${baseUrl}/auth/register`, validUser)).status, 201);

    const duplicateResponse = await postJson(`${baseUrl}/auth/register`, {
      ...validUser,
      email: 'AN@example.edu.vn'
    });
    assert.equal(duplicateResponse.status, 409);
    assert.equal((await duplicateResponse.json()).error.code, 'EMAIL_ALREADY_EXISTS');
  });
});

test('me rejects a missing or invalid bearer token', async () => {
  await withApi(async ({ baseUrl }) => {
    const missingResponse = await fetch(`${baseUrl}/auth/me`);
    assert.equal(missingResponse.status, 401);
    assert.equal((await missingResponse.json()).error.code, 'UNAUTHORIZED');

    const invalidResponse = await fetch(`${baseUrl}/auth/me`, {
      headers: { authorization: 'Bearer invalid.token.value' }
    });
    assert.equal(invalidResponse.status, 401);
    assert.equal((await invalidResponse.json()).error.code, 'UNAUTHORIZED');
  });
});
