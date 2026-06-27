'use client';

import React, { createContext, use, useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Project, Epic, Story, ProjectRepository, Sprint, ProjectTask } from '@/lib/types';
import { projectService } from '@/lib/services/project.service';
import { epicService } from '@/lib/services/epic.service';
import { storyService } from '@/lib/services/story.service';
import { repositoryService } from '@/lib/services/repository.service';
import { sprintService } from '@/lib/services/sprint.service';
import { toast } from '@/lib/toast';

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  type?: 'danger' | 'warning' | 'info';
}

interface ProjectContextType {
  project: Project | null;
  epics: Epic[];
  stories: Story[];
  repos: ProjectRepository[];
  sprints: Sprint[];
  isLoading: boolean;
  activeTab: string;
  fetchProject: () => Promise<void>;
  fetchSubData: () => Promise<void>;
  fetchProjectDetails: () => Promise<void>;
  
  // Modal states & controls
  isEpicModalOpen: boolean;
  setIsEpicModalOpen: (val: boolean) => void;
  isEditEpicModalOpen: boolean;
  setIsEditEpicModalOpen: (val: boolean) => void;
  isStoryModalOpen: boolean;
  setIsStoryModalOpen: (val: boolean) => void;
  isEditStoryModalOpen: boolean;
  setIsEditStoryModalOpen: (val: boolean) => void;
  isRepoModalOpen: boolean;
  setIsRepoModalOpen: (val: boolean) => void;
  
  newEpic: any;
  setNewEpic: (val: any) => void;
  editingEpic: Epic | null;
  setEditingEpic: (epic: Epic | null) => void;
  newStory: any;
  setNewStory: (val: any) => void;
  editingStory: Story | null;
  setEditingStory: (story: Story | null) => void;
  
  // Search/Filter states
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  sortBy: 'title' | 'status' | 'deadline' | 'createdAt';
  setSortBy: (val: 'title' | 'status' | 'deadline' | 'createdAt') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (val: 'asc' | 'desc') => void;
  storyStatusFilter: 'ALL' | 'IN_PROGRESS' | 'DONE';
  setStoryStatusFilter: (val: 'ALL' | 'IN_PROGRESS' | 'DONE') => void;
  selectedEpicFilter: string;
  setSelectedEpicFilter: (val: string) => void;
  onlyMe: boolean;
  setOnlyMe: (val: boolean) => void;
  
  // Detail Panel
  selectedItem: ProjectTask | Story | Epic | null;
  detailType: 'task' | 'story' | 'epic';
  isDetailPanelOpen: boolean;
  handleTaskClick: (task: ProjectTask) => void;
  handleStoryClick: (story: Story) => void;
  handleEpicClick: (epic: Epic) => void;
  setIsDetailPanelOpen: (val: boolean) => void;
  setSelectedItem: (item: ProjectTask | Story | Epic | null) => void;
 
  // Actions
  handleCreateEpic: (e: React.FormEvent) => Promise<void>;
  handleUpdateEpic: (e: React.FormEvent) => Promise<void>;
  handleDeleteEpic: (id: string) => Promise<void>;
  handleCreateStory: (e: React.FormEvent) => Promise<void>;
  handleUpdateStory: (e: React.FormEvent) => Promise<void>;
  handleDeleteStory: (id: string) => Promise<void>;
  handleCreateRepo: (data: { name: string; language: string; framework: string }) => Promise<void>;
  handleUpdateRepo: (id: string, data: { name: string; language: string; framework: string }) => Promise<void>;
  handleDeleteRepo: (id: string) => Promise<void>;
  
  confirmModal: ConfirmModalState;
  setConfirmModal: React.Dispatch<React.SetStateAction<ConfirmModalState>>;
  showConfirm: (options: Omit<ConfirmModalState, 'isOpen'>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const projectId = id as string;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [repos, setRepos] = useState<ProjectRepository[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);

  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false);
  const [isEditEpicModalOpen, setIsEditEpicModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isEditStoryModalOpen, setIsEditStoryModalOpen] = useState(false);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
  
