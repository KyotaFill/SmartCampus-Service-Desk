# Quy trình làm việc nhóm

## Nhánh

- `main`: phiên bản ổn định và release.
- `develop`: tích hợp các task đã hoàn thành.
- Nhánh task tạo từ `develop`: `feat/it-xxx-ten-ngan`, `chore/it-xxx-ten-ngan`, `test/it-xxx-ten-ngan` hoặc `docs/it-xxx-ten-ngan`.

Ví dụ:

```bash
git switch develop
git pull
git switch -c feat/it-003-ui-base
```

## Commit

Mẫu commit: `type(scope): nội dung ngắn`.

```text
feat(auth): add login endpoint
fix(ticket): prevent student reading another ticket
test(auth): cover invalid password
docs(api): document login response
```

## Pull Request

1. Tự kiểm tra `npm run lint`, `npm test` và `npm run build`.
2. Push feature branch và mở PR vào `develop`.
3. Gắn ID task trong tiêu đề PR.
4. Ít nhất một thành viên khác review; phần auth, RBAC, migration và tích hợp cần Lead duyệt.
5. Chỉ chuyển task sang `Hoàn thành` sau khi PR đã merge và chạy được trên `develop`.

Không đưa secret, mật khẩu hoặc file `.env` lên Git.

