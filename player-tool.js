// DRM Video Player Tool - Based on Sportika.live extraction
// Built with Shaka Player

let player = null;
let ui = null;
let currentManifest = null;
const customControls = {
  isSeeking: false
};

const controlIcons = {
  play: `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5">
    <path d="M3.34375 4.83788C3.344 3.30853 4.99642 2.34989 6.32422 3.10741L6.32324 3.10838L19.0098 10.3389L19.3408 10.5283V10.5722C20.4206 11.4885 20.3091 13.2653 19.0107 14.0068H19.0098L6.32324 21.2383C4.99538 21.9956 3.34375 21.0372 3.34375 19.5078V4.83788Z" fill="currentColor"></path>
  </svg>`,
  pause: `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5">
    <path d="M7 5.5C7 4.94772 7.44772 4.5 8 4.5H10C10.5523 4.5 11 4.94772 11 5.5V19.5C11 20.0523 10.5523 20.5 10 20.5H8C7.44772 20.5 7 20.0523 7 19.5V5.5Z" fill="currentColor"></path>
    <path d="M13 5.5C13 4.94772 13.4477 4.5 14 4.5H16C16.5523 4.5 17 4.94772 17 5.5V19.5C17 20.0523 16.5523 20.5 16 20.5H14C13.4477 20.5 13 20.0523 13 19.5V5.5Z" fill="currentColor"></path>
  </svg>`,
  volume: `<svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4">
    <path d="M14.9794 12.4609V22.3334C14.9794 23.3584 13.8119 23.9484 12.9869 23.3384L2.62937 15.6884C0.456875 14.0834 0.456875 10.8359 2.62937 9.23094L12.9869 1.58094C13.8119 0.970943 14.9794 1.56093 14.9794 2.58593V12.4584V12.4609Z" stroke="currentColor" stroke-width="1.75" stroke-miterlimit="10" stroke-linecap="round"></path>
    <path d="M20.9893 21.3688C25.9093 16.4488 25.9093 8.46883 20.9893 3.54883" stroke="currentColor" stroke-width="1.75" stroke-miterlimit="10" stroke-linecap="round"></path>
    <path d="M19.1416 16.9158C21.6016 14.4558 21.6016 10.4659 19.1416 8.00586" stroke="currentColor" stroke-width="1.75" stroke-miterlimit="10" stroke-linecap="round"></path>
  </svg>`,
  muted: `<svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4">
    <path d="M14.9794 12.4609V22.3334C14.9794 23.3584 13.8119 23.9484 12.9869 23.3384L2.62937 15.6884C0.456875 14.0834 0.456875 10.8359 2.62937 9.23094L12.9869 1.58094C13.8119 0.970943 14.9794 1.56093 14.9794 2.58593V12.4584V12.4609Z" stroke="currentColor" stroke-width="1.75" stroke-miterlimit="10" stroke-linecap="round"></path>
    <path d="M22 4L4 22" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path>
  </svg>`
};

// Initialize Shaka Player
async function initPlayer() {
  try {
    // Install polyfills
    if (window.shaka) {
      window.shaka.polyfill.installAll();
    }

    if (!window.shaka || !window.shaka.Player) {
      throw new Error('Shaka Player not loaded');
    }

    if (!window.shaka.Player.isBrowserSupported()) {
      showStatus('Browser not fully supported', 'error');
      return false;
    }

    const video = document.getElementById('video');
    const container = document.getElementById('video-container');

    // Create player
    player = new window.shaka.Player(video);

    // Create UI overlay with sportika.live configuration
    ui = new window.shaka.ui.Overlay(player, container, video);

    // Configure UI controls (exact sportika.live layout)
    ui.configure({
      controlPanelElements: [
        'play_pause',
        'time_and_duration',
        'spacer',
        'mute',
        'volume',
        'overflow_menu',
        'fullscreen'
      ],
      overflowMenuButtons: ['quality', 'language']
    });

    // Set up event listeners
    setupEventListeners();

    // Set up cursor auto-hide
    setupCursorAutoHide();

    // Set up custom control UI
    setupCustomControls();

    showStatus('Player initialized successfully', 'success');
    return true;

  } catch (error) {
    console.error('Player initialization error:', error);
    showStatus(`Initialization error: ${error.message}`, 'error');
    return false;
  }
}

