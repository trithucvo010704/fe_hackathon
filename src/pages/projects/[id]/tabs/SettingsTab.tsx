import React, { useState } from 'react';
import {
  Settings,
  Users,
  Lock,
  Trash2,
  ChevronDown,
  AlertTriangle,
  Bell,
  Plug
} from 'lucide-react';
import styles from '../details.module.css';
import { Project, ProjectMember, User } from '@/lib/types';
import { projectService } from '@/lib/services/project.service';
import { userService } from '@/lib/services/user.service';
import { toast } from '@/lib/toast';
import { Plus, UserPlus, X, Search, Loader2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

interface SettingsTabProps {
  project: Project;
  onUpdate: () => void;
  onConfirmDelete: (id: string) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ project, onUpdate, onConfirmDelete }) => {
  const { showConfirm } = useProject();
  const [activeMenu, setActiveMenu] = useState('general');
  const [formData, setFormData] = useState({
    name: project.name || '',
    key: project.key || '',
    category: project.category || 'Platform',
    description: project.description || '',
    leaderId: project.leaderId || project.ownerId || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const fetchMembers = async () => {
    setIsLoadingMembers(true);
    try {
      console.log('Fetching members for project:', project.id);
      const data = await projectService.getProjectMembers(project.id);
      console.log('Fetched members:', data);
      setMembers(data || []);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      toast.error('Không thể tải danh sách thành viên');
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      console.log('Fetching available users for project:', project.id);
      const data = await userService.getUsers(project.id);
      console.log('Available users:', data);
      setAvailableUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch available users:', error);
      // Don't show toast for this one as it might be a known backend issue
    }
  };

  const fetchAllUsers = async () => {
    try {
      const data = await userService.getUsers();
      setAllUsers(data);
    } catch (error) {
      console.error('Failed to fetch all users:', error);
    }
  };

  React.useEffect(() => {
    if (activeMenu === 'general') {
      fetchAllUsers();
    }
    if (activeMenu === 'members') {
      fetchMembers();
      fetchAvailableUsers();
    }
  }, [activeMenu, project.id]);

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    setIsAddingMember(true);
    try {
      await projectService.addProjectMember(project.id, selectedUserId);
      toast.success('Member added successfully');
      setSelectedUserId('');
      fetchMembers();
      fetchAvailableUsers();
    } catch (error) {
      toast.error('Failed to add member');
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    const member = members.find(m => m.id === userId);
    showConfirm({
      title: 'Xóa thành viên',
      message: `Bạn có chắc chắn muốn xóa thành viên "${member?.name || 'này'}" khỏi dự án?`,
      type: 'danger',
      onConfirm: async () => {
        try {
          await projectService.removeProjectMember(project.id, userId);
          toast.success('Member removed successfully');
          fetchMembers();
          fetchAvailableUsers();
        } catch (error) {
          toast.error('Failed to remove member');
        }
      }
    });
  };


  const handleSave = async () => {
    setIsSaving(true);
    try {
      await projectService.updateProject(project.id, {
        name: formData.name,
        description: formData.description,
        key: formData.key,
        leaderId: formData.leaderId,
        category: formData.category
      });
      toast.success('Project updated successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update project');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.settingsLayout}>
      <div className={styles.settingsSidebar}>
        <h3 className={styles.sidebarTitle}>PROJECT SETTINGS</h3>
        <nav className={styles.settingsNav}>
          <button
            className={`${styles.navItem} ${activeMenu === 'general' ? styles.navItemActive : ''}`}
            onClick={() => setActiveMenu('general')}
          >
            <Settings size={18} />
            General
          </button>
          <button
            className={`${styles.navItem} ${activeMenu === 'members' ? styles.navItemActive : ''}`}
            onClick={() => setActiveMenu('members')}
          >
            <Users size={18} />
            Members
          </button>
          <button
            className={`${styles.navItem} ${activeMenu === 'permissions' ? styles.navItemActive : ''}`}
            onClick={() => setActiveMenu('permissions')}
          >
            <Lock size={18} />
            Permissions
          </button>
          <button
            className={`${styles.navItem} ${activeMenu === 'notifications' ? styles.navItemActive : ''}`}
            onClick={() => setActiveMenu('notifications')}
          >
            <Bell size={18} />
            Notifications
          </button>
          <button
            className={`${styles.navItem} ${activeMenu === 'integrations' ? styles.navItemActive : ''}`}
            onClick={() => setActiveMenu('integrations')}
          >
            <Plug size={18} />
            Integrations
          </button>
        </nav>
      </div>

      <div className={styles.settingsContent}>
        {activeMenu === 'general' && (
          <div className={styles.generalSettings}>
            <div className={styles.settingsHeader}>
              <h2>General Settings</h2>
              <p>Manage your project identification and descriptive details.</p>
            </div>

            <div className={styles.settingsForm}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className={styles.formField}>
                  <label>Project Key</label>
                  <input
                    type="text"
                    value={formData.key || ''}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  />
                </div>
                <div className={styles.formField}>
                  <label>Category</label>
                  <div className={styles.selectWrapper}>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="E-commerce">E-commerce</option>
                      <option value="Platform">Platform</option>
                      <option value="Mobile App">Mobile App</option>
                    </select>
                    <ChevronDown size={16} className={styles.selectIcon} />
                  </div>
                </div>
                <div className={styles.formField}>
                  <label>Project Lead</label>
                  <div className={styles.selectWrapper}>
                    <select
                      value={formData.leaderId || ''}
                      onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
                    >
                      <option value="">Chọn Project Lead...</option>
                      {allUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} (@{user.username})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className={styles.selectIcon} />
                  </div>
                </div>
              </div>

              <div className={styles.formField}>
                <label>Project Description</label>
                <textarea
                  rows={6}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a detailed description..."
                />
              </div>

              <div className={styles.formActions}>
                <button className={styles.cancelBtn}>Hủy</button>
                <button
                  className={styles.saveBtn}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>

            <div className={styles.dangerZone}>
              <div className={styles.dangerHeader}>
                <AlertTriangle size={20} color="#ef4444" />
                <h3>Khu vực nguy hiểm</h3>
              </div>

              <div className={styles.dangerCard}>
                <div className={styles.dangerInfo}>
                  <h4>Xóa dự án này</h4>
                  <p>Sau khi bạn xóa một dự án, hành động này không thể hoàn tác. Vui lòng chắc chắn rằng bạn muốn xóa tất cả dữ liệu liên quan.</p>
                </div>
                <button
                  className={styles.deleteProjectBtn}
                  onClick={() => onConfirmDelete(project.id)}
                >
                  Xóa dự án
                </button>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'members' && (
          <div className={styles.membersSection}>
            <div className={styles.settingsHeader}>
              <h2>Thành viên dự án</h2>
              <p>Quản lý những người có quyền truy cập và cộng tác trong dự án này.</p>
            </div>

            <div className={styles.addMemberForm}>
              <div className={styles.userSelect}>
                <label className={styles.selectLabel}>Thêm thành viên mới</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    disabled={isAddingMember}
                  >
                    <option value="">Chọn người dùng hệ thống...</option>
                    {availableUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} (@{user.username})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className={styles.selectIcon} />
                </div>
              </div>
              <button
                className={styles.saveBtn}
                onClick={handleAddMember}
                disabled={!selectedUserId || isAddingMember}
              >
                {isAddingMember ? (
                  <Loader2 size={18} className={styles.animateSpin} />
                ) : (
                  <>
                    <UserPlus size={18} style={{ marginRight: '8px' }} />
                    Thêm thành viên
                  </>
                )}
              </button>
            </div>

            <div className={styles.membersHeader}>
              <h3 className={styles.sidebarTitle} style={{ padding: 0, marginTop: '16px' }}>
                DANH SÁCH THÀNH VIÊN ({members.length})
              </h3>
            </div>

            {isLoadingMembers ? (
              <div className={styles.placeholderSection}>
                <Loader2 size={40} className={styles.animateSpin} style={{ color: 'var(--primary)', margin: '0 auto' }} />
                <p>Đang tải danh sách thành viên...</p>
              </div>
            ) : (
              <div className={styles.membersList}>
                {members.length > 0 ? (
                  members.map((member) => (
                    <div key={member.id} className={styles.memberCard}>
                      <div className={styles.memberAvatar}>
                        <img
                          src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff`}
                          alt={member.name}
                          suppressHydrationWarning
                        />
                      </div>
                      <div className={styles.memberInfo}>
                        <div className={styles.memberName}>{member.name}</div>
                        <div className={styles.memberRole}>{member.role || 'Member'}</div>
                      </div>
                      <button 
                        className={styles.removeMemberBtn} 
                        title="Xóa khỏi dự án"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className={styles.placeholderSection} style={{ gridColumn: '1 / -1' }}>
                    <Users size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
                    <p>Chưa có thành viên nào trong dự án này.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}


        {activeMenu !== 'general' && activeMenu !== 'members' && (
          <div className={styles.placeholderSection}>
            <div className={styles.settingsHeader}>
              <h2>{activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)} Settings</h2>
              <p>This section is under development.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SettingsTab;
