import { useEffect, useState, type DependencyList } from 'react';

export interface LoadableState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useLoadable<T>(
  load: () => Promise<T>,
  deps: DependencyList,
  fallback?: T,
) {
  const [state, setState] = useState<LoadableState<T>>({
    data: fallback ?? null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true, error: null }));

    load()
      .then((data) => {
        if (active) setState({ data, error: null, loading: false });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          data: fallback ?? null,
          error: error instanceof Error ? error.message : 'Load failed',
          loading: false,
        });
      });

    return () => {
      active = false;
    };
  }, deps);

  return state;
}
