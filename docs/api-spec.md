# API Specification - App Namespace

Tài liệu này định nghĩa giao ước kết nối (Data Contract) chính thức giữa Backend và Frontend cho các tính năng thuộc namespace `/app`. Đây là **Shared Contract** duy nhất dùng để phát triển tích hợp.

---

## 1. Cấu Trúc Phản Hồi Chuẩn (Base Response Format)

Toàn bộ các API đều trả về dữ liệu theo cấu trúc chuẩn sau:

### 1.1. Phản hồi Thành công (Success)
- **HTTP Status:** 200 OK
- **Body:**
```json
{
  "status": 1,
  "message": "success",
  "data": { ... }
}
```
*Ghi chú: `data` có thể là một Object, một List, hoặc `null` tùy theo API.*

### 1.2. Phản hồi Thất bại (Failure)
- **HTTP Status:** 4xx hoặc 5xx
- **Body:**
```json
{
  "status": 0,
  "message": "Mô tả lỗi chi tiết cho người dùng hoặc dev",
  "data": null
}
```

---

## 2. Từ Điển Mã Lỗi (Error Code Dictionary)

| HTTP Status | Ý nghĩa | Mô tả | Hành động gợi ý cho Frontend |
|---|---|---|---|
| 400 | Bad Request | Dữ liệu đầu vào không hợp lệ hoặc thiếu trường bắt buộc. | Hiển thị thông báo lỗi từ field `message`. |
| 401 | Unauthorized | Chưa đăng nhập hoặc Token hết hạn. | Chuyển hướng người dùng về trang Login. |
| 403 | Forbidden | Không có quyền thực hiện hành động này. | Hiển thị thông báo "Bạn không có quyền". |
| 404 | Not Found | Tài nguyên (ID) không tồn tại. | Thông báo dữ liệu không tồn tại. |
| 500 | Internal Server Error | Lỗi hệ thống server. | Thông báo "Hệ thống đang bận, vui lòng thử lại sau". |

---

## 3. Quy Tắc Thiết Kế Endpoint (RESTful Standards)

- **URL Pattern:** `/api/v1/[resources]` (Hiện tại đang dùng trực tiếp `/app/[resources]`).
- **Naming:** Sử dụng danh từ số nhiều, ngăn cách bằng dấu gạch ngang (kebab-case).
- **Methods:**
    - `GET`: Lấy dữ liệu.
    - `POST`: Tạo mới.
    - `PUT`: Cập nhật toàn bộ/nhiều trường.
    - `PATCH`: Cập nhật một phần (ví dụ: status).
    - `DELETE`: Xóa dữ liệu.

---

## 4. Quản Trị Xác Thực (Auth & Security)

Hệ thống sử dụng **JWT (JSON Web Token)** để xác thực.
- **Header:** `Authorization: Bearer [token]`
- **Cơ chế:** Token được đính kèm trong mọi yêu cầu tới các API thuộc namespace `/app`.

---

## 5. Chi Tiết API (API Details)

### 5.1. Quản lý Dự án (Projects)

#### [GET] /app/projects
- **Mô tả:** Lấy danh sách toàn bộ dự án mà người dùng có quyền xem.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "60d5f1f2e4b0a1b2c3d4e5f6",
      "name": "Hệ thống Quản lý Agent",
      "description": "Dự án phát triển agent AI tự động hóa",
      "leaderId": "user_001",
      "status": "ACTIVE",
      "userIds": ["user_001", "user_002"],
      "createdAt": "2024-05-12T08:00:00Z"
    }
  ]
}
```

#### [GET] /app/projects/{id}
- **Mô tả:** Lấy thông tin chi tiết một dự án theo ID.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": {
    "id": "60d5f1f2e4b0a1b2c3d4e5f6",
    "name": "Hệ thống Quản lý Agent",
    "description": "Dự án phát triển agent AI tự động hóa",
    "leaderId": "user_001",
    "status": "ACTIVE",
    "userIds": ["user_001", "user_002"],
    "telegramId": "-100123456789",
    "docs": {
      "wiki": "http://docs.example.com",
      "design": "http://figma.com/..."
    },
    "createdAt": "2024-05-12T08:00:00Z",
    "updatedAt": "2024-05-12T10:00:00Z"
  }
}
```

