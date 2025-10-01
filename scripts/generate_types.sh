npx supabase gen types typescript --project-id ${SUPABASE_PROJECT_ID} --schema public > src/db/types.ts && npm run lint -- --fix
