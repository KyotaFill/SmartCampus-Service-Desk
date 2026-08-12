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

## Auth

### `POST /auth/register`

Tạo tài khoản với role cố định `STUDENT`. Email được chuẩn hóa về chữ thường; mật khẩu dài từ 8 đến 128 ký tự và chỉ được lưu dưới dạng hash.

Request:

```json
{
  "fullName": "Nguyễn Văn An",
  "email": "an@example.edu.vn",
  "password": "a-secure-password"
}
```

Response `201`:

```json
{
  "user": {
    "id": "uuid",
    "email": "an@example.edu.vn",
    "fullName": "Nguyễn Văn An",
    "role": "STUDENT",
    "isActive": true,
    "createdAt": "2026-08-12T10:00:00.000Z"
  }
}
```

### `POST /auth/login`

Request gồm `email` và `password`. Response `200`:

```json
{
  "token": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "email": "an@example.edu.vn",
    "fullName": "Nguyễn Văn An",
    "role": "STUDENT",
    "isActive": true,
    "createdAt": "2026-08-12T10:00:00.000Z"
  }
}
```

### `GET /auth/me`

Gửi header `Authorization: Bearer <token>`. Response `200` chứa object `user` giống response login và không bao giờ chứa mật khẩu hoặc password hash.

### Cấu trúc lỗi

Mọi lỗi có cấu trúc thống nhất:

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email hoặc mật khẩu không đúng"
  }
}
```

Các mã auth chính: `VALIDATION_ERROR` (`400`, có mảng `details`), `UNAUTHORIZED` (`401`), `INVALID_CREDENTIALS` (`401`), `ACCOUNT_INACTIVE` (`403`) và `EMAIL_ALREADY_EXISTS` (`409`).
