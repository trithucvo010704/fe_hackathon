'use client';

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  CheckSquare, 
  Activity, 
  Settings, 
  Cpu,
  BookOpen,
  MessageSquare
} from 'lucide-react';

import styles from './Sidebar.module.css';
import { getStoredUsername, logout } from '@/lib/auth';
import { LogOut, X } from 'lucide-react';
import { useLayout } from '../Common/LayoutContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Shield, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const { pathname } = useLocation();
  const [username, setUsername] = useState<string | null>(null);
  const { isSidebarOpen, closeSidebar } = useLayout();

  useEffect(() => {
    setUsername(getStoredUsername());
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Projects', icon: Briefcase, href: '/projects' },
    { name: 'Agents', icon: Users, href: '/agents' },
    { name: 'Tasks', icon: CheckSquare, href: '/tasks' },
    { name: 'Realtime Chat', icon: MessageSquare, href: '/chat' },
  ];

  const secondaryItems = [
    { name: 'Guidelines', icon: BookOpen, href: '/guidelines' },
    { name: 'System Logs', icon: Activity, href: '/logs' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  const adminItems = [
    { name: 'User Management', icon: Users, href: '/admin/users' },
    { name: 'AI Models', icon: Cpu, href: '/admin/ai/models' },
    { name: 'AI Environments', icon: Settings, href: '/admin/ai/envs' },
    { name: 'Agent Brains', icon: Activity, href: '/admin/ai/brains' },
    { name: 'Role Management', icon: Shield, href: '/admin/roles' },
  ];

  const { isAdmin, user } = useAuth();
  const [isAdminExpanded, setIsAdminExpanded] = useState(true);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <Cpu size={20} />
            </div>
            <span className={styles.logoText}>AgentOps</span>
          </div>
          <button className={styles.closeButton} onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}

        <div className={styles.navSection}>Administration</div>
        
        {secondaryItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}

        {isAdmin && (
          <>
            <div 
              className={`${styles.navSection} ${styles.collapsibleHeader}`}
              onClick={() => setIsAdminExpanded(!isAdminExpanded)}
            >
              <span>Admin Management</span>
              {isAdminExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            
            {isAdminExpanded && adminItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.href}
                className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                onClick={closeSidebar}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className={styles.footer}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'Admin'}`} 
              alt="User" 
              width={36}
              height={36}
            />
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>{user?.name || username || 'Loading...'}</div>
            <div className={styles.profileRole}>{isAdmin ? 'System Admin' : (user?.roles?.[0] || 'Member')}</div>
          </div>
          <button 
            className={styles.logoutButton} 
            onClick={logout}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  </>
);
};

export default Sidebar;
