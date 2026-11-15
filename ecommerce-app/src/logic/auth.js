export const AUTH_STORAGE_KEY = 'ecommerce_auth';

export const DEMO_USER = {
  email: 'testuser@example.com',
  password: 'Test@123',
  name: 'Test User',
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email) {
  if (typeof email !== 'string') {
    return '';
  }
  return email.trim().toLowerCase();
}

/**
 * White-box login decision tree:
 * 1. empty email/password
 * 2. invalid email format
 * 3. credentials mismatch (email OR password)
 * 4. success
 */
export function authenticate(email, password) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (
    normalizedEmail !== DEMO_USER.email.toLowerCase() ||
    password !== DEMO_USER.password
  ) {
    return { success: false, error: 'Invalid email or password.' };
  }

  return {
    success: true,
    user: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
    },
  };
}

export function parseStoredUser(raw) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.email) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function canAccessProtectedRoute(isAuthenticated, loading) {
  if (loading) {
    return { status: 'loading' };
  }
  if (!isAuthenticated) {
    return { status: 'redirect', to: '/login' };
  }
  return { status: 'allow' };
}
