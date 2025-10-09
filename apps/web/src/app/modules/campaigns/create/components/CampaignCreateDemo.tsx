'use client';

/**
 * Exemple d'utilisation du système de création de campagnes
 * Version simplifiée pour démonstration
 */

import React, { useState } from 'react';
import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import { Badge } from '@/app/modules/ui/badge';
import { Input } from '@/app/modules/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/modules/ui/select';
import {
  ArrowLeft,
  Sparkles,
  Target,
  Palette,
  Users,
  Calendar,
  BarChart,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface Campaign {
  name: string;
  objective: string;
  channels: string[];
  status: 'draft' | 'ready' | 'created';
}

const WIZARD_STEPS = [
  { id: 'basic', title: 'Informations', icon: Target, color: 'bg-blue-500' },
  { id: 'creative', title: 'Créatifs', icon: Palette, color: 'bg-green-500' },
  { id: 'audience', title: 'Audience', icon: Users, color: 'bg-purple-500' },
  { id: 'schedule', title: 'Planning', icon: Calendar, color: 'bg-orange-500' },
  { id: 'tracking', title: 'Tracking', icon: BarChart, color: 'bg-red-500' },
] as const;

/**
 * Version de démonstration du créateur de campagnes
 */
export function CampaignCreateDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [campaign, setCampaign] = useState<Campaign>({
    name: '',
    objective: 'awareness',
    channels: [],
    status: 'draft',
  });

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Créer la campagne
      setCampaign((prev) => ({ ...prev, status: 'created' }));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = WIZARD_STEPS[currentStep];
  const Icon = currentStepData.icon;

  if (campaign.status === 'created') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-green-800 dark:text-green-200">
            Campagne créée !
          </h2>
          <p className="text-muted-foreground mb-6">
            Votre campagne "{campaign.name}" a été créée avec succès.
          </p>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span>Objectif:</span>
              <Badge variant="outline">{campaign.objective}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Canaux:</span>
              <span>{campaign.channels.length}</span>
            </div>
          </div>
          <Button
            onClick={() => {
              setCampaign({ name: '', objective: 'awareness', channels: [], status: 'draft' });
              setCurrentStep(0);
            }}
            className="w-full"
          >
            Créer une nouvelle campagne
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-xl font-semibold">Créer une campagne</h1>
            </div>
            <Badge variant="outline">Démonstration</Badge>
          </div>
        </div>
      </header>

      {/* Navigation par étapes */}
      <nav className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 space-x-2">
            {WIZARD_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 whitespace-nowrap min-w-max
                    ${
                      isCurrent
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 ring-2 ring-blue-200'
                        : isCompleted
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200'
                    }
                  `}
                >
                  <div
                    className={`w-6 h-6 rounded-full ${step.color} flex items-center justify-center`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <StepIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${currentStepData.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                  <p className="text-muted-foreground">
                    Étape {currentStep + 1} sur {WIZARD_STEPS.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenu de l'étape */}
            <div className="mb-8">
              <StepContent step={currentStepData.id} campaign={campaign} onChange={setCampaign} />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>

              <div className="text-sm text-muted-foreground">
                {currentStep + 1} / {WIZARD_STEPS.length}
              </div>

              <Button onClick={handleNext}>
                {currentStep === WIZARD_STEPS.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Créer la campagne
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

/**
 * Contenu selon l'étape
 */
function StepContent({
  step,
  campaign,
  onChange,
}: {
  step: string;
  campaign: Campaign;
  onChange: (campaign: Campaign) => void;
}) {
  switch (step) {
    case 'basic':
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Nom de la campagne *
            </label>
            <Input
              type="text"
              value={campaign.name}
              onChange={(e) => onChange({ ...campaign, name: e.target.value })}
              placeholder="Ex: Promotion Black Friday 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Objectif</label>
            <Select
              value={campaign.objective}
              onValueChange={(value) => onChange({ ...campaign, objective: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un objectif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="awareness">Notoriété</SelectItem>
                <SelectItem value="traffic">Trafic</SelectItem>
                <SelectItem value="leads">Génération de leads</SelectItem>
                <SelectItem value="conversions">Conversions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'creative':
      return (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Créatifs</h3>
          <p className="text-muted-foreground">Upload d'images, vidéos et création de textes</p>
          <Button className="mt-4" disabled>
            Fonctionnalité en développement
          </Button>
        </div>
      );

    case 'audience':
      return (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Audience</h3>
          <p className="text-muted-foreground">Ciblage et segmentation avancée</p>
          <Button className="mt-4" disabled>
            Fonctionnalité en développement
          </Button>
        </div>
      );

    case 'schedule':
      return (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Planning</h3>
          <p className="text-muted-foreground">Budget, dates et optimisation</p>
          <Button className="mt-4" disabled>
            Fonctionnalité en développement
          </Button>
        </div>
      );

    case 'tracking':
      return (
        <div className="text-center py-12">
          <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tracking</h3>
          <p className="text-muted-foreground">UTM, pixels et A/B tests</p>
          <Button className="mt-4" disabled>
            Fonctionnalité en développement
          </Button>
        </div>
      );

    default:
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Étape en développement...</p>
        </div>
      );
  }
}
