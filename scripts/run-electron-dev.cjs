const { spawn } = require('node:child_process');
const path = require('node:path');

const electronBin = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const hasDisplay = Boolean(env.DISPLAY || env.WAYLAND_DISPLAY);
const command = hasDisplay ? electronBin : 'xvfb-run';
const args = hasDisplay ? ['.'] : ['-a', electronBin, '.'];

const child = spawn(command, args, {
  cwd: path.join(__dirname, '..'),
  env,
  stdio: 'inherit',
});

const forwardSignal = (signal) => {
  if (!child.killed) child.kill(signal);
};

process.on('SIGINT', () => forwardSignal('SIGINT'));
process.on('SIGTERM', () => forwardSignal('SIGTERM'));

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
