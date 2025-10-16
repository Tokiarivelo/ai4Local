/**
 * A/B Tests Module - Public API
 */

// Components
export { AbTestsPage as default } from './components/AbTestsPage';
export { AbTestsList } from './components/AbTestsList';
export { AbTestRow } from './components/AbTestRow';
export { AbTestEditorModal } from './components/AbTestEditorModal';
export { AbTestFilters } from './components/AbTestFilters';
export { AbTestActions } from './components/AbTestActions';
export { VariantEditor } from './components/VariantEditor';
export { TrafficSplitter } from './components/TrafficSplitter';
export { MetricsSelector } from './components/MetricsSelector';
export { ResultsDashboard } from './components/ResultsDashboard';
export { AbTestPreview } from './components/AbTestPreview';

// Layout
export { AbTestsLayout } from './layout/AbTestsLayout';
export { Header } from './layout/Header';

// Store
export { useAbTestsStore } from './store/useAbTestsStore';
export * from './store/useAbTestsStore';

// Types
export type * from './types';

// Utils
export * from './utils/abtest-calculations';
export * from './utils/sanity-checks';

// Examples
export { AbTestsExample } from './examples/AbTestsExample';
