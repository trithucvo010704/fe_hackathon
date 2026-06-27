import React from 'react';
import { Plus, ArrowUp, Minus, User, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../details.module.css';
import { Epic, Story } from '@/lib/types';

interface StoriesTabProps {
  stories: Story[];
  epics: Epic[];
  selectedEpicFilter: string;
  setSelectedEpicFilter: (val: string) => void;
  storyStatusFilter: 'ALL' | 'IN_PROGRESS' | 'DONE';
  setStoryStatusFilter: (val: 'ALL' | 'IN_PROGRESS' | 'DONE') => void;
  setIsStoryModalOpen: (val: boolean) => void;
  setEditingStory: (story: Story) => void;
  setIsEditStoryModalOpen: (val: boolean) => void;
  handleDeleteStory: (id: string) => void;
  onStoryClick: (story: Story) => void;
  onlyMe: boolean;
  setOnlyMe: (val: boolean) => void;
}

const StoriesTab: React.FC<StoriesTabProps> = ({
  stories,
  epics,
  selectedEpicFilter,
  setSelectedEpicFilter,
  storyStatusFilter,
  setStoryStatusFilter,
  setIsStoryModalOpen,
  setEditingStory,
  setIsEditStoryModalOpen,
  handleDeleteStory,
  onStoryClick,
  onlyMe,
  setOnlyMe
}) => {
  return (
    <div className={styles.storyManagement}>
      <div className={styles.storyHeader}>
        <div className={styles.titleGroup}>
          <h2>Quản lý Story</h2>
        </div>
        <button className={styles.createStoryBtn} onClick={() => setIsStoryModalOpen(true)}>
          <Plus size={18} /> Tạo Story
        </button>
      </div>

      <div className={styles.storyToolbar}>
        <div className={styles.storyFilters}>
          <select 
            className={styles.epicDropdown}
            value={selectedEpicFilter}
            onChange={(e) => setSelectedEpicFilter(e.target.value)}
          >
            <option value="ALL">Epic: All</option>
            {epics.map(epic => (
              <option key={epic.id} value={epic.id}>{epic.title}</option>
            ))}
          </select>

          <button 
            className={`${styles.filterBtn || ''}`} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '6px 12px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              backgroundColor: onlyMe ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
              color: onlyMe ? '#4f46e5' : 'var(--text-secondary)',
              borderColor: onlyMe ? '#4f46e5' : 'var(--border)',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => setOnlyMe(!onlyMe)}
          >
            <User size={16} /> Chỉ của tôi
          </button>

          <div className={styles.statusTabs}>
            <button 
              className={`${styles.statusTab} ${storyStatusFilter === 'ALL' ? styles.activeTab : ''}`}
              onClick={() => setStoryStatusFilter('ALL')}
            >
              All
            </button>
            <button 
              className={`${styles.statusTab} ${storyStatusFilter === 'IN_PROGRESS' ? styles.activeTab : ''}`}
              onClick={() => setStoryStatusFilter('IN_PROGRESS')}
            >
              In Progress
            </button>
            <button 
              className={`${styles.statusTab} ${storyStatusFilter === 'DONE' ? styles.activeTab : ''}`}
              onClick={() => setStoryStatusFilter('DONE')}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <div className={styles.storyTableContainer}>
        <table className={styles.storyTable}>
          <thead>
            <tr>
              <th>KEY</th>
              <th>SUMMARY</th>
              <th>EPIC</th>
              <th>STATUS</th>
              <th>PRIORITY</th>
              <th>ASSIGNEE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {stories
              .filter(s => selectedEpicFilter === 'ALL' || s.epicId === selectedEpicFilter)
              .filter(s => storyStatusFilter === 'ALL' || s.status === storyStatusFilter)
              .map(story => {
                const epic = epics.find(e => e.id === story.epicId);
                return (
                  <tr key={story.id}>
                    <td className={styles.storyKey} onClick={() => onStoryClick(story)} style={{ cursor: 'pointer' }}>{story.key || 'ST-???'}</td>
                    <td className={styles.storySummary} onClick={() => onStoryClick(story)} style={{ cursor: 'pointer' }}>
                      <div className={styles.summaryTitle}>{story.title}</div>
                    </td>
                    <td>
                      {epic ? (
                        <div className={styles.epicTag}>
                          <span className={styles.epicDot} style={{ background: '#7c3aed' }}></span>
                          {epic.title}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[(story.status || 'TODO').toLowerCase().replace('_', '')]}`}>
                        {(story.status || 'TODO').replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className={styles.priorityIcon}>
                        {story.priority === 'HIGH' ? <ArrowUp size={16} color="#ef4444" /> : 
                         story.priority === 'MEDIUM' ? <ArrowUp size={16} color="#f59e0b" /> : 
                         <Minus size={16} color="#94a3b8" />}
                      </div>
                    </td>
                    <td>
                      <div className={styles.assignee}>
                        <div className={styles.miniAvatar}>
                          <User size={14} />
                        </div>
                        <span>Unassigned</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionMenu}>
                        <button className={styles.actionBtn} onClick={() => { setEditingStory(story); setIsEditStoryModalOpen(true); }}>
                          <Edit2 size={14} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.deleteAction}`} onClick={() => handleDeleteStory(story.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>Showing 1-10 of {stories.length} stories</div>
        <div className={styles.paginationControls}>
          <button className={styles.pageBtn} disabled><ChevronLeft size={16} /></button>
          <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default StoriesTab;
