'use client';

import React from 'react';
import { useProject } from '../context/ProjectContext';
import RepositoriesTab from '../tabs/RepositoriesTab';

export default function RepositoriesPage() {
  const { 
    repos, handleCreateRepo, handleUpdateRepo, handleDeleteRepo
  } = useProject();
  
  return (
    <RepositoriesTab 
      repos={repos}
      handleCreateRepo={handleCreateRepo}
      handleUpdateRepo={handleUpdateRepo}
      handleDeleteRepo={handleDeleteRepo}
    />
  );
}
