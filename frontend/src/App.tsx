import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import AnalysisForm from './components/AnalysisForm';
import ReportDisplay from './components/ReportDisplay';
import ReportHistory from './components/ReportHistory';
import type { AnalysisReport } from './backend';

const queryClient = new QueryClient();

function AppContent() {
  const [currentReport, setCurrentReport] = useState<AnalysisReport | null>(null);
  const [activeView, setActiveView] = useState<'form' | 'report' | 'history'>('form');

  const handleReportGenerated = (report: AnalysisReport) => {
    setCurrentReport(report);
    setActiveView('report');
  };

  const handleViewReport = (report: AnalysisReport) => {
    setCurrentReport(report);
    setActiveView('report');
  };

  const handleNewAnalysis = () => {
    setCurrentReport(null);
    setActiveView('form');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <Header 
        activeView={activeView} 
        onNavigate={setActiveView}
        onNewAnalysis={handleNewAnalysis}
      />
      
      <main className="flex-1 container mx-auto px-4 py-10 max-w-7xl">
        {activeView === 'form' && (
          <AnalysisForm onReportGenerated={handleReportGenerated} />
        )}
        
        {activeView === 'report' && currentReport && (
          <ReportDisplay 
            report={currentReport} 
            onNewAnalysis={handleNewAnalysis}
          />
        )}
        
        {activeView === 'history' && (
          <ReportHistory onViewReport={handleViewReport} />
        )}
      </main>
      
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
