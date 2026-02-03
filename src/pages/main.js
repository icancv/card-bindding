// Main page template - Table-based detail view with CRUD

import { sharedStyles } from '../shared/styles.js';
import { clientUtils, footerHtml, getHeaderHtml } from '../shared/client-utils.js';

// Page-specific styles
const pageStyles = `
    /* Page title */
    .page-title {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
    }
    .page-title h2 { font-size: 22px; font-weight: 700; color: var(--text-primary); }
    .page-title .subtitle { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
    .title-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
    }
    .title-actions .action-btn {
        padding: 8px 16px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-primary);
        color: var(--text-secondary);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
    }
    .title-actions .action-btn:hover {
        border-color: var(--accent-color);
        color: var(--accent-color);
    }
    .title-actions .action-btn-primary {
        background: var(--accent-color);
        color: white;
        border-color: var(--accent-color);
    }
    .title-actions .action-btn-primary:hover {
        background: var(--accent-hover);
        border-color: var(--accent-hover);
        color: white;
    }

    /* Filters */
    .filters {
        background: var(--bg-primary);
        padding: 16px 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        box-shadow: 0 2px 8px var(--shadow-color);
    }
    .filters input, .filters select {
        padding: 10px 14px;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 14px;
        background: var(--bg-primary);
        color: var(--text-primary);
        cursor: pointer;
        min-width: 140px;
    }
    .filters input { min-width: 200px; cursor: text; }
    .filters input:focus, .filters select:focus { outline: none; border-color: var(--accent-color); }

    /* Data table */
    .table-card {
        background: var(--bg-primary);
        border-radius: 12px;
        box-shadow: 0 2px 8px var(--shadow-color);
        overflow: hidden;
    }
    .data-table {
        width: 100%;
        border-collapse: collapse;
    }
    .data-table thead th {
        text-align: left;
        padding: 16px 20px;
        font-size: 13px;
        font-weight: 600;
        color: var(--text-muted);
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
        white-space: nowrap;
    }
    .data-table tbody tr {
        border-bottom: 1px solid var(--border-color);
        transition: background 0.15s;
    }
    .data-table tbody tr:last-child { border-bottom: none; }
    .data-table tbody tr:hover { background: var(--bg-secondary); }
    .data-table tbody td {
        padding: 16px 20px;
        font-size: 14px;
        color: var(--text-primary);
        vertical-align: middle;
    }
    .data-table tbody tr.cancelled { opacity: 0.65; }

    /* Bank cell with icon */
    .bank-cell {
        display: flex;
        align-items: center;
        gap: 12px;
        white-space: nowrap;
    }
    .bank-icon {
        width: 36px;
        height: 24px;
        border-radius: 6px;
        flex-shrink: 0;
    }

    /* Card number */
    .card-num {
        color: var(--text-secondary);
        font-family: 'Courier New', monospace;
        letter-spacing: 1px;
        white-space: nowrap;
    }

    /* Status */
    .status { font-size: 13px; font-weight: 500; white-space: nowrap; }
    .status-active { color: var(--accent-color); }
    .status-cancelled { color: var(--text-muted); }

    /* Row actions */
    .row-actions { display: flex; gap: 6px; white-space: nowrap; }
    .row-actions button {
        padding: 4px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: filter 0.2s;
    }
    .row-actions button:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-edit { background: var(--info-bg); color: var(--info-color); }
    .btn-edit:hover:not(:disabled) { filter: brightness(0.95); }
    .btn-cancel-sub { background: var(--warning-bg); color: var(--warning-color); }
    .btn-cancel-sub:hover:not(:disabled) { filter: brightness(0.95); }
    .btn-delete { background: var(--error-bg); color: var(--error-color); }
    .btn-delete:hover:not(:disabled) { filter: brightness(0.95); }

    /* Pagination */
    .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        flex-wrap: wrap;
        gap: 12px;
    }
    .page-info {
        font-size: 14px;
        color: var(--text-muted);
    }
    .page-nav {
        display: flex;
        gap: 6px;
        align-items: center;
    }
    .page-nav button {
        min-width: 36px;
        height: 36px;
        padding: 0 10px;
        border: none;
        border-radius: 8px;
        background: var(--bg-primary);
        color: var(--text-primary);
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
        box-shadow: 0 1px 3px var(--shadow-color);
    }
    .page-nav button:hover:not(:disabled):not(.active) {
        background: var(--bg-secondary);
    }
    .page-nav button:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-nav button.active {
        background: var(--accent-color);
        color: white;
    }
    .page-nav .page-ellipsis {
        color: var(--text-muted);
        font-size: 14px;
        padding: 0 4px;
    }

    /* Modal */
    .modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--overlay-bg);
        z-index: 200;
        align-items: center;
        justify-content: center;
    }
    .modal-overlay.active { display: flex; }
    .modal {
        background: var(--bg-primary);
        border-radius: 16px;
        padding: 24px;
        width: 100%;
        max-width: 420px;
        max-height: 90vh;
        overflow-y: auto;
        margin: 20px;
    }
    .modal h2 { margin-bottom: 20px; font-size: 18px; color: var(--text-primary); }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 6px; font-size: 14px; color: var(--text-secondary); }
    .form-group input, .form-group select {
        width: 100%;
        padding: 12px;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 14px;
        background: var(--bg-primary);
        color: var(--text-primary);
    }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: var(--accent-color); }
    .form-group input[type="checkbox"] { width: auto; margin-right: 8px; }
    .checkbox-label { display: flex; align-items: center; cursor: pointer; }
    .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
    .modal-actions button { flex: 1; padding: 12px; border-radius: 8px; font-size: 14px; cursor: pointer; }
    .btn-save { background: var(--accent-color); color: white; border: none; }
    .btn-save:hover:not(:disabled) { background: var(--accent-hover); }
    .btn-close { background: var(--bg-secondary); color: var(--text-secondary); border: none; }
    .btn-close:hover:not(:disabled) { filter: brightness(0.95); }

    /* Confirm dialog */
    .confirm-dialog .modal { max-width: 360px; text-align: center; }
    .confirm-dialog .confirm-title { font-size: 18px; margin-bottom: 12px; color: var(--text-primary); }
    .confirm-dialog .confirm-message { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; }
    .confirm-dialog .modal-actions button { padding: 12px 24px; }
    .btn-confirm-danger { background: var(--error-color); color: white; border: none; }
    .btn-confirm-danger:hover { filter: brightness(0.9); }

    /* Toast */
    .toast-container {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 300;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .toast {
        padding: 14px 20px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 320px;
    }
    .toast.success { background: var(--toast-success); }
    .toast.error { background: var(--toast-error); }
    .toast.hiding { animation: slideOut 0.3s ease forwards; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }

    /* Skeleton row */
    .skeleton-row { height: 60px; margin-bottom: 1px; }

    /* File input hidden */
    .hidden-input { display: none; }

    /* Mobile table */
    .mobile-cards { display: none; }
    .mobile-card {
        background: var(--bg-primary);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px var(--shadow-color);
    }
    .mobile-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    .mobile-card-body {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 13px;
        color: var(--text-secondary);
    }
    .mobile-card-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .mobile-card-label { color: var(--text-muted); font-size: 12px; }
    .mobile-card-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--border-color);
    }
    .mobile-card-actions button {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .modal { max-width: 100%; margin: 10px; }
        .confirm-dialog .modal { max-width: 100%; }
        .toast-container { left: 20px; right: 20px; }
        .toast { max-width: 100%; }
        .table-card { display: none; }
        .mobile-cards { display: block; }
    }
    @media (max-width: 600px) {
        .filters { flex-direction: column; }
        .filters input, .filters select { width: 100%; min-width: auto; }
        .page-title { flex-direction: column; }
        .title-actions { width: 100%; }
        .title-actions .action-btn { flex: 1; text-align: center; }
        .modal { margin: 0; border-radius: 0; max-height: 100vh; }
        .toast-container { top: auto; bottom: 20px; }
    }
`;

