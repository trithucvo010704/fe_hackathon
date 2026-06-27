'use client';

import React, { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/Auth/AdminGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { brainService } from '@/lib/services/brain.service';
import { aiService } from '@/lib/services/ai.service';
import { AgentBrain, AiModel, AiEnv } from '@/lib/types';
import { 
  Brain, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Activity,
  Sliders,
  Globe,
  MessageSquare,
  Cpu,
  Server
} from 'lucide-react';
import { toast } from '@/lib/toast';
import Modal from '@/components/Modal/Modal';
import styles from '../../management.module.css';

export default function AgentBrainManagementPage() {
  const [brains, setBrains] = useState<AgentBrain[]>([]);
  const [models, setModels] = useState<AiModel[]>([]);
  const [envs, setEnvs] = useState<AiEnv[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBrain, setEditingBrain] = useState<AgentBrain | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    modelId: '',
    envId: '',
    systemInstruction: '',
    temperature: 0.7,
    googleSearch: false,
    includeThoughts: true,
    thinkingLevel: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [brainData, modelData, envData] = await Promise.all([
        brainService.getAgentBrains(),
        aiService.getAiModels(),
        aiService.getAiEnvs()
      ]);
      setBrains(brainData || []);
      setModels(modelData || []);
      setEnvs(envData || []);
    } catch (error) {
      toast.error('Failed to load management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await brainService.createAgentBrain(formData);
      toast.success('Agent brain configuration created');
      setIsCreateModalOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error('Failed to create brain');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrain) return;
    try {
      await brainService.updateAgentBrain(editingBrain.id, formData);
      toast.success('Brain configuration updated');
      setIsEditModalOpen(false);
      setEditingBrain(null);
      resetForm();
      loadData();
    } catch (error) {
      toast.error('Failed to update brain');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brain configuration?')) return;
    try {
      await brainService.deleteAgentBrain(id);
      toast.success('Brain configuration purged');
      loadData();
    } catch (error) {
      toast.error('Failed to delete brain');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      modelId: '',
      envId: '',
      systemInstruction: '',
      temperature: 0.7,
      googleSearch: false,
      includeThoughts: true,
      thinkingLevel: 'MEDIUM'
    });
  };

  const openEditModal = (brain: AgentBrain) => {
    setEditingBrain(brain);
    setFormData({
      name: brain.name,
      modelId: brain.modelId,
      envId: brain.envId,
      systemInstruction: brain.systemInstruction || '',
      temperature: brain.temperature || 0.7,
      googleSearch: brain.googleSearch || false,
      includeThoughts: brain.includeThoughts !== false,
      thinkingLevel: (brain.thinkingLevel as 'LOW' | 'MEDIUM' | 'HIGH') || 'MEDIUM'
    });
    setIsEditModalOpen(true);
  };

  const getModelName = (id: string) => models.find(m => m.id === id)?.displayName || 'Unknown';
  const getEnvName = (id: string) => envs.find(e => e.id === id)?.name || 'Unknown';

  const filteredBrains = brains.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    getModelName(b.modelId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminGuard>
      <DashboardLayout>
        <div className={styles.storyManagement}>
          <div className={styles.storyHeader}>
            <div className={styles.titleGroup}>
              <h2>Quản lý Agent Brain</h2>
            </div>
            <button className={styles.createStoryBtn} onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
              <Plus size={18} /> Create New Brain
            </button>
          </div>

          <div className={styles.storyToolbar}>
            <div className={styles.storyFilters}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={18} />
                <input 
                  type="text" 
                  placeholder="Search brain configurations..." 
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.storyTableContainer}>
            <table className={styles.storyTable}>
              <thead>
                <tr>
                  <th>BRAIN CONFIG NAME</th>
                  <th>MODEL</th>
                  <th>ENVIRONMENT</th>
                  <th>PARAMETERS</th>
                  <th>FEATURES</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                      <Activity className="animate-spin" style={{ margin: '0 auto' }} />
                      <p style={{ marginTop: '10px', color: '#64748b' }}>Calculating cognitive parameters...</p>
                    </td>
                  </tr>
                ) : filteredBrains.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                      <p style={{ color: '#64748b' }}>No agent brains found.</p>
                    </td>
                  </tr>
                ) : filteredBrains.map(brain => (
                  <tr key={brain.id}>
                    <td>
                      <div className={styles.summaryTitle}>{brain.name}</div>
                      {brain.systemInstruction && (
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', maxWidth: '250px' }} className="truncate">
                          {brain.systemInstruction}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className={styles.epicTag}>
                        <Cpu size={14} style={{ color: '#7c3aed' }} />
                        {getModelName(brain.modelId)}
                      </div>
                    </td>
                    <td>
                      <div className={styles.epicTag}>
                        <Server size={14} style={{ color: '#10b981' }} />
                        {getEnvName(brain.envId)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sliders size={12} className="text-gray-400" />
                          <span className="font-bold">{brain.temperature || 0.7}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Activity size={12} className="text-gray-400" />
                          <span className="font-bold text-indigo-600">{brain.thinkingLevel || 'MEDIUM'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {brain.googleSearch && (
                          <span className={`${styles.statusBadge} ${styles.statusActive}`} style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                            <Globe size={10} style={{ marginRight: '4px' }} /> Search
                          </span>
                        )}
                        {brain.includeThoughts && (
                          <span className={`${styles.statusBadge} ${styles.statusActive}`} style={{ padding: '2px 8px', fontSize: '0.7rem', background: '#eff6ff', color: '#3b82f6' }}>
                            <MessageSquare size={10} style={{ marginRight: '4px' }} /> Thoughts
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionMenu}>
                        <button className={styles.actionBtn} onClick={() => openEditModal(brain)}>
                          <Edit2 size={14} />
                        </button>
                        <button className={`${styles.actionBtn} ${styles.deleteAction}`} onClick={() => handleDelete(brain.id)}>
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
              Showing 1-{filteredBrains.length} of {filteredBrains.length} brains
            </div>
            <div className={styles.paginationControls}>
              <button className={styles.pageBtn} disabled><ChevronLeft size={16} /></button>
              <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
              <button className={styles.pageBtn} disabled><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Create Modal */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Agent Brain">
          <form onSubmit={handleCreate} className="project-form">
            <div className="form-group">
              <label>Brain Configuration Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Senior Architect Brain"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>AI Model</label>
                <select 
                  value={formData.modelId} 
                  onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                  required
                >
                  <option value="">Select Model</option>
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.displayName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Environment</label>
                <select 
                  value={formData.envId} 
                  onChange={(e) => setFormData({ ...formData, envId: e.target.value })}
                  required
                >
                  <option value="">Select Environment</option>
                  {envs.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>System Instructions (System Prompt)</label>
              <textarea
                value={formData.systemInstruction}
                onChange={(e) => setFormData({ ...formData, systemInstruction: e.target.value })}
                placeholder="Tell the agent who it is and how to behave..."
                rows={4}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Temperature ({formData.temperature})</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Thinking Level</label>
                <select 
                  value={formData.thinkingLevel} 
                  onChange={(e) => setFormData({ ...formData, thinkingLevel: e.target.value as any })}
                >
                  <option value="LOW">Low (Fast)</option>
                  <option value="MEDIUM">Medium (Balanced)</option>
                  <option value="HIGH">High (Deep Reasoning)</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group flex-row items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.googleSearch}
                    onChange={(e) => setFormData({ ...formData, googleSearch: e.target.checked })}
                  />
                  Enable Google Search
                </label>
              </div>
              <div className="form-group">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeThoughts}
                    onChange={(e) => setFormData({ ...formData, includeThoughts: e.target.checked })}
                  />
                  Include Thoughts in Response
                </label>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Hủy</button>
              <button type="submit" className="btn-primary">Create Brain</button>
            </div>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Brain Configuration">
          {editingBrain && (
            <form onSubmit={handleUpdate} className="project-form">
              <div className="form-group">
                <label>Brain Configuration Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>AI Model</label>
                  <select 
                    value={formData.modelId} 
                    onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                    required
                  >
                    {models.map(m => (
                      <option key={m.id} value={m.id}>{m.displayName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Environment</label>
                  <select 
                    value={formData.envId} 
                    onChange={(e) => setFormData({ ...formData, envId: e.target.value })}
                    required
                  >
                    {envs.map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>System Instructions</label>
                <textarea
                  value={formData.systemInstruction}
                  onChange={(e) => setFormData({ ...formData, systemInstruction: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Temperature ({formData.temperature})</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Thinking Level</label>
                  <select 
                    value={formData.thinkingLevel} 
                    onChange={(e) => setFormData({ ...formData, thinkingLevel: e.target.value as any })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.googleSearch}
                      onChange={(e) => setFormData({ ...formData, googleSearch: e.target.checked })}
                    />
                    Enable Google Search
                  </label>
                </div>
                <div className="form-group">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.includeThoughts}
                      onChange={(e) => setFormData({ ...formData, includeThoughts: e.target.checked })}
                    />
                    Include Thoughts
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Update Brain</button>
              </div>
            </form>
          )}
        </Modal>
      </DashboardLayout>
    </AdminGuard>
  );
}
