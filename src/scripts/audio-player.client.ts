import WaveSurfer from 'wavesurfer.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setMenuOpen(root: HTMLElement, open: boolean) {
  const button = root.querySelector<HTMLButtonElement>('[data-audio-menu-button]');
  const menu = root.querySelector<HTMLElement>('[data-audio-menu]');
  if (!button || !menu) return;

  button.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
}

function initPlayer(root: HTMLElement) {
  if (root.dataset.audioReady === 'true') return;
  root.dataset.audioReady = 'true';

  const audio = root.querySelector<HTMLAudioElement>('[data-audio-element]');
  const playButton = root.querySelector<HTMLButtonElement>('[data-audio-play]');
  const playIcon = root.querySelector<HTMLElement>('[data-audio-play-icon]');
  const muteButton = root.querySelector<HTMLButtonElement>('[data-audio-mute]');
  const volume = root.querySelector<HTMLInputElement>('[data-audio-volume]');
  const waveform = root.querySelector<HTMLElement>('[data-audio-waveform]');
  const menuButton = root.querySelector<HTMLButtonElement>('[data-audio-menu-button]');

  if (!audio || !playButton || !playIcon || !muteButton || !volume || !waveform) return;

  const wavesurfer = WaveSurfer.create({
    container: waveform,
    waveColor: '#C8D3DC',
    progressColor: '#043F76',
    cursorColor: '#D74560',
    height: reducedMotion ? 24 : 36,
    cursorWidth: 2,
    barWidth: 2,
    barGap: 2,
    barRadius: 2,
    media: audio,
  });

  const updatePlayState = () => {
    const playing = !audio.paused;
    playButton.setAttribute('aria-pressed', String(playing));
    playButton.setAttribute('aria-label', playing ? 'Pause audio' : 'Play audio');
    playIcon.textContent = playing ? '⏸' : '▶';
  };

  const updateMuteState = () => {
    muteButton.setAttribute('aria-pressed', String(audio.muted));
    muteButton.setAttribute('aria-label', audio.muted ? 'Unmute audio' : 'Mute audio');
    muteButton.querySelector('span')!.textContent = audio.muted || audio.volume === 0 ? '🔇' : '🔊';
  };

  const updateTimelineValue = () => {
    const duration = audio.duration || 0;
    const progress = duration > 0 ? Math.round((audio.currentTime / duration) * 100) : 0;
    waveform.setAttribute('aria-valuenow', String(progress));
  };

  playButton.addEventListener('click', async () => {
    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  });

  muteButton.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateMuteState();
  });

  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value);
    audio.muted = audio.volume === 0;
    updateMuteState();
  });

  waveform.addEventListener('keydown', (event) => {
    const duration = audio.duration || 0;
    if (!duration) return;

    const step = event.shiftKey ? 15 : 5;
    if (event.key === 'ArrowRight') {
      audio.currentTime = Math.min(duration, audio.currentTime + step);
      event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
      audio.currentTime = Math.max(0, audio.currentTime - step);
      event.preventDefault();
    } else if (event.key === ' ' || event.key === 'Enter') {
      playButton.click();
      event.preventDefault();
    }
  });

  menuButton?.addEventListener('click', () => {
    const menu = root.querySelector<HTMLElement>('[data-audio-menu]');
    setMenuOpen(root, Boolean(menu?.hidden));
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(root, false);
  });

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target as Node)) setMenuOpen(root, false);
  });

  audio.addEventListener('play', updatePlayState);
  audio.addEventListener('pause', updatePlayState);
  audio.addEventListener('ended', updatePlayState);
  audio.addEventListener('volumechange', updateMuteState);
  audio.addEventListener('timeupdate', updateTimelineValue);
  wavesurfer.on('interaction', updateTimelineValue);

  updatePlayState();
  updateMuteState();
}

document.querySelectorAll<HTMLElement>('[data-audio-player]').forEach(initPlayer);
