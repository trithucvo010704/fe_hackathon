'use client';

import React from 'react';
import { useProject } from '../context/ProjectContext';
import StoriesTab from '../tabs/StoriesTab';

export default function StoriesPage() {
  const { 
    stories, epics, selectedEpicFilter, setSelectedEpicFilter,
    storyStatusFilter, setStoryStatusFilter,
    setIsStoryModalOpen, setEditingStory,
    setIsEditStoryModalOpen, handleDeleteStory,
    handleStoryClick, onlyMe, setOnlyMe
  } = useProject();
  
  return (
    <StoriesTab 
      stories={stories}
      epics={epics}
      selectedEpicFilter={selectedEpicFilter}
      setSelectedEpicFilter={setSelectedEpicFilter}
      storyStatusFilter={storyStatusFilter}
      setStoryStatusFilter={setStoryStatusFilter}
      setIsStoryModalOpen={setIsStoryModalOpen}
      setEditingStory={setEditingStory}
      setIsEditStoryModalOpen={setIsEditStoryModalOpen}
      handleDeleteStory={handleDeleteStory}
      onStoryClick={handleStoryClick}
      onlyMe={onlyMe}
      setOnlyMe={setOnlyMe}
    />
  );
}
