import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { Toaster } from './components/ui/toaster';
import HomePage from './pages/HomePage';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Switch>
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
