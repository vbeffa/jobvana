import { execFileSync } from 'node:child_process';

const FIXTURE_PASSWORD = 'abcd1234';
const FIXTURE_EMAILS = [
  'admin@jobvana.test',
  'admin@planet-express.test',
  'fry@example.test',
  'leela@example.test',
  'new-company@jobvana.test',
  'new-job-seeker@jobvana.test'
];

const parseSupabaseStatus = (output) =>
  Object.fromEntries(
    output
      .split('\n')
      .map((line) => line.match(/^([A-Z0-9_]+)="(.*)"$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2]])
  );

const status = execFileSync('supabase', ['status', '-o', 'env'], {
  encoding: 'utf8'
});
const { API_URL: apiUrl, ANON_KEY: anonKey } = parseSupabaseStatus(status);

if (!apiUrl || !anonKey) {
  throw new Error('Supabase status did not provide API_URL and ANON_KEY.');
}

for (const email of FIXTURE_EMAILS) {
  const response = await fetch(
    `${apiUrl}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        apikey: anonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password: FIXTURE_PASSWORD
      })
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Fixture login failed for ${email} with HTTP ${response.status}: ${body}`
    );
  }

  const result = await response.json();

  if (!result.access_token || result.user?.email !== email) {
    throw new Error(
      `Fixture login did not return the expected authenticated user for ${email}.`
    );
  }

  console.log(`Fixture login succeeded for ${email}.`);
}
