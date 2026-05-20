const SKIP_TAGS = new Set(['code', 'kbd', 'pre', 'samp', 'script', 'style']);
const WORD_RE = /[\p{L}\p{N}'’]+/gu;

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function wrapText(value: string, nextIndex: () => number): HastNode[] {
  const nodes: HastNode[] = [];
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

  return nodes.length > 0 ? nodes : [{ type: 'text', value }];
}

function walk(node: HastNode, nextIndex: () => number, skip = false) {
  if (!node.children) return;

  const nextSkip = skip || (node.type === 'element' && Boolean(node.tagName && SKIP_TAGS.has(node.tagName)));
  if (nextSkip) return;

  const children: HastNode[] = [];
  for (const child of node.children) {
    if (child.type === 'text' && typeof child.value === 'string') {
      children.push(...wrapText(child.value, nextIndex));
      continue;
    }

    walk(child, nextIndex, nextSkip);
    children.push(child);
  }

  node.children = children;
}

export default function rehypeWrapWords() {
  return (tree: HastNode) => {
    let index = 0;
    walk(tree, () => index++);
  };
}
