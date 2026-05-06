import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import { Toaster } from './components/ui/toaster';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './hooks/use-theme';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
        <div className="min-h-screen bg-background font-sans antialiased animate-page-enter">
          {/* Skip-to-content - visually hidden until keyboard-focused */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]
              focus:px-4 focus:py-2 focus:rounded-md
              focus:bg-primary focus:text-primary-foreground
              focus:font-medium focus:text-sm focus:shadow-lg focus:outline-none
              focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Skip to content
          </a>

          <ScrollProgress />
          <Navigation />
          <main id="main">
            <Switch>
              <Route path="/" component={HomePage} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
          <BackToTop />
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
