import WaveSurfer from 'wavesurfer.js';
import { findActiveWordIndex, normalizeAlignmentWords, type AlignmentWord } from './audio-sync';

type PlayerElements = {
  root: HTMLElement;
  audio: HTMLAudioElement;
  waveform: HTMLElement;
  play: HTMLButtonElement;
  playIcon: HTMLElement | null;
  mute: HTMLButtonElement;
  volume: HTMLInputElement;
  menuButton: HTMLButtonElement;
  menu: HTMLElement;
  speed: HTMLButtonElement;
  speedLabel: HTMLElement | null;
};

const PLAYBACK_SPEEDS = [1, 1.25, 1.5, 2] as const;
const formatSpeed = (rate: number): string => `${Number.isInteger(rate) ? rate : rate.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}×`;

function getElements(root: HTMLElement): PlayerElements | null {
  const audio = root.querySelector<HTMLAudioElement>('[data-audio-element]');
  const waveform = root.querySelector<HTMLElement>('[data-audio-waveform]');
  const play = root.querySelector<HTMLButtonElement>('[data-audio-play]');
  const mute = root.querySelector<HTMLButtonElement>('[data-audio-mute]');
  const volume = root.querySelector<HTMLInputElement>('[data-audio-volume]');
  const menuButton = root.querySelector<HTMLButtonElement>('[data-audio-menu-button]');
  const menu = root.querySelector<HTMLElement>('[data-audio-menu]');
  const speed = root.querySelector<HTMLButtonElement>('[data-audio-speed]');
  if (!audio || !waveform || !play || !mute || !volume || !menuButton || !menu || !speed) return null;
  return {
    root, audio, waveform, play,
    playIcon: play.querySelector('[data-audio-play-icon]'),
    mute, volume, menuButton, menu,
    speed,
    speedLabel: speed.querySelector('[data-audio-speed-label]'),
  };
}

function setMenuOpen(elements: PlayerElements, open: boolean) {
  elements.menu.hidden = !open;
  elements.menuButton.setAttribute('aria-expanded', String(open));
}

function getWordNodes(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.word[data-word-index]'));
}

function clearActiveWord(activeWord: HTMLElement | null): null {
  activeWord?.classList.remove('word--active');
  activeWord?.removeAttribute('aria-current');
  return null;
}

async function loadAlignment(audio: HTMLAudioElement): Promise<AlignmentWord[]> {
  const alignmentUrl = audio.dataset.alignmentUrl;
  if (!alignmentUrl) return [];

  try {
    const response = await fetch(alignmentUrl);
    if (!response.ok) return [];
    return normalizeAlignmentWords(await response.json());
  } catch {
    return [];
  }
}

function initPlayer(root: HTMLElement) {
  const elements = getElements(root);
  if (!elements) return;
  const wordNodes = getWordNodes();
  let alignmentWords: AlignmentWord[] = [];
  let activeWord: HTMLElement | null = null;

  void loadAlignment(elements.audio).then((words) => {
    alignmentWords = words;
  });

  const wavesurfer = WaveSurfer.create({
    container: elements.waveform,
    media: elements.audio,
    height: 48,
    barWidth: 2,
    barGap: 2,
    barRadius: 2,
    cursorWidth: 2,
    waveColor: '#c8d5e2',
    progressColor: '#043F76',
    cursorColor: '#D74560',
  });

  const updatePlayState = () => {
    const isPlaying = wavesurfer.isPlaying();
    elements.play.setAttribute('aria-pressed', String(isPlaying));
    if (elements.playIcon) elements.playIcon.textContent = isPlaying ? 'Pause' : 'Play';
  };

  elements.play.addEventListener('click', () => {
    void wavesurfer.playPause();
  });
  wavesurfer.on('play', updatePlayState);
  wavesurfer.on('pause', updatePlayState);
  wavesurfer.on('finish', updatePlayState);

  elements.mute.addEventListener('click', () => {
    const muted = !elements.audio.muted;
    elements.audio.muted = muted;
    elements.mute.setAttribute('aria-pressed', String(muted));
  });

  elements.volume.addEventListener('input', () => {
    const volume = Number(elements.volume.value);
    wavesurfer.setVolume(Number.isFinite(volume) ? volume : 1);
  });

  wavesurfer.on('timeupdate', (currentTime) => {
    const duration = wavesurfer.getDuration();
    const value = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
    elements.waveform.setAttribute('aria-valuenow', String(value));

    const wordIndex = findActiveWordIndex(alignmentWords, currentTime);
    const nextWord = wordIndex === null ? null : wordNodes[wordIndex] ?? null;
    if (nextWord === activeWord) return;

    activeWord = clearActiveWord(activeWord);
    if (nextWord) {
      nextWord.classList.add('word--active');
      nextWord.setAttribute('aria-current', 'true');
      activeWord = nextWord;

      // Auto-scroll to keep active word centered (M5 smooth auto-scroll).
      // Only scroll when word drifts outside the middle band — avoids ticky-tick
      // scroll on every word change. Respects prefers-reduced-motion.
      const rect = nextWord.getBoundingClientRect();
      const vh = window.innerHeight;
      const wordCenterY = rect.top + rect.height / 2;
      const viewportCenterY = vh / 2;
      const offset = wordCenterY - viewportCenterY;
      const tolerance = vh * 0.2; // ±20% of viewport before triggering scroll
      if (Math.abs(offset) > tolerance) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollBy({ top: offset, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    }
  });

  wavesurfer.on('pause', () => {
    activeWord = clearActiveWord(activeWord);
  });
  wavesurfer.on('finish', () => {
    activeWord = clearActiveWord(activeWord);
  });

  elements.waveform.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const duration = wavesurfer.getDuration();
    if (!duration) return;
    const current = wavesurfer.getCurrentTime();
    const next = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? duration
        : current + (event.key === 'ArrowRight' ? 5 : -5);
    wavesurfer.seekTo(Math.max(0, Math.min(duration, next)) / duration);
  });

  let speedIndex = 0;
  elements.speed.addEventListener('click', () => {
    speedIndex = (speedIndex + 1) % PLAYBACK_SPEEDS.length;
    const rate = PLAYBACK_SPEEDS[speedIndex];
    elements.audio.playbackRate = rate;
    if (elements.speedLabel) elements.speedLabel.textContent = formatSpeed(rate);
    elements.speed.setAttribute('aria-label', `Playback speed: ${formatSpeed(rate)}. Click to change.`);
  });

  elements.menuButton.addEventListener('click', () => {
    setMenuOpen(elements, elements.menu.hidden);
  });

  document.addEventListener('click', (event) => {
    if (!elements.root.contains(event.target as Node)) setMenuOpen(elements, false);
  });
}

document.querySelectorAll<HTMLElement>('[data-audio-player]').forEach(initPlayer);
