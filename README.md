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

## Chạy dự án bằng Docker (khuyến nghị)

Yêu cầu Docker Engine có Docker Compose v2.

```bash
cp .env.example .env
docker compose up --build
```

Sau khi các container chuyển sang trạng thái `healthy`:

- Frontend: http://localhost:5173
- Backend health check: http://localhost:3000/api/health
- PostgreSQL: `localhost:5432` (thông tin kết nối lấy từ `.env`)

Trước khi API server nhận request, container sẽ tự động generate Prisma Client, chạy các migration chưa áp dụng và seed dữ liệu nền theo cách idempotent. Vì vậy môi trường cũng khởi động được từ database volume trống.

Mã nguồn frontend và backend được mount vào container nên thay đổi sẽ được tự động tải lại. Khi thay đổi dependency trong `package.json`, chạy lại `docker compose up --build`.

Dừng môi trường mà vẫn giữ dữ liệu PostgreSQL:

```bash
docker compose down
```

Dữ liệu PostgreSQL nằm trong named volume `smartcampus-service-desk_postgres_data`, vì vậy không bị mất khi container khởi động lại hoặc khi chạy `docker compose down`. Chỉ xóa dữ liệu khi thực sự muốn tạo lại database từ đầu:

```bash
docker compose down --volumes
```

Không commit file `.env`. Chỉ `.env.example` chứa cấu hình mẫu được lưu trong repository.

## Chạy trực tiếp bằng Node.js

Yêu cầu Node.js 22+ và npm 10+.

Khi chạy không qua Docker, sao chép file môi trường mẫu cho từng ứng dụng trước khi khởi động:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend health check: http://localhost:3000/api/health

## Khởi tạo database

Sau khi PostgreSQL chạy và `apps/api/.env` có `DATABASE_URL` hợp lệ:

```bash
npm run prisma:generate -w @smartcampus/api
npm run prisma:migrate:deploy -w @smartcampus/api
npm run prisma:seed -w @smartcampus/api
```

Khi phát triển một thay đổi schema mới, dùng
`npm run prisma:migrate:dev -w @smartcampus/api` để tạo migration tiếp theo.

## Quy trình đóng góp

Đọc [CONTRIBUTING.md](CONTRIBUTING.md) trước khi nhận task. Không push trực tiếp vào `main` hoặc `develop`.