#### [PUT] /app/projects/{id}
- **Mô tả:** Cập nhật thông tin dự án.
- **Request Body:** Tương tự `POST /app/projects`.
- **Response (200 OK):** Trả về ProjectDTO đã cập nhật.

#### [DELETE] /app/projects/{id}
- **Mô tả:** Xóa dự án.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "Project deleted successfully",
  "data": null
}
```
```

#### [POST] /app/projects
- **Mô tả:** Tạo mới dự án (Yêu cầu quyền Admin).
- **Request Body:**
```json
{
  "name": "Tên dự án mới",
  "description": "Mô tả dự án",
  "leaderId": "user_id_của_leader",
  "status": "ACTIVE",
  "userIds": ["user_id_1", "user_id_2"],
  "telegramId": "optional_id",
  "docs": {
    "key": "url"
  }
}
```
- **Response (200 OK):** Trả về thông tin dự án vừa tạo tương tự `GET /app/projects/{id}`.

#### [GET] /app/projects/{id}/members
- **Mô tả:** Lấy danh sách thành viên thuộc dự án.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "user_id_1",
      "name": "Nguyen Van A",
      "username": "vana",
      "email": "vana@example.com"
    }
  ]
}
```

#### [POST] /app/projects/{id}/members
- **Mô tả:** Thêm thành viên mới vào dự án bằng user ID.
- **Request Body:**
```json
{
  "userId": "string_user_id"
}
```
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "Member added successfully",
  "data": {
    "id": "user_id_1",
    "name": "Nguyen Van A",
    "username": "vana",
    "email": "vana@example.com"
  }
}
```

#### [DELETE] /app/projects/{id}/members/{userId}
- **Mô tả:** Xóa thành viên khỏi dự án.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "Member removed successfully",
  "data": null
}
```

#### [GET] /app/projects/{id}/available-members
- **Mô tả:** Lấy danh sách những người dùng chưa gia nhập dự án.
- **Response (200 OK):** Trả về danh sách user tương tự `GET /app/projects/{id}/members`.

---

### 5.2. Quản lý Epic (Project Epics)

#### [GET] /app/project-epics/project/{projectId}
- **Mô tả:** Lấy danh sách Epic thuộc một dự án.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "epic_001",
      "projectId": "60d...f6",
      "key": "EZI-01",
      "title": "Xây dựng hạ tầng Core",
      "status": "OPEN",
      "priority": "HIGH",
      "deadline": "2024-06-01T00:00:00Z"
    }
  ]
}
```

#### [POST] /app/project-epics
- **Mô tả:** Tạo mới Epic. Hệ thống sẽ tự động sinh `key` (ví dụ: EZI-01).
- **Request Body:**
```json
{
  "projectId": "project_id_bắt_buộc",
  "title": "Tiêu đề Epic",
  "description": "Mô tả chi tiết",
  "priority": "HIGH",
  "status": "OPEN",
  "deadline": "2024-06-01T00:00:00Z"
}
```

#### [PUT] /app/project-epics/{id}
- **Mô tả:** Cập nhật Epic.

#### [DELETE] /app/project-epics/{id}
- **Mô tả:** Xóa Epic.

---

### 5.3. Quản lý Story (Project Stories)

#### [GET] /app/project-stories/project/{projectId}
- **Mô tả:** Lấy toàn bộ Story của dự án.
- **Response:** Danh sách Story tương tự Epic nhưng có thêm `epicId`.

#### [GET] /app/project-stories/epic/{epicId}
- **Mô tả:** Lấy danh sách Story thuộc một Epic cụ thể. Dùng cho màn hình chi tiết Epic.
- **Response (200 OK):** Trả về danh sách StoryDTO.

