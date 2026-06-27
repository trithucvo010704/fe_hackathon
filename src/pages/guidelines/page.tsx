'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import { guidelineService } from '@/lib/services/guideline.service';
import { GuidelineDoc, CreateGuidelineInput } from '@/lib/types';
import { 
  Plus, Search, Edit2, Trash2, BookOpen, Calendar, 
  User as UserIcon, Upload, FileUp, X as CloseIcon, 
  Folder, FolderOpen, FileText, ChevronDown, ChevronRight 
} from 'lucide-react';
import styles from './guidelines.module.css';
import { toast } from '@/lib/toast';
import { useConfirm } from '@/components/Modal/ConfirmContext';
import Modal from '@/components/Modal/Modal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function GuidelinesPage() {
  const { confirm } = useConfirm();
  const [guidelines, setGuidelines] = useState<GuidelineDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  
  // Tree states
  const [collapsedLevels, setCollapsedLevels] = useState<Record<string, boolean>>({});
  const [selectedGuideline, setSelectedGuideline] = useState<GuidelineDoc | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState<GuidelineDoc | null>(null);
  const [formData, setFormData] = useState<CreateGuidelineInput>({
    level: 'PROJECT',
    name: '',
    description: '',
    content: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Upload state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadLevel, setUploadLevel] = useState('PROJECT');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      setIsLoading(true);
      const data = await guidelineService.getGuidelines();
      setGuidelines(data);
      if (data && data.length > 0) {
        setSelectedGuideline(data[0]);
      }
    } catch (err) {
      toast.error('Failed to load guidelines');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingGuideline(null);
    setFormData({
      level: 'PROJECT',
      name: '',
      description: '',
      content: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guideline: GuidelineDoc) => {
    setEditingGuideline(guideline);
    setFormData({
      level: guideline.level,
      name: guideline.name,
      description: guideline.description,
      content: guideline.content
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Xóa tài liệu hướng dẫn',
      message: 'Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác.',
      confirmLabel: 'Xóa',
      cancelLabel: 'Hủy',
      type: 'danger'
    });

    if (isConfirmed) {
      try {
        await guidelineService.deleteGuideline(id);
        setGuidelines(prev => prev.filter(g => g.id !== id));
        toast.success('Xóa tài liệu hướng dẫn thành công');
        if (selectedGuideline?.id === id) {
          setSelectedGuideline(null);
        }
      } catch (err) {
        toast.error('Không thể xóa tài liệu hướng dẫn');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      toast.error('Vui lòng nhập tên và nội dung');
      return;
    }

    try {
      setIsSaving(true);
      if (editingGuideline) {
        const updated = await guidelineService.updateGuideline(editingGuideline.id, formData);
        setGuidelines(prev => prev.map(g => g.id === editingGuideline.id ? updated : g));
        toast.success('Cập nhật tài liệu thành công');
        if (selectedGuideline?.id === editingGuideline.id) {
          setSelectedGuideline(updated);
        }
      } else {
        const created = await guidelineService.createGuideline(formData);
        setGuidelines(prev => [created, ...prev]);
        toast.success('Tạo tài liệu hướng dẫn thành công');
        setSelectedGuideline(created);
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(editingGuideline ? 'Không thể cập nhật tài liệu' : 'Không thể tạo tài liệu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0) {
      toast.error('Vui lòng chọn ít nhất một file');
      return;
    }

    try {
      setIsUploading(true);
      const created = await guidelineService.uploadGuidelines(uploadLevel, uploadFiles);
      setGuidelines(prev => [...created, ...prev]);
      toast.success(`Đã tải lên thành công ${created.length} tài liệu`);
      setIsUploadModalOpen(false);
      setUploadFiles([]);
      if (created.length > 0) {
        setSelectedGuideline(created[0]);
      }
    } catch (err) {
      toast.error('Không thể tải lên tài liệu');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const levels = ['ALL', ...Array.from(new Set(guidelines.map(g => g.level)))];

  const filteredGuidelines = guidelines.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'ALL' || g.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  // Group filtered guidelines by level
  const groupedGuidelines: Record<string, GuidelineDoc[]> = {};
  filteredGuidelines.forEach(g => {
    if (!groupedGuidelines[g.level]) {
      groupedGuidelines[g.level] = [];
    }
    groupedGuidelines[g.level].push(g);
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content" style={{ overflow: 'hidden' }}>
        <Header />
        <div className="content-area" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className={styles.pageHeader} style={{ marginBottom: '16px' }}>
            <div>
              <h1 className={styles.pageTitle}>Guidelines</h1>
              <p className={styles.pageSubtitle}>Quản lý các tài liệu hướng dẫn và quy chuẩn hệ thống.</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.bulkUploadBtn} onClick={() => setIsUploadModalOpen(true)}>
                <Upload size={18} />
                Tải lên nhiều
              </button>
              <button className={styles.createBtn} onClick={handleOpenAdd}>
                <Plus size={20} />
                Thêm Guideline
              </button>
            </div>
          </div>

          <div className={styles.toolbar} style={{ marginBottom: '16px' }}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên, mô tả..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={styles.filterContainer} style={{ marginBottom: 0 }}>
              <span className={styles.filterLabel}>Cấp độ:</span>
              {levels.map(level => (
                <button 
                  key={level} 
                  className={`${styles.chip} ${selectedLevel === level ? styles.active : ''}`}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="loading-screen" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="loader"></div>
            </div>
          ) : filteredGuidelines.length === 0 ? (
            <div className={styles.emptyState} style={{ margin: '40px auto', maxWidth: '500px' }}>
              <BookOpen size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
              <h3>Không tìm thấy guideline nào</h3>
              <p>{searchQuery ? 'Thử tìm kiếm với từ khóa khác.' : 'Bắt đầu bằng cách tạo tài liệu hướng dẫn đầu tiên.'}</p>
              {!searchQuery && (
                <button className={styles.createBtn} onClick={handleOpenAdd} style={{ margin: '0 auto' }}>
                  Thêm Guideline
                </button>
              )}
            </div>
          ) : (
            <div className={styles.twoColumnLayout}>
              {/* Column 1: Tree View */}
              <div className={styles.treeColumn}>
                <div className={styles.treeHeader}>
                  <FolderOpen size={16} />
                  <span>Danh mục Guideline</span>
                </div>
                <div className={styles.treeScroll}>
                  {Object.keys(groupedGuidelines).map(level => {
                    const isCollapsed = !!collapsedLevels[level];
                    const levelGuides = groupedGuidelines[level];
                    return (
                      <div key={level} className={styles.treeNodeLevel}>
                        <div 
                          className={styles.treeLevelHeader}
                          onClick={() => setCollapsedLevels(prev => ({ ...prev, [level]: !prev[level] }))}
                        >
                          {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                          {isCollapsed ? <Folder size={14} /> : <FolderOpen size={14} style={{ color: 'var(--primary)' }} />}
                          <span>{level} ({levelGuides.length})</span>
                        </div>
                        {!isCollapsed && (
                          <div className={styles.treeLevelContent}>
                            {levelGuides.map(g => (
                              <div 
                                key={g.id} 
                                className={`${styles.treeItem} ${selectedGuideline?.id === g.id ? styles.treeItemActive : ''}`}
                                onClick={() => setSelectedGuideline(g)}
                              >
                                <FileText size={14} />
                                <span>{g.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Column 2: Content Viewer */}
              <div className={styles.contentColumn}>
                {selectedGuideline ? (
                  <>
                    <div className={styles.viewerHeader}>
                      <div className={styles.viewerTitleArea}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <h2 className={styles.viewerTitle}>{selectedGuideline.name}</h2>
                          <span className={`${styles.levelBadge} ${selectedGuideline.level === 'GLOBAL' ? styles.levelGlobal : styles.levelProject}`}>
                            {selectedGuideline.level}
                          </span>
                        </div>
                        <div className={styles.viewerMeta}>
                          <div className={styles.viewerMetaItem}>
                            <UserIcon size={14} />
                            <span>Người tạo: {selectedGuideline.createdBy}</span>
                          </div>
                          <div className={styles.viewerMetaItem}>
                            <Calendar size={14} />
                            <span>Cập nhật: {new Date(selectedGuideline.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.actions}>
                        <button 
                          className={styles.actionBtn} 
                          onClick={() => handleOpenEdit(selectedGuideline)}
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                          onClick={() => handleDelete(selectedGuideline.id)}
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {selectedGuideline.description && (
                      <div className={styles.viewerDesc}>
                        {selectedGuideline.description}
                      </div>
                    )}
                    <div className={styles.viewerBody}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {selectedGuideline.content}
                      </ReactMarkdown>
                    </div>
                  </>
                ) : (
                  <div className={styles.emptyViewer}>
                    <BookOpen size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
                    <h3>Chọn một tài liệu</h3>
                    <p>Nhấp vào một guideline ở cây thư mục bên trái để xem nội dung.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingGuideline ? 'Chỉnh sửa Guideline' : 'Thêm Guideline Mới'}
        size="lg"
      >
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tên tài liệu</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Ví dụ: Quy chuẩn đặt tên"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Mô tả ngắn</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Mô tả tóm tắt nội dung hướng dẫn"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Cấp độ</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Ví dụ: PROJECT, GLOBAL, JAVA, FRONTEND..."
              value={formData.level}
              onChange={e => setFormData({...formData, level: e.target.value.toUpperCase()})}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nội dung (Markdown)</label>
            <textarea 
              className={`${styles.textarea} ${styles.contentEditor}`} 
              placeholder="Sử dụng Markdown để viết nội dung hướng dẫn..."
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              required
              style={{ minHeight: '350px' }}
            ></textarea>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
              Hủy
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : (editingGuideline ? 'Cập nhật' : 'Lưu tài liệu')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        title="Tải lên nhiều Guideline"
      >
        <form onSubmit={handleBulkUpload}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Cấp độ áp dụng</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Ví dụ: PROJECT, GLOBAL..."
              value={uploadLevel}
              onChange={e => setUploadLevel(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Chọn Files (.txt, .md, .docx)</label>
            <div className={styles.uploadZone} onClick={() => document.getElementById('bulk-file-input')?.click()}>
              <FileUp size={32} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
              <p>Nhấn để chọn hoặc kéo thả file vào đây</p>
              <input 
                id="bulk-file-input"
                type="file" 
                multiple 
                hidden 
                accept=".txt,.md,.docx"
                onChange={handleFileChange}
              />
            </div>
            
            {uploadFiles.length > 0 && (
              <div className={styles.fileList}>
                {uploadFiles.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                    <button type="button" className={styles.removeFileBtn} onClick={() => removeFile(index)}>
                      <CloseIcon size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={() => setIsUploadModalOpen(false)}>
              Hủy
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isUploading || uploadFiles.length === 0}>
              {isUploading ? 'Đang tải lên...' : `Tải lên ${uploadFiles.length} file`}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
