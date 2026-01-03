import { FileText, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetAllReports } from '@/hooks/useQueries';
import type { AnalysisReport } from '@/backend';

interface ReportHistoryProps {
  onViewReport: (report: AnalysisReport) => void;
}

export default function ReportHistory({ onViewReport }: ReportHistoryProps) {
  const { data: reports, isLoading } = useGetAllReports();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Report History</CardTitle>
          <CardDescription>No analysis reports yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Generate your first transportation analysis to see it here
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedReports = [...reports].sort((a, b) => 
    Number(b.timestamp) - Number(a.timestamp)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Report History</h2>
        <p className="text-muted-foreground">
          View and access your previous transportation analyses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Reports ({reports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {sortedReports.map((report) => {
                const reportDate = new Date(Number(report.timestamp) / 1000000);
                return (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Analysis Report</Badge>
                            {report.kidFriendlyPathIndicator && (
                              <Badge variant="outline" className="border-chart-1 text-chart-1">
                                Kid-Friendly
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {report.highLevelSummary}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {reportDate.toLocaleDateString()}
                            </div>
                            <div>
                              {report.options.length} options analyzed
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewReport(report)}
                          className="gap-2 flex-shrink-0"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
