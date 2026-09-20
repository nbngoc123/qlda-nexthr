\# WORKFLOW SPECIFICATION: BP016 \- Thiết lập ưu tiên

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP016\`

\- \*\*Phân hệ \(Module\):\*\* \`M02\`

\- \*\*Tên nghiệp vụ:\*\* Thiết lập ưu tiên

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM, Team Lead\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- Dự án Active và đang ở Phase Execution/Monitoring\.

\- Work Item ở trạng thái Open/In Progress \(Khóa khi In\-Review/Done/Cancelled\)\.

\- PM quyền toàn dự án; TL chỉ quyền trong Team phụ trách\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

Work Item ID, Priority \(\`Urgent\`, \`High\`, \`Medium\`, \`Low\`\), Ghi chú lý do, Phân loại lý do, Checkbox áp dụng cho Subtask, \`New\_End\_Date\` \(nếu có điều chỉnh\)\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. PM/TL mở chi tiết WI ở trạng thái Open/In Progress\.

2\. Chọn Priority, nhập Ghi chú & Phân loại lý do\.

3\. Tùy chọn nhập New\_End\_Date và tick áp dụng Priority cho Subtask cùng Team\.

4\. Backend kiểm tra quyền hạn, logic ngày và lịch nghỉ phép của Assignee\.

5\. Cập nhật DB, cập nhật base KPI\-M01\. Nếu Priority = Urgent/High, kích hoạt cờ SLA Fast\-track Review\.

6\. Ghi Audit Log, phát Alert/Notification\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Priority của WI được cập nhật; WI hiển thị ưu tiên trên Dashboard\.

\- Subtask cùng Team cập nhật Priority tương ứng\.

\- Audit Log lưu vết thay đổi\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- TL đổi ngoài phạm vi / Member đổi \-> Chặn \(403 Forbidden\)\.

\- Thiếu Ghi chú lý do \-> Báo lỗi dữ liệu \(422 Unprocessable Entity\)\.

\- Đã bị Done/In\-Review \-> Chặn khóa State \(409 Conflict\)\.

\- New\_End\_Date vượt Milestone/Epic/Project \-> Chặn \(400 Bad Request\)\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM, Team Lead\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

