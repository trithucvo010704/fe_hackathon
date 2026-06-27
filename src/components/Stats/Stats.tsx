'use client';

import React, { useEffect, useState } from 'react';
import { Users, CheckSquare, Zap, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import styles from './Stats.module.css';
import { Stats as StatsType } from '@/lib/types';
import { apiFetch } from '@/lib/api';

const Stats = () => {
  const [stats, setStats] = useState<StatsType | null>(null);

  useEffect(() => {
    apiFetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div className={styles.grid}>Loading...</div>;

  const items = [
    {
      title: 'Active Agents',
      value: stats.activeAgents,
      icon: Users,
      color: '#4f46e5',
      bg: '#eef2ff',
      trend: '+2',
      trendUp: true,
      label: 'from yesterday'
    },
    {
      title: 'Ongoing Tasks',
      value: stats.ongoingTasks,
      icon: CheckSquare,
      color: '#3b82f6',
      bg: '#eff6ff',
      trend: '+12%',
      trendUp: true,
      label: 'vs last week'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: Zap,
      color: '#10b981',
      bg: '#ecfdf5',
      trend: '-0.2%',
      trendUp: false,
      label: 'from avg'
    },
    {
      title: 'Credits Used',
      value: stats.creditsUsed.toLocaleString(),
      icon: CreditCard,
      color: '#f59e0b',
      bg: '#fffbeb',
      trend: '+450',
      trendUp: false,
      label: 'today'
    }
  ];

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item.title} className={styles.card}>
          <div className={styles.header}>
            <div 
              className={styles.iconWrapper} 
              style={{ backgroundColor: item.bg, color: item.color }}
            >
              <item.icon size={24} />
            </div>
            <span className={item.trendUp ? styles.trendUp : styles.trendDown}>
              {item.trend}
            </span>
          </div>
          <div>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.value}>{item.value}</div>
          </div>
          <div className={styles.footer}>
            <span className={item.trendUp ? styles.trendUp : styles.trendDown}>
              {item.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            </span>
            <span className={styles.trendLabel}>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
