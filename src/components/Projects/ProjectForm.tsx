import React, { useState, useEffect } from 'react';
import { CreateProjectInput, Project, User } from '@/lib/types';
import { userService } from '@/lib/services/user.service';
import styles from './ProjectForm.module.css';

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: CreateProjectInput) => void;
  isLoading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<CreateProjectInput>({
    name: initialData?.name || '',
    key: initialData?.key || '',
    description: initialData?.description || '',
    leaderId: initialData?.leaderId || '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate key from name if key hasn't been manually edited much
    if (name === 'name' && !initialData && formData.key === (formData.name.split(' ').map(s => s[0]).join('').toUpperCase())) {
      const generatedKey = value.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 5);
      setFormData(prev => ({ ...prev, name: value, key: generatedKey }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Project Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter project name"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="key" className={styles.label}>Project Key</label>
          <input
            type="text"
            id="key"
            name="key"
            value={formData.key}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g. PROJ"
            maxLength={10}
            required
          />
        </div>
      </div>
      
      <div className={styles.field}>
        <label htmlFor="leaderId" className={styles.label}>Project Lead</label>
        <select
          id="leaderId"
          name="leaderId"
          value={formData.leaderId}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select Project Lead</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.username})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Describe the project goals and scope"
          rows={5}
          required
        />
      </div>
      
      <button type="submit" className={styles.submitBtn} disabled={isLoading}>
        {isLoading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  );
};

export default ProjectForm;
