\# WORKFLOW SPECIFICATION: BP014 \- Phân công nhân sự

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP014\`

\- \*\*Phân hệ \(Module\):\*\* \`M02\`

\- \*\*Tên nghiệp vụ:\*\* Phân công nhân sự

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM, Team Lead\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- Dự án đang Active\.

\- Work Item tồn tại và ở trạng thái Open/In Progress \(Khóa phân công khi In\-Review/Done/Cancelled\)\.

\- Nhân sự được chọn đã thuộc Dự án\.

\- Actor có quyền PM/TL\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

Work Item ID, User ID Assignee \(Người thực hiện\), User ID Reviewer \(Người duyệt\), Ghi chú phân công \(Assign Note\)\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. PM/TL mở chi tiết WI ở trạng thái Open/In Progress\.

2\. Chọn Assignee từ danh sách thành viên Dự án\.

3\. Chọn Reviewer từ danh sách thành viên Dự án\.

4\. System validate ràng buộc \(Reviewer \!= Assignee, Role PM/TL, Member thuộc Project\)\.

5\. Submit, cập nhật DB, ghi Audit Log & phát notification\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Assignee và Reviewer được gán cho WI trong DB\.

\- Dashboard "Công việc của tôi" \(My Tasks\) của nhân sự được cập nhật\.

\- In\-App Notification & Email tự động gửi cho Assignee và Reviewer mới/cũ\.

\- Hệ thống ghi Audit Log\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- Reviewer trùng Assignee \-> Hệ thống chặn \(Báo lỗi xung đột\)\.

\- Member cố tình tự phân công qua API \-> Chặn \(HTTP 403 Forbidden\)\.

\- Nhân sự được chọn không nằm trong Dự án \-> Báo lỗi dữ liệu không hợp lệ\.

\- Đổi phân công khi WI đang In\-Review/Done/Cancelled \-> Chặn khóa State\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM, Team Lead\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

