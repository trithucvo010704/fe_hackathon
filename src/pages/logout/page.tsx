'use client';

import React from 'react';
import { redirectToLogin } from '@/lib/auth';
import styles from './logout.module.css';

export default function LogoutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={styles.icon}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>
        <h1 className={styles.title}>Logged Out</h1>
        <p className={styles.message}>You have been successfully logged out of EziOps.</p>
        <button 
          onClick={redirectToLogin} 
          className={styles.loginButton}
        >
          Login Again
        </button>
      </div>
    </div>
  );
}
