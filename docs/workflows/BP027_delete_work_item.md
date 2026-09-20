\# WORKFLOW SPECIFICATION: BP027 \- Xóa Work Item

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP027\`

\- \*\*Phân hệ \(Module\):\*\* \`M02\`

\- \*\*Tên nghiệp vụ:\*\* Xóa Work Item

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM, Team Lead\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- Dự án đang Active \(Khóa khi Dự án Closed/On\-Hold\)\.

\- Work Item tồn tại và ở trạng thái Open/To Do hoặc In\-Progress \(Khóa xóa khi In\-Review/Done/Cancelled\)\.

\- Work Item chưa nằm trong kỳ đánh giá KPI đã chốt phê duyệt chính thức \(\`Confirmed\`\)\.

\- Actor có quyền PM phụ trách dự án hoặc Team Lead quản lý\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

Work Item ID, Lý do xóa \(bắt buộc >= 10 ký tự\), Xác nhận xóa \(Confirm Flag\)\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. PM/TL mở chi tiết WI hoặc menu ngữ cảnh trên thẻ Kanban ở trạng thái Open/In\-Progress\.

2\. Chọn chức năng "Xóa Work Item" và nhập Lý do xóa \(Deletion Reason\)\.

3\. System validate \(Role PM/TL, Work Item chưa khóa KPI, trạng thái chưa In\-Review/Done, Lý do xóa hợp lệ >= 10 ký tự\)\.

4\. Kích hoạt cơ chế Xóa mềm \(Soft Delete\): Cập nhật DB \(\`is\_deleted = true\`, \`deleted\_at = NOW\(\)\`, \`deleted\_by = User\_ID\`\), tính lại tiến độ Epic/Dự án\.

5\. Cập nhật DB, ghi Audit Log \(snapshot dữ liệu trước xóa kèm lý do\) và phát notification\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Work Item được đánh dấu xóa mềm \(\`is\_deleted = true\`\) trong DB, ẩn khỏi bảng Kanban\.

\- Tiến độ Epic/Dự án và các mốc KPI liên quan được tự động tính toán lại\.

\- Dashboard "Công việc của tôi" \(My Tasks\) của Assignee và Reviewer được gỡ bỏ việc\.

\- In\-App Notification và Email tự động gửi cho Assignee thông báo hủy công việc\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- Member cố tình xóa Work Item \-> Chặn \(HTTP 403 Forbidden\)\.

\- Xóa khi WI đang ở trạng thái In\-Review \-> Chặn khóa State \(409 Conflict\)\.

\- WI đã Done và đã chốt kỳ KPI \-> Chặn hoàn toàn để bảo toàn kế toán \(HTTP 400\)\.

\- Bỏ trống lý do xóa hoặc < 10 ký tự \-> Báo lỗi dữ liệu \(HTTP 422\)\.

\- Dự án đã Closed \-> Từ chối thao tác\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM, Team Lead\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

