/* eslint-disable */

import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useEditorStore } from "@/store/use-editor-store";
import { toast } from "sonner";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface SummaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SummaryPanel = ({ isOpen, onClose }: SummaryPanelProps) => {
  const { editor } = useEditorStore();
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    if (!editor) return;
    if (!GEMINI_API_KEY) {
      toast.error('API key is missing. Please check your environment variables.');
      return;
    }
    
    setIsLoading(true);
    try {
      const content = editor.getText();
      
      const prompt = `You are a document formatter. Format the following text as a clean HTML summary without any markdown code blocks or backticks. Use proper HTML structure with:
- <h2> for the summary title
- <p> for summary paragraphs
- <strong> for key points
- <ul> and <li> for bullet points
- <br> for line breaks
Return only the HTML content without any additional text or markdown formatting. Maintain all line breaks and paragraph spacing:\n\n${content}`;
      
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`);
      }
      
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Failed to parse API response as JSON');
      }

      if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Unexpected API response format');
      }

      const generatedText = result.candidates[0].content.parts[0].text;
      
      // Remove markdown code blocks if present
      const cleanText = generatedText.replace(/```html\n?|\n?```/g, '').trim();
      
      // Format the content for TipTap editor with HTML
      const formattedSummary = cleanText
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0 && line !== '<p></p>')
        .join('\n');
      
      setSummary(formattedSummary);
      
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('Summary generation failed:', error);
      if (error instanceof Error) {
        toast.error(`Failed to generate summary: ${error.message}`);
      } else {
        toast.error('Failed to generate summary: Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg border-l transition-transform duration-200 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Document Summary</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 h-[calc(100vh-4rem)] overflow-y-auto">
        {!summary ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">Generate a summary of your document</p>
            <Button onClick={generateSummary} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Summary'}
            </Button>
          </div>
        ) : (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        )}
      </div>
    </div>
  );
}; 