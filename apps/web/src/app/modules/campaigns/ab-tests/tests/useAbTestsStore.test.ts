/**
 * useAbTestsStore Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAbTestsStore } from '../store/useAbTestsStore';
import type { CreateAbTestInput } from '../types';

describe('useAbTestsStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useAbTestsStore());
    act(() => {
      result.current.clearFilters();
      result.current.clearSelection();
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useAbTestsStore());

    expect(result.current.tests).toBeDefined();
    expect(result.current.selectedTestIds).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('creates a new draft test', async () => {
    const { result } = renderHook(() => useAbTestsStore());

    const input: CreateAbTestInput = {
      name: 'New Test',
      campaignId: 'campaign-1',
      channel: 'email',
      variants: [
        {
          name: 'Control',
          trafficPercentage: 50,
          creative: { type: 'text', content: 'Test' },
          headline: 'Headline',
          cta: 'CTA',
        },
        {
          name: 'Variant A',
          trafficPercentage: 50,
          creative: { type: 'text', content: 'Test' },
          headline: 'Headline 2',
          cta: 'CTA 2',
        },
      ],
      targetMetric: 'ctr',
    };

    const initialCount = result.current.tests.length;

    await act(async () => {
      await result.current.createDraft(input);
    });

    expect(result.current.tests.length).toBe(initialCount + 1);
    const newTest = result.current.tests[0];
    expect(newTest.name).toBe('New Test');
    expect(newTest.status).toBe('draft');
  });

  it('starts a draft test', async () => {
    const { result } = renderHook(() => useAbTestsStore());

    // Create a draft test first
    const input: CreateAbTestInput = {
      name: 'Test to Start',
      campaignId: 'campaign-1',
      channel: 'email',
      variants: [
        {
          name: 'Control',
          trafficPercentage: 50,
          creative: { type: 'text', content: 'Test' },
          headline: 'Headline',
          cta: 'CTA',
        },
        {
          name: 'Variant A',
          trafficPercentage: 50,
          creative: { type: 'text', content: 'Test' },
          headline: 'Headline 2',
          cta: 'CTA 2',
        },
      ],
      targetMetric: 'ctr',
    };

    let testId: string;

    await act(async () => {
      const test = await result.current.createDraft(input);
      testId = test.id;
    });

    await act(async () => {
      await result.current.start(testId!);
    });

    const test = result.current.getTestById(testId!);
    expect(test?.status).toBe('running');
    expect(test?.startDate).toBeDefined();
  });

  it('toggles test selection', () => {
    const { result } = renderHook(() => useAbTestsStore());

    const testId = result.current.tests[0]?.id;
    if (!testId) return;

    act(() => {
      result.current.toggleTestSelection(testId);
    });

    expect(result.current.selectedTestIds).toContain(testId);

    act(() => {
      result.current.toggleTestSelection(testId);
    });

    expect(result.current.selectedTestIds).not.toContain(testId);
  });

  it('applies filters', async () => {
    const { result } = renderHook(() => useAbTestsStore());

    act(() => {
      result.current.setFilters({ status: ['running'] });
    });

    expect(result.current.filters.status).toContain('running');

    await act(async () => {
      await result.current.fetchTests();
    });

    // All returned tests should be running
    result.current.tests.forEach((test) => {
      expect(test.status).toBe('running');
    });
  });

  it('clears all filters', () => {
    const { result } = renderHook(() => useAbTestsStore());

    act(() => {
      result.current.setFilters({
        status: ['running'],
        channels: ['email'],
        search: 'test',
      });
    });

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.status).toEqual([]);
    expect(result.current.filters.channels).toEqual([]);
    expect(result.current.filters.search).toBe('');
  });

  it('selects all tests', () => {
    const { result } = renderHook(() => useAbTestsStore());

    act(() => {
      result.current.selectAll();
    });

    expect(result.current.selectedTestIds.length).toBe(result.current.tests.length);
  });

  it('clears selection', () => {
    const { result } = renderHook(() => useAbTestsStore());

    act(() => {
      result.current.selectAll();
      result.current.clearSelection();
    });

    expect(result.current.selectedTestIds).toEqual([]);
  });
});
