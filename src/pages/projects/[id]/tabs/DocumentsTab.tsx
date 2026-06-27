'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Plus, 
  X, 
  Loader2,
  Search,
  Download
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Project, ProjectDocument } from '@/lib/types';
import { documentService } from '@/lib/services/document.service';
import { toast } from '@/lib/toast';
import styles from '../details.module.css';
import { useProject } from '../context/ProjectContext';

interface DocumentsTabProps {
  project: Project;
}

export default function DocumentsTab({ project }: DocumentsTabProps) {
  const { showConfirm } = useProject();
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocument, setActiveDocument] = useState<ProjectDocument | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, [project.id]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await documentService.getDocuments('PROJECT', project.id);
      setDocuments(data || []);
      if (data && data.length > 0 && !activeDocument) {
        setActiveDocument(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Không thể tải danh sách tài liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Vui lòng chọn ít nhất một file');
      return;
    }

    setIsUploading(true);
    try {
      const newDocs = await documentService.uploadDocuments(
        'PROJECT',
        project.id,
        selectedFiles
      );
      setDocuments(prev => [...newDocs, ...prev]);
      toast.success('Tải lên thành công');
      setIsModalOpen(false);
      setSelectedFiles([]);
      
      if (newDocs.length > 0) {
        setActiveDocument(newDocs[0]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Tải lên thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = documents.find(d => d.id === id);
    showConfirm({
      title: 'Xóa tài liệu',
      message: `Bạn có chắc chắn muốn xóa tài liệu "${doc?.name || 'này'}"?`,
      type: 'danger',
      onConfirm: async () => {
        try {
          await documentService.deleteDocument(id);
          setDocuments(prev => prev.filter(doc => doc.id !== id));
          toast.success('Đã xóa tài liệu');
          if (activeDocument?.id === id) {
            setActiveDocument(null);
          }
        } catch (error) {
          console.error('Delete failed:', error);
          toast.error('Xóa thất bại');
        }
      }
    });
  };

  const filteredDocuments = documents.filter(doc => 
    (doc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.content || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.docContainer}>
      {/* Sidebar */}
      <div className={styles.docSidebar}>
        <button 
          className={styles.uploadBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Tải lên tài liệu
        </button>

        <div className={styles.searchWrapper}>
          <div className={styles.searchIconContainer}>
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Tìm kiếm tài liệu..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.docList}>
          {isLoading ? (
            <div className={styles.emptyPreview}>
              <Loader2 className={styles.spin} />
              <p>Đang tải danh sách...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className={styles.emptyPreview}>
              <FileText size={40} />
              <p>Chưa có tài liệu nào</p>
            </div>
          ) : (
            filteredDocuments.map(doc => (
              <div 
                key={doc.id} 
                className={`${styles.docListItem} ${activeDocument?.id === doc.id ? styles.docListItemActive : ''}`}
                onClick={() => setActiveDocument(doc)}
              >
                <div className={styles.docItemIcon}>
                  <FileText size={22} style={{ color: '#0ea5e9' }} />
                </div>
                <div className={styles.docItemInfo}>
                  <div className={styles.docItemName}>{doc.name}</div>
                  <div className={styles.docItemMeta}>
                    <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button 
                  className={styles.actionBtn}
                  onClick={(e) => handleDelete(doc.id, e)}
                >
                  <Trash2 size={16} className={styles.deleteBtn} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.docMain}>
        {activeDocument ? (
          <>
            <div className={styles.docPreviewHeader}>
              <div className={styles.docPreviewTitle}>
                {activeDocument.name}
              </div>
              <button 
                className={styles.submitBtn}
                style={{ padding: '8px 16px', fontSize: '13px' }}
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
                <Download size={16} />
                Tải về
              </button>
            </div>
            <div className={styles.docPreviewContent}>
              <div className={styles.markdownView}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeDocument.content || ''}
                </ReactMarkdown>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyPreview}>
            <FileText size={64} style={{ opacity: 0.1, marginBottom: '16px' }} />
            <h3>Chọn một tài liệu để xem nội dung</h3>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Tải lên tài liệu (.md)</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
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
              <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                Hủy
              </button>
              <button 
                className={styles.submitBtn}
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
              >
                {isUploading ? (
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
}
