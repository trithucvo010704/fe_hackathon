'use client';

import React, { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/Auth/AdminGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { aiService } from '@/lib/services/ai.service';
import { AiModel } from '@/lib/types';
import { 
  Cpu, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Activity,
  Server,
  Zap,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { toast } from '@/lib/toast';
import Modal from '@/components/Modal/Modal';
import styles from '../../management.module.css';

export default function AiModelManagementPage() {
  const [models, setModels] = useState<AiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [providerFilter, setProviderFilter] = useState<string>('ALL');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AiModel | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    provider: '',
    baseUrl: '',
    apiKey: '',
    active: true
  });

  const loadModels = async () => {
    try {
      setLoading(true);
      const data = await aiService.getAiModels();
      setModels(data || []);
    } catch (error) {
      toast.error('Failed to load neural configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await aiService.createAiModel(formData as any);
      toast.success('Neural configuration provisioned successfully');
      setIsCreateModalOpen(false);
      resetForm();
      loadModels();
    } catch (error) {
      toast.error('Failed to provision model');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;
    try {
      await aiService.updateAiModel(editingModel.id, formData as any);
      toast.success('Neural configuration updated');
      setIsEditModalOpen(false);
      setEditingModel(null);
      resetForm();
      loadModels();
    } catch (error) {
      toast.error('Failed to update configuration');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Execute neural purge? This configuration will be permanently deleted.')) return;
    try {
      await aiService.deleteAiModel(id);
      toast.success('Model purged from neural network');
      loadModels();
    } catch (error) {
      toast.error('Purge failed: Integrity protection active');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      provider: '',
      baseUrl: '',
      apiKey: '',
      active: true
    });
  };

  const openEditModal = (model: AiModel) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      displayName: model.displayName,
      provider: model.provider,
      baseUrl: model.baseUrl || '',
      apiKey: model.apiKey || '',
      active: model.active !== false
    });
    setIsEditModalOpen(true);
  };

  const filteredModels = models.filter(m => {
    const matchesSearch = m.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'ACTIVE' && m.active !== false) || 
                          (statusFilter === 'INACTIVE' && m.active === false);
    const matchesProvider = providerFilter === 'ALL' || m.provider === providerFilter;
    
    return matchesSearch && matchesStatus && matchesProvider;
  });

  const providers = Array.from(new Set(models.map(m => m.provider)));

  return (
    <AdminGuard>
      <DashboardLayout>
        <div className={styles.storyManagement}>
          <div className={styles.storyHeader}>
            <div className={styles.titleGroup}>
              <h2>Quản lý AI Model</h2>
            </div>
            <button className={styles.createStoryBtn} onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
              <Plus size={18} /> Provision Model
            </button>
          </div>

          <div className={styles.storyToolbar}>
            <div className={styles.storyFilters}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={18} />
                <input 
                  type="text" 
                  placeholder="Search neural configurations..." 
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className={styles.epicDropdown}
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
              >
                <option value="ALL">Provider: All</option>
                {providers.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <div className={styles.statusTabs}>
                <button 
                  className={`${styles.statusTab} ${statusFilter === 'ALL' ? styles.activeTab : ''}`}
                  onClick={() => setStatusFilter('ALL')}
                >
                  All
                </button>
                <button 
                  className={`${styles.statusTab} ${statusFilter === 'ACTIVE' ? styles.activeTab : ''}`}
                  onClick={() => setStatusFilter('ACTIVE')}
                >
                  Active
                </button>
                <button 
                  className={`${styles.statusTab} ${statusFilter === 'INACTIVE' ? styles.activeTab : ''}`}
                  onClick={() => setStatusFilter('INACTIVE')}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          <div className={styles.storyTableContainer}>
            <table className={styles.storyTable}>
              <thead>
                <tr>
                  <th>MODEL ID / NAME</th>
                  <th>DISPLAY NAME</th>
                  <th>PROVIDER</th>
                  <th>STATUS</th>
                  <th>CREATED AT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                      <Activity className="animate-spin" style={{ margin: '0 auto' }} />
                      <p style={{ marginTop: '10px', color: '#64748b' }}>Accessing neural network...</p>
                    </td>
                  </tr>
                ) : filteredModels.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                      <p style={{ color: '#64748b' }}>No neural configurations found.</p>
                    </td>
                  </tr>
                ) : filteredModels.map(model => (
                  <tr key={model.id}>
                    <td className={styles.storyKey}>{model.name}</td>
                    <td>
                      <div className={styles.summaryTitle}>{model.displayName}</div>
                    </td>
                    <td>
                      <span className={styles.providerBadge}>{model.provider}</span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${model.active !== false ? styles.statusActive : styles.statusInactive}`}>
                        <span className={styles.statusDot}></span>
                        {model.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(model.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className={styles.actionMenu}>
                        <button className={styles.actionBtn} onClick={() => openEditModal(model)}>
                          <Edit2 size={14} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.deleteAction}`} onClick={() => handleDelete(model.id)}>
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
              Showing 1-{filteredModels.length} of {filteredModels.length} models
            </div>
            <div className={styles.paginationControls}>
              <button className={styles.pageBtn} disabled><ChevronLeft size={16} /></button>
              <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
              <button className={styles.pageBtn} disabled><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Create Modal */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Provision New Model">
          <form onSubmit={handleCreate} className="project-form">
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="e.g. GPT-4 Turbo (Production)"
                required
              />
            </div>
            <div className="form-group">
              <label>Model Identifier (Name)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. gpt-4-turbo"
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
                <label>Status</label>
                <select 
                  value={formData.active ? 'true' : 'false'} 
                  onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
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
              <label>API Key (Optional)</label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="sk-..."
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Hủy</button>
              <button type="submit" className="btn-primary">Provision Model</button>
            </div>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Neural Configuration">
          {editingModel && (
            <form onSubmit={handleUpdate} className="project-form">
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Model Identifier (Name)</label>
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
                  <label>Status</label>
                  <select 
                    value={formData.active ? 'true' : 'false'} 
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
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
                <button type="submit" className="btn-primary">Update Configuration</button>
              </div>
            </form>
          )}
        </Modal>
      </DashboardLayout>
    </AdminGuard>
  );
}
