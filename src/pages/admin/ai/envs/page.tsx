'use client';

import React, { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/Auth/AdminGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { aiService } from '@/lib/services/ai.service';
import { AiEnv } from '@/lib/types';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  ShieldOff,
  Activity,
  Key
} from 'lucide-react';
import { toast } from '@/lib/toast';
import Modal from '@/components/Modal/Modal';
import styles from '../../management.module.css';

export default function AiEnvManagementPage() {
  const [envs, setEnvs] = useState<AiEnv[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'PRODUCTION' | 'DEVELOPMENT'>('ALL');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEnv, setEditingEnv] = useState<AiEnv | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    productionMode: false,
    baseUrl: '',
    apiKey: ''
  });

  const loadEnvs = async () => {
    try {
      setLoading(true);
      const data = await aiService.getAiEnvs();
      setEnvs(data || []);
    } catch (error) {
      toast.error('Failed to load environment configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnvs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await aiService.createAiEnv(formData as any);
      toast.success('Environment configuration created');
      setIsCreateModalOpen(false);
      resetForm();
      loadEnvs();
    } catch (error) {
      toast.error('Failed to create environment');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnv) return;
    try {
      await aiService.updateAiEnv(editingEnv.id, formData as any);
      toast.success('Environment configuration updated');
      setIsEditModalOpen(false);
      setEditingEnv(null);
      resetForm();
      loadEnvs();
    } catch (error) {
      toast.error('Failed to update environment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this environment configuration?')) return;
    try {
      await aiService.deleteAiEnv(id);
      toast.success('Environment purged');
      loadEnvs();
    } catch (error) {
      toast.error('Failed to delete environment');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      provider: '',
      productionMode: false,
      baseUrl: '',
      apiKey: ''
    });
  };

  const openEditModal = (env: AiEnv) => {
    setEditingEnv(env);
    setFormData({
      name: env.name,
      provider: env.provider,
      productionMode: env.productionMode,
      baseUrl: env.baseUrl || '',
      apiKey: env.apiKey || ''
    });
    setIsEditModalOpen(true);
  };

  const filteredEnvs = envs.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = modeFilter === 'ALL' || 
                        (modeFilter === 'PRODUCTION' && e.productionMode) || 
                        (modeFilter === 'DEVELOPMENT' && !e.productionMode);
    
    return matchesSearch && matchesMode;
  });

  return (
    <AdminGuard>
      <DashboardLayout>
        <div className={styles.storyManagement}>
          <div className={styles.storyHeader}>
            <div className={styles.titleGroup}>
              <h2>Quản lý API Environment</h2>
            </div>
            <button className={styles.createStoryBtn} onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
              <Plus size={18} /> Add Environment
            </button>
          </div>

          <div className={styles.storyToolbar}>
            <div className={styles.storyFilters}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={18} />
                <input 
                  type="text" 
                  placeholder="Search environments..." 
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className={styles.statusTabs}>
                <button 
                  className={`${styles.statusTab} ${modeFilter === 'ALL' ? styles.activeTab : ''}`}
                  onClick={() => setModeFilter('ALL')}
                >
                  All
                </button>
                <button 
                  className={`${styles.statusTab} ${modeFilter === 'PRODUCTION' ? styles.activeTab : ''}`}
                  onClick={() => setModeFilter('PRODUCTION')}
                >
                  Production
                </button>
                <button 
                  className={`${styles.statusTab} ${modeFilter === 'DEVELOPMENT' ? styles.activeTab : ''}`}
                  onClick={() => setModeFilter('DEVELOPMENT')}
                >
                  Development
                </button>
              </div>
            </div>
          </div>

          <div className={styles.storyTableContainer}>
            <table className={styles.storyTable}>
              <thead>
                <tr>
                  <th>ENVIRONMENT NAME</th>
                  <th>PROVIDER</th>
                  <th>MODE</th>
                  <th>BASE URL</th>
                  <th>API KEY</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                      <Activity className="animate-spin" style={{ margin: '0 auto' }} />
                      <p style={{ marginTop: '10px', color: '#64748b' }}>Loading configurations...</p>
                    </td>
                  </tr>
                ) : filteredEnvs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                      <p style={{ color: '#64748b' }}>No environment configurations found.</p>
                    </td>
                  </tr>
                ) : filteredEnvs.map(env => (
                  <tr key={env.id}>
                    <td>
                      <div className={styles.summaryTitle}>{env.name}</div>
                    </td>
                    <td>
                      <span className={styles.providerBadge}>{env.provider}</span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${env.productionMode ? styles.statusActive : styles.statusInactive}`}>
                        {env.productionMode ? <Shield size={12} style={{ marginRight: '6px' }} /> : <ShieldOff size={12} style={{ marginRight: '6px' }} />}
                        {env.productionMode ? 'Production' : 'Development'}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {env.baseUrl || 'Default'}
                    </td>
                    <td style={{ color: '#94a3b8' }}>
                      <div className="flex items-center">
                        <Key size={14} className="mr-2" />
                        <span className="font-mono">••••••••••••••••</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionMenu}>
                        <button className={styles.actionBtn} onClick={() => openEditModal(env)}>
                          <Edit2 size={14} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.deleteAction}`} onClick={() => handleDelete(env.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing 1-{filteredEnvs.length} of {filteredEnvs.length} environments
            </div>
            <div className={styles.paginationControls}>
              <button className={styles.pageBtn} disabled><ChevronLeft size={16} /></button>
              <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
              <button className={styles.pageBtn} disabled><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Create Modal */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Environment">
          <form onSubmit={handleCreate} className="project-form">
            <div className="form-group">
              <label>Environment Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. OpenAI Production"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Provider</label>
                <select 
                  value={formData.provider} 
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  required
                >
                  <option value="">Select Provider</option>
                  <option value="OpenAI">OpenAI</option>
                  <option value="Google">Google (Gemini)</option>
                  <option value="Anthropic">Anthropic (Claude)</option>
                  <option value="Azure">Azure OpenAI</option>
                  <option value="Ollama">Ollama (Local)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Mode</label>
                <select 
                  value={formData.productionMode ? 'true' : 'false'} 
                  onChange={(e) => setFormData({ ...formData, productionMode: e.target.value === 'true' })}
                >
                  <option value="false">Development</option>
                  <option value="true">Production</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Base URL (Optional)</label>
              <input
                type="text"
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                placeholder="https://api.openai.com/v1"
              />
            </div>
            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="sk-..."
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Hủy</button>
              <button type="submit" className="btn-primary">Add Environment</button>
            </div>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Environment">
          {editingEnv && (
            <form onSubmit={handleUpdate} className="project-form">
              <div className="form-group">
                <label>Environment Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Provider</label>
                  <select 
                    value={formData.provider} 
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    required
                  >
                    <option value="OpenAI">OpenAI</option>
                    <option value="Google">Google (Gemini)</option>
                    <option value="Anthropic">Anthropic (Claude)</option>
                    <option value="Azure">Azure OpenAI</option>
                    <option value="Ollama">Ollama (Local)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mode</label>
                  <select 
                    value={formData.productionMode ? 'true' : 'false'} 
                    onChange={(e) => setFormData({ ...formData, productionMode: e.target.value === 'true' })}
                  >
                    <option value="false">Development</option>
                    <option value="true">Production</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Base URL</label>
                <input
                  type="text"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>API Key</label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="Leave blank to keep current key"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Update Environment</button>
              </div>
            </form>
          )}
        </Modal>
      </DashboardLayout>
    </AdminGuard>
  );
}
