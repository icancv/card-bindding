// Overview page template - Card-based summary view

export const overviewPage = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>卡片订阅小本本</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💳</text></svg>">
    <style>
        :root {
            --bg-body: #f5f7fa;
            --bg-primary: white;
            --bg-secondary: #f5f5f5;
            --bg-gradient-start: #667eea;
            --bg-gradient-end: #764ba2;
            --text-primary: #333;
            --text-secondary: #666;
            --text-muted: #999;
            --border-color: #e0e0e0;
            --shadow-color: rgba(0,0,0,0.06);
            --shadow-hover: rgba(0,0,0,0.1);
            --accent-color: #667eea;
            --accent-hover: #5a6fd6;
            --success-color: #388e3c;
            --success-bg: #e8f5e9;
            --warning-color: #f57c00;
            --warning-bg: #fff3e0;
            --error-color: #c62828;
            --error-bg: #ffebee;
            --info-color: #1976d2;
            --info-bg: #e8f4fd;
            --purple-color: #7b1fa2;
            --purple-bg: #f3e5f5;
        }

        [data-theme="dark"] {
            --bg-body: #1a202c;
            --bg-primary: #2d3748;
            --bg-secondary: #4a5568;
            --text-primary: #e2e8f0;
            --text-secondary: #a0aec0;
            --text-muted: #718096;
            --border-color: #4a5568;
            --shadow-color: rgba(0,0,0,0.3);
            --shadow-hover: rgba(0,0,0,0.4);
            --success-bg: #276749;
            --success-color: #9ae6b4;
            --warning-bg: #744210;
            --warning-color: #fbd38d;
            --error-bg: #742a2a;
            --error-color: #feb2b2;
            --info-bg: #2c5282;
            --info-color: #90cdf4;
            --purple-bg: #553c9a;
            --purple-color: #d6bcfa;
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) {
                --bg-body: #1a202c;
                --bg-primary: #2d3748;
                --bg-secondary: #4a5568;
                --text-primary: #e2e8f0;
                --text-secondary: #a0aec0;
                --text-muted: #718096;
                --border-color: #4a5568;
                --shadow-color: rgba(0,0,0,0.3);
                --shadow-hover: rgba(0,0,0,0.4);
                --success-bg: #276749;
                --success-color: #9ae6b4;
                --warning-bg: #744210;
                --warning-color: #fbd38d;
                --error-bg: #742a2a;
                --error-color: #feb2b2;
                --info-bg: #2c5282;
                --info-color: #90cdf4;
                --purple-bg: #553c9a;
                --purple-color: #d6bcfa;
            }
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-body);
            min-height: 100vh;
            color: var(--text-primary);
            display: flex;
            flex-direction: column;
        }

        .header {
            background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
            color: white;
            padding: 20px;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .header-inner {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 { font-size: 20px; }
        .header-actions { display: flex; gap: 12px; align-items: center; }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            text-decoration: none;
        }
        .btn-primary { background: white; color: #667eea; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .btn-secondary { background: rgba(255,255,255,0.2); color: white; }
        .btn-secondary:hover { background: rgba(255,255,255,0.3); }
        .btn-active { background: white; color: #667eea; }
        .btn-icon {
            padding: 8px;
            background: rgba(255,255,255,0.2);
            border-radius: 8px;
            cursor: pointer;
            border: none;
            color: white;
            font-size: 18px;
            line-height: 1;
        }
        .btn-icon:hover { background: rgba(255,255,255,0.3); }

        .container { max-width: 1000px; margin: 0 auto; padding: 20px; flex: 1; }

        /* Summary stats */
        .summary {
            background: var(--bg-primary);
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px var(--shadow-color);
            display: flex;
            justify-content: space-between;
            gap: 24px;
            flex-wrap: wrap;
        }
        .summary-item { font-size: 14px; color: var(--text-secondary); flex: 1; text-align: center; }
        .summary-item strong { color: var(--accent-color); font-size: 18px; margin-right: 4px; }

        /* Card grid */
        .card-grid {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        /* Card item - horizontal layout */
        .card-item {
            background: var(--bg-primary);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px var(--shadow-color);
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            gap: 24px;
            align-items: center;
        }
        .card-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px var(--shadow-hover);
        }

        .card-left {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 180px;
            flex-shrink: 0;
        }
        .card-icon { font-size: 32px; }
        .card-info { display: flex; flex-direction: column; gap: 4px; }
        .card-name {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
        }
        .card-stats {
            font-size: 12px;
            color: var(--text-muted);
        }
        .stat-active { color: var(--success-color); }

        .card-middle {
            flex: 1;
            display: flex;
            gap: 32px;
            min-width: 0;
        }
        .card-section {
            flex: 1;
            min-width: 0;
        }
        .card-section-title {
            font-size: 11px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .tag-list {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        .tag {
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        .tag-service { background: var(--purple-bg); color: var(--purple-color); }
        .tag-account { background: var(--success-bg); color: var(--success-color); }
        .tag-count {
            font-size: 10px;
            opacity: 0.8;
            margin-left: 2px;
        }

        .card-right {
            flex-shrink: 0;
        }
        .card-link {
            color: var(--accent-color);
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            transition: gap 0.2s;
        }
        .card-link:hover { gap: 8px; }

        @media (max-width: 768px) {
            .card-item { flex-direction: column; align-items: stretch; gap: 16px; }
            .card-left { min-width: auto; }
            .card-middle { flex-direction: column; gap: 16px; }
            .card-right { align-self: flex-end; }
        }

        /* Empty state */
        .empty {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-muted);
        }
        .empty-icon { font-size: 64px; margin-bottom: 16px; }
        .empty p { margin-bottom: 20px; }
        .empty a {
            color: var(--accent-color);
            text-decoration: none;
        }

        /* Loading skeleton */
        .skeleton {
            background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 50%, var(--bg-secondary) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 8px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .skeleton-card { min-height: 200px; border-radius: 16px; }

        /* Responsive */
        @media (max-width: 768px) {
            .header-actions { flex-wrap: wrap; }
        }
        @media (max-width: 600px) {
            .header { padding: 16px; }
            .header-inner { flex-wrap: wrap; gap: 12px; }
            .header h1 { font-size: 18px; }
            .header-actions { width: 100%; justify-content: center; gap: 8px; }
            .header-actions .btn { padding: 8px 12px; font-size: 13px; }
            .summary { flex-direction: column; gap: 12px; }
            .footer-inner { flex-direction: column; text-align: center; }
        }

        /* Footer */
        .footer {
            background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
            padding: 20px;
            margin-top: auto;
        }
        .footer-inner {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 13px;
            color: rgba(255,255,255,0.8);
        }
        .footer a {
            color: white;
            text-decoration: none;
            transition: opacity 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .footer a:hover { opacity: 0.8; }
        .footer-links { display: flex; gap: 16px; align-items: center; }
        .github-icon { width: 18px; height: 18px; fill: white; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-inner">
            <h1>卡片订阅小本本</h1>
            <div class="header-actions">
                <a href="/" class="btn btn-active">概览</a>
                <a href="/detail" class="btn btn-secondary">详情</a>
                <button class="btn-icon" onclick="toggleTheme()" title="切换主题">🌓</button>
                <button class="btn btn-secondary" onclick="logout()">退出</button>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="summary" id="summary">
            <div class="summary-item">加载中...</div>
        </div>

        <div class="card-grid" id="cardGrid">
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card"></div>
        </div>
    </div>

    <script>
        // Theme handling
        function toggleTheme() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            let next;
            if (current === 'dark') next = 'light';
            else if (current === 'light') next = 'dark';
            else next = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        }

        function initTheme() {
            const saved = localStorage.getItem('theme');
            if (saved) document.documentElement.setAttribute('data-theme', saved);
        }
        initTheme();

        // Logout
        function logout() {
            document.cookie = 'card_auth=; Max-Age=0; path=/';
            document.cookie = 'csrf_token=; Max-Age=0; path=/';
            location.href = '/login';
        }

        // HTML escape
        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Load overview data
        async function loadOverview() {
            try {
                const res = await fetch('/api/subscriptions/overview');
                const data = await res.json();
                renderSummary(data.summary);
                renderCards(data.cards);
            } catch (e) {
                console.error('加载失败:', e);
                document.getElementById('cardGrid').innerHTML =
                    '<div class="empty"><div class="empty-icon">❌</div><p>加载失败，请刷新重试</p></div>';
            }
        }

        // Render summary
        function renderSummary(summary) {
            const container = document.getElementById('summary');
            container.innerHTML =
                '<div class="summary-item">卡片 <strong>' + summary.cardCount + '</strong> 张</div>' +
                '<div class="summary-item">服务 <strong>' + summary.serviceCount + '</strong> 个</div>' +
                '<div class="summary-item">账号 <strong>' + summary.accountCount + '</strong> 个</div>' +
                '<div class="summary-item">活跃订阅 <strong>' + summary.activeCount + '</strong> 条</div>';
        }

        // Render card grid
        function renderCards(cards) {
            const container = document.getElementById('cardGrid');

            if (!cards || cards.length === 0) {
                container.innerHTML =
                    '<div class="empty">' +
                        '<div class="empty-icon">📋</div>' +
                        '<p>暂无订阅记录</p>' +
                        '<a href="/detail">前往添加订阅 →</a>' +
                    '</div>';
                return;
            }

            container.innerHTML = cards.map(card => {
                const servicesHtml = card.services.map(s =>
                    '<span class="tag tag-service">' + escapeHtml(s.name) +
                    '<span class="tag-count">(' + s.count + ')</span></span>'
                ).join('');

                const accountsHtml = card.accounts.map(a =>
                    '<span class="tag tag-account">' + escapeHtml(a) + '</span>'
                ).join('');

                return '<div class="card-item">' +
                    '<div class="card-left">' +
                        '<span class="card-icon">💳</span>' +
                        '<div class="card-info">' +
                            '<span class="card-name">' + escapeHtml(card.name) + '</span>' +
                            '<span class="card-stats"><span class="stat-active">活跃 ' + card.activeCount + '</span> · 已取消 ' + card.cancelledCount + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="card-middle">' +
                        '<div class="card-section">' +
                            '<div class="card-section-title">绑定服务</div>' +
                            '<div class="tag-list">' + (servicesHtml || '<span style="color:var(--text-muted)">无</span>') + '</div>' +
                        '</div>' +
                        '<div class="card-section">' +
                            '<div class="card-section-title">关联账号</div>' +
                            '<div class="tag-list">' + (accountsHtml || '<span style="color:var(--text-muted)">无</span>') + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="card-right">' +
                        '<a href="/detail?card=' + encodeURIComponent(card.name) + '" class="card-link">详情 →</a>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        // Initialize
        loadOverview();
    </script>

    <footer class="footer">
        <div class="footer-inner">
            <div>&copy; 2026 卡片订阅小本本 · MIT License · v0.0.1</div>
            <div class="footer-links">
                <a href="https://github.com/icancv/card-bindding" target="_blank">
                    <svg class="github-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub
                </a>
            </div>
        </div>
    </footer>
</body>
</html>`;
