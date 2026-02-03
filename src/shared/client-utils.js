// Shared client-side utilities - JavaScript functions embedded as strings

// Card gradient presets
export const CARD_GRADIENTS = [
    'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    'linear-gradient(135deg, #ec008c 0%, #fc6767 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
];

// Client-side utilities as script string
export const clientUtils = `
    // Card gradient presets
    var CARD_GRADIENTS = ${JSON.stringify(CARD_GRADIENTS)};

    // Deterministic color index from card name (hash-based)
    function getCardColorIndex(name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            hash = ((hash << 5) - hash) + name.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash) % CARD_GRADIENTS.length;
    }

    function getCardGradient(name) {
        return CARD_GRADIENTS[getCardColorIndex(name)];
    }

    // Parse card name to extract bank name and number
    function parseCardName(name) {
        var match = name.match(/^(.+?)\\\\s+(\\\\d{4,})$/);
        if (match) return { bankName: match[1], number: match[2] };
        return { bankName: name, number: '' };
    }

    // HTML escape utility
    function escapeHtml(text) {
        if (!text) return '';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Theme utilities
    function isDark() {
        var theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') return true;
        if (theme === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function updateThemeIcon() {
        var btn = document.getElementById('themeBtn');
        if (btn) btn.textContent = isDark() ? '☀️' : '🌙';
    }

    function toggleTheme() {
        var next = isDark() ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon();
    }

    function initTheme() {
        var saved = localStorage.getItem('theme');
        if (saved) document.documentElement.setAttribute('data-theme', saved);
        updateThemeIcon();
    }

    // Logout utility
    function logout() {
        document.cookie = 'card_auth=; Max-Age=0; path=/';
        document.cookie = 'csrf_token=; Max-Age=0; path=/';
        location.href = '/login';
    }

    // CSRF token getter (cached)
    var _csrfToken = null;
    function getCSRFToken() {
        if (_csrfToken === null) {
            var match = document.cookie.match(/csrf_token=([^;]+)/);
            _csrfToken = match ? match[1] : '';
        }
        return _csrfToken;
    }

    // Initialize theme on load
    initTheme();
`;

// Footer HTML template
export const footerHtml = `
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
`;

// Header HTML template generator
export function getHeaderHtml(activePage) {
    const overviewClass = activePage === 'overview' ? 'btn btn-active' : 'btn btn-secondary';
    const detailClass = activePage === 'detail' ? 'btn btn-active' : 'btn btn-secondary';

    return `
    <div class="header">
        <div class="header-inner">
            <h1><a href="/" style="color:inherit;text-decoration:none">卡片订阅小本本</a></h1>
            <div class="header-actions">
                <a href="/" class="${overviewClass}">概览</a>
                <a href="/detail" class="${detailClass}">详情</a>
                <button class="btn-icon" id="themeBtn" onclick="toggleTheme()" title="切换主题">🌙</button>
                <button class="btn btn-secondary" onclick="logout()">退出</button>
            </div>
        </div>
    </div>
`;
}
