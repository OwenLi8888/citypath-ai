import type { Visualization } from '@/backend';

export type VisualizationType = 
  | 'ascii-diagram'
  | 'cross-section'
  | 'before-after'
  | 'bar-chart'
  | 'pedestrian-exposure'
  | 'conflict-points'
  | 'queue-length'
  | 'solution-planning';

interface VisualizationConfig {
  type: VisualizationType;
  data: Record<string, any>;
  description: string;
}

export function generateVisualization(config: VisualizationConfig): Omit<Visualization, 'id' | 'timestamp'> {
  switch (config.type) {
    case 'ascii-diagram':
      return generateASCIIDiagram(config.data, config.description);
    case 'cross-section':
      return generateCrossSection(config.data, config.description);
    case 'before-after':
      return generateBeforeAfter(config.data, config.description);
    case 'bar-chart':
      return generateBarChart(config.data, config.description);
    case 'pedestrian-exposure':
      return generatePedestrianExposure(config.data, config.description);
    case 'conflict-points':
      return generateConflictPoints(config.data, config.description);
    case 'queue-length':
      return generateQueueLength(config.data, config.description);
    case 'solution-planning':
      return generateSolutionPlanning(config.data, config.description);
    default:
      throw new Error(`Unknown visualization type: ${config.type}`);
  }
}

function generateASCIIDiagram(data: Record<string, any>, description: string): Omit<Visualization, 'id' | 'timestamp'> {
  const content = `
    ┌─────────────────────────────────────┐
    │     ${data.title || 'Street Layout'}     │
    ├─────────────────────────────────────┤
    │                                     │
    │  ╔═══════════════════════════════╗  │
    │  ║   ${data.lane1 || 'Travel Lane'}   ║  │
    │  ╠═══════════════════════════════╣  │
    │  ║   ${data.lane2 || 'Bike Lane'}    ║  │
    │  ╠═══════════════════════════════╣  │
    │  ║   ${data.lane3 || 'Sidewalk'}     ║  │
    │  ╚═══════════════════════════════╝  │
    │                                     │
    └─────────────────────────────────────┘
  `;
  
  return {
    type: 'ascii-diagram',
    content,
    description,
    caption: 'This schematic diagram shows the basic street layout configuration with dedicated lanes for different transportation modes.'
  };
}

