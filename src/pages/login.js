// Login page template - Split screen design with CSRF token support

export function getLoginPage(csrfToken = '') {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>卡片订阅小本本</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💳</text></svg>">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
        }

        /* Left panel - Brand area */
        .left-panel {
            flex: 1;
            background: linear-gradient(180deg, #2563EB 0%, #1E40AF 50%, #1E3A8A 100%);
            padding: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 60px;
        }
        .brand-icon {
            width: 48px;
            height: 48px;
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .brand-icon svg {
            width: 28px;
            height: 28px;
            fill: white;
        }
        .brand-name {
            font-size: 20px;
            font-weight: 600;
            color: white;
        }

        .hero-title {
            margin-bottom: 24px;
        }
        .hero-title h1 {
            font-size: 48px;
            font-weight: 700;
            color: white;
            line-height: 1.2;
        }
        .hero-title .highlight {
            color: #60A5FA;
        }

        .hero-desc {
            font-size: 16px;
            color: rgba(255,255,255,0.85);
            line-height: 1.8;
            margin-bottom: 48px;
            max-width: 360px;
        }

        /* Feature cards */
        .features {
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 100%;
            max-width: 320px;
        }
        .feature-card {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            text-align: left;
        }
        .feature-icon {
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.15);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .feature-icon svg {
            width: 20px;
            height: 20px;
            fill: white;
        }
        .feature-content h3 {
            font-size: 14px;
            font-weight: 600;
            color: white;
            margin-bottom: 4px;
        }
        .feature-content p {
            font-size: 12px;
            color: rgba(255,255,255,0.7);
        }

        /* Right panel - Login form */
        .right-panel {
            flex: 1;
            background: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
        }

        .login-container {
            width: 100%;
            max-width: 400px;
        }

        .login-header {
            text-align: center;
            margin-bottom: 40px;
        }
        .login-header h2 {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 8px;
        }
        .login-header p {
            font-size: 14px;
            color: #718096;
        }

        .form-group {
            margin-bottom: 24px;
        }
        .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #4a5568;
            margin-bottom: 8px;
        }
        .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        .input-icon {
            position: absolute;
            left: 16px;
            width: 20px;
            height: 20px;
            fill: #a0aec0;
            pointer-events: none;
        }
        .input-wrapper input {
            width: 100%;
            padding: 14px 48px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 15px;
            background: white;
            color: #1a202c;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-wrapper input:focus {
            outline: none;
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .input-wrapper input::placeholder {
            color: #a0aec0;
        }
        .toggle-password {
            position: absolute;
            right: 16px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .toggle-password svg {
            width: 20px;
            height: 20px;
            fill: #a0aec0;
            transition: fill 0.2s;
        }
        .toggle-password:hover svg {
            fill: #4a5568;
        }

        .submit-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
        }
        .submit-btn:active {
            transform: translateY(0);
        }

        .security-note {
            text-align: center;
            margin-top: 24px;
            font-size: 13px;
            color: #a0aec0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .security-note svg {
            width: 14px;
            height: 14px;
            fill: #a0aec0;
        }

        .error-message {
            background: #fff5f5;
            border: 1px solid #fed7d7;
            color: #c53030;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 20px;
            text-align: center;
            display: none;
        }
        .error-message.show {
            display: block;
        }

        /* Responsive */
        @media (max-width: 900px) {
            body {
                flex-direction: column;
            }
            .left-panel {
                padding: 40px 30px;
                min-height: auto;
            }
            .hero-title h1 {
                font-size: 36px;
            }
            .features {
                flex-direction: row;
                flex-wrap: wrap;
                max-width: 100%;
            }
            .feature-card {
                flex: 1;
                min-width: 200px;
            }
            .right-panel {
                padding: 40px 30px;
            }
        }
        @media (max-width: 600px) {
            .left-panel {
                padding: 30px 20px;
            }
            .brand {
                margin-bottom: 30px;
            }
            .hero-title h1 {
                font-size: 28px;
            }
            .hero-desc {
                font-size: 14px;
                margin-bottom: 30px;
            }
            .features {
                flex-direction: column;
            }
            .feature-card {
                max-width: 100%;
            }
            .right-panel {
                padding: 30px 20px;
            }
            .login-header h2 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <!-- Left Panel - Brand & Features -->
    <div class="left-panel">
        <div class="brand">
            <div class="brand-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
            </div>
            <span class="brand-name">卡片订阅小本本</span>
        </div>

        <div class="hero-title">
            <h1>轻松记录<br><span class="highlight">卡片绑定</span></h1>
        </div>

        <p class="hero-desc">
            使用代号快速记录每张卡片绑定了哪些服务和账号，再也不用担心忘记绑定关系
        </p>

        <div class="features">
            <div class="feature-card">
                <div class="feature-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/>
                    </svg>
                </div>
                <div class="feature-content">
                    <h3>代号记录</h3>
                    <p>无需完整卡号，用代号即可</p>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                </div>
                <div class="feature-content">
                    <h3>绑定一览</h3>
                    <p>清晰查看服务与账号关联</p>
                </div>
            </div>

            <div class="feature-card">
                <div class="feature-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                </div>
                <div class="feature-content">
                    <h3>私人专属</h3>
                    <p>仅供个人使用的便捷工具</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="right-panel">
        <div class="login-container">
            <div class="login-header">
                <h2>欢迎回来</h2>
                <p>请输入密码以继续</p>
            </div>

            <div class="error-message" id="errorMsg">密码错误，请重试</div>

            <form method="POST" action="/login">
                <input type="hidden" name="csrf_token" value="${csrfToken}">

                <div class="form-group">
                    <label class="form-label">访问密码</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                        <input type="password" id="password" name="password" placeholder="请输入密码" required autofocus>
                        <button type="button" class="toggle-password" onclick="togglePassword()">
                            <svg id="eyeIcon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <button type="submit" class="submit-btn">进入系统</button>
            </form>

            <div class="security-note">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                注意保护密码避免泄露
            </div>
        </div>
    </div>

    <script>
        // Show error message if present
        const params = new URLSearchParams(location.search);
        if (params.get('error')) {
            document.getElementById('errorMsg').classList.add('show');
        }

        // Toggle password visibility
        function togglePassword() {
            const input = document.getElementById('password');
            const icon = document.getElementById('eyeIcon');
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
            } else {
                input.type = 'password';
                icon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
            }
        }
    </script>
</body>
</html>`;
}
