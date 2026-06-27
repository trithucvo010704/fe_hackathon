'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Files, 
  History, 
  Plus, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  User,
  Calendar,
  ChevronRight,
  Loader2,
  Trash2,
  Upload,
  Download,
  X,
  Search
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProjectTask, WorkLog, ProjectDocument, Story, User as UserType } from '@/lib/types';
import { worklogService } from '@/lib/services/worklog.service';
import { documentService } from '@/lib/services/document.service';
import { taskService } from '@/lib/services/task.service';
import { toast } from '@/lib/toast';
import styles from '@/pages/projects/[id]/details.module.css';
import { useProject } from '@/pages/projects/[id]/context/ProjectContext';

interface TaskDetailTabsProps {
  task: ProjectTask;
  projectId: string;
  onUpdate: (updatedTask: ProjectTask) => void;
}

type TabType = 'detail' | 'documents' | 'worklog';

export default function TaskDetailTabs({ task, projectId, onUpdate }: TaskDetailTabsProps) {
  const { showConfirm } = useProject();
  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [worklogs, setWorklogs] = useState<WorkLog[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<ProjectDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Detail Form State
  const [editTask, setEditTask] = useState<ProjectTask>(task);
  const [isSaving, setIsSaving] = useState(false);

  // Worklog Form State
  const [showWorklogForm, setShowWorklogForm] = useState(false);
  const [newWorklog, setNewWorklog] = useState({
    timeSpentHours: 0,
    progressPercent: 0,
    comment: '',
    resolved: false
  });

  useEffect(() => {
    setEditTask(task);
  }, [task]);

  useEffect(() => {
    if (activeTab === 'worklog') {
      fetchWorklogs();
    } else if (activeTab === 'documents') {
      fetchDocuments();
    }
  }, [activeTab, task.id]);

  const fetchWorklogs = async () => {
    setIsLoading(true);
    try {
      const data = await worklogService.getTaskWorkLogs(task.id);
      setWorklogs(data || []);
    } catch (error) {
      toast.error('Không thể tải worklogs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await documentService.getDocuments('TASK', task.id);
      setDocuments(data || []);
      if (data && data.length > 0 && !activeDocument) {
        setActiveDocument(data[0]);
      }
    } catch (error) {
      toast.error('Không thể tải tài liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    (doc.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await taskService.updateTask(task.id, {
        title: editTask.title,
        description: editTask.description,
        status: editTask.status,
        priority: editTask.priority,
        storyPoint: editTask.storyPoint,
        deadline: editTask.deadline,
        category: editTask.category,
        assigneeId: editTask.assigneeId
      });
      onUpdate(updated);
      toast.success('Đã cập nhật công việc');
    } catch (error) {
      toast.error('Cập nhật thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddWorklog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await worklogService.createWorkLog({
        taskId: task.id,
        storyId: task.storyId,
        timeSpentHours: newWorklog.timeSpentHours,
        progressPercent: newWorklog.progressPercent,
        comment: newWorklog.comment,
        resolved: newWorklog.resolved
      });
      setWorklogs([created, ...worklogs]);
      setShowWorklogForm(false);
      setNewWorklog({ timeSpentHours: 0, progressPercent: 0, comment: '', resolved: false });
      toast.success('Đã thêm worklog');
    } catch (error) {
      toast.error('Thêm worklog thất bại');
    }
  };

  return (
    <div className={styles.taskDetailTabs}>
      <div className={styles.tabsHeader}>
        <button 
          className={`${styles.tabItem} ${activeTab === 'detail' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('detail')}
        >
          <FileText size={16} />
          Chi tiết
        </button>
        <button 
          className={`${styles.tabItem} ${activeTab === 'documents' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <Files size={16} />
          Tài liệu
        </button>
        <button 
          className={`${styles.tabItem} ${activeTab === 'worklog' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('worklog')}
        >
          <History size={16} />
          Worklog
        </button>
      </div>

      <div className={styles.tabsContent}>
        {activeTab === 'detail' && (
          <form onSubmit={handleUpdateTask} className={styles.detailForm}>
            <div className={styles.formGroup}>
              <label>Tiêu đề</label>
              <input 
                type="text" 
                value={editTask.title} 
                onChange={e => setEditTask({...editTask, title: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Trạng thái</label>
                <select 
                  value={editTask.status} 
                  onChange={e => setEditTask({...editTask, status: e.target.value as any})}
                >
                  <option value="BACKLOG">Backlog</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="NEED_FIX">Need Fix</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Độ ưu tiên</label>
                <select 
                  value={editTask.priority} 
                  onChange={e => setEditTask({...editTask, priority: e.target.value as any})}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Story Point</label>
                <input 
                  type="number" 
                  value={editTask.storyPoint || 0} 
                  onChange={e => setEditTask({...editTask, storyPoint: parseInt(e.target.value)})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Hạn chót</label>
                <input 
                  type="date" 
                  value={editTask.deadline ? new Date(editTask.deadline).toISOString().split('T')[0] : ''} 
                  onChange={e => setEditTask({...editTask, deadline: e.target.value})}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Mô tả</label>
              <textarea 
                rows={5} 
                value={editTask.description || ''} 
                onChange={e => setEditTask({...editTask, description: e.target.value})}
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} disabled={isSaving}>
                {isSaving ? <Loader2 size={16} className={styles.spin} /> : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'documents' && (
          <div className={styles.docContainer} style={{ marginTop: 0, height: '80vh', minHeight: 'auto' }}>
            {/* Sidebar */}
            <div className={styles.docSidebar} style={{ width: '35%' }}>
              <div className={styles.tabActions} style={{ marginBottom: '12px' }}>
                <button className={styles.uploadBtnMini} onClick={() => document.getElementById('task-file-upload')?.click()}>
                  <Plus size={14} /> Tải lên
                </button>
                <input 
                  id="task-file-upload"
                  type="file" 
                  multiple 
                  hidden 
                  onChange={async (e) => {
                    if (e.target.files) {
                      try {
                        setIsLoading(true);
                        const newDocs = await documentService.uploadDocuments('TASK', task.id, Array.from(e.target.files));
                        setDocuments(prev => [...newDocs, ...prev]);
                        if (newDocs.length > 0) setActiveDocument(newDocs[0]);
                        toast.success('Đã tải lên tài liệu');
                      } catch (err) {
                        toast.error('Tải lên thất bại');
                      } finally {
                        setIsLoading(false);
                      }
                    }
                  }}
                />
              </div>

              <div className={styles.searchWrapper} style={{ marginBottom: '12px', maxWidth: '100%' }}>
                <div className={styles.searchIcon} style={{ left: '10px' }}>
                  <Search size={14} />
                </div>
                <input 
                  type="text" 
                  placeholder="Tìm tài liệu..." 
                  className={styles.searchInput}
                  style={{ padding: '8px 8px 8px 32px', fontSize: '13px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className={styles.docList} style={{ gap: '8px' }}>
                {isLoading && documents.length === 0 ? (
                  <div className={styles.loadingState} style={{ padding: '20px' }}>
                    <Loader2 size={20} className={styles.spin} />
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className={styles.emptyState} style={{ padding: '20px' }}>Chưa có tài liệu</div>
                ) : (
                  filteredDocuments.map(doc => (
                    <div 
                      key={doc.id} 
                      className={`${styles.docListItem} ${activeDocument?.id === doc.id ? styles.docListItemActive : ''}`}
                      onClick={() => setActiveDocument(doc)}
                      style={{ padding: '10px', gap: '10px' }}
                    >
                      <div className={styles.docItemIcon} style={{ width: '32px', height: '32px' }}>
                        <FileText size={16} />
                      </div>
                      <div className={styles.docItemInfo}>
                        <div className={styles.docItemName} style={{ fontSize: '13px' }}>{doc.name}</div>
                        <div className={styles.docItemMeta} style={{ fontSize: '11px' }}>
                          {new Date(doc.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button 
                        className={styles.iconBtn} 
                        style={{ color: '#ef4444', width: '28px', height: '28px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          showConfirm({
                            title: 'Xóa tài liệu',
                            message: `Bạn có chắc chắn muốn xóa tài liệu "${doc.name}"?`,
                            type: 'danger',
                            onConfirm: async () => {
                              try {
                                await documentService.deleteDocument(doc.id);
                                setDocuments(documents.filter(d => d.id !== doc.id));
                                if (activeDocument?.id === doc.id) setActiveDocument(null);
                                toast.success('Đã xóa tài liệu');
                              } catch (err) {
                                toast.error('Xóa thất bại');
                              }
                            }
                          });
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Preview Main */}
            <div className={styles.docMain}>
              {activeDocument ? (
                <>
                  <div className={styles.docPreviewHeader} style={{ padding: '10px 16px' }}>
                    <div className={styles.docPreviewTitle} style={{ fontSize: '13px' }}>
                      {activeDocument.name}
                    </div>
                    <button 
                      className={styles.iconBtn}
                      onClick={() => {
                        const blob = new Blob([activeDocument.content], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = activeDocument.name;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                  <div className={styles.docPreviewContent} style={{ padding: '16px' }}>
                    <div className={styles.markdownView} style={{ fontSize: '14px' }}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {activeDocument.content || ''}
                      </ReactMarkdown>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.emptyState}>
                  <FileText size={40} style={{ opacity: 0.1, marginBottom: '12px' }} />
                  <p>Chọn tài liệu để xem</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'worklog' && (
          <div className={styles.taskWorklogs}>
            <div className={styles.tabActions}>
              <button className={styles.addBtnMini} onClick={() => setShowWorklogForm(!showWorklogForm)}>
                <Plus size={14} /> Thêm log
              </button>
            </div>

            {showWorklogForm && (
              <form onSubmit={handleAddWorklog} className={styles.worklogForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Thời gian (giờ)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={newWorklog.timeSpentHours}
                      onChange={e => setNewWorklog({...newWorklog, timeSpentHours: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tiến độ (%)</label>
                    <input 
                      type="number" 
                      value={newWorklog.progressPercent}
                      onChange={e => setNewWorklog({...newWorklog, progressPercent: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Ghi chú</label>
                  <textarea 
                    rows={2}
                    value={newWorklog.comment}
                    onChange={e => setNewWorklog({...newWorklog, comment: e.target.value})}
                    placeholder="Bạn đã làm được gì?"
                    required
                  />
                </div>
                <div className={styles.formActions}>
                  <button type="button" onClick={() => setShowWorklogForm(false)} className={styles.cancelBtn}>Hủy</button>
                  <button type="submit" className={styles.submitBtn}>Ghi nhận</button>
                </div>
              </form>
            )}

            {isLoading ? (
              <div className={styles.loadingState}><Loader2 size={24} className={styles.spin} /></div>
            ) : worklogs.length === 0 ? (
              <div className={styles.emptyState}>Chưa có ghi nhận thời gian nào</div>
            ) : (
              <div className={styles.worklogList}>
                {worklogs.map(log => (
                  <div key={log.id} className={styles.worklogItem}>
                    <div className={styles.worklogHeader}>
                      <div className={styles.worklogUser}>
                        <div className={styles.miniAvatar}>{log.username.charAt(0)}</div>
                        <span>{log.username}</span>
                      </div>
                      <div className={styles.worklogTime}>
                        <Clock size={14} />
                        <span>{log.timeSpentHours}h</span>
                        <div className={styles.progressBadge}>{log.progressPercent}%</div>
                      </div>
                    </div>
                    <p className={styles.worklogComment}>{log.comment}</p>
                    <div className={styles.worklogDate}>
                      {new Date(log.loggingAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
