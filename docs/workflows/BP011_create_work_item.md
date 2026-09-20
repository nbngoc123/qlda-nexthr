\# WORKFLOW SPECIFICATION: BP011 \- Tạo Work Item

\#\# 1\. THÔNG TIN ĐẶC TẢ \(METADATA\)

\- \*\*Mã quy trình \(Process ID\):\*\* \`BP011\`

\- \*\*Phân hệ \(Module\):\*\* \`M02\`

\- \*\*Tên nghiệp vụ:\*\* Tạo Work Item

\- \*\*Tác nhân chính \(Main Actor\):\*\* \`Team Lead\`

\- \*\*Mức độ hoàn thiện phân tích:\*\* \*\*ANALYZED\*\*

\- \*\*Sẵn sàng lập trình \(Ready to Code\):\*\* \*\*YES\*\*

\-\-\-

\#\# 2\. ĐIỀU KIỆN TIÊN QUYẾT \(PRE\-CONDITIONS\)

1\. Project đã tồn tại và đang ở trạng thái Active\.

2\. Epic/Milestone đã tồn tại, thuộc đúng Project và đang ở trạng thái cho phép tạo Work Item\.

3\. Actor đã đăng nhập vào hệ thống\.

4\. Actor có quyền tạo/quản lý Work Item trong Project\.

5\. Các thành viên được chọn làm Assignee thuộc Project\.

6\. Nếu Work Item yêu cầu Reviewer thì Reviewer phải thuộc Project và đáp ứng quy tắc phân công\.

\-\-\-

\#\# 3\. THÔNG TIN ĐẦU VÀO \(INPUT PARAMETERS\)

Epic ID, Tên Work Item, Mô tả công việc, Loại Work Item, Mức độ ưu tiên, Người được giao thực hiện, Ngày bắt đầu, Hạn hoàn thành, Khối lượng dự kiến, Chỉ tiêu cần đạt, Tài liệu, link kết quả đính kèm\.

\-\-\-

\#\# 4\. CÁC BƯỚC THỰC HIỆN \- LUỒNG CHÍNH \(HAPPY PATH STEPS\)

1\. Actor truy cập Project cần quản lý\.

2\. Actor chọn Epic/Milestone cần tạo Work Item\.

3\. Actor chọn Create Work Item\.

4\. Hệ thống hiển thị form tạo Work Item\.

5\. Actor nhập các thông tin cần thiết: tên, mô tả, loại, priority, Assignee, Reviewer, thời gian và khối lượng dự kiến\.

6\. Actor đính kèm tài liệu hoặc link kết quả nếu cần\.

7\. Actor chọn Submit/Create\.

8\. Hệ thống kiểm tra các trường bắt buộc và định dạng dữ liệu\.

9\. Hệ thống kiểm tra Work Item có thuộc Project/Epic/Milestone hợp lệ hay không\.

10\. Hệ thống kiểm tra Assignee/Reviewer có thuộc Project hay không và kiểm tra các Business Rule liên quan\.

11\. Hệ thống kiểm tra Start Date <= Deadline và Deadline không vượt quá thời hạn Milestone/Project theo quy định\.

12\. Nếu tất cả dữ liệu hợp lệ, hệ thống tạo Work Item và sinh Work Item ID\.

13\. Hệ thống liên kết Work Item với Project và Epic/Milestone tương ứng, đồng thời lưu Assignee/Reviewer\.

14\. Hệ thống ghi Audit Log cho hành động tạo Work Item\.

15\. Hệ thống trả kết quả tạo thành công và hiển thị Work Item vừa tạo\.

\-\-\-

\#\# 5\. KẾT QUẢ VÀ TRẠNG THÁI SAU KHI THỰC HIỆN \(POST\-CONDITIONS\)

1\. Work Item được tạo thành công và có ID duy nhất\.

2\. Work Item được liên kết đúng với Project và Epic/Milestone\.

3\. Assignee và Reviewer được lưu chính xác theo phân công\.

4\. Start Date, Deadline, Priority, Estimated Hours và các thông tin khác được lưu thành công\.

5\. Work Item sẵn sàng để thực hiện và tiếp tục các quy trình sau\.

6\. Audit Log ghi nhận người tạo, thời điểm tạo và thông tin thay đổi\.

\-\-\-

\#\# 6\. CÁC TÌNH HUỐNG NGOẠI LỆ & LỖI \(EXCEPTIONS & ERRORS\)

\- Epic/Project không tồn tại hoặc không thuộc Project \-> Báo lỗi\.

\- Project không ở trạng thái Active \-> Chặn tạo Work Item\.

\- Actor không có quyền \-> Từ chối thao tác \(403 Forbidden\)\.

\- Thiếu thông tin bắt buộc \-> Yêu cầu bổ sung\.

\- Assignee/Reviewer không thuộc Project \-> Báo lỗi thành viên không hợp lệ\.

\- Start Date > Deadline \-> Chặn lưu\.

\- Deadline vượt quá Deadline của Milestone/Project \-> Chặn lưu\.

\- Reviewer trùng Assignee \-> Chặn lưu theo Business Rule \(BR03\)\.

\-\-\-

\#\# 7\. RÀNG BUỘC CHO AI CODING AGENT \(AI CODING RULES\)

\- \*\*Quy tắc phụ thuộc:\*\* Kiểm tra quyền của \`Team Lead\` và ràng buộc RBAC tương ứng trong \`04\_ROLES\_AND\_PERMISSIONS\.md\`\.

\- \*\*Ghi nhận vết:\*\* Bắt buộc kích hoạt ghi nhận Audit Log ngay trong cùng Database Transaction\.

\- \*\*Triển khai mã nguồn:\*\* Đã đủ thông tin để xây dựng trọn vẹn Controller, Service, DTO Validation và Unit/Integration Test\.

