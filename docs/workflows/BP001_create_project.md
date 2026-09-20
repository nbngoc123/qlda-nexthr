\# WORKFLOW SPECIFICATION: BP001 \- Tạo dự án

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP001\`

\- \*\*Phân hệ \(Module\):\*\* \`M01\`

\- \*\*Tên nghiệp vụ:\*\* Tạo dự án

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

1\. PM có quyền khởi tạo dự án trong hệ thống\.

2\. Khách hàng/Phòng ban đã tồn tại trên hệ thống\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

mã dự án duy nhất, tên DA, mô tả, ngân sách, khách hàng hoặc phòng ban liên quan\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. PM truy cập màn hình Quản lý Dự án, chọn "Tạo mới dự án"\.

2\. Nhập Mã dự án \(Code\), Tên dự án, Mô tả, Ngân sách, Khách hàng\.

3\. Hệ thống kiểm tra tính duy nhất của Mã dự án và định dạng hợp lệ\.

4\. PM nhấn "Lưu thông tin"\.

5\. Hệ thống khởi tạo Project ở trạng thái Planning, tự động gán PM làm Chủ nhiệm dự án và tạo Audit Log\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Dự án mới được lưu trong DB\.

\- Gán quyền PM cho người tạo\.

\- Sinh Activity Log PROJECT\_CREATED\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- Trùng mã dự án \-> Yêu cầu đổi mã\.

\- Thiếu trường bắt buộc \-> Cảnh báo đỏ form\.

\- Không đủ quyền \-> Từ chối \(403 Forbidden\)\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

