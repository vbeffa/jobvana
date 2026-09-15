#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(root, 'supabase/seeds/01_reference_data.sql');
const referencePaths = {
  industries: resolve(root, 'reference-data/industries.json'),
  roles: resolve(root, 'reference-data/roles.json'),
  skillCategories: resolve(root, 'reference-data/skill-categories.json'),
  skills: resolve(root, 'reference-data/skills.json'),
  skillRelations: resolve(root, 'reference-data/skill-relations.json')
};

const codePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message) {
  throw new Error(message);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function assertObject(value, context) {
  if (!isPlainObject(value)) fail(`${context} must be an object`);
}

function assertArray(value, context) {
  if (!Array.isArray(value)) fail(`${context} must be an array`);
}

function assertAllowedKeys(value, allowed, context) {
  const extras = Object.keys(value).filter((key) => !allowed.includes(key));
  if (extras.length) fail(`${context} has unknown field(s): ${extras.join(', ')}`);
}

function assertRequiredKeys(value, required, context) {
  const missing = required.filter((key) => !(key in value));
  if (missing.length) fail(`${context} is missing field(s): ${missing.join(', ')}`);
}

function assertString(value, context, { nullable = false, nonempty = false } = {}) {
  if (nullable && value === null) return;
  if (typeof value !== 'string') fail(`${context} must be ${nullable ? 'a string or null' : 'a string'}`);
  if (nonempty && value.length === 0) fail(`${context} must not be empty`);
}

function assertCode(value, context) {
  assertString(value, context, { nonempty: true });
  if (!codePattern.test(value)) fail(`${context} must match ${codePattern}`);
}

function assertBootstrapId(value, context) {
  if (value === undefined || value === null) return;
  if (!Number.isInteger(value) || value <= 0) fail(`${context} must be a positive integer when provided`);
}

function assertRetiredAt(value, context) {
  if (value === null) return;
  assertString(value, context, { nonempty: true });
  if (Number.isNaN(Date.parse(value))) fail(`${context} must be an ISO timestamp or null`);
}

function assertReleaseDate(value, context) {
  if (value === null) return;
  assertString(value, context, { nonempty: true });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    fail(`${context} must be YYYY-MM-DD or null`);
  }
}

function assertUnique(values, context) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) fail(`${context} contains duplicate value: ${value}`);
    seen.add(value);
  }
}

async function loadJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function loadReferenceData() {
  const entries = await Promise.all(
    Object.entries(referencePaths).map(async ([key, path]) => [key, await loadJson(path)])
  );
  return Object.fromEntries(entries);
}

