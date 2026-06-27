# EziOps Platform - Design System Specification

## Đề xuất Font chữ Tiếng Việt cho Design System

Tài liệu gốc có đề xuất sử dụng font **Inter** hoặc font mặc định của hệ thống. Để tối ưu hóa hiển thị tiếng Việt cho một nền tảng quản trị (Dashboard/Admin) như EziOps, có hai lựa chọn xuất sắc nhất:

1. **Inter (Khuyên dùng chính thức):**
    * **Lý do:** Inter là font chữ không chân (sans-serif) được thiết kế đặc biệt cho màn hình máy tính và giao diện UI phức tạp. Khi hiển thị tiếng Việt, các dấu thanh (sắc, huyền, hỏi, ngã, nặng) được căn chỉnh rất cân đối, không làm thay đổi chiều cao dòng (line-height) đột ngột – lỗi rất hay gặp ở các font tiếng Anh thông thường. Font chữ này mang lại cảm giác công nghệ, rõ ràng và hiện đại.
2. **Be Vietnam Pro (Lựa chọn thay thế):**
    * **Lý do:** Đây là một bộ font do người Việt thiết kế, tối ưu hóa 100% cho các ký tự tiếng Việt có dấu. Font có hình khối hình học rất đẹp, khoảng cách ký tự hoàn hảo cho các bảng dữ liệu lớn (Data Table).

---

## 1. Nguyên tắc nền tảng (Foundations)

### 1.1. Bảng màu (Color Palette)
Hệ thống màu sắc được định nghĩa qua các CSS Variables toàn cục để đảm bảo tính nhất quán:

* **Màu nền & Khung (Backgrounds & Borders):**
    * `--background`: `#f8fafc` (Xám rất nhạt) — Dùng cho nền tổng thể hệ thống.
    * `--bg-container`: `#ffffff` (Trắng) — Dùng cho các container quản lý.
    * `--bg-input`: `#f8fafc` — Dùng cho ô nhập liệu và bộ lọc.
    * `--bg-tabs`: `#f1f5f9` — Dùng cho container của các tab trạng thái.
    * `--border-color`: `#e2e8f0` (Độ dày `1px` cho container, `1.5px` cho ô tìm kiếm).
* **Màu thương hiệu & Hành động (Brand & Action Colors):**
    * `--primary` / `--btn-primary`: `#3b82f6` (Blue) — Dùng cho nút Create, nút Primary, ID Column, và trạng thái Focus.
    * `--bg-active-nav`: `#eff6ff` (Light Blue) — Dùng cho nền của menu điều hướng đang hoạt động.
* **Màu văn bản (Typography Colors):**
    * `--text-primary`: `#1e293b` (Slate Dark) — Dùng cho tiêu đề lớn, tên thông tin chính.
    * `--text-active`: `#3b82f6` — Dùng cho chữ trong menu điều hướng đang hoạt động.
    * `--text-muted`: Dạng placeholder hoặc chữ mờ cho tìm kiếm tổng cục.
* **Màu trạng thái Badge (Status Colors):**
    * `Active`: Green (Xanh lá).
    * `Inactive`: Red (Đỏ).
    * `In Progress`: Blue (Xanh dương).
    * `Done`: Emerald (Xanh ngọc bảo).

### 1.2. Hệ thống kiểu chữ (Typography)
* **Font chữ:** `Inter`, `Be Vietnam Pro` hoặc hệ thống mặc định (Sans-serif).
* **Cấp bậc văn bản (Hierarchy):**
    * *Tiêu đề trang (Page Title):* Kích thước `1.875rem` (30px), Weight `800`, màu `#1e293b`.
    * *Tiêu đề bảng (Table Header):* Chữ in hoa (Uppercase), Weight `800`, khoảng cách chữ (Letter-spacing) `0.05em`.
    * *Thông tin chính (Main Info):* Weight `700`, màu `#1e293b`.
    * *Cột mã/ID (Key/ID Column):* Font Monospace (nếu phù hợp), Weight `700`, màu tương phản cao `#3b82f6`.
    * *Nút bấm chính (Primary Button):* Weight `700`.

