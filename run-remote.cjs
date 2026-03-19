#!/usr/bin/env node
/**
 * Execute a command on the Hostup server via SSH.
 * Usage: node run-remote.cjs "command to run"
 */

const { Client } = require('ssh2');

const CONFIG = {
  host: 'mu.hostup.se',
  port: 22,
  username: 'aiwhitep',
  password: 'oGzvx%6&tOz%NEfeREHL',
};

const command = process.argv[2] || 'echo "No command specified"';

const conn = new Client();
conn.on('ready', () => {
  console.log(`[ssh] Connected. Running: ${command}\n`);
  conn.exec(command, (err, stream) => {
    if (err) { console.error(err); conn.end(); return; }
    stream.on('close', (code) => {
      console.log(`\n[ssh] Exit code: ${code}`);
      conn.end();
      process.exit(code || 0);
    });
    stream.on('data', (data) => process.stdout.write(data.toString()));
    stream.stderr.on('data', (data) => process.stderr.write(data.toString()));
  });
}).on('error', (err) => {
  console.error('[ssh] Connection error:', err.message);
  process.exit(1);
}).connect(CONFIG);
