'use client';
import { Provider } from 'react-redux';
import { store } from './Store';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { FavoritesProvider } from '@/hooks/useFavorites';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
