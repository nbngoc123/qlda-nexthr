\# WORKFLOW SPECIFICATION: BP015 \- Thiết lập thời hạn

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP015\`

\- \*\*Phân hệ \(Module\):\*\* \`M02\`

\- \*\*Tên nghiệp vụ:\*\* Thiết lập thời hạn

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM, Team Lead\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

1\. Dự án tồn tại và đang ở trạng thái cho phép chỉnh sửa\.

2\. Work Item đã được tạo và thuộc một Epic/Milestone hợp lệ\.

3\. Milestone liên kết đã có Due Date\.

4\. Actor là PM hoặc Team Lead có quyền thiết lập/cập nhật thời hạn Work Item\.

5\. Work Item chưa ở trạng thái Completed/Closed/Cancelled\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

\`work\_item\_id\` \(UUID\), \`start\_date\` \(DateTime\), \`deadline\` \(DateTime\), \`timeline\_note\` \(String\)\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. Actor mở Work Item cần thiết lập thời hạn\.

2\. Hệ thống hiển thị thời hạn hiện tại và Due Date của Milestone liên kết để đối chiếu\.

3\. Actor nhập/chỉnh sửa Start Date và Deadline\.

4\. Hệ thống kiểm tra dữ liệu bắt buộc và định dạng ngày giờ hợp lệ\.

5\. Hệ thống kiểm tra \`Start Date <= Deadline\` theo BR01\.

6\. Hệ thống kiểm tra \`Deadline <= Milestone Due Date\`, bảo đảm Work Item không vượt quá thời hạn Milestone\.

7\. Nếu tất cả điều kiện hợp lệ, hệ thống cập nhật thời hạn Work Item vào CSDL\.

8\. Hệ thống ghi nhận thay đổi vào Audit Log, bao gồm giá trị cũ và giá trị mới\.

9\. Hệ thống kích hoạt/cập nhật cơ chế theo dõi SLA và Deadline cho Work Item\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

1\. Start Date và Deadline của Work Item được lưu thành công\.

2\. Deadline nằm trong phạm vi thời gian hợp lệ của Milestone\.

3\. Hệ thống bắt đầu/cập nhật theo dõi SLA và trạng thái quá hạn của Work Item\.

4\. Thay đổi thời hạn được ghi nhận trong Audit Log\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- Ngày bắt đầu sau Deadline \-> Hệ thống chặn lưu và thông báo lỗi\.

\- Deadline vượt quá Due Date của Milestone \-> Chặn lưu\.

\- Milestone không có Due Date \-> Yêu cầu cấu hình thời hạn Milestone trước\.

\- Work Item đã Completed/Closed/Cancelled \-> Chặn cập nhật thời hạn\.

\- Actor không có quyền PM/TL \-> Từ chối thao tác \(403 Forbidden\)\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM, Team Lead\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

