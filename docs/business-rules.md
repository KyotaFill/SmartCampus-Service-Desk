# Quy tắc nghiệp vụ v0.1

## Vai trò

- `STUDENT`: tạo ticket, xem ticket của chính mình và bình luận trong ticket đó.
- `STAFF`: xem ticket thuộc phạm vi xử lý, nhận/gán ticket và cập nhật trạng thái.
- `ADMIN`: quản lý toàn bộ ticket, người dùng, vai trò và category.

## Trạng thái ticket

Luồng mặc định:

```text
OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED
```

- Ticket mới có trạng thái `OPEN`.
- Chỉ `STAFF` hoặc `ADMIN` được chuyển sang `IN_PROGRESS` và `RESOLVED`.
- Mỗi lần đổi assignee hoặc trạng thái phải lưu actor, giá trị cũ, giá trị mới và thời gian.
- Quyết định về mở lại ticket `CLOSED` phải được cả nhóm xác nhận trước Sprint 2.

## Mức ưu tiên

- `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
- Student đề xuất mức ưu tiên; Staff/Admin có thể điều chỉnh.

