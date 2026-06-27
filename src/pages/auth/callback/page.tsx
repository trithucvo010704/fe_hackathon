'use client';

import { useEffect, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAuthData } from '@/lib/auth';

function CallbackContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');

    if (token && username) {
      setAuthData(token, username);
      navigate('/', { replace: true });
    } else {
      console.error('Missing token or username in callback params');
      navigate('/logout', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-dark)',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Authenticating...</h2>
        <div className="loader"></div> {/* Assuming there might be a loader in globals.css or I can add one */}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
