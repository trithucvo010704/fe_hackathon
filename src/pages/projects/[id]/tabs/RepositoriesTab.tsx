import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Edit2, Code, GitBranch, Layout, Database, Smartphone, 
  Clock, Check, X, FileText, Search, Upload, Download, Loader2, 
  ChevronRight, Copy, BookOpen, HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../details.module.css';
import { ProjectRepository, ProjectDocument } from '@/lib/types';
import Modal from '@/components/Modal/Modal';
import MermaidViewer from '@/components/Common/MermaidViewer';
import { documentService } from '@/lib/services/document.service';
import { toast } from '@/lib/toast';
import { useProject } from '../context/ProjectContext';

interface RepositoriesTabProps {
  repos: ProjectRepository[];
  handleCreateRepo: (data: { name: string; language: string; framework: string }) => Promise<void>;
  handleUpdateRepo: (id: string, data: { name: string; language: string; framework: string }) => Promise<void>;
  handleDeleteRepo: (id: string) => Promise<void>;
}

const LANGUAGES = ['TypeScript', 'JavaScript', 'Java', 'Go', 'Python', 'C#', 'PHP', 'C++', 'Ruby', 'Kotlin', 'Swift'];
const FRAMEWORKS = ['React', 'Next.js', 'Angular', 'Vue.js', 'Spring Boot', 'NestJS', 'Express', 'Django', 'FastAPI', 'Laravel', 'Flask', 'Gin'];

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

