'use client';

import React, { useState, useEffect } from 'react';
import { AgentBrain, Project } from '@/lib/types';
import { brainService } from '@/lib/services/brain.service';
import { projectService } from '@/lib/services/project.service';
import { X, Loader2, Cpu } from 'lucide-react';
import styles from '../chat.module.css';

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (brainId: string, projectId: string) => void;
  isSubmitting?: boolean;
}

export default function CreateChatModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  isSubmitting = false
}: CreateChatModalProps) {
  const [projectId, setProjectId] = useState('');
  const [brainId, setBrainId] = useState('');
  const [brains, setBrains] = useState<AgentBrain[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        brainService.getAgentBrains(),
        projectService.getProjects()
      ]).then(([brainsData, projectsData]) => {
        setBrains(brainsData);
        setProjects(projectsData);
      }).catch(err => console.error('Failed to fetch data:', err))
      .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brainId && projectId) {
      onSubmit(brainId, projectId);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className="text-xl font-bold">New Chat with AI Agent</h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Project</label>
              <div className={styles.projectSelect}>
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0' }}>
                    <Loader2 size={16} style={{ animation: 'rotation 1s linear infinite' }} />
                    <span>Loading projects...</span>
                  </div>
                ) : (
                  <select 
                    value={projectId} 
                    onChange={(e) => setProjectId(e.target.value)}
                    className={styles.textInput}
                    style={{ borderRadius: 'var(--radius-md)', width: '100%', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    required
                  >
                    <option value="">-- Choose a project --</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Select AI Expert (Brain)</label>
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0' }}>
                  <Loader2 size={16} style={{ animation: 'rotation 1s linear infinite' }} />
                  <span>Loading brains...</span>
                </div>
              ) : (
                <div className={styles.brainGrid}>
                  {brains.map((brain) => (
                    <div
                      key={brain.id}
                      onClick={() => setBrainId(brain.id)}
                      className={`${styles.brainItem} ${brainId === brain.id ? styles.selectedBrain : ''}`}
                    >
                      <div className={styles.brainIcon}>
                        <Cpu size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>{brain.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{brain.modelId}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!brainId || !projectId || isSubmitting}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              {isSubmitting ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Loader2 size={18} style={{ animation: 'rotation 1s linear infinite' }} />
                  <span>Initializing...</span>
                </div>
              ) : (
                'Start Chatting'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
