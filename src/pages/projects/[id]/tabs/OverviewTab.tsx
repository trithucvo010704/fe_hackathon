"use client";
import React from 'react';
import { Plus } from 'lucide-react';
import styles from '../details.module.css';
import { Project, Epic, Story, ProjectRepository } from '@/lib/types';

interface OverviewTabProps {
  project: Project | null;
  epics: Epic[];
  stories: Story[];
  repos: ProjectRepository[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ project, epics, stories, repos }) => {
  return (
    <div className={styles.overviewGrid}>
      <div className={styles.mainColumn}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>About Project</h2>
          </div>
          <p className={styles.description}>{project?.description || 'No description provided.'}</p>
          <div className={styles.projectStats}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{epics.length}</span>
              <span className={styles.statLabel}>Epics</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stories.length}</span>
              <span className={styles.statLabel}>Stories</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{repos.length}</span>
              <span className={styles.statLabel}>Repos</span>
            </div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Recent Activity</h2>
            <button className={styles.viewAllBtn}>View all</button>
          </div>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}><Plus size={16} /></div>
              <div className={styles.activityContent}>
                <p><strong>You</strong> created a new story <strong>Login UI</strong></p>
                <span className={styles.activityTime}>2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Project Info</h2>
          </div>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Key</span>
              <span className={styles.infoValue}>PROJ</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Project Lead</span>
              <div className={styles.projectLead}>
                <div className={styles.avatarMini}>BH</div>
                <span className={styles.infoValue}>Bảo Hoàng</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Category</span>
              <span className={styles.infoValue}>Platform</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Last Update</span>
              <span className={styles.infoValue} suppressHydrationWarning>
                {project ? new Date(project.updatedAt).toLocaleDateString() : '-'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Status</span>
              <span className={`${styles.statusTag} ${styles.statusActive}`}>ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
