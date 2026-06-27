'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Book,
  Bug,
  CheckSquare,
  Clock,
  User as UserIcon,
  Loader2,
  Calendar,
  AlertCircle,
  Server,
  Code,
  Laptop,
  Smartphone,
  Palette,
  FileText
} from 'lucide-react';
import { Project, Sprint, ProjectTask, User } from '@/lib/types';
import { sprintService } from '@/lib/services/sprint.service';
import { taskService } from '@/lib/services/task.service';
import { userService } from '@/lib/services/user.service';
import { toast } from '@/lib/toast';
import TaskModal from '@/components/Tasks/TaskModal';
import SprintModal from '@/components/Sprints/SprintModal';
import styles from '../details.module.css';

interface BacklogTabProps {
  project: Project;
  sprints: Sprint[];
  onRefresh: () => void;
}

export default function BacklogTab({ project, sprints, onRefresh }: BacklogTabProps) {
  const [backlogTasks, setBacklogTasks] = useState<ProjectTask[]>([]);
  const [sprintTasks, setSprintTasks] = useState<Record<string, ProjectTask[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({
    'backlog': true
  });

  // Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchBacklogData();
  }, [project.id, sprints]);

  const fetchBacklogData = async () => {
    setIsLoading(true);
    try {
      // Fetch backlog tasks
      const backlogData = await taskService.getBacklogTasks(project.id);
      setBacklogTasks(backlogData || []);

      // Fetch tasks for each sprint
      const sprintTasksMap: Record<string, ProjectTask[]> = {};
      await Promise.all(sprints.map(async (sprint) => {
        try {
          const tasks = await taskService.getSprintTasks(sprint.id);
          sprintTasksMap[sprint.id] = tasks || [];
          // By default, expand active sprints
          if (sprint.status === 'ACTIVE' && expandedSprints[sprint.id] === undefined) {
            setExpandedSprints(prev => ({ ...prev, [sprint.id]: true }));
          }
        } catch (err) {
          console.error(`Failed to fetch tasks for sprint ${sprint.id}:`, err);
          sprintTasksMap[sprint.id] = [];
        }
      }));
      setSprintTasks(sprintTasksMap);
    } catch (error) {
      console.error('Failed to fetch backlog data:', error);
      toast.error('Không thể tải dữ liệu Backlog');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSprint = (sprintId: string) => {
    setExpandedSprints(prev => ({ ...prev, [sprintId]: !prev[sprintId] }));
  };

  const handleOpenTaskModal = (sprintId?: string) => {
    setSelectedSprintId(sprintId);
    setIsTaskModalOpen(true);
  };

  const handleTaskCreated = (newTask: ProjectTask) => {
    fetchBacklogData();
    if (onRefresh) onRefresh();
  };

  const handleSprintCreated = (newSprint: Sprint) => {
    if (onRefresh) onRefresh();
  };

  const handleStartSprint = async (sprintId: string) => {
    try {
      await sprintService.startSprint(sprintId);
      toast.success('Đã bắt đầu Sprint!');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Failed to start sprint:', error);
      toast.error('Không thể bắt đầu Sprint');
    }
  };

  const handleCompleteSprint = async (sprintId: string) => {
    try {
      await sprintService.completeSprint(sprintId);
      toast.success('Đã kết thúc Sprint!');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Failed to complete sprint:', error);
      toast.error('Không thể kết thúc Sprint');
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropTask = async (e: React.DragEvent, targetSprintId: string | null) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    try {
      if (targetSprintId) {
        await taskService.moveToSprint(taskId, targetSprintId);
      } else {
        await taskService.moveToBacklog(taskId);
      }
      toast.success('Đã di chuyển công việc');
      fetchBacklogData();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Failed to move task:', error);
      toast.error('Không thể di chuyển công việc');
    }
  };

  const renderTask = (task: ProjectTask) => (
    <div 
      key={task.id} 
      className={styles.backlogTaskItem}
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
    >
      <div className={styles.taskMainInfo}>
        <div className={styles.taskTypeIcon}>
          {task.category === 'API' ? <Server size={14} color="#3b82f6" /> :
            task.category === 'SERVICE' ? <Code size={14} color="#8b5cf6" /> :
              task.category === 'FE' ? <Laptop size={14} color="#f59e0b" /> :
                task.category === 'MOBILE' ? <Smartphone size={14} color="#ec4899" /> :
                  task.category === 'DESIGN' ? <Palette size={14} color="#ef4444" /> :
                    task.category === 'DOC' ? <FileText size={14} color="#64748b" /> :
                      <CheckSquare size={14} color="#10b981" />}
        </div>
        <span className={styles.taskKey}>{task.key}</span>
        <span className={styles.taskTitle}>{task.title}</span>
      </div>
      <div className={styles.taskMetaInfo}>
        <div className={`${styles.priorityTag} ${styles[(task.priority || 'MEDIUM').toLowerCase()]}`}>
          {task.priority === 'HIGH' ? <ChevronDown size={14} style={{ transform: 'rotate(180deg)' }} /> :
            task.priority === 'MEDIUM' ? <ChevronDown size={14} style={{ transform: 'rotate(180deg)' }} /> :
              <ChevronDown size={14} />}
          {task.priority}
        </div>
        {task.storyPoint !== undefined && (
          <div className={styles.storyPointBadge}>{task.storyPoint}</div>
        )}
        <div className={styles.taskAssignee}>
          <div className={styles.avatarPlaceholder}>
            {task.assignee?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading && backlogTasks.length === 0) {
    return (
      <div className={styles.emptyPreview}>
        <Loader2 className={styles.spin} size={40} />
        <p>Đang tải dữ liệu Backlog...</p>
      </div>
    );
  }

  return (
    <div className={styles.backlogContainer}>
      {/* Sprints Section */}
      {sprints.map(sprint => (
        <div key={sprint.id} className={styles.sprintCard}>
          <div className={styles.sprintHeader} onClick={() => toggleSprint(sprint.id)}>
            <div className={styles.sprintHeaderLeft}>
              {expandedSprints[sprint.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              <h3 className={styles.sprintName}>{sprint.name}</h3>
              <span className={styles.sprintDate}>
                ({new Date(sprint.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' })} - {new Date(sprint.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' })})
              </span>
              <span className={styles.issueCount}>
                • {sprintTasks[sprint.id]?.length || 0} issues
              </span>
              {sprint.status === 'ACTIVE' && (
                <span className={styles.activeSprintBadge}>ACTIVE</span>
              )}
            </div>
            <div className={styles.sprintHeaderRight}>
              <div className={styles.sprintPoints}>
                {sprintTasks[sprint.id]?.reduce((sum, t) => sum + (t.storyPoint || 0), 0)} points
              </div>
              <button className={styles.startSprintBtn} onClick={(e) => {
                e.stopPropagation();
                if (sprint.status === 'ACTIVE') {
                  handleCompleteSprint(sprint.id);
                } else {
                  handleStartSprint(sprint.id);
                }
              }}>
                {sprint.status === 'ACTIVE' ? 'Complete Sprint' : 'Start Sprint'}
              </button>
              <MoreHorizontal size={20} className={styles.moreIcon} />
            </div>
          </div>

          {expandedSprints[sprint.id] && (
            <div 
              className={styles.sprintTaskList}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropTask(e, sprint.id)}
            >
              {sprintTasks[sprint.id]?.length === 0 ? (
                <div className={styles.emptySprintState}>Kéo thả hoặc tạo task mới cho sprint này</div>
              ) : (
                sprintTasks[sprint.id]?.map(renderTask)
              )}
              <button
                className={styles.createTaskInline}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenTaskModal(sprint.id);
                }}
              >
                <Plus size={16} />
                Create issue
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Backlog Section */}
      <div className={styles.backlogSection}>
        <div className={styles.sprintHeader} onClick={() => toggleSprint('backlog')}>
          <div className={styles.sprintHeaderLeft}>
            {expandedSprints['backlog'] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <h3 className={styles.sprintName}>Backlog</h3>
            <span className={styles.issueCount}>
              ({backlogTasks.length} issues)
            </span>
          </div>
          <div className={styles.sprintHeaderRight}>
            <button
              className={styles.createSprintBtn}
              onClick={(e) => {
                e.stopPropagation();
                setIsSprintModalOpen(true);
              }}
            >
              Create Sprint
            </button>
          </div>
        </div>

        {expandedSprints['backlog'] && (
          <div 
            className={styles.sprintTaskList}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropTask(e, null)}
          >
            {backlogTasks.length === 0 ? (
              <div className={styles.emptySprintState}>Backlog đang trống</div>
            ) : (
              backlogTasks.map(renderTask)
            )}
            <button
              className={styles.createTaskInline}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenTaskModal(undefined);
              }}
            >
              <Plus size={16} />
              Create issue
            </button>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={project.id}
        sprintId={selectedSprintId}
        onTaskCreated={handleTaskCreated}
      />

      {/* Create Sprint Modal */}
      <SprintModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        projectId={project.id}
        onSprintCreated={handleSprintCreated}
      />
    </div>
  );
}
