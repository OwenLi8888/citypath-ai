import { FileDown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { AnalysisReport } from '@/backend';
import TechnicalImpactTable from './TechnicalImpactTable';
import ScenarioImpactSection from './ScenarioImpactSection';
import OptionsComparison from './OptionsComparison';
import KidFriendlyIndicator from './KidFriendlyIndicator';
import VisualizationDisplay from './VisualizationDisplay';

interface ReportDisplayProps {
  report: AnalysisReport;
  onNewAnalysis: () => void;
}

export default function ReportDisplay({ report, onNewAnalysis }: ReportDisplayProps) {
  const handlePrint = () => {
    window.print();
  };

  const reportDate = new Date(Number(report.timestamp) / 1000000);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={onNewAnalysis} className="gap-2 transition-smooth-fast hover:gap-3">
          <ArrowLeft className="h-4 w-4" />
          New Analysis
        </Button>
        
        <Button variant="outline" onClick={handlePrint} className="gap-2 transition-smooth-fast hover:shadow-md">
          <FileDown className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card className="border-2 shadow-lg transition-smooth hover:shadow-xl">
        <CardHeader className="space-y-6 pb-8">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <Badge variant="secondary" className="mb-2 text-sm px-3 py-1">
                Analysis Report
              </Badge>
              <CardTitle className="text-4xl font-bold tracking-tight">
                Transportation Scenario Analysis
              </CardTitle>
              <p className="text-base text-muted-foreground">
                Generated on {reportDate.toLocaleDateString()} at {reportDate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold">Executive Summary</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {report.highLevelSummary}
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">Technical Impact Assessment</h2>
        <TechnicalImpactTable impacts={report.technicalImpactTable} />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">Scenario Impact Analysis</h2>
        <ScenarioImpactSection impacts={report.scenarioImpactDetails} />
      </div>
      
      {report.visualizations && report.visualizations.length > 0 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Visual Analysis & Diagrams</h2>
            <p className="text-muted-foreground text-lg">
              Automated visualizations illustrating key safety improvements and design recommendations
            </p>
          </div>
          <div className="grid gap-8">
            {report.visualizations.map((viz) => (
              <VisualizationDisplay key={viz.id} visualization={viz} />
            ))}
          </div>
        </div>
      )}
      
      {report.kidFriendlyPathIndicator && (
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">Child Safety Enhancement</h2>
          <KidFriendlyIndicator 
            indicator={report.kidFriendlyPathIndicator}
            visualizations={report.visualizations}
          />
        </div>
      )}
      
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">Design Options Comparison</h2>
        <OptionsComparison options={report.options} />
      </div>
      
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 shadow-glow transition-smooth hover:shadow-glow-accent">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">💡</span>
            Final Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
            {report.recommendation}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
