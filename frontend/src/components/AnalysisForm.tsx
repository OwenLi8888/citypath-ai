import { useState } from 'react';
import { Loader2, Send, FileText, MapPin, Database, Route, ClipboardList, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useSubmitAnalysis } from '@/hooks/useQueries';
import DocumentUpload from '@/components/DocumentUpload';
import type { AnalysisReport } from '@/backend';

interface AnalysisFormProps {
  onReportGenerated: (report: AnalysisReport) => void;
}

interface ExtractedFields {
  cityContext?: string;
  data?: string;
  scenario?: string;
  task?: string;
}

export default function AnalysisForm({ onReportGenerated }: AnalysisFormProps) {
  const [cityContext, setCityContext] = useState('');
  const [data, setData] = useState('');
  const [scenario, setScenario] = useState('');
  const [task, setTask] = useState('');

  const { mutate: submitAnalysis, isPending } = useSubmitAnalysis();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cityContext.trim() || !data.trim() || !scenario.trim() || !task.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    submitAnalysis(
      { cityContext, data, scenario, task },
      {
        onSuccess: (report) => {
          toast.success('Analysis generated successfully!');
          onReportGenerated(report);
        },
        onError: (error) => {
          toast.error('Failed to generate analysis');
          console.error(error);
        }
      }
    );
  };

  const handleAutoPopulate = (extractedFields: ExtractedFields) => {
    if (extractedFields.cityContext) {
      setCityContext(prev => prev ? `${prev}\n\n${extractedFields.cityContext}` : extractedFields.cityContext || '');
    }
    if (extractedFields.data) {
      setData(prev => prev ? `${prev}\n\n${extractedFields.data}` : extractedFields.data || '');
    }
    if (extractedFields.scenario) {
      setScenario(prev => prev ? `${prev}\n\n${extractedFields.scenario}` : extractedFields.scenario || '');
    }
    if (extractedFields.task) {
      setTask(prev => prev ? `${prev}\n\n${extractedFields.task}` : extractedFields.task || '');
    }
    
    toast.success('Fields populated from document!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 px-4 py-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Sparkles className="h-10 w-10 text-primary animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Transportation Scenario Analysis
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Provide context and details to generate a comprehensive AI-powered analysis report
        </p>
      </div>

      {/* Document Upload Section */}
      <Card className="border-2 shadow-xl transition-smooth hover:shadow-2xl hover:border-primary/40">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">Smart Document Upload</CardTitle>
          </div>
          <CardDescription className="text-base leading-relaxed">
            Upload a document to automatically extract and populate relevant fields, or fill in the form manually below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUpload 
            onAutoPopulate={handleAutoPopulate}
            disabled={isPending}
          />
        </CardContent>
      </Card>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border-2 shadow-xl transition-smooth hover:shadow-2xl">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-3">
              <Database className="h-7 w-7 text-primary" />
              <CardTitle className="text-2xl">Analysis Input</CardTitle>
            </div>
            <CardDescription className="text-base leading-relaxed">
              Complete all fields to generate your structured transportation analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10">
            {/* City Context Field */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="cityContext" className="text-xl font-semibold">
                      City Context
                    </Label>
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Describe the city or area context including population, existing infrastructure, and key challenges
                  </p>
                  <Textarea
                    id="cityContext"
                    placeholder="Example: Downtown Seattle, population 750,000, with aging infrastructure and increasing pedestrian traffic. Current challenges include high vehicle speeds and limited crossing opportunities..."
                    value={cityContext}
                    onChange={(e) => setCityContext(e.target.value)}
                    className="min-h-[140px] resize-y text-base transition-smooth focus:shadow-md"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Data Field */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Database className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="data" className="text-xl font-semibold">
                      Transportation Data
                    </Label>
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Provide relevant transportation data and metrics such as traffic volumes, accident rates, and transit ridership
                  </p>
                  <Textarea
                    id="data"
                    placeholder="Example: Average daily traffic: 15,000 vehicles. Pedestrian crashes (last 3 years): 12 incidents. Current crossing time: 45 seconds. Transit ridership: 2,500 daily boardings..."
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="min-h-[140px] resize-y text-base transition-smooth focus:shadow-md"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Scenario Field */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Route className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="scenario" className="text-xl font-semibold">
                      Scenario Description
                    </Label>
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Describe the specific transportation scenario to analyze, such as a proposed bike lane or intersection redesign
                  </p>
                  <Textarea
                    id="scenario"
                    placeholder="Example: Proposed protected bike lane on Main Street between 1st and 5th Avenue, with parking removal on one side and signal timing adjustments at major intersections..."
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="min-h-[140px] resize-y text-base transition-smooth focus:shadow-md"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Task Field */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <ClipboardList className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="task" className="text-xl font-semibold">
                      Analysis Task
                    </Label>
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Specify the analysis task or question you need answered, such as evaluating safety impacts or comparing design options
                  </p>
                  <Textarea
                    id="task"
                    placeholder="Example: Evaluate the safety impacts of the proposed bike lane on all road users, compare three design options (A, B, C), and provide recommendations for implementation..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="min-h-[140px] resize-y text-base transition-smooth focus:shadow-md"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          type="submit" 
          size="lg" 
          className="w-full gap-3 text-xl h-16 shadow-xl transition-smooth hover:shadow-2xl hover:scale-[1.02]"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-7 w-7 animate-spin" />
              Generating Analysis...
            </>
          ) : (
            <>
              <Send className="h-7 w-7" />
              Generate Analysis Report
            </>
          )}
        </Button>
      </form>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 transition-smooth hover:shadow-lg hover:scale-[1.02]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              AI-Powered Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Generate comprehensive reports with technical impacts, safety assessments, and actionable recommendations.
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 transition-smooth hover:shadow-lg hover:scale-[1.02]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-6 w-6 text-accent" />
              Smart Document Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Upload PDF, DOCX, or TXT files to automatically extract and populate form fields with relevant data.
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30 transition-smooth hover:shadow-lg hover:scale-[1.02]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Route className="h-6 w-6 text-secondary-foreground" />
              Visual Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Receive detailed reports with automated visualizations, charts, and diagrams for easy presentation.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
