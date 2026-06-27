'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import Stats from '@/components/Stats/Stats';
import Agents from '@/components/Agents/Agents';
import styles from './page.module.css';
import { getStoredToken, getStoredUsername, redirectToLogin } from '@/lib/auth';

export default function Home() {
  const [username, setUsername] = useState<string>('Guest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      redirectToLogin();
    } else {
      setUsername(getStoredUsername() || 'User');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="content-area">
          <div className="glow-spot" style={{ top: '-100px', right: '-100px' }} />
          <div className={styles.welcomeSection}>
            <div>
              <h1 className={styles.title}>System Overview</h1>
              <p className={styles.subtitle}>Welcome back, {username}. Your autonomous agents are currently handling 45 tasks.</p>
            </div>
            <button className={styles.primaryButton}>Deploy New Agent</button>
          </div>
          
          <Stats />
          
          <div className={styles.mainGrid}>
            <div className={styles.leftCol}>
              <Agents />
            </div>
            <div className={styles.rightCol}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Activity Feed</h3>
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityDot}></div>
                    <div className={styles.activityContent}>
                      <strong>Alpha Scout</strong> completed architecture analysis for <em>Project Phoenix</em>.
                      <div className={styles.activityTime}>2 minutes ago</div>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityDot}></div>
                    <div className={styles.activityContent}>
                      <strong>Beta Coder</strong> requested clarification on API endpoint security.
                      <div className={styles.activityTime}>15 minutes ago</div>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityDot} style={{ backgroundColor: 'var(--danger)' }}></div>
                    <div className={styles.activityContent}>
                      <strong>Delta Deployer</strong> encountered a connection timeout.
                      <div className={styles.activityTime}>1 hour ago</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.card} style={{ marginTop: '24px' }}>
                <h3 className={styles.cardTitle}>Resource Usage</h3>
                <div className={styles.usageInfo}>
                  <div className={styles.usageItem}>
                    <div className={styles.usageLabel}>CPU Clusters</div>
                    <div className={styles.usageValue}>64%</div>
                  </div>
                  <div className={styles.usageItem}>
                    <div className={styles.usageLabel}>Memory Utilization</div>
                    <div className={styles.usageValue}>42%</div>
                  </div>
                  <div className={styles.usageItem}>
                    <div className={styles.usageLabel}>API Token Balance</div>
                    <div className={styles.usageValue}>8.2M</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
