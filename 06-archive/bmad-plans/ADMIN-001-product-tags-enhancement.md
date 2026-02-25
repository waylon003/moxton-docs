# 技术规范: 商品管理标签和咨询商品功能增强

**创建时间:** 2025-12-11
**状态:** 准备开发
**优先级:** 高

## 概述

### 问题陈述
当前商品管理系统缺少对后端已实现的标签功能和咨询商品功能的UI支持。后端API已在v1.4.0和v1.4.1版本中分别添加了`hasPrice`字段和`tags`字段，但前端页面尚未集成这些新功能。

### 解决方案
更新商品管理前端页面，添加：
1. 商品标签系统的完整UI支持（显示、添加、编辑、删除）
2. 咨询商品状态显示（基于hasPrice字段）
3. 相应的TypeScript类型定义更新

### 范围界定

**包含范围:**
- 更新Product和ProductDto接口类型定义
- 商品列表页面增加标签和咨询商品状态显示
- 商品表单增加标签输入功能
- 保持与现有API的完全兼容性

**不包含范围:**
- 后端API开发（已存在）
- 数据库结构修改
- 商品表单hasPrice开关（后端根据价格自动判断）
- 用户权限系统变更

## 开发上下文

### 代码库模式
- 使用Vue 3 Composition API + TypeScript
- Naive UI组件库
- 表格使用`useNaivePaginatedTable`钩子
- 表单使用`useNaiveForm`钩子
- API服务层已存在`productService`

### 需要参考的文件
- `src/typings/api.d.ts` - Product接口定义 (第48-82行)
- `src/views/product/modules/product-list.vue` - 商品列表组件
- `src/views/product/modules/product-form.vue` - 商品表单组件
- `src/service/api/product.ts` - 商品API服务
- `API_DOCUMENTATION.md` - 后端API文档

### 技术决策
1. **标签输入**: 使用NDynamicTags组件用于编辑，NTag组件用于显示
2. **咨询商品标识**: 表格中基于hasPrice字段显示状态，表单不需要开关
3. **表格显示**: 新增"标签"列和"商品类型"列
4. **类型安全**: 严格TypeScript类型定义
5. **逻辑简化**: hasPrice由后端根据价格字段自动计算，前端不需要管理

## 实现计划

### 任务清单

- [ ] 任务1: 更新TypeScript类型定义
- [ ] 任务2: 修改商品列表显示（新增标签列和商品类型列）
- [ ] 任务3: 更新商品表单（添加标签输入功能）
- [ ] 任务4: 测试和验证

### 验收标准

- [ ] AC1: 商品列表正确显示标签列表（处理null值）
- [ ] AC2: 商品列表根据hasPrice字段显示"购买商品"或"咨询商品"
- [ ] AC3: 商品表单可以使用NDynamicTags添加/编辑/删除标签
- [ ] AC4: 提交商品时正确发送tags数组
- [ ] AC5: 价格为空时创建的商品hasPrice为false（验证逻辑正确）
- [ ] AC6: 价格字段不再是必填项，支持留空创建咨询商品
- [ ] AC7: 价格字段placeholder显示"选填（留空则为咨询商品）"
- [ ] AC8: 类型检查通过，无TypeScript错误

## 详细实现说明

### 任务1: TypeScript类型定义更新

**文件:** `src/typings/api.d.ts`

```typescript
namespace Product {
  interface Product {
    id: string;
    name: string;
    description?: string;
    content?: string;
    price: string;
    originalPrice?: string;
    stock: number;
    categoryId: string;
    images: string[];
    specifications?: string;
    status: 0 | 1;
    // 新增字段
    hasPrice: boolean; // 是否有价格，false=咨询商品, true=购买商品
    tags: string[] | null; // 商品标签数组，无标签时为null
    createdAt: string;
    updatedAt: string;
    category?: Category.Category;
  }

  interface CreateProductDto {
    name: string;
    description?: string;
    content?: string;
    price: string;
    originalPrice?: string;
    stock: number;
    categoryId: string;
    images: string[];
    specifications?: string;
    status?: 0 | 1;
    // 新增字段（不需要hasPrice，后端根据price自动判断）
    tags?: string[] | null; // 创建时可选
  }

  interface UpdateProductDto extends Partial<CreateProductDto> {
    status?: 0 | 1;
    // 同样不需要hasPrice字段
  }
}
```

