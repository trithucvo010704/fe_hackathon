'use client';

import React from 'react';
import { useProject } from '../context/ProjectContext';
import DocumentsTab from '../tabs/DocumentsTab';

export default function DocumentsPage() {
  const { project } = useProject();
  
  if (!project) return null;

  return (
    <DocumentsTab project={project} />
  );
}
