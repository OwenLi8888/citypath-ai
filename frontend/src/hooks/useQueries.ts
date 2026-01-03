import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AnalysisReport, AnalysisRequest, Visualization, UploadedDocument } from '@/backend';
import { generateVisualization } from '@/lib/visualGenerator';

export function useGetAllReports() {
  const { actor, isFetching } = useActor();

  return useQuery<AnalysisReport[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAnalysisReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<AnalysisRequest[]>({
    queryKey: ['requests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAnalysisRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUploadedDocuments() {
  const { actor, isFetching } = useActor();

  return useQuery<UploadedDocument[]>({
    queryKey: ['uploadedDocuments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUploadedDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

interface SubmitAnalysisParams {
  cityContext: string;
  data: string;
  scenario: string;
  task: string;
}

export function useSubmitAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SubmitAnalysisParams): Promise<AnalysisReport> => {
      if (!actor) throw new Error('Actor not initialized');

      const requestId = await actor.submitAnalysisRequest(
        params.cityContext,
        params.data,
        params.scenario,
        params.task
      );

      const report = await generateMockReport(requestId, params);
      
      await actor.saveAnalysisReport(report);
      
      return report;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

export function useSaveUploadedDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      fileName: string;
      fileType: string;
      content: string;
      extractedText: string;
    }): Promise<string> => {
      if (!actor) throw new Error('Actor not initialized');
      
      return actor.saveUploadedDocument(
        params.fileName,
        params.fileType,
        params.content,
        params.extractedText
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploadedDocuments'] });
    },
  });
}

async function generateMockReport(
  id: string,
  params: SubmitAnalysisParams
): Promise<AnalysisReport> {
  const hasKidSafety = params.scenario.toLowerCase().includes('school') || 
                       params.scenario.toLowerCase().includes('child') ||
                       params.scenario.toLowerCase().includes('kid') ||
                       params.task.toLowerCase().includes('pedestrian');

  // Generate visualizations
  const visualizations: Visualization[] = [];
  const timestamp = BigInt(Date.now() * 1000000);

  // Cross-section for Option B
  const crossSectionViz = generateVisualization({
    type: 'cross-section',
    data: {
      option: 'B',
      sidewalkWidth: 8,
      bikeWidth: 6,
      travelWidth: 11,
      parkingWidth: 7
    },
    description: 'Comprehensive redesign street cross-section showing protected bike lanes and wider sidewalks'
  });
  visualizations.push({
    id: `${id}-viz-1`,
    ...crossSectionViz,
    timestamp
  });

  // Before/After comparison
  const beforeAfterViz = generateVisualization({
    type: 'before-after',
    data: {
      beforeSpeed: 35,
      afterSpeed: 25,
      beforeConflicts: 14,
      afterConflicts: 8
    },
    description: 'Comparison of key safety metrics before and after implementation'
  });
  visualizations.push({
    id: `${id}-viz-2`,
    ...beforeAfterViz,
    timestamp
  });

  // Conflict points diagram
  const conflictPointsViz = generateVisualization({
    type: 'conflict-points',
    data: {
      beforePoints: 14,
      afterPoints: 8
    },
    description: 'Visual representation of conflict point reduction through design improvements'
  });
  visualizations.push({
    id: `${id}-viz-3`,
    ...conflictPointsViz,
    timestamp
  });

  // Bar chart for safety improvements
  const barChartViz = generateVisualization({
    type: 'bar-chart',
    data: {
      title: 'Safety Impact by Category',
      categories: ['Pedestrian', 'Cyclist', 'Vehicle', 'Overall'],
      values: [65, 58, 42, 55]
    },
    description: 'Percentage improvement in safety metrics across different user groups'
  });
  visualizations.push({
    id: `${id}-viz-4`,
    ...barChartViz,
    timestamp
  });

  // Pedestrian exposure chart (if kid safety is relevant)
  if (hasKidSafety) {
    const pedestrianExposureViz = generateVisualization({
      type: 'pedestrian-exposure',
      data: {
        beforeTime: 28,
        afterTime: 18,
        crossingWidth: 48
      },
      description: 'Reduction in pedestrian exposure time at crossings, critical for child safety'
    });
    visualizations.push({
      id: `${id}-viz-5`,
      ...pedestrianExposureViz,
      timestamp
    });
  }

  // Queue length visualization
  const queueLengthViz = generateVisualization({
    type: 'queue-length',
    data: {
      beforeQueue: 12,
      afterQueue: 6,
      peakHour: '5:00 PM'
    },
    description: 'Traffic queue length reduction during peak hours'
  });
  visualizations.push({
    id: `${id}-viz-6`,
    ...queueLengthViz,
    timestamp
  });

  // Solution Planning visualization
  const solutionPlanningViz = generateVisualization({
    type: 'solution-planning',
    data: {
      speedCameras: 2,
      stopSigns: 3,
      redLightCameras: 1,
      flexBollards: 4,
      intersectionName: 'Main St & 5th Ave'
    },
    description: 'Recommended safety intervention placement for enhanced intersection safety'
  });
  visualizations.push({
    id: `${id}-viz-7`,
    ...solutionPlanningViz,
    timestamp
  });

  return {
    id,
    highLevelSummary: `This analysis evaluates the proposed transportation scenario in the context of ${params.cityContext}. The scenario involves ${params.scenario}, with a focus on ${params.task}. Based on the provided data (${params.data}), this report presents a comprehensive assessment of impacts across safety, mobility, transit, walking, cycling, and vulnerable user considerations. Automated visualizations provide clear, schematic representations of the proposed changes and their expected impacts.`,
    technicalImpactTable: [
      {
        metric: 'Traffic Volume Change',
        value: '-15% during peak hours',
        impact: 'Moderate Positive'
      },
      {
        metric: 'Average Speed',
        value: '25 mph (reduced from 35 mph)',
        impact: 'High Positive for Safety'
      },
      {
        metric: 'Pedestrian Crossing Time',
        value: '18 seconds (improved from 28s)',
        impact: 'Significant Improvement'
      },
      {
        metric: 'Conflict Points',
        value: '8 (reduced from 14)',
        impact: 'High Safety Improvement'
      },
      {
        metric: 'Implementation Timeline',
        value: '6-9 months',
        impact: 'Moderate'
      }
    ],
    scenarioImpactDetails: {
      safety: 'The proposed design significantly enhances safety through reduced vehicle speeds, improved sight lines, and dedicated crossing infrastructure. Conflict points are reduced by 43%, and pedestrian visibility is enhanced through better lighting and clear markings.',
      mobility: 'Overall mobility is maintained with slight improvements in flow efficiency. The design prioritizes sustainable modes while ensuring vehicle access remains functional. Traffic calming measures reduce speeds without creating significant delays.',
      transit: 'Transit operations benefit from dedicated bus lanes and priority signaling. Stop locations are optimized for accessibility, and shelter improvements enhance the passenger experience. Expected ridership increase of 12-18%.',
      walking: 'Pedestrian infrastructure sees major improvements with wider sidewalks (8ft minimum), continuous accessibility, and enhanced crossings. Walking routes are more direct and comfortable, with improved amenities and landscaping.',
      cycling: 'Protected bike lanes provide safe, comfortable cycling infrastructure separated from vehicle traffic. Connections to existing bike networks are improved, and secure bike parking is added at key destinations.',
      vulnerableUsers: 'Special attention to children, elderly, and mobility-impaired users through universal design principles. Tactile paving, audible signals, and rest areas are incorporated. School route safety is prioritized with enhanced crossing guards and signage.'
    },
    options: [
      {
        name: 'Minimal Intervention',
        pros: [
          'Lowest upfront cost ($150K-$250K)',
          'Fastest implementation (2-3 months)',
          'Minimal disruption during construction',
          'Easy to modify if needed'
        ],
        cons: [
          'Limited safety improvements',
          'Does not address root causes',
          'May require future upgrades',
          'Less community impact'
        ],
        costBand: 'Low ($)',
        emotionalFraming: 'A practical first step that shows immediate action while preserving flexibility for future enhancements.'
      },
      {
        name: 'Comprehensive Redesign',
        pros: [
          'Maximum safety improvements',
          'Creates lasting community benefit',
          'Addresses all identified issues',
          'Future-proof infrastructure',
          'Significant child pedestrian safety gains'
        ],
        cons: [
          'Higher initial investment ($800K-$1.2M)',
          'Longer construction period (6-9 months)',
          'Requires more coordination',
          'Temporary traffic impacts'
        ],
        costBand: 'Medium ($$)',
        emotionalFraming: 'An investment in our children\'s safety and community\'s future. Parents can feel confident their kids can walk to school safely.'
      },
      {
        name: 'Phased Implementation',
        pros: [
          'Balances cost and impact',
          'Allows for community feedback',
          'Spreads budget over time',
          'Reduces construction disruption'
        ],
        cons: [
          'Benefits realized over longer period',
          'Requires ongoing coordination',
          'May have inconsistent user experience',
          'Total cost may be higher'
        ],
        costBand: 'Medium ($$)',
        emotionalFraming: 'A thoughtful approach that delivers improvements steadily while learning from each phase to optimize the next.'
      }
    ],
    recommendation: `Based on the comprehensive analysis, Option B (Comprehensive Redesign) is recommended as the preferred approach. While it requires a higher initial investment, the long-term benefits significantly outweigh the costs:\n\n• Safety improvements will reduce crash risk by an estimated 60-70%\n• Enhanced pedestrian and cycling infrastructure supports mode shift goals\n• Kid-friendly design elements make school routes demonstrably safer\n• Community health and livability benefits are substantial\n• Long-term maintenance costs are lower than incremental fixes\n\nThe emotional and practical case for comprehensive action is strong. Families deserve safe routes to school, and the community benefits from infrastructure that serves all users. The 6-9 month implementation timeline is manageable, and the resulting improvements will serve the community for decades.\n\nFunding opportunities through state safety grants and active transportation programs can offset 40-60% of costs. Community support is high, particularly among families with school-age children. This is the right investment at the right time.`,
    kidFriendlyPathIndicator: hasKidSafety ? {
      safetyImprovementPercentage: BigInt(35),
      conflictPointsChange: 'Reduced from 14 to 8 conflict points (-43%). Fewer intersections where children must navigate complex traffic situations.',
      speedReductionImpact: 'Vehicle speeds reduced from 35 mph to 25 mph through traffic calming. At 25 mph, pedestrian survival rate in crashes increases to 90% vs. 50% at 35 mph.',
      crossingSafetyImprovement: 'Crossing time reduced from 28 to 18 seconds. Enhanced visibility with high-visibility crosswalks, pedestrian refuge islands, and leading pedestrian intervals at signals.',
      familyFocusedDesign: 'Design includes child-height sight lines, colorful wayfinding, and comfortable waiting areas. Parents report 85% increase in confidence allowing children to walk independently.'
    } : undefined,
    visualizations,
    solutionRecommendations: [],
    timestamp
  };
}
