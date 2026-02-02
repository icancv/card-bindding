// Authentication module - Cookie, CSRF, SHA-256 hashing

export const AUTH_COOKIE_NAME = 'card_auth';
export const CSRF_COOKIE_NAME = 'csrf_token';
export const AUTH_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

// SHA-256 hash function (async)
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate random CSRF token
export function generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Parse cookies from header
export function parseCookies(cookieStr) {
    const cookies = {};
    if (!cookieStr) return cookies;
    cookieStr.split(';').forEach(pair => {
        const [key, value] = pair.trim().split('=');
        if (key) cookies[key] = value;
    });
    return cookies;
}

// Check if user is logged in
export async function isAuthenticated(request, password) {
    const cookies = parseCookies(request.headers.get('Cookie') || '');
    const authCookie = cookies[AUTH_COOKIE_NAME];
    if (!authCookie) return false;
    const expectedHash = await hashPassword(password);
    return authCookie === expectedHash;
}

// Verify CSRF token
export function verifyCSRF(request) {
    const cookies = parseCookies(request.headers.get('Cookie') || '');
    const cookieToken = cookies[CSRF_COOKIE_NAME];
    const headerToken = request.headers.get('X-CSRF-Token');

    if (!cookieToken || !headerToken) return false;
    return cookieToken === headerToken;
}

// Create auth cookie header
export async function createAuthCookie(password) {
    const hash = await hashPassword(password);
    return `${AUTH_COOKIE_NAME}=${hash}; Path=/; HttpOnly; Secure; Max-Age=${AUTH_MAX_AGE}; SameSite=Strict`;
}

// Create CSRF cookie header (HttpOnly=false so JS can read it)
export function createCSRFCookie(token) {
    return `${CSRF_COOKIE_NAME}=${token}; Path=/; Secure; Max-Age=${AUTH_MAX_AGE}; SameSite=Strict`;
}

// Clear auth cookie
export function clearAuthCookie() {
    return `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Strict`;
}

// Clear CSRF cookie
export function clearCSRFCookie() {
    return `${CSRF_COOKIE_NAME}=; Path=/; Secure; Max-Age=0; SameSite=Strict`;
}
