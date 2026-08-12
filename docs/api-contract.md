# API contract v0.1

Base URL local: `http://localhost:3000/api`.

| Method | Endpoint | Quyền | Mục đích |
|---|---|---|---|
| GET | `/health` | Public | Kiểm tra API |
| POST | `/auth/register` | Public | Đăng ký student |
| POST | `/auth/login` | Public | Đăng nhập |
| GET | `/auth/me` | Đã đăng nhập | Lấy phiên hiện tại |
| GET | `/tickets` | Theo vai trò | Danh sách, lọc, phân trang |
| POST | `/tickets` | Student/Admin | Tạo ticket |
| GET | `/tickets/:id` | Theo ownership/RBAC | Chi tiết ticket |
| PATCH | `/tickets/:id` | Theo RBAC | Sửa/gán/đổi trạng thái |
| GET | `/tickets/:id/comments` | Theo quyền ticket | Danh sách bình luận |
| POST | `/tickets/:id/comments` | Theo quyền ticket | Thêm bình luận |
| GET | `/dashboard/summary` | Staff/Admin | Thống kê ticket |

Backend và frontend phải cập nhật tài liệu này trong cùng PR khi thay đổi request hoặc response.

