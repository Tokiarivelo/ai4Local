GGenerates the Dashboard / Campaigns / A-B Tests functionality for AI4Local.

Main constraint:

- STRICTLY follow the same structure and conventions as `dashboard/campaigns/templates`.
- Place everything under `app/modules/campaigns/ab-tests/`.
- Use **TypeScript**, **Next.js 15 App Router**, **Tailwind CSS**, **shadcn/ui** for UI primitives.
- Use **zustand** for the module store (AB test status, selection, draft, pagination, filters).
- Respect Dark/Light mode, mobile-first, ARIA accessibility, and Bun for scripts.

Expected tree structure (created exactly under `app/modules/campaigns/ab-tests/`):

- layout/
  - AbTestsLayout.tsx // wrapper, breadcrumb, permission checks
  - Header.tsx
- components/
  - AbTestsPage.tsx // entry page composant
  - AbTestsList.tsx // liste virtualisée des AB tests
  - AbTestRow.tsx // row réutilisable (summary + actions)
  - AbTestEditorModal.tsx // modal pour créer/éditer AB test
  - VariantEditor.tsx // editor d’une variante (creative, headline, CTA)
  - TrafficSplitter.tsx // UI drag / input pour split %
  - MetricsSelector.tsx // choisir KPI de victoire (CTR, Conversions, LTV)
  - ResultsDashboard.tsx // visualisation résultats (charts, winner)
  - AbTestFilters.tsx // filtres et recherche
  - AbTestActions.tsx // bulk actions (run, pause, stop, archive)
  - AbTestPreview.tsx // preview variant (mobile & desktop)
- store/
  - useAbTestsStore.ts // zustand store (types, actions, selectors)
- types.ts // ABTest, Variant, Metrics, DTOs
- mocks/
  - abtests.mock.ts
- utils/
  - abtest-calculations.ts // helper pour statistiques & winner logic
  - sanity-checks.ts // validation business rules
- examples/
  - AbTestsExample.tsx // monte la page avec mocks + zustand
- README.md
- tests/
  - AbTestRow.test.tsx
  - useAbTestsStore.test.ts

Functional Specifications & Behaviors:

1. **List & Paging**

- Virtualized list for perf (react-window or equivalent).
- Cols: Name, Campaign, Channel, Status, Start/End, Variants count, KPIs (CTR, Conversions), Actions.
- Search + filters (status, channel, owner, date range).
- Bulk select + actions (Start, Pause, Stop, Archive, Export CSV).

2. **Create / Edit AB Test**

- `AbTestEditorModal`: title, linked campaign, variants (min 2), traffic split (sum 100%), target metric, duration.
- Variant = creative (image/video/text) + headline + CTA.
- Strong validation (Zod schemas) and instant preview per variant.
- Save draft / Validate / Launch actions; store via zustand until API commit.

3. **Traffic Split UI**

- Drag handles + numeric inputs, accessible keyboard.
- Enforcer: sum = 100% (visual validation).

4. **Metrics & Winner Logic**

- `MetricsSelector`: CTR, Conversions, CPA, LTV.
- `utils/abtest-calculations.ts`: mockable deterministic logic to compute winner (statistical check simplified + thresholds).
- `ResultsDashboard`: sparkline charts + bar comparisons; auto-detect winner suggestion.

5. **Results & Reporting**

- Live update simulation via mock subscription hook in examples.
- Option to "Stop test and declare winner" with confirmation modal.
- Export results (CSV/JSON) and view historical runs.

6. **State Management**

- `useAbTestsStore` (zustand) must:
  • store list, pagination, filters, selected row ids, editingDrafts, realtime status per test.
  • expose actions: fetchList(params), createDraft(payload), updateDraft(id), publish(id), pause(id), resume(id), stop(id), archive(id), setFilters(), setPagination().
  • persist middleware support (localStorage) for drafts (opt-in).
  • selectors typed and memoized where useful.

7. **Tests & Mocks**

- Provide `abtests.mock.ts` ≥ 8 varied tests (draft, running, paused, finished) with variants & sample metrics.
- Unit tests examples for `AbTestRow` rendering and `useAbTestsStore` actions.

8. **Reusability & Modularity**

- Small, testable UI components, exported via `index.ts` in each folder.
- Business logic isolated in `utils/` and hooks.
- Use shadcn components for Modal, Dialog, Button, Input, Select, Tabs, Toast.
- No `any` — strong TS typing.

9. **Accessibility & UX**

- Keyboard nav for list & modal, aria labels for dynamic controls (traffic splitter).
- Confirm modals for destructive actions.
- Dark/Light support via CSS variables + Tailwind `dark:` classes.

Expected deliverables:

- All TSX/TS files mentioned, commented (header comment per file).
- `useAbTestsStore.ts` implemented with zustand + example persistence.
- `abtests.mock.ts` and `AbTestsExample.tsx` that simulates realtime updates.
- README with integration notes, how to wire to real API, and how to enable zustand persistence.
- Tests skeletons for store & a component.

Constraints finales (bref) :

- Follow same code style & folder layout as `dashboard/campaigns/templates`.
- Use shadcn/ui + zustand.
- Mobile-first, dark/light, accessible, well-typed, modular, testable.
