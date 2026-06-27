'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Clock,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Book,
  Plus,
  Loader2,
  Filter
} from 'lucide-react';
import { Project, Sprint, ProjectTask, Story, User } from '@/lib/types';
import { taskService } from '@/lib/services/task.service';
import { sprintService } from '@/lib/services/sprint.service';
import { toast } from '@/lib/toast';
import styles from '../details.module.css';

interface ActiveSprintTabProps {
  project: Project;
  activeSprint: Sprint | null;
  stories: Story[];
  onRefresh: () => void;
  onTaskClick: (task: ProjectTask) => void;
  onStoryClick: (story: Story) => void;
}

const COLUMNS = [
  { id: 'BACKLOG', title: 'TO DO' },
  { id: 'IN_PROGRESS', title: 'IN PROGRESS' },
  { id: 'REVIEW', title: 'REVIEW' },
  { id: 'NEED_FIX', title: 'NEED FIX' },
  { id: 'DONE', title: 'DONE' }
];

export default function ActiveSprintTab({
  project,
  activeSprint,
  stories,
  onRefresh,
  onTaskClick,
  onStoryClick
}: ActiveSprintTabProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyMe, setShowOnlyMe] = useState(false);
  const [expandedStories, setExpandedStories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeSprint) {
      fetchSprintTasks();
    } else {
      setIsLoading(false);
    }
  }, [activeSprint?.id]);

  const fetchSprintTasks = async () => {
    if (!activeSprint) return;
    setIsLoading(true);
    try {
      const data = await taskService.getSprintTasks(activeSprint.id);
      setTasks(data || []);

      // Initialize expanded stories
      const initialExpanded: Record<string, boolean> = { 'none': true };
      stories.forEach(story => {
        initialExpanded[story.id] = true;
      });
      setExpandedStories(initialExpanded);
    } catch (error) {
      console.error('Failed to fetch sprint tasks:', error);
      toast.error('Không thể tải danh sách công việc');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.key.toLowerCase().includes(searchQuery.toLowerCase());
      // For simplicity, let's assume we have currentUser logic elsewhere or just skip for now
      return matchesSearch;
    });
  }, [tasks, searchQuery]);

  const tasksByStoryAndStatus = useMemo(() => {
    const map: Record<string, Record<string, ProjectTask[]>> = {};

    // Group tasks by storyId and then by status
    filteredTasks.forEach(task => {
      const storyId = task.storyId || 'none';
      if (!map[storyId]) {
        map[storyId] = {
          'BACKLOG': [],
          'IN_PROGRESS': [],
          'REVIEW': [],
          'NEED_FIX': [],
          'DONE': []
        };
      }
      if (map[storyId][task.status]) {
        map[storyId][task.status].push(task);
      }
    });

    return map;
  }, [filteredTasks]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    const oldTasks = [...tasks];
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));

    try {
      await taskService.updateTaskStatus(taskId, newStatus as any);
      toast.success(`Đã chuyển task sang ${newStatus}`);
    } catch (error) {
      setTasks(oldTasks);
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

    const handleCompleteSprint = async () => {
    if (!activeSprint) return;
    try {
      await sprintService.completeSprint(activeSprint.id);
      toast.success('Đã kết thúc Sprint!');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Failed to complete sprint:', error);
      toast.error('Không thể kết thúc Sprint');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} />
        <p>Đang tải dữ liệu Sprint...</p>
      </div>
    );
  }

  if (!activeSprint) {
    return (
      <div className={styles.emptyBoardState}>
        <div className={styles.emptyBoardIcon}>
          <Clock size={48} color="#94a3b8" />
        </div>
        <h3>Không có Sprint nào đang hoạt động</h3>
        <p>Hãy vào tab Backlog để bắt đầu một Sprint mới.</p>
      </div>
    );
  }

  return (
    <div className={styles.boardContainer}>
      {/* Board Header */}
      <div className={styles.boardHeader}>
        <div className={styles.boardHeaderLeft}>
          <div className={styles.boardSearchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles.memberAvatars}>
            <div className={styles.avatarCircle}><img src="https://ui-avatars.com/api/?name=Quang+Le&background=random" /></div>
            <div className={styles.avatarCircle}><img src="https://ui-avatars.com/api/?name=Anh+Nguyen&background=random" /></div>
            <div className={styles.avatarCount}>+3</div>
          </div>
          <button
            className={`${styles.filterBtn} ${showOnlyMe ? styles.active : ''}`}
            onClick={() => setShowOnlyMe(!showOnlyMe)}
          >
            Chi tôi
          </button>
        </div>
        <div className={styles.boardHeaderRight}>
          <div className={styles.remainingDays}>
            <Clock size={16} />
            <span>5 ngày còn lại</span>
          </div>
          <button className={styles.completeSprintBtn} onClick={handleCompleteSprint}>
            Complete Sprint
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className={styles.kanbanBoard}>
        {/* Column Headers */}
        <div className={styles.kanbanHeaderRow}>
          {COLUMNS.map(col => (
            <div key={col.id} className={styles.kanbanColumnHeader}>
              {col.title}
            </div>
          ))}
        </div>

        {/* Story Swimlanes */}
        {stories.map(story => {
          const storyTasks = tasksByStoryAndStatus[story.id];
          if (!storyTasks && !searchQuery) return null; // Hide empty stories unless searching

          return (
            <div key={story.id} className={styles.swimlane}>
              <div
                className={styles.swimlaneHeader}
                onClick={() => setExpandedStories(prev => ({ ...prev, [story.id]: !prev[story.id] }))}
              >
                {expandedStories[story.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <div
                  className={styles.storyInfo}
                  onClick={(e) => { e.stopPropagation(); onStoryClick(story); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Book size={16} color="#3b82f6" />
                  <span className={styles.storyKey}>[{story.key}]</span>
                  <span className={styles.storyTitle}>{story.title}</span>
                </div>
              </div>

              {expandedStories[story.id] && (
                <div className={styles.kanbanRow}>
                  {COLUMNS.map(col => (
                    <div
                      key={col.id}
                      className={styles.kanbanCell}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, col.id)}
                    >
                      {storyTasks?.[col.id]?.length > 0 ? (
                        storyTasks[col.id].map(task => (
                          <div
                            key={task.id}
                            className={styles.kanbanCard}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onClick={() => onTaskClick(task)}
                          >
                            <div className={styles.cardHeader}>
                              <span className={`${styles.cardPriority} ${styles[(task.priority || 'MEDIUM').toLowerCase()]}`}>
                                {task.priority || 'MEDIUM'}
                              </span>
                              <span className={styles.cardKey}>{task.key}</span>
                            </div>
                            <div className={styles.cardTitle}>{task.title}</div>
                            <div className={styles.cardFooter}>
                              <div className={styles.cardCategory}>
                                {task.category}
                              </div>
                              <div className={styles.cardAssignee}>
                                <div className={styles.miniAvatar}>
                                  {task.assignee?.charAt(0) || 'U'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.emptyCellState}>
                          {col.id === 'BACKLOG' ? 'Kéo thả để bắt đầu' : 'Không có công việc'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Tasks without story */}
        {tasksByStoryAndStatus['none'] && (
          <div className={styles.swimlane}>
            <div
              className={styles.swimlaneHeader}
              onClick={() => setExpandedStories(prev => ({ ...prev, 'none': !prev['none'] }))}
            >
              {expandedStories['none'] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <span className={styles.storyTitle}>Công việc chưa phân Story</span>
            </div>
            {expandedStories['none'] && (
              <div className={styles.kanbanRow}>
                {COLUMNS.map(col => (
                  <div
                    key={col.id}
                    className={styles.kanbanCell}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                  >
                    {tasksByStoryAndStatus['none']?.[col.id]?.length > 0 ? (
                      tasksByStoryAndStatus['none'][col.id].map(task => (
                        <div
                          key={task.id}
                          className={styles.kanbanCard}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                        >
                          <div className={styles.cardHeader}>
                            <span className={`${styles.cardPriority} ${styles[(task.priority || 'MEDIUM').toLowerCase()]}`}>
                              {task.priority || 'MEDIUM'}
                            </span>
                            <span className={styles.cardKey}>{task.key}</span>
                          </div>
                          <div className={styles.cardTitle}>{task.title}</div>
                          <div className={styles.cardFooter}>
                            <div className={styles.cardCategory}>
                              {task.category}
                            </div>
                            <div className={styles.cardAssignee}>

                              <div className={styles.miniAvatar}>
                                {task.assignee?.charAt(0) || 'U'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyCellState}>Không có công việc</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
