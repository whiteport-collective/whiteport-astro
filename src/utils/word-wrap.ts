import type { Element, Root, Text } from 'hast';

const SKIP_TAGS = new Set(['code', 'kbd', 'pre', 'samp', 'script', 'style']);
const WORD_RE = /[\p{L}\p{N}'\u2019]+/gu;

type Parent = Root | Element;
type HastChild = Parent['children'][number];

function isText(node: HastChild): node is Text {
  return node.type === 'text';
}

function isElement(node: HastChild): node is Element {
  return node.type === 'element';
}

function wrapText(value: string, nextIndex: () => number): HastChild[] {
  const nodes: HastChild[] = [];
  let cursor = 0;

  for (const match of value.matchAll(WORD_RE)) {
    const word = match[0];
    const index = match.index ?? 0;

    if (index > cursor) {
      nodes.push({ type: 'text', value: value.slice(cursor, index) });
    }

    nodes.push({
      type: 'element',
      tagName: 'span',
      properties: {
        className: ['word'],
        dataWordIndex: String(nextIndex()),
      },
      children: [{ type: 'text', value: word }],
    });

    cursor = index + word.length;
  }

  if (cursor < value.length) {
    nodes.push({ type: 'text', value: value.slice(cursor) });
  }

  return nodes;
}

function visit(parent: Parent, nextIndex: () => number) {
  const children: HastChild[] = [];

  for (const child of parent.children ?? []) {
    if (isText(child)) {
      children.push(...wrapText(child.value, nextIndex));
      continue;
    }

    if (isElement(child) && !SKIP_TAGS.has(child.tagName)) {
      visit(child, nextIndex);
    }

    children.push(child);
  }

  parent.children = children as Parent['children'];
}

export default function rehypeWrapWords() {
  return (tree: Root) => {
    let index = 0;
    visit(tree, () => index++);
  };
}
