# Reference taxonomy data

The authored Jobvana taxonomy lives under `reference-data/`:

- `industries.json`
- `roles.json`
- `skill-categories.json`
- `skills.json`
- `skill-relations.json`

Relationships are authored with stable taxonomy codes rather than database IDs. Current records also carry an optional `bootstrapId`. Those IDs are transitional compatibility data so the existing synthetic marketplace fixtures keep referring to the same taxonomy rows until issue #24 removes their hard-coded taxonomy IDs. New relationships must not use `bootstrapId`.

## Validate and generate the SQL seed

The JSON files are the authored source. `scripts/load-reference-data.mjs` validates them and generates `supabase/seeds/01_reference_data.sql`.

Run:

```bash
npm run reference-data:check
```

The check fails for malformed records, unknown fields, duplicate codes or bootstrap IDs, missing category parents, category cycles, uncategorized skills, duplicate or dangling category references, invalid/duplicate version codes or ordinals, and invalid/dangling skill relations. It also fails if the generated SQL is stale.

After editing the JSON, regenerate the SQL:

```bash
npm run reference-data:write
npm run reference-data:check
```

The generated SQL is one atomic PostgreSQL `DO` statement, upserts rows by stable code, resolves taxonomy relationships by code, and preserves existing database IDs when a matching code already exists.

The loader does not delete taxonomy rows, memberships, versions, or relations merely because they disappear from JSON. Normal lifecycle removal is explicit through `retiredAt` (stored as `retired_at`) or, later, through admin tooling.

## Local and CI loading

`supabase/config.toml` loads the generated reference-data SQL before `supabase/seed.sql`. A clean `supabase start` or `supabase db reset` therefore creates the taxonomy before the current synthetic marketplace fixtures are loaded.

To apply the current JSON to an already-running local database:

```bash
npm run reference-data:local
```

CI validates that the generated SQL matches the JSON, starts a clean Supabase environment, reapplies the loader to verify that it is idempotent, and then runs the database tests.

## Hosted pre-production loading

For the current pre-launch hosted project, link the Supabase CLI to the intended project and run:

```bash
npm run reference-data:linked
```

This command is intentionally explicit. Verify the linked project before using it.

The JSON loader is a bootstrap/pre-production workflow, not a permanent production synchronization mechanism. Once taxonomy changes are managed through the future admin UI, the database becomes authoritative; the JSON should then be treated as bootstrap/export/reference data rather than repeatedly applied over admin changes.
