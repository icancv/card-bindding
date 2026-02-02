// Entry point - Route dispatcher

import {
    isAuthenticated,
    createAuthCookie,
    createCSRFCookie,
    generateCSRFToken,
    parseCookies,
    CSRF_COOKIE_NAME
} from './auth.js';
import { handleAPI, jsonResponse } from './api.js';
import { errorPage } from './pages/error.js';
import { getLoginPage } from './pages/login.js';
import { mainPage } from './pages/main.js';
import { overviewPage } from './pages/overview.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // Get password from environment
        const PASSWORD = env.AUTH_PASSWORD;

        // Show error page if password not configured
        if (!PASSWORD) {
            return new Response(errorPage, {
                status: 500,
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        // Login page
        if (path === '/login') {
            if (method === 'GET') {
                // Generate CSRF token for login form
                const csrfToken = generateCSRFToken();
                return new Response(getLoginPage(csrfToken), {
                    headers: {
                        'Content-Type': 'text/html; charset=utf-8',
                        'Set-Cookie': createCSRFCookie(csrfToken)
                    }
                });
            }
            if (method === 'POST') {
                const formData = await request.formData();
                const password = formData.get('password');
                const formCsrfToken = formData.get('csrf_token');

                // Verify CSRF token from form against cookie
                const cookies = parseCookies(request.headers.get('Cookie') || '');
                const cookieCsrfToken = cookies[CSRF_COOKIE_NAME];

                if (!formCsrfToken || !cookieCsrfToken || formCsrfToken !== cookieCsrfToken) {
                    return new Response(null, {
                        status: 302,
                        headers: { 'Location': '/login?error=csrf' }
                    });
                }

                if (password === PASSWORD) {
                    // Generate new CSRF token for authenticated session
                    const newCsrfToken = generateCSRFToken();
                    const authCookie = await createAuthCookie(PASSWORD);

                    return new Response(null, {
                        status: 302,
                        headers: [
                            ['Location', '/'],
                            ['Set-Cookie', authCookie],
                            ['Set-Cookie', createCSRFCookie(newCsrfToken)]
                        ]
                    });
                }
                return new Response(null, {
                    status: 302,
                    headers: { 'Location': '/login?error=1' }
                });
            }
        }

        // Check authentication
        const loggedIn = await isAuthenticated(request, PASSWORD);

        // Redirect to login if not authenticated
        if (!loggedIn) {
            if (path.startsWith('/api/')) {
                return jsonResponse({ error: 'Unauthorized' }, 401);
            }
            return new Response(null, {
                status: 302,
                headers: { 'Location': '/login' }
            });
        }

        // Overview page (home)
        if (path === '/' && method === 'GET') {
            return new Response(overviewPage, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        // Detail page
        if (path === '/detail' && method === 'GET') {
            return new Response(mainPage, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        // API routes
        if (path.startsWith('/api/')) {
            const apiResponse = await handleAPI(request, env, path);
            if (apiResponse) {
                return apiResponse;
            }
        }

        // 404 Not Found
        return new Response('Not Found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }
};
