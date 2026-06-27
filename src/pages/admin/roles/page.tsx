'use client';

import React, { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/Auth/AdminGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { roleService, Role } from '@/lib/services/role.service';
import { 
  Shield, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Lock,
  Unlock,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/lib/toast';
import Modal from '@/components/Modal/Modal';
import styles from '../management.module.css';

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    isSystem: false
  });

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await roleService.getRoles();
      setRoles(data || []);
    } catch (error) {
      // Fallback for demo/development if API is missing
      setRoles([
        { id: '1', name: 'admin', description: 'Full system access', permissions: ['all'], isSystem: true },
        { id: '2', name: 'developer', description: 'Access to project tools and AI chat', permissions: ['projects.read', 'chat.use'], isSystem: true },
        { id: '3', name: 'guest', description: 'Read-only access', permissions: ['view'], isSystem: true }
      ]);
      console.warn('Roles API not found, using mock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await roleService.createRole(formData);
      toast.success('Access role defined successfully');
      setIsCreateModalOpen(false);
      resetForm();
      loadRoles();
    } catch (error) {
      toast.error('Failed to define role');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;
    try {
      await roleService.updateRole(editingRole.id, formData);
      toast.success('Role configuration updated');
      setIsEditModalOpen(false);
      setEditingRole(null);
      resetForm();
      loadRoles();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Execute role revocation? This will affect all assigned users.')) return;
    try {
      await roleService.deleteRole(id);
      toast.success('Role purged from system');
      loadRoles();
    } catch (error) {
      toast.error('Revocation failed: Role is currently in use or protected');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
      isSystem: false
    });
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || [],
      isSystem: !!role.isSystem
    });
    setIsEditModalOpen(true);
  };

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminGuard>
      <DashboardLayout>
        <div className={styles.storyManagement}>
          <div className={styles.storyHeader}>
            <div className={styles.titleGroup}>
              <h2>Quản lý Quyền truy cập</h2>
            </div>
            <button className={styles.createStoryBtn} onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
              <Plus size={18} /> Define New Role
            </button>
          </div>

          <div className={styles.storyToolbar}>
            <div className={styles.storyFilters}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={18} />
                <input 
                  type="text" 
                  placeholder="Search roles and permissions..." 
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
                  <th>ROLE IDENTITY</th>
                  <th>SCOPE / DESCRIPTION</th>
                  <th>CAPABILITIES</th>
                  <th>TYPE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                      <Activity className="animate-spin" style={{ margin: '0 auto' }} />
                      <p style={{ marginTop: '10px', color: '#64748b' }}>Auditing access control list...</p>
                    </td>
                  </tr>
                ) : filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                      <p style={{ color: '#64748b' }}>No roles identified in this sector.</p>
                    </td>
                  </tr>
                ) : filteredRoles.map(role => (
                  <tr key={role.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className={`${styles.statusBadge} ${role.isSystem ? styles.statusActive : styles.statusInactive}`} style={{ padding: '8px', borderRadius: '12px' }}>
                          <Shield size={18} />
                        </div>
                        <span className={styles.storyKey}>{role.name.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className={styles.storySummary}>
                      <div className={styles.summaryTitle}>{role.description}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {role.permissions?.map(p => (
                          <span key={p} className={styles.providerBadge} style={{ fontSize: '0.7rem', textTransform: 'lowercase' }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${role.isSystem ? styles.statusActive : styles.statusInactive}`}>
                        {role.isSystem ? <Lock size={12} style={{ marginRight: '6px' }} /> : <Unlock size={12} style={{ marginRight: '6px' }} />}
                        {role.isSystem ? 'Immutable' : 'Custom'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionMenu}>
                        <button className={styles.actionBtn} onClick={() => openEditModal(role)}>
                          <Edit2 size={14} />
                        </button>
                        {!role.isSystem && (
                          <button className={`${styles.actionBtn} ${styles.deleteAction}`} onClick={() => handleDelete(role.id)}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing 1-{filteredRoles.length} of {filteredRoles.length} roles
            </div>
            <div className={styles.paginationControls}>
              <button className={styles.pageBtn} disabled><ChevronLeft size={16} /></button>
              <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
              <button className={styles.pageBtn} disabled><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div style={{ 
          marginTop: '32px', 
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
          borderRadius: '20px', 
          padding: '24px', 
          display: 'flex', 
          alignItems: 'center',
          boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '12px', borderRadius: '16px', color: 'white', marginRight: '20px' }}>
            <Shield size={28} />
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Infrastructure Security Protocol</h4>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              System roles are hardcoded for core stability. Custom roles allow for granular delegation of project and AI resources.
            </p>
          </div>
        </div>

        {/* Create Modal */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Define New Access Identity">
          <form onSubmit={handleCreate} className="project-form">
            <div className="form-group">
              <label>Role Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. PROJECT_MANAGER"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly describe the purpose of this role..."
                rows={3}
                required
              />
            </div>
            <div className="form-group">
              <label>Capabilities (Comma separated)</label>
              <input
                type="text"
                value={formData.permissions.join(', ')}
                onChange={(e) => setFormData({ ...formData, permissions: e.target.value.split(',').map(p => p.trim()).filter(p => p !== '') })}
                placeholder="e.g. projects.read, projects.write, ai.chat"
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Hủy</button>
              <button type="submit" className="btn-primary">Define Role</button>
            </div>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Access Configuration">
          {editingRole && (
            <form onSubmit={handleUpdate} className="project-form">
              <div className="form-group">
                <label>Role Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={editingRole.isSystem}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="form-group">
                <label>Capabilities (Comma separated)</label>
                <input
                  type="text"
                  value={formData.permissions.join(', ')}
                  onChange={(e) => setFormData({ ...formData, permissions: e.target.value.split(',').map(p => p.trim()).filter(p => p !== '') })}
                  placeholder="e.g. projects.read, projects.write"
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
