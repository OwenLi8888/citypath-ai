import { MapPin, History, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface HeaderProps {
  activeView: 'form' | 'report' | 'history';
  onNavigate: (view: 'form' | 'report' | 'history') => void;
  onNewAnalysis: () => void;
}

export default function Header({ activeView, onNavigate, onNewAnalysis }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-smooth">
      <div className="container mx-auto px-4 py-5 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/citypath-logo-transparent.dim_200x200.png" 
              alt="CityPath AI" 
              className="h-12 w-12 transition-smooth hover:scale-110"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                CityPath AI
              </h1>
              <p className="text-xs text-muted-foreground">
                Municipal Transportation Analysis
              </p>
            </div>
          </div>
          
          <nav className="flex items-center gap-3">
            <Button
              variant={activeView === 'form' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('form')}
              className="gap-2 transition-smooth-fast"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">New Analysis</span>
            </Button>
            
            <Button
              variant={activeView === 'history' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('history')}
              className="gap-2 transition-smooth-fast"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="transition-smooth-fast"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
