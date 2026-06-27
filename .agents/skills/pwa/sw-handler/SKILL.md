---
name: sw-handler
description: Xây dựng React hook useRegisterSW và component ReloadPrompt hiển thị modal thông báo cập nhật Service Worker.
---

## Description
Cài đặt hook đăng ký Service Worker (`virtual:pwa-register/react`) và dựng UI Update Prompt Modal để thông báo và cho phép người dùng reload ứng dụng ngay khi có bản build mới trên server.

## Triggers
- Kích hoạt khi dựng root layout (`App.jsx` / `main.jsx`) để tích hợp cơ chế lắng nghe cập nhật Service Worker.

## Inputs
Không có.

## Outputs
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| register_sw_hook | String | Code hook `useRegisterSW` để quản lý sự kiện. |
| update_prompt_component | String | Code component `ReloadPrompt.jsx` hiển thị UI thông báo (TailwindCSS). |

## Steps
1. **Import module:** Sử dụng `virtual:pwa-register/react` từ `vite-plugin-pwa`.
2. **Cài đặt Hook useRegisterSW:**
   - Lắng nghe `offlineReady` (đã sẵn sàng offline) và `needRefresh` (có build mới).
   - Gọi `updateServiceWorker(true)` để reload khi click cập nhật.
3. **Dựng UI Modal (TailwindCSS):**
   - Viết `ReloadPrompt.jsx` hiển thị modal ở góc dưới màn hình.
   - Thêm nút "Tải lại" và "Đóng".
4. **Nhúng Root:** Đặt `ReloadPrompt` vào root component.

## Error Handling
| Tình huống Lỗi | Nguyên nhân | Cách xử lý |
|----------------|-------------|------------|
| Không nhận update | Chạy ở chế độ dev chưa bật SW | Cấu hình `devOptions: { enabled: true }` trong `vite.config.js` để test. |
| Lỗi TS import | Thiếu type definition cho virtual module | Thêm `/// <reference types="vite-plugin-pwa/react" />` vào `vite-env.d.ts`. |
