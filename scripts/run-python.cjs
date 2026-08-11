const { spawnSync } = require('node:child_process');

const scriptArgs = process.argv.slice(2);

if (scriptArgs.length === 0) {
  console.error('Usage: node scripts/run-python.cjs <script> [...args]');
  process.exit(1);
}

for (const command of ['python3', 'python']) {
  const result = spawnSync(command, scriptArgs, { stdio: 'inherit' });

  if (!result.error) {
    process.exit(result.status ?? 1);
  }

  if (result.error.code !== 'ENOENT') {
    console.error(result.error.message);
    process.exit(1);
  }
}

console.error('Python was not found. Install Python 3 and ensure it is available on PATH.');
process.exit(1);
