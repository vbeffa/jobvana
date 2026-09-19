# Synthetic fixture data

The authored synthetic marketplace fixtures live under `fixture-data/`:

- `auth-users.json`
- `companies.json`
- `jobs.json`
- `job-seekers.json`

`scripts/load-fixture-data.mjs` validates those files and generates `supabase/seed.sql`. The JSON files are the maintained source; the generated SQL must not be edited by hand.

## Stable references

Synthetic records use readable fixture-local keys for Auth users, companies, addresses, jobs, and job seekers. Relationships in the JSON refer to those keys instead of database IDs.

Taxonomy references use stable taxonomy codes:

- companies use `industryCode`
- job roles use `roleCode`
- skills use skill codes
- skill versions use `skillCode` plus `versionCode`

The generated SQL resolves fixture keys and taxonomy codes when the fixture is loaded. Numeric IDs for companies, addresses, jobs, and job seekers are allocated from the database identity sequences during loading rather than authored in JSON.

Auth fixture UUIDs remain explicit because they identify the Auth users themselves, but marketplace relationships refer to fixture keys rather than repeating UUID foreign keys.

## Validation and generation

Run:

```bash
npm run fixture-data:check
```

The check rejects malformed records, unknown fields, duplicate fixture keys, unknown taxonomy codes, missing fixture references, addresses attached to the wrong company, duplicate relationships, invalid enums and timestamps, and unsupported active-resume references. It also fails if `supabase/seed.sql` is stale.

After editing fixture JSON:

```bash
npm run fixture-data:write
npm run fixture-data:check
```

## Auth fixtures

Issue #45 preserves the existing Auth behavior while changing how the marketplace fixtures are represented. The converted Auth rows keep their existing fixture UUIDs, emails, profile metadata, identity rows, and the legacy shared password-login behavior.

`supabase/seed.sql` creates the Auth rows from the structured fixture data. The post-seed compatibility block in `supabase/seeds/99_reset_taxonomy_sequences.sql` then stores bcrypt hashes for the same legacy fixture password used before this conversion. This is intentionally transitional: issue #11 owns removal or isolation of predictable test identities, and issue #46 will separate production-safe, demo/test, and bulk load-test seed workflows.

## Current loading behavior

This issue changes the source representation, not the seed path. `supabase/config.toml` still loads `supabase/seed.sql` during the normal local seed process, after the generated reference taxonomy seed and before the post-seed compatibility cleanup.

A clean `supabase start` or `supabase db reset` therefore loads the complete generated fixture against the actual schema and taxonomy while retaining the previous fixture-login behavior. Database CI also runs fixture-count and Auth-compatibility checks to guard against accidental behavioral changes or loss of the load-test dataset.

The generated fixture seed is intended for clean development/test initialization and is not idempotent.
