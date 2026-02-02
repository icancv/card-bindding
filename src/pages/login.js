// Login page template - with CSRF token support

export function getLoginPage(csrfToken = '') {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>卡片订阅小本本</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💳</text></svg>">
    <style>
        :root {
            --bg-gradient-start: #667eea;
            --bg-gradient-end: #764ba2;
            --bg-primary: white;
            --text-primary: #333;
            --text-secondary: #666;
            --border-color: #e0e0e0;
            --error-color: #e74c3c;
        }
        @media (prefers-color-scheme: dark) {
            :root {
                --bg-gradient-start: #4a5568;
                --bg-gradient-end: #2d3748;
                --bg-primary: #1a202c;
                --text-primary: #e2e8f0;
                --text-secondary: #a0aec0;
                --border-color: #4a5568;
                --error-color: #fc8181;
            }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-box {
            background: var(--bg-primary);
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 360px;
        }
        h1 { text-align: center; color: var(--text-primary); margin-bottom: 30px; font-size: 24px; }
        input[type="password"] {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
            background: var(--bg-primary);
            color: var(--text-primary);
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
        .error { color: var(--error-color); text-align: center; margin-top: 16px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="login-box">
        <h1>卡片订阅小本本</h1>
        <form method="POST" action="/login">
            <input type="hidden" name="csrf_token" value="${csrfToken}">
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
}