### 1.3. Khoảng cách & Bo góc (Spacing & Radii)
* **Độ bo góc (Border Radius):**
    * `16px`: Dùng cho Container chính của trang quản lý.
    * `14px`: Dùng cho Input thanh tìm kiếm và bộ lọc.
    * `12px`: Dùng cho nút bấm khởi tạo ("Create").
    * `10px`: Dùng cho Status Badges và các nút hành động (Edit, Delete).
* **Khoảng cách đệm (Padding & Gap):**
    * `32px`: Padding bên trong của Container chính.
    * `24px`: Padding mặc định bao quanh vùng Main Content (`DashboardLayout`) và padding nội bộ của form modal.
    * `20px`: Padding cho các dòng trong bảng dữ liệu (Table Rows) và khoảng cách (Gap) của `.project-form`.
    * `12px`: Padding cho nút bấm "Create".
    * `8px`: Khoảng cách (Gap) cho nhóm nhập liệu `.form-group` (Label + Input).
    * `4px`: Padding bên trong cụm Tab trạng thái phân đoạn (Segmented Tabs).

---

## 2. Bố cục tổng thể (Master Layout)

Hệ thống sử dụng mô hình bố cục gồm 2 phần phản hồi (Responsive 2-part system) dựa trên component `DashboardLayout`.

### 2.1. Thanh điều hướng bên (Global Sidebar)
* **Vị trí:** Cố định bên trái (Desktop); ẩn trên Mobile/Tablet và kích hoạt qua nút Hamburger với một lớp phủ mờ (overlay).
* **Phần đầu (Header):** Chứa Logo (Icon `Cpu`) và tên ứng dụng ("AgentOps" hoặc "EziOps").
* **Danh mục (Navigation Groups):** Phân chia thành các nhóm logic (ví dụ: General, Administration).
* **Trạng thái Menu Item:**
    * *Active:* Nền màu `#eff6ff`, chữ màu `#3b82f6`, kiểu chữ Bold.
    * *Hover:* Thay đổi nhẹ màu nền.
* **Menu lồng (Collapsible Sections):** Các mục quản lý nâng cao (Admin Management) sử dụng cấu trúc đóng/mở đi kèm biểu tượng chỉ hướng `ChevronDown` / `ChevronRight`.
* **Phần chân (Footer Profile):** Hiển thị ảnh đại diện người dùng (DiceBear SVG), Tên, Vai trò (Role) và nút đăng xuất `LogOut` nổi bật.

### 2.2. Thanh đầu trang (Global Header)
* Thanh ngang cố định dính (sticky) hoặc tương đối ở đỉnh vùng nội dung chính.
* **Trái/Giữa:** Nút bật menu Hamburger (Icon `Menu`, chỉ hiện ở Mobile/Tablet) và Thanh tìm kiếm tổng cục (Global Search) tích hợp biểu tượng `Search`.
* **Phải (Cụm hành động):** Gồm chuỗi các icon tiện ích kích thước `18px`:
    * Thông báo: Icon `Bell` kèm dấu chấm đỏ báo hiệu.
    * Trợ giúp: Icon `HelpCircle`.
    * Chuyển đổi giao diện: Icon `Moon`/`Sun`.

### 2.3. Vùng nội dung chính (Main Content Area)
* Nơi hiển thị các module chức năng với padding cố định `24px` ở mọi phía.
* Hỗ trợ cuộn dọc tự động khi nội dung quá dài trong khi Sidebar và Header giữ nguyên vị trí.

---

## 3. Các thành phần giao diện chuẩn (Components)

### 3.1. Trang quản lý (Management Page Container)
* **Cấu trúc lớp CSS:** `.storyManagement`.
* **Thiết kế:** Nền trắng, bo góc `16px`, padding `32px`, có đổ bóng nhẹ (`box-shadow`) và viền `1px solid #e2e8f0`.
* **Hiệu ứng:** Hoạt ảnh `fadeIn` (opacity từ 0 tăng lên 1, dịch chuyển `translateY(10px -> 0)`) diễn ra trong `0.4s`.

