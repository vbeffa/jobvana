# Synthetic fixture data

Jobvana has three distinct database initialization paths:

- **reference-only** — the production-safe default;
- **demo/test** — a small explicit dataset for normal development and CI;
- **bulk** — the large synthetic marketplace dataset for pagination, scrolling, query, and UI-load testing.

The normal Supabase seed configuration does not create synthetic Auth users, companies, jobs, or job seekers.

## Authored fixture data

The bulk fixture source remains under `fixture-data/`:

- `auth-users.json`
- `companies.json`
- `jobs.json`
- `job-seekers.json`

The small demo fixture uses the same schema under `fixture-data/demo/`.

The demo dataset contains:

- 2 companies: Jobvana and Planet Express;
- 3 company Auth identities, including one intentionally left in onboarding state;
- 3 job-seeker Auth identities, including one intentionally left in onboarding state;
- 2 fully onboarded job seekers;
- 4 jobs, including Planet Express's Delivery Boy role.

`scripts/load-fixture-data.mjs` validates both datasets. It generates:

- `supabase/seed.sql` from the bulk fixture;
- `supabase/seeds/10_demo_data.sql` from the demo fixture.

The JSON files are the maintained source. Generated SQL must not be edited by hand.

## Stable references

Synthetic records use readable fixture-local keys for Auth users, companies, addresses, jobs, and job seekers. Relationships in the JSON refer to those keys instead of database IDs.

Taxonomy references use stable taxonomy codes:

- companies use `industryCode`;
- job roles use `roleCode`;
- skills use skill codes;
- skill versions use `skillCode` plus `versionCode`.

The generated SQL resolves fixture keys and taxonomy codes when the fixture is loaded. Numeric IDs for companies, addresses, jobs, and job seekers are allocated from the database identity sequences during loading rather than authored in JSON.

Auth fixture UUIDs remain explicit because they identify the Auth users themselves, but marketplace relationships refer to fixture keys rather than repeating UUID foreign keys.

## Validation and generation

Validate both fixture sets:

```bash
npm run fixture-data:check
npm run demo-data:check
```

The checks reject malformed records, unknown fields, duplicate fixture keys, unknown taxonomy codes, missing fixture references, addresses attached to the wrong company, duplicate relationships, invalid enums and timestamps, and unsupported active-resume references. They also fail when the corresponding generated SQL is stale.

After editing bulk fixture JSON:

```bash
npm run fixture-data:write
npm run fixture-data:check
```

After editing demo fixture JSON:

```bash
npm run demo-data:write
npm run demo-data:check
```

## Loading workflows

### Reference data only

This is the default and production-safe initialization path:

```bash
npm run seed:reference
```

It runs `supabase db reset`. The configured default seed files are only:

1. `supabase/seeds/01_reference_data.sql`
2. `supabase/seeds/99_reset_taxonomy_sequences.sql`

No synthetic Auth identities or marketplace fixtures are loaded.

### Demo/test data

For a small local development/test environment:

```bash
npm run seed:demo
```

This resets the local database to the reference-only baseline, loads `supabase/seeds/10_demo_data.sql`, and reapplies the post-seed taxonomy/privilege cleanup.

All six demo Auth identities are deliberately login-capable with the shared development/test password `abcd1234`:

| Purpose | Email | Initial state |
| --- | --- | --- |
| Jobvana company | `admin@jobvana.test` | Fully onboarded |
| Planet Express company | `admin@planet-express.test` | Fully onboarded |
| Philip Fry | `fry@example.test` | Fully onboarded job seeker |
| Turanga Leela | `leela@example.test` | Fully onboarded job seeker |
| Company onboarding | `new-company@jobvana.test` | Auth + company registration only; no company profile |
| Job-seeker onboarding | `new-job-seeker@jobvana.test` | Auth + job-seeker registration only; no job-seeker profile |

The two onboarding identities deliberately omit their corresponding marketplace profile rows so logging in enters the company or job-seeker onboarding UI. Running `npm run seed:demo` restores that initial state after either onboarding flow has been completed. Predictable login credentials exist only in this explicit demo workflow.

### Bulk load-test data

For the large synthetic dataset:

```bash
npm run seed:bulk
```

This resets the local database to the reference-only baseline, then explicitly loads `supabase/seed.sql`. The bulk fixture keeps its synthetic Auth rows for relational ownership, but they are not assigned the shared login password.

The bulk load is intentionally opt-in and can take substantially longer than the demo/reference workflows on slower machines.

The generated fixture seeds are intended for clean initialization and are not idempotent. Reset before switching between reference, demo, and bulk states.

## Hosted pre-launch load testing

The bulk SQL can still be loaded into a linked pre-launch/test project when synthetic scale is needed. Because the generated fixture contains multiple SQL statements, use a native Postgres connection rather than `supabase db query --file`:

```bash
psql "$JOBVANA_PRELAUNCH_DB_URL" -v ON_ERROR_STOP=1 \
  -f supabase/seed.sql \
  -f supabase/seeds/99_reset_taxonomy_sequences.sql
```

Set `JOBVANA_PRELAUNCH_DB_URL` to the direct or session-pooler connection string for the explicitly selected non-production project. The normal deployment path should apply migrations/reference data without automatically loading synthetic marketplace fixtures.

## CI behavior

Routine database CI validates both structured fixture sets but starts Supabase with the reference-only default seed. CI verifies that no synthetic marketplace/Auth rows are present after that initialization, then explicitly loads the small demo fixture for login and database tests.

Routine CI does not load the full bulk dataset. Bulk loading remains available for dedicated/manual load testing.
