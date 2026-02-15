# Education Hub Management System (EHMS)

Starter monorepo scaffold.

## Structure
- `/Users/macbook/Documents/New project/apps/web`: Next.js frontend (App Router)
- `/Users/macbook/Documents/New project/apps/api`: Node API scaffold (Supabase-ready auth + lead APIs)
- `/Users/macbook/Documents/New project/supabase`: schema and migrations
- `/Users/macbook/Documents/New project/n8n/workflows`: n8n workflow exports
- `/Users/macbook/Documents/New project/docs`: architecture and module planning

## Run
1. `npm install`
2. Terminal 1: `npm run dev:api`
3. Terminal 2: `npm run dev:web`

## Implemented
- Role-based login scaffold
- Role-aware UI shell and module navigation
- Leads module first slice: all leads, my leads, lead details edit, soft delete, demo request
- Supabase-ready auth path with dev fallback mode
