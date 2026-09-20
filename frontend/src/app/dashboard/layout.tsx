'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.replace('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.replace('/login');
  };

  if (!user) {
    return null; // or a loading spinner
  }

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>NextHR</div>
        <nav className={styles.nav}>
          <Link 
            href="/dashboard" 
            className={`${styles.navItem} ${pathname === '/dashboard' ? styles.navItemActive : ''}`}
          >
            Tổng quan
          </Link>
          <Link 
            href="/dashboard/projects" 
            className={`${styles.navItem} ${pathname.includes('/projects') ? styles.navItemActive : ''}`}
          >
            Dự án & Kanban
          </Link>
          <Link 
            href="/dashboard/reports" 
            className={`${styles.navItem} ${pathname.includes('/reports') ? styles.navItemActive : ''}`}
          >
            Báo cáo KPI
          </Link>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.pageTitle}>Hệ thống Quản lý Tiến độ</div>
          <div className={styles.userProfile}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.email}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
            <div className={styles.avatar}>
              {getInitials(user.email)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
