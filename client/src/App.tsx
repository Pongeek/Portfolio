import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import { Toaster } from './components/ui/toaster';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './hooks/use-theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
        <div className="min-h-screen bg-background font-sans antialiased animate-page-enter">
          <ScrollProgress />
          <Navigation />
          <main>
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
