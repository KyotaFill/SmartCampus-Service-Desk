# SmartCampus Service Desk

Đồ án CNTT Team 4: hệ thống web để sinh viên gửi yêu cầu hỗ trợ, theo dõi trạng thái và trao đổi với bộ phận xử lý.

## Công nghệ đã chốt

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Hạ tầng phát triển: Docker Compose
- Quy trình: GitHub Flow mở rộng với `main`, `develop` và feature branch

## Cấu trúc repository

```text
apps/web/       Frontend của Thành viên 2
apps/api/       Backend của Lead và Thành viên 3
docs/           Kiến trúc, quy tắc nghiệp vụ, API contract
.github/        Issue và Pull Request template
```

## Team 4

| Thành viên | Vai trò |
|---|---|
| Kiên | Tech Lead + Full-stack |
| Nam | Frontend |
| Lan | Backend + Database |
| Hà | QA + DevOps |

## Chạy dự án

Yêu cầu Node.js 22+ và npm 10+.

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend health check: http://localhost:3000/api/health

## Quy trình đóng góp

Đọc [CONTRIBUTING.md](CONTRIBUTING.md) trước khi nhận task. Không push trực tiếp vào `main` hoặc `develop`.