### 3.2. Tiêu đề & Nút hành động chính (Header Section)
* **CSS:** `.storyHeader`.
* **Nút "Create" (Tạo mới):** Nền xanh `#3b82f6`, padding `12px`, bo góc `12px`, chữ bold (weight `700`).
* *Hiệu ứng Hover:* Nút dịch chuyển nhẹ lên trên `translateY(-2px)` và tăng độ đổ bóng.

### 3.3. Thanh công cụ lọc (Toolbar Section)
* **CSS:** `.storyToolbar`.
* **Ô tìm kiếm:** Nằm bên trái, có icon tiền tố, nền màu `#f8fafc`, viền `1.5px`, bo góc `14px`.
* **Bộ lọc Dropdown:** Đồng bộ kiểu dáng với ô tìm kiếm, có nhãn tiền tố đi kèm (Ví dụ: "Provider: OpenAI").
* **Tab trạng thái (Status Tabs):** Thiết kế dạng điều khiển phân đoạn (Segmented Control), khung chứa nền `#f1f5f9` với padding `4px`. Tab đang kích hoạt sẽ có nền trắng và đổ bóng.

### 3.4. Bảng dữ liệu (Data Table)
* **CSS:** `.storyTableContainer` & `.storyTable`.
* **Dòng tiêu đề:** Nền màu `#f8fafc`, chữ in hoa, weight `800`, letter-spacing `0.05em`.
* **Dòng dữ liệu (Rows):** Padding `20px`, đổi màu nền nhẹ khi di chuột qua (hover).
* **Huy hiệu trạng thái (Status Badges):** Bo tròn góc `10px`, có một dấu chấm tròn nhỏ thể hiện trạng thái (Active, Inactive, In Progress, Done) tương ứng với các màu sắc quy định.
* **Menu thao tác:** Nút Sửa (Icon `Edit2`), nút Xóa (Icon `Trash2`), bo góc `10px`, chuyển mượt sang màu primary hoặc màu báo động (danger) khi tương tác.
* **Phân trang (Pagination):** Bên trái hiển thị văn bản tóm tắt dữ liệu ("Showing X-Y of Z"), bên phải là các nút điều hướng hình vuông chứa icon hoặc số.

### 3.5. Biểu mẫu Modal (Form Modals)
Áp dụng cấu trúc chuẩn cho các hội thoại Thêm/Sửa:
* **Bố cục Layout:**
    * Container chính `.project-form`: Khoảng cách các phần tử (gap) `20px`, padding nội bộ `24px`.
    * Nhóm nhập liệu `.form-group`: Sắp xếp theo chiều dọc (Label trên, Input dưới) với khoảng cách `8px`.
    * Hàng biểu mẫu `.form-row`: Chia lưới 2 cột cho các trường liên quan (Ví dụ: Provider và Status).
* **Điều khiển nhập liệu (Inputs & Selects):** Nền `#f8fafc`, viền `1px solid #e2e8f0`. Khi focus, đổi sang viền xanh `#3b82f6` kèm hiệu ứng vầng sáng tỏa mềm `4px`.
* **Thanh hành động (.form-actions):** Căn dưới cùng, đẩy về phía bên phải, phân cách với phần trên bằng một đường kẻ ngang (top separator line).
    * Nút chính (`.btn-primary`): Nền xanh dương `#3b82f6`, chữ trắng, font Bold.
    * Nút phụ (`.btn-secondary`): Nền trắng, viền và chữ màu xám, đổi sang màu xanh dương khi hover.

---

## 4. Quy chuẩn biểu tượng (Iconography)
* **Thư viện sử dụng:** `lucide-react`.
* **Kích thước chuẩn:**
    * Biểu tượng điều hướng Sidebar: `20px`.
    * Biểu tượng hành động trên Header: `18px`.
    * Biểu tượng trong bảng/nút bấm: Theo thiết kế cụ thể (`Edit2`, `Trash2`, `Menu`, `Search`, `Bell`, `HelpCircle`, `Moon`/`Sun`, `ChevronDown`, `ChevronRight`).
