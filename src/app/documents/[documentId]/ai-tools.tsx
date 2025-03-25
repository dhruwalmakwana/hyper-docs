/* eslint-disable */

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/use-editor-store";
import { Wand2Icon, FileTextIcon, Loader2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { SummaryPanel } from "./summary-panel";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const AITools = () => {
  const { editor } = useEditorStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryPanelOpen, setIsSummaryPanelOpen] = useState(false);

  const handleAIOperation = async (operation: string, tone?: string) => {
    if (!editor) return;
    if (!GEMINI_API_KEY) {
      toast.error('API key is missing. Please check your environment variables.');
      return;
    }
    
    setIsLoading(true);
    try {
      const content = editor.getText();
      let prompt = "";

      // Create appropriate prompts for Gemini
      switch (operation) {
        case 'expand':
          prompt = `You are a document formatter. Format the following text as clean HTML without any markdown code blocks or backticks. Use proper HTML structure with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes
Return only the HTML content without any additional text or markdown formatting. Keep line breaks minimal and only use them between major sections:\n\n${content}`;
          break;
        case 'condense':
          prompt = `You are a document formatter. Format the following text as clean HTML without any markdown code blocks or backticks. Use proper HTML structure with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes
Return only the HTML content without any additional text or markdown formatting. Keep line breaks minimal and only use them between major sections:\n\n${content}`;
          break;
        case 'rewrite':
          prompt = `You are a document formatter. Format the following text as clean HTML without any markdown code blocks or backticks. Use proper HTML structure with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes
Return only the HTML content without any additional text or markdown formatting. Keep line breaks minimal and only use them between major sections:\n\n${content}`;
          break;
        case 'tone':
          prompt = `You are a document formatter. Format the following text as clean HTML without any markdown code blocks or backticks. Use proper HTML structure with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes
Return only the HTML content without any additional text or markdown formatting. Keep line breaks minimal and only use them between major sections:\n\n${content}`;
          break;
      }

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
      const formattedContent = cleanText
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0 && line !== '<p></p>')
        .join('\n');
      
      // Replace the current content with the AI-generated content
      editor.commands.setContent(formattedContent, false, { preserveWhitespace: 'full' });
      
      toast.success(`Document ${operation}${tone ? ` with ${tone} tone` : ''} successful`);
    } catch (error) {
      console.error('AI operation failed:', error);
      if (error instanceof Error) {
        toast.error(`Failed to process document: ${error.message}`);
      } else {
        toast.error('Failed to process document: Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="rounded-full shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="h-5 w-5 animate-spin" />
              ) : (
                <Wand2Icon className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleAIOperation('expand')} disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Make Longer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAIOperation('condense')} disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Make Shorter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAIOperation('rewrite')} disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Rewrite
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={isLoading}>Change Tone</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleAIOperation('tone', 'formal')} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Formal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIOperation('tone', 'casual')} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Casual
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIOperation('tone', 'inspirational')} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Inspirational
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIOperation('tone', 'humor')} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Humor
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={() => setIsSummaryPanelOpen(true)} disabled={isLoading}>
              <FileTextIcon className="h-4 w-4 mr-2" />
              Summarize
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SummaryPanel 
        isOpen={isSummaryPanelOpen} 
        onClose={() => setIsSummaryPanelOpen(false)} 
      />
    </>
  );
}; 