function validateReferenceData(data) {
  for (const [key, value] of Object.entries(data)) assertArray(value, key);

  for (const [index, item] of data.industries.entries()) {
    const context = `industries[${index}]`;
    assertObject(item, context);
    assertAllowedKeys(item, ['bootstrapId', 'code', 'name', 'retiredAt'], context);
    assertRequiredKeys(item, ['code', 'name', 'retiredAt'], context);
    assertBootstrapId(item.bootstrapId, `${context}.bootstrapId`);
    assertCode(item.code, `${context}.code`);
    assertString(item.name, `${context}.name`, { nonempty: true });
    assertRetiredAt(item.retiredAt, `${context}.retiredAt`);
  }

  for (const [index, item] of data.roles.entries()) {
    const context = `roles[${index}]`;
    assertObject(item, context);
    assertAllowedKeys(item, ['bootstrapId', 'code', 'name', 'description', 'reference', 'retiredAt'], context);
    assertRequiredKeys(item, ['code', 'name', 'description', 'reference', 'retiredAt'], context);
    assertBootstrapId(item.bootstrapId, `${context}.bootstrapId`);
    assertCode(item.code, `${context}.code`);
    assertString(item.name, `${context}.name`, { nonempty: true });
    assertString(item.description, `${context}.description`);
    assertString(item.reference, `${context}.reference`, { nullable: true });
    assertRetiredAt(item.retiredAt, `${context}.retiredAt`);
  }

  for (const [index, item] of data.skillCategories.entries()) {
    const context = `skillCategories[${index}]`;
    assertObject(item, context);
    assertAllowedKeys(item, ['bootstrapId', 'code', 'name', 'parentCode', 'description', 'reference', 'notes', 'retiredAt'], context);
    assertRequiredKeys(item, ['code', 'name', 'parentCode', 'description', 'reference', 'notes', 'retiredAt'], context);
    assertBootstrapId(item.bootstrapId, `${context}.bootstrapId`);
    assertCode(item.code, `${context}.code`);
    assertString(item.name, `${context}.name`, { nonempty: true });
    if (item.parentCode !== null) assertCode(item.parentCode, `${context}.parentCode`);
    assertString(item.description, `${context}.description`, { nullable: true });
    assertString(item.reference, `${context}.reference`, { nullable: true });
    assertString(item.notes, `${context}.notes`, { nullable: true });
    assertRetiredAt(item.retiredAt, `${context}.retiredAt`);
  }

  const versionBootstrapIds = [];
  for (const [index, item] of data.skills.entries()) {
    const context = `skills[${index}]`;
    assertObject(item, context);
    assertAllowedKeys(item, ['bootstrapId', 'code', 'name', 'description', 'abbreviation', 'reference', 'notes', 'retiredAt', 'categoryCodes', 'versions'], context);
    assertRequiredKeys(item, ['code', 'name', 'description', 'abbreviation', 'reference', 'notes', 'retiredAt', 'categoryCodes', 'versions'], context);
    assertBootstrapId(item.bootstrapId, `${context}.bootstrapId`);
    assertCode(item.code, `${context}.code`);
    assertString(item.name, `${context}.name`, { nonempty: true });
    assertString(item.description, `${context}.description`, { nullable: true });
    assertString(item.abbreviation, `${context}.abbreviation`, { nullable: true });
    assertString(item.reference, `${context}.reference`, { nullable: true });
    assertString(item.notes, `${context}.notes`, { nullable: true });
    assertRetiredAt(item.retiredAt, `${context}.retiredAt`);
    assertArray(item.categoryCodes, `${context}.categoryCodes`);
    if (item.categoryCodes.length === 0) fail(`${context}.categoryCodes must contain at least one category`);
    for (const [categoryIndex, code] of item.categoryCodes.entries()) assertCode(code, `${context}.categoryCodes[${categoryIndex}]`);
    assertUnique(item.categoryCodes, `${context}.categoryCodes`);
    assertArray(item.versions, `${context}.versions`);

    const versionCodes = [];
    const versionOrdinals = [];
    for (const [versionIndex, version] of item.versions.entries()) {
      const versionContext = `${context}.versions[${versionIndex}]`;
      assertObject(version, versionContext);
      assertAllowedKeys(version, ['bootstrapId', 'code', 'version', 'ordinal', 'releaseDate', 'reference', 'notes', 'retiredAt'], versionContext);
      assertRequiredKeys(version, ['code', 'version', 'ordinal', 'releaseDate', 'reference', 'notes', 'retiredAt'], versionContext);
      assertBootstrapId(version.bootstrapId, `${versionContext}.bootstrapId`);
      if (version.bootstrapId != null) versionBootstrapIds.push(version.bootstrapId);
      assertCode(version.code, `${versionContext}.code`);
      assertString(version.version, `${versionContext}.version`, { nonempty: true });
      if (!Number.isInteger(version.ordinal) || version.ordinal <= 0) fail(`${versionContext}.ordinal must be a positive integer`);
      assertReleaseDate(version.releaseDate, `${versionContext}.releaseDate`);
      assertString(version.reference, `${versionContext}.reference`, { nullable: true });
      assertString(version.notes, `${versionContext}.notes`, { nullable: true });
      assertRetiredAt(version.retiredAt, `${versionContext}.retiredAt`);
      versionCodes.push(version.code);
      versionOrdinals.push(version.ordinal);
    }
    assertUnique(versionCodes, `${context}.versions codes`);
    assertUnique(versionOrdinals, `${context}.versions ordinals`);
  }

  for (const [index, relation] of data.skillRelations.entries()) {
    const context = `skillRelations[${index}]`;
    assertObject(relation, context);
    assertAllowedKeys(relation, ['skillCode', 'relatedSkillCode', 'isBidirectional'], context);
    assertRequiredKeys(relation, ['skillCode', 'relatedSkillCode', 'isBidirectional'], context);
    assertCode(relation.skillCode, `${context}.skillCode`);
    assertCode(relation.relatedSkillCode, `${context}.relatedSkillCode`);
    if (typeof relation.isBidirectional !== 'boolean') fail(`${context}.isBidirectional must be a boolean`);
    if (relation.skillCode === relation.relatedSkillCode) fail(`${context} cannot relate a skill to itself`);
  }

  assertUnique(data.industries.map((item) => item.code), 'industry codes');
  assertUnique(data.roles.map((item) => item.code), 'role codes');
  assertUnique(data.skillCategories.map((item) => item.code), 'skill category codes');
  assertUnique(data.skills.map((item) => item.code), 'skill codes');
  assertUnique(data.industries.filter((item) => item.bootstrapId != null).map((item) => item.bootstrapId), 'industry bootstrap IDs');
  assertUnique(data.roles.filter((item) => item.bootstrapId != null).map((item) => item.bootstrapId), 'role bootstrap IDs');
  assertUnique(data.skillCategories.filter((item) => item.bootstrapId != null).map((item) => item.bootstrapId), 'skill category bootstrap IDs');
  assertUnique(data.skills.filter((item) => item.bootstrapId != null).map((item) => item.bootstrapId), 'skill bootstrap IDs');
  assertUnique(versionBootstrapIds, 'skill version bootstrap IDs');

  const categoryCodes = new Set(data.skillCategories.map((item) => item.code));
  for (const category of data.skillCategories) {
    if (category.parentCode !== null && !categoryCodes.has(category.parentCode)) {
      fail(`skill category ${category.code} references missing parent ${category.parentCode}`);
    }
    if (category.parentCode === category.code) fail(`skill category ${category.code} cannot be its own parent`);
  }

  const categoryByCode = new Map(data.skillCategories.map((item) => [item.code, item]));
  for (const category of data.skillCategories) {
    const seen = new Set([category.code]);
    let current = category;
    while (current.parentCode !== null) {
      if (seen.has(current.parentCode)) fail(`skill category hierarchy contains a cycle involving ${category.code}`);
      seen.add(current.parentCode);
      current = categoryByCode.get(current.parentCode);
    }
  }

  const skillCodes = new Set(data.skills.map((item) => item.code));
  for (const skill of data.skills) {
    for (const categoryCode of skill.categoryCodes) {
      if (!categoryCodes.has(categoryCode)) fail(`skill ${skill.code} references missing category ${categoryCode}`);
    }
  }

  for (const relation of data.skillRelations) {
    if (!skillCodes.has(relation.skillCode)) fail(`skill relation references missing skill ${relation.skillCode}`);
    if (!skillCodes.has(relation.relatedSkillCode)) fail(`skill relation references missing skill ${relation.relatedSkillCode}`);
  }
  assertUnique(data.skillRelations.map((item) => `${item.skillCode}->${item.relatedSkillCode}`), 'skill relation pairs');
}

