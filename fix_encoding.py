"""
修复编码问题的脚本
问题：UTF-8 文件中某些多字节序列被 ? 破坏了
解决：尝试从上下文推断正确的字符
"""

import glob
import re

# 读取需要修复的文件列表
with open('files_to_fix.txt', 'r', encoding='utf-8') as f:
    files_to_fix = [line.strip() for line in f if line.strip()]

# 常见的错误模式及其修复
# 格式： (原始模式, 修复后)
COMMON_FIXES = [
    # 数字相关
    (r'最\ufffd\?个字符', '最少 2 个字符'),
    (r'最\ufffd?\?00个字符', '最多 200 个字符'),
    (r'最\ufffd\?00', '最多 200'),
    (r'最\ufffd\?个建议', '最多 5 个建议'),
    (r'最\ufffd\?个', '最少 2 个'),
    (r'最\ufffd\?', '最少'),

    # 语言相关
    (r'支持游客和用\ufffd\?', '支持游客和用户'),
    (r'中文\ufffd\?英文', '中文和英文'),
    (r'可\ufffd\?', '可选'),

    # 地址相关
    (r'新加\ufffd\?', '新加坡'),
    (r'加拿\ufffd\?', '加拿大'),
    (r'英文\ufffd\?', '英文）'),
    (r'默\ufffd\?', '默认'),

    # 功能相关
    (r'建议的表单结\ufffd\?', '建议的表单结构'),
    (r'推荐使用结构化字\ufffd\?', '推荐使用结构化字段'),
    (r'提交订单\ufffd\?', '提交订单时'),
    (r'地址服务健康检\ufffd\?', '地址服务健康检查'),
    (r'管理\ufffd\?', '管理员）'),
    (r'地址服务特\ufffd\?', '地址服务特性'),
    (r'智能缓存\ufffd\? Redis缓存', '智能缓存：Redis 缓存'),
    (r'缓存命中\ufffd\?', '缓存命中率'),
    (r'多国家支\ufffd\?', '多国家支持'),
    (r'覆盖全球主要国家和地\ufffd\?', '覆盖全球主要国家和地区'),
    (r'地址格式\ufffd\?', '地址格式化'),
    (r'结构化数\ufffd\?', '结构化数据'),
    (r'防抖机\ufffd\?', '防抖机制'),
    (r'避免频繁请\ufffd\?', '避免频繁请求'),
    (r'返\ufffd\?个建议结\ufffd\?', '返回 5 个建议结果'),
    (r'批量处\ufffd\?', '批量处理'),
    (r'详细信\ufffd\?', '详细信息'),
    (r'安全与可靠\ufffd\?', '安全与可靠性'),
    (r'输入验\ufffd\?', '输入验证'),
    (r'错误处\ufffd\?', '错误处理'),
    (r'降级机\ufffd\?', '降级机制'),
    (r'监控日\ufffd\?', '监控日志'),
    (r'指定中\ufffd\?中文', '指定中国/中文'),
    (r'购物车模\ufffd\?', '购物车模块'),
    (r'游客购物车\ufffd\?', '游客购物车功能'),
    (r'登录用户购物车\ufffd\?', '登录用户购物车'),
    (r'购物车\ufffd\?0天后', '购物车 30 天后'),
    (r'商品有效性验\ufffd\?', '商品有效性验证'),
    (r'单项操\ufffd\?', '单项操作'),
    (r'购物车验\ufffd\?', '购物车验证'),
    (r'价格变\ufffd\?', '价格变化'),
    (r'购物车合\ufffd\?', '购物车合并'),
    (r'Cart模\ufffd\?', 'Cart 模型'),
    (r'双模\ufffd\?', '双模式'),
    (r'CartItem模\ufffd\?', 'CartItem 模型'),
    (r'选择状\ufffd\?', '选择状态'),
    (r'总金\ufffd\?', '总金额'),
    (r'可选认\ufffd\?', '可选认证'),
    (r'游客和用\ufffd\?', '游客和用户'),
    (r'会话管\ufffd\?', '会话管理'),
    (r'JavaScript服务\ufffd\?', 'JavaScript 服务'),
    (r'类型定\ufffd\?', '类型定义'),
    (r'数据一致\ufffd\?', '数据一致性'),
    (r'价格同\ufffd\?', '价格同步'),
    (r'会话隔\ufffd\?', '会话隔离'),
    (r'使用流程\ufffd\?', '使用流程图'),
    (r'集成最佳实\ufffd\?', '集成最佳实践'),
    (r'错误场\ufffd\?', '错误场景'),
    (r'订单集\ufffd\?', '订单集成'),
    (r'支付集\ufffd\?', '支付集成'),
    (r'管理后\ufffd\?', '管理后台'),
    (r'分类名称显\ufffd\?', '分类名称显示'),
    (r'层级名称合\ufffd\?', '层级名称合并'),
    (r'智能层级识\ufffd\?', '智能层级识别'),
    (r'完整路\ufffd\?', '完整路径'),
    (r'全API覆\ufffd\?', '全 API 覆盖'),
    (r'前端友\ufffd\?', '前端友好'),
    (r'信息更完\ufffd\?', '信息更完整'),
    (r'导航更清\ufffd\?', '导航更清晰'),
    (r'分类状态管理优\ufffd\?', '分类状态管理优化'),
    (r'自动过滤机\ufffd\?', '自动过滤机制'),
    (r'级联控制逻\ufffd\?', '级联控制逻辑'),
    (r'下架\ufffd\?', '"下架"'),
    (r'上架状\ufffd\?', '上架状态'),
    (r'完整信息保\ufffd\?', '完整信息保留'),
    (r'变量名错\ufffd\?', '变量名错误'),
    (r'版本更新日\ufffd\?', '版本更新日志'),
    (r'向后兼容\ufffd\?', '向后兼容性'),
    (r'环境变\ufffd\?', '环境变量'),
    (r'健康检\ufffd\?', '健康检查'),
    (r'环境配\ufffd\?', '环境配置'),
    (r'技术支\ufffd\?', '技术支持'),
    (r'兼容\ufffd\?', '兼容性'),
    (r'技术支\ufffd\?', '技术支持'),
    (r'技术实\ufffd\?', '技术实现'),
    (r'技术实\ufffd\?', '技术实现'),
    (r'实\ufffd\?', '实现'),
    (r'技\ufffd\?', '技术'),
    (r'字\ufffd\?', '字符'),
    (r'字符\ufffd\?', '字符）'),
    (r'个字\ufffd\?', '个字符）'),
    (r'\ufffd\?00', '200'),
    (r'\ufffd\?个', ' 2 个'),
    (r'成功时\ufffd\?', '成功时返回）'),
    (r'（明确字段\ufffd\?', '（明确字段名）'),
    (r'状\ufffd\?', '状态'),
    (r'购物车状\ufffd\?', '购物车状态）'),
    (r'最新购物车状\ufffd\?', '最新购物车状态）'),
    (r'列\ufffd\?', '列表）'),
    (r'完整购物车商品列\ufffd\?', '完整购物车商品列表）'),
    (r'问\ufffd\?', '问题）'),
    (r'避免数据不一致问\ufffd\?', '避免数据不一致问题）'),
    (r'购物车概\ufffd\?', '购物车概述'),
    (r'购物车模块支\*游客模式\*\*\*登录用户模式\*\*', '购物车模块支持**游客模式**和**登录用户模式**'),
    (r'核心特\*:', '核心特性:'),
    (r'游客购物\*: ', '游客购物车：'),
    (r'登录用户购物\*: ', '登录用户购物车：'),
    (r'通过X-Guest-ID头识\ufffd\?', '通过X-Guest-ID头识别）'),
    (r'\*\*游客购物\*\*:', '**游客购物车：'),
    (r'\*\*登录用户购物\*\*:', '**登录用户购物车：'),
    (r'\*\*核心特\*\*:', '**核心特性**:'),
    (r'\ufffd\?', ''),
]

def apply_fixes(content):
    """应用所有已知的修复模式"""
    result = content
    for pattern, replacement in COMMON_FIXES:
        result = re.sub(pattern, replacement, result)
    return result

# 处理每个文件
for filepath in files_to_fix:
    print(f'Processing: {filepath}')

    # 读取文件内容
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 统计修复前的替换字符数量
    before_count = content.count('\ufffd')

    # 应用修复
    fixed_content = apply_fixes(content)

    # 统计修复后的替换字符数量
    after_count = fixed_content.count('\ufffd')

    # 保存修复后的内容
    with open(filepath, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(fixed_content)

    print(f'  Replacement chars: {before_count} -> {after_count}')
    print(f'  Fixed: {before_count - after_count} occurrences')

print('\nDone!')
