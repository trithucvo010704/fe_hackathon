---
name: offline-storage
description: Cấu hình Workbox caching và IndexedDB/localForage để lưu trữ dữ liệu thô hoạt động ngoại tuyến.
---

## Description
Cấu hình chiến lược Workbox caching (`NetworkFirst` / `StaleWhileRevalidate`) cho API lấy dữ liệu dự án/chiến dịch trong `vite-plugin-pwa`, đồng thời tích hợp `localForage` (IndexedDB) để lưu trữ và đọc dữ liệu thô khi thiết bị mất mạng.

## Triggers
- Kích hoạt khi phát triển màn hình danh sách dự án/chiến dịch BĐS cần hỗ trợ hiển thị ngoại tuyến.

## Inputs
Không có.

## Outputs
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| workbox_api_cache_config | String | Cấu hình `runtimeCaching` cho `vite.config.js`. |
| offline_db_service | String | File code `src/services/offlineDb.js` đọc/ghi localForage. |

## Steps
1. **Cấu hình Workbox Caching:**
   - Trong `vite.config.js` -> `VitePWA` -> `workbox.runtimeCaching`:
     - Thiết lập route cho API dự án (`/api/v1/products/.*`).
     - Chọn chiến lược `NetworkFirst`, fallback sang cache local khi mất kết nối mạng.
2. **Xây dựng Offline DB Service (localForage):**
   - Viết hàm `saveProjectsToOfflineDB(projects)` lưu danh sách API thô vào IndexedDB.
   - Viết hàm `getProjectsFromOfflineDB()` đọc IndexedDB khi offline.
3. **Tích hợp Offline State Detector trong React:**
   - Lắng nghe sự kiện `online` / `offline` và `navigator.onLine`.
   - Hiển thị **Offline Banner**.
   - *Online:* Gọi API -> lưu IndexedDB -> render UI.
   - *Offline:* Đọc IndexedDB -> render UI, khóa các nút tạo mới (chờ sync khi online).

## Error Handling
| Tình huống Lỗi | Nguyên nhân | Cách xử lý |
|----------------|-------------|------------|
| Quá dung lượng | Vượt quota storage | Cấu hình Workbox expiration manager tự động xóa cache API cũ vượt quá 50 bản ghi. |
| IDB blocked | Tab ẩn danh block IndexedDB | Fallback tự động sử dụng localStorage hoặc lưu tạm vào RAM State (Zustand). |
