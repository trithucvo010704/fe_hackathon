---
name: fcm-push
description: Tích hợp Firebase Cloud Messaging (FCM) SDK và Service Worker Background Handler để nhận thông báo đẩy.
---

## Description
Tích hợp FCM SDK vào React, xin quyền thông báo, lấy token đẩy lên backend, và viết Service Worker background handler (`firebase-messaging-sw.js`) để nhận và hiển thị thông báo đẩy kể cả khi app đóng hoặc offline.

## Triggers
- Kích hoạt khi có yêu cầu tích hợp tính năng Push Notification (tin nhắn chat, alert marketing, công việc).

## Inputs
| Tên | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| firebaseConfig | JSON | Có | Config của Firebase Project lấy từ Firebase Console. |
| vapidKey | String | Có | Khóa VAPID để lấy token FCM. |

## Outputs
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| fcm_service_code | String | File code `src/services/fcm.js` khởi tạo client-level messaging. |
| fcm_sw_code | String | File code `public/firebase-messaging-sw.js` chạy ở Service Worker level. |

## Steps
1. **Khởi tạo Client Level FCM:**
   - Tạo `src/services/fcm.js` import SDK (`firebase/app`, `firebase/messaging`).
   - Viết hàm `requestNotificationPermission()` xin quyền và `fetchFCMToken()` lấy token gửi lên Spring Boot backend.
   - Thiết lập `onMessage(messaging, (payload) => { ... })` xử lý tin nhắn đẩy khi app mở (foreground toast).
2. **Cài đặt Service Worker Background Handler:**
   - Tạo `public/firebase-messaging-sw.js` import compat scripts của Firebase.
   - Khởi tạo app firebase trong SW và gọi `messaging.onBackgroundMessage((payload) => { ... })`.
   - Sử dụng `self.registration.showNotification(title, options)` hiển thị thông báo đẩy lên màn hình khóa di động khi app đang đóng/offline.
3. **Đồng bộ hóa với main SW:**
   - Cấu hình `workbox: { importScripts: ["/firebase-messaging-sw.js"] }` trong `vite.config.js`.

## Error Handling
| Tình huống Lỗi | Nguyên nhân | Cách xử lý |
|----------------|-------------|------------|
| Permission denied | User chặn quyền | Lưu localStorage trạng thái block. Hiển thị banner hướng dẫn User cấp lại quyền trong trình duyệt. |
| Token hết hạn | Token bị thu hồi | Thiết lập hàm xin lại token mới khi khởi chạy ứng dụng. |
