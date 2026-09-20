\# 00\. PROJECT CONTEXT & SYSTEM OVERVIEW

\#\# 1\. TỔNG QUAN DỰ ÁN \(PROJECT OVERVIEW\)

\- \*\*Tên dự án:\*\* NextHR / Enterprise Work & Performance Management System

\- \*\*Mục tiêu:\*\* Xây dựng hệ thống quản trị dự án, công việc và đánh giá hiệu suất \(KPI\) doanh nghiệp tập trung, thay thế các phương thức rời rạc \(Excel cá nhân, Zalo chat\)\.

\- \*\*Đơn vị phát triển/nghiên cứu:\*\* Khoa Công nghệ Thông tin \- Học viện Công nghệ Bưu chính Viễn thông \(PTIT\)\.

\- \*\*Phạm vi hệ thống:\*\* Quản lý vòng đời dự án \(Project\), công việc theo cấu trúc WBS \(Epic \-> Work Item / Task / Bug / CR \-> Subtask\), theo dõi tiến độ thời gian thực, quản lý chất lượng \(Violation/Quality\), tính toán KPI tự động và xuất báo cáo điều hành\.

\#\# 2\. KIẾN TRÚC PHÂN HỆ NGHIỆP VỤ \(MODULE ARCHITECTURE\)

Hệ thống được module hóa thành 6 phân hệ cốt lõi với 60 Business Processes \(BP001 \-> BP060\):

1\. \*\*M01 \- Project Management \(BP001 \- BP009\):\*\* Khởi tạo, cập nhật dự án, thiết lập mục tiêu, khung thời gian, mốc tiến độ \(Milestone\), quản lý thành viên và vòng đời dự án \(Planning \-> Active \-> On\-Hold \-> Completed \-> Closed\)\.

2\. \*\*M02 \- Task Management \(BP010 \- BP027\):\*\* Quản lý Epic, Work Item \(Task, Bug, CR, Subtask\), phân loại hoạt động, phân công nhân sự \(Assignee & Reviewer\), thiết lập thời hạn, mức độ ưu tiên, đính kèm tài liệu, khai báo giờ làm \(Log time\), ghi nhận Issue, bình luận trao đổi và quy trình nộp bài \- kiểm tra \- duyệt hoàn thành\.

3\. \*\*M03 \- Progress Management \(BP028 \- BP036\):\*\* Theo dõi tiến độ đa chiều \(Kanban/Gantt/Calendar\), tổng hợp tiến độ dự án, theo dõi nhân sự, đối soát giờ làm \(Estimated vs Logged\), ghi nhận lịch sử hoạt động tự động \(Audit Log\), cảnh báo công việc sắp đến hạn và phát hiện trễ hạn theo SLA\.

4\. \*\*M04 \- KPI Management \(BP037 \- BP045\):\*\* Thiết lập tiêu chí và chỉ tiêu KPI, gán KPI cho từng vai trò/thành viên, thu thập dữ liệu tự động, tính toán định kỳ, quy trình đánh giá và xác nhận kết quả KPI\.

5\. \*\*M05 \- Violation & Quality \(BP046 \- BP051\):\*\* Ghi nhận lỗi/vi phạm trong quá trình thực hiện và review task, phân loại vi phạm, gửi giải trình, xem xét giải trình, xác nhận chế tài và tích hợp dữ liệu trừ điểm vào KPI\.

6\. \*\*M06 \- Report & Dashboard \(BP052 \- BP060\):\*\* Cung cấp Dashboard "Công việc hôm nay", Dashboard tổng hợp dự án, báo cáo hàng ngày, báo cáo hiệu suất chi tiết/tổng hợp thành viên, báo cáo đào tạo, báo cáo KPI và kết xuất báo cáo \(PDF / Excel\)\.

## 3. ĐỊNH HƯỚNG CÔNG NGHỆ (TECHNICAL ORIENTATION)

> Stack được lựa chọn phù hợp quy mô ~100 nhân viên: đủ robust để scale, không over-engineering.

### 🖥️ Backend

| Layer | Công nghệ | Lý do |
|---|---|---|
| Framework | **NestJS** (TypeScript) | Modular, decorator-based, tích hợp tốt DI/Guard/Pipe |
| Architecture | **Modular Monolith** → Microservices sau | 100 NV chưa cần microservices, tránh over-engineering |
| API | **REST** + Swagger/OpenAPI | Đơn giản, dễ tích hợp frontend, auto-doc |
| ORM | **TypeORM** | Native NestJS support, migration, entity decorators |
| Pattern | **CQRS** (Command/Query separation) | Tách read/write, dễ scale query riêng |

### 🗄️ Database

| | Công nghệ | Lý do |
|---|---|---|
| Primary DB | **PostgreSQL** | ACID, Row-Level Security, JSONB cho AuditLog |
| Cache/Session | **Redis** | JWT session, cache Kanban board, distributed lock |
| Search | **PostgreSQL Full-text search** | Chưa cần Elasticsearch ở quy mô này |

### 🎨 Frontend

| | Công nghệ | Lý do |
|---|---|---|
| Framework | **Next.js** (TypeScript) | SSR cho dashboard, SEO, App Router |
| UI Library | **Ant Design** hoặc **shadcn/ui** | Component rich: Kanban, Table, Form, Chart |
| State | **TanStack Query** + **Zustand** | Server state + client state tách biệt rõ ràng |

### 🔐 Auth & Security

| | Công nghệ |
|---|---|
| Auth | **JWT** (Access Token 15m + Refresh Token 7d) |
| Guard | **NestJS Guards** + RBAC custom theo 04_ROLES_AND_PERMISSIONS.md |
| Password | **bcrypt** (salt rounds = 12) |
| Row-Level | Project Scope isolation theo `project_members` |

### 🚀 DevOps & Infra

| | Công nghệ | Lý do |
|---|---|---|
| Container | **Docker** + **Docker Compose** | Dev/prod parity, dễ onboard |
| CI/CD | **GitHub Actions** | Free tier đủ dùng |
| Hosting | **VPS** (Hetzner/DigitalOcean) hoặc **AWS EC2** | 100 NV không cần K8s |
| Reverse Proxy | **Nginx** | Load balancing, SSL termination |
| SSL | **Let's Encrypt** | Free, auto-renew |

### 📦 Tooling & Integrations

| | Công nghệ |
|---|---|
| Monorepo | **pnpm workspaces** (backend + frontend cùng repo) |
| Validation | **class-validator** + **class-transformer** |
| Logging | **Winston** + **Morgan** |
| Testing | **Jest** (unit) + **Supertest** (e2e integration) |
| Email | **Nodemailer** + SMTP hoặc **Resend** |
| File Upload | **AWS S3** hoặc **MinIO** (self-hosted) |
| Notification | In-App (WebSocket/SSE) + Email Service |
