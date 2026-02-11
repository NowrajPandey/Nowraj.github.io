// piano-embedded.js - Embedded piano for projects tab
document.addEventListener("DOMContentLoaded", function () {
  // Audio context
  let audioContext;
  let masterGain;

  // Note frequencies
  const noteFrequencies = {
    C: 261.63,
    "C#": 277.18,
    D: 293.66,
    "D#": 311.13,
    E: 329.63,
    F: 349.23,
    "F#": 369.99,
    G: 392.0,
    "G#": 415.3,
    A: 440.0,
    "A#": 466.16,
    B: 493.88,
  };

  // DOM Elements
  const keys = document.querySelectorAll(".piano-embedded .key");
  const volumeSlider = document.getElementById("embedded-volume");
  const waveformSelect = document.getElementById("embedded-waveform");
  const octaveSelect = document.getElementById("embedded-octave");
  const currentNoteEl = document.getElementById("embedded-current-note");

  // State
  let activeOscillators = {};
  let currentVolume = 0.7;
  let currentWaveform = "sine";
  let currentOctave = 4;
  let isAudioInitialized = false;

  // Initialize audio
  function initializeAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioContext.createGain();
      masterGain.connect(audioContext.destination);
      masterGain.gain.value = currentVolume;
      isAudioInitialized = true;
      console.log("Embedded piano audio initialized");
    }
  }

  // Play note
  function playNote(note, octave = currentOctave) {
    if (!isAudioInitialized) initializeAudio();

    try {
      let baseFreq = noteFrequencies[note];
      if (!baseFreq) return;

      let frequency = baseFreq * Math.pow(2, octave - 4);

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(masterGain);

      oscillator.type = currentWaveform;
      oscillator.frequency.value = frequency;

      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(currentVolume * 0.7, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1);

      oscillator.start(now);
      oscillator.stop(now + 1);

      const id = note + octave + Date.now();
      activeOscillators[id] = { oscillator, gainNode };

      setTimeout(() => {
        delete activeOscillators[id];
      }, 1000);

      currentNoteEl.textContent = note + octave;
    } catch (error) {
      console.error("Error playing note:", error);
    }
  }

  // Handle key press
  function handleKeyPress(keyElement) {
    const note = keyElement.dataset.note;
    const octave = keyElement.dataset.octave
      ? parseInt(keyElement.dataset.octave)
      : currentOctave;

    if (note) {
      keyElement.classList.add("active");
      playNote(note, octave);

      setTimeout(() => {
        keyElement.classList.remove("active");
      }, 200);
    }
  }

  // Initialize keys
  function initializeKeys() {
    keys.forEach((key) => {
      key.addEventListener("mousedown", (e) => {
        e.preventDefault();
        handleKeyPress(key);
      });

      key.addEventListener("touchstart", (e) => {
        e.preventDefault();
        handleKeyPress(key);
      });
    });

    // Keyboard events
    const keyMap = {
      a: "C",
      w: "C#",
      s: "D",
      e: "D#",
      d: "E",
      f: "F",
      t: "F#",
      g: "G",
      y: "G#",
      h: "A",
      u: "A#",
      j: "B",
      k: "C",
    };

    document.addEventListener("keydown", (e) => {
      if (e.repeat) return;

      const key = e.key.toLowerCase();
      const note = keyMap[key];

      if (note) {
        e.preventDefault();
        const keyElement = document.querySelector(
          `.piano-embedded .key[data-key="${key}"]`,
        );
        if (keyElement) {
          keyElement.classList.add("active");
          playNote(note, key === "k" ? 5 : currentOctave);

          setTimeout(() => {
            keyElement.classList.remove("active");
          }, 200);
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      const keyElement = document.querySelector(
        `.piano-embedded .key[data-key="${key}"]`,
      );
      if (keyElement) {
        keyElement.classList.remove("active");
      }
    });
  }

  // Initialize controls
  function initializeControls() {
    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => {
        currentVolume = e.target.value / 100;
        if (masterGain) {
          masterGain.gain.value = currentVolume;
        }
      });
    }

    if (waveformSelect) {
      waveformSelect.addEventListener("change", (e) => {
        currentWaveform = e.target.value;
      });
    }

    if (octaveSelect) {
      octaveSelect.addEventListener("change", (e) => {
        currentOctave = parseInt(e.target.value);
      });
    }
  }

  // Initialize on interaction
  function initializeOnInteraction() {
    const init = () => {
      if (!isAudioInitialized) {
        initializeAudio();
      }
    };

    document.addEventListener("click", init, { once: true });
    document.addEventListener("keydown", init, { once: true });
    document.addEventListener("touchstart", init, { once: true });
  }

  // Start
  initializeOnInteraction();
  initializeKeys();
  initializeControls();

  // Set initial note
  if (currentNoteEl) {
    currentNoteEl.textContent = "C4";
  }
});
