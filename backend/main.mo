import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import OutCall "http-outcalls/outcall";
import Migration "migration";

(with migration = Migration.run)
actor CityPathAI {
  transient let textMap = OrderedMap.Make<Text>(Text.compare);

  var analysisRequests : OrderedMap.Map<Text, AnalysisRequest> = textMap.empty();
  var analysisReports : OrderedMap.Map<Text, AnalysisReport> = textMap.empty();
  var visualizations : OrderedMap.Map<Text, Visualization> = textMap.empty();
  var uploadedDocuments : OrderedMap.Map<Text, UploadedDocument> = textMap.empty();
  var solutionRecommendations : OrderedMap.Map<Text, SolutionRecommendation> = textMap.empty();

  public type AnalysisRequest = {
    id : Text;
    cityContext : Text;
    data : Text;
    scenario : Text;
    task : Text;
    timestamp : Int;
  };

  public type TechnicalImpact = {
    metric : Text;
    value : Text;
    impact : Text;
  };

  public type ScenarioImpact = {
    safety : Text;
    mobility : Text;
    transit : Text;
    walking : Text;
    cycling : Text;
    vulnerableUsers : Text;
  };

  public type Option = {
    name : Text;
    pros : [Text];
    cons : [Text];
    costBand : Text;
    emotionalFraming : Text;
  };

  public type KidFriendlyPathIndicator = {
    safetyImprovementPercentage : Nat;
    conflictPointsChange : Text;
    speedReductionImpact : Text;
    crossingSafetyImprovement : Text;
    familyFocusedDesign : Text;
  };

  public type Visualization = {
    id : Text;
    type_ : Text;
    content : Text;
    description : Text;
    caption : Text;
    timestamp : Int;
  };

  public type AnalysisReport = {
    id : Text;
    highLevelSummary : Text;
    technicalImpactTable : [TechnicalImpact];
    scenarioImpactDetails : ScenarioImpact;
    options : [Option];
    recommendation : Text;
    kidFriendlyPathIndicator : ?KidFriendlyPathIndicator;
    visualizations : [Visualization];
    solutionRecommendations : [SolutionRecommendation];
    timestamp : Int;
  };

  public type UploadedDocument = {
    id : Text;
    fileName : Text;
    fileType : Text;
    content : Text;
    extractedText : Text;
    uploadTimestamp : Int;
  };

  public type SolutionRecommendation = {
    id : Text;
    type_ : Text;
    location : Text;
    description : Text;
    visualRepresentation : Text;
    impactAssessment : Text;
    timestamp : Int;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public func submitAnalysisRequest(cityContext : Text, data : Text, scenario : Text, task : Text) : async Text {
    let id = Text.concat("request-", debug_show (Time.now()));
    let request : AnalysisRequest = {
      id;
      cityContext;
      data;
      scenario;
      task;
      timestamp = Time.now();
    };
    analysisRequests := textMap.put(analysisRequests, id, request);
    id;
  };

  public func saveAnalysisReport(report : AnalysisReport) : async () {
    analysisReports := textMap.put(analysisReports, report.id, report);
  };

  public func saveVisualization(visualization : Visualization) : async () {
    visualizations := textMap.put(visualizations, visualization.id, visualization);
  };

  public func saveUploadedDocument(fileName : Text, fileType : Text, content : Text, extractedText : Text) : async Text {
    let id = Text.concat("document-", debug_show (Time.now()));
    let document : UploadedDocument = {
      id;
      fileName;
      fileType;
      content;
      extractedText;
      uploadTimestamp = Time.now();
    };
    uploadedDocuments := textMap.put(uploadedDocuments, id, document);
    id;
  };

  public func saveSolutionRecommendation(type_ : Text, location : Text, description : Text, visualRepresentation : Text, impactAssessment : Text) : async Text {
    let id = Text.concat("solution-", debug_show (Time.now()));
    let recommendation : SolutionRecommendation = {
      id;
      type_;
      location;
      description;
      visualRepresentation;
      impactAssessment;
      timestamp = Time.now();
    };
    solutionRecommendations := textMap.put(solutionRecommendations, id, recommendation);
    id;
  };

  public query func getAnalysisRequest(id : Text) : async ?AnalysisRequest {
    textMap.get(analysisRequests, id);
  };

  public query func getAnalysisReport(id : Text) : async ?AnalysisReport {
    textMap.get(analysisReports, id);
  };

  public query func getVisualization(id : Text) : async ?Visualization {
    textMap.get(visualizations, id);
  };

  public query func getUploadedDocument(id : Text) : async ?UploadedDocument {
    textMap.get(uploadedDocuments, id);
  };

  public query func getSolutionRecommendation(id : Text) : async ?SolutionRecommendation {
    textMap.get(solutionRecommendations, id);
  };

  public query func getAllAnalysisRequests() : async [AnalysisRequest] {
    Iter.toArray(textMap.vals(analysisRequests));
  };

  public query func getAllAnalysisReports() : async [AnalysisReport] {
    Iter.toArray(textMap.vals(analysisReports));
  };

  public query func getAllVisualizations() : async [Visualization] {
    Iter.toArray(textMap.vals(visualizations));
  };

  public query func getAllUploadedDocuments() : async [UploadedDocument] {
    Iter.toArray(textMap.vals(uploadedDocuments));
  };

  public query func getAllSolutionRecommendations() : async [SolutionRecommendation] {
    Iter.toArray(textMap.vals(solutionRecommendations));
  };

  public func generateVisualization(type_ : Text, content : Text, description : Text, caption : Text) : async Text {
    let id = Text.concat("visualization-", debug_show (Time.now()));
    let visualization : Visualization = {
      id;
      type_;
      content;
      description;
      caption;
      timestamp = Time.now();
    };
    visualizations := textMap.put(visualizations, id, visualization);
    id;
  };
};

