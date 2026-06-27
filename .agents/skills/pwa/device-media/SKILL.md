---
name: device-media
description: Kết nối Web MediaDevices API trong React để quay video, chụp ảnh, và ghi âm lệnh thoại di động.
---

## Description
Sử dụng các HTML5 API chuẩn (`navigator.mediaDevices.getUserMedia`) để kết nối trực tiếp với camera/microphone di động để chụp ảnh, quay video thực tế dự án, record voice và xuất file `Blob` / `File` tải lên server.

## Triggers
- Kích hoạt khi xây dựng các tính năng chụp ảnh dự án, quay phim ngắn BĐS hoặc ghi âm lệnh thoại của Broker.

## Inputs
Không có.

## Outputs
| Tên | Kiểu | Mô tả |
|-----|------|-------|
| use_camera_hook | String | Code React hook `useCamera` (chụp ảnh, quay video camera sau). |
| use_voice_recorder_hook | String | Code React hook `useVoiceRecorder` (ghi âm mic). |
| media_component | String | React UI component live preview camera và các nút tương tác. |

## Steps
1. **Hook useCamera (Camera API):**
   - Mở camera sau: `navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true })`.
   - **Chụp ảnh:** Vẽ frame video lên canvas, xuất Blob JPEG qua `canvas.toBlob()`.
   - **Quay video:** Dùng `MediaRecorder` thu stream, lắng nghe `dataavailable` gom blob, xuất file MP4.
2. **Hook useVoiceRecorder (Audio API):**
   - Mở mic: `getUserMedia({ audio: true })`.
   - Dùng `MediaRecorder` ghi âm định dạng `audio/webm` hoặc `audio/mp4`.
3. **Đóng gói & Giải phóng tài nguyên:**
   - Chuyển Blob thành `File` object bỏ vào `FormData` gửi POST API.
   - Bắt buộc tắt toàn bộ track (`track.stop()`) khi đóng camera/mic để bảo vệ pin và quyền riêng tư.

## Error Handling
| Tình huống Lỗi | Nguyên nhân | Cách xử lý |
|----------------|-------------|------------|
| Permission denied | User block quyền | Hiển thị thông báo yêu cầu cấp quyền Camera/Mic trong cài đặt trình duyệt. |
| facingMode fail | Không có camera sau | Tự động fallback về cấu hình mặc định `{ video: true }` để mở camera khả dụng. |
