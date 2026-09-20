# <a id="_5vjczirxsrqz"></a>BỘ ĐẶC TẢ NGHIỆP VỤ HỆ THỐNG DÀNH CHO AI CODING AGENT \(docs/\)

Hệ thống tài liệu được trích xuất và chuẩn hóa từ bảng tính Context\.xlsx theo đúng Phương pháp luận tại Báo Cáo Phương Pháp Luận \- Kiến Trúc Đặc Tả Nghiệp Vụ Markdown Cho AI Coding Agent\.

## <a id="_j8ru0tsb0h9n"></a>1\. TÀI LIỆU BỐI CẢNH & NGUYÊN TẮC CỐT LÕI \(ROOT DOCS\)

- 00\_PROJECT\_CONTEXT\.md: Tổng quan dự án, phạm vi 6 module và định hướng công nghệ\.
- 01\_BUSINESS\_CONTEXT\.md: Bài toán doanh nghiệp, nguyên tắc vận hành và đối tượng nghiệp vụ\.
- 02\_BUSINESS\_PROCESSES\.md: Danh mục 60 Business Processes \(BP001 \- BP060\) và trạng thái phân tích\.
- 03\_BUSINESS\_RULES\.md: Tổng hợp quy tắc nghiệp vụ bất biến \(BR01 \- BR08\)\.
- 04\_ROLES\_AND\_PERMISSIONS\.md: Danh mục 6 vai trò R01\-R06 và ma trận phân quyền RBAC\.
- 05\_DATA\_MODEL\.md: Mô hình dữ liệu quan niệm và đặc tả thực thể \(Project, Epic, WorkItem, TimeLog, AuditLog\)\.
- 06\_KPI\.md: Bộ chỉ tiêu KPI, công thức tính toán và quy chế đóng kỳ đánh giá\.
- 07\_GLOSSARY\.md: Từ điển thuật ngữ nghiệp vụ chuẩn hóa\.

## <a id="_m8unc644eeo7"></a>2\. QUY TRÌNH NGHIỆP VỤ CHI TIẾT \(workflows/\)

Bao gồm 15 quy trình đã được phân tích chi tiết trong Context:

- M01 Project: BP001, BP002, BP003, BP004, BP005\.
- M02 Task: BP010, BP011, BP013, BP014, BP015, BP016, BP018, BP019, BP027\.
- M03 Progress: BP028\.

*\(45 quy trình còn lại đang ở trạng thái UNANALYZED và sẽ được cập nhật sau khi BA hoàn thiện trong Context\)\.*

## <a id="_ujdfq9txbimt"></a>3\. MÁY TRẠNG THÁI \(states/\)

- 06\_STATE\_MACHINES\.md: Máy trạng thái hữu hạn cho Work Item \(To Do \-> In\-Progress \-> In Review \-> Approved\-Done/Reject/Cancel/Pending\)\.

## <a id="_thcphmc32gca"></a>4\. BỘ CÔNG CỤ ĐIỀU KHIỂN AI \(ai/\)

- AI\_CODING\_RULES\.md: Bộ quy tắc pháp lệnh bất biến khi sinh mã\.
- IMPLEMENTATION\_STATUS\.md: Bảng theo dõi ma trận tiến độ triển khai và khả năng code độc lập\.
- OPEN\_QUESTIONS\.md: Danh mục câu hỏi nghiệp vụ tồn đọng cần BA/PO giải quyết\.
- TODO\_BUSINESS\.md: Danh sách 45 BP chưa hoàn thành phân tích từ Context\.

