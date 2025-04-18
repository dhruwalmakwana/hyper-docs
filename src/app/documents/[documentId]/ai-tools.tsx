/* eslint-disable */

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/use-editor-store";
import { 
  Wand2Icon, 
  FileTextIcon, 
  Loader2Icon, 
  SparklesIcon,
  ExpandIcon,
  ArrowUpDownIcon,
  PenLineIcon,
  MessageSquareIcon,
  GraduationCapIcon,
  UsersIcon,
  LightbulbIcon,
  LaughIcon
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const AITools = () => {
  const { editor } = useEditorStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryPanelOpen, setIsSummaryPanelOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("");

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
          prompt = `Expand the following text by 50% while maintaining its core message. Format as clean HTML with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes

Return only the HTML content:\n\n${content}`;
          break;
        case 'condense':
          prompt = `Condense the following text by 40% while preserving key information. Format as clean HTML with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes

Return only the HTML content:\n\n${content}`;
          break;
        case 'rewrite':
          prompt = `Rewrite the following text to improve clarity and flow. Format as clean HTML with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes

Return only the HTML content:\n\n${content}`;
          break;
        case 'tone':
          const tonePrompts = {
            formal: `Rewrite the following text in a formal, professional tone. Format as clean HTML with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes

Return only the HTML content:\n\n${content}`,
            casual: `Rewrite the following text in a casual, friendly tone. Format as clean HTML with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes

Return only the HTML content:\n\n${content}`,
            inspirational: `Rewrite the following text in an inspirational tone. Format as clean HTML with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes

Return only the HTML content:\n\n${content}`,
            humor: `Rewrite the following text in a humorous tone. Format as clean HTML with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes

Return only the HTML content:\n\n${content}`
          };
          prompt = tonePrompts[tone as keyof typeof tonePrompts] || tonePrompts.formal;
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

  const handleGenerate = async () => {
    if (!editor) return;
    if (!GEMINI_API_KEY) {
      toast.error('API key is missing. Please check your environment variables.');
      return;
    }
    if (!generatePrompt.trim()) {
      toast.error('Please enter a prompt to generate content.');
      return;
    }
    
    setIsLoading(true);
    try {
      const prompt = `Generate content based on: ${generatePrompt}

Format as clean HTML with:
- <h1> for main title
- <h2> for section headings
- <h3> for subsections
- <p> for paragraphs
- <strong> for important text
- <em> for emphasis
- <ul> and <li> for lists
- <blockquote> for quotes

Return only the HTML content:`;

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
      
      setIsGenerateDialogOpen(false);
      setGeneratePrompt("");
      toast.success('Document generated successfully');
    } catch (error) {
      console.error('AI generation failed:', error);
      if (error instanceof Error) {
        toast.error(`Failed to generate document: ${error.message}`);
      } else {
        toast.error('Failed to generate document: Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50">
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
            <DropdownMenuItem onClick={() => setIsGenerateDialogOpen(true)} disabled={isLoading}>
              <SparklesIcon className="h-4 w-4 mr-2" />
              Generate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAIOperation('expand')} disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ExpandIcon className="h-4 w-4 mr-2" />
              )}
              Make Longer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAIOperation('condense')} disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ArrowUpDownIcon className="h-4 w-4 mr-2" />
              )}
              Make Shorter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAIOperation('rewrite')} disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PenLineIcon className="h-4 w-4 mr-2" />
              )}
              Rewrite
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={isLoading}>
                <MessageSquareIcon className="h-4 w-4 mr-2" />
                Change Tone
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleAIOperation('tone', 'formal')} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <GraduationCapIcon className="h-4 w-4 mr-2" />
                  )}
                  Formal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIOperation('tone', 'casual')} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UsersIcon className="h-4 w-4 mr-2" />
                  )}
                  Casual
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIOperation('tone', 'inspirational')} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LightbulbIcon className="h-4 w-4 mr-2" />
                  )}
                  Inspirational
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIOperation('tone', 'humor')} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LaughIcon className="h-4 w-4 mr-2" />
                  )}
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

      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate Document</DialogTitle>
            <DialogDescription>
              Enter a prompt to generate a new document. The AI will create content based on your requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Describe what you want to generate..."
                value={generatePrompt}
                onChange={(e) => setGeneratePrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SummaryPanel 
        isOpen={isSummaryPanelOpen} 
        onClose={() => setIsSummaryPanelOpen(false)} 
      />
    </>
  );
}; 