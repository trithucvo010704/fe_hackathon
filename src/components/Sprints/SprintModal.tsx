'use client';

import React, { useState } from 'react';
import { X, Loader2, Calendar } from 'lucide-react';
import { Sprint, CreateSprintInput } from '@/lib/types';
import { sprintService } from '@/lib/services/sprint.service';
import { toast } from '@/lib/toast';
import styles from './SprintModal.module.css';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onSprintCreated: (sprint: Sprint) => void;
}

export default function SprintModal({ 
  isOpen, 
  onClose, 
  projectId, 
  onSprintCreated 
}: SprintModalProps) {
  // Default dates: start today, end in 2 weeks
  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const [formData, setFormData] = useState<CreateSprintInput>({
    projectId,
    name: '',
    startDate: formatDate(today),
    endDate: formatDate(twoWeeksLater),
    goal: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Vui lòng nhập tên Sprint');
      return;
    }

    setIsSubmitting(true);
    try {
      const newSprint = await sprintService.createSprint(formData);
      toast.success('Đã tạo Sprint thành công');
      onSprintCreated(newSprint);
      onClose();
      setFormData({
        projectId,
        name: '',
        startDate: formatDate(today),
        endDate: formatDate(twoWeeksLater),
        goal: ''
      });
    } catch (error) {
      console.error('Failed to create sprint:', error);
      toast.error('Tạo Sprint thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Tạo mới Sprint</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Tên Sprint</label>
            <input 
              type="text" 
              placeholder="Ví dụ: Sprint 1, Sprint Alpha..." 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Ngày bắt đầu</label>
              <div className={styles.inputWithIcon}>
                <Calendar size={16} className={styles.inputIcon} />
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Ngày kết thúc</label>
              <div className={styles.inputWithIcon}>
                <Calendar size={16} className={styles.inputIcon} />
                <input 
                  type="date" 
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Mục tiêu Sprint (Tùy chọn)</label>
            <textarea 
              placeholder="Nhập mục tiêu cho sprint này..." 
              rows={3}
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Hủy
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={18} className={styles.spin} /> : 'Tạo Sprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
