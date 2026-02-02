// Error page template - Configuration error

export const errorPage = `<!DOCTYPE html>
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
