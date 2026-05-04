import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import ts from 'typescript';

async function loadAudioSyncModule() {
  const sourcePath = join(process.cwd(), 'src/scripts/audio-sync.ts');
  const source = readFileSync(sourcePath, 'utf-8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      esModuleInterop: true,
      verbatimModuleSyntax: false,
    },
  }).outputText;

  const outDir = join(process.cwd(), '.cache/tests');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `audio-sync-${Date.now()}.mjs`);
  writeFileSync(outPath, compiled);
  return await import(`file:///${outPath.replace(/\\/g, '/')}`);
}

test('finds the active word for the current playback time', async () => {
  const { findActiveWordIndex } = await loadAudioSyncModule();
  const words = [
    { text: 'first', start: 0, end: 0.4 },
    { text: 'second', start: 0.5, end: 1.1 },
    { text: 'third', start: 1.2, end: 1.8 },
  ];

  assert.equal(findActiveWordIndex(words, 0.1), 0);
  assert.equal(findActiveWordIndex(words, 0.7), 1);
  assert.equal(findActiveWordIndex(words, 1.79), 2);
  assert.equal(findActiveWordIndex(words, 0.45), null);
  assert.equal(findActiveWordIndex(words, 1.8), null);
});

test('normalizes alignment words and drops invalid entries', async () => {
  const { normalizeAlignmentWords } = await loadAudioSyncModule();
  assert.deepEqual(normalizeAlignmentWords({
    words: [
      { text: 'ok', start: 0, end: 0.2 },
      { text: 'bad', start: 0.4, end: 0.3 },
      { text: 1, start: 0.5, end: 0.6 },
    ],
  }), [{ text: 'ok', start: 0, end: 0.2 }]);
  assert.deepEqual(normalizeAlignmentWords({}), []);
});
