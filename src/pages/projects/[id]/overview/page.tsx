'use client';

import React from 'react';
import { useProject } from '../context/ProjectContext';
import OverviewTab from '../tabs/OverviewTab';

export default function OverviewPage() {
  const { project, epics, stories, repos } = useProject();
  
  if (!project) return null;

  return (
    <OverviewTab 
      project={project}
      epics={epics}
      stories={stories}
      repos={repos}
    />
  );
}
