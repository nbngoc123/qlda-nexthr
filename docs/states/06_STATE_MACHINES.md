\# QUY DINH MAY TRANG THAI CONG VIEC \(WORK ITEM STATE MACHINE\)

\#\# 1\. BANG CHUYEN DOI TRANG THAI

\- To Do \-> In\-Progress: Khi nguoi thuc hien bat dau nhan viec\.

\- In\-Progress \-> In\-Progress: Khi cap nhat tien do hang ngay \(gioi han 0% den 90%\)\.

\- In\-Progress \-> In\-Review: Khi nguoi thuc hien nop ket qua cong viec de cho duyet\.

\- In\-Review \-> Approved\-Done: Khi nguoi kiem tra duyet ket qua \(tien do tu dong thanh 100%\)\.

\- In\-Review \-> Reject: Khi nguoi kiem tra tu choi va yeu cau sua lai\.

\- To Do / In\-Progress \-> Pending: Tam hoan cong viec boi quan ly\.

\- To Do / In\-Progress \-> Cancel: Huy bo cong viec boi quan ly\.

\#\# 2\. NGUYEN TAC VAN HANH

\- Nguoi thuc hien khong tu y chuyen sang Approved\-Done\.

\- Khi dang In\-Review, thong tin goc duoc giu nguyen de doi chieu\.

\- Khi da Approved\-Done, khong tiep tuc chinh sua\.