const RepositoriesTab: React.FC<RepositoriesTabProps> = ({
  repos,
  handleCreateRepo,
  handleUpdateRepo,
  handleDeleteRepo
}) => {
  const { showConfirm } = useProject();
  
  // Active states
  const [activeRepo, setActiveRepo] = useState<ProjectRepository | null>(null);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<ProjectDocument | null>(null);
  
  // Loading states
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isDocUploading, setIsDocUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [isAddRepoOpen, setIsAddRepoOpen] = useState(false);
  const [isEditRepoOpen, setIsEditRepoOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<ProjectRepository | null>(null);

  // Search filter states
  const [repoSearch, setRepoSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');
  
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    language: 'TypeScript',
    customLanguage: '',
    framework: 'React',
    customFramework: ''
  });
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});

  // Auto-select first repository when loaded
  useEffect(() => {
    if (repos.length > 0 && !activeRepo) {
      setActiveRepo(repos[0]);
    }
  }, [repos]);

  // Fetch documents whenever selected repository changes
  useEffect(() => {
    if (activeRepo) {
      fetchRepoDocuments(activeRepo.id);
    } else {
      setDocuments([]);
      setActiveDocument(null);
    }
  }, [activeRepo]);

  const fetchRepoDocuments = async (repoId: string) => {
    setIsLoadingDocs(true);
    try {
      const data = await documentService.getDocuments('REPOSITORY', repoId);
      setDocuments(data || []);
      if (data && data.length > 0) {
        setActiveDocument(data[0]);
      } else {
        setActiveDocument(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải tài liệu của repository');
    } finally {
      setIsLoadingDocs(false);
    }
  };

  // Form reset and controls
  const resetForm = () => {
    setFormData({
      name: '',
      language: 'TypeScript',
      customLanguage: '',
      framework: 'React',
      customFramework: ''
    });
    setFormErrors({});
  };

  const handleOpenAddRepo = () => {
    resetForm();
    setIsAddRepoOpen(true);
  };

  const handleOpenEditRepo = (e: React.MouseEvent, repo: ProjectRepository) => {
    e.stopPropagation(); // Prevent changing active repo
    const isCustomLang = !LANGUAGES.includes(repo.language);
    const isCustomFrame = !FRAMEWORKS.includes(repo.framework);

    setFormData({
      name: repo.name,
      language: isCustomLang ? 'Other' : repo.language,
      customLanguage: isCustomLang ? repo.language : '',
      framework: isCustomFrame ? 'Other' : repo.framework,
      customFramework: isCustomFrame ? repo.framework : ''
    });
    setSelectedRepo(repo);
    setFormErrors({});
    setIsEditRepoOpen(true);
  };

  const validateForm = () => {
    const errors: { name?: string} = {};
    if (!formData.name.trim()) {
      errors.name = 'Tên repository không được để trống';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Tên repository phải có ít nhất 2 ký tự';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFinalData = () => {
    return {
      name: formData.name.trim(),
      language: formData.language === 'Other' ? formData.customLanguage.trim() || 'Custom' : formData.language,
      framework: formData.framework === 'Other' ? formData.customFramework.trim() || 'Custom' : formData.framework
    };
  };

  const onSubmitAddRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await handleCreateRepo(getFinalData());
      setIsAddRepoOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitEditRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedRepo) return;
    setIsSubmitting(true);
    try {
      await handleUpdateRepo(selectedRepo.id, getFinalData());
      setIsEditRepoOpen(false);
      
      // Update activeRepo locally if it was edited
      if (activeRepo && activeRepo.id === selectedRepo.id) {
        setActiveRepo({
          ...activeRepo,
          ...getFinalData()
        });
      }
      setSelectedRepo(null);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRepoClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent changing active repo
    handleDeleteRepo(id).then(() => {
      if (activeRepo && activeRepo.id === id) {
        setActiveRepo(null);
      }
    });
  };

  // Document actions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadDocs = async () => {
    if (!activeRepo) return;
    if (selectedFiles.length === 0) {
      toast.error('Vui lòng chọn ít nhất một file');
      return;
    }
    setIsDocUploading(true);
    try {
      const newDocs = await documentService.uploadDocuments(
        'REPOSITORY',
        activeRepo.id,
        selectedFiles
      );
      setDocuments(prev => [...newDocs, ...prev]);
      toast.success('Tải lên tài liệu thành công');
      setIsUploadDocOpen(false);
      setSelectedFiles([]);
      if (newDocs.length > 0) {
        setActiveDocument(newDocs[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Tải lên tài liệu thất bại');
    } finally {
      setIsDocUploading(false);
    }
  };

  const handleDeleteDocClick = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = documents.find(d => d.id === docId);
    showConfirm({
      title: 'Xóa tài liệu',
      message: `Bạn có chắc chắn muốn xóa tài liệu "${doc?.name || 'này'}" khỏi repository?`,
      type: 'danger',
      onConfirm: async () => {
        try {
          await documentService.deleteDocument(docId);
          setDocuments(prev => prev.filter(d => d.id !== docId));
          toast.success('Đã xóa tài liệu');
          if (activeDocument?.id === docId) {
            setActiveDocument(null);
          }
        } catch (error) {
          console.error(error);
          toast.error('Xóa tài liệu thất bại');
        }
      }
    });
  };

  const handleCopyDocContent = () => {
    if (!activeDocument?.content) return;
    navigator.clipboard.writeText(activeDocument.content);
    toast.success('Đã sao chép nội dung tài liệu!');
  };

  // Filters
  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
    repo.language.toLowerCase().includes(repoSearch.toLowerCase()) ||
    repo.framework.toLowerCase().includes(repoSearch.toLowerCase())
  );

  const filteredDocuments = documents.filter(doc => 
    (doc.name || '').toLowerCase().includes(docSearch.toLowerCase()) ||
    (doc.content || '').toLowerCase().includes(docSearch.toLowerCase())
  );

  const getRepoIcon = (framework: string, name: string) => {
    const fwLower = framework.toLowerCase();
    const nameLower = name.toLowerCase();
    
    if (fwLower.includes('react') || fwLower.includes('next') || fwLower.includes('vue') || fwLower.includes('angular')) {
      return <Layout size={18} style={{ color: '#0ea5e9' }} />;
    }
    if (fwLower.includes('spring') || fwLower.includes('nest') || fwLower.includes('express') || fwLower.includes('gin') || nameLower.includes('server') || nameLower.includes('backend') || fwLower.includes('django') || fwLower.includes('fastapi')) {
      return <Database size={18} style={{ color: '#10b981' }} />;
    }
    if (nameLower.includes('mobile') || nameLower.includes('app') || fwLower.includes('react-native') || fwLower.includes('flutter') || fwLower.includes('swift') || fwLower.includes('kotlin')) {
      return <Smartphone size={18} style={{ color: '#8b5cf6' }} />;
    }
    return <Code size={18} style={{ color: '#f59e0b' }} />;
  };

  return (
    <div className={styles.docContainer} style={{ height: 'calc(100vh - 250px)', gap: 0, padding: 0 }}>
      
      {/* Column 1: Repositories List */}
      <div className={styles.docSidebar} style={{ width: '25%', borderRight: '1px solid var(--border)', padding: '20px 16px', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Repositories</h3>
          <button 
            onClick={handleOpenAddRepo}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
              color: 'var(--primary)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
            title="Thêm mới repository"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className={styles.searchWrapper} style={{ marginTop: 0 }}>
          <div className={styles.searchIconContainer}>
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Tìm repository..." 
            className={styles.searchInput}
            value={repoSearch}
            onChange={(e) => setRepoSearch(e.target.value)}
            style={{ fontSize: '13px', paddingLeft: '34px' }}
          />
        </div>

        <div className={styles.docList} style={{ gap: '8px' }}>
          {filteredRepos.length === 0 ? (
            <div style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
              Không tìm thấy repository
            </div>
          ) : (
            filteredRepos.map(repo => (
              <div 
                key={repo.id}
                className={`${styles.docListItem} ${activeRepo?.id === repo.id ? styles.docListItemActive : ''}`}
                onClick={() => setActiveRepo(repo)}
                style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}
              >
                <div className={styles.docItemIcon} style={{ marginRight: '10px' }}>
                  {getRepoIcon(repo.framework, repo.name)}
                </div>
                <div className={styles.docItemInfo} style={{ minWidth: 0, flex: 1 }}>
                  <div className={styles.docItemName} style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {repo.name}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '3px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                      {repo.language}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', opacity: activeRepo?.id === repo.id ? 1 : 0 }} className={styles.repoItemActions}>
                  <button 
                    onClick={(e) => handleOpenEditRepo(e, repo)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
                    title="Sửa"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteRepoClick(e, repo.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                    title="Xóa"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Column 2: Documents List of Selected Repo */}
      <div className={styles.docSidebar} style={{ width: '28%', borderRight: '1px solid var(--border)', padding: '20px 16px', gap: '16px', backgroundColor: 'rgba(248, 250, 252, 0.5)' }}>
        {activeRepo ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Tài liệu của Repo
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap' }}>
                  {activeRepo.name}
                </span>
              </div>
              <button 
                onClick={() => setIsUploadDocOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <Upload size={13} />
                Upload
              </button>
            </div>

            <div className={styles.searchWrapper} style={{ marginTop: 0 }}>
              <div className={styles.searchIconContainer}>
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Tìm tài liệu repo..." 
                className={styles.searchInput}
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                style={{ fontSize: '13px', paddingLeft: '34px' }}
              />
            </div>

            <div className={styles.docList} style={{ gap: '8px' }}>
              {isLoadingDocs ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <Loader2 className={styles.spin} size={24} style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '13px' }}>Đang tải tài liệu...</p>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <FileText size={32} style={{ margin: '0 auto 8px', opacity: 0.2 }} />
                  <p style={{ fontSize: '13px', margin: 0 }}>Không có tài liệu nào</p>
                </div>
              ) : (
                filteredDocuments.map(doc => (
                  <div 
                    key={doc.id} 
                    className={`${styles.docListItem} ${activeDocument?.id === doc.id ? styles.docListItemActive : ''}`}
                    onClick={() => setActiveDocument(doc)}
                    style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <div className={styles.docItemIcon}>
                      <FileText size={18} style={{ color: '#0ea5e9' }} />
                    </div>
                    <div className={styles.docItemInfo} style={{ minWidth: 0, flex: 1 }}>
                      <div className={styles.docItemName} style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.name}
                      </div>
                      <div className={styles.docItemMeta} style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                        <span>{new Date(doc.updatedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <button 
                      className={styles.actionBtn}
                      onClick={(e) => handleDeleteDocClick(doc.id, e)}
                      style={{ padding: '4px' }}
                    >
                      <Trash2 size={13} className={styles.deleteBtn} style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', padding: '20px', textAlign: 'center' }}>
            <GitBranch size={36} style={{ opacity: 0.15, marginBottom: '12px' }} />
            <p style={{ fontSize: '13px', margin: 0 }}>Chọn một repository bên trái để xem tài liệu.</p>
          </div>
        )}
      </div>

      {/* Column 3: Active Document Markdown Preview */}
      <div className={styles.docMain} style={{ flex: 1, padding: 0, border: 'none', borderRadius: 0 }}>
        {activeDocument ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className={styles.docPreviewHeader} style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <FileText size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div className={styles.docPreviewTitle} style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                  {activeDocument.name}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button 
                  className="btn-secondary"
                  onClick={handleCopyDocContent}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderColor: 'var(--border)'
                  }}
                  title="Sao chép nội dung tài liệu"
                >
                  <Copy size={13} />
                  Copy
                </button>
                <button 
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => {
                    const blob = new Blob([activeDocument.content], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = activeDocument.name.endsWith('.md') ? activeDocument.name : `${activeDocument.name}.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download size={13} />
                  Tải về
                </button>
              </div>
            </div>
            <div className={styles.docPreviewContent} style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              <div className={styles.markdownView} style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {activeDocument.content || ''}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', padding: '20px', textAlign: 'center' }}>
            <BookOpen size={48} style={{ opacity: 0.15, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Chọn tài liệu để xem</h3>
            <p style={{ fontSize: '13px', margin: 0 }}>Chọn một file tài liệu ở cột giữa để hiển thị nội dung chi tiết dưới định dạng Markdown.</p>
          </div>
        )}
      </div>

      {/* Modal Thêm Mới Repository */}
      <Modal isOpen={isAddRepoOpen} onClose={() => setIsAddRepoOpen(false)} title="Thêm Repository mới">
        <form onSubmit={onSubmitAddRepo} className="project-form" style={{ padding: '8px 0' }}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>Tên Repository <span style={{ color: '#ef4444' }}>*</span></label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. ecom-web-client"
              style={{ width: '100%', borderColor: formErrors.name ? '#ef4444' : undefined }}
            />
            {formErrors.name && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>Ngôn ngữ lập trình</label>
            <select 
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px' }}
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
              <option value="Other">Khác (tự nhập)...</option>
            </select>
          </div>

          {formData.language === 'Other' && (
            <div className="form-group" style={{ marginBottom: '18px', animation: 'fadeIn 0.2s' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>Tên ngôn ngữ khác <span style={{ color: '#ef4444' }}>*</span></label>
              <input 
                type="text" 
                value={formData.customLanguage}
                onChange={(e) => setFormData(prev => ({ ...prev, customLanguage: e.target.value }))}
                placeholder="e.g. Rust, Go, Scala..."
                style={{ width: '100%' }}
                required
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>Framework / Công nghệ</label>
            <select 
              value={formData.framework}
              onChange={(e) => setFormData(prev => ({ ...prev, framework: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px' }}
            >
              {FRAMEWORKS.map(fw => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
              <option value="Other">Khác (tự nhập)...</option>
            </select>
          </div>

          {formData.framework === 'Other' && (
            <div className="form-group" style={{ marginBottom: '24px', animation: 'fadeIn 0.2s' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>Tên framework khác <span style={{ color: '#ef4444' }}>*</span></label>
              <input 
                type="text" 
                value={formData.customFramework}
                onChange={(e) => setFormData(prev => ({ ...prev, customFramework: e.target.value }))}
                placeholder="e.g. Svelte, Gin, FastAPI..."
                style={{ width: '100%' }}
                required
              />
            </div>
          )}

          <div className={styles.modalActions} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setIsAddRepoOpen(false)}
              style={{ padding: '8px 16px' }}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Chỉnh Sửa Repository */}
      <Modal isOpen={isEditRepoOpen} onClose={() => setIsEditRepoOpen(false)} title="Chỉnh sửa Repository">
        <form onSubmit={onSubmitEditRepo} className="project-form" style={{ padding: '8px 0' }}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>Tên Repository <span style={{ color: '#ef4444' }}>*</span></label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. ecom-web-client"
              style={{ width: '100%', borderColor: formErrors.name ? '#ef4444' : undefined }}
            />
            {formErrors.name && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>Ngôn ngữ lập trình</label>
            <select 
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px' }}
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
              <option value="Other">Khác (tự nhập)...</option>
            </select>
          </div>

          {formData.language === 'Other' && (
            <div className="form-group" style={{ marginBottom: '18px', animation: 'fadeIn 0.2s' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>Tên ngôn ngữ khác <span style={{ color: '#ef4444' }}>*</span></label>
              <input 
                type="text" 
                value={formData.customLanguage}
                onChange={(e) => setFormData(prev => ({ ...prev, customLanguage: e.target.value }))}
                placeholder="e.g. Rust, Go, Scala..."
                style={{ width: '100%' }}
                required
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>Framework / Công nghệ</label>
            <select 
              value={formData.framework}
              onChange={(e) => setFormData(prev => ({ ...prev, framework: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px' }}
            >
              {FRAMEWORKS.map(fw => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
              <option value="Other">Khác (tự nhập)...</option>
            </select>
          </div>

          {formData.framework === 'Other' && (
            <div className="form-group" style={{ marginBottom: '24px', animation: 'fadeIn 0.2s' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', fontSize: '14px' }}>Tên framework khác <span style={{ color: '#ef4444' }}>*</span></label>
              <input 
                type="text" 
                value={formData.customFramework}
                onChange={(e) => setFormData(prev => ({ ...prev, customFramework: e.target.value }))}
                placeholder="e.g. Svelte, Gin, FastAPI..."
                style={{ width: '100%' }}
                required
              />
            </div>
          )}

          <div className={styles.modalActions} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setIsEditRepoOpen(false)}
              style={{ padding: '8px 16px' }}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Upload Tài Liệu Repo */}
      {isUploadDocOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Tải lên tài liệu Repo (.md)</h3>
              <button className={styles.closeBtn} onClick={() => setIsUploadDocOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div 
              className={styles.dropzone}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept=".md"
                multiple 
                hidden 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className={styles.dropzoneIcon}>
                <Upload size={32} />
              </div>
              <div className={styles.dropzoneText}>
                <p>Nhấp để chọn file Markdown hoặc kéo thả vào đây</p>
                <span>Hỗ trợ .md file</span>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className={styles.selectedFilesList}>
                {selectedFiles.map((file, index) => (
                  <div key={index} className={styles.selectedFileItem}>
                    <div className={styles.fileNameWrapper}>
                      <FileText size={16} />
                      <span className={styles.fileNameText}>{file.name}</span>
                    </div>
                    <X 
                      size={16} 
                      className={styles.removeFileBtn} 
                      onClick={() => removeSelectedFile(index)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setIsUploadDocOpen(false)}>
                Hủy
              </button>
              <button 
                className={styles.submitBtn}
                onClick={handleUploadDocs}
                disabled={selectedFiles.length === 0 || isDocUploading}
              >
                {isDocUploading ? (
                  <>
                    <Loader2 size={18} className={styles.spin} />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Bắt đầu tải lên
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoriesTab;
