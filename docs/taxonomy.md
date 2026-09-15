# Taxonomy data model

Jobvana uses structured taxonomy data so exact skill filters can be based on canonical concepts rather than loose text matching. The schema keeps relational numeric IDs for efficient joins while adding stable machine-readable codes for authored data, imports, and future admin tooling.

## Stable codes

The following taxonomy entities have a required stable `code`:

- industries
- roles
- skill categories
- skills
- skill versions

Codes use lowercase ASCII letters and digits separated by hyphens. A code is generated from the display name (or version label) when omitted on insert, but it is not regenerated when the display value changes. Once published, a code should therefore be treated as the durable external identifier.

Reference-data JSON and synthetic fixtures should use codes rather than database IDs.

## Retirement instead of deletion

Taxonomy entities have a nullable `retired_at` timestamp. Normal removal from the active taxonomy should retire a row rather than physically delete it.

Foreign keys from marketplace/business data use `ON DELETE RESTRICT` so deleting reference data cannot silently remove companies, job classifications, job skills, seeker skills, or version selections.

Internal taxonomy-only relationships may still cascade where deleting a parent concept is otherwise safe, but physical deletion should be exceptional.

## Skill categories

`skills.skill_category_id` remains the primary/display category so existing application queries continue to work.

`skill_category_memberships` stores all categories assigned to a skill. The primary/display category is automatically inserted into the membership table whenever a skill is created or its primary category changes. Changing the primary category does not automatically remove the previous membership, allowing it to remain as a secondary category.

This supports concepts such as XML belonging to both a markup-language category and a data-interchange-format category without duplicating the skill itself.

## Skill relations

`skill_relations` stores an authored directed edge:

```
skill_id -> related_skill_id
```

When `is_bidirectional = false`, only that direction is asserted.

When `is_bidirectional = true`, consumers should treat the reverse relationship as implied without storing a second reverse row.

A skill cannot be related to itself.

Relations are taxonomy metadata. They must not silently broaden exact skill filtering; exact-vs-related search behavior is tracked separately in issue #25.

## Skill versions

A skill version has:

- a stable per-skill `code`
- a display `version` label
- a required positive `ordinal`
- an optional `release_date`

`ordinal` is the authoritative relative ordering within a skill. Higher ordinals represent later versions. It remains required and unique per skill because version strings are not consistently sortable across technologies.

`release_date` is optional because an exact release date may be unknown or not meaningful for every technology, edition, or specification.

## Future admin tooling

The eventual admin application should operate on this relational model. Until that exists, version-controlled reference-data files can be loaded by stable code. Once production taxonomy changes are made through the admin system, the database becomes authoritative and JSON should be treated as bootstrap/export data rather than something that overwrites production edits.
