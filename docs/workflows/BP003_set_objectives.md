\# WORKFLOW SPECIFICATION: BP003 \- Đặt mục tiêu

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP003\`

\- \*\*Phân hệ \(Module\):\*\* \`M01\`

\- \*\*Tên nghiệp vụ:\*\* Đặt mục tiêu

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*PARTIAL\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*PARTIAL\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- User: PM

\- Dự án tồn tại trên hệ thống và ở trạng thái Active/Planning\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

Nội dung mục tiêu và chỉ số đo lường\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. PM mở form đặt mục tiêu trong dự án\.

2\. Nhập nội dung mục tiêu và chỉ số đo lường\.

3\. Bấm Lưu\.

4\. Hệ thống kiểm tra và lưu trữ mục tiêu\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Mục tiêu được gắn cho Project\.

\- Hiển thị trên trang tổng quan Dashboard và chi tiết Project\.

\- Hệ thống ghi nhận Activity Log\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- Dự án không tồn tại hoặc đã đóng\.

\- User không có quyền đặt mục tiêu\.

\- Nội dung bắt buộc bị bỏ trống\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Cảnh báo:\*\* Quy trình ở mức PARTIAL, nếu gặp logic chưa xác định bắt buộc cắm cờ \`// TODO\(BUSINESS\)\` và ghi vào \`OPEN\_QUESTIONS\.md\`\.

