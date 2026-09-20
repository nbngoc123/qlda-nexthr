\# WORKFLOW SPECIFICATION: BP013 \- Cập nhật Work Item

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP013\`

\- \*\*Phân hệ \(Module\):\*\* \`M02\`

\- \*\*Tên nghiệp vụ:\*\* Cập nhật Work Item

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM, Team Lead\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- Dự án đang Active\.

\- Work Item tồn tại và ở trạng thái Open/In Progress \(Khóa sửa thông tin gốc khi In\-Review/Done/Cancelled\)\.

\- Actor có quyền PM hoặc Team Lead\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

Work Item ID, Tên Work Item, Mô tả công việc, Acceptance Criteria, Priority, Assignee, Reviewer, Start Date, End Date, Estimated Hours, Phân loại hoạt động, File đính kèm, Change Note\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. PM/TL mở chi tiết WI ở trạng thái Open/In Progress\.

2\. Nhập/điều chỉnh thông tin gốc \(Timeline, Est Hours, Acceptance Criteria, Priority\)\.

3\. System validate \(Role PM/TL, End Date >= Start Date, Reviewer \!= Assignee, Lock In\-Review\)\.

4\. Cập nhật DB & ghi Audit Log \(field\-level delta\)\.

5\. Submit & phát notification\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Thông tin gốc Work Item được cập nhật trong DB\.

\- Tiến độ Epic/Dự án & các mốc KPI \(như KPI\-M01, KPI\-PM02\) được tính lại\.

\- Assignee/Reviewer nhận notification\.

\- Hệ thống tự động ghi Audit Log\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- Member cố sửa thông tin gốc \-> Chặn \(HTTP 403 Forbidden\)\.

\- Sửa khi WI ở trạng thái In\-Review \-> Chặn khóa Read\-Only\.

\- WI đã Done/Cancelled \-> Chặn chỉnh sửa hoàn toàn\.

\- End Date < Start Date \-> Báo lỗi dữ liệu không hợp lệ\.

\- Reviewer trùng Assignee \-> Cảnh báo xung đột vai trò\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM, Team Lead\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

