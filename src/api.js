// API module - Route handlers with validation, pagination, search, sort

import { verifyCSRF } from './auth.js';

// JSON response helper
export function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
}

// Error response helper
export function errorResponse(message, status = 400) {
    return jsonResponse({ error: message }, status);
}

// Input validation for subscription data
function validateSubscription(data) {
    const errors = [];

    // Required fields
    const requiredFields = ['card', 'account', 'service', 'bind_time'];
    for (const field of requiredFields) {
        if (!data[field] || typeof data[field] !== 'string') {
            errors.push(`${field} 是必填项且必须为字符串`);
        } else if (data[field].length > 100) {
            errors.push(`${field} 长度不能超过 100 字符`);
        }
    }

    // auto_renew must be 0 or 1
    if (data.auto_renew !== undefined && data.auto_renew !== 0 && data.auto_renew !== 1) {
        errors.push('auto_renew 必须为 0 或 1');
    }

    // note is optional but has length limit
    if (data.note !== undefined && data.note !== null && data.note !== '') {
        if (typeof data.note !== 'string') {
            errors.push('note 必须为字符串');
        } else if (data.note.length > 500) {
            errors.push('note 长度不能超过 500 字符');
        }
    }

    return errors;
}

// Parse JSON body with error handling
async function parseJSON(request) {
    try {
        return await request.json();
    } catch (e) {
        return null;
    }
}

