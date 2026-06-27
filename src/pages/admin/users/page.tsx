'use client';

import React, { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/Auth/AdminGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { userService } from '@/lib/services/user.service';
import { User } from '@/lib/types';
import { 
  Check, 
  X, 
  Edit2, 
  UserCheck, 
  Shield, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Activity,
  User as UserIcon,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { toast } from '@/lib/toast';
import styles from '../management.module.css';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAdminUsers();
      setUsers(data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleActivate = async (userId: string) => {
    try {
      await userService.activateUser(userId);
      toast.success('User activated successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to activate user');
    }
  };

  const handleToggleRole = async (user: User, role: string) => {
    const roles = user.roles || [];
    const newRoles = roles.includes(role)
      ? roles.filter(r => r !== role)
      : [...roles, role];

    try {
      await userService.updateUser(user.id, { roles: newRoles });
      toast.success('Roles updated');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update roles');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && user.isActive) || 
      (statusFilter === 'PENDING' && !user.isActive);
      
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminGuard>
      <DashboardLayout>
        <div className={styles.storyManagement}>
          <div className={styles.storyHeader}>
            <div className={styles.titleGroup}>
              <h2>Quản lý Người dùng</h2>
            </div>
            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
              {users.length} total users registered
            </div>
          </div>

          <div className={styles.storyToolbar}>
            <div className={styles.storyFilters}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name, email or username..." 
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className={styles.statusTabs}>
                <button 
                  className={`${styles.statusTab} ${statusFilter === 'ALL' ? styles.activeTab : ''}`}
                  onClick={() => setStatusFilter('ALL')}
                >
                  All Users
                </button>
                <button 
                  className={`${styles.statusTab} ${statusFilter === 'ACTIVE' ? styles.activeTab : ''}`}
                  onClick={() => setStatusFilter('ACTIVE')}
                >
                  Active
                </button>
                <button 
                  className={`${styles.statusTab} ${statusFilter === 'PENDING' ? styles.activeTab : ''}`}
                  onClick={() => setStatusFilter('PENDING')}
                >
                  Pending
                </button>
              </div>
            </div>
          </div>

          <div className={styles.storyTableContainer}>
            <table className={styles.storyTable}>
              <thead>
                <tr>
                  <th>USER IDENTITY</th>
                  <th>STATUS</th>
                  <th>ROLES</th>
                  <th>ACCESS CONTROL</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                      <Activity className="animate-spin" style={{ margin: '0 auto' }} />
                      <p style={{ marginTop: '10px', color: '#64748b' }}>Retrieving user directory...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                      <p style={{ color: '#64748b' }}>No users matching your criteria.</p>
                    </td>
                  </tr>
                ) : filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          style={{ height: '40px', width: '40px', borderRadius: '12px', border: '2px solid #f1f5f9' }}
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                          alt=""
                        />
                        <div>
                          <div className={styles.summaryTitle}>{user.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email} • @{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${user.isActive ? styles.statusActive : styles.statusInactive}`}>
                        <span className={styles.statusDot}></span>
                        {user.isActive ? 'Active' : 'Pending Approval'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {user.roles?.map(role => (
                          <span key={role} className={styles.epicTag} style={{ fontSize: '0.7rem' }}>
                            <Shield size={12} /> {role.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionMenu}>
                        {!user.isActive && (
                          <button
                            onClick={() => handleActivate(user.id)}
                            className={styles.actionBtn}
                            style={{ color: '#10b981', background: '#ecfdf5' }}
                            title="Approve User"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleRole(user, 'admin')}
                          className={styles.actionBtn}
                          style={{ 
                            color: user.roles?.includes('admin') ? '#f43f5e' : '#6366f1',
                            background: user.roles?.includes('admin') ? '#fff1f2' : '#eef2ff'
                          }}
                          title={user.roles?.includes('admin') ? 'Revoke Admin' : 'Promote to Admin'}
                        >
                          {user.roles?.includes('admin') ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
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
              Showing 1-{filteredUsers.length} of {filteredUsers.length} users
            </div>
            <div className={styles.paginationControls}>
              <button className={styles.pageBtn} disabled><ChevronLeft size={16} /></button>
              <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
              <button className={styles.pageBtn} disabled><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AdminGuard>
  );
}
