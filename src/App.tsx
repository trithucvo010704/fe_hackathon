import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Global Contexts & Providers
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { LayoutProvider } from '@/components/Common/LayoutContext';
import { ConfirmProvider } from '@/components/Modal/ConfirmContext';
import ToastContainer from '@/components/Common/Toast';

// Pages
import Home from './pages/page';
import ProjectsPage from './pages/projects/page';
import NewProjectPage from './pages/projects/new/page';
import ProjectDetailsRedirect from './pages/projects/[id]/page';
import ProjectLayout from './pages/projects/[id]/layout';
import OverviewTab from './pages/projects/[id]/overview/page';
import BacklogTab from './pages/projects/[id]/backlog/page';
import SprintTab from './pages/projects/[id]/sprint/page';
import EpicsTab from './pages/projects/[id]/epics/page';
import StoriesTab from './pages/projects/[id]/stories/page';
import RepositoriesTab from './pages/projects/[id]/repositories/page';
import DocumentsTab from './pages/projects/[id]/documents/page';
import ApiSpecsTab from './pages/projects/[id]/api-specs/page';
import DbSpecsTab from './pages/projects/[id]/db-specs/page';
import SettingsTab from './pages/projects/[id]/settings/page';
import EditProject from './pages/projects/[id]/edit/page';

import ChatPage from './pages/chat/page';
import GuidelinesPage from './pages/guidelines/page';
import LogoutPage from './pages/logout/page';
import AuthCallbackPage from './pages/auth/callback/page';

import AdminUsersPage from './pages/admin/users/page';
import AdminRolesPage from './pages/admin/roles/page';
import AiModelsPage from './pages/admin/ai/models/page';
import AiEnvsPage from './pages/admin/ai/envs/page';
import AiBrainsPage from './pages/admin/ai/brains/page';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LayoutProvider>
          <ConfirmProvider>
            <Routes>
              {/* Core App Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/new" element={<NewProjectPage />} />
              
              {/* Dynamic Project Routes */}
              <Route path="/projects/:id" element={<ProjectDetailsRedirect />} />
              <Route path="/projects/:id/edit" element={<EditProject />} />
              
              {/* Nested Project Details Routes (wrapped in ProjectLayout) */}
              <Route element={<ProjectLayout />}>
                <Route path="/projects/:id/overview" element={<OverviewTab />} />
                <Route path="/projects/:id/backlog" element={<BacklogTab />} />
                <Route path="/projects/:id/sprint" element={<SprintTab />} />
                <Route path="/projects/:id/epics" element={<EpicsTab />} />
                <Route path="/projects/:id/stories" element={<StoriesTab />} />
                <Route path="/projects/:id/repositories" element={<RepositoriesTab />} />
                <Route path="/projects/:id/documents" element={<DocumentsTab />} />
                <Route path="/projects/:id/api-specs" element={<ApiSpecsTab />} />
                <Route path="/projects/:id/db-specs" element={<DbSpecsTab />} />
                <Route path="/projects/:id/settings" element={<SettingsTab />} />
              </Route>

              {/* Chat & Others */}
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/guidelines" element={<GuidelinesPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />

              {/* Admin Panel */}
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/roles" element={<AdminRolesPage />} />
              <Route path="/admin/ai/models" element={<AiModelsPage />} />
              <Route path="/admin/ai/envs" element={<AiEnvsPage />} />
              <Route path="/admin/ai/brains" element={<AiBrainsPage />} />

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer />
          </ConfirmProvider>
        </LayoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
