npx supabase gen types typescript --project-id ${VITE_SUPABASE_PROJECT_ID} --schema public > src/db/types.ts && npm run lint -- --fix
