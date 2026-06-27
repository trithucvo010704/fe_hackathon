'use client';

import React from 'react';
import { useProject } from '../context/ProjectContext';
import ActiveSprintTab from '../tabs/ActiveSprintTab';

export default function ActiveSprintPage() {
  const { project, sprints, stories, fetchProjectDetails, handleTaskClick, handleStoryClick } = useProject();
  
  if (!project) return null;

  return (
    <ActiveSprintTab 
      project={project} 
      activeSprint={sprints.find(s => s.status === 'ACTIVE') || null}
      stories={stories}
      onRefresh={fetchProjectDetails}
      onTaskClick={handleTaskClick}
      onStoryClick={handleStoryClick}
    />
  );
}
