import { useState, useEffect } from 'react';
import { fetchJson } from '../lib/api';

export const useData = (endpoint, dependencyParams = []) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
    isEmpty: false,
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const data = await fetchJson(endpoint);
        if (isMounted) {
          // Determine emptiness based on array or object
          let isEmpty = false;
          if (Array.isArray(data)) {
            isEmpty = data.length === 0;
          } else if (data === null || data === undefined) {
            isEmpty = true;
          }
          
          setState({
            data,
            loading: false,
            error: null,
            isEmpty,
          });
        }
      } catch (err) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: err.message || 'Couldn\'t load data right now',
            isEmpty: false,
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint, ...dependencyParams]);

  return state;
};
