'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Loader2,
  Search,
  Download
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Project, DbTableSpec } from '@/lib/types';
import { specService } from '@/lib/services/spec.service';
import { toast } from '@/lib/toast';
import styles from '../details.module.css';

interface DbSpecsTabProps {
  project: Project;
}

export default function DbSpecsTab({ project }: DbSpecsTabProps) {
  const [specs, setSpecs] = useState<DbTableSpec[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpec, setActiveSpec] = useState<DbTableSpec | null>(null);

  useEffect(() => {
    if (project?.key) {
      fetchSpecs();
    }
  }, [project.key]);

  const fetchSpecs = async () => {
    setIsLoading(true);
    try {
      const data = await specService.getDbTableSpecsByProject(project.key);
      setSpecs(data || []);
      if (data && data.length > 0 && !activeSpec) {
        setActiveSpec(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch DB specs:', error);
      toast.error('Không thể tải danh sách DB Specs');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSpecs = specs.filter(spec => 
    (spec.tableName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.docContainer}>
      {/* Sidebar */}
      <div className={styles.docSidebar}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchIconContainer}>
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Tìm kiếm DB Specs..." 
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
          ) : filteredSpecs.length === 0 ? (
            <div className={styles.emptyPreview}>
              <Database size={40} />
              <p>Chưa có DB Spec nào</p>
            </div>
          ) : (
            filteredSpecs.map(spec => (
              <div 
                key={spec.id} 
                className={`${styles.docListItem} ${activeSpec?.id === spec.id ? styles.docListItemActive : ''}`}
                onClick={() => setActiveSpec(spec)}
              >
                <div className={styles.docItemIcon}>
                  <Database size={22} style={{ color: '#10b981' }} />
                </div>
                <div className={styles.docItemInfo}>
                  <div className={styles.docItemName}>{spec.tableName}</div>
                  <div className={styles.docItemMeta}>
                    <span>{new Date(spec.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.docMain}>
        {activeSpec ? (
          <>
            <div className={styles.docPreviewHeader}>
              <div className={styles.docPreviewTitle}>
                {activeSpec.tableName}
              </div>
              <button 
                className={styles.submitBtn}
                style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={() => {
                  const blob = new Blob([activeSpec.content], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${activeSpec.tableName}.md`;
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
                  {activeSpec.content || ''}
                </ReactMarkdown>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyPreview}>
            <Database size={64} style={{ opacity: 0.1, marginBottom: '16px' }} />
            <h3>Chọn một DB Spec để xem nội dung</h3>
          </div>
        )}
      </div>
    </div>
  );
}
