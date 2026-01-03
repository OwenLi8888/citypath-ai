# CityPath AI   Municipal Transportation Scenario Analysis

## Overview
CityPath AI is a web application that helps municipal planners analyze transportation scenarios through AI-powered structured analysis. Users input transportation context and scenarios to receive comprehensive reports with safety assessments, recommendations, and automated visual generation capabilities.

## Core Features

### Enhanced Input Interface
Users provide four key inputs through a redesigned form with improved formatting and user experience:
- **CITY_CONTEXT**: Background information about the city/area
- **DATA**: Relevant transportation data and metrics
- **SCENARIO**: Specific transportation scenario to analyze
- **TASK**: Specific analysis task or question

#### Form Design Requirements
- Clean visual hierarchy with logical field grouping and proportional spacing
- Improved typography with polished fonts and clear section headers for better readability
- Professional appearance with balanced color accents suitable for municipal users
- Smooth transitions and animations for enhanced user experience
- Responsive layout that works across different screen sizes
- Inviting yet professional design aesthetic

### Advanced Document Upload and Auto-Population
The enhanced input form includes sophisticated document processing capabilities:
- **Document Upload**: Drag and drop or browse to upload PDF, DOCX, or TXT files
- **Auto-Field Population**: Automatically parse extracted document content and intelligently populate relevant input fields (CITY_CONTEXT, DATA, SCENARIO, TASK) based on content analysis
- **Progress Indicators**: Clear visual feedback showing extraction progress ("Extracting data…" → "Content extracted!")
- **Editable Preview Area**: Dedicated section where users can review and refine extracted content before it populates the form fields
- **Content Refinement**: Users can edit extracted text and choose which content goes into which fields
- **Visual Feedback**: Upload success indicators, extraction progress, and drag-over highlighting
- **Local Processing**: Files processed locally without external storage for demo simplicity

The system intelligently analyzes extracted text to determine the most appropriate field for each piece of content, while allowing users full control over the final field population.

### Analysis Generation
After form submission, the system generates a structured analysis report containing:
- High-Level Summary of the scenario
- Technical Impact Table with key metrics
- Scenario Impact Details covering:
  - Safety considerations
  - Mobility impacts
  - Transit effects
  - Walking infrastructure
  - Cycling infrastructure
  - Vulnerable user impacts
- Three options (A/B/C) with:
  - Pros and cons for each option
  - Cost band estimates
  - Emotional framing considerations
- Final recommendation section with report-ready insights

### Automated Visual Generation with Explanatory Captions
The system includes an internal generator utility that creates lightweight visualizations based on user input data or location information:

#### Visual Types Supported
- ASCII diagrams for geometric or conceptual sketches
- Conceptual cross-sections representing Option A/B/C street designs
- Before/after street layout comparisons
- Simplified bar charts for safety improvement or modal shift metrics
- Pedestrian exposure charts showing crossing time/reduction
- Conflict point diagrams illustrating reduction in vehicle-pedestrian or vehicle-vehicle conflicts
- Queue length visualizations for congestion effects

#### Explanatory Captions
Each chart, diagram, and schematic visualization automatically displays a one- or two-sentence explanatory caption underneath that:
- Describes what the visualization represents
- Explains how it relates to safety or community impact
- Provides context for interpreting the data or design elements

#### Implementation Details
- Visual generator interprets analysis data and produces text-based or SVG-based elements
- Maintains realistic, schematic proportions with emphasis on clarity and recognizability
- Uses mock data for instant rendering in demos
- Supports future API integration for location-based data via HTTP outcalls
- Generates visuals instantly for immediate inclusion in reports
- Automatically generates contextual captions for all visualizations

### Solution Planning Feature
A new feature that generates visual recommendations for street-level safety interventions:

#### Safety Intervention Types
- Speed cameras for traffic calming
- Stop signs for intersection control
- Red-light cameras for compliance enforcement
- Flexible bollards ("flex posts") for lane separation and pedestrian protection

#### Visual Recommendations
- Generates placement recommendations based on scenario context and input data
- Creates simple schematic layouts showing potential intervention locations
- Visualizes safety improvements through before/after comparisons
- Integrates with the existing visualGenerator utility
- Displays recommendations within the main report output in the VisualizationDisplay section

### Kid-Friendly Path Indicator (Option B Enhancement)
A specialized visual feature for Option B that highlights child pedestrian safety:
- Percentage-based safety improvement message (e.g., "35% safer for kids walking to school")
- Visual graphs showing changes in:
  - Conflict points
  - Speed reduction impacts
  - Crossing safety improvements
- Family-focused emotional design elements
- Clear visual indicators for safety and comfort improvements
- Integration with automated visual generation for enhanced diagrams

### Report Display
Generated reports are displayed with:
- Clean, professional formatting with polished typography and spacing
- Improved section headers and narrative flow for better readability
- Visual summaries and charts with explanatory captions
- Automated visualizations integrated into report sections
- Solution planning recommendations with schematic layouts
- Easy-to-read layout suitable for municipal presentations
- Print-friendly format for official documentation
- Dynamic display of generated diagrams and simplified graphs

## Data Storage
The backend stores:
- User analysis requests (input data)
- Uploaded document content and extracted text
- Generated analysis reports
- Historical scenario analyses for reference
- Generated visualization data and configurations
- Solution planning recommendations and intervention placement data

## Technical Requirements
- Enhanced form design with improved visual hierarchy, proportional spacing, and balanced color accents
- Polished typography and smooth transitions throughout the interface
- Intelligent auto-population of form fields from extracted document content
- Progress indicators and user feedback during document processing
- Editable preview area for content refinement
- Form validation for required input fields
- Document upload handling for PDF, DOCX, and TXT files
- Browser-based text extraction from uploaded documents
- AI integration for generating structured analysis
- Visual generation utility for creating diagrams and charts with automatic caption generation
- Solution planning feature for safety intervention recommendations
- HTTP outcall capability for location-based data fetching
- Professional report formatting and visualization with improved readability
- Responsive design for various screen sizes
- SVG and text-based rendering capabilities
- English language content throughout the application
