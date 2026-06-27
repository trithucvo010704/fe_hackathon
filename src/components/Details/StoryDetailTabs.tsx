'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Files, 
  Plus, 
  Loader2,
  Trash2,
  Upload,
  Download,
  X,
  Search,
  CheckCircle2,
  MessageSquare,
  MessageCircle,
  Copy
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Story, ProjectDocument, ProjectTask, ReviewRequest, ReviewComment } from '@/lib/types';
import { documentService } from '@/lib/services/document.service';
import { storyService } from '@/lib/services/story.service';
import { taskService } from '@/lib/services/task.service';
import { reviewRequestService } from '@/lib/services/review-request.service';
import { reviewCommentService } from '@/lib/services/review-comment.service';
import { toast } from '@/lib/toast';
import styles from '@/pages/projects/[id]/details.module.css';
import { useProject } from '@/pages/projects/[id]/context/ProjectContext';

import MermaidViewer from '@/components/Common/MermaidViewer';

// Custom renderer components for ReactMarkdown to render Mermaid diagrams
const markdownComponents = {
  code({ className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const codeContent = String(children).replace(/\n$/, '');
    const isMermaid = match && match[1] === 'mermaid';
    
    if (isMermaid) {
      return <MermaidViewer chart={codeContent} />;
    }
    return <code className={className} {...props}>{children}</code>;
  }
};

interface StoryDetailTabsProps {
  story: Story;
  projectId: string;
  onUpdate: (updatedStory: Story) => void;
}

type TabType = 'detail' | 'tasks' | 'documents' | 'reviews' | 'review-comments';

export default function StoryDetailTabs({ story, projectId, onUpdate }: StoryDetailTabsProps) {
  const { showConfirm, epics } = useProject();
  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [activeDocument, setActiveDocument] = useState<ProjectDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [reviewComments, setReviewComments] = useState<ReviewComment[]>([]);
  const [activeCommentDetail, setActiveCommentDetail] = useState<ReviewComment | null>(null);

  // Send Review Request State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewer, setReviewer] = useState('MATTIN');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const REVIEWERS = ['LINA', 'MATTIN', 'DAVID', 'BOB', 'ROBIN', 'SARAH', 'KEVIN', 'LUX', 'ZORO', 'LEADER'];
  
  // Detail Form State
  const [editStory, setEditStory] = useState<Story>(story);
  const [isSaving, setIsSaving] = useState(false);

  const [copied, setCopied] = useState(false);
  const handleCopyComment = (text: string) => {
    navigator.clipboard.writeText(text || '');
    toast.success('Đã sao chép nội dung comment!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setEditStory(story);
    if (activeTab === 'documents') fetchDocuments();
    if (activeTab === 'tasks') fetchTasks();
    if (activeTab === 'reviews') fetchReviewRequests();
    if (activeTab === 'review-comments') fetchReviewComments();
  }, [story, activeTab]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await documentService.getDocuments('STORY', story.id);
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

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getTasksByStory(story.id);
      setTasks(data || []);
    } catch (error) {
      toast.error('Không thể tải danh sách Task');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviewRequests = async () => {
    setIsLoading(true);
    try {
      const data = await reviewRequestService.getReviewRequestsByStory(story.key);
      const sortedData = (data || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReviewRequests(sortedData);
    } catch (error) {
      toast.error('Không thể tải Review Requests');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviewComments = async () => {
    setIsLoading(true);
    try {
      const data = await reviewCommentService.getReviewCommentsByStory(story.key);
      const sortedData = (data || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReviewComments(sortedData);
    } catch (error) {
      toast.error('Không thể tải Review Comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReviewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await reviewRequestService.createReviewRequest({
        refKey: story.key,
        refType: 'STORY',
        reviewer
      });
      toast.success('Gửi yêu cầu review thành công!');
      setIsReviewModalOpen(false);
      fetchReviewRequests();
    } catch (error: any) {
      toast.error(error.message || 'Gửi yêu cầu review thất bại');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReviewRequest = (id: string) => {
    showConfirm({
      title: 'Xóa yêu cầu review',
      message: 'Bạn có chắc chắn muốn xóa yêu cầu review này không?',
      type: 'danger',
      onConfirm: async () => {
        try {
          await reviewRequestService.deleteReviewRequest(id);
          toast.success('Xóa yêu cầu review thành công!');
          fetchReviewRequests();
        } catch (error: any) {
          toast.error(error.message || 'Xóa yêu cầu review thất bại');
        }
      }
    });
  };

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await storyService.updateStory(story.id, editStory);
      toast.success('Cập nhật Story thành công');
      onUpdate(updated);
    } catch (error) {
      toast.error('Cập nhật thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          className={`${styles.tabItem} ${activeTab === 'tasks' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckCircle2 size={16} />
          Tasks
        </button>
        <button 
          className={`${styles.tabItem} ${activeTab === 'documents' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <Files size={16} />
          Tài liệu
        </button>
        <button 
          className={`${styles.tabItem} ${activeTab === 'reviews' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <MessageSquare size={16} />
          Review Requests
        </button>
        <button 
          className={`${styles.tabItem} ${activeTab === 'review-comments' ? styles.tabItemActive : ''}`}
          onClick={() => setActiveTab('review-comments')}
        >
          <MessageCircle size={16} />
          Review Comments
        </button>
      </div>

      <div className={styles.tabsContent}>
        {activeTab === 'detail' && (
          <form onSubmit={handleUpdateStory} className={styles.detailForm}>
            <div className={styles.formGroup}>
              <label>Tiêu đề Story</label>
              <input 
                type="text" 
                value={editStory.title} 
                onChange={e => setEditStory({...editStory, title: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Trạng thái</label>
                <select 
                  value={editStory.status} 
                  onChange={e => setEditStory({...editStory, status: e.target.value as any})}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Độ ưu tiên</label>
                <select 
                  value={editStory.priority} 
                  onChange={e => setEditStory({...editStory, priority: e.target.value as any})}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Epic</label>
                <select 
                  value={editStory.epicId || ''} 
                  onChange={e => setEditStory({...editStory, epicId: e.target.value})}
                >
                  <option value="">Không thuộc Epic</option>
                  {epics.map(epic => (
                    <option key={epic.id} value={epic.id}>{epic.title}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Hạn chót</label>
                <input 
                  type="date" 
                  value={editStory.deadline ? new Date(editStory.deadline).toISOString().split('T')[0] : ''} 
                  onChange={e => setEditStory({...editStory, deadline: e.target.value})}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Mô tả</label>
              <textarea 
                rows={8} 
                value={editStory.description || ''} 
                onChange={e => setEditStory({...editStory, description: e.target.value})}
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} disabled={isSaving}>
                {isSaving ? <Loader2 size={16} className={styles.spin} /> : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'tasks' && (
          <div className={styles.taskList}>
            {isLoading ? (
              <div className={styles.loadingState}><Loader2 size={24} className={styles.spin} /></div>
            ) : tasks.length === 0 ? (
              <div className={styles.emptyState}>Chưa có Task nào trong Story này</div>
            ) : (
              tasks.map(t => (
                <div key={t.id} className={styles.taskItem} style={{ padding: '12px' }}>
                  <div className={styles.taskItemHeader}>
                    <div className={styles.taskKey}>{t.key}</div>
                    <div className={`${styles.statusBadge} ${styles[t.status.toLowerCase()]}`}>{t.status}</div>
                  </div>
                  <div className={styles.taskTitle} style={{ fontSize: '14px', marginTop: '4px' }}>{t.title}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className={styles.docContainer} style={{ marginTop: 0, height: '80vh', minHeight: 'auto' }}>
            <div className={styles.docSidebar} style={{ width: '35%' }}>
              <div className={styles.tabActions} style={{ marginBottom: '12px' }}>
                <button className={styles.uploadBtnMini} onClick={() => document.getElementById('story-file-upload')?.click()}>
                  <Plus size={14} /> Tải lên
                </button>
                <input 
                  id="story-file-upload"
                  type="file" 
                  multiple 
                  hidden 
                  onChange={async (e) => {
                    if (e.target.files) {
                      try {
                        setIsLoading(true);
                        const newDocs = await documentService.uploadDocuments('STORY', story.id, Array.from(e.target.files));
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
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
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

        {activeTab === 'reviews' && (
          <div className={styles.taskList} style={{ padding: '16px' }}>
            {story.status !== 'DONE' && (
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className={styles.submitBtn}
                  style={{ width: 'auto', minWidth: 'auto', padding: '8px 16px' }}
                  onClick={() => setIsReviewModalOpen(true)}
                  disabled={reviewRequests.some(r => r.status === 'PENDING')}
                >
                  {reviewRequests.some(r => r.status === 'PENDING') ? 'Đã có yêu cầu review PENDING' : 'Gửi review request'}
                </button>
              </div>
            )}
            {isLoading ? (
              <div className={styles.loadingState} style={{ padding: '40px' }}><Loader2 size={24} className={styles.spin} /></div>
            ) : reviewRequests.length === 0 ? (
              <div className={styles.emptyState} style={{ padding: '40px' }}>Chưa có yêu cầu review nào cho Story này</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '500' }}>Key</th>
                    <th style={{ padding: '12px 16px', fontWeight: '500' }}>Trạng thái</th>
                    <th style={{ padding: '12px 16px', fontWeight: '500' }}>Người tạo (Requester)</th>
                    <th style={{ padding: '12px 16px', fontWeight: '500' }}>Người review</th>
                    <th style={{ padding: '12px 16px', fontWeight: '500' }}>Ngày tạo</th>
                    <th style={{ padding: '12px 16px', fontWeight: '500' }}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewRequests.map(rr => {
                    let statusColor = 'var(--text-secondary)';
                    let statusBg = 'transparent';
                    if (rr.status === 'APPROVED') {
                      statusColor = '#10b981'; // green
                      statusBg = '#d1fae5';
                    } else if (rr.status === 'REJECTED') {
                      statusColor = '#ef4444'; // red
                      statusBg = '#fee2e2';
                    } else if (rr.status === 'PENDING') {
                      statusColor = '#6b7280'; // gray
                      statusBg = '#f3f4f6';
                    }

                    return (
                      <tr key={rr.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '500' }}>{rr.key}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '12px', 
                            fontWeight: '500',
                            backgroundColor: statusBg,
                            color: statusColor
                          }}>
                            {rr.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>{rr.requester}</td>
                        <td style={{ padding: '12px 16px' }}>{rr.reviewer}</td>
                        <td style={{ padding: '12px 16px' }}>{new Date(rr.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {rr.status === 'PENDING' && (
                              <button
                                onClick={() => handleDeleteReviewRequest(rr.id)}
                                style={{
                                  border: '1px solid #ef4444',
                                  background: 'transparent',
                                  color: '#ef4444',
                                  padding: '4px 12px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                Xóa
                              </button>
                            )}
                            {rr.comment ? (
                              <button 
                                onClick={() => setSelectedComment(rr.comment)}
                                style={{ 
                                  background: 'none', 
                                  border: '1px solid var(--border)', 
                                  padding: '4px 8px', 
                                  borderRadius: '4px', 
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  color: 'var(--primary)'
                                }}
                              >
                                Xem
                              </button>
                            ) : (
                              <span style={{ color: 'var(--text-secondary)' }}>-</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeTab === 'review-comments' && (
          <div className={styles.specSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Review Comments</h3>
            </div>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Loader2 className={styles.spin} size={32} />
              </div>
            ) : reviewComments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                Chưa có review comment nào
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Mã</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Tiêu đề</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Trạng thái</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Reviewer</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Ngày tạo</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewComments.map(rc => {
                    let statusBg = 'rgba(156, 163, 175, 0.1)';
                    let statusColor = '#9ca3af';
                    if (rc.status === 'APPROVED') {
                      statusBg = 'rgba(16, 185, 129, 0.1)';
                      statusColor = '#10b981';
                    } else if (rc.status === 'REJECTED') {
                      statusBg = 'rgba(239, 68, 68, 0.1)';
                      statusColor = '#ef4444';
                    }
                    return (
                      <tr key={rc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '500' }}>{rc.key}</td>
                        <td style={{ padding: '12px 16px' }}>{rc.title}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '12px', 
                            fontWeight: '500',
                            backgroundColor: statusBg,
                            color: statusColor
                          }}>
                            {rc.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>{rc.reviewer}</td>
                        <td style={{ padding: '12px 16px' }}>{new Date(rc.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button 
                            onClick={() => setActiveCommentDetail(rc)}
                            style={{ 
                              background: 'none', 
                              border: '1px solid var(--border)', 
                              padding: '4px 12px', 
                              borderRadius: '4px', 
                              fontSize: '12px',
                              cursor: 'pointer',
                              color: 'var(--primary)'
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {isReviewModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--surface)',
            padding: '24px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '500px',
            position: 'relative',
            border: '1px solid var(--border)'
          }}>
            <button 
              onClick={() => setIsReviewModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Gửi Yêu Cầu Review</h3>
            <form onSubmit={handleSubmitReviewRequest}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Reviewer <span style={{ color: 'red' }}>*</span></label>
                <select 
                  value={reviewer} 
                  onChange={e => setReviewer(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)'
                  }}
                  required
                >
                  {REVIEWERS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsReviewModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingReview}
                  className={styles.submitBtn}
                  style={{
                    width: 'auto',
                    minWidth: 'auto',
                    padding: '8px 20px'
                  }}
                >
                  {isSubmittingReview ? <Loader2 size={16} className={styles.spin} /> : 'Gửi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedComment && (
        <div className={`${styles.slideOverOverlay} ${styles.open}`} style={{ zIndex: 1010 }} onClick={() => setSelectedComment(null)}>
          <div className={styles.slideOverPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.slideOverHeader}>
              <div className={styles.slideOverHeaderLeft}>
                <MessageSquare size={16} />
                <span>Comment</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => handleCopyComment(selectedComment)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(var(--primary-rgb), 0.1)'
                  }}
                  title="Sao chép nội dung comment"
                >
                  <Copy size={15} />
                  <span>Sao chép</span>
                </button>
                <button className={styles.closeBtn} onClick={() => setSelectedComment(null)}>
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className={styles.slideOverContent}>
              <div className={styles.markdownView} style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {selectedComment}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeCommentDetail && (
        <div className={`${styles.slideOverOverlay} ${styles.open}`} style={{ zIndex: 1010 }} onClick={() => setActiveCommentDetail(null)}>
          <div className={styles.slideOverPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.slideOverHeader}>
              <div className={styles.slideOverHeaderLeft}>
                <MessageCircle size={16} />
                <span style={{ fontSize: '15px', fontWeight: '600' }}>{activeCommentDetail.key}: {activeCommentDetail.title}</span>
                <span style={{ 
                  marginLeft: '8px',
                  padding: '2px 8px', 
                  borderRadius: '4px', 
                  fontSize: '11px', 
                  fontWeight: '600',
                  backgroundColor: activeCommentDetail.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : activeCommentDetail.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                  color: activeCommentDetail.status === 'APPROVED' ? '#10b981' : activeCommentDetail.status === 'REJECTED' ? '#ef4444' : '#9ca3af'
                }}>
                  {activeCommentDetail.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => handleCopyComment(activeCommentDetail.comment)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(var(--primary-rgb), 0.1)'
                  }}
                  title="Sao chép nội dung comment"
                >
                  <Copy size={15} />
                  <span>Sao chép</span>
                </button>
                <button className={styles.closeBtn} onClick={() => setActiveCommentDetail(null)}>
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className={styles.slideOverContent}>
              <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <span><strong>Reviewer:</strong> {activeCommentDetail.reviewer}</span>
                <span><strong>Ngày tạo:</strong> {new Date(activeCommentDetail.createdAt).toLocaleString()}</span>
              </div>
              <div className={styles.markdownView} style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {activeCommentDetail.comment}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
