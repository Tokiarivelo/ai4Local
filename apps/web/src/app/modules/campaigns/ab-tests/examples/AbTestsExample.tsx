/**
 * A/B Tests Example Component
 * Demonstrates the module with mocks and realtime updates
 */

'use client';

import React, { useEffect } from 'react';
import { AbTestsLayout } from '../layout/AbTestsLayout';
import { Header } from '../layout/Header';
import { AbTestsPage } from '../components/AbTestsPage';
import { useAbTestsStore, useTests } from '../store/useAbTestsStore';

export function AbTestsExample() {
  const tests = useTests();
  const { fetchTests } = useAbTestsStore();

  // Simulate realtime updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate metric updates for running tests
      const runningTests = tests.filter((t) => t.status === 'running');
      if (runningTests.length > 0) {
        // This would normally come from a websocket or polling
        console.log('Simulating realtime metric updates...');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [tests]);

  // Load initial data
  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  return (
    <AbTestsLayout hasPermission={true}>
      <Header tests={tests} />
      <AbTestsPage />
    </AbTestsLayout>
  );
}
