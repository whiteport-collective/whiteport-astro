export type AlignmentWord = {
  text: string;
  start: number;
  end: number;
};

export type AlignmentData = {
  words?: AlignmentWord[];
};

export function findActiveWordIndex(words: AlignmentWord[], currentTime: number): number | null {
  if (!Number.isFinite(currentTime) || words.length === 0) return null;

  let low = 0;
  let high = words.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const word = words[mid];
    if (!word) return null;

    if (currentTime < word.start) {
      high = mid - 1;
    } else if (currentTime >= word.end) {
      low = mid + 1;
    } else {
      return mid;
    }
  }

  return null;
}

export function normalizeAlignmentWords(data: AlignmentData): AlignmentWord[] {
  if (!Array.isArray(data.words)) return [];

  return data.words.filter((word) => (
    typeof word.text === 'string' &&
    Number.isFinite(word.start) &&
    Number.isFinite(word.end) &&
    word.end > word.start
  ));
}
