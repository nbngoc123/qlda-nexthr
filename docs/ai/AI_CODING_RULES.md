\# AI CODING RULES & CONSTRAINTS

Bộ quy tắc bất biến dành riêng cho AI Coding Agent khi sinh mã, cấu hình CSDL và sinh test:

\#\#\# Điều 1\. Nguồn chân lý duy nhất \(Single Source of Truth\)

Mọi quyết định thiết kế mã nguồn, schema, endpoint và business logic bắt buộc phải xuất phát từ bộ tài liệu đặc tả \`docs/\`:

1\. \`00\_PROJECT\_CONTEXT\.md\` & \`01\_BUSINESS\_CONTEXT\.md\`

2\. \`02\_BUSINESS\_PROCESSES\.md\` & \`workflows/BPxxx\.md\`

3\. \`03\_BUSINESS\_RULES\.md\`

4\. \`04\_ROLES\_AND\_PERMISSIONS\.md\`

5\. \`05\_DATA\_MODEL\.md\`

6\. \`states/WORK\_ITEM\_STATE\_MACHINE\.md\`

\*Tuyệt đối cấm AI tự ý suy diễn hoặc phát minh bất kỳ quy tắc nghiệp vụ nào chưa được ghi chép\.\*

\#\#\# Điều 2\. Quyền hạn sinh mã theo trạng thái phân tích

\- \*\*Đối với quy trình ANALYZED \(Đã phân tích đầy đủ\):\*\* AI được phép sinh toàn diện mã nguồn Backend Service, Controller API, Entity/Migration, DTO validation và Test case \(Unit/Integration Test\)\.

\- \*\*Đối với quy trình PARTIAL \(Phân tích một phần\):\*\* AI chỉ được implement phần nghiệp vụ đã rõ ràng\. Phần khuyết thiếu bắt buộc phải để cờ \`TODO\(BUSINESS\)\` và ghi nhận câu hỏi vào \`docs/ai/OPEN\_QUESTIONS\.md\`\.

\- \*\*Đối với quy trình UNANALYZED \(Chưa phân tích\):\*\* Tuyệt đối cấm AI tự viết logic xử lý\. AI chỉ được tạo interface/skeleton trống và ném ngoại lệ \`NotImplementedException\("Business logic is under analysis"\)\`\.

\#\#\# Điều 3\. Quy chuẩn cắm cờ nghiệp vụ trong Code

Khi gặp tình huống nghiệp vụ chưa có định nghĩa trong tài liệu, AI bắt buộc phải dừng suy diễn và chèn comment chuẩn hóa:

\`\`\`typescript

// TODO\(BUSINESS\): Need business decision from BA/PO before implementation\.

// See docs/ai/OPEN\_QUESTIONS\.md\#Qxxx for details\.

throw new NotImplementedException\('Business rule not defined: see OPEN\_QUESTIONS\.md\#Qxxx'\);

\`\`\`

\#\#\# Điều 4\. Ràng buộc bảo mật & RBAC

Mọi API endpoint bắt buộc phải được bọc bởi Guard xác thực JWT và Role/Permission Guard tương ứng với Ma trận phân quyền tại \`04\_ROLES\_AND\_PERMISSIONS\.md\`\. Tuyệt đối không để hở endpoint không có kiểm tra quyền\.