#### [POST] /app/project-stories
- **Mô tả:** Tạo mới Story. Hệ thống sẽ tự động sinh `key` (ví dụ: EZI-05).
- **Request Body:**
```json
{
  "projectId": "id",
  "epicId": "id (optional)",
  "title": "Tiêu đề Story",
  "description": "Mô tả chi tiết",
  "priority": "MEDIUM",
  "deadline": "2024-05-20",
  "status": "TODO"
}
```

#### [PUT] /app/project-stories/{id}
- **Mô tả:** Cập nhật Story.

#### [DELETE] /app/project-stories/{id}
- **Mô tả:** Xóa Story.

---

### 5.4. Quản lý Task & Sprint (Tasks & Sprints)

Section này bao gồm các API quản lý Task (Issue), Backlog và Sprint.

#### 5.4.1. Quản lý Task (Issues)

##### [GET] /app/project-tasks/backlog/project/{projectId}
- **Mô tả:** Lấy danh sách task đang nằm trong backlog (chưa gán vào sprint nào) của dự án.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "60d...a1",
      "projectId": "60d...f6",
      "storyId": "story_001",
      "key": "EZI-12",
      "title": "Thiết kế UI cho trang Dashboard",
      "storyPoint": 5,
      "status": "BACKLOG",
      "assigneeId": "user_001",
      "assignee": "Nguyen Van A",
      "createdAt": "2024-05-12T08:00:00",
      "updatedAt": "2024-05-12T10:00:00"
    }
  ]
}
```

##### [GET] /app/project-tasks/sprint/{sprintId}
- **Mô tả:** Lấy danh sách task trong một Sprint cụ thể (dạng phẳng).
- **Response (200 OK):** Trả về danh sách TaskDTO tương tự API backlog.

##### [GET] /app/project-tasks/sprint/{sprintId}/group-by-story
- **Mô tả:** Lấy danh sách task trong sprint nhưng đã được nhóm theo Story (dùng cho hiển thị Swimlanes trong Active Sprint).
- **Response (200 OK):** Tương tự các API danh sách task khác, dữ liệu được nhóm theo story.

##### [GET] /app/project-tasks/story/{storyId}
- **Mô tả:** Lấy danh sách task thuộc một Story cụ thể. Thường dùng cho màn hình chi tiết Story.
- **Response (200 OK):** Trả về danh sách TaskDTO (bao gồm cả trường `assignee` là tên đầy đủ của người được giao).
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "storyId": "60d...s1",
      "storyKey": "EZI-05",
      "storyTitle": "Tính năng Đăng ký người dùng",
      "tasks": [
        { "id": "task_1", "title": "Thiết kế DB", "status": "DONE" },
        { "id": "task_2", "title": "Viết API", "status": "IN_PROGRESS" }
      ]
    },
    {
      "storyId": null,
      "storyKey": "NONE",
      "storyTitle": "Other Tasks",
      "tasks": [
        { "id": "task_3", "title": "Fix bug giao diện", "status": "TODO" }
      ]
    }
  ]
}
```

##### [POST] /app/project-tasks
- **Mô tả:** Tạo mới một Task. Hệ thống tự động sinh `key`.
- **Request Body:**
```json
{
  "projectId": "60d...f6",
  "storyId": "60d...s1 (optional)",
  "sprintId": "60d...sp1 (optional)",
  "title": "Tiêu đề Task",
  "storyPoint": 3,
  "status": "BACKLOG",
  "assigneeId": "user_id",
  "deadline": "2024-05-25",
  "description": "Mô tả chi tiết công việc",
  "category": "FRONTEND"
}
```
- **Response (200 OK):** Trả về `AppProjectTaskDTO` vừa tạo.

