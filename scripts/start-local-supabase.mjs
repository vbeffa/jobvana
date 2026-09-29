import { spawnSync } from 'node:child_process';

const NETWORK_NAME = 'jobvana-local';
const HOST_BINDING_OPTION = 'com.docker.network.bridge.host_binding_ipv4';
const HOST_BINDING_ADDRESS = '127.0.0.1';

const inspect = spawnSync('docker', ['network', 'inspect', NETWORK_NAME], {
  encoding: 'utf8'
});

if (inspect.error) {
  console.error(inspect.error.message);
  process.exit(1);
}

if (inspect.status !== 0) {
  const create = spawnSync(
    'docker',
    [
      'network',
      'create',
      '-o',
      `${HOST_BINDING_OPTION}=${HOST_BINDING_ADDRESS}`,
      NETWORK_NAME
    ],
    { stdio: 'inherit' }
  );

  if (create.error) {
    console.error(create.error.message);
    process.exit(1);
  }

  if (create.status !== 0) {
    process.exit(create.status ?? 1);
  }
} else {
  let networks;

  try {
    networks = JSON.parse(inspect.stdout);
  } catch {
    console.error(`Could not inspect Docker network ${NETWORK_NAME}.`);
    process.exit(1);
  }

  const hostBinding = networks[0]?.Options?.[HOST_BINDING_OPTION];

  if (hostBinding !== HOST_BINDING_ADDRESS) {
    console.error(
      `Docker network ${NETWORK_NAME} already exists but is not bound to ${HOST_BINDING_ADDRESS}.`
    );
    console.error(
      `Remove it with "docker network rm ${NETWORK_NAME}" and rerun this command.`
    );
    process.exit(1);
  }
}

const start = spawnSync(
  'supabase',
  ['start', '--network-id', NETWORK_NAME],
  { stdio: 'inherit' }
);

if (start.error) {
  console.error(start.error.message);
  process.exit(1);
}

process.exit(start.status ?? 0);
