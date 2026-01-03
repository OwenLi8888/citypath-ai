import { CheckCircle2, XCircle, DollarSign, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TransportationOption {
  costBand: string;
  cons: Array<string>;
  name: string;
  pros: Array<string>;
  emotionalFraming: string;
}

interface OptionsComparisonProps {
  options: TransportationOption[];
}

export default function OptionsComparison({ options }: OptionsComparisonProps) {
  const getCostColor = (costBand: string) => {
    const lower = costBand.toLowerCase();
    if (lower.includes('high') || lower.includes('$$$')) return 'destructive';
    if (lower.includes('medium') || lower.includes('$$')) return 'default';
    if (lower.includes('low') || lower.includes('$')) return 'secondary';
    return 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Options Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {options.map((option, index) => (
            <div 
              key={index} 
              className="space-y-4 p-5 rounded-lg border-2 bg-card hover:shadow-lg transition-shadow"
            >
              <div className="space-y-2">
                <Badge variant="outline" className="mb-1">
                  Option {String.fromCharCode(65 + index)}
                </Badge>
                <h3 className="text-xl font-bold">{option.name}</h3>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-chart-1 flex-shrink-0" />
                  <span className="text-sm font-semibold">Pros</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {option.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                  <span className="text-sm font-semibold">Cons</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {option.cons.map((con, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">
                      {con}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">Cost Band</span>
                  </div>
                  <Badge variant={getCostColor(option.costBand)}>
                    {option.costBand}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-chart-1" />
                  <span className="text-sm font-semibold">Emotional Framing</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {option.emotionalFraming}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
