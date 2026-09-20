\# WORKFLOW SPECIFICATION: BP002 \- Cập nhật dự án

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP002\`

\- \*\*Phân hệ \(Module\):\*\* \`M01\`

\- \*\*Tên nghiệp vụ:\*\* Cập nhật dự án

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`PM\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*PARTIAL\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*PARTIAL\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- User: PM

\- Dự án tồn tại trên hệ thống và chưa bị đóng \(Closed\)\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

Thông tin dự án cần sửa \(Tên, Mô tả, Khách hàng, Ngân sách\)\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. PM chọn dự án cần cập nhật\.

2\. Mở form chỉnh sửa \(tên, mô tả, khách hàng,\.\.\.\)\.

3\. Nhập sửa dữ liệu\.

4\. Nhấn lưu thay đổi\.

5\. Hệ thống kiểm tra hợp lệ và lưu dữ liệu\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Thông tin dự án được cập nhật trong DB\.

\- Hệ thống ghi nhận Activity Log\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- Project không tồn tại hoặc đã đóng\.

\- Bỏ trống thông tin bắt buộc\.

\- Không có quyền sửa đổi \(403 Forbidden\)\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`PM\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Cảnh báo:\*\* Quy trình ở mức PARTIAL, nếu gặp logic chưa xác định bắt buộc cắm cờ \`// TODO\(BUSINESS\)\` và ghi vào \`OPEN\_QUESTIONS\.md\`\.

