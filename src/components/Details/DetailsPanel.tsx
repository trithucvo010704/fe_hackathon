'use client';

import React from 'react';
import { X, Book, FileText, Layers, User, Calendar, Tag, ChevronRight } from 'lucide-react';
import { ProjectTask, Story, Epic } from '@/lib/types';
import styles from '@/pages/projects/[id]/details.module.css';
import TaskDetailTabs from './TaskDetailTabs';
import StoryDetailTabs from './StoryDetailTabs';
import EpicDetailTabs from './EpicDetailTabs';
import { useProject } from '@/pages/projects/[id]/context/ProjectContext';

interface DetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  item: ProjectTask | Story | Epic | null;
  type: 'task' | 'story' | 'epic';
}

export default function DetailsPanel({ isOpen, onClose, item, type }: DetailsPanelProps) {
  const { project, fetchSubData, setSelectedItem } = useProject();

  if (!item) return null;

  const handleUpdate = (updatedItem?: any) => {
    fetchSubData();
    if (updatedItem) {
      setSelectedItem(updatedItem);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'task': return <FileText size={16} />;
      case 'story': return <Book size={16} />;
      case 'epic': return <Layers size={16} />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'task': return `${(item as ProjectTask).key}: ${(item as ProjectTask).title}`;
      case 'story': return `${(item as Story).key}: ${(item as Story).title}`;
      case 'epic': return `${(item as Epic).key}: ${(item as Epic).title}`;
    }
  };

  return (
    <div className={`${styles.slideOverOverlay} ${isOpen ? styles.open : ''}`} onClick={onClose}>
      <div className={styles.slideOverPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.slideOverHeader}>
          <div className={styles.slideOverHeaderLeft}>
            {getIcon()}
            <span>{getLabel()}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {type === 'task' && (
          <TaskDetailTabs 
            task={item as ProjectTask} 
            projectId={project?.id || ''} 
            onUpdate={handleUpdate}
          />
        )}

        {type === 'story' && (
          <StoryDetailTabs 
            story={item as Story} 
            projectId={project?.id || ''} 
            onUpdate={handleUpdate}
          />
        )}

        {type === 'epic' && (
          <EpicDetailTabs 
            epic={item as Epic} 
            projectId={project?.id || ''} 
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}
