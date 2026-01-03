import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

module {
  type OldAnalysisRequest = {
    id : Text;
    cityContext : Text;
    data : Text;
    scenario : Text;
    task : Text;
    timestamp : Int;
  };

  type OldTechnicalImpact = {
    metric : Text;
    value : Text;
    impact : Text;
  };

  type OldScenarioImpact = {
    safety : Text;
    mobility : Text;
    transit : Text;
    walking : Text;
    cycling : Text;
    vulnerableUsers : Text;
  };

  type OldOption = {
    name : Text;
    pros : [Text];
    cons : [Text];
    costBand : Text;
    emotionalFraming : Text;
  };

  type OldKidFriendlyPathIndicator = {
    safetyImprovementPercentage : Nat;
    conflictPointsChange : Text;
    speedReductionImpact : Text;
    crossingSafetyImprovement : Text;
    familyFocusedDesign : Text;
  };

  type OldVisualization = {
    id : Text;
    type_ : Text;
    content : Text;
    description : Text;
    timestamp : Int;
  };

  type OldAnalysisReport = {
    id : Text;
    highLevelSummary : Text;
    technicalImpactTable : [OldTechnicalImpact];
    scenarioImpactDetails : OldScenarioImpact;
    options : [OldOption];
    recommendation : Text;
    kidFriendlyPathIndicator : ?OldKidFriendlyPathIndicator;
    visualizations : [OldVisualization];
    timestamp : Int;
  };

  type OldUploadedDocument = {
    id : Text;
    fileName : Text;
    fileType : Text;
    content : Text;
    extractedText : Text;
    uploadTimestamp : Int;
  };

  type OldActor = {
    analysisRequests : OrderedMap.Map<Text, OldAnalysisRequest>;
    analysisReports : OrderedMap.Map<Text, OldAnalysisReport>;
    visualizations : OrderedMap.Map<Text, OldVisualization>;
    uploadedDocuments : OrderedMap.Map<Text, OldUploadedDocument>;
  };

  type SolutionRecommendation = {
    id : Text;
    type_ : Text;
    location : Text;
    description : Text;
    visualRepresentation : Text;
    impactAssessment : Text;
    timestamp : Int;
  };

  type NewVisualization = {
    id : Text;
    type_ : Text;
    content : Text;
    description : Text;
    caption : Text;
    timestamp : Int;
  };

  type NewAnalysisReport = {
    id : Text;
    highLevelSummary : Text;
    technicalImpactTable : [OldTechnicalImpact];
    scenarioImpactDetails : OldScenarioImpact;
    options : [OldOption];
    recommendation : Text;
    kidFriendlyPathIndicator : ?OldKidFriendlyPathIndicator;
    visualizations : [NewVisualization];
    solutionRecommendations : [SolutionRecommendation];
    timestamp : Int;
  };

  type NewActor = {
    analysisRequests : OrderedMap.Map<Text, OldAnalysisRequest>;
    analysisReports : OrderedMap.Map<Text, NewAnalysisReport>;
    visualizations : OrderedMap.Map<Text, NewVisualization>;
    uploadedDocuments : OrderedMap.Map<Text, OldUploadedDocument>;
    solutionRecommendations : OrderedMap.Map<Text, SolutionRecommendation>;
  };

  public func run(old : OldActor) : NewActor {
    let textMap = OrderedMap.Make<Text>(Text.compare);

    let visualizations = textMap.map<OldVisualization, NewVisualization>(
      old.visualizations,
      func(_id, oldVis) {
        {
          oldVis with
          caption = "No caption available (migrated data)";
        };
      },
    );

    let analysisReports = textMap.map<OldAnalysisReport, NewAnalysisReport>(
      old.analysisReports,
      func(_id, oldReport) {
        {
          oldReport with
          solutionRecommendations = [];
          visualizations = Array.map<OldVisualization, NewVisualization>(
            oldReport.visualizations,
            func(vis) {
              {
                vis with
                caption = "No caption available (migrated data)";
              };
            },
          );
        };
      },
    );

    {
      analysisRequests = old.analysisRequests;
      analysisReports;
      visualizations;
      uploadedDocuments = old.uploadedDocuments;
      solutionRecommendations = textMap.empty();
    };
  };
};