function generateCrossSection(data: Record<string, any>, description: string): Omit<Visualization, 'id' | 'timestamp'> {
  const { option = 'A', sidewalkWidth = 6, bikeWidth = 5, travelWidth = 11, parkingWidth = 8 } = data;
  
  const totalWidth = sidewalkWidth + bikeWidth + travelWidth + parkingWidth;
  const scale = 400 / totalWidth;
  
  const svg = `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="sidewalk-pattern" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#e5e7eb"/>
          <circle cx="2" cy="2" r="0.5" fill="#9ca3af"/>
        </pattern>
        <pattern id="bike-pattern" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M0,4 L8,4" stroke="#10b981" stroke-width="0.5" stroke-dasharray="2,2"/>
        </pattern>
      </defs>
      
      <text x="250" y="20" text-anchor="middle" font-size="16" font-weight="bold" fill="#1f2937">
        Option ${option} Cross-Section
      </text>
      
      <!-- Sidewalk -->
      <rect x="50" y="60" width="${sidewalkWidth * scale}" height="80" fill="url(#sidewalk-pattern)" stroke="#9ca3af" stroke-width="2"/>
      <text x="${50 + (sidewalkWidth * scale) / 2}" y="105" text-anchor="middle" font-size="12" fill="#374151">Sidewalk</text>
      <text x="${50 + (sidewalkWidth * scale) / 2}" y="120" text-anchor="middle" font-size="10" fill="#6b7280">${sidewalkWidth}'</text>
      
      <!-- Bike Lane -->
      <rect x="${50 + sidewalkWidth * scale}" y="60" width="${bikeWidth * scale}" height="80" fill="#d1fae5" stroke="#10b981" stroke-width="2"/>
      <rect x="${50 + sidewalkWidth * scale}" y="60" width="${bikeWidth * scale}" height="80" fill="url(#bike-pattern)"/>
      <text x="${50 + (sidewalkWidth + bikeWidth / 2) * scale}" y="105" text-anchor="middle" font-size="12" fill="#065f46">Bike Lane</text>
      <text x="${50 + (sidewalkWidth + bikeWidth / 2) * scale}" y="120" text-anchor="middle" font-size="10" fill="#059669">${bikeWidth}'</text>
      
      <!-- Travel Lane -->
      <rect x="${50 + (sidewalkWidth + bikeWidth) * scale}" y="60" width="${travelWidth * scale}" height="80" fill="#f3f4f6" stroke="#6b7280" stroke-width="2"/>
      <line x1="${50 + (sidewalkWidth + bikeWidth + travelWidth / 2) * scale}" y1="60" x2="${50 + (sidewalkWidth + bikeWidth + travelWidth / 2) * scale}" y2="140" stroke="#fbbf24" stroke-width="2" stroke-dasharray="8,4"/>
      <text x="${50 + (sidewalkWidth + bikeWidth + travelWidth / 2) * scale}" y="105" text-anchor="middle" font-size="12" fill="#374151">Travel Lane</text>
      <text x="${50 + (sidewalkWidth + bikeWidth + travelWidth / 2) * scale}" y="120" text-anchor="middle" font-size="10" fill="#6b7280">${travelWidth}'</text>
      
      <!-- Parking -->
      <rect x="${50 + (sidewalkWidth + bikeWidth + travelWidth) * scale}" y="60" width="${parkingWidth * scale}" height="80" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
      <text x="${50 + (sidewalkWidth + bikeWidth + travelWidth + parkingWidth / 2) * scale}" y="105" text-anchor="middle" font-size="12" fill="#4338ca">Parking</text>
      <text x="${50 + (sidewalkWidth + bikeWidth + travelWidth + parkingWidth / 2) * scale}" y="120" text-anchor="middle" font-size="10" fill="#6366f1">${parkingWidth}'</text>
      
      <!-- Total width -->
      <line x1="50" y1="160" x2="${50 + totalWidth * scale}" y2="160" stroke="#1f2937" stroke-width="2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
      <text x="250" y="180" text-anchor="middle" font-size="12" fill="#1f2937">Total: ${totalWidth} feet</text>
      
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M0,0 L0,10 L5,5 z" fill="#1f2937"/>
        </marker>
      </defs>
    </svg>
  `;
  
  return {
    type: 'cross-section',
    content: svg,
    description,
    caption: `This cross-section illustrates the proposed ${totalWidth}-foot street design with dedicated space for pedestrians, cyclists, vehicles, and parking, promoting safe multi-modal transportation.`
  };
}