##### [PUT] /app/project-tasks/{id}
- **Mô tả:** Cập nhật thông tin chi tiết của một Task.
- **Request Body:** Tương tự `POST`, không bắt buộc gửi `projectId`.
- **Response (200 OK):** Trả về `AppProjectTaskDTO` đã cập nhật.

##### [DELETE] /app/project-tasks/{id}
- **Mô tả:** Xóa Task khỏi hệ thống.
- **Response (200 OK):** `{"status": 1, "message": "Task deleted successfully", "data": null}`

##### [PATCH] /app/project-tasks/{id}/status?status={NEW_STATUS}
- **Mô tả:** Cập nhật trạng thái xử lý của Task.
- **Query Params:** 
    - `status`: Giá trị Enum (`BACKLOG`, `IN_PROGRESS`, `REVIEW`, `NEED_FIX`, `DONE`, `CANCEL`, `STORED`, `CLOSED`).
- **Response (200 OK):** Trả về `AppProjectTaskDTO` với status mới.

##### [PUT] /app/project-tasks/{id}/move-to-sprint/{sprintId}
- **Mô tả:** Di chuyển task từ backlog vào sprint hoặc giữa các sprint.
- **Response (200 OK):** Trả về TaskDTO đã cập nhật `sprintId`.

##### [PUT] /app/project-tasks/{id}/move-to-backlog
- **Mô tả:** Gỡ task khỏi sprint hiện tại và đưa về Backlog.
- **Response (200 OK):** Trả về TaskDTO với `sprintId = null`.

#### 5.4.2. Quản lý Sprint

##### [GET] /app/project-sprints/project/{projectId}
- **Mô tả:** Lấy danh sách Sprint của một dự án.
- **Query Params:** 
    - `status`: (Optional) Lọc theo trạng thái (`PENDING`, `ACTIVE`, `CLOSED`).
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "60d...s1",
      "projectId": "60d...f6",
      "key": "EZI-S01",
      "name": "Sprint 1 - Core Backend",
      "status": "PENDING",
      "startDate": "2024-05-01",
      "endDate": "2024-05-14",
      "createdBy": "admin",
      "createdAt": "2024-04-20T10:00:00"
    }
  ]
}
```

##### [POST] /app/project-sprints
- **Mô tả:** Tạo mới một Sprint (trạng thái mặc định là PENDING).
- **Request Body:**
```json
{
  "projectId": "60d...f6",
  "name": "Sprint Name",
  "startDate": "2024-06-01",
  "endDate": "2024-06-14"
}
```
- **Response (200 OK):** Trả về `AppProjectSprintDTO` vừa tạo.

##### [PUT] /app/project-sprints/{id}/start
- **Mô tả:** Chuyển trạng thái Sprint sang `ACTIVE`.
- **Response (200 OK):** Trả về SprintDTO.

##### [PUT] /app/project-sprints/{id}/complete
- **Mô tả:** Chuyển trạng thái Sprint sang `CLOSED`.
- **Response (200 OK):** Trả về SprintDTO.

##### [DELETE] /app/project-sprints/{id}
- **Mô tả:** Xóa Sprint. Lưu ý: Thường chỉ xóa được khi Sprint ở trạng thái PENDING.
- **Response (200 OK):** `{"status": 1, "message": "Sprint deleted successfully", "data": null}`


---

### 5.5. Ghi log thời gian (Work Logs)

#### [GET] /app/work-logs/task/{taskId}
- **Mô tả:** Lấy danh sách toàn bộ log thời gian của một Task cụ thể.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "60d...log1",
      "taskId": "task_id",
      "storyId": "story_id",
      "userId": "user_id",
      "username": "kevin",
      "timeSpentHours": 2,
      "progressPercent": 45.5,
      "comment": "Đã xong phần giao diện cơ bản",
      "loggingAt": "2024-05-12T10:00:00Z"
    }
  ]
}
```

