import React from 'react';
import { TrainingData } from '@/lib/types/training';
import { BarChart } from '@/components/ui/charts/BarChart';
import { LineChart } from '@/components/ui/charts/LineChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrainingVisualizationProps {
  trainingData: TrainingData[];
}

const TrainingVisualization: React.FC<TrainingVisualizationProps> = ({ trainingData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualisation de la Formation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Performance des Formations</h2>
            <BarChart data={trainingData.map(item => item.performance)} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tendances des Formations</h2>
            <LineChart data={trainingData.map(item => item.trend)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingVisualization;