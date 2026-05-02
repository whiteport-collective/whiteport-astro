import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import ts from 'typescript';

async function loadIntegrationModule() {
  const sourcePath = join(process.cwd(), 'src/integrations/astro-elevenlabs.ts');
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
  const outPath = join(outDir, `astro-elevenlabs-${Date.now()}.mjs`);
  writeFileSync(outPath, compiled);
  return await import(`file:///${outPath.replace(/\\/g, '/')}`);
}

function mockElevenLabsResponse(text) {
  const characters = [...text];
  const starts = characters.map((_, i) => i * 0.05);
  const ends = characters.map((_, i) => i * 0.05 + 0.04);
  return {
    audio_base64: Buffer.from(`mp3:${text}`).toString('base64'),
    alignment: {
      characters,
      character_start_times_seconds: starts,
      character_end_times_seconds: ends,
    },
  };
}

async function makeProject(files) {
  const root = await mkdtemp(join(tmpdir(), 'whiteport-audio-'));
  const blogDir = join(root, 'src/content/blog');
  await mkdir(blogDir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    await writeFile(join(blogDir, name), content);
  }
  return root;
}

test('skips gracefully when ElevenLabs credentials are missing', async () => {
  const { runElevenLabsPipeline } = await loadIntegrationModule();
  const root = await makeProject({
    'hello.md': '---\ntitle: Hello\n---\n\n# Hello\n\nWorld',
  });
  let calls = 0;

  try {
    const result = await runElevenLabsPipeline({
      projectRoot: root,
      logger: { info() {}, warn() {} },
      fetchImpl: async () => {
        calls++;
        throw new Error('fetch should not run');
      },
    });

    assert.equal(result.total, 1);
    assert.equal(result.skipped, 1);
    assert.equal(calls, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('generates MP3 and word alignment JSON, then cache-hits on the same hash', async () => {
  const { runElevenLabsPipeline } = await loadIntegrationModule();
  const root = await makeProject({
    'hello.md': '---\ntitle: Hello\n---\n\n# Hello world\n\nThis is a test.',
  });
  let calls = 0;

  const fetchImpl = async (_url, init) => {
    calls++;
    const body = JSON.parse(init.body);
    return new Response(JSON.stringify(mockElevenLabsResponse(body.text)), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  try {
    const first = await runElevenLabsPipeline({
      projectRoot: root,
      logger: { info() {}, warn() {} },
      apiKey: 'test-key',
      voiceId: 'test-voice',
      fetchImpl,
    });

    assert.equal(first.generated, 1);
    assert.equal(first.cached, 0);
    assert.equal(calls, 1);

    const generated = first.generatedArticles[0];
    assert.ok(existsSync(generated.mp3Path));
    assert.ok(existsSync(generated.jsonPath));

    const json = JSON.parse(await readFile(generated.jsonPath, 'utf-8'));
    assert.deepEqual(json.words.map((word) => word.text), ['Hello', 'world', 'This', 'is', 'a', 'test']);

    const second = await runElevenLabsPipeline({
      projectRoot: root,
      logger: { info() {}, warn() {} },
      apiKey: 'test-key',
      voiceId: 'test-voice',
      fetchImpl,
    });

    assert.equal(second.generated, 0);
    assert.equal(second.cached, 1);
    assert.equal(calls, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('keeps contractions intact via apostrophe-aware word boundaries', async () => {
  const { aggregateWords } = await loadIntegrationModule();
  const text = "It's a don't moment";
  const characters = [...text];
  const starts = characters.map((_, i) => i * 0.05);
  const ends = characters.map((_, i) => i * 0.05 + 0.04);
  const words = aggregateWords({
    characters,
    character_start_times_seconds: starts,
    character_end_times_seconds: ends,
  });
  assert.deepEqual(
    words.map((w) => w.text),
    ["It's", 'a', "don't", 'moment'],
    'contractions must stay as one word so M3-M6 sync highlighting works correctly',
  );
});

test('honors MAX_AUDIO_PER_BUILD guard for uncached articles', async () => {
  const { runElevenLabsPipeline } = await loadIntegrationModule();
  const root = await makeProject({
    'one.md': '---\ntitle: One\n---\n\nOne article.',
    'two.md': '---\ntitle: Two\n---\n\nTwo article.',
  });

  try {
    const result = await runElevenLabsPipeline({
      projectRoot: root,
      logger: { info() {}, warn() {} },
      apiKey: 'test-key',
      voiceId: 'test-voice',
      maxAudioPerBuild: 1,
      fetchImpl: async (_url, init) => {
        const body = JSON.parse(init.body);
        return new Response(JSON.stringify(mockElevenLabsResponse(body.text)), { status: 200 });
      },
    });

    assert.equal(result.total, 2);
    assert.equal(result.generated, 1);
    assert.equal(result.skipped, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

