import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { Toaster } from './components/ui/toaster';
import HomePage from './pages/HomePage';
import { ThemeProvider } from './hooks/use-theme';
import { useEffect } from 'react';

const queryClient = new QueryClient();

// Script that applies dark mode immediately before the page renders
const DarkModeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // Force dark mode immediately
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            localStorage.setItem('portfolio-theme', 'dark');
            
            // IMPORTANT: Set a custom property that we can query later
            document.documentElement.style.setProperty('--initial-theme-applied', 'true');
            
            console.log('[DarkModeScript] Applied dark mode from inline script');
          })();
        `,
      }}
    />
  );
};

export function App() {
  // This effect runs after mount to ensure dark mode is applied
  useEffect(() => {
    // Always force dark mode on initial mount, regardless of stored preference
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    localStorage.setItem('portfolio-theme', 'dark');
    console.log('[App] Forced dark mode on mount');
    
    // This ensures only dark theme styles get applied during initial load
    setTimeout(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }, 100);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Insert dark mode script at top level */}
      <DarkModeScript />
      
      <ThemeProvider forceDarkMode={true} defaultTheme="dark" storageKey="portfolio-theme">
        <div className="min-h-screen bg-background font-sans antialiased transition-colors duration-300">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Switch>
              <Route path="/" component={HomePage} />
            </Switch>
          </main>
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
