\# WORKFLOW SPECIFICATION: BP005 \- Thêm thành viên

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP005\`

\- \*\*Phân hệ \(Module\):\*\* \`M01\`

\- \*\*Tên nghiệp vụ:\*\* Thêm thành viên

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- Dự án tồn tại, đang ở trạng thái Planning hoặc Active\.

\- User là PM phụ trách \(quyền P007\)\.

\- Tài khoản nhân sự đang hoạt động \(Active\)\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

\`project\_id\`: Mã định danh dự án, \`user\_ids\`: Danh sách ID nhân sự, \`initial\_role\`: Vai trò chức năng ban đầu, \`joined\_date\`: Ngày bắt đầu tham gia\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. PM vào tab Thành viên, bấm Thêm thành viên\.

2\. Tìm kiếm nhân sự theo Tên/Email/Phòng ban\.

3\. Tích chọn danh sách và vai trò ban đầu\.

4\. Hệ thống kiểm tra không trùng lặp thành viên\.

5\. Lưu vào \`project\_members\`, ghi Audit Log, gửi email/thông báo chào mừng\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Tạo bản ghi \`project\_members\`, cấp quyền truy cập dự án cho nhân sự trên Dashboard\.

\- Sẵn sàng để phân công việc\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- Trùng thành viên trong dự án\.

\- Tài khoản nhân sự bị khóa/inactive\.

\- Dự án đã đóng, chặn thao tác\.

\- Người thao tác không phải PM của dự án \(403 Forbidden\)\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