function generateBeforeAfter(data: Record<string, any>, description: string): Omit<Visualization, 'id' | 'timestamp'> {
  const { beforeSpeed = 35, afterSpeed = 25, beforeConflicts = 14, afterConflicts = 8 } = data;
  
  const svg = `
    <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <text x="300" y="25" text-anchor="middle" font-size="18" font-weight="bold" fill="#1f2937">
        Before vs After Comparison
      </text>
      
      <!-- Before Section -->
      <g>
        <text x="150" y="55" text-anchor="middle" font-size="14" font-weight="bold" fill="#dc2626">BEFORE</text>
        
        <!-- Speed indicator -->
        <rect x="50" y="70" width="200" height="80" fill="#fee2e2" stroke="#dc2626" stroke-width="2" rx="4"/>
        <text x="150" y="95" text-anchor="middle" font-size="12" fill="#7f1d1d">Average Speed</text>
        <text x="150" y="120" text-anchor="middle" font-size="32" font-weight="bold" fill="#dc2626">${beforeSpeed}</text>
        <text x="150" y="140" text-anchor="middle" font-size="12" fill="#991b1b">mph</text>
        
        <!-- Conflict points -->
        <rect x="50" y="170" width="200" height="80" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="4"/>
        <text x="150" y="195" text-anchor="middle" font-size="12" fill="#78350f">Conflict Points</text>
        <text x="150" y="220" text-anchor="middle" font-size="32" font-weight="bold" fill="#f59e0b">${beforeConflicts}</text>
        <text x="150" y="240" text-anchor="middle" font-size="12" fill="#92400e">intersections</text>
      </g>
      
      <!-- Arrow -->
      <g>
        <path d="M 270 150 L 320 150" stroke="#6b7280" stroke-width="3" fill="none" marker-end="url(#arrowhead)"/>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#6b7280"/>
          </marker>
        </defs>
      </g>
      
      <!-- After Section -->
      <g>
        <text x="450" y="55" text-anchor="middle" font-size="14" font-weight="bold" fill="#16a34a">AFTER</text>
        
        <!-- Speed indicator -->
        <rect x="350" y="70" width="200" height="80" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="4"/>
        <text x="450" y="95" text-anchor="middle" font-size="12" fill="#14532d">Average Speed</text>
        <text x="450" y="120" text-anchor="middle" font-size="32" font-weight="bold" fill="#16a34a">${afterSpeed}</text>
        <text x="450" y="140" text-anchor="middle" font-size="12" fill="#166534">mph</text>
        
        <!-- Improvement badge -->
        <circle cx="520" cy="100" r="20" fill="#16a34a"/>
        <text x="520" y="105" text-anchor="middle" font-size="12" font-weight="bold" fill="white">-${Math.round(((beforeSpeed - afterSpeed) / beforeSpeed) * 100)}%</text>
        
        <!-- Conflict points -->
        <rect x="350" y="170" width="200" height="80" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="4"/>
        <text x="450" y="195" text-anchor="middle" font-size="12" fill="#1e3a8a">Conflict Points</text>
        <text x="450" y="220" text-anchor="middle" font-size="32" font-weight="bold" fill="#3b82f6">${afterConflicts}</text>
        <text x="450" y="240" text-anchor="middle" font-size="12" fill="#1e40af">intersections</text>
        
        <!-- Improvement badge -->
        <circle cx="520" cy="200" r="20" fill="#3b82f6"/>
        <text x="520" y="205" text-anchor="middle" font-size="12" font-weight="bold" fill="white">-${Math.round(((beforeConflicts - afterConflicts) / beforeConflicts) * 100)}%</text>
      </g>
    </svg>
  `;
  
  return {
    type: 'before-after',
    content: svg,
    description,
    caption: `Comparing current conditions to proposed improvements shows significant safety gains: vehicle speeds reduced by ${Math.round(((beforeSpeed - afterSpeed) / beforeSpeed) * 100)}% and conflict points decreased by ${Math.round(((beforeConflicts - afterConflicts) / beforeConflicts) * 100)}%, directly reducing crash risk for all road users.`
  };
}

