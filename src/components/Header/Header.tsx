'use client';

import React from 'react';
import { Search, Bell, HelpCircle, Moon, Menu } from 'lucide-react';
import styles from './Header.module.css';
import { useLayout } from '../Common/LayoutContext';

const Header = () => {
  const { toggleSidebar } = useLayout();

  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <div className={styles.searchWrapper}>
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search agents, tasks, or documentation..." 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton} title="Notifications">
          <Bell size={20} />
          <span className={styles.badge}></span>
        </button>
        <button className={styles.iconButton} title="Help">
          <HelpCircle size={20} />
        </button>
        <button className={styles.iconButton} title="Toggle Theme">
          <Moon size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
