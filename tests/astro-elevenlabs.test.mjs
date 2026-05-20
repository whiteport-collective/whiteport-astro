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
      driveCache: null,
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
      driveCache: null,
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
      driveCache: null,
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

test('preserves Swedish characters in article text extraction', async () => {
  const { markdownToPlainText } = await loadIntegrationModule();
  const text = markdownToPlainText('---\ntitle: Test\n---\n\n# Mårten\n\nSå här låter åäö.');

  assert.equal(text.includes('Mårten'), true);
  assert.equal(text.includes('Så här låter åäö.'), true);
  assert.equal(text.includes('?'), false);
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
      driveCache: null,
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

test('downloads matching article-folder Drive cache before calling ElevenLabs', async () => {
  const { runElevenLabsPipeline } = await loadIntegrationModule();
  const root = await makeProject({
    'hello.md': '---\ntitle: Hello\nmediaFolder: "Communication/2026-04-27 Test Article"\n---\n\n# Hello world\n\nThis is a test.',
  });
  let calls = 0;
  const files = new Map([
    ['hello-elevenlabs-4ab7a0b2ea16.mp3', { id: 'mp3', content: Buffer.from('drive-mp3') }],
    ['hello-elevenlabs-4ab7a0b2ea16.json', { id: 'json', content: Buffer.from('{"words":[]}') }],
  ]);

  const driveCache = {
    async findFile(folderPath, name) {
      assert.equal(folderPath, 'Communication/2026-04-27 Test Article');
      const file = files.get(name);
      return file ? { id: file.id, name } : null;
    },
    async downloadFile(id) {
      for (const file of files.values()) {
        if (file.id === id) return file.content;
      }
      throw new Error(`missing ${id}`);
    },
    async uploadFile() {
      throw new Error('upload should not run on Drive hit');
    },
  };

  try {
    const result = await runElevenLabsPipeline({
      projectRoot: root,
      logger: { info() {}, warn() {} },
      apiKey: 'test-key',
      voiceId: 'test-voice',
      driveCache,
      fetchImpl: async () => {
        calls++;
        throw new Error('fetch should not run');
      },
    });

    assert.equal(result.cached, 1);
    assert.equal(result.generated, 0);
    assert.equal(calls, 0);
    assert.ok(existsSync(join(root, 'public/audio/hello-elevenlabs-4ab7a0b2ea16.mp3')));
    assert.ok(existsSync(join(root, 'public/audio/hello-elevenlabs-4ab7a0b2ea16.json')));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('uploads generated audio and alignment to article mediaFolder on Drive miss', async () => {
  const { runElevenLabsPipeline } = await loadIntegrationModule();
  const root = await makeProject({
    'hello.md': '---\ntitle: Hello\nmediaFolder: Communication/2026-04-27 Test Article\n---\n\nHello.',
  });
  const uploads = [];

  const driveCache = {
    async findFile() {
      return null;
    },
    async downloadFile() {
      throw new Error('download should not run on miss');
    },
    async uploadFile(folderPath, name, mimeType, content) {
      uploads.push({ folderPath, name, mimeType, content: Buffer.from(content) });
    },
  };

  try {
    const result = await runElevenLabsPipeline({
      projectRoot: root,
      logger: { info() {}, warn() {} },
      apiKey: 'test-key',
      voiceId: 'test-voice',
      driveCache,
      fetchImpl: async (_url, init) => {
        const body = JSON.parse(init.body);
        return new Response(JSON.stringify(mockElevenLabsResponse(body.text)), { status: 200 });
      },
    });

    assert.equal(result.generated, 1);
    assert.equal(uploads.length, 2);
    assert.deepEqual(
      uploads.map(upload => [upload.folderPath, upload.name, upload.mimeType]),
      [
        ['Communication/2026-04-27 Test Article', 'hello-elevenlabs-2d8bd7d9bb5f.mp3', 'audio/mpeg'],
        ['Communication/2026-04-27 Test Article', 'hello-elevenlabs-2d8bd7d9bb5f.json', 'application/json'],
      ],
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

