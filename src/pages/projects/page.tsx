'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import ProjectCard from '@/components/Projects/ProjectCard';
import { projectService } from '@/lib/services/project.service';
import { Project } from '@/lib/types';
import { Plus, LayoutGrid, List as ListIcon, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './projects.module.css';

import { toast } from '@/lib/toast';
import { useConfirm } from '@/components/Modal/ConfirmContext';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects. Please try again.');
      toast.error('Failed to load projects');
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
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Projects</h1>
              <p className={styles.pageSubtitle}>Manage and monitor all your active development projects.</p>
            </div>
            <Link to="/projects/new" className={styles.createBtn}>
              <Plus size={20} />
              Create Project
            </Link>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input type="text" placeholder="Search projects..." />
            </div>
            <div className={styles.viewToggle}>
              <button className={`${styles.toggleBtn} ${styles.active}`}><LayoutGrid size={18} /></button>
              <button className={styles.toggleBtn}><ListIcon size={18} /></button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-screen">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className={styles.errorState}>{error}</div>
          ) : projects.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No projects found</h3>
              <p>Get started by creating your first project.</p>
              <Link to="/projects/new" className={styles.createBtn}>Create Project</Link>
            </div>
          ) : (
            <div className={styles.projectGrid}>
              {projects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
