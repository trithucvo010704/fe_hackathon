'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Book, Bug, CheckSquare, Code, Server, Laptop, Smartphone, Palette, FileText, HelpCircle } from 'lucide-react';
import { ProjectTask, CreateTaskInput, User } from '@/lib/types';
import { taskService } from '@/lib/services/task.service';
import { userService } from '@/lib/services/user.service';
import { toast } from '@/lib/toast';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  sprintId?: string;
  storyId?: string;
  onTaskCreated: (task: ProjectTask) => void;
}

const CATEGORIES = [
  { id: 'API', name: 'API', icon: <Server size={16} color="#3b82f6" /> },
  { id: 'SERVICE', name: 'Service', icon: <Code size={16} color="#8b5cf6" /> },
  { id: 'FUNCTION', name: 'Function', icon: <Code size={16} color="#10b981" /> },
  { id: 'FE', name: 'Frontend', icon: <Laptop size={16} color="#f59e0b" /> },
  { id: 'MOBILE', name: 'Mobile', icon: <Smartphone size={16} color="#ec4899" /> },
  { id: 'DESIGN', name: 'Design', icon: <Palette size={16} color="#ef4444" /> },
  { id: 'DOC', name: 'Document', icon: <FileText size={16} color="#64748b" /> },
  { id: 'UNKNOWN', name: 'Unknown', icon: <HelpCircle size={16} color="#94a3b8" /> },
];

const PRIORITIES = [
  { id: 'LOW', name: 'Low' },
  { id: 'MEDIUM', name: 'Medium' },
  { id: 'HIGH', name: 'High' },
];

export default function TaskModal({ 
  isOpen, 
  onClose, 
  projectId, 
  sprintId, 
  storyId,
  onTaskCreated 
}: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<CreateTaskInput>>({
    projectId,
    storyId,
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'API',
    status: 'BACKLOG',
    storyPoint: 0,
    assigneeId: ''
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const data = await userService.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Vui lòng nhập tiêu đề task');
      return;
    }

    const payload = { ...formData };
    if (!payload.assigneeId) delete payload.assigneeId;
    if (!payload.storyId) delete payload.storyId;

    setIsSubmitting(true);
    try {
      const newTask = await taskService.createTask(payload as CreateTaskInput);
      
      // If sprintId is provided, move the task to that sprint
      if (sprintId) {
        await taskService.moveToSprint(newTask.id, sprintId);
      }
      
      toast.success('Đã tạo task thành công');
      onTaskCreated(newTask);
      onClose();
      setFormData({
        projectId,
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: 'API',
        status: 'BACKLOG',
        storyPoint: 0,
        assigneeId: ''
      });
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Tạo task thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Tạo mới Task</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Loại Task (Category)</label>
            <div className={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.categoryOption} ${formData.category === cat.id ? styles.active : ''}`}
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Tiêu đề</label>
            <input 
              type="text" 
              placeholder="Nhập tiêu đề task..." 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mô tả</label>
            <textarea 
              placeholder="Mô tả chi tiết công việc..." 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Độ ưu tiên</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {PRIORITIES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Story Points</label>
              <input 
                type="number" 
                min="0"
                value={formData.storyPoint}
                onChange={(e) => setFormData({ ...formData, storyPoint: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Người thực hiện</label>
            <select 
              value={formData.assigneeId}
              onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              disabled={isLoadingUsers}
            >
              <option value="">Chưa gán</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.username})</option>
              ))}
            </select>
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
              {isSubmitting ? <Loader2 size={18} className={styles.spin} /> : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
