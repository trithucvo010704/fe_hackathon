'use client';

import React from 'react';
import { useProject } from '../context/ProjectContext';
import DbSpecsTab from '../tabs/DbSpecsTab';

export default function DbSpecsPage() {
  const { project } = useProject();
  
  if (!project) return null;

  return (
    <DbSpecsTab project={project} />
  );
}
