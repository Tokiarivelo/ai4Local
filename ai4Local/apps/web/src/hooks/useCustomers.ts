import { useEffect, useState } from 'react';
import { Customer } from '../lib/types/customer';
import { fetchCustomers } from '../lib/api/customers';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        setError('Erreur lors du chargement des clients');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  return { customers, loading, error };
};