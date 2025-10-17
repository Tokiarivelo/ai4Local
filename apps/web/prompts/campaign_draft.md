Generates the **Dashboard → Campaigns → Drafts** functionality for AI4Local.

GENERAL CONSTRAINTS (follow the last prompt)

- STRICTLY follow the same structure, conventions, and best practices as `dashboard/campaigns/templates` and the previous A/B Tests module.
- Place everything under `app/modules/campaigns/drafts/`.
- Tech stack: Next.js 15 (App Router), React + TypeScript (strict), TailwindCSS, shadcn/ui for UI primitives.
- Use **zustand** for the module store (drafts store).
- Support for Dark/Light mode, mobile-first, ARIA accessibility, and Bun-compatible scripts.
- No `any`. Small, exported, and testable components.

EXPECTED STRUCTURE

- app/modules/campaigns/drafts/
  - layout/
    - DraftsLayout.tsx // wrapper, breadcrumb, permission checks
    - Header.tsx
  - components/
    - DraftsPage.tsx // entry page
    - DraftsList.tsx // liste virtualisée des drafts
    - DraftRow.tsx // ligne réutilisable (summary + actions)
    - DraftEditorDrawer.tsx // drawer/modal pour ouvrir et éditer le draft
    - DraftPreview.tsx // preview post/ad
    - DraftFilters.tsx // filtres et recherche
    - DraftActions.tsx // bulk actions (restore, publish, delete)
    - DraftEmptyState.tsx
  - store/
    - useDraftsStore.ts // zustand store (liste, selected, draftsDrafts, pagination, filters)
  - types.ts // Draft, CampaignRef, DTOs
  - mocks/
    - drafts.mock.ts
  - utils/
    - drafts-utils.ts // helpers (mergeDraft, diffDrafts, validation checks)
    - validators.ts // zod schemas for drafts
  - examples/
    - DraftsExample.tsx
  - README.md
  - tests/
    - DraftRow.test.tsx
    - useDraftsStore.test.ts

SPÉCIFICATIONS FONCTIONNELLES & COMPORTEMENTS

1. Vue principale (DraftsPage)

   - Top toolbar : search global, bouton "Créer un draft", bulk actions menu, refresh.
   - Stats strip : total drafts, drafts by channel, drafts last 7d.
   - Main area : `DraftsList` (virtualisée) + right panel preview on desktop (collapses below on mobile).

2. DraftsList & DraftRow

   - Colonnes / card info : Checkbox, title, linked campaign (optional), channel, lastEdited (relative), owner, status (draft/auto-saved), tags, actions (Edit, Duplicate, Publish, Delete).
   - Row compact on mobile; expand to show summary/preview.
   - Kebab menu actions with confirmation for destructive actions.

3. DraftEditorDrawer

   - Opens from row or "Create draft".
   - Form editor minimal: title, body (rich text / textarea), media attach, schedule placeholder, tags.
   - Autosave draft to zustand store every X secs and onChange debounce (500ms).
   - Buttons: Save draft (explicit), Duplicate, Publish (validate), Close (with unsaved changes prompt).

4. Bulk Actions & Selection

   - Select multiple drafts → bulk Duplicate, Publish, Delete.
   - Confirmation modal for delete/publish multiple.
   - Toasts for success/failure.

5. Filters & Search

   - Filters: channel, owner, tags, date range, status.
   - Debounced search (300ms), highlight matches in title/preview.

6. Store (useDraftsStore.ts — zustand)

   - State: drafts: Draft[], selectedIds: string[], filters, pagination, isLoading, editingDrafts: Record<id, Draft>, autosaveQueue.
   - Actions: fetchDrafts(params), createDraft(payload), updateDraft(id, patch), duplicateDraft(id), publishDraft(id), deleteDraft(id), setFilters(), setSelectedIds(), autosaveDraft(id, draft), clearDraft(id).
   - Middleware: optional localStorage persistence for unsaved drafts (opt-in).
   - Expose typed selectors and async actions using promise-based API (mock fetch in examples).

7. Validation & Business Rules

   - validators.ts (zod) to ensure required fields before publish (title non-empty, at least 1 channel/creative if required).
   - `drafts-utils.ts` includes `mergeDraft`, `hasUnsavedChanges`, `getDraftSummary`.

8. Mocks & Examples

   - `drafts.mock.ts` with >=10 varied drafts: basic draft, draft with media, auto-saved, draft linked to campaign, draft by different owners.
   - `DraftsExample.tsx` demonstrates usage with mocked API and zustand persistence, autosave simulation and publish flow.

9. Tests & Quality

   - Unit tests examples: `DraftRow.test.tsx` (render read/unread, actions), `useDraftsStore.test.ts` (create/update/duplicate autosave).
   - Accessibility tests: ensure drawer focus trap, aria-labels for actions, keyboard shortcuts (n: new draft, e: edit selected).

10. Performance & UX

- Virtualized list for long drafts.
- Avoid heavy rerenders: memoize rows, avoid inline functions in list.
- Show skeleton loaders while fetching.
- Confirmations for destructive actions.

DELIVERABLES ATTENDUS

- Code TSX/TS pour tous les fichiers listés, avec header comment décrivant la responsabilité du fichier.
- `useDraftsStore.ts` (zustand) implémenté avec example persistence.
- `mocks/drafts.mock.ts` and `DraftsExample.tsx` that simulate autosave & publish.
- `validators.ts` zod schemas and `drafts-utils.ts`.
- README: integration notes, how to wire to real API, how to enable zustand persistence, keyboard shortcuts.
- Tests skeletons for store & draft row.
- All components should use shadcn/ui primitives where appropriate (Dialog, Drawer, Button, Input, Badge, Toast).

BONNES PRATIQUES À RESPECTER

- Follow same code style and folder layout as `dashboard/campaigns/templates` and the A/B Tests module.
- Small single-responsibility components, exported with `index.ts` in folders.
- Strong typing, no `any`. Reuse types across store and components.
- Context/provider only if necessary — prefer zustand for module state.
- Comments and README for maintainability.
- Dark/Light mode via CSS variables + Tailwind `dark:`.

OUTPUT

- Provide the prompt as a spec — or generate the files directly if requested.
- If you're generating code, put each file with a short header comment and usage examples in `DraftsExample.tsx`.

FIN.
