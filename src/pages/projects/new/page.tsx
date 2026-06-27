'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import ProjectForm from '@/components/Projects/ProjectForm';
import { projectService } from '@/lib/services/project.service';
import { toast } from '@/lib/toast';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from '../projects.module.css';

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await projectService.createProject(data);
      toast.success('Project created successfully');
      navigate('/projects');
    } catch (err) {
      toast.error('Failed to create project');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className={styles.pageTitle}>Create New Project</h1>
            <p className={styles.pageSubtitle}>Fill in the details to initialize a new development workspace.</p>
          </div>

          <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
