\# 03\. BUSINESS RULES & SYSTEM CONSTRAINTS

Toàn bộ các quy tắc nghiệp vụ bất biến được quy định chi tiết dưới đây:

\#\#\# BR01: Ràng buộc duy nhất và thời gian Dự án \(Project Constraints\)

\- Mã dự án \(\`project\_code\`\) là chuỗi định danh duy nhất trong toàn hệ thống, không được phép trùng lặp\.

\- Ngày kết thúc dự án phải lớn hơn hoặc bằng ngày bắt đầu: \`end\_date >= start\_date\`\.

\- Chỉ người dùng có vai trò PM hoặc C\-Level mới được quyền tạo dự án\. Khi tạo xong, dự án ở trạng thái \`Planning\` và người tạo mặc định được gán làm PM phụ trách\.

\#\#\# BR02: Ràng buộc thứ bậc thời gian công việc \(Work Item Timeline Constraints\)

\- Thời gian bắt đầu và kết thúc của Work Item phải nằm trong khoảng thời gian hợp lệ của Milestone liên kết và Dự án:

  \`project\.start\_date <= milestone\.start\_date <= work\_item\.start\_date <= work\_item\.deadline <= milestone\.due\_date <= project\.end\_date\`\.

\- Bất kỳ thao tác điều chỉnh Deadline nào vượt quá hạn Milestone đều bị hệ thống chặn \(HTTP 422/400\)\.

\#\#\# BR03: Ràng buộc phân tách vai trò độc lập \(Reviewer \!= Assignee\)

\- Đối với mọi Work Item yêu cầu duyệt kết quả, \`reviewer\_id\` bắt buộc phải khác \`assignee\_id\`\.

\- Người thực hiện không được phép tự phân công chính mình làm người nghiệm thu\.

\#\#\# BR04: Ràng buộc giới hạn cập nhật tiến độ \(Progress Update Cap\)

\- Người thực hiện \(Member\) chỉ được phép tự cập nhật tiến độ trong dải từ \*\*0% đến 90%\*\*\.

\- Thành viên tuyệt đối không thể tự cập nhật tiến độ lên 100%\. Mốc 100% chỉ được kích hoạt tự động sau khi Reviewer phê duyệt công việc thành công \(\`Approved\-Done\`\)\.

\#\#\# BR05: Khóa trạng thái và Bảo toàn dữ liệu \(State Locking & Immutability\)

\- Khi Work Item đang ở trạng thái \`In\-Review\`, thông tin gốc \(Tên, Mô tả, Thời hạn, Ước lượng giờ, Phân công\) bị khóa ở chế độ Read\-Only để bảo toàn dữ liệu phục vụ đối soát kiểm tra\.

\- Khi Work Item đã ở trạng thái \`Approved\-Done\` hoặc \`Cancelled\`, mọi thao tác chỉnh sửa thông tin hoặc chuyển đổi trạng thái tiếp theo đều bị chặn\.

\- Nếu Work Item đã nằm trong kỳ đánh giá KPI đã chốt phê duyệt chính thức \(\`Confirmed\`\), tuyệt đối cấm xóa mềm hoặc sửa đổi dữ liệu\.

\#\#\# BR06: Cơ chế Xóa mềm \(Soft Delete\)

\- Hệ thống không thực hiện xóa cứng \(Hard Delete\) đối với Work Item\. Khi xóa, hệ thống chỉ cập nhật cờ \`is\_deleted = true\`, ghi nhận thời điểm xóa \`deleted\_at = NOW\(\)\` và định danh người xóa \`deleted\_by = User\_ID\`\.

\- Thao tác xóa yêu cầu bắt buộc nhập Lý do xóa \(\`deletion\_reason\`\) có độ dài tối thiểu 10 ký tự\.

\#\#\# BR07: Cơ chế ghi nhận Audit Log tự động \(Automatic Audit Trail\)

\- Mọi thao tác làm biến động dữ liệu \(Tạo, Cập nhật, Đổi trạng thái, Đổi phân công, Đổi hạn, Xóa\) bắt buộc phải sinh một bản ghi Audit Log trong cùng Transaction\.

\- Bản ghi Audit Log phải chứa: \`entity\_name\`, \`entity\_id\`, \`action\`, \`old\_value\`, \`new\_value\`, \`actor\_id\`, \`timestamp\`\.

\#\#\# BR08: Ràng buộc thời gian làm việc thực tế \(Working Hours & Calendar\)

\- Khi tính toán tiến độ, thời hạn và KPI năng suất, hệ thống chỉ tính các ngày làm việc tiêu chuẩn \(Thứ 2 đến Thứ 6\), tự động loại trừ Thứ 7, Chủ nhật, Ngày lễ quốc gia và các khoảng thời gian nghỉ phép \(Leave\) của nhân sự\.

