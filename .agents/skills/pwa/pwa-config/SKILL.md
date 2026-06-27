---
name: pwa-config
description: Cấu hình vite-plugin-pwa trong vite.config.js thiết lập Manifest, Icons và Workbox Precaching.
---

## Description
Cấu hình plugin `vite-plugin-pwa` trong `vite.config.js` cho dự án React + Vite để tạo Web App Manifest (hỗ trợ A2HS trên iOS/Android) và Workbox precaching assets tĩnh.

## Triggers
- Kích hoạt khi bắt đầu tích hợp PWA hoặc cập nhật Manifest (icons, colors).

## Inputs
| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| appName | String | Có | Tên đầy đủ ứng dụng. |
| shortName | String | Có | Tên hiển thị màn hình (A2HS). |
| themeColor | String | Có | Màu chủ đạo của PWA. |
| backgroundColor | String | Có | Màu nền splash screen. |

## Outputs
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| vite_config_code | String | Mã cấu hình `VitePWA` cho `vite.config.js`. |

## Steps
1. **Thiết lập Manifest:**
   - Cài đặt `name` (appName), `short_name` (shortName), `theme_color`, `background_color`.
   - Cài đặt `display: "standalone"`, `orientation: "portrait"`.
   - Cấu hình icons chuẩn: `192x192`, `512x512` (gồm cả maskable).
2. **Cấu hình Precaching:**
   - Chọn `registerType: "prompt"`.
   - Cấu hình `workbox: { globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"] }` để cache trước code tĩnh.
3. **Tích hợp:** Nhập plugin `VitePWA` và nhúng vào `plugins` trong `vite.config.js`.

## Error Handling
| Tình huống Lỗi | Nguyên nhân | Cách xử lý |
|----------------|-------------|------------|
| Thiếu icons | Folder `/public` chưa có ảnh | Hướng dẫn User chuẩn bị icon 192x192, 512x512 đặt vào `/public/icons/`. |
| Lỗi iOS A2HS | Safari không nhận standalone | Thêm thẻ meta iOS vào `index.html`: `apple-mobile-web-app-capable="yes"`. |
