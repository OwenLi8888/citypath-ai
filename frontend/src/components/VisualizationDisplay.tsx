import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Visualization } from '@/backend';

interface VisualizationDisplayProps {
  visualization: Visualization;
}

export default function VisualizationDisplay({ visualization }: VisualizationDisplayProps) {
  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'ascii-diagram': 'ASCII Diagram',
      'cross-section': 'Cross-Section',
      'before-after': 'Before/After Comparison',
      'bar-chart': 'Bar Chart',
      'pedestrian-exposure': 'Pedestrian Exposure',
      'conflict-points': 'Conflict Points',
      'queue-length': 'Queue Length',
      'solution-planning': 'Solution Planning'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string): 'default' | 'secondary' | 'outline' => {
    if (type.includes('conflict') || type.includes('exposure')) return 'default';
    if (type.includes('chart') || type.includes('queue')) return 'secondary';
    if (type.includes('solution')) return 'outline';
    return 'outline';
  };

  const isASCII = visualization.type === 'ascii-diagram';
  const isSVG = !isASCII;

  return (
    <Card className="border-2 transition-smooth hover:shadow-lg hover:border-primary/30">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{getTypeLabel(visualization.type)}</CardTitle>
          <Badge variant={getTypeColor(visualization.type)} className="text-xs">
            {visualization.type}
          </Badge>
        </div>
        <CardDescription className="text-base leading-relaxed">
          {visualization.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg overflow-hidden border border-border/50 bg-muted/30">
          {isASCII && (
            <pre className="p-6 overflow-x-auto text-xs font-mono leading-tight">
              {visualization.content}
            </pre>
          )}
          {isSVG && (
            <div 
              className="w-full overflow-x-auto p-4"
              dangerouslySetInnerHTML={{ __html: visualization.content }}
            />
          )}
        </div>
        
        {visualization.caption && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              <span className="font-semibold text-foreground">Explanation: </span>
              {visualization.caption}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
