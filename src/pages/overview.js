// Overview page template - Visual credit card grid view

import { sharedStyles } from '../shared/styles.js';
import { clientUtils, footerHtml, getHeaderHtml } from '../shared/client-utils.js';

// Page-specific styles
const pageStyles = `
    /* Page title */
    .page-title { margin-bottom: 24px; }
    .page-title h2 { font-size: 22px; font-weight: 700; color: var(--text-primary); }
    .page-title .subtitle { font-size: 14px; color: var(--text-muted); margin-top: 4px; }

    /* Card grid */
    .card-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
    }

    /* Credit card visual */
    .credit-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 16px;
        padding: 24px;
        color: white;
        position: relative;
        overflow: hidden;
        aspect-ratio: 1.586;
        text-decoration: none;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .credit-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.25);
    }
    /* Decorative circles */
    .credit-card::before {
        content: '';
        position: absolute;
        right: 12%;
        top: 20%;
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
        pointer-events: none;
    }
    .credit-card::after {
        content: '';
        position: absolute;
        right: 2%;
        top: 10%;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: rgba(255,255,255,0.08);
        pointer-events: none;
    }

    .card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;
        z-index: 1;
    }
    .bank-name { font-size: 18px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }

    .card-chip {
        width: 44px;
        height: 32px;
        background: linear-gradient(135deg, #f0c840 0%, #d4a800 100%);
        border-radius: 8px;
        position: relative;
        z-index: 1;
    }

    .card-number {
        font-size: 17px;
        letter-spacing: 3px;
        font-family: 'Courier New', monospace;
        position: relative;
        z-index: 1;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .card-bottom {
        font-size: 13px;
        opacity: 0.85;
        position: relative;
        z-index: 1;
    }

    /* Below card details */
    .card-details { margin-top: 12px; }
    .detail-section { margin-bottom: 10px; }
    .detail-label {
        font-size: 12px;
        color: var(--text-muted);
        margin-bottom: 6px;
    }
    .tag-list { display: flex; flex-wrap: wrap; gap: 6px; }

    /* Skeleton card */
    .skeleton-card { aspect-ratio: 1.586; border-radius: 16px; }

    /* Empty state override */
    .empty { grid-column: 1 / -1; }
    .empty-icon { font-size: 64px; }
    .empty p { margin-bottom: 20px; }

    /* Responsive */
    @media (max-width: 900px) {
        .card-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
        .card-grid { grid-template-columns: 1fr; }
    }
`;

export const overviewPage = `<!DOCTYPE html>
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
${getHeaderHtml('overview')}

    <div class="container">
        <div class="page-title">
            <h2>我的银行卡</h2>
            <p class="subtitle" id="subtitle">加载中...</p>
        </div>

        <div class="card-grid" id="cardGrid">
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card"></div>
        </div>
    </div>

    <script>
${clientUtils}

        // Load overview data
        async function loadOverview() {
            try {
                var res = await fetch('/api/subscriptions/overview');
                var data = await res.json();

                document.getElementById('subtitle').textContent =
                    '共 ' + data.summary.cardCount + ' 张卡片';

                renderCards(data.cards);
            } catch (e) {
                console.error('加载失败:', e);
                document.getElementById('cardGrid').innerHTML =
                    '<div class="empty"><div class="empty-icon">❌</div><p>加载失败，请刷新重试</p></div>';
            }
        }

        // Render card grid
        function renderCards(cards) {
            var container = document.getElementById('cardGrid');

            if (!cards || cards.length === 0) {
                container.innerHTML =
                    '<div class="empty">' +
                        '<div class="empty-icon">📋</div>' +
                        '<p>暂无卡片记录</p>' +
                        '<a href="/detail">前往添加订阅 →</a>' +
                    '</div>';
                return;
            }

            container.innerHTML = cards.map(function(card, i) {
                var parsed = parseCardName(card.name);
                var gradient = getCardGradient(card.name);
                var numberDisplay = parsed.number
                    ? '•••• •••• •••• ' + escapeHtml(parsed.number)
                    : '•••• •••• •••• ••••';

                var servicesHtml = card.services.map(function(s) {
                    return '<span class="tag tag-service">' + escapeHtml(s.name) + ' (' + s.count + ')</span>';
                }).join('');

                var accountsHtml = card.accounts.map(function(a) {
                    return '<span class="tag tag-account">' + escapeHtml(a) + '</span>';
                }).join('');

                return '<div class="card-group">' +
                    '<a href="/detail?card=' + encodeURIComponent(card.name) + '" class="credit-card" style="background:' + gradient + '">' +
                        '<div class="card-top">' +
                            '<span class="bank-name">' + escapeHtml(parsed.bankName) + '</span>' +
                        '</div>' +
                        '<div class="card-chip"></div>' +
                        '<div class="card-number">' + numberDisplay + '</div>' +
                        '<div class="card-bottom">活跃 ' + card.activeCount + ' · 已取消 ' + card.cancelledCount + '</div>' +
                    '</a>' +
                    '<div class="card-details">' +
                        '<div class="detail-section">' +
                            '<div class="detail-label">绑定服务</div>' +
                            '<div class="tag-list">' + (servicesHtml || '<span style="color:var(--text-muted)">无</span>') + '</div>' +
                        '</div>' +
                        '<div class="detail-section">' +
                            '<div class="detail-label">关联账号</div>' +
                            '<div class="tag-list">' + (accountsHtml || '<span style="color:var(--text-muted)">无</span>') + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        // Initialize
        loadOverview();
    </script>

${footerHtml}
</body>
</html>`;
