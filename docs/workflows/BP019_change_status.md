\# WORKFLOW SPECIFICATION: BP019 \- Chuyển trạng thái CV

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP019\`

\- \*\*Phân hệ \(Module\):\*\* \`M02\`

\- \*\*Tên nghiệp vụ:\*\* Chuyển trạng thái CV

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`Member\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- Người dùng đã đăng nhập hệ thống\.

\- Người dùng có quyền cập nhật trạng thái công việc\.

\- Công việc đã tồn tại trên hệ thống\.

\- Công việc đang ở trạng thái cho phép thực hiện chuyển trạng thái\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

Mã công việc \(\`item\_code\`\): bắt buộc\. Trạng thái mới: bắt buộc \(\`To Do\`, \`In\-Progress\`, \`In Review\`, \`Reject\`, \`Approved\-Done\`, \`Pending\`, \`Cancel\`\)\. Ghi chú: không bắt buộc\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. Người dùng chọn công việc cần chuyển trạng thái\.

2\. Hệ thống hiển thị trạng thái hiện tại\.

3\. Người dùng thao tác chuyển trạng thái theo quyền\.

4\. Khi công việc ở trạng thái In\-Review, Reviewer kiểm tra kết quả\.

5\. Reviewer chọn Duyệt \(Approve\) nếu đạt yêu cầu, hoặc Reject nếu chưa đạt\.

6\. Nếu chọn Duyệt, hệ thống chuyển sang \`Approved\-Done\` và tự động cập nhật tiến độ 100%\.

7\. Nếu chọn Reject, hệ thống chuyển sang \`Reject\` / \`In\-Progress\` và yêu cầu nhập lý do\.

8\. Hệ thống ghi nhận lịch sử thay đổi trạng thái vào Audit Log và gửi thông báo\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Công việc được chuyển sang trạng thái mới\.

\- Công việc chỉ chuyển sang \`Approved\-Done\` sau khi được Reviewer duyệt\.

\- Kết quả duyệt và lịch sử thay đổi trạng thái được ghi nhận đầy đủ\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- E01: Người dùng không có quyền thực hiện thao tác \-> Từ chối \(403\)\.

\- E02: Công việc không ở trạng thái cho phép chuyển \-> Từ chối cập nhật\.

\- E03: Người dùng không có quyền Review nhưng cố tình Duyệt \-> Chặn thao tác \(403\)\.

\- E04: Reject nhưng chưa nhập lý do \-> Bắt buộc bổ sung lý do\.

\- E05: Công việc không tồn tại \-> Báo lỗi 404 Not Found\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`Member\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

