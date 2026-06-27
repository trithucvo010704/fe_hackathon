'use client';

import React from 'react';
import { useProject } from '../context/ProjectContext';
import SettingsTab from '../tabs/SettingsTab';
import { projectService } from '@/lib/services/project.service';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/toast';

export default function SettingsPage() {
  const { project, fetchProject, showConfirm } = useProject();
  const navigate = useNavigate();
  
  if (!project) return null;

  const handleDeleteProject = async (id: string) => {
    showConfirm({
      title: 'Xóa dự án',
      message: 'Bạn có chắc chắn muốn xóa dự án này? Toàn bộ dữ liệu liên quan sẽ bị mất và không thể khôi phục.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await projectService.deleteProject(id);
          toast.success('Project deleted successfully');
          navigate('/projects');
        } catch (err) {
          toast.error('Failed to delete project');
        }
      }
    });
  };

  return (
    <SettingsTab 
      project={project} 
      onUpdate={fetchProject} 
      onConfirmDelete={handleDeleteProject}
    />
  );
}
