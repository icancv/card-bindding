# 卡片订阅小本本

基于 Cloudflare Worker + D1 的轻量级卡片订阅记录工具，帮你管理各张卡片绑定了哪些服务和账号。

## 功能

- 记录卡片绑定的服务和账号
- 支持自动扣费状态标记
- 支持取消订阅记录（保留取消时间）
- 按卡片 / 服务 / 状态筛选
- 实时统计总记录、活跃数、服务数、账号数
- 所有信息使用代号，保护隐私
- 密码登录，Cookie 保持 7 天会话
- 响应式设计，移动端友好

## 项目结构

```
card-bindding/
├── src/index.js          # Worker 主逻辑（路由、认证、前端页面）
├── schema.sql            # D1 数据库建表语句
├── wrangler.toml         # Cloudflare Workers 配置
└── .github/workflows/
    └── deploy.yml        # GitHub Actions 自动部署
```

## 一键部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/icancv/card-bindding)

### 步骤

1. 点击上方按钮，Fork 仓库并授权 Cloudflare 连接
2. 在 Fork 后的仓库 Settings → Secrets and variables → Actions 添加：

| Secret | 说明 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | [创建 Token](https://dash.cloudflare.com/profile/api-tokens)，选 `Edit Cloudflare Workers` 模板 |
| `AUTH_PASSWORD` | 登录密码 |

3. 推送代码到 `main` 或 `master` 分支，或手动触发 Actions，自动完成：

- 创建 D1 数据库（已存在则复用）
- 初始化表结构
- 部署 Worker
- 设置登录密码

## 使用说明

### 代号规范建议

| 类型 | 示例 |
|------|------|
| 卡片 | `1234-主力`、`5678-备用` |
| 账号 | `A1`、`工作号`、`小号` |
| 服务 | `S1`、`视频1`、`音乐` |

### 功能操作

- **添加订阅** — 点击右上角「+ 添加订阅」，填写卡片、服务、账号代号
- **编辑订阅** — 点击订阅卡片上的「编辑」修改信息
- **取消订阅** — 点击「取消订阅」记录取消时间，卡片变为半透明
- **删除记录** — 点击「删除」永久移除
- **筛选** — 顶部下拉框可按卡片、服务、状态过滤
- **退出登录** — 点击右上角「退出」

## API

所有 API 需要已登录（携带有效 Cookie），未登录返回 `401`。

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/subscriptions` | 获取全部订阅记录 |
| `POST` | `/api/subscriptions` | 新增订阅 |
| `PUT` | `/api/subscriptions/:id` | 更新订阅 |
| `DELETE` | `/api/subscriptions/:id` | 删除订阅 |
| `POST` | `/api/subscriptions/:id/cancel` | 取消订阅（记录当天日期） |

### 请求体示例（POST / PUT）

```json
{
  "card": "1234-主力",
  "service": "视频1",
  "account": "A1",
  "bind_time": "2025-01-15",
  "auto_renew": 1,
  "note": "年费会员"
}
```

## 数据库结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER | 主键，自增 |
| `card` | TEXT | 卡片代号 |
| `account` | TEXT | 账号代号 |
| `service` | TEXT | 服务代号 |
| `bind_time` | TEXT | 绑定日期 |
| `auto_renew` | INTEGER | 是否自动扣费（0/1） |
| `cancel_time` | TEXT | 取消日期（为空表示活跃） |
| `note` | TEXT | 备注 |
| `created_at` | TEXT | 创建时间 |

## 本地开发

```bash
wrangler dev
```

访问 `http://localhost:8787`，使用 `AUTH_PASSWORD` 环境变量中设置的密码登录。

## 技术栈

- **运行时** — Cloudflare Workers
- **数据库** — Cloudflare D1 (SQLite)
- **前端** — 原生 HTML / CSS / JS（内嵌在 Worker 中）
- **CI/CD** — GitHub Actions
