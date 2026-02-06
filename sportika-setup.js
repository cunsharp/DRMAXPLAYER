// sportika-setup.js
// Cleaned/annotated Shaka Player + UI initialization extracted from sportika.live
// Replace manifestUrl and clearKeys with values you control before testing.

document.addEventListener('DOMContentLoaded', async () => {
  // Ensure Shaka polyfills are installed
  if (window.shaka) {
    try {
      window.shaka.polyfill.installAll();
    } catch (e) {
      console.error('Error installing Shaka polyfills', e);
    }
  }

  if (!window.shaka || !window.shaka.Player) {
    console.error('Shaka Player not found. Make sure shaka-player.compiled.js is loaded.');
    return;
  }

  if (!window.shaka.Player.isBrowserSupported()) {
    console.warn('Shaka Player: browser not fully supported');
    // Continue anyway for testing.
  }

  const video = document.getElementById('video');
  const container = document.getElementById('video-container');

  // Create player and UI overlay
  const player = new window.shaka.Player(video);
  const ui = new window.shaka.ui.Overlay(player, container, video);

  // Configure UI controls to match sportika.live
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
    overflowMenuButtons: ['quality','language']
  });

  // Example player configuration taken from the site: live-sync and placeholder DRM
  const playerConfig = {
    streaming: {
      // sportika tuned for low latency
      liveSync: {
        targetLatency: 5,
        maxLatency: 20
      }
    },
    drm: {
      // Placeholder ClearKey example — DO NOT use in production.
      // Replace with actual keys or remove this block.
      clearKeys: {
        // 'kid-hex-without-dashes': 'key-hex-without-dashes'
        // Example: '9f86d081884c7d659a2feaa0c55ad015': '0123456789abcdef0123456789abcdef'
      }
    }
  };

  player.configure(playerConfig);

  // Optional: add a request filter to inject headers (if the original site uses referer or tokens)
  // player.getNetworkingEngine().registerRequestFilter((type, request) => {
  //   // Example: add a referer header
  //   request.headers['referer'] = window.location.origin;
  // });

  // Replace this with a real manifest you have permission to play
  const manifestUrl = 'https://example.com/manifest.mpd';

  try {
    await player.load(manifestUrl);
    console.log('Loaded manifest:', manifestUrl);

    // Sportika selects the last audio language track if available
    try {
      const tracks = player.getVariantTracks();
      const audioTracks = tracks.filter(t => t.language && t.type === 'variant' || t.type === 'audio');
      if (audioTracks && audioTracks.length) {
        const last = audioTracks[audioTracks.length - 1];
        if (last && last.language) {
          console.log('Selecting audio language:', last.language);
          player.selectAudioLanguage(last.language);
        }
      }
    } catch (e) {
      console.warn('Audio language selection failed', e);
    }
  } catch (err) {
    console.error('Error loading manifest', err);
  }

  // Error handling like the site
  player.addEventListener('error', (e) => {
    console.error('Shaka error', e);
  });
});
