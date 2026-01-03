import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, XCircle, AlertCircle, Sparkles, Edit3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DocumentUploadProps {
  onAutoPopulate: (fields: ExtractedFields) => void;
  disabled?: boolean;
}

interface ExtractedFields {
  cityContext?: string;
  data?: string;
  scenario?: string;
  task?: string;
}

export default function DocumentUpload({ onAutoPopulate, disabled }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractionStatus, setExtractionStatus] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'extracting' | 'extracted' | 'error'>('idle');

  const extractTextFromTxt = async (file: File): Promise<string> => {
    setExtractionStatus('Reading text file...');
    setExtractionProgress(50);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setExtractionProgress(100);
        setExtractionStatus('Content extracted!');
        resolve(text);
      };
      reader.onerror = () => reject(new Error('Failed to read TXT file'));
      reader.readAsText(file);
    });
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      setExtractionStatus('Loading PDF processor...');
      setExtractionProgress(20);
      
      // Load PDF.js from CDN dynamically
      if (!(window as any).pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
        
        // Set worker
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      setExtractionStatus('Processing PDF pages...');
      setExtractionProgress(40);

      const pdfjsLib = (window as any).pdfjsLib;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      const totalPages = pdf.numPages;
      
      for (let i = 1; i <= totalPages; i++) {
        setExtractionStatus(`Extracting page ${i} of ${totalPages}...`);
        setExtractionProgress(40 + (i / totalPages) * 50);
        
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }
      
      setExtractionProgress(100);
      setExtractionStatus('Content extracted!');
      return fullText.trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF. Please try copying and pasting the text manually.');
    }
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    try {
      setExtractionStatus('Loading DOCX processor...');
      setExtractionProgress(20);
      
      // Load mammoth from CDN dynamically
      if (!(window as any).mammoth) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      setExtractionStatus('Processing DOCX content...');
      setExtractionProgress(60);

      const mammoth = (window as any).mammoth;
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      setExtractionProgress(100);
      setExtractionStatus('Content extracted!');
      return result.value;
    } catch (error) {
      console.error('DOCX extraction error:', error);
      throw new Error('Failed to extract text from DOCX. Please try copying and pasting the text manually.');
    }
  };

  // Intelligent text parsing to identify field content
  const parseExtractedText = (text: string): ExtractedFields => {
    const fields: ExtractedFields = {};
    const lowerText = text.toLowerCase();
    
    // Split text into paragraphs
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 20);
    
    // Keywords for each field
    const cityKeywords = ['city', 'population', 'area', 'municipality', 'downtown', 'neighborhood', 'district', 'infrastructure'];
    const dataKeywords = ['traffic', 'volume', 'data', 'metric', 'rate', 'count', 'number', 'statistic', 'crash', 'accident', 'ridership'];
    const scenarioKeywords = ['proposed', 'scenario', 'plan', 'design', 'project', 'improvement', 'redesign', 'lane', 'intersection'];
    const taskKeywords = ['analyze', 'evaluate', 'assess', 'compare', 'recommend', 'study', 'examine', 'question', 'task'];
    
    const scoreField = (paragraph: string, keywords: string[]): number => {
      const lowerPara = paragraph.toLowerCase();
      return keywords.reduce((score, keyword) => {
        return score + (lowerPara.includes(keyword) ? 1 : 0);
      }, 0);
    };
    
    // Score each paragraph for each field
    const scoredParagraphs = paragraphs.map(para => ({
      text: para,
      cityScore: scoreField(para, cityKeywords),
      dataScore: scoreField(para, dataKeywords),
      scenarioScore: scoreField(para, scenarioKeywords),
      taskScore: scoreField(para, taskKeywords)
    }));
    
    // Assign paragraphs to fields based on highest score
    scoredParagraphs.forEach(scored => {
      const maxScore = Math.max(scored.cityScore, scored.dataScore, scored.scenarioScore, scored.taskScore);
      
      if (maxScore === 0) {
        // If no clear match, add to data field
        fields.data = fields.data ? `${fields.data}\n\n${scored.text}` : scored.text;
      } else if (scored.cityScore === maxScore && !fields.cityContext) {
        fields.cityContext = scored.text;
      } else if (scored.dataScore === maxScore) {
        fields.data = fields.data ? `${fields.data}\n\n${scored.text}` : scored.text;
      } else if (scored.scenarioScore === maxScore && !fields.scenario) {
        fields.scenario = scored.text;
      } else if (scored.taskScore === maxScore && !fields.task) {
        fields.task = scored.text;
      } else {
        // Add to data as fallback
        fields.data = fields.data ? `${fields.data}\n\n${scored.text}` : scored.text;
      }
    });
    
    return fields;
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadStatus('extracting');
    setUploadedFileName(file.name);
    setExtractionProgress(0);
    setExtractionStatus('Starting extraction...');

    try {
      let text = '';
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'txt') {
        text = await extractTextFromTxt(file);
      } else if (fileExtension === 'pdf') {
        text = await extractTextFromPdf(file);
      } else if (fileExtension === 'docx') {
        text = await extractTextFromDocx(file);
      } else {
        throw new Error('Unsupported file type. Please upload TXT, PDF, or DOCX files.');
      }

      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from the document. The file may be empty or contain only images.');
      }

      setExtractedText(text);
      setUploadStatus('extracted');
      toast.success(`Successfully extracted text from ${file.name}`);
    } catch (error) {
      console.error('File processing error:', error);
      setUploadStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to process file');
      setExtractedText('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file) {
      const validExtensions = ['txt', 'pdf', 'docx'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension && validExtensions.includes(fileExtension)) {
        processFile(file);
      } else {
        toast.error('Please upload a TXT, PDF, or DOCX file');
      }
    }
  }, [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleAutoPopulateFields = () => {
    if (extractedText) {
      const fields = parseExtractedText(extractedText);
      onAutoPopulate(fields);
    }
  };

  const handleClear = () => {
    setExtractedText('');
    setUploadedFileName('');
    setUploadStatus('idle');
    setExtractionProgress(0);
    setExtractionStatus('');
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Smart Upload:</strong> Upload documents and we'll automatically extract and populate the relevant form fields. You can review and edit the extracted content before using it.
        </AlertDescription>
      </Alert>

      <Card
        className={cn(
          'border-2 border-dashed transition-all',
          isDragging && 'border-primary bg-primary/5 scale-[1.02]',
          uploadStatus === 'extracted' && 'border-green-500 bg-green-50 dark:bg-green-950/20',
          uploadStatus === 'error' && 'border-destructive bg-destructive/5',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {isProcessing ? (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <div className="space-y-2 w-full max-w-md">
                  <p className="text-base font-medium">{extractionStatus}</p>
                  <Progress value={extractionProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{uploadedFileName}</p>
                </div>
              </>
            ) : uploadStatus === 'extracted' ? (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-600" />
                <div className="space-y-1">
                  <p className="text-base font-medium text-green-700 dark:text-green-400">
                    Content extracted successfully!
                  </p>
                  <p className="text-sm text-muted-foreground">{uploadedFileName}</p>
                  <Badge variant="outline" className="mt-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Ready for auto-population
                  </Badge>
                </div>
              </>
            ) : uploadStatus === 'error' ? (
              <>
                <XCircle className="h-12 w-12 text-destructive" />
                <div className="space-y-1">
                  <p className="text-base font-medium text-destructive">
                    Failed to process document
                  </p>
                  <p className="text-sm text-muted-foreground">Please try again or paste text manually</p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium">
                    Drag and drop your document here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, DOCX, and TXT files
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || isProcessing}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <FileText className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              {uploadStatus === 'extracted' && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                >
                  Clear
                </Button>
              )}
            </div>

            <input
              id="file-upload"
              type="file"
              accept=".txt,.pdf,.docx"
              className="hidden"
              onChange={handleFileInput}
              disabled={disabled || isProcessing}
            />
          </div>
        </CardContent>
      </Card>

      {extractedText && (
        <Card className="border-2 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" />
                <Label htmlFor="extracted-text" className="text-lg font-semibold">
                  Extracted Content Preview
                </Label>
              </div>
              <Button
                type="button"
                size="default"
                onClick={handleAutoPopulateFields}
                disabled={disabled}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Auto-Populate Fields
              </Button>
            </div>
            
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-sm text-amber-800 dark:text-amber-300">
                Review and edit the extracted text below. Click "Auto-Populate Fields" to intelligently distribute content to the appropriate form fields.
              </AlertDescription>
            </Alert>

            <Textarea
              id="extracted-text"
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="min-h-[250px] resize-y font-mono text-sm"
              placeholder="Extracted text will appear here..."
              disabled={disabled}
            />
            
            <p className="text-xs text-muted-foreground">
              You can edit the extracted text before auto-populating. Our AI will analyze the content and distribute it to the most relevant fields (City Context, Data, Scenario, Task).
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
