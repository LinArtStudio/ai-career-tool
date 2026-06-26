# UptimeRobot 监控配置指南

## 概述

UptimeRobot 是免费的网站监控服务，可以监控网站可用性并在宕机时发送告警。

## 配置步骤

### 1. 注册账号

访问 https://uptimerobot.com 注册免费账号。

### 2. 添加监控

登录后，点击 "Add New Monitor"：

| 配置项 | 值 |
|--------|-----|
| Monitor Type | HTTP(s) |
| Friendly Name | AI时代求职训练平台 - 主站 |
| URL | https://ai-career-tool.vercel.app |
| Monitoring Interval | 5 minutes |

### 3. 添加更多监控

| 监控项 | URL | 说明 |
|--------|-----|------|
| 主站 | https://ai-career-tool.vercel.app | Vercel部署 |
| 备用站 | https://07bc462b.ai-career-tool.pages.dev | Cloudflare Pages |
| API健康检查 | https://ai-career-tool.vercel.app/api/health | API状态 |
| GitHub仓库 | https://github.com/LinArtStudio/ai-career-tool | 代码仓库 |

### 4. 配置告警通知

在 "My Alerts" 中配置通知方式：

| 通知方式 | 配置 |
|----------|------|
| Email | 你的邮箱地址 |
| Telegram | Telegram Bot Token + Chat ID |
| 微信 | 通过 Server酱 转发 |

### 5. 设置告警规则

| 规则 | 说明 |
|------|------|
| Down Alert | 网站不可用时立即告警 |
| Up Alert | 网站恢复时通知 |
| SSL Alert | SSL证书即将过期告警 |

## 监控指标

UptimeRobot 提供以下监控指标：

1. **Uptime** - 正常运行时间百分比
2. **Response Time** - 响应时间
3. **Incidents** - 故障记录
4. **SSL Certificate** - SSL证书状态

## 告警配置示例

### Email告警

```
Subject: [Down] AI时代求职训练平台 - 主站
Body: 
Monitor: AI时代求职训练平台 - 主站
URL: https://ai-career-tool.vercel.app
Status: Down
Time: 2026-06-23 10:00:00
```

### Telegram告警

```json
{
  "chat_id": "YOUR_CHAT_ID",
  "text": "⚠️ AI时代求职训练平台主站宕机\nURL: https://ai-career-tool.vercel.app\n时间: 2026-06-23 10:00:00"
}
```

## 最佳实践

1. **监控间隔**：生产环境建议5分钟
2. **多节点监控**：选择不同地理位置的监控节点
3. **告警升级**：设置告警升级规则，多次失败后通知更多人
4. **定期检查**：每周查看监控报告，分析性能趋势

## 免费版限制

| 功能 | 免费版 |
|------|--------|
| 监控数量 | 50个 |
| 监控间隔 | 5分钟 |
| 历史记录 | 30天 |
| 告警通知 | Email |
| 高级通知 | 需付费 |

## 集成到项目

在 README 中添加监控状态徽章：

```markdown
![Uptime](https://img.shields.io/uptimerobot/ratio/m79example)
![Status](https://img.shields.io/uptimerobot/status/m79example)
```

## 故障处理流程

1. **收到告警** → 立即检查网站
2. **确认问题** → 判断是CDN、服务器还是代码问题
3. **快速修复** → 回滚代码或重启服务
4. **记录故障** → 在迭代日志中记录
5. **复盘改进** → 分析根因，防止再次发生
