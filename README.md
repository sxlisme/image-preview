# 图片在线预览

一个简洁的图片预览工具，支持照片墙、全屏预览和高级模式。

## 功能

- **照片墙** - 一行3张，16:9 比例，展示文件名、尺寸和大小
- **全屏预览** - 点击缩略图进入全屏，左右区域点击或方向键切换图片
- **退出特效** - 退出全屏时背光渐变过渡，平滑回到原位置
- **高级模式** - 自定义文字水印效果
  - 快速填充文字模板（essential; / playlist. / GAME OVER）
  - 自定义文字颜色、字体、字号
  - 毛玻璃背景效果（可调节模糊程度）

## 技术栈

- Vue 3 + Vite
- Ant Design Vue

## 本地运行

```bash
npm install
npm run dev
```

## 预览

https://sxlisme.github.io/image-preview/

## 部署

推送到 GitHub main 分支后自动部署到 GitHub Pages
