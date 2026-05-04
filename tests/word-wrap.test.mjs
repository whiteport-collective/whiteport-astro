import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import ts from 'typescript';

async function loadWordWrapModule() {
  const sourcePath = join(process.cwd(), 'src/utils/word-wrap.ts');
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
  const outPath = join(outDir, `word-wrap-${Date.now()}.mjs`);
  writeFileSync(outPath, compiled);
  return await import(`file:///${outPath.replace(/\\/g, '/')}`);
}

test('wraps text words with sequential indexes while preserving punctuation', async () => {
  const { default: rehypeWrapWords } = await loadWordWrapModule();
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'p',
        properties: {},
        children: [{ type: 'text', value: "Marten's test, aao." }],
      },
    ],
  };

  rehypeWrapWords()(tree);

  const paragraph = tree.children[0];
  const words = paragraph.children.filter((node) => node.type === 'element');
  assert.deepEqual(words.map((node) => node.children[0].value), ["Marten's", 'test', 'aao']);
  assert.deepEqual(words.map((node) => node.properties.dataWordIndex), ['0', '1', '2']);
  assert.equal(paragraph.children.map((node) => node.type === 'text' ? node.value : node.children[0].value).join(''), "Marten's test, aao.");
});

test('does not wrap code or pre contents', async () => {
  const { default: rehypeWrapWords } = await loadWordWrapModule();
  const tree = {
    type: 'root',
    children: [
      { type: 'element', tagName: 'code', properties: {}, children: [{ type: 'text', value: 'const value = 1' }] },
      { type: 'element', tagName: 'pre', properties: {}, children: [{ type: 'text', value: 'pre text' }] },
    ],
  };

  rehypeWrapWords()(tree);

  assert.equal(tree.children[0].children[0].type, 'text');
  assert.equal(tree.children[1].children[0].type, 'text');
});
