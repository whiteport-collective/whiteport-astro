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

function collectWords(node, result = []) {
  if (node.type === 'element' && node.tagName === 'span' && node.properties?.className?.includes('word')) {
    result.push({ index: node.properties.dataWordIndex, text: node.children?.[0]?.value });
  }
  for (const child of node.children || []) collectWords(child, result);
  return result;
}

test('wraps text words with sequential indexes while preserving punctuation', async () => {
  const { default: rehypeWrapWords } = await loadWordWrapModule();
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'p',
        children: [{ type: 'text', value: "Mårten's test, åäö." }],
      },
    ],
  };

  rehypeWrapWords()(tree);
  assert.deepEqual(collectWords(tree), [
    { index: '0', text: "Mårten's" },
    { index: '1', text: 'test' },
    { index: '2', text: 'åäö' },
  ]);
  assert.equal(
    tree.children[0].children.map((child) => child.type === 'text' ? child.value : child.children[0].value).join(''),
    "Mårten's test, åäö.",
  );
});

test('does not wrap code or pre contents', async () => {
  const { default: rehypeWrapWords } = await loadWordWrapModule();
  const tree = {
    type: 'root',
    children: [
      { type: 'element', tagName: 'p', children: [{ type: 'text', value: 'Visible word' }] },
      { type: 'element', tagName: 'code', children: [{ type: 'text', value: 'hidden code' }] },
      { type: 'element', tagName: 'pre', children: [{ type: 'text', value: 'hidden pre' }] },
    ],
  };

  rehypeWrapWords()(tree);
  assert.deepEqual(collectWords(tree).map((word) => word.text), ['Visible', 'word']);
  assert.equal(tree.children[1].children[0].value, 'hidden code');
  assert.equal(tree.children[2].children[0].value, 'hidden pre');
});
