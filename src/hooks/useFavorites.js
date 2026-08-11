'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useAuth } from './useAuth';
import api from '@/lib/api';

const FavoritesContext = createContext({
  favorites: [],
  toggleFavorite: async () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }) {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [localFavorites, setLocalFavorites] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('favorites');
      if (saved) setLocalFavorites(JSON.parse(saved));
    } catch {}
  }, []);

  const loadRemote = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/favorites');
      setFavorites(data.favorites);
      localStorage.setItem('favorites', JSON.stringify(data.favorites));
    } catch {}
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        loadRemote();
      } else {
        setFavorites(localFavorites);
      }
    }
  }, [user, loading, localFavorites, loadRemote]);

  const toggleFavorite = async (mealId) => {
    if (user) {
      try {
        const { data } = await api.post(`/auth/favorites/${mealId}`);
        setFavorites(data.favorites);
        localStorage.setItem('favorites', JSON.stringify(data.favorites));
        return data.isFavorite;
      } catch {
        return false;
      }
    } else {
      setLocalFavorites((prev) => {
        const exists = prev.includes(mealId);
        const next = exists ? prev.filter((id) => id !== mealId) : [...prev, mealId];
        localStorage.setItem('favorites', JSON.stringify(next));
        return next;
      });
    }
  };

  const isFavorite = (mealId) => favorites.includes(mealId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
