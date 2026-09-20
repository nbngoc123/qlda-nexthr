\# WORKFLOW SPECIFICATION: BP018 \- Cập nhật tiến độ

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP018\`

\- \*\*Phân hệ \(Module\):\*\* \`M02\`

\- \*\*Tên nghiệp vụ:\*\* Cập nhật tiến độ

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`Member\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

\- Người dùng đã đăng nhập hệ thống\.

\- Người dùng có quyền cập nhật tiến độ công việc \(Assignee\)\.

\- Công việc cần cập nhật đã tồn tại trên hệ thống\.

\- Công việc đang ở trạng thái cho phép cập nhật tiến độ \(In\-Progress\)\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

\- Mã công việc \(\`item\_code\`\): Bắt buộc\.

\- % tiến độ \(\`progress\_percentage\`\): Bắt buộc, giá trị từ \*\*0% đến 90%\*\* đối với cập nhật thông thường của Member\.

\- Ghi chú \(\`note\`\): Không bắt buộc\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. Người dùng chọn công việc cần cập nhật tiến độ\.

2\. Hệ thống hiển thị tiến độ hiện tại\.

3\. Người dùng nhập % tiến độ mới và ghi chú nếu có\.

4\. Hệ thống kiểm tra giá trị tiến độ: Giá trị phải từ 0% đến 90% đối với cập nhật của người thực hiện\. Không cho phép người dùng tự cập nhật trực tiếp lên 100%\.

5\. Nếu dữ liệu hợp lệ, hệ thống lưu % tiến độ mới vào DB\.

6\. Khi công việc hoàn thành, người dùng gửi yêu cầu Review \(BP023\)\.

7\. Người có quyền Review kiểm tra và xác nhận công việc hoàn thành \(BP026\)\.

8\. Sau khi Review được chấp thuận, hệ thống tự động cập nhật tiến độ lên 100% và chuyển trạng thái sang \`Approved\-Done\`\.

9\. Hệ thống ghi nhận lịch sử cập nhật và kết quả Review vào Audit Log\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

\- Tiến độ công việc được cập nhật theo giá trị hợp lệ\.

\- Tiến độ tối đa do người thực hiện tự cập nhật là 90%\.

\- Công việc chỉ đạt 100% sau khi được Review xác nhận\.

\- Lịch sử cập nhật/Review được ghi nhận\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- E01: % tiến độ bỏ trống \-> Yêu cầu nhập dữ liệu\.

\- E02: % tiến độ không hợp lệ hoặc lớn hơn 90% \-> Hệ thống từ chối cập nhật\.

\- E03: Công việc không tồn tại \-> Thông báo không tìm thấy công việc \(404\)\.

\- E04: Công việc không ở trạng thái cho phép cập nhật \-> Từ chối thao tác\.

\- E05: Người dùng không có quyền \-> Từ chối truy cập \(403\)\.

\- E06: Yêu cầu Review chưa được chấp thuận \-> Công việc chưa được cập nhật lên 100%\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`Member\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

