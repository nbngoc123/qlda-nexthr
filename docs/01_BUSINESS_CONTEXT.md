\# 01\. BUSINESS CONTEXT & TRACEABILITY MATRIX

\#\# 1\. BỐI CẢNH VÀ BÀI TOÁN DOANH NGHIỆP \(BUSINESS PAIN POINTS\)

\- \*\*Phân mảnh dữ liệu:\*\* Doanh nghiệp quản lý công việc qua nhiều kênh rời rạc \(chat Zalo, file Excel cá nhân, email\), dẫn đến thất lạc yêu cầu và không thể truy vết lịch sử \(Audit Log\)\.

\- \*\*Mơ hồ về trách nhiệm:\*\* Không có sự phân định ranh giới rõ ràng giữa Người thực hiện \(Assignee\) và Người kiểm tra/duyệt \(Reviewer\)\. Thành viên tự ý đánh dấu hoàn thành 100% công việc mà không qua nghiệm thu chất lượng\.

\- \*\*Thiếu kiểm soát tiến độ thời gian thực:\*\* Cấp quản lý \(PM, C\-Level\) không nắm bắt kịp thời các đầu việc trễ hạn hoặc nguy cơ vỡ tiến độ Milestone/Sprint\.

\- \*\*Đánh giá hiệu suất cảm tính:\*\* Việc tính điểm KPI và xử lý vi phạm chất lượng bị tách rời khỏi quy trình thực hiện công việc hàng ngày, gây thiếu minh bạch và tranh cãi\.

\#\# 2\. NGUYÊN TẮC VẬN HÀNH CỐT LÕI \(OPERATIONAL PRINCIPLES\)

1\. \*\*Định danh duy nhất & Quản lý tập trung:\*\* Mọi dự án phải có Project Code duy nhất, có Project Manager \(PM\) chịu trách nhiệm chính và được C\-Level phê duyệt\.

2\. \*\*Cấu trúc phân rã công việc \(WBS Hierarchy\):\*\* Mọi công việc \(Work Item: Task, Bug, CR, Subtask\) bắt buộc phải trực thuộc một Epic/Milestone và Dự án cụ thể\.

3\. \*\*Phân tách vai trò kiểm soát chất lượng \(Four\-Eyes Principle\):\*\* Assignee và Reviewer trên một Work Item không được phép là cùng một người\.

4\. \*\*Quy tắc nghiệm thu 2 bước \(Two\-Step Verification\):\*\* Assignee chỉ được tự cập nhật tiến độ tối đa 90%\. Trạng thái hoàn thành \(Approved\-Done\) và mốc 100% bắt buộc phải do Reviewer kiểm tra và phê duyệt\.

5\. \*\*Bảo toàn dữ liệu & Truy vết toàn diện:\*\* Mọi thay đổi về thông tin gốc, trạng thái, thời hạn, phân công đều phải được ghi nhận tự động vào Audit Log\. Không áp dụng xóa cứng \(Hard Delete\) đối với công việc đang thực hiện hoặc đã chốt kỳ KPI\.

\#\# 3\. CÁC BÊN THAM GIA \(STAKEHOLDERS & ROLES\)

\- \*\*C\-Level \(R01\):\*\* Ban lãnh đạo, giám sát toàn diện tình hình hoạt động, tiến độ và hiệu suất các dự án trong toàn doanh nghiệp\.

\- \*\*Project Manager \- PM \(R02\):\*\* Chịu trách nhiệm toàn diện về một hoặc nhiều dự án được giao \(phạm vi Project\)\.

\- \*\*Team Lead \(R03\):\*\* Quản lý kỹ thuật và điều phối công việc trong phạm vi nhóm/đội ngũ phụ trách \(phạm vi Team\)\.

\- \*\*Member \(R04\):\*\* Thành viên trực tiếp thực hiện công việc, khai báo giờ làm và cập nhật tiến độ \(phạm vi Assigned Tasks\)\.

\- \*\*Quality Reviewer \(R05\):\*\* Người kiểm tra chất lượng, nghiệm thu sản phẩm bàn giao, duyệt/từ chối hoàn thành và ghi nhận vi phạm\.

\- \*\*HR / Admin \(R06\):\*\* Quản trị hệ thống, danh mục nhân sự và tổng hợp số liệu nhân sự/đào tạo\.