  const [newEpic, setNewEpic] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'OPEN', deadline: '' });
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null);
  const [newStory, setNewStory] = useState({ title: '', description: '', epicId: '', priority: 'MEDIUM', deadline: '' });
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'status' | 'deadline' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [storyStatusFilter, setStoryStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'DONE'>('ALL');
  const [selectedEpicFilter, setSelectedEpicFilter] = useState<string>('ALL');
  const [onlyMe, setOnlyMe] = useState(false);

  const [selectedItem, setSelectedItem] = useState<ProjectTask | Story | Epic | null>(null);
  const [detailType, setDetailType] = useState<'task' | 'story' | 'epic'>('task');
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);


  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'warning' });

  const showConfirm = useCallback((options: Omit<ConfirmModalState, 'isOpen'>) => {
    setConfirmModal({
      ...options,
      isOpen: true,
      onConfirm: async () => {
        await options.onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, []);

  const activeTab = pathname.split('/').pop() || 'overview';

  const handleTaskClick = useCallback((task: ProjectTask) => {
    setSelectedItem(task);
    setDetailType('task');
    setIsDetailPanelOpen(true);
  }, []);

  const handleStoryClick = useCallback((story: Story) => {
    setSelectedItem(story);
    setDetailType('story');
    setIsDetailPanelOpen(true);
  }, []);

  const handleEpicClick = useCallback((epic: Epic) => {
    setSelectedItem(epic);
    setDetailType('epic');
    setIsDetailPanelOpen(true);
  }, []);

  const fetchProject = useCallback(async () => {
    try {
      const data = await projectService.getProjectById(projectId);
      setProject(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const fetchSubData = useCallback(async () => {
    if (!projectId) return;
    try {
      const [epicsData, storiesData, reposData, sprintsData] = await Promise.all([
        epicService.getEpicsByProject(projectId, onlyMe),
        storyService.getStoriesByProject(projectId, onlyMe),
        repositoryService.getRepositoriesByProject(projectId),
        sprintService.getSprintsByProject(projectId)
      ]);
      setEpics(epicsData);
      setStories(storiesData);
      setRepos(reposData);
      setSprints(sprintsData);
    } catch (err) {
      console.error('Failed to fetch sub-data:', err);
    }
  }, [projectId, onlyMe]);

  const fetchProjectDetails = useCallback(async () => {
    await fetchSubData();
  }, [fetchSubData]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchSubData();
    }
  }, [projectId, fetchProject, fetchSubData]);

  // Actions
  const handleCreateEpic = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await epicService.createEpic({ ...newEpic, projectId });
      setIsEpicModalOpen(false);
      setNewEpic({ title: '', description: '', priority: 'MEDIUM', status: 'OPEN', deadline: '' });
      fetchSubData();
      toast.success('Epic created successfully');
    } catch (err) {
      toast.error('Failed to create epic');
    }
  }, [newEpic, projectId, fetchSubData]);

  const handleUpdateEpic = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEpic) return;
    try {
      await epicService.updateEpic(editingEpic.id, editingEpic);
      setIsEditEpicModalOpen(false);
      fetchSubData();
      toast.success('Epic updated successfully');
    } catch (err) {
      toast.error('Failed to update epic');
    }
  }, [editingEpic, fetchSubData]);

  const handleDeleteEpic = useCallback(async (id: string) => {
    showConfirm({
      title: 'Delete Epic',
      message: 'Are you sure you want to delete this epic? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await epicService.deleteEpic(id);
          fetchSubData();
          toast.success('Epic deleted successfully');
        } catch (err) {
          toast.error('Failed to delete epic');
        }
      }
    });
  }, [showConfirm, fetchSubData]);

  const handleCreateStory = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await storyService.createStory({ ...newStory, projectId });
      setIsStoryModalOpen(false);
      setNewStory({ title: '', description: '', epicId: '', priority: 'MEDIUM', deadline: '' });
      fetchSubData();
      toast.success('Story created successfully');
    } catch (err) {
      toast.error('Failed to create story');
    }
  }, [newStory, projectId, fetchSubData]);

  const handleUpdateStory = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    try {
      await storyService.updateStory(editingStory.id, editingStory);
      setIsEditStoryModalOpen(false);
      fetchSubData();
      toast.success('Story updated successfully');
    } catch (err) {
      toast.error('Failed to update story');
    }
  }, [editingStory, fetchSubData]);

  const handleDeleteStory = useCallback(async (id: string) => {
    showConfirm({
      title: 'Delete Story',
      message: 'Are you sure you want to delete this story? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await storyService.deleteStory(id);
          fetchSubData();
          toast.success('Story deleted successfully');
        } catch (err) {
          toast.error('Failed to delete story');
        }
      }
    });
  }, [showConfirm, fetchSubData]);

  const handleCreateRepo = useCallback(async (data: { name: string; language: string; framework: string }) => {
    try {
      await repositoryService.addRepository({
        projectId,
        ...data
      });
      fetchSubData();
      toast.success('Repository created successfully');
    } catch (err) {
      toast.error('Failed to create repository');
    }
  }, [projectId, fetchSubData]);

  const handleUpdateRepo = useCallback(async (id: string, data: { name: string; language: string; framework: string }) => {
    try {
      await repositoryService.updateRepository(id, {
        projectId,
        ...data
      });
      fetchSubData();
      toast.success('Repository updated successfully');
    } catch (err) {
      toast.error('Failed to update repository');
    }
  }, [projectId, fetchSubData]);

  const handleDeleteRepo = useCallback(async (id: string) => {
    showConfirm({
      title: 'Xóa Repository',
      message: 'Bạn có chắc chắn muốn xóa repository này khỏi dự án?',
      type: 'danger',
      onConfirm: async () => {
        try {
          await repositoryService.removeRepository(id);
          fetchSubData();
          toast.success('Repository deleted successfully');
        } catch (err) {
          toast.error('Failed to delete repository');
        }
      }
    });
  }, [showConfirm, fetchSubData]);

  const value = useMemo(() => ({
    project, epics, stories, repos, sprints, isLoading, activeTab,
    fetchProject, fetchSubData, fetchProjectDetails,
    isEpicModalOpen, setIsEpicModalOpen,
    isEditEpicModalOpen, setIsEditEpicModalOpen,
    isStoryModalOpen, setIsStoryModalOpen,
    isEditStoryModalOpen, setIsEditStoryModalOpen,
    isRepoModalOpen, setIsRepoModalOpen,
    newEpic, setNewEpic, editingEpic, setEditingEpic,
    newStory, setNewStory, editingStory, setEditingStory,
    searchTerm, setSearchTerm, sortBy, setSortBy, sortOrder, setSortOrder,
    storyStatusFilter, setStoryStatusFilter, selectedEpicFilter, setSelectedEpicFilter,
    onlyMe, setOnlyMe,
    selectedItem, detailType, isDetailPanelOpen, handleTaskClick, handleStoryClick, handleEpicClick, setIsDetailPanelOpen,
    setSelectedItem,
    handleCreateEpic, handleUpdateEpic, handleDeleteEpic,
    handleCreateStory, handleUpdateStory, handleDeleteStory,
    handleCreateRepo, handleUpdateRepo, handleDeleteRepo,
    confirmModal, setConfirmModal, showConfirm
  }), [
    project, epics, stories, repos, sprints, isLoading, activeTab,
    fetchProject, fetchSubData, fetchProjectDetails,
    isEpicModalOpen, isEditEpicModalOpen, isStoryModalOpen, isEditStoryModalOpen, isRepoModalOpen,
    newEpic, editingEpic, newStory, editingStory,
    searchTerm, sortBy, sortOrder, storyStatusFilter, selectedEpicFilter, onlyMe,
    selectedItem, detailType, isDetailPanelOpen, handleTaskClick, handleStoryClick, handleEpicClick,
    handleCreateEpic, handleUpdateEpic, handleDeleteEpic,
    handleCreateStory, handleUpdateStory, handleDeleteStory,
    handleCreateRepo, handleUpdateRepo, handleDeleteRepo,
    confirmModal, showConfirm
  ]);

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = use(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
