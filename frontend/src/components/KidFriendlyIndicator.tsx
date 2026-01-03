import { Heart, Shield, TrendingDown, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { KidFriendlyPathIndicator, Visualization } from '@/backend';
import VisualizationDisplay from './VisualizationDisplay';

interface KidFriendlyIndicatorProps {
  indicator: KidFriendlyPathIndicator;
  visualizations?: Visualization[];
}

export default function KidFriendlyIndicator({ indicator, visualizations = [] }: KidFriendlyIndicatorProps) {
  const percentage = Number(indicator.safetyImprovementPercentage);
  
  // Filter visualizations relevant to kid safety
  const relevantVisualizations = visualizations.filter(viz => 
    viz.type === 'pedestrian-exposure' || 
    viz.type === 'conflict-points' ||
    viz.type === 'before-after'
  );

  return (
    <div className="space-y-6">
      <Card className="border-2 border-chart-1/30 bg-gradient-to-br from-chart-1/5 to-chart-1/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Heart className="h-6 w-6 text-chart-1 fill-chart-1" />
              Kid-Friendly Path Indicator
            </CardTitle>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Option B
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4 p-6 rounded-lg bg-background/50 border-2 border-chart-1/20">
            <img 
              src="/assets/generated/kid-safety-hero.dim_800x600.png" 
              alt="Kid Safety" 
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
            <div className="space-y-2">
              <p className="text-4xl font-bold text-chart-1">
                {percentage}% Safer
              </p>
              <p className="text-lg text-muted-foreground">
                This design makes this route safer for kids walking to school
              </p>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 rounded-lg border bg-background/50">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-chart-1" />
                <h4 className="font-semibold">Conflict Points</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {indicator.conflictPointsChange}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-lg border bg-background/50">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-chart-1" />
                <h4 className="font-semibold">Speed Reduction</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {indicator.speedReductionImpact}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-lg border bg-background/50">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-chart-1" />
                <h4 className="font-semibold">Crossing Safety</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {indicator.crossingSafetyImprovement}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-lg border bg-background/50">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-chart-1" />
                <h4 className="font-semibold">Family Design</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {indicator.familyFocusedDesign}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {relevantVisualizations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Child Safety Visualizations</h3>
          <div className="grid gap-4">
            {relevantVisualizations.map((viz) => (
              <VisualizationDisplay key={viz.id} visualization={viz} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
