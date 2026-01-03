import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { TechnicalImpact } from '@/backend';

interface TechnicalImpactTableProps {
  impacts: TechnicalImpact[];
}

export default function TechnicalImpactTable({ impacts }: TechnicalImpactTableProps) {
  const getImpactColor = (impact: string) => {
    const lower = impact.toLowerCase();
    if (lower.includes('high') || lower.includes('significant') || lower.includes('major')) {
      return 'destructive';
    }
    if (lower.includes('medium') || lower.includes('moderate')) {
      return 'default';
    }
    if (lower.includes('low') || lower.includes('minor')) {
      return 'secondary';
    }
    return 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Impact Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Metric</TableHead>
                <TableHead className="font-semibold">Value</TableHead>
                <TableHead className="font-semibold">Impact Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {impacts.map((impact, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{impact.metric}</TableCell>
                  <TableCell>{impact.value}</TableCell>
                  <TableCell>
                    <Badge variant={getImpactColor(impact.impact)}>
                      {impact.impact}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