function setupCustomControls() {
  const video = document.getElementById('video');
  const container = document.getElementById('video-container');
  const controls = document.getElementById('custom-controls');

  if (!video || !container || !controls) return;

  const playBtn = document.getElementById('custom-play');
  const rewindBtn = document.getElementById('custom-rewind');
  const forwardBtn = document.getElementById('custom-forward');
  const muteBtn = document.getElementById('custom-mute');
  const fullscreenBtn = document.getElementById('custom-fullscreen');
  const seekInput = document.getElementById('custom-seek-input');
  const currentTimeEl = document.getElementById('custom-current-time');
  const progressEl = document.getElementById('custom-progress');
  const bufferedEl = document.getElementById('custom-buffered');
  const seekThumb = document.getElementById('custom-seek-thumb');
  const liveBadge = document.getElementById('custom-live-badge');
  const audioBtn = document.getElementById('custom-audio-btn');
  const qualityBtn = document.getElementById('custom-quality-btn');
  const audioMenu = document.getElementById('custom-audio-menu');
  const qualityMenu = document.getElementById('custom-quality-menu');
  const qualityLabelEl = document.getElementById('custom-quality-label');
  const volumeInput = document.getElementById('custom-volume-input');
  const volumeFill = document.getElementById('custom-volume-fill');
  const pauseOverlay = document.getElementById('custom-pause-overlay');
  let controlsTimer;

  playBtn.innerHTML = controlIcons.play;
  muteBtn.innerHTML = controlIcons.volume;
  customControls.autoQualityLabel = qualityLabelEl ? qualityLabelEl.textContent : 'Auto';

  const updatePlayState = () => {
    playBtn.innerHTML = video.paused ? controlIcons.play : controlIcons.pause;
    playBtn.setAttribute('aria-label', video.paused ? 'Play' : 'Pause');
    if (pauseOverlay) {
      pauseOverlay.classList.toggle('is-visible', video.paused);
    }
  };

  const updateMuteState = () => {
    muteBtn.innerHTML = video.muted ? controlIcons.muted : controlIcons.volume;
    muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
  };

  const formatTime = (time) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isLiveStream = () => {
    if (player && typeof player.isLive === 'function') {
      return player.isLive();
    }
    return !isFinite(video.duration) || video.duration === 0;
  };

  const getSeekRange = () => {
    if (player && typeof player.seekRange === 'function') {
      try {
        return player.seekRange();
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const updateSeekUI = () => {
    const duration = video.duration;
    const current = video.currentTime;
    const live = isLiveStream();
    const seekRange = live ? getSeekRange() : null;
    const rangeStart = seekRange ? seekRange.start : 0;
    const rangeEnd = seekRange ? seekRange.end : duration;
    const rangeWindow = Math.max(rangeEnd - rangeStart, 0);
    const safeWindow = isFinite(rangeWindow) ? rangeWindow : 0;

    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(current);
    }

    if (live) {
      if (liveBadge) liveBadge.hidden = false;
      if (seekInput) {
        seekInput.disabled = false;
        seekInput.min = '0';
        seekInput.max = safeWindow.toString();
      }
    } else {
      if (liveBadge) liveBadge.hidden = true;
      if (seekInput) {
        seekInput.disabled = false;
        seekInput.min = '0';
        seekInput.max = '100';
      }
    }

    if (!customControls.isSeeking) {
      if (live && safeWindow > 0) {
        const offset = Math.min(Math.max(current - rangeStart, 0), rangeWindow);
        const percent = (offset / safeWindow) * 100;
        if (seekInput) seekInput.value = offset;
        if (progressEl) progressEl.style.width = `${percent}%`;
        if (seekThumb) seekThumb.style.left = `${percent}%`;
        const liveEdgeGap = rangeEnd - current;
        if (liveBadge) {
          const isBehind = liveEdgeGap > 5;
          liveBadge.textContent = isBehind ? 'Back Live' : 'Live';
          liveBadge.classList.toggle('back-live', isBehind);
        }
      } else if (duration > 0 && isFinite(duration)) {
        const percent = (current / duration) * 100;
        if (seekInput) seekInput.value = percent;
        if (progressEl) progressEl.style.width = `${percent}%`;
        if (seekThumb) seekThumb.style.left = `${percent}%`;
      }
    }

    if (bufferedEl && video.buffered.length) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      if (live && safeWindow > 0) {
        const bufferedPercent = Math.min(((bufferedEnd - rangeStart) / safeWindow) * 100, 100);
        bufferedEl.style.width = `${Math.max(bufferedPercent, 0)}%`;
      } else if (!live && duration > 0 && isFinite(duration)) {
        const bufferedPercent = Math.min((bufferedEnd / duration) * 100, 100);
        bufferedEl.style.width = `${bufferedPercent}%`;
      } else {
        bufferedEl.style.width = '0%';
      }
    } else if (bufferedEl) {
      bufferedEl.style.width = '0%';
    }
  };

  const updateVolumeUI = () => {
    if (!volumeInput || !volumeFill) return;
    const volume = video.muted ? 0 : video.volume;
    volumeInput.value = volume;
    volumeFill.style.width = `${volume * 100}%`;
  };

  const showControls = () => {
    controls.classList.remove('is-hidden');
    clearTimeout(controlsTimer);
    controlsTimer = setTimeout(() => {
      controls.classList.add('is-hidden');
    }, 2500);
  };

  const hideControls = () => {
    clearTimeout(controlsTimer);
    controls.classList.add('is-hidden');
  };

  const refreshMenus = () => {
    if (!player) return;

    const variantTracks = player.getVariantTracks();
    const activeTrack = variantTracks.find((track) => track.active);
    const audioLabel = document.getElementById('custom-audio-label');
    const qualityLabel = document.getElementById('custom-quality-label');
    const autoQualityLabel = customControls.autoQualityLabel || 'Auto';

    if (audioLabel && activeTrack) {
      audioLabel.textContent = activeTrack.label || activeTrack.language || 'Audio';
    }

    if (qualityLabel && activeTrack) {
      const abrEnabled = player.getConfiguration().abr.enabled;
      qualityLabel.textContent = abrEnabled
        ? autoQualityLabel
        : activeTrack.height
        ? `${activeTrack.height}p`
        : 'Manual';
    }

    if (audioMenu) {
      audioMenu.innerHTML = '';
      const audioTracks = variantTracks.filter((track) => track.type === 'variant');
      const audioMap = new Map();
      audioTracks.forEach((track) => {
        const key = `${track.language || ''}-${track.label || ''}`;
        if (!audioMap.has(key)) {
          audioMap.set(key, track);
        }
      });

      if (audioMap.size === 0) {
        const empty = document.createElement('button');
        empty.textContent = 'No audio tracks';
        empty.disabled = true;
        audioMenu.appendChild(empty);
      } else {
        audioMap.forEach((track) => {
          const btn = document.createElement('button');
          btn.textContent = track.label || track.language || 'Audio';
          btn.setAttribute('aria-checked', track.active ? 'true' : 'false');
          btn.addEventListener('click', () => {
            if (!player) return;
            if (track.language) {
              player.selectAudioLanguage(track.language);
            }
            player.selectVariantTrack(track, true);
            audioMenu.hidden = true;
            refreshMenus();
          });
          audioMenu.appendChild(btn);
        });
      }
    }

    if (qualityMenu) {
      qualityMenu.innerHTML = '';
      const abrEnabled = player.getConfiguration().abr.enabled;

      const autoBtn = document.createElement('button');
      autoBtn.textContent = autoQualityLabel;
      autoBtn.setAttribute('aria-checked', abrEnabled ? 'true' : 'false');
      autoBtn.addEventListener('click', () => {
        if (!player) return;
        player.configure({ abr: { enabled: true } });
        qualityMenu.hidden = true;
        refreshMenus();
      });
      qualityMenu.appendChild(autoBtn);

      const qualityMap = new Map();
      variantTracks.forEach((track) => {
        if (track.height) {
          qualityMap.set(track.height, track);
        }
      });

      Array.from(qualityMap.keys())
        .sort((a, b) => b - a)
        .forEach((height) => {
          const track = qualityMap.get(height);
          const btn = document.createElement('button');
          btn.textContent = `${height}p`;
          btn.setAttribute('aria-checked', !abrEnabled && track.active ? 'true' : 'false');
          btn.addEventListener('click', () => {
            if (!player) return;
            player.configure({ abr: { enabled: false } });
            player.selectVariantTrack(track, true);
            qualityMenu.hidden = true;
            refreshMenus();
          });
          qualityMenu.appendChild(btn);
        });
    }
  };

  const toggleMenu = (menuToShow, menuToHide) => {
    if (!menuToShow || !menuToHide) return;
    menuToHide.hidden = true;
    menuToShow.hidden = !menuToShow.hidden;
  };

  playBtn.addEventListener('click', async () => {
    if (video.paused) {
      try {
        await video.play();
      } catch (e) {
        console.warn('Play failed:', e);
      }
    } else {
      video.pause();
    }
  });

  rewindBtn.addEventListener('click', () => {
    if (isLiveStream()) {
      const seekRange = getSeekRange();
      if (seekRange) {
        const target = Math.max(seekRange.start, video.currentTime - 300);
        video.currentTime = target;
        return;
      }
    }
    video.currentTime = Math.max(0, video.currentTime - 10);
  });

  forwardBtn.addEventListener('click', () => {
    if (isLiveStream()) {
      const seekRange = getSeekRange();
      if (seekRange) {
        video.currentTime = Math.min(seekRange.end, video.currentTime + 10);
        return;
      }
    }
    const maxTime = isFinite(video.duration) ? video.duration : video.currentTime + 10;
    video.currentTime = Math.min(maxTime, video.currentTime + 10);
  });

  muteBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    video.muted = !video.muted;
    updateMuteState();
    updateVolumeUI();
  });

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  seekInput.addEventListener('input', (event) => {
    customControls.isSeeking = true;
    const value = parseFloat(event.target.value);
    const duration = video.duration;
    if (isLiveStream()) {
      const seekRange = getSeekRange();
      if (seekRange) {
        const previewTime = seekRange.start + value;
        const percent = seekRange.end > seekRange.start
          ? (value / (seekRange.end - seekRange.start)) * 100
          : 0;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(previewTime);
        if (progressEl) progressEl.style.width = `${percent}%`;
        if (seekThumb) seekThumb.style.left = `${percent}%`;
      }
    } else if (isFinite(duration) && duration > 0) {
      const previewTime = (value / 100) * duration;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(previewTime);
      if (progressEl) progressEl.style.width = `${value}%`;
      if (seekThumb) seekThumb.style.left = `${value}%`;
    }
  });

  container.addEventListener('click', async (event) => {
    if (controls.contains(event.target)) return;
    if (video.paused) {
      try {
        await video.play();
      } catch (e) {
        console.warn('Play failed:', e);
      }
    } else {
      video.pause();
    }
  });

  seekInput.addEventListener('change', (event) => {
    const value = parseFloat(event.target.value);
    const duration = video.duration;
    if (isLiveStream()) {
      const seekRange = getSeekRange();
      if (seekRange) {
        video.currentTime = seekRange.start + value;
      }
    } else if (isFinite(duration) && duration > 0) {
      video.currentTime = (value / 100) * duration;
    }
    customControls.isSeeking = false;
  });

  if (volumeInput) {
    volumeInput.addEventListener('input', (event) => {
      const volume = parseFloat(event.target.value);
      video.volume = volume;
      video.muted = volume === 0;
      updateMuteState();
      updateVolumeUI();
    });
    volumeInput.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  audioBtn.addEventListener('click', () => toggleMenu(audioMenu, qualityMenu));
  qualityBtn.addEventListener('click', () => toggleMenu(qualityMenu, audioMenu));
  if (liveBadge) {
    liveBadge.addEventListener('click', () => {
      if (isLiveStream()) {
        const seekRange = getSeekRange();
        if (seekRange) {
          video.currentTime = seekRange.end;
        }
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!controls.contains(event.target)) {
      if (audioMenu) audioMenu.hidden = true;
      if (qualityMenu) qualityMenu.hidden = true;
    }
  });

  if (audioMenu) {
    audioMenu.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  if (qualityMenu) {
    qualityMenu.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  container.addEventListener('mousemove', showControls);
  container.addEventListener('mouseenter', showControls);
  container.addEventListener('mouseleave', hideControls);
  container.addEventListener('keydown', showControls);
  container.addEventListener('touchstart', showControls, { passive: true });

  video.addEventListener('timeupdate', updateSeekUI);
  video.addEventListener('durationchange', updateSeekUI);
  video.addEventListener('progress', updateSeekUI);
  video.addEventListener('play', updatePlayState);
  video.addEventListener('pause', updatePlayState);
  video.addEventListener('volumechange', updateMuteState);
  video.addEventListener('volumechange', updateVolumeUI);

  updatePlayState();
  updateMuteState();
  updateSeekUI();
  updateVolumeUI();
  refreshMenus();
  showControls();

  customControls.refreshMenus = refreshMenus;
}

// Set up player event listeners
function setupEventListeners() {
  if (!player) return;

  // Error handling
  player.addEventListener('error', (event) => {
    console.error('Shaka Player error:', event);
    const error = event.detail;
    
    let errorMsg = `Error ${error.code}: ${error.message}`;
    
    // Enhanced DRM error messages
    if (error.category === 6) { // DRM errors
      if (error.code === 6001) {
        errorMsg = 'DRM Error: Requested key system not supported';
      } else if (error.code === 6007) {
        errorMsg = 'DRM Error: License request failed';
      } else if (error.code === 6008) {
        errorMsg = 'DRM Error: License response rejected';
      } else if (error.code === 6012) {
        errorMsg = 'DRM Error: No license server configured';
      } else if (error.code === 6015) {
        errorMsg = 'DRM Error: Invalid server certificate';
      } else {
        errorMsg = `DRM Error ${error.code}: ${error.message}`;
      }
    }
    
    showStatus(errorMsg, 'error');
    hideLoading();
  });

  // Loading event
  player.addEventListener('loading', () => {
    showLoading();
    updatePlayerInfo('Loading...', '-', '-', '-');
  });

  // Loaded event
  player.addEventListener('loaded', () => {
    hideLoading();
    showStatus('Stream loaded successfully', 'success');
    updatePlayerInfo('Playing', '-', '-', '-');
    document.getElementById('player-info').style.display = 'block';
  });

  // Streaming event (quality changes, etc.)
  player.addEventListener('streaming', () => {
    updateStreamInfo();
    if (customControls.refreshMenus) {
      customControls.refreshMenus();
    }
  });

  // Adaptation (quality change)
  player.addEventListener('adaptation', () => {
    updateStreamInfo();
    if (customControls.refreshMenus) {
      customControls.refreshMenus();
    }
  });

  player.addEventListener('trackschanged', () => {
    if (customControls.refreshMenus) {
      customControls.refreshMenus();
    }
  });

  // Video element events
  const video = document.getElementById('video');
  
  video.addEventListener('playing', () => {
    updatePlayerInfo('Playing', '-', '-', '-');
    updateStreamInfo();
  });

  video.addEventListener('pause', () => {
    updatePlayerInfo('Paused', '-', '-', '-');
  });

  video.addEventListener('ended', () => {
    updatePlayerInfo('Ended', '-', '-', '-');
  });

  video.addEventListener('waiting', () => {
    updatePlayerInfo('Buffering...', '-', '-', '-');
  });
}

// Auto-hide cursor after 5 seconds of inactivity
function setupCursorAutoHide() {
  const container = document.getElementById('video-container');
  if (!container) return;

  let cursorTimeout;
  let isIdle = false;

  const hideCursor = () => {
    container.classList.add('no-cursor');
    isIdle = true;
  };

  const showCursor = () => {
    container.classList.remove('no-cursor');
    isIdle = false;
    resetTimer();
  };

  const resetTimer = () => {
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(hideCursor, 5000); // 5 seconds
  };

  // Show cursor on mouse movement
  container.addEventListener('mousemove', () => {
    if (isIdle) {
      showCursor();
    } else {
      resetTimer();
    }
  });

  // Show cursor on mouse enter
  container.addEventListener('mouseenter', showCursor);

  // Clear timeout on mouse leave
  container.addEventListener('mouseleave', () => {
    clearTimeout(cursorTimeout);
    container.classList.remove('no-cursor');
  });

  // Show cursor on any click
  container.addEventListener('click', showCursor);

  // Show cursor on keyboard interaction
  container.addEventListener('keydown', showCursor);

  // Start the initial timer
  resetTimer();
}

// Update stream information display
function updateStreamInfo() {
  if (!player) return;

  try {
    const stats = player.getStats();
    const variantTracks = player.getVariantTracks();
    const activeTrack = variantTracks.find(t => t.active);

    if (activeTrack) {
      const resolution = activeTrack.width && activeTrack.height 
        ? `${activeTrack.width}x${activeTrack.height}`
        : 'Unknown';
      
      const bandwidth = stats.estimatedBandwidth 
        ? `${(stats.estimatedBandwidth / 1000000).toFixed(2)} Mbps`
        : 'Unknown';

      updatePlayerInfo('Playing', resolution, bandwidth, '-');
    }
  } catch (error) {
    console.warn('Error updating stream info:', error);
  }
}

// Load and play stream
async function loadStream(config) {
  if (!player) {
    const initialized = await initPlayer();
    if (!initialized) return;
  }

  showLoading();
  hideStatus();

  try {
    // Unload current stream if any
    if (currentManifest) {
      await player.unload();
    }

    // Configure player
    const playerConfig = {
      streaming: {
        // Low latency configuration (sportika.live settings)
        liveSync: {
          targetLatency: 5,
          maxLatency: 20
        },
        bufferingGoal: 30,
        rebufferingGoal: 2,
        bufferBehind: 30
      }
    };

    // Configure ClearKey DRM with user's key ID and key
    if (config.keyId && config.keyValue) {
      // Build ClearKey configuration
      const clearKeys = {};
      clearKeys[config.keyId] = config.keyValue;
      
      playerConfig.drm = {
        clearKeys: clearKeys,
        // Retry parameters for license requests
        retryParameters: {
          timeout: 30000,
          maxAttempts: 2,
          baseDelay: 1000,
          backoffFactor: 2,
          fuzzFactor: 0.5
        }
      };
      
      console.log('🔐 ClearKey DRM configured');
      console.log('   Key ID:', config.keyId);
      console.log('   Key:', config.keyValue);
      console.log('   ClearKeys object:', clearKeys);
      updatePlayerInfo('Loading...', '-', '-', 'ClearKey');
    } else {
      console.log('ℹ️ No DRM keys provided - loading as clear stream');
      updatePlayerInfo('Loading...', '-', '-', 'None');
    }

    player.configure(playerConfig);

    // Handle separate audio URL by creating a virtual Master Playlist
    let loadUrl = config.manifestUrl;
    if (config.audioUrl) {
      console.log('🔄 Merging video and audio into a master playlist...');
      // Construct a Master Playlist that references both the video and audio streams
      // We assume the provided URLs are Media Playlists (variants/segments), not Master Playlists.
      const masterPlaylist = [
        '#EXTM3U',
        '#EXT-X-VERSION:3',
        '#EXT-X-INDEPENDENT-SEGMENTS',
        `#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",NAME="Main Audio",DEFAULT=YES,AUTOSELECT=YES,URI="${config.audioUrl}"`,
        // We set a high bandwidth to ensure it's selected. Codecs will be probed from the sub-manifests.
        '#EXT-X-STREAM-INF:BANDWIDTH=5000000,AUDIO="audio",RESOLUTION=1920x1080',
        config.manifestUrl
      ].join('\n');

      // Create a data URI for the manifest
      loadUrl = 'data:application/x-mpegurl;base64,' + btoa(masterPlaylist);
      console.log('generated master playlist:', masterPlaylist);
    }

    // Load manifest
    currentManifest = config.manifestUrl;
    await player.load(loadUrl);

    // Auto-select last audio language (sportika.live behavior)
    try {
      const tracks = player.getVariantTracks();
      const audioTracks = tracks.filter(t => t.language && t.type === 'variant');
      if (audioTracks.length > 0) {
        const lastTrack = audioTracks[audioTracks.length - 1];
        if (lastTrack.language) {
          player.selectAudioLanguage(lastTrack.language);
        }
      }
    } catch (e) {
      console.warn('Audio language selection failed:', e);
    }

    // Autoplay if enabled
    if (config.autoplay) {
      const video = document.getElementById('video');
      try {
        await video.play();
      } catch (e) {
        console.warn('Autoplay prevented:', e);
        showStatus('Autoplay prevented - click play button', 'error');
      }
    }

    hideLoading();
    showStatus('Stream loaded successfully!', 'success');
    if (customControls.refreshMenus) {
      customControls.refreshMenus();
    }

  } catch (error) {
    console.error('Stream loading error:', error);
    hideLoading();
    
    let errorMessage = error.message;
    if (error.code) {
      errorMessage = `Error ${error.code}: ${error.message}`;
    }
    
    showStatus(`Failed to load stream: ${errorMessage}`, 'error');
    updatePlayerInfo('Error', '-', '-', '-');
  }
}

// Stop current stream
async function stopStream() {
  if (player && currentManifest) {
    try {
      const video = document.getElementById('video');
      video.pause();
      await player.unload();
      currentManifest = null;
      
      updatePlayerInfo('Stopped', '-', '-', '-');
      showStatus('Stream stopped', 'success');
      
      setTimeout(() => {
        document.getElementById('player-info').style.display = 'none';
      }, 2000);
    } catch (error) {
      console.error('Error stopping stream:', error);
      showStatus('Error stopping stream', 'error');
    }
  }
}

// Form submission handler
document.getElementById('player-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const manifestUrl = document.getElementById('manifest-url').value.trim();
  const audioUrl = document.getElementById('audio-url').value.trim();
  const keyId = document.getElementById('key-id').value.trim();
  const keyValue = document.getElementById('key-value').value.trim();

  if (!manifestUrl) {
    showStatus('Please enter a manifest URL', 'error');
    return;
  }

  // Keys are optional - if one is provided, both must be provided
  if ((keyId && !keyValue) || (!keyId && keyValue)) {
    showStatus('Please enter both Key ID and Key, or leave both empty for unencrypted streams', 'error');
    return;
  }

  const config = {
    manifestUrl,
    audioUrl: audioUrl || null,
    keyId: keyId || null,
    keyValue: keyValue || null,
    autoplay: true
  };

  await loadStream(config);
});

// Preset configurations
function loadPreset(type) {
  const manifestInput = document.getElementById('manifest-url');
  const keyIdInput = document.getElementById('key-id');
  const keyValueInput = document.getElementById('key-value');

  switch(type) {
    case 'example':
      // User's example stream
      manifestInput.value = 'https://a201aivottlinear-a.akamaihd.net/OTTB/lhr-nitro/clients/dash/enc/kav10mdj91/out/v1/bd3b0c314fff4bb1ab4693358f3cd2d3/cenc.mpd';
      keyIdInput.value = '5deb190b1dac28e46c0bdada7668b7de';
      keyValueInput.value = 'ddd2b372702e42b0d2708a70b91dec8d';
      break;

    case 'shaka':
      // Shaka Player ClearKey DRM test stream
      manifestInput.value = 'https://storage.googleapis.com/shaka-demo-assets/angel-one-clearkey/dash.mpd';
      keyIdInput.value = 'eb676abbcb345e96bbcf616630f1a3da';
      keyValueInput.value = '100b6c20940f779a4589152b57d2dacb';
      break;

    case 'clear':
      manifestInput.value = '';
      keyIdInput.value = '';
      keyValueInput.value = '';
      break;
  }
}

// UI Helper Functions
function showStatus(message, type = 'success') {
  const statusEl = document.getElementById('status-message');
  statusEl.textContent = message;
  statusEl.className = `status show ${type}`;
  
  if (type === 'success') {
    setTimeout(hideStatus, 5000);
  }
}

function hideStatus() {
  const statusEl = document.getElementById('status-message');
  statusEl.className = 'status';
}

function showLoading() {
  document.getElementById('loading').classList.add('show');
}

function hideLoading() {
  document.getElementById('loading').classList.remove('show');
}

function updatePlayerInfo(status, resolution, bandwidth, drm) {
  document.getElementById('status-value').textContent = status;
  document.getElementById('resolution-value').textContent = resolution;
  document.getElementById('bandwidth-value').textContent = bandwidth;
  document.getElementById('drm-value').textContent = drm;
}

// Initialize player on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔐 DRM Video Player Tool initialized');
  console.log('Based on Sportika.live player extraction');
  console.log('Supported DRM Systems:');
  console.log('  - ClearKey (org.w3.clearkey)');
  console.log('  - Widevine (com.widevine.alpha)');
  console.log('  - PlayReady (com.microsoft.playready)');
  
  // Check DRM support
  if (navigator.requestMediaKeySystemAccess) {
    checkDRMSupport();
  } else {
    console.warn('⚠️ EME (Encrypted Media Extensions) not supported in this browser');
  }
  
  // Auto-initialize player
  initPlayer();
});

// Check which DRM systems are supported
async function checkDRMSupport() {
  const systems = [
    { name: 'Widevine', id: 'com.widevine.alpha' },
    { name: 'PlayReady', id: 'com.microsoft.playready' },
    { name: 'FairPlay', id: 'com.apple.fps' },
    { name: 'ClearKey', id: 'org.w3.clearkey' }
  ];

  console.log('\n🔍 Checking DRM support...');
  
  for (const system of systems) {
    try {
      const config = [{
        initDataTypes: ['cenc'],
        videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"' }],
        audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }]
      }];
      
      await navigator.requestMediaKeySystemAccess(system.id, config);
      console.log(`  ✅ ${system.name} supported`);
    } catch (e) {
      console.log(`  ❌ ${system.name} not supported`);
    }
  }
  console.log('');
}

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (player) {
    player.destroy();
  }
});