export const mainPage = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>卡片订阅小本本</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💳</text></svg>">
    <style>
${sharedStyles}
${pageStyles}
    </style>
</head>
<body>
    <div class="toast-container" id="toastContainer"></div>

${getHeaderHtml('detail')}

    <div class="container">
        <div class="page-title">
            <div>
                <h2>银行卡绑定信息</h2>
                <p class="subtitle" id="totalInfo">加载中...</p>
            </div>
            <div class="title-actions">
                <button class="action-btn" onclick="exportData()">导出</button>
                <button class="action-btn" onclick="document.getElementById('importFile').click()">导入</button>
                <input type="file" id="importFile" class="hidden-input" accept=".json" onchange="importData(event)">
                <button class="action-btn action-btn-primary" onclick="openModal()">+ 添加订阅</button>
            </div>
        </div>

        <div class="filters">
            <input type="text" id="searchInput" placeholder="搜索卡片/服务/账号/备注..." oninput="debounceSearch()">
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
            <select id="sortSelect" onchange="applyFilters()">
                <option value="created_at-desc">创建时间 (新到旧)</option>
                <option value="created_at-asc">创建时间 (旧到新)</option>
                <option value="bind_time-desc">绑定时间 (新到旧)</option>
                <option value="bind_time-asc">绑定时间 (旧到新)</option>
                <option value="card-asc">卡片 (A-Z)</option>
                <option value="card-desc">卡片 (Z-A)</option>
                <option value="service-asc">服务 (A-Z)</option>
                <option value="service-desc">服务 (Z-A)</option>
            </select>
        </div>

        <!-- Desktop table -->
        <div class="table-card" id="tableCard">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>银行卡</th>
                        <th>卡号</th>
                        <th>绑定服务</th>
                        <th>关联账号</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    <tr><td colspan="6"><div class="skeleton skeleton-row"></div></td></tr>
                    <tr><td colspan="6"><div class="skeleton skeleton-row"></div></td></tr>
                    <tr><td colspan="6"><div class="skeleton skeleton-row"></div></td></tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile cards -->
        <div class="mobile-cards" id="mobileCards"></div>

        <div class="pagination" id="pagination"></div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" id="modalOverlay" onclick="closeModal(event)">
        <div class="modal" onclick="event.stopPropagation()">
            <h2 id="modalTitle">添加订阅</h2>
            <form id="subForm" onsubmit="saveSubscription(event)">
                <input type="hidden" id="subId">
                <div class="form-group">
                    <label>卡片代号</label>
                    <input type="text" id="cardInput" list="cardList" required placeholder="如: 招商银行 3459">
                    <datalist id="cardList"></datalist>
                </div>
                <div class="form-group">
                    <label>服务代号</label>
                    <input type="text" id="serviceInput" list="serviceList" required placeholder="如: gcp">
                    <datalist id="serviceList"></datalist>
                </div>
                <div class="form-group">
                    <label>账号代号</label>
                    <input type="text" id="accountInput" list="accountList" required placeholder="如: admin">
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
                    <button type="submit" class="btn-save" id="saveBtn">保存</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Confirm Dialog -->
    <div class="modal-overlay confirm-dialog" id="confirmOverlay">
        <div class="modal" onclick="event.stopPropagation()">
            <div class="confirm-title" id="confirmTitle"></div>
            <div class="confirm-message" id="confirmMessage"></div>
            <div class="modal-actions">
                <button type="button" class="btn-close" id="confirmCancel">取消</button>
                <button type="button" class="btn-confirm-danger" id="confirmOk">确认</button>
            </div>
        </div>
    </div>

    <script>
