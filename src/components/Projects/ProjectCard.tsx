import React, { useEffect, useState } from 'react';
import { Project } from '@/lib/types';
import { ExternalLink, Calendar, Trash2, Edit3 } from 'lucide-react';
import styles from './ProjectCard.module.css';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    setFormattedDate(new Date(project.createdAt).toLocaleDateString());
  }, [project.createdAt]);

  const statusColors = {
    ACTIVE: 'var(--success)',
    PENDING: 'var(--warning)',
    CLOSED: 'var(--danger)',
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.statusBadge} style={{ backgroundColor: statusColors[project.status] }}>
          {project.status}
        </div>
      </div>
      
      <h3 className={styles.title}>{project.name}</h3>
      <p className={styles.description}>{project.description}</p>
      
      <div className={styles.footer}>
        <div className={styles.meta}>
          <Calendar size={14} />
          <span>{formattedDate || '...'}</span>
        </div>
        <Link to={`/projects/${project.id}`} className={styles.viewLink}>
          View Details
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
