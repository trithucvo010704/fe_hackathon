'use client';

import React from 'react';
import { useProject } from '../context/ProjectContext';
import BacklogTab from '../tabs/BacklogTab';

export default function BacklogPage() {
  const { project, sprints, fetchProjectDetails } = useProject();
  
  if (!project) return null;

  return (
    <BacklogTab 
      project={project} 
      sprints={sprints} 
      onRefresh={fetchProjectDetails} 
    />
  );
}
