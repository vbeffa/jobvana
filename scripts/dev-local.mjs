import { execFileSync, spawnSync } from 'node:child_process';

const parseSupabaseStatus = (output) =>
  Object.fromEntries(
    output
      .split('\n')
      .map((line) => line.match(/^([A-Z0-9_]+)="(.*)"$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2]])
  );

let status;
try {
  status = execFileSync('supabase', ['status', '-o', 'env'], {
    encoding: 'utf8'
  });
} catch {
  console.error('Local Supabase is not running. Start it with: supabase start');
  process.exit(1);
}

const { API_URL: apiUrl, ANON_KEY: anonKey } = parseSupabaseStatus(status);

if (!apiUrl || !anonKey) {
  console.error('Supabase status did not provide API_URL and ANON_KEY.');
  process.exit(1);
}

const projectId = new URL(apiUrl).hostname.split('.')[0];

const result = spawnSync('vite', [], {
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_SUPABASE_URL: apiUrl,
    VITE_SUPABASE_ANON_KEY: anonKey,
    VITE_SUPABASE_PROJECT_ID: projectId
  }
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
