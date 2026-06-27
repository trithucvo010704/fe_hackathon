'use client';

import React from 'react';
import { useProject } from '../context/ProjectContext';
import EpicsTab from '../tabs/EpicsTab';

export default function EpicsPage() {
  const { 
    epics, stories, searchTerm, setSearchTerm, 
    sortBy, setSortBy, sortOrder, setSortOrder,
    setEditingEpic, setIsEditEpicModalOpen,
    handleDeleteEpic, setIsEpicModalOpen,
    handleEpicClick, onlyMe, setOnlyMe
  } = useProject();
  
  return (
    <EpicsTab 
      epics={epics}
      stories={stories}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      sortBy={sortBy}
      setSortBy={setSortBy}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      setEditingEpic={setEditingEpic}
      setIsEditEpicModalOpen={setIsEditEpicModalOpen}
      handleDeleteEpic={handleDeleteEpic}
      setIsEpicModalOpen={setIsEpicModalOpen}
      onEpicClick={handleEpicClick}
      onlyMe={onlyMe}
      setOnlyMe={setOnlyMe}
    />
  );
}
