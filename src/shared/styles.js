// Shared CSS styles - CSS variables, base styles, and common components

// CSS Variables (light + dark mode)
export const cssVariables = `
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
        --overlay-bg: rgba(0,0,0,0.5);
        --toast-success: #4caf50;
        --toast-error: #f44336;
    }

    [data-theme="dark"] {
        --bg-body: #1a202c;
        --bg-primary: #2d3748;
        --bg-secondary: #4a5568;
        --bg-gradient-start: #2d3748;
        --bg-gradient-end: #1a202c;
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
        --overlay-bg: rgba(0,0,0,0.7);
    }

    @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) {
            --bg-body: #1a202c;
            --bg-primary: #2d3748;
            --bg-secondary: #4a5568;
            --bg-gradient-start: #2d3748;
            --bg-gradient-end: #1a202c;
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
            --overlay-bg: rgba(0,0,0,0.7);
        }
    }
`;

// Base styles (reset, body, container)
export const baseStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--bg-body);
        min-height: 100vh;
        color: var(--text-primary);
        display: flex;
        flex-direction: column;
    }
    .container { max-width: 1000px; margin: 0 auto; padding: 20px; flex: 1; }
`;

// Header styles
export const headerStyles = `
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
`;

// Button styles
export const buttonStyles = `
    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
        text-decoration: none;
    }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background: white; color: #667eea; }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .btn-secondary { background: rgba(255,255,255,0.2); color: white; text-decoration: none; }
    .btn-secondary:hover:not(:disabled) { background: rgba(255,255,255,0.3); transform: translateY(-2px); }
    .btn-active { background: white; color: #667eea; text-decoration: none; }
    .btn-active:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .btn-icon {
        padding: 8px;
        background: rgba(255,255,255,0.2);
        border-radius: 8px;
        cursor: pointer;
        border: none;
        color: white;
        font-size: 18px;
        line-height: 1;
        transition: all 0.2s;
    }
    .btn-icon:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); }
`;

// Tag styles
export const tagStyles = `
    .tag {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
    }
    .tag-service { background: var(--purple-bg); color: var(--purple-color); }
    .tag-account { border: 1px solid var(--border-color); color: var(--text-secondary); background: var(--bg-primary); }
`;

// Loading/Skeleton styles
export const loadingStyles = `
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .skeleton {
        background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-color) 50%, var(--bg-secondary) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 8px;
    }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;

// Footer styles
export const footerStyles = `
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
`;

// Empty state styles
export const emptyStyles = `
    .empty {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-muted);
    }
    .empty-icon { font-size: 48px; margin-bottom: 16px; }
    .empty a { color: var(--accent-color); text-decoration: none; }
`;

// Responsive breakpoints for header/footer
export const responsiveBaseStyles = `
    @media (max-width: 768px) {
        .header-actions { flex-wrap: wrap; }
    }
    @media (max-width: 600px) {
        .header { padding: 16px; }
        .header-inner { flex-wrap: wrap; gap: 12px; }
        .header h1 { font-size: 18px; }
        .header-actions { width: 100%; justify-content: center; gap: 8px; }
        .header-actions .btn { padding: 8px 12px; font-size: 13px; }
        .footer-inner { flex-direction: column; text-align: center; }
    }
`;

// Combine all shared styles
export const sharedStyles = cssVariables + baseStyles + headerStyles + buttonStyles + tagStyles + loadingStyles + footerStyles + emptyStyles + responsiveBaseStyles;
