export interface AIGenerationRequest {
  prompt: string;
  context?: string;
  maxLength?: number;
  tone?: 'professional' | 'casual' | 'enthusiastic' | 'formal';
  language?: string;
}

export interface AIGenerationResponse {
  generatedText: string;
  confidence?: number;
  suggestions?: string[];
}

export interface AIFieldConfig {
  field: string;
  label: string;
  promptTemplate: string;
  maxLength?: number;
  defaultTone?: AIGenerationRequest['tone'];
}
