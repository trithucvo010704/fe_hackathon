'use client';

import React, { useEffect, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import styles from './Agents.module.css';
import { Agent } from '@/lib/types';
import { apiFetch } from '@/lib/api';

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    apiFetch('/api/agents')
      .then(res => res.json())
      .then(data => setAgents(data));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Active Agents</h2>
        <button className={styles.actionButton}>View All</button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Agent</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Current Task</th>
              <th className={styles.th}>Model</th>
              <th className={styles.th}>Performance</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td className={styles.td}>
                  <div className={styles.agentInfo}>
                    <img 
                      src={agent.avatar} 
                      alt={agent.name} 
                      className={styles.avatar}
                      width={32}
                      height={32}
                    />
                    <span className={styles.agentName}>{agent.name}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.status} ${styles[`status_${agent.status}`]}`}>
                    <span className={styles.statusDot}></span>
                    {agent.status}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={agent.task ? styles.task : styles.idleText}>
                    {agent.task || 'Waiting for assignment...'}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={styles.model}>{agent.model}</span>
                </td>
                <td className={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${agent.performance}%` }}
                      ></div>
                    </div>
                    <span>{agent.performance}%</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <button className={styles.iconButton}>
                    <MoreHorizontal size={18} color="var(--text-muted)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agents;
