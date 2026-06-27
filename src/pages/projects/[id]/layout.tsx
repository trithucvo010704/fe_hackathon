'use client';

import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import { ProjectProvider, useProject } from './context/ProjectContext';
import styles from './details.module.css';
import { Globe, Share2, Plus, Search, Loader2 } from 'lucide-react';
import Modal from '@/components/Modal/Modal';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import DetailsPanel from '@/components/Details/DetailsPanel';

function ProjectLayoutContent({ children }: { children: React.ReactNode }) {
  const {
    project, isLoading, activeTab,
    isEpicModalOpen, setIsEpicModalOpen,
    isEditEpicModalOpen, setIsEditEpicModalOpen,
    isStoryModalOpen, setIsStoryModalOpen,
    isEditStoryModalOpen, setIsEditStoryModalOpen,
    newEpic, setNewEpic, handleCreateEpic,
    editingEpic, setEditingEpic, handleUpdateEpic,
    newStory, setNewStory, handleCreateStory,
    editingStory, setEditingStory, handleUpdateStory,
    confirmModal, setConfirmModal,
    selectedItem, detailType, isDetailPanelOpen, setIsDetailPanelOpen,
    epics
  } = useProject();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (isLoading) {
    return <div className={styles.loading}>Loading project...</div>;
  }

  if (!project) {
    return <div className={styles.error}>Project not found</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'backlog', label: 'Backlog' },
    { id: 'sprint', label: 'Active Sprint' },
    { id: 'epics', label: 'Epics' },
    { id: 'stories', label: 'Story' },
    { id: 'repositories', label: 'Repositories' },
    { id: 'documents', label: 'Documents' },
    { id: 'api-specs', label: 'API Specs' },
    { id: 'db-specs', label: 'DB Table Specs' },
    { id: 'settings', label: 'Setting' },
  ];

  const handleTabClick = (tabId: string) => {
    // Current pathname: /projects/[id]/...
    // We want to replace the last part or append
    const segments = pathname.split('/');
    // Check if the last segment is one of the tab IDs
    const lastSegment = segments[segments.length - 1];
    const isTab = tabs.some(t => t.id === lastSegment);

    if (isTab) {
      segments[segments.length - 1] = tabId;
    } else {
      segments.push(tabId);
    }

    navigate(segments.join('/'));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className={styles.header}>
          <div className={styles.topSection}>
            <div className={styles.projectTitleWrapper}>
              <div className={styles.iconBox}>
                {project.name?.charAt(0) || 'P'}
              </div>
              <div className={styles.titleInfo}>
                <h1>{project.name}</h1>
                <p><Globe size={14} /> Platform Development Project</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.shareBtn}>
                <Share2 size={18} />
                Share
              </button>
              <button className={styles.newTaskBtn} onClick={() => handleTabClick('stories')}>
                <Plus size={18} />
                New Task
              </button>
            </div>
          </div>

          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>

        <div className="content-area" style={{ paddingTop: 0 }}>
          {children}
        </div>

        <DetailsPanel
          isOpen={isDetailPanelOpen}
          onClose={() => setIsDetailPanelOpen(false)}
          item={selectedItem}
          type={detailType}
        />

        {/* Modals moved from page.tsx to layout to keep them accessible from any tab */}
        {/* Create Epic Modal */}
        <Modal isOpen={isEpicModalOpen} onClose={() => setIsEpicModalOpen(false)} title="Add New Epic">
          <form onSubmit={handleCreateEpic} className="project-form">
            <div className="form-group">
              <label>Epic Title</label>
              <input
                type="text"
                value={newEpic.title}
                onChange={(e) => setNewEpic({ ...newEpic, title: e.target.value })}
                placeholder="e.g. User Authentication"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newEpic.description}
                onChange={(e) => setNewEpic({ ...newEpic, description: e.target.value })}
                placeholder="What is this epic about?"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select value={newEpic.priority} onChange={(e) => setNewEpic({ ...newEpic, priority: e.target.value })}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={newEpic.deadline}
                  onChange={(e) => setNewEpic({ ...newEpic, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsEpicModalOpen(false)}>Hủy</button>
              <button type="submit" className="btn-primary">Tạo Epic</button>
            </div>
          </form>
        </Modal>

        {/* Edit Epic Modal */}
        <Modal isOpen={isEditEpicModalOpen} onClose={() => setIsEditEpicModalOpen(false)} title="Edit Epic">
          {editingEpic && (
            <form onSubmit={handleUpdateEpic} className="project-form">
              <div className="form-group">
                <label>Epic Title</label>
                <input
                  type="text"
                  value={editingEpic.title}
                  onChange={(e) => setEditingEpic({ ...editingEpic, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingEpic.description}
                  onChange={(e) => setEditingEpic({ ...editingEpic, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={editingEpic.status} onChange={(e) => setEditingEpic({ ...editingEpic, status: e.target.value as any })}>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={editingEpic.priority} onChange={(e) => setEditingEpic({ ...editingEpic, priority: e.target.value as any })}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsEditEpicModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Cập nhật Epic</button>
              </div>
            </form>
          )}
        </Modal>

        {/* Create Story Modal */}
        <Modal isOpen={isStoryModalOpen} onClose={() => setIsStoryModalOpen(false)} title="Add New Story">
          <form onSubmit={handleCreateStory} className="project-form">
            <div className="form-group">
              <label>Story Title</label>
              <input
                type="text"
                value={newStory.title}
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                placeholder="e.g. As a user, I want to login"
                required
              />
            </div>
            <div className="form-group">
              <label>Epic</label>
              <select
                value={newStory.epicId}
                onChange={(e) => setNewStory({ ...newStory, epicId: e.target.value })}
                required
              >
                <option value="">Select an Epic</option>
                {epics.map(epic => (
                  <option key={epic.id} value={epic.id}>{epic.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newStory.description}
                onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select value={newStory.priority} onChange={(e) => setNewStory({ ...newStory, priority: e.target.value })}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={newStory.deadline}
                  onChange={(e) => setNewStory({ ...newStory, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsStoryModalOpen(false)}>Hủy</button>
              <button type="submit" className="btn-primary">Tạo Story</button>
            </div>
          </form>
        </Modal>

        {/* Edit Story Modal */}
        <Modal isOpen={isEditStoryModalOpen} onClose={() => setIsEditStoryModalOpen(false)} title="Edit Story">
          {editingStory && (
            <form onSubmit={handleUpdateStory} className="project-form">
              <div className="form-group">
                <label>Story Title</label>
                <input
                  type="text"
                  value={editingStory.title}
                  onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Epic</label>
                <select
                  value={editingStory.epicId}
                  onChange={(e) => setEditingStory({ ...editingStory, epicId: e.target.value })}
                  required
                >
                  <option value="">Select an Epic</option>
                  {epics.map(epic => (
                    <option key={epic.id} value={epic.id}>{epic.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={editingStory.status} onChange={(e) => setEditingStory({ ...editingStory, status: e.target.value as any })}>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsEditStoryModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Cập nhật Story</button>
              </div>
            </form>
          )}
        </Modal>

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
        />

      </main>
    </div>
  );
}

export default function ProjectLayout({ children }: { children?: React.ReactNode }) {
  return (
    <ProjectProvider>
      <ProjectLayoutContent>{children || <Outlet />}</ProjectLayoutContent>
    </ProjectProvider>
  );
}