// Handle API routes
export async function handleAPI(request, env, path) {
    const method = request.method;

    // GET /api/subscriptions - List with pagination, search, sort, filter
    if (path === '/api/subscriptions' && method === 'GET') {
        const url = new URL(request.url);
        const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit')) || 20));
        const offset = (page - 1) * limit;

        const search = url.searchParams.get('search') || '';
        const cardFilter = url.searchParams.get('card') || '';
        const serviceFilter = url.searchParams.get('service') || '';
        const statusFilter = url.searchParams.get('status') || '';

        const sortField = url.searchParams.get('sort') || 'created_at';
        const sortOrder = url.searchParams.get('order') === 'asc' ? 'ASC' : 'DESC';

        // Validate sort field to prevent SQL injection
        const allowedSortFields = ['created_at', 'bind_time', 'card', 'service', 'account'];
        const safeSort = allowedSortFields.includes(sortField) ? sortField : 'created_at';

        // Build WHERE clause
        const conditions = [];
        const params = [];

        if (search) {
            conditions.push('(card LIKE ? OR service LIKE ? OR account LIKE ? OR note LIKE ?)');
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        if (cardFilter) {
            conditions.push('card = ?');
            params.push(cardFilter);
        }

        if (serviceFilter) {
            conditions.push('service = ?');
            params.push(serviceFilter);
        }

        if (statusFilter === 'active') {
            conditions.push('cancel_time IS NULL');
        } else if (statusFilter === 'cancelled') {
            conditions.push('cancel_time IS NOT NULL');
        }

        const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM subscriptions ${whereClause}`;
        const countResult = await env.DB.prepare(countQuery).bind(...params).first();
        const total = countResult?.total || 0;

        // Get data
        const dataQuery = `SELECT * FROM subscriptions ${whereClause} ORDER BY ${safeSort} ${sortOrder} LIMIT ? OFFSET ?`;
        const dataResult = await env.DB.prepare(dataQuery).bind(...params, limit, offset).all();

        return jsonResponse({
            data: dataResult.results,
            total,
            page,
            limit
        });
    }

    // POST /api/subscriptions - Create new subscription
    if (path === '/api/subscriptions' && method === 'POST') {
        // CSRF check
        if (!verifyCSRF(request)) {
            return errorResponse('CSRF token 验证失败', 403);
        }

        const data = await parseJSON(request);
        if (!data) {
            return errorResponse('无效的 JSON 数据', 400);
        }

        const errors = validateSubscription(data);
        if (errors.length > 0) {
            return errorResponse(errors.join('; '), 400);
        }

        await env.DB.prepare(
            'INSERT INTO subscriptions (card, account, service, bind_time, auto_renew, note) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(
            data.card.trim(),
            data.account.trim(),
            data.service.trim(),
            data.bind_time.trim(),
            data.auto_renew || 0,
            data.note?.trim() || null
        ).run();

        return jsonResponse({ success: true });
    }

    // GET /api/subscriptions/overview - Get overview data grouped by card
    if (path === '/api/subscriptions/overview' && method === 'GET') {
        const result = await env.DB.prepare('SELECT * FROM subscriptions ORDER BY card, service').all();
        const subscriptions = result.results || [];

        // Group by card
        const cardMap = new Map();
        const allServices = new Set();
        const allAccounts = new Set();
        let activeCount = 0;

        for (const sub of subscriptions) {
            allServices.add(sub.service);
            allAccounts.add(sub.account);
            if (!sub.cancel_time) activeCount++;

            if (!cardMap.has(sub.card)) {
                cardMap.set(sub.card, {
                    name: sub.card,
                    services: new Map(),
                    accounts: new Set(),
                    activeCount: 0,
                    cancelledCount: 0
                });
            }

            const card = cardMap.get(sub.card);

            // Count services
            const serviceCount = card.services.get(sub.service) || 0;
            card.services.set(sub.service, serviceCount + 1);

            // Add account
            card.accounts.add(sub.account);

            // Count status
            if (sub.cancel_time) {
                card.cancelledCount++;
            } else {
                card.activeCount++;
            }
        }

        // Convert to array format
        const cards = Array.from(cardMap.values()).map(card => ({
            name: card.name,
            services: Array.from(card.services.entries()).map(([name, count]) => ({ name, count })),
            accounts: Array.from(card.accounts),
            activeCount: card.activeCount,
            cancelledCount: card.cancelledCount
        }));

        return jsonResponse({
            summary: {
                cardCount: cardMap.size,
                serviceCount: allServices.size,
                accountCount: allAccounts.size,
                activeCount
            },
            cards
        });
    }

    // GET /api/subscriptions/export - Export all data
    if (path === '/api/subscriptions/export' && method === 'GET') {
        const result = await env.DB.prepare('SELECT card, account, service, bind_time, auto_renew, cancel_time, note FROM subscriptions ORDER BY created_at DESC').all();
        return jsonResponse(result.results);
    }

    // POST /api/subscriptions/import - Import data
    if (path === '/api/subscriptions/import' && method === 'POST') {
        // CSRF check
        if (!verifyCSRF(request)) {
            return errorResponse('CSRF token 验证失败', 403);
        }

        const data = await parseJSON(request);
        if (!data || !Array.isArray(data)) {
            return errorResponse('无效的 JSON 数据，需要数组格式', 400);
        }

        let imported = 0;
        for (const item of data) {
            const errors = validateSubscription(item);
            if (errors.length === 0) {
                await env.DB.prepare(
                    'INSERT INTO subscriptions (card, account, service, bind_time, auto_renew, cancel_time, note) VALUES (?, ?, ?, ?, ?, ?, ?)'
                ).bind(
                    item.card.trim(),
                    item.account.trim(),
                    item.service.trim(),
                    item.bind_time.trim(),
                    item.auto_renew || 0,
                    item.cancel_time || null,
                    item.note?.trim() || null
                ).run();
                imported++;
            }
        }

        return jsonResponse({ success: true, imported });
    }

    // PUT /api/subscriptions/:id - Update subscription
    const subMatch = path.match(/^\/api\/subscriptions\/(\d+)$/);
    if (subMatch && method === 'PUT') {
        // CSRF check
        if (!verifyCSRF(request)) {
            return errorResponse('CSRF token 验证失败', 403);
        }

        const id = subMatch[1];

        // Check if exists
        const existing = await env.DB.prepare('SELECT id FROM subscriptions WHERE id = ?').bind(id).first();
        if (!existing) {
            return errorResponse('记录不存在', 404);
        }

        const data = await parseJSON(request);
        if (!data) {
            return errorResponse('无效的 JSON 数据', 400);
        }

        const errors = validateSubscription(data);
        if (errors.length > 0) {
            return errorResponse(errors.join('; '), 400);
        }

        await env.DB.prepare(
            'UPDATE subscriptions SET card=?, account=?, service=?, bind_time=?, auto_renew=?, note=? WHERE id=?'
        ).bind(
            data.card.trim(),
            data.account.trim(),
            data.service.trim(),
            data.bind_time.trim(),
            data.auto_renew || 0,
            data.note?.trim() || null,
            id
        ).run();

        return jsonResponse({ success: true });
    }

    // DELETE /api/subscriptions/:id - Delete subscription
    if (subMatch && method === 'DELETE') {
        // CSRF check
        if (!verifyCSRF(request)) {
            return errorResponse('CSRF token 验证失败', 403);
        }

        const id = subMatch[1];

        // Check if exists
        const existing = await env.DB.prepare('SELECT id FROM subscriptions WHERE id = ?').bind(id).first();
        if (!existing) {
            return errorResponse('记录不存在', 404);
        }

        await env.DB.prepare('DELETE FROM subscriptions WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true });
    }

    // POST /api/subscriptions/:id/cancel - Cancel subscription
    const cancelMatch = path.match(/^\/api\/subscriptions\/(\d+)\/cancel$/);
    if (cancelMatch && method === 'POST') {
        // CSRF check
        if (!verifyCSRF(request)) {
            return errorResponse('CSRF token 验证失败', 403);
        }

        const id = cancelMatch[1];

        // Check if exists
        const existing = await env.DB.prepare('SELECT id FROM subscriptions WHERE id = ?').bind(id).first();
        if (!existing) {
            return errorResponse('记录不存在', 404);
        }

        const today = new Date().toISOString().split('T')[0];
        await env.DB.prepare('UPDATE subscriptions SET cancel_time = ? WHERE id = ?').bind(today, id).run();
        return jsonResponse({ success: true });
    }

    return null; // No matching API route
}
