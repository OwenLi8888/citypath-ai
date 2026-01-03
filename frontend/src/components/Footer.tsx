import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/40 backdrop-blur-sm mt-auto transition-smooth">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center text-sm text-muted-foreground">
          © 2025. Built with{' '}
          <Heart className="inline h-3 w-3 text-destructive fill-destructive animate-pulse" />{' '}
          using{' '}
          <a 
            href="https://caffeine.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium transition-smooth-fast"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
