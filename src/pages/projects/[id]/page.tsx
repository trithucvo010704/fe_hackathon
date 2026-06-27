'use client';

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProjectDetailsRedirect() {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    navigate(`/projects/${id}/overview`, { replace: true });
  }, [id, navigate]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>
      Redirecting to overview...
    </div>
  );
}
