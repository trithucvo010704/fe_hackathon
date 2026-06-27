import React from 'react';
import { Search, Calendar, ArrowUpDown, User } from 'lucide-react';
import styles from '../details.module.css';
import { Epic, Story } from '@/lib/types';
import EpicCard from '@/components/Projects/EpicCard';
import AddEpicCard from '@/components/Projects/AddEpicCard';

interface EpicsTabProps {
  epics: Epic[];
  stories: Story[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  sortBy: 'title' | 'status' | 'deadline' | 'createdAt';
  setSortBy: (val: 'title' | 'status' | 'deadline' | 'createdAt') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (val: 'asc' | 'desc') => void;
  setEditingEpic: (epic: Epic) => void;
  setIsEditEpicModalOpen: (val: boolean) => void;
  handleDeleteEpic: (id: string) => void;
  setIsEpicModalOpen: (val: boolean) => void;
  onEpicClick: (epic: Epic) => void;
  onlyMe: boolean;
  setOnlyMe: (val: boolean) => void;
}

const EpicsTab: React.FC<EpicsTabProps> = ({
  epics,
  stories,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  setEditingEpic,
  setIsEditEpicModalOpen,
  handleDeleteEpic,
  setIsEpicModalOpen,
  onEpicClick,
  onlyMe,
  setOnlyMe
}) => {
  return (
    <div className={styles.epicsContainer}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Lọc theo tên Epic..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterActions}>
          <button 
            className={`${styles.filterBtn} ${onlyMe ? styles.activeFilter : ''}`} 
            onClick={() => setOnlyMe(!onlyMe)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <User size={16} /> Chỉ của tôi
          </button>
          <button className={`${styles.filterBtn} ${sortBy === 'deadline' ? styles.activeFilter : ''}`} onClick={() => setSortBy('deadline')}>
            <Calendar size={16} /> Deadline
          </button>
          <button className={`${styles.filterBtn} ${sortBy === 'createdAt' ? styles.activeFilter : ''}`} onClick={() => setSortBy('createdAt')}>
            <Calendar size={16} /> Ngày tạo
          </button>
          <button className={`${styles.filterBtn} ${sortBy === 'status' ? styles.activeFilter : ''}`} onClick={() => setSortBy('status')}>
            <ArrowUpDown size={16} /> Trạng thái
          </button>
          <button className={styles.filterBtn} onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
          </button>
        </div>
      </div>

      <div className={styles.epicGrid}>
        {epics
          .filter(epic => (epic.title || '').toLowerCase().includes(searchTerm.toLowerCase()))
          .sort((a, b) => {
            const factor = sortOrder === 'asc' ? 1 : -1;
            if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '') * factor;
            if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '') * factor;
            if (sortBy === 'createdAt') return (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()) * factor;
            return 0;
          })
          .map(epic => (
            <EpicCard
              key={epic.id}
              id={epic.id}
              epicKey={epic.key}
              name={epic.title}
              description={epic.description}
              status={epic.status}
              createdBy={epic.createdBy || 'Unknown'}
              progress={epic.status === 'DONE' ? 100 : (epic.status === 'IN_PROGRESS' ? 65 : 0)}
              storiesCount={stories.filter(s => s.epicId === epic.id).length}
              points={stories.filter(s => s.epicId === epic.id).length * 5}
              onEdit={() => {
                setEditingEpic(epic);
                setIsEditEpicModalOpen(true);
              }}
              onDelete={() => handleDeleteEpic(epic.id)}
              onClick={() => onEpicClick(epic)}
            />
          ))}
        <AddEpicCard onClick={() => setIsEpicModalOpen(true)} />
      </div>
    </div>
  );
};

export default EpicsTab;