### 任务2: 商品列表显示更新

**文件:** `src/views/product/modules/product-list.vue`

#### 新增表格列:

1. **标签列** (位置: 分类列之后)
```typescript
{
  title: '标签',
  key: 'tags',
  width: 200,
  render(row) {
    const tags = row.tags || [];
    if (tags.length === 0) {
      return h('span', { style: { color: '#c0c4cc' } }, '暂无标签');
    }
    return h(
      NSpace,
      { size: 4, wrap: false },
      {
        default: () => tags.map(tag =>
          h(NTag, { type: 'info', size: 'small' }, () => tag)
        )
      }
    );
  }
}
```

2. **商品类型列** (位置: 状态列之前)
```typescript
{
  title: '商品类型',
  key: 'productType',
  width: 120,
  render(row) {
    const type = row.hasPrice ?
      { text: '购买商品', type: 'success' as const } :
      { text: '咨询商品', type: 'warning' as const };

    return h(NTag, { type: type.type, size: 'small' }, () => type.text);
  }
}
```

#### 实现要点:
- 标签处理null值，显示"暂无标签"
- 咨询商品和购买商品使用不同颜色区分
- 保持现有表格布局合理，调整scroll-x宽度

### 任务3: 商品表单更新

**文件:** `src/views/product/modules/product-form.vue`

#### 关键变更: 移除价格必填校验
由于咨询商品不需要价格，需要移除price字段的必填验证规则。

#### 新增表单字段:

1. **标签输入** (位置: 商品状态之后，图片上传之前)

```vue
<!-- 商品标签 -->
<NDivider title-placement="left">商品标签</NDivider>

<NFormItem label="商品标签">
  <NSpace vertical style="width: 100%">
    <NDynamicTags
      v-model:value="formData.tags"
      placeholder="输入标签后按回车添加"
      :max="10"
      @create="handleTagCreate"
    />
    <NText depth="3" style="font-size: 12px">
      最多添加10个标签，用于商品分类和搜索优化
    </NText>
  </NSpace>
</NFormItem>
```

2. **价格字段UI优化** (更新现有价格输入)

```vue
<NGi>
  <NFormItem label="销售价格">
    <NInputNumber
      :value="parseFloat(formData.price) || null"
      :precision="2"
      :min="0.01"
      placeholder="选填（留空则为咨询商品）"
      style="width: 100%"
      clearable
      @update:value="
        (value: number | null) => {
          formData.price = value?.toString() || '';
        }
      "
    >
      <template #prefix>$</template>
    </NInputNumber>
  </NFormItem>
</NGi>
```

3. **表单验证规则更新**:

```typescript
// 表单验证规则 - 移除价格必填校验
const formRules: FormRules = {
  name: [defaultRequiredRule, { min: 2, max: 100, message: '商品名称长度在2到100个字符之间', trigger: 'blur' }],
  description: [
    defaultRequiredRule,
    { min: 10, max: 2000, message: '商品描述长度在10到2000个字符之间', trigger: 'blur' }
  ],
  // 价格字段移除必填校验，支持咨询商品
  // price: [defaultRequiredRule], // 已移除
  stock: [defaultRequiredRule, { type: 'number', min: 0, message: '商品库存不能小于0', trigger: 'blur' }],
  categoryId: [defaultRequiredRule]
};
```

4. **表单数据更新**:

```typescript
// 在formData中添加tags字段
const formData = ref<ProductFormData>({
  name: '',
  description: '',
  content: '',
  price: '', // 非必填，为空时后端自动设置hasPrice为false
  originalPrice: '',
  stock: 0,
  categoryId: '',
  images: [],
  specifications: '{}',
  status: 1,
  tags: null // 新增字段
});
```

