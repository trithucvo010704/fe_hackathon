'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  contentPadding?: string | number;
}

export default function DashboardLayout({ children, contentPadding = '24px' }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="content-area" style={{ padding: contentPadding }}>
          {children}
        </div>
      </main>
    </div>
  );
}