function generateBarChart(data: Record<string, any>, description: string): Omit<Visualization, 'id' | 'timestamp'> {
  const { title = 'Safety Improvements', categories = [], values = [] } = data;
  const maxValue = Math.max(...values);
  
  const barWidth = 60;
  const barSpacing = 100;
  const chartHeight = 200;
  const startX = 80;
  
  const svg = `
    <svg viewBox="0 0 ${startX + categories.length * barSpacing + 50} 300" xmlns="http://www.w3.org/2000/svg">
      <text x="${(startX + categories.length * barSpacing) / 2}" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="#1f2937">
        ${title}
      </text>
      
      <!-- Y-axis -->
      <line x1="${startX - 10}" y1="50" x2="${startX - 10}" y2="${50 + chartHeight}" stroke="#6b7280" stroke-width="2"/>
      
      <!-- X-axis -->
      <line x1="${startX - 10}" y1="${50 + chartHeight}" x2="${startX + categories.length * barSpacing}" y2="${50 + chartHeight}" stroke="#6b7280" stroke-width="2"/>
      
      ${categories.map((category: string, i: number) => {
        const barHeight = (values[i] / maxValue) * chartHeight;
        const x = startX + i * barSpacing;
        const y = 50 + chartHeight - barHeight;
        const color = values[i] > 0 ? '#10b981' : '#ef4444';
        
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" opacity="0.8" stroke="${color}" stroke-width="2" rx="4"/>
          <text x="${x + barWidth / 2}" y="${y - 10}" text-anchor="middle" font-size="14" font-weight="bold" fill="${color}">
            ${values[i] > 0 ? '+' : ''}${values[i]}%
          </text>
          <text x="${x + barWidth / 2}" y="${50 + chartHeight + 20}" text-anchor="middle" font-size="11" fill="#374151">
            ${category}
          </text>
        `;
      }).join('')}
      
      <!-- Y-axis labels -->
      <text x="${startX - 20}" y="55" text-anchor="end" font-size="10" fill="#6b7280">${maxValue}%</text>
      <text x="${startX - 20}" y="${50 + chartHeight / 2}" text-anchor="end" font-size="10" fill="#6b7280">${Math.round(maxValue / 2)}%</text>
      <text x="${startX - 20}" y="${50 + chartHeight}" text-anchor="end" font-size="10" fill="#6b7280">0%</text>
    </svg>
  `;
  
  return {
    type: 'bar-chart',
    content: svg,
    description,
    caption: 'This chart quantifies safety improvements across different user groups, demonstrating how the proposed design benefits pedestrians, cyclists, and drivers through reduced conflicts and enhanced infrastructure.'
  };
}

function generatePedestrianExposure(data: Record<string, any>, description: string): Omit<Visualization, 'id' | 'timestamp'> {
  const { beforeTime = 28, afterTime = 18, crossingWidth = 48 } = data;
  
  const svg = `
    <svg viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
      <text x="250" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="#1f2937">
        Pedestrian Crossing Exposure
      </text>
      
      <!-- Before -->
      <g>
        <text x="125" y="55" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">BEFORE</text>
        <rect x="25" y="70" width="200" height="120" fill="#fee2e2" stroke="#dc2626" stroke-width="2" rx="4"/>
        
        <!-- Pedestrian icon -->
        <circle cx="125" cy="110" r="8" fill="#dc2626"/>
        <line x1="125" y1="118" x2="125" y2="145" stroke="#dc2626" stroke-width="3"/>
        <line x1="125" y1="125" x2="110" y2="135" stroke="#dc2626" stroke-width="3"/>
        <line x1="125" y1="125" x2="140" y2="135" stroke="#dc2626" stroke-width="3"/>
        <line x1="125" y1="145" x2="110" y2="160" stroke="#dc2626" stroke-width="3"/>
        <line x1="125" y1="145" x2="140" y2="160" stroke="#dc2626" stroke-width="3"/>
        
        <text x="125" y="180" text-anchor="middle" font-size="20" font-weight="bold" fill="#dc2626">${beforeTime}s</text>
        <text x="125" y="195" text-anchor="middle" font-size="10" fill="#991b1b">exposure time</text>
      </g>
      
      <!-- Arrow -->
      <path d="M 235 130 L 265 130" stroke="#6b7280" stroke-width="2" marker-end="url(#arrow2)"/>
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#6b7280"/>
        </marker>
      </defs>
      
      <!-- After -->
      <g>
        <text x="375" y="55" text-anchor="middle" font-size="12" font-weight="bold" fill="#16a34a">AFTER</text>
        <rect x="275" y="70" width="200" height="120" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="4"/>
        
        <!-- Pedestrian icon -->
        <circle cx="375" cy="110" r="8" fill="#16a34a"/>
        <line x1="375" y1="118" x2="375" y2="145" stroke="#16a34a" stroke-width="3"/>
        <line x1="375" y1="125" x2="360" y2="135" stroke="#16a34a" stroke-width="3"/>
        <line x1="375" y1="125" x2="390" y2="135" stroke="#16a34a" stroke-width="3"/>
        <line x1="375" y1="145" x2="360" y2="160" stroke="#16a34a" stroke-width="3"/>
        <line x1="375" y1="145" x2="390" y2="160" stroke="#16a34a" stroke-width="3"/>
        
        <text x="375" y="180" text-anchor="middle" font-size="20" font-weight="bold" fill="#16a34a">${afterTime}s</text>
        <text x="375" y="195" text-anchor="middle" font-size="10" fill="#166534">exposure time</text>
        
        <!-- Improvement -->
        <circle cx="445" cy="130" r="22" fill="#16a34a"/>
        <text x="445" y="135" text-anchor="middle" font-size="14" font-weight="bold" fill="white">-${Math.round(((beforeTime - afterTime) / beforeTime) * 100)}%</text>
      </g>
      
      <!-- Footer note -->
      <text x="250" y="225" text-anchor="middle" font-size="11" fill="#6b7280">
        Crossing width: ${crossingWidth} feet
      </text>
    </svg>
  `;
  
  return {
    type: 'pedestrian-exposure',
    content: svg,
    description,
    caption: `Reducing pedestrian exposure time from ${beforeTime} to ${afterTime} seconds means less time vulnerable to vehicle conflicts, especially critical for children and elderly crossing to schools or community centers.`
  };
}

function generateConflictPoints(data: Record<string, any>, description: string): Omit<Visualization, 'id' | 'timestamp'> {
  const { beforePoints = 14, afterPoints = 8 } = data;
  
  const svg = `
    <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <text x="300" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="#1f2937">
        Conflict Point Reduction
      </text>
      
      <!-- Before intersection -->
      <g>
        <text x="150" y="55" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">BEFORE</text>
        
        <!-- Intersection -->
        <rect x="100" y="80" width="100" height="100" fill="#f3f4f6" stroke="#6b7280" stroke-width="2"/>
        
        <!-- Conflict points (red dots) -->
        ${Array.from({ length: beforePoints }).map((_, i) => {
          const angle = (i / beforePoints) * Math.PI * 2;
          const radius = 35;
          const cx = 150 + Math.cos(angle) * radius;
          const cy = 130 + Math.sin(angle) * radius;
          return `<circle cx="${cx}" cy="${cy}" r="4" fill="#dc2626" stroke="#7f1d1d" stroke-width="1"/>`;
        }).join('')}
        
        <!-- Roads -->
        <rect x="130" y="60" width="40" height="140" fill="#d1d5db" opacity="0.5"/>
        <rect x="80" y="110" width="140" height="40" fill="#d1d5db" opacity="0.5"/>
        
        <text x="150" y="205" text-anchor="middle" font-size="18" font-weight="bold" fill="#dc2626">${beforePoints}</text>
        <text x="150" y="220" text-anchor="middle" font-size="10" fill="#991b1b">conflict points</text>
      </g>
      
      <!-- Arrow -->
      <path d="M 220 130 L 280 130" stroke="#6b7280" stroke-width="3" marker-end="url(#arrow3)"/>
      <defs>
        <marker id="arrow3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#6b7280"/>
        </marker>
      </defs>
      
      <!-- After intersection -->
      <g>
        <text x="450" y="55" text-anchor="middle" font-size="12" font-weight="bold" fill="#16a34a">AFTER</text>
        
        <!-- Intersection -->
        <rect x="400" y="80" width="100" height="100" fill="#f3f4f6" stroke="#6b7280" stroke-width="2"/>
        
        <!-- Conflict points (fewer, green dots) -->
        ${Array.from({ length: afterPoints }).map((_, i) => {
          const angle = (i / afterPoints) * Math.PI * 2;
          const radius = 35;
          const cx = 450 + Math.cos(angle) * radius;
          const cy = 130 + Math.sin(angle) * radius;
          return `<circle cx="${cx}" cy="${cy}" r="4" fill="#16a34a" stroke="#14532d" stroke-width="1"/>`;
        }).join('')}
        
        <!-- Roads with improvements -->
        <rect x="430" y="60" width="40" height="140" fill="#d1d5db" opacity="0.5"/>
        <rect x="380" y="110" width="140" height="40" fill="#d1d5db" opacity="0.5"/>
        
        <!-- Protected elements -->
        <rect x="410" y="95" width="15" height="70" fill="#10b981" opacity="0.3" rx="2"/>
        <rect x="475" y="95" width="15" height="70" fill="#10b981" opacity="0.3" rx="2"/>
        
        <text x="450" y="205" text-anchor="middle" font-size="18" font-weight="bold" fill="#16a34a">${afterPoints}</text>
        <text x="450" y="220" text-anchor="middle" font-size="10" fill="#166534">conflict points</text>
        
        <!-- Improvement badge -->
        <circle cx="520" cy="130" r="25" fill="#16a34a"/>
        <text x="520" y="135" text-anchor="middle" font-size="14" font-weight="bold" fill="white">-${Math.round(((beforePoints - afterPoints) / beforePoints) * 100)}%</text>
      </g>
      
      <!-- Legend -->
      <g>
        <text x="300" y="255" text-anchor="middle" font-size="11" fill="#6b7280">
          Conflict points represent locations where vehicle and pedestrian paths intersect
        </text>
        <circle cx="220" cy="270" r="4" fill="#dc2626"/>
        <text x="230" y="273" font-size="10" fill="#6b7280">High risk</text>
        <circle cx="320" cy="270" r="4" fill="#16a34a"/>
        <text x="330" y="273" font-size="10" fill="#6b7280">Reduced risk</text>
      </g>
    </svg>
  `;
  
  return {
    type: 'conflict-points',
    content: svg,
    description,
    caption: `Each conflict point represents a location where different traffic streams intersect. Reducing these from ${beforePoints} to ${afterPoints} through protected infrastructure and signal phasing directly lowers crash probability and improves safety for vulnerable users.`
  };
}

function generateQueueLength(data: Record<string, any>, description: string): Omit<Visualization, 'id' | 'timestamp'> {
  const { beforeQueue = 12, afterQueue = 6, peakHour = '5:00 PM' } = data;
  
  const svg = `
    <svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg">
      <text x="250" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="#1f2937">
        Queue Length Analysis - Peak Hour (${peakHour})
      </text>
      
      <!-- Before -->
      <g>
        <text x="125" y="55" text-anchor="middle" font-size="12" font-weight="bold" fill="#dc2626">BEFORE</text>
        
        <rect x="25" y="70" width="200" height="80" fill="#fee2e2" stroke="#dc2626" stroke-width="2" rx="4"/>
        
        <!-- Vehicle queue visualization -->
        ${Array.from({ length: Math.min(beforeQueue, 10) }).map((_, i) => `
          <rect x="${35 + i * 18}" y="85" width="15" height="25" fill="#dc2626" stroke="#7f1d1d" stroke-width="1" rx="2"/>
          <rect x="${37 + i * 18}" y="88" width="11" height="8" fill="#fca5a5" rx="1"/>
        `).join('')}
        ${beforeQueue > 10 ? `<text x="215" y="100" text-anchor="end" font-size="10" fill="#dc2626">+${beforeQueue - 10}</text>` : ''}
        
        <text x="125" y="135" text-anchor="middle" font-size="24" font-weight="bold" fill="#dc2626">${beforeQueue}</text>
        <text x="125" y="150" text-anchor="middle" font-size="10" fill="#991b1b">vehicles in queue</text>
      </g>
      
      <!-- After -->
      <g>
        <text x="375" y="55" text-anchor="middle" font-size="12" font-weight="bold" fill="#16a34a">AFTER</text>
        
        <rect x="275" y="70" width="200" height="80" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="4"/>
        
        <!-- Vehicle queue visualization (shorter) -->
        ${Array.from({ length: Math.min(afterQueue, 10) }).map((_, i) => `
          <rect x="${285 + i * 18}" y="85" width="15" height="25" fill="#16a34a" stroke="#14532d" stroke-width="1" rx="2"/>
          <rect x="${287 + i * 18}" y="88" width="11" height="8" fill="#86efac" rx="1"/>
        `).join('')}
        
        <text x="375" y="135" text-anchor="middle" font-size="24" font-weight="bold" fill="#16a34a">${afterQueue}</text>
        <text x="375" y="150" text-anchor="middle" font-size="10" fill="#166534">vehicles in queue</text>
        
        <!-- Improvement badge -->
        <circle cx="445" cy="105" r="22" fill="#16a34a"/>
        <text x="445" y="110" text-anchor="middle" font-size="14" font-weight="bold" fill="white">-${Math.round(((beforeQueue - afterQueue) / beforeQueue) * 100)}%</text>
      </g>
      
      <!-- Metrics -->
      <g>
        <rect x="50" y="180" width="400" height="80" fill="#f9fafb" stroke="#d1d5db" stroke-width="1" rx="4"/>
        
        <text x="250" y="200" text-anchor="middle" font-size="12" font-weight="bold" fill="#374151">
          Congestion Impact Metrics
        </text>
        
        <g>
          <text x="100" y="225" text-anchor="middle" font-size="10" fill="#6b7280">Avg Wait Time</text>
          <text x="100" y="245" text-anchor="middle" font-size="16" font-weight="bold" fill="#dc2626">${beforeQueue * 2}s</text>
          <text x="100" y="255" text-anchor="middle" font-size="8" fill="#9ca3af">→</text>
          <text x="100" y="265" text-anchor="middle" font-size="16" font-weight="bold" fill="#16a34a">${afterQueue * 2}s</text>
        </g>
        
        <g>
          <text x="250" y="225" text-anchor="middle" font-size="10" fill="#6b7280">Queue Clearance</text>
          <text x="250" y="245" text-anchor="middle" font-size="16" font-weight="bold" fill="#dc2626">${Math.round(beforeQueue * 1.5)}s</text>
          <text x="250" y="255" text-anchor="middle" font-size="8" fill="#9ca3af">→</text>
          <text x="250" y="265" text-anchor="middle" font-size="16" font-weight="bold" fill="#16a34a">${Math.round(afterQueue * 1.5)}s</text>
        </g>
        
        <g>
          <text x="400" y="225" text-anchor="middle" font-size="10" fill="#6b7280">Throughput</text>
          <text x="400" y="245" text-anchor="middle" font-size="16" font-weight="bold" fill="#dc2626">${Math.round(60 / beforeQueue * 10)}/min</text>
          <text x="400" y="255" text-anchor="middle" font-size="8" fill="#9ca3af">→</text>
          <text x="400" y="265" text-anchor="middle" font-size="16" font-weight="bold" fill="#16a34a">${Math.round(60 / afterQueue * 10)}/min</text>
        </g>
      </g>
    </svg>
  `;
  
  return {
    type: 'queue-length',
    content: svg,
    description,
    caption: `Improved signal timing and lane configuration reduce vehicle queuing by ${Math.round(((beforeQueue - afterQueue) / beforeQueue) * 100)}%, decreasing congestion and emissions while maintaining traffic flow efficiency.`
  };
}

function generateSolutionPlanning(data: Record<string, any>, description: string): Omit<Visualization, 'id' | 'timestamp'> {
  const { 
    speedCameras = 2, 
    stopSigns = 3, 
    redLightCameras = 1, 
    flexBollards = 4,
    intersectionName = 'Main St & 5th Ave'
  } = data;
  
  const svg = `
    <svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow-solution" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#6b7280"/>
        </marker>
      </defs>
      
      <text x="300" y="25" text-anchor="middle" font-size="18" font-weight="bold" fill="#1f2937">
        Safety Intervention Recommendations
      </text>
      <text x="300" y="45" text-anchor="middle" font-size="12" fill="#6b7280">
        ${intersectionName}
      </text>
      
      <!-- Intersection schematic -->
      <g>
        <!-- Main intersection box -->
        <rect x="200" y="100" width="200" height="200" fill="#f3f4f6" stroke="#6b7280" stroke-width="3" rx="4"/>
        
        <!-- Roads -->
        <rect x="280" y="60" width="40" height="280" fill="#d1d5db" opacity="0.7"/>
        <rect x="160" y="180" width="280" height="40" fill="#d1d5db" opacity="0.7"/>
        
        <!-- Center lines -->
        <line x1="300" y1="60" x2="300" y2="340" stroke="#fbbf24" stroke-width="2" stroke-dasharray="10,5"/>
        <line x1="160" y1="200" x2="440" y2="200" stroke="#fbbf24" stroke-width="2" stroke-dasharray="10,5"/>
        
        <!-- Crosswalks -->
        <g opacity="0.8">
          <rect x="270" y="95" width="60" height="8" fill="white" stroke="#374151" stroke-width="1"/>
          <rect x="270" y="297" width="60" height="8" fill="white" stroke="#374151" stroke-width="1"/>
          <rect x="155" y="190" width="8" height="20" fill="white" stroke="#374151" stroke-width="1"/>
          <rect x="437" y="190" width="8" height="20" fill="white" stroke="#374151" stroke-width="1"/>
        </g>
      </g>
      
      <!-- Speed Cameras -->
      ${speedCameras > 0 ? `
        <g>
          <circle cx="250" cy="140" r="12" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <text x="250" y="145" text-anchor="middle" font-size="10" font-weight="bold" fill="white">SC</text>
          <line x1="250" y1="152" x2="250" y2="170" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow-solution)"/>
          
          ${speedCameras > 1 ? `
            <circle cx="350" cy="260" r="12" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
            <text x="350" y="265" text-anchor="middle" font-size="10" font-weight="bold" fill="white">SC</text>
            <line x1="350" y1="248" x2="350" y2="230" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow-solution)"/>
          ` : ''}
        </g>
      ` : ''}
      
      <!-- Stop Signs -->
      ${stopSigns > 0 ? `
        <g>
          <polygon points="220,120 230,115 240,120 235,130 225,130" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
          <text x="230" y="125" text-anchor="middle" font-size="8" font-weight="bold" fill="white">STOP</text>
          
          ${stopSigns > 1 ? `
            <polygon points="370,120 380,115 390,120 385,130 375,130" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
            <text x="380" y="125" text-anchor="middle" font-size="8" font-weight="bold" fill="white">STOP</text>
          ` : ''}
          
          ${stopSigns > 2 ? `
            <polygon points="220,270 230,265 240,270 235,280 225,280" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
            <text x="230" y="275" text-anchor="middle" font-size="8" font-weight="bold" fill="white">STOP</text>
          ` : ''}
        </g>
      ` : ''}
      
      <!-- Red Light Cameras -->
      ${redLightCameras > 0 ? `
        <g>
          <rect x="365" y="275" width="20" height="20" fill="#f59e0b" stroke="#d97706" stroke-width="2" rx="2"/>
          <circle cx="375" cy="285" r="5" fill="#fef3c7"/>
          <text x="375" y="288" text-anchor="middle" font-size="6" font-weight="bold" fill="#78350f">RLC</text>
        </g>
      ` : ''}
      
      <!-- Flex Bollards -->
      ${flexBollards > 0 ? `
        <g>
          ${Array.from({ length: Math.min(flexBollards, 4) }).map((_, i) => {
            const positions = [
              { x: 265, y: 175 },
              { x: 335, y: 175 },
              { x: 265, y: 225 },
              { x: 335, y: 225 }
            ];
            const pos = positions[i];
            return `
              <ellipse cx="${pos.x}" cy="${pos.y}" rx="4" ry="8" fill="#10b981" stroke="#14532d" stroke-width="1"/>
              <ellipse cx="${pos.x}" cy="${pos.y - 3}" rx="3" ry="3" fill="#86efac"/>
            `;
          }).join('')}
        </g>
      ` : ''}
      
      <!-- Legend -->
      <g transform="translate(50, 360)">
        <text x="0" y="0" font-size="14" font-weight="bold" fill="#1f2937">Safety Interventions:</text>
        
        <g transform="translate(0, 20)">
          <circle cx="10" cy="0" r="8" fill="#3b82f6" stroke="#1e40af" stroke-width="1"/>
          <text x="10" y="3" text-anchor="middle" font-size="7" font-weight="bold" fill="white">SC</text>
          <text x="25" y="4" font-size="11" fill="#374151">Speed Camera (${speedCameras})</text>
          <text x="25" y="16" font-size="9" fill="#6b7280">Enforces speed limits</text>
        </g>
        
        <g transform="translate(150, 20)">
          <polygon points="10,0 15,-3 20,0 17,7 13,7" fill="#dc2626" stroke="#7f1d1d" stroke-width="1"/>
          <text x="15" y="4" text-anchor="middle" font-size="6" font-weight="bold" fill="white">STOP</text>
          <text x="30" y="4" font-size="11" fill="#374151">Stop Sign (${stopSigns})</text>
          <text x="30" y="16" font-size="9" fill="#6b7280">Controls intersection flow</text>
        </g>
        
        <g transform="translate(300, 20)">
          <rect x="5" y="-5" width="14" height="14" fill="#f59e0b" stroke="#d97706" stroke-width="1" rx="1"/>
          <circle cx="12" cy="2" r="3" fill="#fef3c7"/>
          <text x="25" y="4" font-size="11" fill="#374151">Red Light Camera (${redLightCameras})</text>
          <text x="25" y="16" font-size="9" fill="#6b7280">Prevents signal violations</text>
        </g>
        
        <g transform="translate(0, 60)">
          <ellipse cx="10" cy="0" rx="3" ry="6" fill="#10b981" stroke="#14532d" stroke-width="1"/>
          <ellipse cx="10" cy="-2" rx="2" ry="2" fill="#86efac"/>
          <text x="25" y="4" font-size="11" fill="#374151">Flex Bollard (${flexBollards})</text>
          <text x="25" y="16" font-size="9" fill="#6b7280">Protects pedestrian zones</text>
        </g>
      </g>
    </svg>
  `;
  
  return {
    type: 'solution-planning',
    content: svg,
    description,
    caption: `This schematic shows recommended placement of safety interventions including ${speedCameras} speed camera(s), ${stopSigns} stop sign(s), ${redLightCameras} red-light camera(s), and ${flexBollards} flexible bollard(s) to enhance intersection safety and protect vulnerable users.`
  };
}
