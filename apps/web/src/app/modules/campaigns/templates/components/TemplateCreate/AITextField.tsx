'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/app/modules/ui/button';
import { Input } from '@/app/modules/ui/input';
import { Textarea } from '@/app/modules/ui/textarea';
import { Label } from '@/app/modules/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/modules/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import { useAIGeneration } from '../../hooks/useAIGeneration';
import type { AIGenerationRequest } from '../../types/ai-generation.types';

interface AITextFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  fieldType: 'headline' | 'caption' | 'callToAction' | 'objective';
  multiline?: boolean;
  rows?: number;
  context?: string;
}

const TONE_OPTIONS: Array<{ value: AIGenerationRequest['tone']; label: string }> = [
  { value: 'professional', label: 'Professionnel' },
  { value: 'casual', label: 'Décontracté' },
  { value: 'enthusiastic', label: 'Enthousiaste' },
  { value: 'formal', label: 'Formel' },
];

export function AITextField({
  value,
  onChange,
  label,
  placeholder,
  fieldType,
  multiline = false,
  rows = 3,
  context,
}: AITextFieldProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState<AIGenerationRequest['tone']>('professional');
  const [showAIOptions, setShowAIOptions] = useState(false);
  const { generateText, isGenerating, error } = useAIGeneration();

  const handleGenerate = async () => {
    if (!aiPrompt.trim() && !context) return;

    try {
      const generatedText = await generateText({
        prompt: fieldType,
        context: aiPrompt || context,
        tone: selectedTone,
      });

      onChange(generatedText);
      setShowAIOptions(false);
      setAiPrompt('');
    } catch (err) {
      console.error('AI generation failed:', err);
    }
  };

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Popover open={showAIOptions} onOpenChange={setShowAIOptions}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Générer avec l'IA
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Génération par IA</h4>
                <p className="text-sm text-muted-foreground">
                  Décrivez ce que vous souhaitez et l'IA générera le texte pour vous.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-prompt">Description</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="Ex: Une promotion pour les soldes d'été..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-tone">Ton</Label>
                <Select value={selectedTone} onValueChange={(v) => setSelectedTone(v as any)}>
                  <SelectTrigger id="ai-tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value ?? ''}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || (!aiPrompt.trim() && !context)}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer
                  </>
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="relative">
        <InputComponent
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={multiline ? rows : undefined}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => {
              setShowAIOptions(true);
              setAiPrompt(value);
            }}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
