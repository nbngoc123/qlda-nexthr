\# WORKFLOW SPECIFICATION: BP010 \- Quản lý Epic

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP010\`

\- \*\*Phân hệ \(Module\):\*\* \`M02\`

\- \*\*Tên nghiệp vụ:\*\* Quản lý Epic

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM, Team Lead\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- Người dùng là Project Manager hoặc Team Lead\.

\- Project đang ở trạng thái Active\.

\- Người dùng có quyền quản lý Epic trong Project\.

\- Project tồn tại và người dùng thuộc Project\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

Project ID, tên Epic, Mô tả Epic, Thời gian bắt đầu, Thời gian kết thúc, Mục tiêu của Epic, Status ban đầu\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. PM/Team Lead mở Project\.

2\. Chọn chức năng Epic\.

3\. Chọn Tạo Epic\.

4\. Nhập thông tin Epic: tên, mô tả, thời gian, mục tiêu, trạng thái\.

5\. Hệ thống kiểm tra dữ liệu\.

6\. Người dùng lưu Epic\.

7\. Hệ thống tạo Epic và ghi nhận người tạo\.

8\. Hệ thống cập nhật danh sách Epic\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Epic được tạo thành công trong DB\.

\- Epic có trạng thái ban đầu To Do/Open\.

\- Epic được liên kết với Project\.

\- Có thể tạo/gắn Work Item vào Epic\.

\- Hệ thống ghi nhận Activity Log\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- Project không tồn tại hoặc đã đóng\.

\- Người dùng không có quyền tạo Epic \(403 Forbidden\)\.

\- Thiếu thông tin bắt buộc\.

\- Tên Epic bị trùng trong cùng Project\.

\- Thời gian Epic không hợp lệ \(End Date < Start Date\)\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM, Team Lead\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

