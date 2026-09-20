\# 04\. ROLES AND PERMISSIONS MATRIX \(RBAC\)

\#\# 1\. DANH MỤC VAI TRÒ HỆ THỐNG \(ROLES SPECIFICATION\)

\- \*\*R01 \- C\-Level:\*\* Ban lãnh đạo doanh nghiệp\. Phạm vi: Toàn doanh nghiệp \(Enterprise Scope\)\. Quyền hạn: Giám sát toàn bộ dự án, tiến độ, báo cáo tài chính và hiệu suất\.

\- \*\*R02 \- PM \(Project Manager\):\*\* Quản lý dự án\. Phạm vi: Dự án được phân công phụ trách \(Project Scope\)\. Quyền hạn: Quản trị thông tin dự án, ngân sách, thành viên, Epic, Work Item, KPI dự án\.

\- \*\*R03 \- Team Lead:\*\* Trưởng nhóm kỹ thuật/nghiệp vụ\. Phạm vi: Nhóm phụ trách trong dự án \(Team Scope\)\. Quyền hạn: Tạo và quản lý Epic/Work Item, phân công việc, kiểm tra tiến độ của team\.

\- \*\*R04 \- Member:\*\* Thành viên thực thi\. Phạm vi: Các công việc được phân công trực tiếp \(Assigned Tasks Scope\)\. Quyền hạn: Khai báo giờ làm, cập nhật tiến độ \(0\-90%\), nộp bài kiểm tra\.

\- \*\*R05 \- Reviewer \(Quality Reviewer\):\*\* Người kiểm tra chất lượng\. Phạm vi: Các công việc được chỉ định review\. Quyền hạn: Kiểm tra bài nộp, Duyệt \(Approve\), Từ chối \(Reject\) và Ghi nhận vi phạm\.

\- \*\*R06 \- Admin / HR:\*\* Quản trị viên và Nhân sự\. Phạm vi: Toàn hệ thống\. Quyền hạn: Quản lý người dùng, phòng ban, cấu hình hệ thống và dữ liệu đào tạo\.

\#\# 2\. MA TRẬN PHÂN QUYỀN TRỌNG YẾU \(PERMISSION MATRIX\)

| Mã Quyền | Đối Tượng | Hành Động Nghiệp Vụ | R01 \(C\-Level\) | R02 \(PM\) | R03 \(Lead\) | R04 \(Member\) | R05 \(Reviewer\) | Scope Áp Dụng |

| :\-\-\-: | :\-\-\-: | :\-\-\- | :\-\-\-: | :\-\-\-: | :\-\-\-: | :\-\-\-: | :\-\-\-: | :\-\-\-: |

| \*\*P001\*\* | Project | Xem thông tin dự án | Read | Read | Read | Read | Read | All / Project |

| \*\*P002\*\* | Project | Khởi tạo dự án mới | Read | Create | \- | \- | \- | All / Project |

| \*\*P003\*\* | Project | Cập nhật thông tin dự án | \- | Update | \- | \- | \- | Assigned Project |

| \*\*P004\*\* | Project | Thiết lập mục tiêu | \- | Create/Update | \- | \- | \- | Assigned Project |

| \*\*P005\*\* | Project | Thêm/bớt thành viên | \- | Create/Delete | \- | \- | \- | Assigned Project |

| \*\*P006\*\* | Project | Đặt khung thời gian DA | \- | Update | \- | \- | \- | Assigned Project |

| \*\*P010\*\* | Epic | Quản lý Epic | Read | CRUD | CRUD | Read | Read | Assigned Project |

| \*\*P011\*\* | WorkItem | Tạo mới Work Item | Read | Create | Create | \- | \- | Assigned Project |

| \*\*P012\*\* | WorkItem | Cập nhật thông tin gốc | Read | Update | Update | \- | \- | Assigned Project |

| \*\*P013\*\* | WorkItem | Phân công nhân sự | Read | Update | Update | \- | \- | Assigned Project |

| \*\*P014\*\* | WorkItem | Thiết lập thời hạn | Read | Update | Update | \- | \- | Assigned Project |

| \*\*P015\*\* | WorkItem | Thiết lập mức ưu tiên | Read | Update | Update | \- | \- | Assigned Project |

| \*\*P018\*\* | WorkItem | Cập nhật % tiến độ \(0\-90%\) | Read | Read | Read | Update | Read | Assigned Task |

| \*\*P019\*\* | WorkItem | Nộp bài \(Chuyển In\-Review\) | \- | \- | \- | Update | \- | Assigned Task |

| \*\*P020\*\* | WorkItem | Nghiệm thu / Duyệt hoàn thành | \- | Update | Update | \- | Update | Assigned Review |

| \*\*P021\*\* | WorkItem | Từ chối duyệt \(Reject\) | \- | Update | Update | \- | Update | Assigned Review |

| \*\*P022\*\* | WorkItem | Xóa mềm Work Item | \- | Delete | Delete | \- | \- | Assigned Project |

| \*\*P028\*\* | WorkItem | Xem bảng Kanban / Báo cáo | Read | Read | Read | Read | Read | Project / Assigned |

