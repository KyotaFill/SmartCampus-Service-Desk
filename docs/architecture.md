# Kiến trúc tối thiểu

```text
React SPA  ──HTTP/JSON──>  Express REST API  ──SQL──>  PostgreSQL
   │                            │
   └── route guard              ├── authentication
                                ├── RBAC
                                ├── validation
                                └── audit/history
```

## Quyết định kiến trúc

- Một repository chứa `apps/web` và `apps/api` để nhóm nhỏ tích hợp dễ hơn.
- Frontend không truy cập database trực tiếp.
- API trả JSON và dùng một cấu trúc lỗi thống nhất.
- Kiểm tra quyền luôn thực hiện ở API; route guard frontend chỉ hỗ trợ trải nghiệm người dùng.
- Migration database phải được commit, review và chạy tự động khi dựng môi trường.
- Secret được truyền qua biến môi trường, không commit `.env`.

## Cấu trúc lỗi API

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": []
  }
}
```