function sqlLiteral(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return `'${String(value).replaceAll("'", "''")}'`;
}

function upsertValues(table, item, fields, conflictFields, updateFields) {
  const columns = [];
  const values = [];
  if (item.bootstrapId != null) {
    columns.push('id');
    values.push(item.bootstrapId);
  }
  for (const [column, key] of fields) {
    columns.push(column);
    values.push(item[key]);
  }
  const updates = updateFields.map((column) => `${column} = excluded.${column}`).join(',\n  ');
  return `insert into ${table} (${columns.join(', ')})\nvalues (${values.map(sqlLiteral).join(', ')})\non conflict (${conflictFields.join(', ')}) do update set\n  ${updates};`;
}

function generateSql(data) {
  const statements = [
    '-- GENERATED FILE. DO NOT EDIT.',
    '-- Source: reference-data/*.json',
    '-- Regenerate with: npm run reference-data:write',
    '',
    'do $jobvana_reference_data

  for (const item of data.industries) {
    statements.push(upsertValues(
      'public.industries', item,
      [['code', 'code'], ['name', 'name'], ['retired_at', 'retiredAt']],
      ['code'], ['name', 'retired_at']
    ), '');
  }

  for (const item of data.roles) {
    statements.push(upsertValues(
      'public.roles', item,
      [['code', 'code'], ['name', 'name'], ['description', 'description'], ['reference', 'reference'], ['retired_at', 'retiredAt']],
      ['code'], ['name', 'description', 'reference', 'retired_at']
    ), '');
  }

  for (const item of data.skillCategories) {
    statements.push(upsertValues(
      'public.skill_categories', { ...item, parentCode: null },
      [['code', 'code'], ['name', 'name'], ['parent_skill_category_id', 'parentCode'], ['description', 'description'], ['reference', 'reference'], ['notes', 'notes'], ['retired_at', 'retiredAt']],
      ['code'], ['name', 'description', 'reference', 'notes', 'retired_at']
    ), '');
  }

  for (const item of data.skillCategories) {
    const parentExpression = item.parentCode === null
      ? 'null'
      : `(select id from public.skill_categories where code = ${sqlLiteral(item.parentCode)})`;
    statements.push(
      `update public.skill_categories\nset parent_skill_category_id = ${parentExpression}\nwhere code = ${sqlLiteral(item.code)};`,
      ''
    );
  }

  for (const item of data.skills) {
    statements.push(upsertValues(
      'public.skills', item,
      [['code', 'code'], ['name', 'name'], ['description', 'description'], ['abbreviation', 'abbreviation'], ['reference', 'reference'], ['notes', 'notes'], ['retired_at', 'retiredAt']],
      ['code'], ['name', 'description', 'abbreviation', 'reference', 'notes', 'retired_at']
    ), '');
  }

  for (const skill of data.skills) {
    for (const categoryCode of skill.categoryCodes) {
      statements.push(
        `insert into public.skill_category_memberships (skill_id, skill_category_id)\nselect s.id, c.id\nfrom public.skills s\njoin public.skill_categories c on c.code = ${sqlLiteral(categoryCode)}\nwhere s.code = ${sqlLiteral(skill.code)}\non conflict do nothing;`,
        ''
      );
    }
  }

  for (const skill of data.skills) {
    for (const version of skill.versions) {
      const columns = [];
      const selectValues = [];
      if (version.bootstrapId != null) {
        columns.push('id');
        selectValues.push(String(version.bootstrapId));
      }
      columns.push('skill_id', 'code', 'version', 'reference', 'notes', 'release_date', 'ordinal', 'retired_at');
      selectValues.push(
        's.id', sqlLiteral(version.code), sqlLiteral(version.version), sqlLiteral(version.reference),
        sqlLiteral(version.notes), sqlLiteral(version.releaseDate), String(version.ordinal), sqlLiteral(version.retiredAt)
      );
      statements.push(
        `insert into public.skill_versions (${columns.join(', ')})\nselect ${selectValues.join(', ')}\nfrom public.skills s\nwhere s.code = ${sqlLiteral(skill.code)}\non conflict (skill_id, code) do update set\n  version = excluded.version,\n  reference = excluded.reference,\n  notes = excluded.notes,\n  release_date = excluded.release_date,\n  ordinal = excluded.ordinal,\n  retired_at = excluded.retired_at;`,
        ''
      );
    }
  }

  for (const relation of data.skillRelations) {
    statements.push(
      `insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)\nselect s.id, r.id, ${sqlLiteral(relation.isBidirectional)}\nfrom public.skills s\njoin public.skills r on r.code = ${sqlLiteral(relation.relatedSkillCode)}\nwhere s.code = ${sqlLiteral(relation.skillCode)}\non conflict (skill_id, related_skill_id) do update set\n  is_bidirectional = excluded.is_bidirectional;`,
      ''
    );
  }

  statements.push('end;', '$jobvana_reference_data$;', '');
  return statements.join('\n');
}

async function assertGeneratedSqlCurrent(generatedSql) {
  let current;
  try {
    current = await readFile(outputPath, 'utf8');
  } catch {
    fail('generated reference-data SQL is missing; run npm run reference-data:write');
  }
  if (current !== generatedSql) fail('generated reference-data SQL is stale; run npm run reference-data:write');
}

function runSupabase(target) {
  const result = spawnSync('supabase', ['db', 'query', target, '--file', outputPath], {
    cwd: root,
    stdio: 'inherit'
  });
  if (result.error) fail(`failed to run Supabase CLI: ${result.error.message}`);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function main() {
  const mode = process.argv[2] ?? '--check';
  if (!['--check', '--write', '--local', '--linked'].includes(mode) || process.argv.length > 3) {
    fail('usage: node scripts/load-reference-data.mjs [--check|--write|--local|--linked]');
  }

  const data = await loadReferenceData();
  validateReferenceData(data);
  const generatedSql = generateSql(data);

  if (mode === '--write') {
    await writeFile(outputPath, generatedSql, 'utf8');
    console.log(`Wrote ${outputPath}`);
    return;
  }

  await assertGeneratedSqlCurrent(generatedSql);
  if (mode === '--local') runSupabase('--local');
  if (mode === '--linked') runSupabase('--linked');

  const versionCount = data.skills.reduce((count, skill) => count + skill.versions.length, 0);
  const membershipCount = data.skills.reduce((count, skill) => count + skill.categoryCodes.length, 0);
  console.log(`Reference taxonomy valid: ${data.industries.length} industries, ${data.roles.length} roles, ${data.skillCategories.length} categories, ${data.skills.length} skills, ${versionCount} versions, ${membershipCount} memberships, ${data.skillRelations.length} relations.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
,
    'begin',
    ''
  ];

  for (const item of data.industries) {
    statements.push(upsertValues(
      'public.industries', item,
      [['code', 'code'], ['name', 'name'], ['retired_at', 'retiredAt']],
      ['code'], ['name', 'retired_at']
    ), '');
  }

  for (const item of data.roles) {
    statements.push(upsertValues(
      'public.roles', item,
      [['code', 'code'], ['name', 'name'], ['description', 'description'], ['reference', 'reference'], ['retired_at', 'retiredAt']],
      ['code'], ['name', 'description', 'reference', 'retired_at']
    ), '');
  }

  for (const item of data.skillCategories) {
    statements.push(upsertValues(
      'public.skill_categories', { ...item, parentCode: null },
      [['code', 'code'], ['name', 'name'], ['parent_skill_category_id', 'parentCode'], ['description', 'description'], ['reference', 'reference'], ['notes', 'notes'], ['retired_at', 'retiredAt']],
      ['code'], ['name', 'description', 'reference', 'notes', 'retired_at']
    ), '');
  }

  for (const item of data.skillCategories) {
    const parentExpression = item.parentCode === null
      ? 'null'
      : `(select id from public.skill_categories where code = ${sqlLiteral(item.parentCode)})`;
    statements.push(
      `update public.skill_categories\nset parent_skill_category_id = ${parentExpression}\nwhere code = ${sqlLiteral(item.code)};`,
      ''
    );
  }

  for (const item of data.skills) {
    statements.push(upsertValues(
      'public.skills', item,
      [['code', 'code'], ['name', 'name'], ['description', 'description'], ['abbreviation', 'abbreviation'], ['reference', 'reference'], ['notes', 'notes'], ['retired_at', 'retiredAt']],
      ['code'], ['name', 'description', 'abbreviation', 'reference', 'notes', 'retired_at']
    ), '');
  }

  for (const skill of data.skills) {
    for (const categoryCode of skill.categoryCodes) {
      statements.push(
        `insert into public.skill_category_memberships (skill_id, skill_category_id)\nselect s.id, c.id\nfrom public.skills s\njoin public.skill_categories c on c.code = ${sqlLiteral(categoryCode)}\nwhere s.code = ${sqlLiteral(skill.code)}\non conflict do nothing;`,
        ''
      );
    }
  }

  for (const skill of data.skills) {
    for (const version of skill.versions) {
      const columns = [];
      const selectValues = [];
      if (version.bootstrapId != null) {
        columns.push('id');
        selectValues.push(String(version.bootstrapId));
      }
      columns.push('skill_id', 'code', 'version', 'reference', 'notes', 'release_date', 'ordinal', 'retired_at');
      selectValues.push(
        's.id', sqlLiteral(version.code), sqlLiteral(version.version), sqlLiteral(version.reference),
        sqlLiteral(version.notes), sqlLiteral(version.releaseDate), String(version.ordinal), sqlLiteral(version.retiredAt)
      );
      statements.push(
        `insert into public.skill_versions (${columns.join(', ')})\nselect ${selectValues.join(', ')}\nfrom public.skills s\nwhere s.code = ${sqlLiteral(skill.code)}\non conflict (skill_id, code) do update set\n  version = excluded.version,\n  reference = excluded.reference,\n  notes = excluded.notes,\n  release_date = excluded.release_date,\n  ordinal = excluded.ordinal,\n  retired_at = excluded.retired_at;`,
        ''
      );
    }
  }

  for (const relation of data.skillRelations) {
    statements.push(
      `insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)\nselect s.id, r.id, ${sqlLiteral(relation.isBidirectional)}\nfrom public.skills s\njoin public.skills r on r.code = ${sqlLiteral(relation.relatedSkillCode)}\nwhere s.code = ${sqlLiteral(relation.skillCode)}\non conflict (skill_id, related_skill_id) do update set\n  is_bidirectional = excluded.is_bidirectional;`,
      ''
    );
  }

  statements.push('commit;', '');
  return statements.join('\n');
}

async function assertGeneratedSqlCurrent(generatedSql) {
  let current;
  try {
    current = await readFile(outputPath, 'utf8');
  } catch {
    fail('generated reference-data SQL is missing; run npm run reference-data:write');
  }
  if (current !== generatedSql) fail('generated reference-data SQL is stale; run npm run reference-data:write');
}

function runSupabase(target) {
  const result = spawnSync('supabase', ['db', 'query', target, '--file', outputPath], {
    cwd: root,
    stdio: 'inherit'
  });
  if (result.error) fail(`failed to run Supabase CLI: ${result.error.message}`);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function main() {
  const mode = process.argv[2] ?? '--check';
  if (!['--check', '--write', '--local', '--linked'].includes(mode) || process.argv.length > 3) {
    fail('usage: node scripts/load-reference-data.mjs [--check|--write|--local|--linked]');
  }

  const data = await loadReferenceData();
  validateReferenceData(data);
  const generatedSql = generateSql(data);

  if (mode === '--write') {
    await writeFile(outputPath, generatedSql, 'utf8');
    console.log(`Wrote ${outputPath}`);
    return;
  }

  await assertGeneratedSqlCurrent(generatedSql);
  if (mode === '--local') runSupabase('--local');
  if (mode === '--linked') runSupabase('--linked');

  const versionCount = data.skills.reduce((count, skill) => count + skill.versions.length, 0);
  const membershipCount = data.skills.reduce((count, skill) => count + skill.categoryCodes.length, 0);
  console.log(`Reference taxonomy valid: ${data.industries.length} industries, ${data.roles.length} roles, ${data.skillCategories.length} categories, ${data.skills.length} skills, ${versionCount} versions, ${membershipCount} memberships, ${data.skillRelations.length} relations.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