#### [POST] /app/work-logs
- **Mô tả:** Người dùng ghi nhận thời gian làm việc và tiến độ cho một Task.
- **Request Body:**
```json
{
  "taskId": "task_id",
  "storyId": "story_id (optional)",
  "timeSpentHours": 2,
  "progressPercent": 50,
  "comment": "Nội dung công việc hôm nay",
  "resolved": false
}
```
- **Response (200 OK):** Trả về `AppWorkLogDTO` vừa tạo tương tự định dạng trong mảng trả về của API GET.

---

### 5.6. Tích hợp Bitbucket (Repositories)

#### [GET] /app/bitbucket-repositories/project/{projectId}
- **Mô tả:** Danh sách các repository đã được kết nối vào dự án.

#### [GET] /app/bitbucket-repositories/external/workspace/{workspace}
- **Mô tả:** Lấy danh sách repository thực tế từ Bitbucket Cloud của một workspace.

#### [POST] /app/bitbucket-repositories
- **Mô tả:** Lưu thông tin repository vào dự án.
- **Request Body:**
```json
{
  "projectId": "id",
  "name": "Repo Name",
  "fullName": "workspace/repo-name",
  "description": "description",
  "scm": "git",
  "links": { "self": "..." }
}
```

#### [DELETE] /app/bitbucket-repositories/{id}
- **Mô tả:** Xóa/Ngắt kết nối repository khỏi dự án.

---

### 5.7. Tài liệu hướng dẫn (Guideline Docs)

#### [GET] /app/guideline-docs
- **Mô tả:** Lấy danh sách các tài liệu hướng dẫn quy chuẩn.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "60d...g1",
      "level": "PROJECT",
      "name": "Quy chuẩn đặt tên",
      "description": "Hướng dẫn đặt tên biến và hàm",
      "content": "Nội dung markdown...",
      "createdBy": "admin",
      "createdAt": "2024-05-12T08:00:00",
      "updatedAt": "2024-05-12T10:00:00"
    }
  ]
}
```

#### [POST] /app/guideline-docs
- **Mô tả:** Tạo mới tài liệu hướng dẫn (Yêu cầu quyền Admin).
- **Request Body:**
```json
{
  "level": "PROJECT",
  "name": "Tên tài liệu",
  "description": "Mô tả ngắn",
  "content": "Nội dung markdown..."
}
```
- **Response (200 OK):** Trả về `AppGuidelineDocDTO` vừa tạo.

#### [PUT] /app/guideline-docs/{id}
- **Mô tả:** Cập nhật tài liệu hướng dẫn (Yêu cầu quyền Admin).
- **Request Body:** Tương tự `POST`.
- **Response (200 OK):** Trả về `AppGuidelineDocDTO` đã cập nhật.

#### [DELETE] /app/guideline-docs/{id}
- **Mô tả:** Xóa tài liệu hướng dẫn (Yêu cầu quyền Admin).
- **Response (200 OK):** 
```json
{
  "status": 1,
  "message": "Guideline deleted successfully",
  "data": null
}
```

#### [POST] /app/guideline-docs/upload (Multipart)
- **Mô tả:** Upload nhiều tài liệu hướng dẫn cùng lúc và gán `level` cho chúng. (Yêu cầu quyền Admin).
- **Consumes:** `multipart/form-data`
- **Params:**
    - `level`: Cấp độ của tài liệu (ví dụ: PROJECT, EPIC, STORY, TASK).
    - `files`: Mảng các file upload (.txt, .md, .docx).
- **Response (200 OK):** Trả về danh sách `AppGuidelineDocDTO` vừa tạo.



---

### 5.8. Tài liệu dự án (Project Documents)

#### [GET] /app/project-documents/ref/{refType}/{refId}
- **Mô tả:** Lấy danh sách file/tài liệu đính kèm theo tham chiếu.
- **Params:** 
    - `refType`: Loại tham chiếu (PROJECT, EPIC, STORY, TASK).
    - `refId`: ID của đối tượng tương ứng.

#### [POST] /app/project-documents/upload (Multipart)
- **Mô tả:** Upload nhiều tài liệu cùng lúc. Hỗ trợ trích xuất nội dung từ file text (.txt, .md) và Word (.docx).
- **Consumes:** `multipart/form-data`
- **Params:**
    - `refType`: Loại tham chiếu.
    - `refId`: ID tham chiếu.
    - `description`: Mô tả (optional).
    - `files`: Mảng các file upload.
- **Ghi chú:** Nếu tên file trùng với file đã có trong cùng một `refId`, hệ thống sẽ ghi đè nội dung.

---

### 5.9. Quản lý Người dùng (Users)

#### [GET] /app/users
- **Mô tả:** Lấy danh sách người dùng trong hệ thống.
- **Query Params:**
    - `exclude_project_id`: ID của dự án để loại trừ các thành viên đã tham gia dự án này khỏi danh sách kết quả.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "user_id_1",
      "name": "Nguyen Van A",
      "username": "vana",
      "email": "vana@example.com"
    }
  ]
}
```

