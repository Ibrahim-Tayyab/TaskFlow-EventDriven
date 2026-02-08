---
id: PHR-0007
title: Architecture for Better Auth client server setup
stage: plan
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: 004-auth-better-auth
branch: 004-auth-better-auth
user: itboy1
command: /sp.plan
labels: ["plan", "architecture", "authentication", "better-auth", "security"]
links:
  spec: specs/004-auth-better-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-auth-better-auth/plan.md
  - specs/004-auth-better-auth/research.md
  - specs/004-auth-better-auth/data-model.md
  - specs/004-auth-better-auth/quickstart.md
  - specs/004-auth-better-auth/contracts/auth-contract.md
tests:
  - constitution check passed
  - research completed
  - data model defined
  - contracts created
---

## Prompt

Create: Architecture for Better Auth client/server setup and Task-User relationship.
Decisions needing documentation:
- **Auth Strategy:** Use Better Auth with cookie-based sessions.
- **Backend Sync:** How FastAPI will verify the Better Auth session/token.
- **Data Migration:** Adding `user_id` column to existing `tasks` table.

Testing strategy:
- **Guest Test:** Attempt to access `/dashboard` without login (should redirect to `/login`).
- **Auth Flow:** Signup -> Login -> Create Task -> Verify task is linked to the user in DB.

Technical details:
- **Library:** `better-auth` for Next.js.
- **Database:** Update Neon DB schema with required auth tables.
- **Env:** Setup `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.

## Response snapshot

Successfully created the implementation plan for the Better Auth integration. The plan includes:

1. **Summary**: Complete overview of Better Auth integration with user authentication and task isolation
2. **Technical Context**: Defined TypeScript/Next.js and Python/FastAPI technology stack with Better Auth
3. **Constitution Check**: Verified compliance with all constitutional principles (pre and post-design)
4. **Project Structure**: Detailed architecture with frontend/backend separation and migration files
5. **Research Findings**: Completed Phase 0 research on auth strategy, backend sync, and data migration
6. **Data Model**: Defined entities for User, Session, Account, Verification, and Task with relationships
7. **Quickstart Guide**: Created development setup and implementation instructions
8. **API Contracts**: Defined authentication and user-specific task management endpoints
9. **Documentation Structure**: Organized all artifacts in the proper directory structure

The architecture supports secure authentication with Better Auth, proper session management, and user-specific task isolation.

## Outcome

- ✅ Impact: Complete architecture plan for authentication system
- 🧪 Tests: All constitution checks passed, research completed
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and contracts
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks
- 🧠 Reflection: Architecture aligns with user requirements and constitutional principles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with /sp.tasks to generate implementation tasks