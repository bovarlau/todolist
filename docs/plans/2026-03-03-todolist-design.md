# TodoList 应用设计文档

**日期**: 2026-03-03
**版本**: 1.0

---

## 1. 技术栈

| 功能 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js | 15.x |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 3.x |
| UI 组件 | shadcn/ui | latest |
| Markdown | react-markdown | 9.x |
| 拖拽排序 | @dnd-kit/core | 6.x |
| 日期处理 | date-fns | 3.x |
| 主题管理 | next-themes | latest |
| 图标 | Lucide React | latest |

---

## 2. 设计系统

### 2.1 颜色方案

#### 浅色模式
| 角色 | 颜色 | 用途 |
|------|------|------|
| 背景 | `#F8FAFC` | 主背景 |
| 卡片 | `rgba(255,255,255,0.7)` + `backdrop-filter: blur(12px)` | 任务卡片 |
| 主色 | `#6366F1` | 按钮、选中态 |
| 次色 | `#14B8A6` | 完成、打勾 |
| 文字主色 | `#1E293B` | 标题 |
| 文字次色 | `#64748B` | 描述、日期 |
| 边框 | `rgba(0,0,0,0.08)` | 卡片边缘 |

#### 深色模式
| 角色 | 颜色 | 用途 |
|------|------|------|
| 背景 | `#0F172A` | 主背景 |
| 卡片 | `rgba(30,41,59,0.6)` + `backdrop-filter: blur(12px)` | 任务卡片 |
| 主色 | `#818CF8` | 按钮、选中态 |
| 次色 | `#2DD4BF` | 完成、打勾 |
| 文字主色 | `#F1F5F9` | 标题 |
| 文字次色 | `#94A3B8` | 描述、日期 |
| 边框 | `rgba(255,255,255,0.1)` | 卡片边缘 |

### 2.2 字体

- **字体**: Inter (Google Fonts)
- **权重**: 400, 500, 600, 700
- **行高**: 1.5-1.6
- **CSS**: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`

### 2.3 玻璃态效果

```css
/* 玻璃卡片 */
backdrop-filter: blur(12px);
background: rgba(255,255,255,0.65);
border: 1px solid rgba(255,255,255,0.3);
border-radius: 16px;
```

### 2.4 交互效果

| 效果 | 规范 |
|------|------|
| 悬停 | `scale(1.01)` + 阴影加深, 150ms ease |
| 点击 | `scale(0.98)`, 100ms |
| 完成打勾 | SVG stroke-dashoffset 动画, 300ms |
| 拖拽 | 提升阴影 + 轻微旋转 |
| 淡入 | opacity 0→1, 200ms |

### 2.5 布局规范

- **移动端**: 单栏，底部添加按钮
- **平板/桌面**: 左侧边栏 (240px) + 右侧任务列表
- **间距**: 8px 基数
- **圆角**: 12px (小), 16px (中), 24px (大/卡片)

---

## 3. 功能架构

### 3.1 组件结构

```
App
├── ThemeToggle (主题切换)
├── Layout
│   ├── Sidebar (侧边栏 - 桌面)
│   │   ├── 今日任务 (Today)
│   │   ├── 重要 (Important)
│   │   └── 已完成 (Completed)
│   └── BottomNav (底部导航 - 移动)
├── TaskList
│   ├── TaskFilters (搜索 + 过滤)
│   ├── TaskItem (单个任务 - 可拖拽)
│   │   ├── Checkbox (打勾动画)
│   │   ├── Content (Markdown 渲染)
│   │   ├── DueDate (截止日期)
│   │   └── Actions (编辑/删除/拖拽手柄)
│   └── AddTaskButton (添加任务)
└── TaskModal (添加/编辑弹窗)
    ├── TitleInput
    ├── DescriptionInput (Markdown)
    ├── DueDatePicker
    └── CategorySelect
```

### 3.2 数据结构

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  important: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  order: number;
}

interface AppState {
  tasks: Task[];
  filter: 'all' | 'today' | 'important' | 'completed';
  searchQuery: string;
  theme: 'light' | 'dark' | 'system';
}
```

### 3.3 存储策略

- **localStorage key**: `todolist_tasks`
- **自动保存**: 每次任务变更后 500ms 防抖保存

---

## 4. 验收标准

### 4.1 功能
- [ ] 添加任务 (标题必填，描述可选)
- [ ] 编辑任务
- [ ] 删除任务
- [ ] 完成任务 (打勾动画)
- [ ] 标记重要
- [ ] 拖拽排序
- [ ] 分类筛选 (今日/重要/已完成)
- [ ] 搜索任务
- [ ] 设置截止日期
- [ ] Markdown 描述渲染

### 4.2 UI/UX
- [ ] 玻璃态效果正确显示
- [ ] 深色/浅色模式切换正常
- [ ] 主题跟随系统 + 手动切换
- [ ] 响应式布局 (375px, 768px, 1024px+)
- [ ] 悬停/点击动画流畅
- [ ] 完成打勾动画播放

### 4.3 性能
- [ ] 首屏加载 < 3s
- [ ] 交互响应 < 100ms
- [ ] localStorage 读写正常

---

## 5. 部署

- **平台**: Vercel
- **构建命令**: `next build`
- **输出目录**: `.next`
- **Node 版本**: 18.x+
