import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchJson } from '../lib/api';

export default function FavoriteButton({ itemType, itemId, initialState = false, children, className }) {
  const [isFavorited, setIsFavorited] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Load initial state if authenticated
  useEffect(() => {
    let mounted = true;
    if (isAuthenticated) {
      fetchJson('/me/favorites').then(data => {
        if (mounted && data) {
          const isFav = data.some(fav => fav.itemType === itemType && fav.itemId === itemId);
          setIsFavorited(isFav);
        }
      }).catch(err => console.error("Failed to load favorites", err));
    } else {
      setIsFavorited(false);
    }
    return () => { mounted = false; };
  }, [isAuthenticated, itemType, itemId]);

  // Handle intent preservation
  useEffect(() => {
    if (isAuthenticated && searchParams.get('favoriteType') === itemType && searchParams.get('favoriteId') === String(itemId)) {
      // Auto-favorite
      handleToggleFavorite(true);
      
      // Clean up URL parameters
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('favoriteType');
      newParams.delete('favoriteId');
      navigate(`${location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`, { replace: true });
    }
  }, [isAuthenticated, searchParams, itemType, itemId, location.pathname, navigate]);

  const handleToggleFavorite = async (forceState = null) => {
    if (!isAuthenticated) {
      const currentUrl = `${location.pathname}${location.search}`;
      const returnUrl = new URLSearchParams();
      if (location.search) {
         new URLSearchParams(location.search).forEach((val, key) => returnUrl.set(key, val));
      }
      returnUrl.set('favoriteType', itemType);
      returnUrl.set('favoriteId', itemId);
      navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}?${returnUrl.toString()}`)}`);
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const nextState = forceState !== null ? forceState : !isFavorited;
      if (nextState) {
        await fetchJson('/me/favorites', {
          method: 'POST',
          body: JSON.stringify({ itemType, itemId })
        });
        setIsFavorited(true);
      } else {
        await fetchJson(`/me/favorites?itemType=${itemType}&itemId=${itemId}`, {
          method: 'DELETE'
        });
        setIsFavorited(false);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggleFavorite();
      }}
      disabled={isLoading}
      aria-label={isFavorited ? `Remove from favorites` : `Add to favorites`}
      style={!className ? {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isFavorited ? 'var(--color-primary)' : 'inherit',
        opacity: isLoading ? 0.5 : 1,
        transition: 'color 0.2s ease, opacity 0.2s ease'
      } : {}}
    >
      <Bookmark 
        size={24} 
        fill={isFavorited ? 'currentColor' : 'none'} 
        strokeWidth={isFavorited ? 0 : 2}
      />
      {children && <span style={{ marginLeft: '0.5rem' }}>{children}</span>}
    </button>
  );
}
