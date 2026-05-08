# 🎆 Starry Fireworks

一个具有**节日感、治愈感、浪漫感、沉浸感**的沉浸式烟花秀网站。

## ✨ 特色功能

### 🎬 视觉效果
- **电影级曝光拖影** - 真实的运动模糊效果
- **多层背景** - 星空、大气雾层、夜空渐变
- **Bloom发光效果** - 柔和的光晕渲染
- **真实火箭发射** - 摇摆上升、金色火花拖尾

### 🎵 音效系统
- 烟花爆炸音效
- 使用 Web Audio API 生成

### 🎮 交互功能
- 自动播放模式
- 响应式设计（支持移动端）
- 全屏模式
- 截图保存功能

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📁 项目结构

```
fireworks-show/
├── src/
│   ├── components/
│   │   ├── CinematicFireworks.tsx   # 电影级烟花组件
│   │   ├── ControlPanel.tsx         # 控制面板
│   │   └── FireworksCanvas.tsx     # 原始烟花组件
│   ├── utils/
│   │   ├── audio.ts                 # 音效管理器
│   │   ├── colors.ts                # 颜色工具
│   │   ├── fireworksGenerator.ts    # 烟花生成器
│   │   └── math.ts                  # 数学工具
│   ├── types/
│   │   └── fireworks.ts             # 类型定义
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎨 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **渲染**: Canvas 2D API
- **音效**: Web Audio API

## 🌐 部署

### Vercel（推荐）

项目已配置 GitHub Actions 自动部署。只需添加以下环境变量到 GitHub Secrets：

| Name | Value |
|------|-------|
| `VERCEL_TOKEN` | Vercel 访问令牌 |
| `VERCEL_ORG_ID` | Vercel 组织 ID |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID |

### 手动部署

```bash
npm run build
# 将 dist 文件夹上传到任何静态托管服务
```

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

Made with ❤️ for a magical fireworks experience