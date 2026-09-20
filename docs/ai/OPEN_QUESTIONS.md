\# OPEN BUSINESS QUESTIONS \(CÂU HỎI NGHIỆP VỤ TỒN ĐỌNG\)

Tài liệu ghi nhận các điểm mơ hồ hoặc chưa đủ quy tắc nghiệp vụ cần BA/PO quyết định:

\#\# Q001: Quy định chuyển trạng thái từ \`Pending\`

\- \*\*Quy trình liên quan:\*\* BP019 \(Chuyển trạng thái công việc\)

\- \*\*Câu hỏi:\*\* Công việc sau khi ở trạng thái \`Pending\` \(Tạm dừng\) thì được phép chuyển sang những trạng thái nào tiếp theo?

\- \*\*Hiện trạng:\*\* Hệ thống có các state: To Do, In\-Progress, In Review, Reject, Approved\-Done, Pending, Cancel\.

\- \*\*Điểm thiếu:\*\* Chưa có quy định rõ ràng liệu Pending có được quay lại To Do hay bắt buộc phải về In\-Progress\.

\- \*\*Chỉ thị cho AI:\*\* KHÔNG ĐƯỢC TỰ SUY DIỄN\. Chỉ cho phép chuyển về \`In\-Progress\` sau khi có quyết định chính thức\.

\- \*\*Trạng thái:\*\* OPEN

\#\# Q002: Danh mục mã lỗi và phân loại vi phạm chuẩn

\- \*\*Quy trình liên quan:\*\* BP046, BP047 \(Ghi nhận & Phân loại vi phạm\)

\- \*\*Câu hỏi:\*\* Các nhóm vi phạm chất lượng gồm những mã danh mục chuẩn nào và mức trừ điểm tương ứng cho từng nhóm?

\- \*\*Điểm thiếu:\*\* Chưa có bảng tra cứu Enum phân loại vi phạm \(\`violation\_type\_enum\`\)\.

\- \*\*Chỉ thị cho AI:\*\* Tạm thời lưu dưới dạng String tự do, không tự tạo Enum cố định\.

\- \*\*Trạng thái:\*\* OPEN

\#\# Q003: Xử lý Work Item con \(Subtasks\) khi Work Item cha bị chuyển sang Cancel

\- \*\*Quy trình liên quan:\*\* BP019, BP027

\- \*\*Câu hỏi:\*\* Khi Task cha bị Cancel hoặc Soft\-delete thì các Subtask con có tự động bị Cancel/Delete theo dạng Cascade không?

\- \*\*Trạng thái:\*\* OPEN

