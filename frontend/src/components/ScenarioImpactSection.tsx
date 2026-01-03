import { Shield, Car, Bus, Footprints, Bike, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ScenarioImpact } from '@/backend';

interface ScenarioImpactSectionProps {
  impacts: ScenarioImpact;
}

export default function ScenarioImpactSection({ impacts }: ScenarioImpactSectionProps) {
  const impactItems = [
    { icon: Shield, label: 'Safety', value: impacts.safety, color: 'text-chart-1' },
    { icon: Car, label: 'Mobility', value: impacts.mobility, color: 'text-chart-2' },
    { icon: Bus, label: 'Transit', value: impacts.transit, color: 'text-chart-3' },
    { icon: Footprints, label: 'Walking', value: impacts.walking, color: 'text-chart-4' },
    { icon: Bike, label: 'Cycling', value: impacts.cycling, color: 'text-chart-5' },
    { icon: Users, label: 'Vulnerable Users', value: impacts.vulnerableUsers, color: 'text-primary' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Impact Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {impactItems.map((item) => (
            <div key={item.label} className="space-y-2 p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <h4 className="font-semibold">{item.label}</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