5. **标签处理函数**:

```typescript
// 标签创建处理 - 添加基本验证
const handleTagCreate = (value: string) => {
  const trimmedValue = value.trim();
  // 基本验证：标签长度和字符限制
  if (trimmedValue.length === 0) {
    message.error('标签不能为空');
    return false;
  }
  if (trimmedValue.length > 20) {
    message.error('标签长度不能超过20个字符');
    return false;
  }
  return trimmedValue;
};

// 在initFormData中处理标签
const initFormData = () => {
  if (isEdit.value && props.product) {
    formData.value = {
      name: props.product.name,
      description: props.product.description || '',
      content: props.product.content || '',
      price: props.product.price, // 保持现有价格逻辑
      originalPrice: props.product.originalPrice || '',
      stock: props.product.stock,
      categoryId: (props.product as any).category?.id || props.product.categoryId || '',
      images: Array.isArray(props.product.images) ? props.product.images : [],
      specifications: props.product.specifications || '{}',
      status: props.product.status,
      tags: props.product.tags || null // 新增字段处理
    };
    // ... 其他初始化逻辑
  } else {
    resetForm();
  }
};

// 在resetForm中重置标签
const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    content: '',
    price: '', // 重置为空，支持咨询商品
    originalPrice: '',
    stock: 0,
    categoryId: '',
    images: [],
    specifications: '{}',
    status: 1,
    tags: null // 新增字段
  };
  fileList.value = [];
  specificationsList.value = [];
  restoreValidation();
};
```

6. **导入NDynamicTags组件**:

```typescript
import {
  // ... 其他导入
  NDynamicTags,
} from 'naive-ui';
```

#### 实现要点:
- 使用NDynamicTags组件提供动态标签输入体验
- 支持回车添加和点击删除
- 限制最多10个标签
- 编辑时正确加载现有标签
- 处理null值的显示

### 任务4: API集成验证

确保以下API调用正确处理新字段:

1. **创建商品**: `productService.create(data)` - data包含tags字段
2. **更新商品**: `productService.update(id, data)` - data包含tags字段
3. **获取商品列表**: `productService.fetchGetProducts()` - 返回数据包含tags和hasPrice
4. **获取商品详情**: `productService.fetchGetProduct(id)` - 返回数据包含tags和hasPrice

#### 测试验证点:
- 创建商品时tags正确提交
- 更新商品时tags正确更新
- 列表和详情页面正确显示tags和hasPrice
- null值的正确处理

## 额外上下文

### 依赖项
- Naive UI v2.43.1 (已存在，包含NDynamicTags组件)
- Vue 3.5.24 (已存在)
- 现有商品API服务 (已存在)

### API文档参考

根据`API_DOCUMENTATION.md`:
- 所有商品相关API都返回`tags`字段
- 所有商品相关API都返回`hasPrice`字段
- 创建/更新商品API支持`tags`字段
- `hasPrice`字段由后端根据`price`字段自动设置

### 测试策略
1. **功能测试**: 验证标签的增删改查功能
2. **显示测试**: 验证表格中标签和商品类型的正确显示
3. **API测试**: 验证与后端API的数据交互
4. **边界测试**: 测试null值、空数组、最大标签数等边界情况

### 注意事项
1. 保持向后兼容性，正确处理现有商品的null tags值
2. **关键：价格字段必填校验已移除，支持咨询商品创建**
3. 标签显示在表格中的长度限制和换行处理
4. NDynamicTags的用户体验优化，包括标签长度验证
5. 表格响应式布局适配，新增列后保持良好的显示效果
6. 价格字段placeholder提示用户留空将创建咨询商品

### 性能考虑
- 标签渲染优化，避免大量标签影响表格性能
- 使用虚拟滚动处理大量商品的标签显示
- 表单状态更新的高效处理

---

**规范完成时间:** 2025-12-11
**预估开发时间:** 3-4小时
**复杂度:** 中等
**风险等级:** 低（后端API已存在且稳定）