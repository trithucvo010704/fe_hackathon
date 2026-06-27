'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import ProjectForm from '@/components/Projects/ProjectForm';
import { projectService } from '@/lib/services/project.service';
import { toast } from '@/lib/toast';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Project } from '@/lib/types';
import styles from '../../projects.module.css';

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await projectService.getProjectById(id as string);
      setProject(data);
    } catch (err) {
      toast.error('Failed to fetch project details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      await projectService.updateProject(id as string, data);
      toast.success('Project updated successfully');
      navigate('/projects');
    } catch (err) {
      toast.error('Failed to update project');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="loading-screen"><div className="loader"></div></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="content-area">
          <Link to="/projects" className={styles.backLink}>
            <ChevronLeft size={18} />
            Back to Projects
          </Link>
          
          <div className={styles.formHeader}>
            <h1 className={styles.pageTitle}>Edit Project</h1>
            <p className={styles.pageSubtitle}>Update your project information and configuration.</p>
          </div>

          {project && (
            <ProjectForm 
              initialData={project} 
              onSubmit={handleSubmit} 
              isLoading={isSaving} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
