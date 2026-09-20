\# 05\. DOMAIN DATA MODEL & ENTITY SPECIFICATION

\#\# 1\. MÔ HÌNH THỰC THỂ CỐT LÕI \(CORE ENTITIES\)

\#\#\# 1\. Project \(Dự án\)

\- \`id\` \(UUID, Primary Key\): Mã định danh hệ thống\.

\- \`project\_code\` \(VARCHAR\(50\), Unique, Not Null\): Mã dự án hiển thị \(VD: \`PRJ\_2026\_01\`\)\.

\- \`name\` \(VARCHAR\(255\), Not Null\): Tên dự án\.

\- \`description\` \(TEXT\): Mô tả chi tiết dự án\.

\- \`status\` \(ENUM: \`Planning\`, \`Active\`, \`On\-Hold\`, \`Completed\`, \`Closed\`\): Trạng thái vòng đời\.

\- \`start\_date\` \(DATE\): Ngày bắt đầu\.

\- \`end\_date\` \(DATE\): Ngày kết thúc dự kiến\.

\- \`budget\` \(DECIMAL\(15,2\)\): Ngân sách dự án\.

\- \`pm\_id\` \(UUID, Foreign Key \-> User\): Chủ nhiệm dự án\.

\- \`created\_at\`, \`updated\_at\` \(TIMESTAMP\)\.

\#\#\# 2\. Epic \(Nhóm công việc lớn\)

\- \`id\` \(UUID, Primary Key\)

\- \`project\_id\` \(UUID, Foreign Key \-> Project, Not Null\)

\- \`name\` \(VARCHAR\(255\), Not Null\): Tên Epic\.

\- \`description\` \(TEXT\)

\- \`target\` \(TEXT\): Mục tiêu của Epic\.

\- \`start\_date\`, \`end\_date\` \(DATE\)

\- \`status\` \(ENUM: \`Open\`, \`In\-Progress\`, \`Completed\`, \`Closed\`\)

\#\#\# 3\. Milestone \(Mốc tiến độ dự án\)

\- \`id\` \(UUID, Primary Key\)

\- \`project\_id\` \(UUID, Foreign Key \-> Project, Not Null\)

\- \`title\` \(VARCHAR\(255\), Not Null\)

\- \`due\_date\` \(DATE, Not Null\): Hạn chót của Milestone\.

\- \`status\` \(ENUM: \`Pending\`, \`Achieved\`, \`Missed\`\)

\#\#\# 4\. WorkItem \(Công việc / Hạng mục thực hiện\)

\- \`id\` \(UUID, Primary Key\)

\- \`project\_id\` \(UUID, Foreign Key \-> Project, Not Null\)

\- \`epic\_id\` \(UUID, Foreign Key \-> Epic, Nullable\)

\- \`milestone\_id\` \(UUID, Foreign Key \-> Milestone, Nullable\)

\- \`parent\_id\` \(UUID, Foreign Key \-> WorkItem, Nullable\): Áp dụng cho Subtask\.

\- \`item\_code\` \(VARCHAR\(50\), Unique, Not Null\): Mã công việc \(VD: \`INDA\_TTS\-00001\`\)\.

\- \`title\` \(VARCHAR\(255\), Not Null\): Tên công việc\.

\- \`description\` \(TEXT\): Mô tả yêu cầu\.

\- \`type\` \(ENUM: \`Task\`, \`Bug\`, \`CR\`, \`Subtask\`\): Phân loại công việc\.

\- \`priority\` \(ENUM: \`Urgent\`, \`High\`, \`Medium\`, \`Low\`\): Mức ưu tiên\.

\- \`status\` \(ENUM: \`To Do\`, \`In\-Progress\`, \`In Review\`, \`Reject\`, \`Approved\-Done\`, \`Pending\`, \`Cancel\`\)

\- \`assignee\_id\` \(UUID, Foreign Key \-> User, Nullable\): Người thực hiện\.

\- \`reviewer\_id\` \(UUID, Foreign Key \-> User, Nullable\): Người kiểm tra/duyệt\.

\- \`start\_date\` \(TIMESTAMP, Nullable\)

\- \`deadline\` \(TIMESTAMP, Nullable\)

\- \`estimated\_hours\` \(FLOAT, Default 0\)

\- \`progress\_percentage\` \(INT, Default 0, Range 0\-100\)

\- \`delivery\_link\` \(VARCHAR\(500\), Nullable\): Đường dẫn kết quả bàn giao\.

\- \`issue\_note\` \(TEXT, Nullable\): Ghi nhận trở ngại / Issue\.

\- \`is\_deleted\` \(BOOLEAN, Default False\): Cờ xóa mềm\.

\- \`deleted\_at\` \(TIMESTAMP, Nullable\), \`deleted\_by\` \(UUID, Nullable\)

\#\#\# 5\. WorkItemLog / TimeLog \(Khai báo giờ làm việc\)

\- \`id\` \(UUID, Primary Key\)

\- \`work\_item\_id\` \(UUID, Foreign Key \-> WorkItem, Not Null\)

\- \`user\_id\` \(UUID, Foreign Key \-> User, Not Null\)

\- \`log\_date\` \(DATE, Not Null\)

\- \`logged\_hours\` \(FLOAT, Not Null, > 0\)

\- \`description\` \(TEXT, Not Null\)

\#\#\# 6\. AuditLog \(Nhật ký truy vết hệ thống\)

\- \`id\` \(UUID, Primary Key\)

\- \`entity\_name\` \(VARCHAR\(50\), Not Null\): Bảng bị tác động \(\`Project\`, \`WorkItem\`, etc\.\)\.

\- \`entity\_id\` \(UUID, Not Null\): ID bản ghi\.

\- \`action\` \(VARCHAR\(50\), Not Null\): \`CREATE\`, \`UPDATE\`, \`STATUS\_CHANGE\`, \`SOFT\_DELETE\`\.

\- \`old\_data\` \(JSONB, Nullable\)

\- \`new\_data\` \(JSONB, Nullable\)

\- \`actor\_id\` \(UUID, Foreign Key \-> User, Not Null\)

\- \`created\_at\` \(TIMESTAMP, Default NOW\(\)\)

