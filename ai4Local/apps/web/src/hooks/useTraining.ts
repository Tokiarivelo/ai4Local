import { useEffect, useState } from 'react';
import { fetchTrainingResources } from '../lib/api/training';
import { TrainingResource } from '../lib/types/training';

export const useTraining = () => {
  const [trainingResources, setTrainingResources] = useState<TrainingResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrainingResources = async () => {
      try {
        const resources = await fetchTrainingResources();
        setTrainingResources(resources);
      } catch (err) {
        setError('Erreur lors du chargement des ressources de formation.');
      } finally {
        setLoading(false);
      }
    };

    loadTrainingResources();
  }, []);

  return { trainingResources, loading, error };
};