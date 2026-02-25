# Tech-Spec: 商品标签功能

**创建时间:** 2025-12-11
**状态:** Ready for Development

## 概述

### 问题陈述

需要在现有的商品系统中添加标签功能，为商品提供一个灵活的标签系统，支持：
- 商品可以拥有多个标签（字符串数组）
- 标签为自由输入，无需预定义标签库
- 统一在所有商品列表接口（包括管理员接口）中返回标签信息
- 标签不影响现有的搜索、排序、筛选功能

### 解决方案

在商品表中添加 `tags` 字段，存储 JSON 格式的字符串数组。更新所有相关的 API 接口以支持标签的读取、创建、更新操作。

### 范围 (In/Out)

**包含范围内:**
- 数据库 Schema 更新：在 Product 模型中添加 tags 字段
- 所有商品列表 API 的标签字段支持
- 商品创建/更新 API 的标签字段支持
- 商品详情 API 的标签字段支持

**排除范围外:**
- 标签管理系统（不提供独立的标签管理接口）
- 按标签筛选商品功能
- 标签搜索功能
- 标签统计分析功能
- 标签的增删改查独立接口

## 开发上下文

### 代码库模式

**技术栈:**
- TypeScript + Koa.js + Prisma ORM + MySQL
- MVC 架构模式，继承 BaseModel 模式
- 统一响应格式：`{ code, message, data, timestamp, success }`
- 中间件系统：认证、错误处理、响应格式化

**现有商品 API 接口:**
- `GET /products` - 商品列表（公开，支持可选认证）
- `GET /products/admin/all` - 管理员商品列表（需管理员权限）
- `GET /products/search` - 商品搜索
- `GET /products/popular` - 热门商品
- `GET /products/category/:categoryId` - 按分类获取商品
- `GET /products/:id` - 商品详情
- `POST /products` - 创建商品（需认证）
- `PUT /products/:id` - 更新商品（需认证）

### 需要参考的文件

**数据库相关:**
- `prisma/schema.prisma:56-79` - Product 模型定义

**数据模型:**
- `src/models/Product.ts` - 商品数据模型，包含所有 CRUD 操作
- `src/controllers/Product.ts` - 商品控制器，包含所有 API 逻辑

**路由定义:**
- `src/routes/products.ts` - 商品路由配置

### 技术决策

1. **数据存储方式:** 使用 JSON 字符串存储标签数组，与现有 images 字段保持一致的模式
2. **字段类型:** String @db.Text - 支持 MySQL TEXT 类型，可以存储大量标签数据
3. **默认值:** NULL - 空标签返回 null，前端可以根据需要处理为空数组
4. **数据处理:** 在模型层统一处理标签数据的解析和格式化

## 实现计划

### 任务

- [ ] Task 1: 更新数据库 Schema，在 Product 模型中添加 tags 字段
- [ ] Task 2: 更新 ProductModel，添加标签数据处理逻辑
- [ ] Task 3: 更新 ProductController，支持标签字段的创建和更新
- [ ] Task 4: 运行数据库迁移，应用 Schema 变更
- [ ] Task 5: 验证所有商品 API 接口正确返回标签数据

### 验收标准

- [ ] AC 1: Given 数据库迁移完成，When 查询 Product 表，Then 商品记录包含 tags 字段（TEXT 类型）
- [ ] AC 2: Given 创建商品时传入 tags 数组，When 调用 POST /products，Then 商品创建成功且 tags 正确保存
- [ ] AC 3: Given 更新商品时传入 tags 数组，When 调用 PUT /products/:id，Then 商品更新成功且 tags 正确保存
- [ ] AC 4: Given 商品有标签数据， When 调用 GET /products，Then 返回的商品列表中每个商品包含正确的 tags 数组
- [ ] AC 5: Given 商品有标签数据， When 调用 GET /products/admin/all，Then 返回的管理员商品列表包含正确的 tags 数组
- [ ] AC 6: Given 商品没有标签， When 调用任意商品 API，Then 返回的 tags 字段为 null
- [ ] AC 7: Given 商品创建时未传入 tags， When 创建商品，Then 商品的 tags 字段为 null

## 额外上下文

### 依赖项

- **数据库迁移:** 需要 Prisma CLI 生成和应用迁移
- **环境变量:** 无新增环境变量需求
- **外部服务:** 无外部服务依赖

### 测试策略

**手动测试用例:**
1. 创建带标签的商品，验证标签正确保存
2. 创建不带标签的商品，验证标签为 null
3. 更新商品标签，验证标签正确更新
4. 测试所有商品列表 API，验证标签字段返回正确
5. 测试商品详情 API，验证标签字段返回正确

**API 测试示例:**
```http
# 创建带标签的商品
POST /products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "测试商品",
  "price": 99.99,
  "categoryId": "category_id",
  "tags": ["热销", "新品", "推荐"]
}

# 获取商品列表，验证标签返回
GET /products
```

### 注意事项

1. **向后兼容:** 新增字段不会破坏现有 API，现有商品的 tags 字段为 null
2. **数据验证:** 标签数据不需要特殊验证，接受任何字符串数组
3. **性能影响:** 新增字段对查询性能影响最小，因为不需要额外的索引或查询
4. **数据库变更:** 需要在生产环境中执行数据库迁移
5. **前端处理:** 前端需要处理 tags 为 null 的情况，可以显示为空数组或隐藏

### 生产环境部署

**数据库迁移步骤:**
```bash
# 1. 生产环境执行数据库 Schema 同步
npx prisma db push

# 2. 验证数据库字段已添加
mysql -h <prod-host> -u <user> -p <database> -e "DESCRIBE products;" | grep tags

# 3. 重启应用服务
npm run build
npm start
```

**部署检查清单:**
- [ ] 数据库连接正常
- [ ] `tags` 字段已添加到 products 表
- [ ] 应用启动无错误
- [ ] API 接口返回正确格式
- [ ] 现有数据兼容性测试

**回滚计划:**
- 如遇问题，可回滚到部署前的代码版本
- 数据库变更为字段新增，回滚安全

### 数据格式示例

**请求示例:**
```json
{
  "name": "商品名称",
  "price": 199.99,
  "categoryId": "cm2w8r8k30001...",
  "tags": ["热销", "新品", "限时优惠"]
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": "cm2w8r8k30001...",
    "name": "商品名称",
    "price": 199.99,
    "tags": ["热销", "新品", "限时优惠"],
    "hasPrice": true,
    "category": {
      "id": "cm2w8r8k30002...",
      "name": "电子产品"
    }
  },
  "timestamp": "2025-12-11T10:00:00.000Z",
  "success": true
}
```