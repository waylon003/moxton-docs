# Moxton 文档仓库更新日志

## [未发布] - 2026-02-08

### 🏗️ 重大重构

- **目录结构重组**: 将文档仓库重构为模块化结构
  - `01-tasks/` - 统一任务管理
  - `02-api/` - API 文档（重命名自 `api/`）
  - `03-guides/` - 集成指南（重命名自 `guides/`）
  - `04-projects/` - 项目协调和状态追踪
  - `05-verification/` - 验证报告（重命名自 `verification-reports/`）
  - `06-archive/` - 历史归档

### 📝 任务管理

- **统一任务系统**: 从三个项目收集 26 个技术规范文档
  - 已完成: 7 个
  - 进行中: 6 个
  - 待办: 13 个

### 📊 项目状态

- **新增项目状态文档**:
  - `nuxt-moxton.md` - 商城前端状态
  - `moxton-lotadmin.md` - 管理后台状态
  - `moxton-lotapi.md` - 后端 API 状态

### 🔗 依赖关系

- **创建依赖关系图**: `04-projects/DEPENDENCIES.md`
  - 明确 API 依赖关系
  - 数据模型共享
  - 接口契约变更流程

### 📦 归档

- **验证报告**: 归档到 `05-verification/2026-02/`
- **历史文档**: 归档到 `06-archive/2026-01/`

---

## 2025-02-04

### 🔥 最新变更

#### 后端 API
- 批量删除接口重构: `DELETE /admin/batch` → `POST /admin/batch/delete`

#### 管理后台
- 批量删除调用更新同步后端变更

#### 前端商城
- ConsultationModal Material 组件化
- CategorySelect 二级菜单优化
- Footer 组件平板端布局重构
- ProductFilter 平板端横向布局
- ProductCard 高度自适应重构

### 📡 API 接口契约

- 批量删除咨询订单: `POST /offline-orders/admin/batch/delete`
- 提交咨询订单: `POST /offline-orders`
- 获取分类树: `GET /categories/tree/active`

---

## 版本说明

- **[未发布]**: 计划中的功能
- **日期格式**: YYYY-MM-DD
- **分类**: 🏗️ 架构, ✨ 新增, 🔄 修改, 🐛 修复, 📝 文档, 📦 归档
