\# WORKFLOW SPECIFICATION: BP028 \- Theo dõi Work Item

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP028\`

\- \*\*Phân hệ \(Module\):\*\* \`M03\`

\- \*\*Tên nghiệp vụ:\*\* Theo dõi Work Item

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM, Team Lead, Member\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- Dự án tồn tại và đang ở trạng thái Planning hoặc Active \(cho phép xem Read\-Only khi Completed/Closed\)\.

\- Người dùng đăng nhập thành công và đã thuộc danh sách thành viên Dự án \(hoặc C\-Level có quyền xem toàn công ty\)\.

\- Dự án đã có cấu trúc dữ liệu công việc \(Epic, Milestone hoặc Work Item\)\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

Project ID, Chế độ xem \(View Mode: Kanban / List / Calendar\), Bộ lọc \(Milestone ID, Epic ID, Assignee ID, Status, Priority, Is Overdue\), Phân trang \(Page, Page Size\)\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. User mở màn hình Quản lý tiến độ / Bảng công việc \(Task Tracker / Kanban\) của Dự án\.

2\. Chọn chế độ xem \(mặc định Kanban\) và áp dụng các bộ lọc nghiệp vụ\.

3\. System validate quyền xem dự án và tính hợp lệ của tham số bộ lọc\.

4\. Hệ thống truy vấn CSDL tối ưu qua Index \(\`idx\_wi\_project\_status\`\), loại trừ bản ghi xóa mềm \(\`is\_deleted = false\`\), áp dụng cache Redis\.

5\. Render danh sách thẻ việc theo thời gian thực kèm nhãn cảnh báo \(Đỏ: quá hạn SLA, Vàng: đến hạn trong 24h, Cờ đỏ: có Blocker\)\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Giao diện hiển thị danh sách công việc trực quan theo các cột trạng thái theo thời gian thực\.

\- Cung cấp góc nhìn tiến độ minh bạch cho toàn bộ thành viên \(chế độ Read\-Only\)\.

\- Không làm phát sinh biến đổi dữ liệu trong CSDL\.

\- Ghi nhận log truy cập vào hệ thống giám sát hiệu năng\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- User không thuộc Dự án cố tình truy cập \-> Chặn \(HTTP 403 Forbidden\)\.

\- Dự án không tồn tại hoặc đã bị xóa mềm \-> Báo lỗi HTTP 404 Not Found\.

\- Truy vấn tập dữ liệu lớn \(> 1\.000 tasks\) \-> Kích hoạt phân trang Lazy\-loading và Redis Caching\.

\- Bộ lọc Milestone/User không tồn tại \-> Tự động khôi phục về bộ lọc mặc định\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM, Team Lead, Member\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

