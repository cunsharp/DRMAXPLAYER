// DRM Video Player Tool - Based on Sportika.live extraction
// Built with Shaka Player

let player = null;
let ui = null;
let currentManifest = null;

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

    showStatus('Player initialized successfully', 'success');
    return true;

  } catch (error) {
    console.error('Player initialization error:', error);
    showStatus(`Initialization error: ${error.message}`, 'error');
    return false;
  }
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
  });

  // Adaptation (quality change)
  player.addEventListener('adaptation', () => {
    updateStreamInfo();
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

    // Load manifest
    currentManifest = config.manifestUrl;
    await player.load(config.manifestUrl);

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
    keyId: keyId || null,
    keyValue: keyValue || null
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