${clientUtils}

        var currentPage = 1;
        var pageSize = 20;
        var totalRecords = 0;
        var allCards = [];
        var allServices = [];
        var allAccounts = [];
        var searchTimeout = null;

        // Toast notification
        function showToast(message, type) {
            type = type || 'success';
            var container = document.getElementById('toastContainer');
            var toast = document.createElement('div');
            toast.className = 'toast ' + type;
            toast.innerHTML = (type === 'success' ? '✓' : '✕') + ' ' + escapeHtml(message);
            container.appendChild(toast);
            setTimeout(function() {
                toast.classList.add('hiding');
                setTimeout(function() { toast.remove(); }, 300);
            }, 3000);
        }

        // Custom confirm dialog
        function showConfirm(title, message) {
            return new Promise(function(resolve) {
                var overlay = document.getElementById('confirmOverlay');
                document.getElementById('confirmTitle').textContent = title;
                document.getElementById('confirmMessage').textContent = message;
                overlay.classList.add('active');

                var okBtn = document.getElementById('confirmOk');
                var cancelBtn = document.getElementById('confirmCancel');

                function cleanup() {
                    overlay.classList.remove('active');
                    okBtn.onclick = null;
                    cancelBtn.onclick = null;
                }

                okBtn.onclick = function() { cleanup(); resolve(true); };
                cancelBtn.onclick = function() { cleanup(); resolve(false); };
            });
        }

        // Fetch with CSRF
        async function fetchWithCSRF(url, options) {
            options = options || {};
            var headers = Object.assign({}, options.headers, { 'X-CSRF-Token': getCSRFToken() });
            return fetch(url, Object.assign({}, options, { headers: headers }));
        }

        // Show loading skeleton
        function showLoading() {
            var tbody = document.getElementById('tableBody');
            tbody.innerHTML = Array(3).fill('<tr><td colspan="6"><div class="skeleton skeleton-row"></div></td></tr>').join('');
            document.getElementById('mobileCards').innerHTML =
                '<div class="skeleton" style="height:120px;margin-bottom:12px;border-radius:12px"></div>'.repeat(3);
        }

        // Load data
        async function loadData() {
            showLoading();
            try {
                var params = new URLSearchParams();
                params.set('page', currentPage);
                params.set('limit', pageSize);

                var search = document.getElementById('searchInput').value.trim();
                if (search) params.set('search', search);

                // Use URL param card filter if set, otherwise use dropdown value
                var card = window.initialCardFilter || document.getElementById('filterCard').value;
                if (card) params.set('card', card);

                var service = document.getElementById('filterService').value;
                if (service) params.set('service', service);

                var status = document.getElementById('filterStatus').value;
                if (status) params.set('status', status);

                var sortVal = document.getElementById('sortSelect').value.split('-');
                params.set('sort', sortVal[0]);
                params.set('order', sortVal[1]);

                var res = await fetch('/api/subscriptions?' + params.toString());
                var result = await res.json();

                totalRecords = result.total;
                renderTable(result.data);
                renderMobileCards(result.data);
                renderTotalInfo(result);
                renderPagination();

                // Load filter options (only once or on full refresh)
                if (allCards.length === 0) await loadFilterOptions();
            } catch (e) {
                console.error('加载失败:', e);
                showToast('加载数据失败', 'error');
            }
        }

        // Load filter options
        async function loadFilterOptions() {
            try {
                var res = await fetch('/api/subscriptions?page=1&limit=1000');
                var result = await res.json();
                var data = result.data || [];

                allCards = []; allServices = []; allAccounts = [];
                var cardSet = {}, serviceSet = {}, accountSet = {};
                data.forEach(function(s) {
                    if (!cardSet[s.card]) { cardSet[s.card] = true; allCards.push(s.card); }
                    if (!serviceSet[s.service]) { serviceSet[s.service] = true; allServices.push(s.service); }
                    if (!accountSet[s.account]) { accountSet[s.account] = true; allAccounts.push(s.account); }
                });
                allCards.sort(); allServices.sort(); allAccounts.sort();

                updateFilterDropdowns();
                updateDatalist();
            } catch (e) {
                console.error('加载筛选选项失败:', e);
            }
        }

        // Update filter dropdowns
        function updateFilterDropdowns() {
            var cardFilter = document.getElementById('filterCard');
            var serviceFilter = document.getElementById('filterService');
            var currentCard = cardFilter.value;
            var currentService = serviceFilter.value;

            cardFilter.innerHTML = '<option value="">全部卡片</option>' +
                allCards.map(function(c) { return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>'; }).join('');
            serviceFilter.innerHTML = '<option value="">全部服务</option>' +
                allServices.map(function(s) { return '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + '</option>'; }).join('');

            // Apply initial card filter from URL param and sync dropdown
            if (window.initialCardFilter) {
                cardFilter.value = window.initialCardFilter;
                window.initialCardFilter = null; // Clear after syncing to dropdown
            } else {
                cardFilter.value = currentCard;
            }
            serviceFilter.value = currentService;
        }

        // Update datalist
        function updateDatalist() {
            document.getElementById('cardList').innerHTML = allCards.map(function(c) { return '<option value="' + escapeHtml(c) + '">'; }).join('');
            document.getElementById('serviceList').innerHTML = allServices.map(function(s) { return '<option value="' + escapeHtml(s) + '">'; }).join('');
            document.getElementById('accountList').innerHTML = allAccounts.map(function(a) { return '<option value="' + escapeHtml(a) + '">'; }).join('');
        }

        // Debounced search
        function debounceSearch() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                currentPage = 1;
                loadData();
            }, 300);
        }

        // Apply filters
        function applyFilters() {
            currentPage = 1;
            loadData();
        }

        // Render total info
        function renderTotalInfo(result) {
            document.getElementById('totalInfo').textContent =
                '共 ' + result.total + ' 条绑定记录';
        }

        // Render table (desktop)
        function renderTable(data) {
            var tbody = document.getElementById('tableBody');

            if (!data || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6"><div class="empty"><div class="empty-icon">📋</div><p>暂无订阅记录</p></div></td></tr>';
                return;
            }

            tbody.innerHTML = data.map(function(sub) {
                var isCancelled = !!sub.cancel_time;
                var parsed = parseCardName(sub.card);
                var gradient = getCardGradient(sub.card);
                var numberDisplay = parsed.number ? '•••• ' + escapeHtml(parsed.number) : '••••';

                return '<tr class="' + (isCancelled ? 'cancelled' : '') + '">' +
                    '<td>' +
                        '<div class="bank-cell">' +
                            '<span class="bank-icon" style="background:' + gradient + '"></span>' +
                            '<span>' + escapeHtml(parsed.bankName) + '</span>' +
                        '</div>' +
                    '</td>' +
                    '<td><span class="card-num">' + numberDisplay + '</span></td>' +
                    '<td><span class="tag tag-service">' + escapeHtml(sub.service) + '</span></td>' +
                    '<td><span class="tag tag-account">' + escapeHtml(sub.account) + '</span></td>' +
                    '<td><span class="status ' + (isCancelled ? 'status-cancelled' : 'status-active') + '">' +
                        (isCancelled ? '已取消' : '活跃') +
                    '</span></td>' +
                    '<td>' +
                        '<div class="row-actions">' +
                            (isCancelled ? '' : '<button class="btn-edit" onclick="editSub(' + sub.id + ')">编辑</button>') +
                            (isCancelled ? '' : '<button class="btn-cancel-sub" onclick="cancelSub(' + sub.id + ')">取消</button>') +
                            '<button class="btn-delete" onclick="deleteSub(' + sub.id + ')">删除</button>' +
                        '</div>' +
                    '</td>' +
                '</tr>';
            }).join('');
        }

        // Render mobile cards
        function renderMobileCards(data) {
            var container = document.getElementById('mobileCards');

            if (!data || data.length === 0) {
                container.innerHTML = '<div class="empty"><div class="empty-icon">📋</div><p>暂无订阅记录</p></div>';
                return;
            }

            container.innerHTML = data.map(function(sub) {
                var isCancelled = !!sub.cancel_time;
                var parsed = parseCardName(sub.card);
                var gradient = getCardGradient(sub.card);

                return '<div class="mobile-card">' +
                    '<div class="mobile-card-header">' +
                        '<div class="bank-cell">' +
                            '<span class="bank-icon" style="background:' + gradient + '"></span>' +
                            '<span>' + escapeHtml(parsed.bankName) + '</span>' +
                        '</div>' +
                        '<span class="status ' + (isCancelled ? 'status-cancelled' : 'status-active') + '">' +
                            (isCancelled ? '已取消' : '活跃') +
                        '</span>' +
                    '</div>' +
                    '<div class="mobile-card-body">' +
                        '<div class="mobile-card-row">' +
                            '<span class="mobile-card-label">绑定服务</span>' +
                            '<span class="tag tag-service">' + escapeHtml(sub.service) + '</span>' +
                        '</div>' +
                        '<div class="mobile-card-row">' +
                            '<span class="mobile-card-label">关联账号</span>' +
                            '<span class="tag tag-account">' + escapeHtml(sub.account) + '</span>' +
                        '</div>' +
                        '<div class="mobile-card-row">' +
                            '<span class="mobile-card-label">绑定时间</span>' +
                            '<span>' + escapeHtml(sub.bind_time) + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="mobile-card-actions">' +
                        (isCancelled ? '' : '<button class="btn-edit" onclick="editSub(' + sub.id + ')">编辑</button>') +
                        (isCancelled ? '' : '<button class="btn-cancel-sub" onclick="cancelSub(' + sub.id + ')">取消</button>') +
                        '<button class="btn-delete" onclick="deleteSub(' + sub.id + ')">删除</button>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        // Render pagination
        function renderPagination() {
            var container = document.getElementById('pagination');
            var totalPages = Math.ceil(totalRecords / pageSize);

            if (totalPages <= 1 && totalRecords <= 0) {
                container.innerHTML = '';
                return;
            }

            var start = (currentPage - 1) * pageSize + 1;
            var end = Math.min(currentPage * pageSize, totalRecords);

            var infoHtml = '<div class="page-info">显示 ' + start + '-' + end + ' 条，共 ' + totalRecords + ' 条</div>';

            if (totalPages <= 1) {
                container.innerHTML = infoHtml;
                return;
            }

            var navHtml = '<div class="page-nav">';
            navHtml += '<button ' + (currentPage <= 1 ? 'disabled' : '') + ' onclick="goToPage(' + (currentPage - 1) + ')">‹</button>';

            var maxVisible = 5;
            var pStart = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            var pEnd = Math.min(totalPages, pStart + maxVisible - 1);
            if (pEnd - pStart < maxVisible - 1) pStart = Math.max(1, pEnd - maxVisible + 1);

            if (pStart > 1) navHtml += '<button onclick="goToPage(1)">1</button>';
            if (pStart > 2) navHtml += '<span class="page-ellipsis">...</span>';

            for (var i = pStart; i <= pEnd; i++) {
                navHtml += '<button class="' + (i === currentPage ? 'active' : '') + '" onclick="goToPage(' + i + ')">' + i + '</button>';
            }

            if (pEnd < totalPages - 1) navHtml += '<span class="page-ellipsis">...</span>';
            if (pEnd < totalPages) navHtml += '<button onclick="goToPage(' + totalPages + ')">' + totalPages + '</button>';

            navHtml += '<button ' + (currentPage >= totalPages ? 'disabled' : '') + ' onclick="goToPage(' + (currentPage + 1) + ')">›</button>';
            navHtml += '</div>';

            container.innerHTML = infoHtml + navHtml;
        }

        function goToPage(page) {
            currentPage = page;
            loadData();
        }

        // Open modal
        function openModal(sub) {
            document.getElementById('modalOverlay').classList.add('active');
            document.getElementById('modalTitle').textContent = sub ? '编辑订阅' : '添加订阅';
            document.getElementById('saveBtn').disabled = false;

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

        // Close modal
        function closeModal(event) {
            if (!event || event.target === document.getElementById('modalOverlay')) {
                document.getElementById('modalOverlay').classList.remove('active');
            }
        }

        // Save subscription
        async function saveSubscription(event) {
            event.preventDefault();
            var saveBtn = document.getElementById('saveBtn');
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<span class="loading-spinner"></span> 保存中...';

            var id = document.getElementById('subId').value;
            var data = {
                card: document.getElementById('cardInput').value.trim(),
                service: document.getElementById('serviceInput').value.trim(),
                account: document.getElementById('accountInput').value.trim(),
                bind_time: document.getElementById('bindTimeInput').value,
                auto_renew: document.getElementById('autoRenewInput').checked ? 1 : 0,
                note: document.getElementById('noteInput').value.trim()
            };

            try {
                var url = id ? '/api/subscriptions/' + id : '/api/subscriptions';
                var method = id ? 'PUT' : 'POST';

                var res = await fetchWithCSRF(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                var result = await res.json();
                if (!res.ok) {
                    throw new Error(result.error || '保存失败');
                }

                closeModal();
                showToast(id ? '订阅已更新' : '订阅已添加', 'success');
                allCards = []; // Force refresh filter options
                loadData();
            } catch (e) {
                showToast('保存失败: ' + e.message, 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = '保存';
            }
        }

        // Edit subscription - optimized to fetch single record
        async function editSub(id) {
            try {
                var res = await fetch('/api/subscriptions/' + id);
                if (!res.ok) {
                    throw new Error('记录不存在');
                }
                var sub = await res.json();
                openModal(sub);
            } catch (e) {
                showToast('加载数据失败: ' + e.message, 'error');
            }
        }

        // Cancel subscription
        async function cancelSub(id) {
            var confirmed = await showConfirm('取消订阅', '确定要取消此订阅吗？');
            if (!confirmed) return;

            try {
                var res = await fetchWithCSRF('/api/subscriptions/' + id + '/cancel', { method: 'POST' });
                var result = await res.json();
                if (!res.ok) throw new Error(result.error || '操作失败');
                showToast('订阅已取消', 'success');
                loadData();
            } catch (e) {
                showToast('操作失败: ' + e.message, 'error');
            }
        }

        // Delete subscription
        async function deleteSub(id) {
            var confirmed = await showConfirm('删除记录', '确定要删除此记录吗？此操作不可恢复。');
            if (!confirmed) return;

            try {
                var res = await fetchWithCSRF('/api/subscriptions/' + id, { method: 'DELETE' });
                var result = await res.json();
                if (!res.ok) throw new Error(result.error || '删除失败');
                showToast('记录已删除', 'success');
                loadData();
            } catch (e) {
                showToast('删除失败: ' + e.message, 'error');
            }
        }

        // Export data
        async function exportData() {
            try {
                var res = await fetch('/api/subscriptions/export');
                var data = await res.json();
                var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'subscriptions_' + new Date().toISOString().split('T')[0] + '.json';
                a.click();
                URL.revokeObjectURL(url);
                showToast('导出成功', 'success');
            } catch (e) {
                showToast('导出失败: ' + e.message, 'error');
            }
        }

        // Import data
        async function importData(event) {
            var file = event.target.files[0];
            if (!file) return;

            try {
                var text = await file.text();
                var data = JSON.parse(text);

                var confirmed = await showConfirm('导入数据', '将导入 ' + data.length + ' 条记录，确认继续？');
                if (!confirmed) {
                    event.target.value = '';
                    return;
                }

                var res = await fetchWithCSRF('/api/subscriptions/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                var result = await res.json();
                if (!res.ok) throw new Error(result.error || '导入失败');
                showToast('成功导入 ' + result.imported + ' 条记录', 'success');
                allCards = [];
                loadData();
            } catch (e) {
                showToast('导入失败: ' + e.message, 'error');
            } finally {
                event.target.value = '';
            }
        }

        // Initialize
        function init() {
            // Check URL params for card filter
            var urlParams = new URLSearchParams(window.location.search);
            var cardParam = urlParams.get('card');
            if (cardParam) {
                // Store for later use when filter options are loaded
                window.initialCardFilter = cardParam;
            }
            loadData();
        }
        init();
    </script>

${footerHtml}
</body>
</html>`;
