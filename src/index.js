const AUTH_COOKIE_NAME = 'card_auth';
const AUTH_MAX_AGE = 7 * 24 * 60 * 60; // 7天

// 未配置密码错误页面
const errorPage = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>配置错误</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .error-box {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 500px;
            text-align: center;
        }
        h1 { color: #e74c3c; margin-bottom: 16px; }
        p { color: #666; line-height: 1.6; }
        code {
            display: block;
            background: #f5f5f5;
            padding: 12px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 14px;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="error-box">
        <h1>配置错误</h1>
        <p>未配置登录密码，请先设置 AUTH_PASSWORD 环境变量</p>
        <code>wrangler secret put AUTH_PASSWORD</code>
    </div>
</body>
</html>`;

// HTML 模板
const loginPage = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录 - 卡片订阅小本本</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-box {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 360px;
        }
        h1 { text-align: center; color: #333; margin-bottom: 30px; font-size: 24px; }
        input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        input:focus { outline: none; border-color: #667eea; }
        button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102,126,234,0.4); }
        .error { color: #e74c3c; text-align: center; margin-top: 16px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="login-box">
        <h1>卡片订阅小本本</h1>
        <form method="POST" action="/login">
            <input type="password" name="password" placeholder="请输入密码" required autofocus>
            <button type="submit">登 录</button>
        </form>
        <div class="error" id="error"></div>
    </div>
    <script>
        const params = new URLSearchParams(location.search);
        if (params.get('error')) {
            document.getElementById('error').textContent = '密码错误，请重试';
        }
    </script>
</body>
</html>`;

const mainPage = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>卡片订阅小本本</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
            min-height: 100vh;
            color: #333;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .header h1 { font-size: 20px; }
        .header-actions { display: flex; gap: 12px; }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }
        .btn-primary {
            background: white;
            color: #667eea;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .btn-secondary {
            background: rgba(255,255,255,0.2);
            color: white;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.3); }
        .container { max-width: 1000px; margin: 0 auto; padding: 20px; }

        /* 筛选栏 */
        .filters {
            background: white;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 20px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .filters select {
            padding: 10px 14px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            cursor: pointer;
            min-width: 140px;
        }
        .filters select:focus { outline: none; border-color: #667eea; }

        /* 统计栏 */
        .stats {
            background: white;
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .stat-item { font-size: 14px; color: #666; }
        .stat-item strong { color: #667eea; font-size: 18px; }

        /* 订阅卡片 */
        .sub-list { display: flex; flex-direction: column; gap: 12px; }
        .sub-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .sub-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .sub-card.cancelled { opacity: 0.6; }
        .sub-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        .sub-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .tag {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
        }
        .tag-card { background: #e8f4fd; color: #1976d2; }
        .tag-service { background: #f3e5f5; color: #7b1fa2; }
        .tag-account { background: #e8f5e9; color: #388e3c; }
        .tag-cancelled { background: #ffebee; color: #c62828; }
        .sub-info {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            font-size: 13px;
            color: #666;
        }
        .sub-info span { display: flex; align-items: center; gap: 4px; }
        .auto-renew { color: #388e3c; }
        .no-auto-renew { color: #999; }
        .sub-actions { display: flex; gap: 8px; }
        .sub-actions button {
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
        }
        .btn-edit { background: #e3f2fd; color: #1976d2; }
        .btn-edit:hover { background: #bbdefb; }
        .btn-cancel { background: #fff3e0; color: #f57c00; }
        .btn-cancel:hover { background: #ffe0b2; }
        .btn-delete { background: #ffebee; color: #c62828; }
        .btn-delete:hover { background: #ffcdd2; }
        .sub-note { margin-top: 10px; font-size: 13px; color: #888; font-style: italic; }

        /* 弹窗 */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 200;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay.active { display: flex; }
        .modal {
            background: white;
            border-radius: 16px;
            padding: 24px;
            width: 100%;
            max-width: 420px;
            max-height: 90vh;
            overflow-y: auto;
            margin: 20px;
        }
        .modal h2 { margin-bottom: 20px; font-size: 18px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 6px; font-size: 14px; color: #555; }
        .form-group input, .form-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
        }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #667eea; }
        .form-group input[type="checkbox"] { width: auto; margin-right: 8px; }
        .checkbox-label { display: flex; align-items: center; cursor: pointer; }
        .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
        .modal-actions button { flex: 1; padding: 12px; border-radius: 8px; font-size: 14px; cursor: pointer; }
        .btn-save { background: #667eea; color: white; border: none; }
        .btn-save:hover { background: #5a6fd6; }
        .btn-close { background: #f5f5f5; color: #666; border: none; }
        .btn-close:hover { background: #e0e0e0; }

        /* 空状态 */
        .empty {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }

        /* 响应式 */
        @media (max-width: 600px) {
            .header { padding: 16px; }
            .header h1 { font-size: 18px; }
            .filters { flex-direction: column; }
            .filters select { width: 100%; }
            .stats { flex-direction: column; gap: 12px; }
            .sub-header { flex-direction: column; gap: 12px; }
            .sub-actions { width: 100%; }
            .sub-actions button { flex: 1; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>卡片订阅小本本</h1>
        <div class="header-actions">
            <button class="btn btn-primary" onclick="openModal()">+ 添加订阅</button>
            <button class="btn btn-secondary" onclick="logout()">退出</button>
        </div>
    </div>

    <div class="container">
        <div class="filters">
            <select id="filterCard" onchange="applyFilters()">
                <option value="">全部卡片</option>
            </select>
            <select id="filterService" onchange="applyFilters()">
                <option value="">全部服务</option>
            </select>
            <select id="filterStatus" onchange="applyFilters()">
                <option value="">全部状态</option>
                <option value="active">活跃</option>
                <option value="cancelled">已取消</option>
            </select>
        </div>

        <div class="stats" id="stats"></div>

        <div class="sub-list" id="subList"></div>
    </div>

    <!-- 添加/编辑弹窗 -->
    <div class="modal-overlay" id="modalOverlay" onclick="closeModal(event)">
        <div class="modal" onclick="event.stopPropagation()">
            <h2 id="modalTitle">添加订阅</h2>
            <form id="subForm" onsubmit="saveSubscription(event)">
                <input type="hidden" id="subId">
                <div class="form-group">
                    <label>卡片代号</label>
                    <input type="text" id="cardInput" list="cardList" required placeholder="如: 1234-主力卡">
                    <datalist id="cardList"></datalist>
                </div>
                <div class="form-group">
                    <label>服务代号</label>
                    <input type="text" id="serviceInput" list="serviceList" required placeholder="如: 视频1">
                    <datalist id="serviceList"></datalist>
                </div>
                <div class="form-group">
                    <label>账号代号</label>
                    <input type="text" id="accountInput" list="accountList" required placeholder="如: A1">
                    <datalist id="accountList"></datalist>
                </div>
                <div class="form-group">
                    <label>绑定时间</label>
                    <input type="date" id="bindTimeInput" required>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="autoRenewInput">
                        自动扣费
                    </label>
                </div>
                <div class="form-group">
                    <label>备注（可选）</label>
                    <input type="text" id="noteInput" placeholder="备注信息">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-close" onclick="closeModal()">取消</button>
                    <button type="submit" class="btn-save">保存</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        let subscriptions = [];
        let allCards = [];
        let allServices = [];
        let allAccounts = [];

        // 加载数据
        async function loadData() {
            try {
                const res = await fetch('/api/subscriptions');
                subscriptions = await res.json();

                // 提取唯一值用于筛选和自动补全
                allCards = [...new Set(subscriptions.map(s => s.card))];
                allServices = [...new Set(subscriptions.map(s => s.service))];
                allAccounts = [...new Set(subscriptions.map(s => s.account))];

                updateFilters();
                updateDatalist();
                applyFilters();
            } catch (e) {
                console.error('加载失败:', e);
            }
        }

        // 更新筛选下拉框
        function updateFilters() {
            const cardFilter = document.getElementById('filterCard');
            const serviceFilter = document.getElementById('filterService');

            const currentCard = cardFilter.value;
            const currentService = serviceFilter.value;

            cardFilter.innerHTML = '<option value="">全部卡片</option>' +
                allCards.map(c => '<option value="' + c + '">' + c + '</option>').join('');
            serviceFilter.innerHTML = '<option value="">全部服务</option>' +
                allServices.map(s => '<option value="' + s + '">' + s + '</option>').join('');

            cardFilter.value = currentCard;
            serviceFilter.value = currentService;
        }

        // 更新自动补全列表
        function updateDatalist() {
            document.getElementById('cardList').innerHTML = allCards.map(c => '<option value="' + c + '">').join('');
            document.getElementById('serviceList').innerHTML = allServices.map(s => '<option value="' + s + '">').join('');
            document.getElementById('accountList').innerHTML = allAccounts.map(a => '<option value="' + a + '">').join('');
        }

        // 应用筛选
        function applyFilters() {
            const card = document.getElementById('filterCard').value;
            const service = document.getElementById('filterService').value;
            const status = document.getElementById('filterStatus').value;

            let filtered = subscriptions;

            if (card) filtered = filtered.filter(s => s.card === card);
            if (service) filtered = filtered.filter(s => s.service === service);
            if (status === 'active') filtered = filtered.filter(s => !s.cancel_time);
            if (status === 'cancelled') filtered = filtered.filter(s => s.cancel_time);

            renderList(filtered);
            renderStats(filtered, card, service);
        }

        // 渲染列表
        function renderList(data) {
            const container = document.getElementById('subList');

            if (data.length === 0) {
                container.innerHTML = '<div class="empty"><div class="empty-icon">📋</div><p>暂无订阅记录</p></div>';
                return;
            }

            container.innerHTML = data.map(sub => {
                const isCancelled = !!sub.cancel_time;
                return '<div class="sub-card ' + (isCancelled ? 'cancelled' : '') + '">' +
                    '<div class="sub-header">' +
                        '<div class="sub-tags">' +
                            '<span class="tag tag-card">' + escapeHtml(sub.card) + '</span>' +
                            '<span class="tag tag-service">' + escapeHtml(sub.service) + '</span>' +
                            '<span class="tag tag-account">' + escapeHtml(sub.account) + '</span>' +
                            (isCancelled ? '<span class="tag tag-cancelled">已取消</span>' : '') +
                        '</div>' +
                        '<div class="sub-actions">' +
                            (isCancelled ? '' : '<button class="btn-edit" onclick="editSub(' + sub.id + ')">编辑</button>') +
                            (isCancelled ? '' : '<button class="btn-cancel" onclick="cancelSub(' + sub.id + ')">取消订阅</button>') +
                            '<button class="btn-delete" onclick="deleteSub(' + sub.id + ')">删除</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="sub-info">' +
                        '<span>绑定: ' + sub.bind_time + '</span>' +
                        (isCancelled ? '<span>取消: ' + sub.cancel_time + '</span>' : '') +
                        '<span class="' + (sub.auto_renew ? 'auto-renew' : 'no-auto-renew') + '">' +
                            '自动扣费: ' + (sub.auto_renew ? '是' : '否') +
                        '</span>' +
                    '</div>' +
                    (sub.note ? '<div class="sub-note">' + escapeHtml(sub.note) + '</div>' : '') +
                '</div>';
            }).join('');
        }

        // 渲染统计
        function renderStats(data, filterCard, filterService) {
            const container = document.getElementById('stats');
            const activeCount = data.filter(s => !s.cancel_time).length;
            const uniqueServices = new Set(data.map(s => s.service)).size;
            const uniqueAccounts = new Set(data.map(s => s.account)).size;

            let html = '<div class="stat-item">总记录: <strong>' + data.length + '</strong></div>' +
                '<div class="stat-item">活跃: <strong>' + activeCount + '</strong></div>' +
                '<div class="stat-item">服务数: <strong>' + uniqueServices + '</strong></div>' +
                '<div class="stat-item">账号数: <strong>' + uniqueAccounts + '</strong></div>';

            container.innerHTML = html;
        }

        // 打开弹窗
        function openModal(sub = null) {
            document.getElementById('modalOverlay').classList.add('active');
            document.getElementById('modalTitle').textContent = sub ? '编辑订阅' : '添加订阅';

            if (sub) {
                document.getElementById('subId').value = sub.id;
                document.getElementById('cardInput').value = sub.card;
                document.getElementById('serviceInput').value = sub.service;
                document.getElementById('accountInput').value = sub.account;
                document.getElementById('bindTimeInput').value = sub.bind_time;
                document.getElementById('autoRenewInput').checked = sub.auto_renew;
                document.getElementById('noteInput').value = sub.note || '';
            } else {
                document.getElementById('subForm').reset();
                document.getElementById('subId').value = '';
                document.getElementById('bindTimeInput').value = new Date().toISOString().split('T')[0];
            }
        }

        // 关闭弹窗
        function closeModal(event) {
            if (!event || event.target === document.getElementById('modalOverlay')) {
                document.getElementById('modalOverlay').classList.remove('active');
            }
        }

        // 保存订阅
        async function saveSubscription(event) {
            event.preventDefault();

            const id = document.getElementById('subId').value;
            const data = {
                card: document.getElementById('cardInput').value.trim(),
                service: document.getElementById('serviceInput').value.trim(),
                account: document.getElementById('accountInput').value.trim(),
                bind_time: document.getElementById('bindTimeInput').value,
                auto_renew: document.getElementById('autoRenewInput').checked ? 1 : 0,
                note: document.getElementById('noteInput').value.trim()
            };

            try {
                const url = id ? '/api/subscriptions/' + id : '/api/subscriptions';
                const method = id ? 'PUT' : 'POST';

                await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                closeModal();
                loadData();
            } catch (e) {
                alert('保存失败: ' + e.message);
            }
        }

        // 编辑订阅
        function editSub(id) {
            const sub = subscriptions.find(s => s.id === id);
            if (sub) openModal(sub);
        }

        // 取消订阅
        async function cancelSub(id) {
            if (!confirm('确定要取消此订阅吗？')) return;

            try {
                await fetch('/api/subscriptions/' + id + '/cancel', { method: 'POST' });
                loadData();
            } catch (e) {
                alert('操作失败: ' + e.message);
            }
        }

        // 删除订阅
        async function deleteSub(id) {
            if (!confirm('确定要删除此记录吗？此操作不可恢复。')) return;

            try {
                await fetch('/api/subscriptions/' + id, { method: 'DELETE' });
                loadData();
            } catch (e) {
                alert('删除失败: ' + e.message);
            }
        }

        // 退出登录
        function logout() {
            document.cookie = 'card_auth=; Max-Age=0; path=/';
            location.href = '/login';
        }

        // HTML 转义
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // 初始化
        loadData();
    </script>
</body>
</html>`;

// Worker 主逻辑
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // 验证密码（从环境变量获取，必须配置）
        const PASSWORD = env.AUTH_PASSWORD;

        // 未配置密码时显示错误页面
        if (!PASSWORD) {
            return new Response(errorPage, {
                status: 500,
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        // 检查登录状态
        const cookies = parseCookies(request.headers.get('Cookie') || '');
        const isLoggedIn = cookies[AUTH_COOKIE_NAME] === hashPassword(PASSWORD);

        // 登录页面
        if (path === '/login') {
            if (method === 'GET') {
                return new Response(loginPage, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
            }
            if (method === 'POST') {
                const formData = await request.formData();
                const password = formData.get('password');

                if (password === PASSWORD) {
                    return new Response(null, {
                        status: 302,
                        headers: {
                            'Location': '/',
                            'Set-Cookie': `${AUTH_COOKIE_NAME}=${hashPassword(PASSWORD)}; Path=/; HttpOnly; Max-Age=${AUTH_MAX_AGE}; SameSite=Strict`
                        }
                    });
                }
                return new Response(null, { status: 302, headers: { 'Location': '/login?error=1' } });
            }
        }

        // 未登录重定向
        if (!isLoggedIn) {
            if (path.startsWith('/api/')) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return new Response(null, { status: 302, headers: { 'Location': '/login' } });
        }

        // 主页
        if (path === '/' && method === 'GET') {
            return new Response(mainPage, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }

        // API 路由
        if (path === '/api/subscriptions' && method === 'GET') {
            const results = await env.DB.prepare('SELECT * FROM subscriptions ORDER BY created_at DESC').all();
            return jsonResponse(results.results);
        }

        if (path === '/api/subscriptions' && method === 'POST') {
            const data = await request.json();
            await env.DB.prepare(
                'INSERT INTO subscriptions (card, account, service, bind_time, auto_renew, note) VALUES (?, ?, ?, ?, ?, ?)'
            ).bind(data.card, data.account, data.service, data.bind_time, data.auto_renew, data.note || null).run();
            return jsonResponse({ success: true });
        }

        const subMatch = path.match(/^\/api\/subscriptions\/(\d+)$/);
        if (subMatch) {
            const id = subMatch[1];

            if (method === 'PUT') {
                const data = await request.json();
                await env.DB.prepare(
                    'UPDATE subscriptions SET card=?, account=?, service=?, bind_time=?, auto_renew=?, note=? WHERE id=?'
                ).bind(data.card, data.account, data.service, data.bind_time, data.auto_renew, data.note || null, id).run();
                return jsonResponse({ success: true });
            }

            if (method === 'DELETE') {
                await env.DB.prepare('DELETE FROM subscriptions WHERE id=?').bind(id).run();
                return jsonResponse({ success: true });
            }
        }

        const cancelMatch = path.match(/^\/api\/subscriptions\/(\d+)\/cancel$/);
        if (cancelMatch && method === 'POST') {
            const id = cancelMatch[1];
            const today = new Date().toISOString().split('T')[0];
            await env.DB.prepare('UPDATE subscriptions SET cancel_time=? WHERE id=?').bind(today, id).run();
            return jsonResponse({ success: true });
        }

        return new Response('Not Found', { status: 404 });
    }
};

// 辅助函数
function parseCookies(cookieStr) {
    const cookies = {};
    cookieStr.split(';').forEach(pair => {
        const [key, value] = pair.trim().split('=');
        if (key) cookies[key] = value;
    });
    return cookies;
}

function hashPassword(password) {
    // 简单哈希，生产环境建议使用更安全的方式
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

function jsonResponse(data) {
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}
