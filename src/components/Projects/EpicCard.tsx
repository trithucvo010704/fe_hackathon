import React from 'react';
import { MoreHorizontal, List, Users } from 'lucide-react';
import styles from './EpicCard.module.css';

interface EpicCardProps {
  id: string;
  epicKey?: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  storiesCount: number;
  points: number;
  createdBy?: string;
  onClick?: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const EpicCard: React.FC<EpicCardProps> = ({ 
  id,
  epicKey,
  name, 
  description, 
  status, 
  progress, 
  storiesCount, 
  points,
  createdBy,
  onClick,
  onEdit,
  onDelete
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'IN_PROGRESS': return styles.statusInProgress;
      case 'COMPLETED': return styles.statusCompleted;
      case 'PENDING': return styles.statusPending;
      default: return styles.statusDefault;
    }
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardHeader}>
        <span className={`${styles.statusBadge} ${getStatusClass(status)}`}>
          {status.replace('_', ' ')}
        </span>
        <div className={styles.menuContainer}>
          <button 
            className={styles.menuBtn} 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          >
            <MoreHorizontal size={18} />
          </button>
          {showMenu && (
            <div className={styles.dropdownMenu}>
              <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit?.(e); }}>Edit</button>
              <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete?.(e); }} className={styles.deleteAction}>Delete</button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          {epicKey && <span style={{ fontWeight: 600, marginRight: '8px', color: 'var(--primary)' }}>{epicKey}</span>}
          {createdBy && <span>Tạo bởi: {createdBy}</span>}
        </div>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            <span>Tiến độ hoàn thành</span>
            <span>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.stats}>
          <List size={14} />
          <span>{storiesCount} stories • {points} points</span>
        </div>
        <div className={styles.avatars}>
          <div className={styles.avatarMini}>JD</div>
          <div className={styles.avatarMini}>BA</div>
        </div>
      </div>
    </div>
  );
};

export default EpicCard;
