/**
 * Backfill all article audio through the Astro build integration.
 *
 * The ElevenLabs integration is idempotent: existing hash-matched MP3 + JSON
 * pairs in public/audio/ are cached and skipped. This script simply raises the
 * per-build generation guard high enough for the initial backlog.
 */

import { spawnSync } from 'child_process';
import { join } from 'path';

process.env.MAX_AUDIO_PER_BUILD ||= '1000';

const astroCli = join(process.cwd(), 'node_modules', 'astro', 'astro.js');
const result = spawnSync(process.execPath, [astroCli, 'build'], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
