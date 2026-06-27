'use client';

import React from 'react';
import { useProject } from '../context/ProjectContext';
import ApiSpecsTab from '../tabs/ApiSpecsTab';

export default function ApiSpecsPage() {
  const { project } = useProject();
  
  if (!project) return null;

  return (
    <ApiSpecsTab project={project} />
  );
}
