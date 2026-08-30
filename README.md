# LGQ的博客

基于 [Hexo](https://hexo.io) + [Butterfly 主题](https://butterfly.js.org) 的个人博客，托管在 GitHub Pages。

线上地址：**https://jiang058280.github.io**

## 如何写一篇新文章

1. 新建文章（两种方式任选）：
   - 命令：`npm run new -- "文章标题"`，会生成 `source/_posts/文章标题.md`
   - 直接在 `source/_posts/` 下新建 `.md` 文件，开头写好 front-matter：

     ```yaml
     ---
     title: 文章标题
     date: 2026-08-30 12:00:00
     tags:
     categories:
     ---
     ```

2. 本地预览（可选）：`npm run server`，浏览器打开 http://localhost:4000
3. 发布：

   ```bash
   git add .
   git commit -m "feat: 新文章《xxx》"
   git push
   ```

4. 等 1-2 分钟，GitHub Actions 自动构建发布，刷新网站即可看到。

## 目录结构

```
├── _config.yml              # 站点配置（标题、语言、URL 等）
├── _config.butterfly.yml    # 主题覆盖配置（只写需要自定义的项）
├── scaffolds/               # 新文章模板
├── source/
│   ├── _posts/              # 所有文章（Markdown）
│   └── about/index.md       # 关于页
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions 自动部署
└── package.json             # 依赖与常用命令
```

## 常用命令

| 命令 | 作用 |
|---|---|
| `npm run new -- "标题"` | 新建文章 |
| `npm run server` | 本地预览 http://localhost:4000 |
| `npm run clean` | 清除构建缓存 |
| `npm run build` | 本地构建到 `public/` |

## 主题自定义

需要调整主题时，把对应配置项写进 `_config.butterfly.yml` 即可覆盖默认值，
完整配置项见 [Butterfly 文档](https://butterfly.js.org)。
