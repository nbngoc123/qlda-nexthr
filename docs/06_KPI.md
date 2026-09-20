\# 06\. KPI SPECIFICATION & PERFORMANCE EVALUATION

\#\# 1\. DANH MỤC CHỈ TIÊU KPI CHUẨN HÓA

| Nhóm Đối Tượng | Mã KPI | Tên Chỉ Tiêu KPI | Mục Tiêu Chiến Lược | Mục Tiêu Đạt \(Target\) | Công Thức Tính Toán Hệ Thống | Nguồn Dữ Liệu | Trọng Số |

| :\-\-\-: | :\-\-\-: | :\-\-\- | :\-\-\- | :\-\-\-: | :\-\-\- | :\-\-\- | :\-\-\-: |

| \*\*Member\*\* | \*\*KPI\-M01\*\* | On\-time Delivery | Đảm bảo hoàn thành công việc đúng hạn | >= 95% | \`\(Số task hoàn thành đúng hạn / Tổng số task được giao\) \* 100%\` | WorkItem \(\`deadline\`, \`status\`, \`completed\_at\`\) | 40% |

| \*\*Member\*\* | \*\*KPI\-M02\*\* | Productivity | Tối ưu hóa hiệu suất giờ làm | >= 100% | \`\(Tổng giờ dự kiến Estimated / Tổng giờ khai báo Logged\) \* 100%\` | WorkItem, TimeLog | 30% |

| \*\*Member\*\* | \*\*KPI\-M03\*\* | First\-time Approval | Nâng cao chất lượng, giảm tỷ lệ reject | >= 90% | \`\(Số task được duyệt ngay lần đầu / Tổng số task nộp bài\) \* 100%\` | AuditLog, WorkItem \(\`In Review\` \-> \`Approved\-Done\`\) | 20% |

| \*\*Member\*\* | \*\*KPI\-M04\*\* | Quality & Compliance | Giảm thiểu lỗi và vi phạm quy trình | <= 2 lỗi/kỳ | \`Tổng số biên bản vi phạm được xác nhận trong kỳ\` | Module M05 \(Violation records\) | 10% |

| \*\*Team Lead\*\*| \*\*KPI\-TL01\*\*| Team Velocity | Đảm bảo tiến độ bàn giao của toàn nhóm | >= 90% | \`\(Tổng điểm story point hoàn thành / Điểm cam kết\) \* 100%\` | Module M02, M03 | 35% |

| \*\*Team Lead\*\*| \*\*KPI\-TL02\*\*| Review Turnaround | Nghiệm thu bài nộp của thành viên đúng hạn | <= 24 giờ | \`Thời gian trung bình từ khi Member nộp In\-Review đến khi Duyệt\` | AuditLog \(\`In\-Review\` timestamp\) | 25% |

| \*\*PM\*\* | \*\*KPI\-PM01\*\*| Project Milestone SLA| Đạt mốc tiến độ dự án theo kế hoạch | 100% | \`\(Số Milestone đạt đúng hạn / Tổng Milestone\) \* 100%\` | Module M01, M03 | 40% |

| \*\*PM\*\* | \*\*KPI\-PM02\*\*| Budget & Effort Variance| Kiểm soát ngân sách và giờ làm dự án | <= 5% | \`ABS\(Chi phí thực tế \- Ngân sách kế hoạch\) / Ngân sách kế hoạch\` | Module M01, M03 | 30% |

\#\# 2\. QUY TRÌNH TÍNH TOÁN & KHÓA KỲ KPI

1\. \*\*Thu thập dữ liệu tự động \(BP040\):\*\* Hệ thống quét định kỳ vào cuối kỳ đánh giá \(cuối tuần / cuối tháng\)\.

2\. \*\*Tính toán tự động \(BP041\):\*\* Áp dụng công thức và trọng số để tính điểm trung bình có trọng số\.

3\. \*\*Đánh giá bổ sung \(BP043\):\*\* Quản lý trực tiếp ghi nhận nhận xét định tính\.

4\. \*\*Phê duyệt chính thức \(BP044\):\*\* PM/C\-Level xác nhận đóng kỳ KPI\. Khi đã xác nhận \(\`Confirmed\`\), toàn bộ Work Item của kỳ đó sẽ bị khóa cứng để phục vụ lưu trữ kế toán\.