---

### 5.10. Hội thoại & Chat (Conversations)

#### [GET] /app/chat/conversations
- **Mô tả:** Lấy danh sách các cuộc hội thoại của người dùng hiện tại.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "conversation_id": "conv_001",
      "title": "Chat vs Senior Dev - Dự án EziOps",
      "owner_id": "user_001",
      "type": "U2A",
      "project_id": "proj_001"
    }
  ]
}
```

#### [POST] /app/chat/conversations
- **Mô tả:** Tạo mới một cuộc hội thoại cá nhân.

#### [POST] /app/chat/conversations/agent
- **Mô tả:** Tạo mới một cuộc hội thoại với Agent (Brain).
- **Request Body:**
```json
{
  "brain_id": "brain_001",
  "project_id": "proj_001"
}
```
- **Logic:** Tự động tạo tiêu đề theo mẫu `Chat vs {brainName} - Dự án {projectName}`.
- **Response (200 OK):** Trả về `ChatConversationDTO`.

#### [GET] /app/chat/conversations/{id}/messages
- **Mô tả:** Lấy danh sách tin nhắn của một cuộc hội thoại.
- **Query Params:**
    - `page`: Số trang (mặc định 0).
- **Phân trang:** Trả về 50 tin nhắn mỗi trang, sắp xếp từ mới nhất đến cũ nhất.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "msg_001",
      "role": "USER",
      "sender": "user_001",
      "payload": {
        "text": "Hello Agent!"
      },
      "created_at": "2024-05-14T10:00:00Z"
    }
  ]
}
```

---

### 5.11. Quản lý AI Model (AI Models)

#### [GET] /app/ai-models
- **Mô tả:** Lấy danh sách toàn bộ các AI Model được hỗ trợ.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "model_001",
      "name": "gemini-1.5-pro",
      "provider": "GOOGLE",
      "displayName": "Gemini 1.5 Pro",
      "createdAt": "2024-05-12T08:00:00Z"
    }
  ]
}
```

#### [POST] /app/ai-models
- **Mô tả:** Thêm một AI Model mới vào hệ thống.
- **Request Body:**
```json
{
  "name": "gpt-4o",
  "provider": "OPENAI",
  "displayName": "GPT-4o"
}
```
- **Response (200 OK):** Trả về AiModelDTO vừa tạo.

#### [PUT] /app/ai-models/{id}
- **Mô tả:** Cập nhật thông tin AI Model.

#### [DELETE] /app/ai-models/{id}
- **Mô tả:** Xóa AI Model.

---

### 5.12. Quản lý Môi trường AI (AI Environments)

#### [GET] /app/ai-envs
- **Mô tả:** Lấy danh sách các cấu hình môi trường AI (API Keys, Production Mode).
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "env_001",
      "name": "Google Vertex AI Prod",
      "provider": "GOOGLE",
      "productionMode": true,
      "createdAt": "2024-05-12T08:00:00Z"
    }
  ]
}
```

