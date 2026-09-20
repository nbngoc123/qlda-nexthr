\# WORKFLOW SPECIFICATION: BP004 \- Đặt thời gian

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP004\`

\- \*\*Phân hệ \(Module\):\*\* \`M01\`

\- \*\*Tên nghiệp vụ:\*\* Đặt thời gian

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- Dự án đã tồn tại trên hệ thống và không ở trạng thái Closed\.

\- Người dùng đăng nhập có vai trò PM phụ trách dự án và có quyền P006\.

\- Dự án đang ở trạng thái Planning hoặc Active\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

\`project\_id\`: Mã định danh dự án, \`start\_date\`: Ngày bắt đầu, \`end\_date\`: Ngày kết thúc dự kiến, \`timeline\_note\`: Ghi chú lý do thiết lập\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. PM vào cấu hình Timeline của dự án\.

2\. Nhập Start Date & End Date\.

3\. Hệ thống validate \`end\_date >= start\_date\` \(BR01\)\.

4\. PM bấm Lưu\.

5\. Hệ thống kiểm tra xung đột Milestone/Epic, cập nhật DB, ghi Audit Log và phát thông báo\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Lưu khung thời gian chuẩn ràng buộc Milestone và Task\.

\- Thiết lập đường cơ sở \(Baseline\) tính KPI tiến độ\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- End Date < Start Date \(báo lỗi logic 422\)\.

\- Dự án đã đóng \(khóa sửa\)\.

\- Người thực hiện không phải PM phụ trách \(403 Forbidden\)\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

