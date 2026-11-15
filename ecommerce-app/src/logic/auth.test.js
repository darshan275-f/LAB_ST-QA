import { describe, expect, it } from 'vitest';
import {
  DEMO_USER,
  authenticate,
  canAccessProtectedRoute,
  normalizeEmail,
  parseStoredUser,
} from './auth';

describe('authenticate (white-box branch coverage)', () => {
  it('rejects empty email and password (required branch)', () => {
    expect(authenticate('', '')).toEqual({
      success: false,
      error: 'Email and password are required.',
    });
  });

  it('rejects whitespace-only email (trim then empty branch)', () => {
    expect(authenticate('   ', DEMO_USER.password).success).toBe(false);
    expect(authenticate('   ', DEMO_USER.password).error).toMatch(/required/i);
  });

  it('rejects missing password even when email is valid', () => {
    expect(authenticate(DEMO_USER.email, '')).toEqual({
      success: false,
      error: 'Email and password are required.',
    });
  });

  it('rejects invalid email format (regex fail branch)', () => {
    const result = authenticate('not-an-email', DEMO_USER.password);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Please enter a valid email address.');
  });

  it('rejects wrong email (credential mismatch email branch)', () => {
    const result = authenticate('wrong@example.com', DEMO_USER.password);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password.');
  });

  it('rejects wrong password (credential mismatch password branch)', () => {
    const result = authenticate(DEMO_USER.email, 'Wrong@123');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password.');
  });

  it('accepts valid credentials (success branch)', () => {
    const result = authenticate(DEMO_USER.email, DEMO_USER.password);
    expect(result.success).toBe(true);
    expect(result.user).toEqual({
      email: DEMO_USER.email,
      name: DEMO_USER.name,
    });
    expect(result.user).not.toHaveProperty('password');
  });

  it('normalizes email case before comparison', () => {
    const result = authenticate('TestUser@Example.com', DEMO_USER.password);
    expect(result.success).toBe(true);
  });

  it('does not treat password-only whitespace as missing if it is non-empty string of spaces (falsy check uses !password)', () => {
    const result = authenticate(DEMO_USER.email, '   ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password.');
  });
});

describe('normalizeEmail', () => {
  it('returns empty string for non-string input', () => {
    expect(normalizeEmail(null)).toBe('');
    expect(normalizeEmail(undefined)).toBe('');
    expect(normalizeEmail(123)).toBe('');
  });

  it('trims and lowercases strings', () => {
    expect(normalizeEmail('  A@B.COM  ')).toBe('a@b.com');
  });
});

describe('parseStoredUser (session restore branches)', () => {
  it('returns null for empty storage', () => {
    expect(parseStoredUser(null)).toBeNull();
    expect(parseStoredUser('')).toBeNull();
  });

  it('returns null for invalid JSON (catch branch)', () => {
    expect(parseStoredUser('{not-json')).toBeNull();
  });

  it('returns null when JSON is not a user object', () => {
    expect(parseStoredUser('[]')).toBeNull();
    expect(parseStoredUser('null')).toBeNull();
    expect(parseStoredUser('{"name":"x"}')).toBeNull();
  });

  it('returns the parsed user when email is present', () => {
    expect(
      parseStoredUser(JSON.stringify({ email: DEMO_USER.email, name: 'Test User' })),
    ).toEqual({ email: DEMO_USER.email, name: 'Test User' });
  });
});

describe('canAccessProtectedRoute (decision table)', () => {
  it('returns loading while session is hydrating', () => {
    expect(canAccessProtectedRoute(false, true)).toEqual({ status: 'loading' });
    expect(canAccessProtectedRoute(true, true)).toEqual({ status: 'loading' });
  });

  it('redirects unauthenticated users to login', () => {
    expect(canAccessProtectedRoute(false, false)).toEqual({
      status: 'redirect',
      to: '/login',
    });
  });

  it('allows authenticated users', () => {
    expect(canAccessProtectedRoute(true, false)).toEqual({ status: 'allow' });
  });
});
