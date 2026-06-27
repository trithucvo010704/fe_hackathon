import React from 'react';
import { Plus } from 'lucide-react';
import styles from '../details.module.css';
import { Sprint } from '@/lib/types';

interface SprintsTabProps {
  sprints: Sprint[];
}

const SprintsTab: React.FC<SprintsTabProps> = ({ sprints }) => {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Project Sprints</h2>
        <button className={styles.newTaskBtn}><Plus size={16} /> Create Sprint</button>
      </div>
      {sprints.length === 0 ? (
        <p>No sprints found.</p>
      ) : (
        <div className={styles.infoList}>
          {sprints.map(sprint => (
            <div key={sprint.id} className={styles.infoItem}>
              <div>
                <p style={{ fontWeight: 600 }}>{sprint.name}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`${styles.statusTag} ${sprint.status === 'ACTIVE' ? styles.statusActive : ''}`}>
                {sprint.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SprintsTab;
