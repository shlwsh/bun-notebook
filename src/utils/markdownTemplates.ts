export interface MarkdownTemplate {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  content: string;
}

export const markdownTemplates: MarkdownTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    nameZh: '空白文档',
    description: 'Start with an empty document',
    descriptionZh: '从空白文档开始',
    content: '# 标题\n\n',
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    nameZh: '会议记录',
    description: 'Template for meeting minutes',
    descriptionZh: '会议纪要模板',
    content: `# 会议记录

## 基本信息

- **日期：** ${new Date().toLocaleDateString('zh-CN')}
- **时间：**
- **地点：**
- **主持人：**
- **记录人：**

## 参会人员

-

## 会议议题

### 议题一

**讨论内容：**



**决议：**



### 议题二

**讨论内容：**



**决议：**



## 待办事项

- [ ] 待办事项 1 — 负责人：，截止日期：
- [ ] 待办事项 2 — 负责人：，截止日期：
- [ ] 待办事项 3 — 负责人：，截止日期：

## 下次会议

- **时间：**
- **议题：**
`,
  },
  {
    id: 'tech-doc',
    name: 'Technical Document',
    nameZh: '技术文档',
    description: 'Template for technical documentation',
    descriptionZh: '技术文档模板',
    content: `# 技术文档标题

## 1. 概述

简要描述本文档的目的和范围。

## 2. 架构设计

### 2.1 系统架构



### 2.2 技术栈

| 层级 | 技术 | 说明 |
| ------ | ------ | ------ |
| 前端 |  |  |
| 后端 |  |  |
| 数据库 |  |  |

## 3. API 接口

### 3.1 接口名称

- **URL：** \`/api/xxx\`
- **方法：** GET
- **参数：**

| 参数名 | 类型 | 必填 | 说明 |
| ------ | ------ | ------ | ------ |
|  |  |  |  |

- **返回示例：**

\`\`\`json
{
  "code": 200,
  "data": {}
}
\`\`\`

## 4. 部署说明

### 4.1 环境要求



### 4.2 部署步骤

1.
2.
3.

## 5. FAQ

**Q: 问题描述？**

A: 解答内容。
`,
  },
  {
    id: 'readme',
    name: 'Project README',
    nameZh: '项目 README',
    description: 'Template for project README',
    descriptionZh: '项目说明文档模板',
    content: `# 项目名称

简要描述项目的功能和用途。

## 功能特性

- 特性 1
- 特性 2
- 特性 3

## 快速开始

### 环境要求

- Node.js >= 18
-

### 安装

\`\`\`bash
# 克隆项目
git clone https://github.com/xxx/xxx.git

# 安装依赖
npm install

# 启动开发服务器
npm run dev
\`\`\`

### 使用说明



## 项目结构

\`\`\`
├── src/
│   ├── components/
│   ├── utils/
│   └── main.ts
├── package.json
└── README.md
\`\`\`

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (\`git checkout -b feature/xxx\`)
3. 提交更改 (\`git commit -m 'feat: 添加xxx功能'\`)
4. 推送到分支 (\`git push origin feature/xxx\`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)
`,
  },
  {
    id: 'weekly',
    name: 'Weekly Report',
    nameZh: '周报',
    description: 'Template for weekly report',
    descriptionZh: '周报模板',
    content: `# 周报

**姓名：**
**日期：** ${new Date().toLocaleDateString('zh-CN')}
**部门：**

---

## 本周完成

- [ ] 任务 1
- [ ] 任务 2
- [ ] 任务 3

## 下周计划

- [ ] 计划 1
- [ ] 计划 2
- [ ] 计划 3

## 问题与风险

| 问题 | 影响 | 解决方案 | 状态 |
| ------ | ------ | ------ | ------ |
|  |  |  |  |

## 备注

`,
  },
  {
    id: 'requirement',
    name: 'Requirement Document',
    nameZh: '需求文档',
    description: 'Template for requirement specification',
    descriptionZh: '需求规格说明书模板',
    content: `# 需求文档

## 1. 背景

描述需求产生的背景和动机。

## 2. 目标

- 目标 1
- 目标 2

## 3. 功能需求

### 3.1 功能模块一

**描述：**



**用户故事：**

> 作为一个 [角色]，我希望 [功能]，以便 [价值]。

**验收标准：**

- [ ] 标准 1
- [ ] 标准 2

### 3.2 功能模块二

**描述：**



## 4. 非功能需求

### 4.1 性能要求

- 响应时间：
- 并发量：

### 4.2 安全要求

-

### 4.3 兼容性要求

-

## 5. 验收标准

| 编号 | 测试项 | 预期结果 | 实际结果 | 状态 |
| ------ | ------ | ------ | ------ | ------ |
| 1 |  |  |  |  |

## 6. 排期

| 阶段 | 开始时间 | 结束时间 | 负责人 |
| ------ | ------ | ------ | ------ |
| 设计 |  |  |  |
| 开发 |  |  |  |
| 测试 |  |  |  |
| 上线 |  |  |  |
`,
  },
];
