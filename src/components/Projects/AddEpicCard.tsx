import React from 'react';
import { Plus } from 'lucide-react';
import styles from './AddEpicCard.module.css';

interface AddEpicCardProps {
  onClick: () => void;
}

const AddEpicCard: React.FC<AddEpicCardProps> = ({ onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.iconWrapper}>
        <Plus size={32} />
      </div>
      <h3 className={styles.title}>Thêm Epic Mới</h3>
      <p className={styles.subtitle}>Bắt đầu một cụm tính năng mới</p>
    </div>
  );
};

export default AddEpicCard;