#### [POST] /app/ai-envs
- **Mô tả:** Tạo mới cấu hình môi trường AI.
- **Request Body:**
```json
{
  "name": "OpenAI Dev",
  "provider": "OPENAI",
  "productionMode": false,
  "apiKey": "sk-..."
}
```
- **Response (200 OK):** Trả về AiEnvDTO vừa tạo.

#### [PUT] /app/ai-envs/{id}
- **Mô tả:** Cập nhật cấu hình môi trường AI.

#### [DELETE] /app/ai-envs/{id}
- **Mô tả:** Xóa cấu hình môi trường AI.

---

### 5.13. Quản lý Não bộ Agent (Agent Brains)

#### [GET] /app/agent-brains
- **Mô tả:** Lấy danh sách các cấu hình não bộ Agent.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "brain_001",
      "name": "Senior Developer Brain",
      "modelId": "model_001",
      "envId": "env_001",
      "systemInstruction": "You are a senior developer...",
      "temperature": 0.7,
      "thinkingLevel": "HIGH",
      "mcpServerIds": ["mcp_001", "mcp_002"],
      "googleSearch": true,
      "includeThoughts": true
    }
  ]
}
```

#### [POST] /app/agent-brains
- **Mô tả:** Tạo mới cấu hình não bộ cho Agent.
- **Request Body:**
```json
{
  "name": "Creative Assistant",
  "modelId": "model_002",
  "envId": "env_002",
  "systemInstruction": "Be creative and helpful.",
  "temperature": 0.9,
  "thinkingLevel": "MEDIUM",
  "mcpServerIds": [],
  "promptTemplate": "User request: {{request}}",
  "googleSearch": false,
  "includeThoughts": false
}
```
- **Response (200 OK):** Trả về AgentBrainDTO vừa tạo.

#### [PUT] /app/agent-brains/{id}
- **Mô tả:** Cập nhật cấu hình não bộ.

#### [DELETE] /app/agent-brains/{id}
- **Mô tả:** Xóa cấu hình não bộ.

---

### 5.14. OAuth & Thông tin người dùng (OAuth & User Me)

#### [GET] /app/oauth/me
- **Mô tả:** Lấy thông tin chi tiết của người dùng hiện tại đang đăng nhập. Dùng cho mục đích hiển thị tên và phân quyền trên UI.
- **Xác thực:** Yêu cầu Bearer Token.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": {
    "id": "60d5f1f2e4b0a1b2c3d4e5f6",
    "name": "Nguyen Van A",
    "roles": ["admin", "developer"]
  }
}
```

---

### 5.15. Quản lý Vai trò (Admin Roles)

#### [GET] /app/admin/roles
- **Mô tả:** Lấy danh sách tất cả các vai trò trong hệ thống.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "success",
  "data": [
    {
      "id": "role_001",
      "name": "ADMIN",
      "description": "Administrator"
    }
  ]
}
```

#### [POST] /app/admin/roles
- **Mô tả:** Tạo mới một vai trò.
- **Request Body:**
```json
{
  "name": "DEVELOPER",
  "description": "Software Developer"
}
```
- **Response (200 OK):** Trả về RoleDTO vừa tạo.

#### [PUT] /app/admin/roles/{id}
- **Mô tả:** Cập nhật vai trò.

#### [DELETE] /app/admin/roles/{id}
- **Mô tả:** Xóa vai trò.

---

### 5.16. Quản lý Người dùng (Admin Users)

#### [GET] /app/admin/users
- **Mô tả:** Lấy danh sách toàn bộ người dùng để quản trị.
- **Response (200 OK):** Trả về danh sách UserDTO.

#### [PUT] /app/admin/users/{id}/approve
- **Mô tả:** Duyệt kích hoạt tài khoản người dùng.
- **Response (200 OK):**
```json
{
  "status": 1,
  "message": "User approved successfully",
  "data": {
    "id": "user_123",
    "isActive": true
  }
}
```
