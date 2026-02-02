-- 订阅记录表
CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card TEXT NOT NULL,
    account TEXT NOT NULL,
    service TEXT NOT NULL,
    bind_time TEXT NOT NULL,
    auto_renew INTEGER DEFAULT 0,
    cancel_time TEXT,
    note TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 索引优化查询
CREATE INDEX IF NOT EXISTS idx_card ON subscriptions(card);
CREATE INDEX IF NOT EXISTS idx_service ON subscriptions(service);
CREATE INDEX IF NOT EXISTS idx_cancel_time ON subscriptions(cancel_time);
