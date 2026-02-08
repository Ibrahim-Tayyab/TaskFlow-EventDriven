---
id: PHR-0004
title: Architecture for Inline Dropdowns and Skeleton State
stage: plan
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: 003-inline-editing-ux
branch: 003-inline-editing-ux
user: itboy1
command: /sp.plan
labels: ["plan", "architecture", "ui", "ux", "skeleton", "inline-editing"]
links:
  spec: specs/003-inline-editing-ux/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-inline-editing-ux/plan.md
  - specs/003-inline-editing-ux/research.md
  - specs/003-inline-editing-ux/data-model.md
  - specs/003-inline-editing-ux/quickstart.md
  - specs/003-inline-editing-ux/contracts/task-update-contract.md
tests:
  - constitution check passed
  - research completed
  - data model defined
  - contracts created
---

## Prompt

Create: Architecture for Inline Dropdowns and Skeleton State.
Decisions needing documentation:
- **Edit Mode Logic:** Using a boolean state (`isEditing`) inside `TaskItem` to toggle between Badge and Select.
- **Skeleton Design:** Using a `SkeletonTask` sub-component with a CSS "shimmer" animation for the search/loading state.

Testing strategy:
- **Visual Check:** Search something; verify Skeleton appears instead of "Loading..." text.
- **Interaction Check:** Click "High" priority; dropdown must appear. Select "Low"; tag must update instantly without page refresh.

Technical details:
- **Optimistic Logic:** Ensure the existing `updateTask` function in `page.tsx` is correctly wired to the new dropdowns.
- **Tailwind Shimmer:** Use `animate-pulse` or a custom keyframe for the skeleton bars.

## Response snapshot

Successfully created the implementation plan for the Interactive Inline Editing & Skeleton State feature. The plan includes:

1. **Technical Context**: Defined TypeScript/Next.js technology stack, Tailwind CSS, and project constraints
2. **Constitution Check**: Verified compliance with all constitutional principles (pre and post-design)
3. **Project Structure**: Documented the web application architecture with frontend/backend separation
4. **Research Findings**: Completed Phase 0 research on edit mode logic and skeleton design approaches
5. **Data Model**: Defined entities for Task, TaskTag, and SkeletonTask with validation rules and state transitions
6. **Quickstart Guide**: Created development setup and implementation steps
7. **API Contracts**: Defined task update contract for inline editing functionality
8. **Documentation Structure**: Organized all artifacts in the proper directory structure

The architecture supports interactive inline editing of category and priority tags with skeleton loading states, all using optimistic UI patterns for responsive user experience.

## Outcome

- ✅ Impact: Complete architecture plan for inline editing and skeleton loading
- 🧪 Tests: All constitution checks passed, research completed
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and contracts
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks
- 🧠 Reflection: Architecture aligns with user requirements and constitutional principles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with /sp.tasks to generate implementation tasks