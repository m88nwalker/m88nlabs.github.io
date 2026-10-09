// JavaScript Document
     
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function midiToNote(midi) {
  const name = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}

function noteToMidi(note) {
  const match = note.match(/^([A-G]#?)(-?\d+)$/);
  if (!match) return null;
  const name = match[1];
  const octave = parseInt(match[2], 10);
  const index = NOTE_NAMES.indexOf(name);
  if (index === -1) return null;
  return (octave + 1) * 12 + index;
}

const ALL_NOTES = [];
for (let midi = 21; midi <= 108; midi++) {
  ALL_NOTES.push(midiToNote(midi));
}

const WHITE_NOTES_ALL = ALL_NOTES.filter((note) => !note.includes("#"));

const STORAGE_KEYS = {
  settings: "bitcoinPianoSettings_v2",
  sequences: "bitcoinPianoSequences_v2",
  draft: "bitcoinPianoDraftSequence_v2"
};

const RANGE_PRESETS = {
  full: { label: "Full Keyboard (A0–C8)", start: "A0", end: "C8" },
  bass: { label: "Bass / Low End (A0–B2)", start: "A0", end: "B2" },
  lowmid: { label: "Low-Mid (C3–B3)", start: "C3", end: "B3" },
  middle: { label: "Middle (C4–B5)", start: "C4", end: "B5" },
  upper: { label: "Upper (C6–C8)", start: "C6", end: "C8" },
  octave4: { label: "Octave 4 (C4–B4)", start: "C4", end: "B4" },
  octave5: { label: "Octave 5 (C5–B5)", start: "C5", end: "B5" }
};

/* INSCRIPTION AUDIO URLS */

const NOTE_URLS = {
  "A0": "https://ordinals.com/content/316f79522110090c4750fd5476de252273a024db9026ea6ff6afd3505e09554bi0",
  "A#0": "https://ordinals.com/content/d9b2feb2ec863da2945cde323abd12cc28aff7dae7f5bc0e5aec3d2e22c5b15fi0",
  "B0": "https://ordinals.com/content/d5c87864af70e6f720b16a27bbfb1ccfa22345244515774349407309e1da97a5i0",

  "C1": "https://ordinals.com/content/2a0084ad506ac0f02541c507cc1642850c410cdb4cc0812f3b689eb697a93946i0",
  "C#1": "https://ordinals.com/content/66b3f845521815ddc8069963a11f717c1092c1003e17cb6652e68d612f1cbac0i0",
  "D1": "https://ordinals.com/content/332e8c59399c90ded368043cc894e1d399e38f5034690faa683f20daccb27590i0",
  "D#1": "https://ordinals.com/content/d117faefe9f889eeca2849731b1fe976f73500b5d5432cdcc50a8d248b0e0e25i0",
  "E1": "https://ordinals.com/content/d8b19397d84f7ade1086059f2fc0d6717db8224eba8ca3dbabe96a5a2295a005i0",
  "F1": "https://ordinals.com/content/c4c815c28bafa5a1d5e5fc803ec63b3a86da9b6fbaeca53af26d63aea03e7421i0",
  "F#1": "https://ordinals.com/content/d57fdf23424ea4ab031d7af2d21e11f512fb41e0c92701ddf8bcf82922445f4di0",
  "G1": "https://ordinals.com/content/08c4af4be5f7c71b81bdf92c7676243f8fbe2ca8cf2621addd50220387106f10i0",
  "G#1": "https://ordinals.com/content/9367b43b5beaf8b7be9b61d41e878f527c420818173f6dea53be68989c1b294fi0",
  "A1": "https://ordinals.com/content/6284bdcdcbaa35e96d384bbcfd873a2e1dc45f26e9ca4c9aa6b9a1e9032e764ai0",
  "A#1": "https://ordinals.com/content/2b21e4d93caea491154295cd8dfcbd78d117b13fe93b4b1b2a4bd7e1e3b4c3bdi0",
  "B1": "https://ordinals.com/content/68735917a12f1d9c3a6e17bba0cac916e75c4c21b843a26bfcf584b7ea3795bdi0",

  "C2": "https://ordinals.com/content/cce1ebde17c1501c0f45d52c8ef2f71870e8c0c883428923556dc98f00e790e7i0",
  "C#2": "https://ordinals.com/content/f0f698c4868546554f6edc3ba9aac76f7be99ae40a9f91ee96b7e2832815f016i0",
  "D2": "https://ordinals.com/content/2e71eb3b76242376316e903ffdf2899b963595b6cacdd7c68b3f56c17f748b0ei0",
  "D#2": "https://ordinals.com/content/81feed191e704e2db99f2629963dc7a95a13e762276750285ad04c34cab8f113i0",
  "E2": "https://ordinals.com/content/3220a01b051c1391f7591b420ce0368a4c91975417cf0d707ed7f67a40410413i0",
  "F2": "https://ordinals.com/content/bedee285c5e26a5a7ed316d2e48d3bdc0577fa730ee94384d410b7a6a63053aai0",
  "F#2": "https://ordinals.com/content/c34cf771ef6ac611989e123ab35f1554fbbed6e383f4b16fa252920273afb130i0",
  "G2": "https://ordinals.com/content/4a3779e2daa75f89a6060f16ef8d9debacebfc49402d721bcb6ceb5fa65dcce4i0",
  "G#2": "https://ordinals.com/content/3d4a837a94d49d9883b2ee44471561ea6a20479c9f60087f568ef6dcb87bd807i0",
  "A2": "https://ordinals.com/content/3d87378d31f247a221a2a9a3a306e689ec0f33263705ea371d08b95ffdddd34fi0",
  "A#2": "https://ordinals.com/content/38d9cf16d50269e9b96b5841d7fbd38c3a19731c606c57bb2441dfbe07e30451i0",
  "B2": "https://ordinals.com/content/a5c43df4dedb43610132ef83c03718920fe76c4c3c54d384d6c2f0358cd530d6i0",

  "C3": "https://ordinals.com/content/f2bc786e5a46ceec29330ced6243df69da970cc02805d9a9a006698b3d8de594i0",
  "C#3": "https://ordinals.com/content/df9aa8abce056ad325035ab27816ad2ad4f4d98f9339639b54ccb997dee2385di0",
  "D3": "https://ordinals.com/content/079995fc0681c49ec3b0d0af2fad0f0c8cc1158b31540445af6423ac9680c06ei0",
  "D#3": "https://ordinals.com/content/e618b59f0e126d02dcef136ffd4b79ce3e1b8e04b323fdcc20d12074308ed49ei0",
  "E3": "https://ordinals.com/content/0ec3fd269b9f0a7638b98228646cce1d73ecf75ef25c6cf8c5a6bc6df9d03acfi0",
  "F3": "https://ordinals.com/content/179902d783aecae595858cbfced6c453d087d2f8b285a5b005e7d380c1787588i0",
  "F#3": "https://ordinals.com/content/11f550b0b8b3281250c330423a8977f95458a084a1d0fdd85e74b3b7ba0aaa09i0",
  "G3": "https://ordinals.com/content/bbbe95490238c8ef64e712d5aed1faef7527a346e135597f80d678fb86d82afdi0",
  "G#3": "https://ordinals.com/content/95d5b5737f37edd062fef514779f76a3159c9348db2184ccbadf62088f2c057fi0",
  "A3": "https://ordinals.com/content/5e752eeb5056c5e96f828706392759740587a849fcfa73c274435bf168d35867i0",
  "A#3": "https://ordinals.com/content/5a9a620d8e26ca4ffedc8bde874c542c2f1dcd75e5e955a0e411a50a38eede69i0",
  "B3": "https://ordinals.com/content/7f0fb6fe7640031171a4f63285136b3186cd145537fc968efd220c615274de00i0",

  "C4": "https://ordinals.com/content/567f5d5f231bda7507024b7ec94b6a1a784ae08b3ccd33b6cca3ff50cca48d6di0",
  "C#4": "https://ordinals.com/content/d251c3db7874d2fff745efced91a97ea2347f5fba264ba7ed71949b9802da792i0",
  "D4": "https://ordinals.com/content/0a50d4e6b355735dce6389a25645a68321f647768bc75893a9834be5ece2a851i0",
  "D#4": "https://ordinals.com/content/be755f8e4dc0ebec5b46a2887f9e658e9ef2c2ee2360e62b9bd77e3f4fd7acd4i0",
  "E4": "https://ordinals.com/content/0d1ee43c8356570a2cce50529595ad93f62934c5245cfa0c9946cc7a5fff72d3i0",
  "F4": "https://ordinals.com/content/cf5fbaec8baf7899160cb767dfc706c3ecf84961e38a45ae931d20572052b2dci0",
  "F#4": "https://ordinals.com/content/920c12c5738f998470fbe027e27790356e443806e9ccf23a54ddba6026fee09bi0",
  "G4": "https://ordinals.com/content/0038742dd3a1a58b517c23958614bf33ca7143d7220eeae9b08505abc0f05304i0",
  "G#4": "https://ordinals.com/content/0eff8a1c1747cd61ec4fda7096b56ed98fc310f588ee98dd0e923ad5ddad0761i0",
  "A4": "https://ordinals.com/content/8ca950589366e7f377251bd7e5f0a79be89f40489eceba95e129f9e1cd775408i0",
  "A#4": "https://ordinals.com/content/0ced4b16850692fa2fc036d0a40d784d9ea1a640d844deb083c449324c55ed05i0",
  "B4": "https://ordinals.com/content/013e93987226a93c2d5618452b86427484562f072369e3a02f8f9832957c39cfi0",

  "C5": "https://ordinals.com/content/98c937e91091ef08d715137c17950477c8f8481aa3d0e39ea4465bfcbf3794c8i0",
  "C#5": "https://ordinals.com/content/81803ef066d5e7c5558af9777e003f4164ce0e9ab5045a5c40ec4cc818085eb9i0",
  "D5": "https://ordinals.com/content/0905d88e6bf416062fd78c6b0566f8a6f3430858d7a7f82ce530e547f531ba6ci0",
  "D#5": "https://ordinals.com/content/d64d8ec36c9b577804508e99ac32448c4cd1c66996e7304760ab0fe2b22092f8i0",
  "E5": "https://ordinals.com/content/16baeadda93789bd1bf71eaf3fdc33dbf9a2dbe8bffed891a4036bda0f586dbdi0",
  "F5": "https://ordinals.com/content/41ec5076fe49b581c605e53cd90ad740e2456bbba25216f224fb94934b2155b8i0",
  "F#5": "https://ordinals.com/content/e5adbd293989e53f878480bc7339abd09b82792cbd30f6f75222fc80d07df8a0i0",
  "G5": "https://ordinals.com/content/18a3f43559138b3be3ef02292cd9871be1837fd8c4073a9e8079b7b4d29ec0e4i0",
  "G#5": "https://ordinals.com/content/fc5553bbe47404b0f3b8b016c77c09c056c213a737bec4ec9ded4a71b1ba0288i0",
  "A5": "https://ordinals.com/content/0015e31603dce3639957ad35c470b9f7d9bc76c6b747d3c33e98e644ab9dbed0i0",
  "A#5": "https://ordinals.com/content/919eb92b68e141c16c9293fbafefeed07f8b62b9799c50a966f5f44d40e55e44i0",
  "B5": "https://ordinals.com/content/dcbe67e323c4c47099217d985bf21d5a3a2d284ba42009d563d4a3d2640b4157i0",

  "C6": "https://ordinals.com/content/4c1c29038f0601789a09c7992a25663481e54bdf75d77c23e0e226cfef10e39ci0",
  "C#6": "https://ordinals.com/content/38c7b18107e019e953221416e69da0e6777f205213c7d55d9669b238cccd0c0ei0",
  "D6": "https://ordinals.com/content/2e108d6fa091b5463853f6036bf336d45f4f1e03e594d95f30948f587e2c815ci0",
  "D#6": "https://ordinals.com/content/9f81a52eb610a686247e9db16acc99e2924bf0a71ed6697dd6b96bd340e914eei0",
  "E6": "https://ordinals.com/content/2d608a08b29e4139d91565891245540e72211a7b15b8c6dc0099354b3bb08b29i0",
  "F6": "https://ordinals.com/content/f5440b34919337472ed780f128f6173f900817e1bd77fb4ac909d444560e3de0i0",
  "F#6": "https://ordinals.com/content/aae909637b1aec33c0ead2d2e4c56ae4bfa3d56d254f4199f2dd69b64e7cd760i0",
  "G6": "https://ordinals.com/content/6450afe4c16c6ef008fa12982d4f11781a5ce32e0a440f1ea5b55311eda82d8ai0",
  "G#6": "https://ordinals.com/content/3bf50235cb1bb253cb72330e369325f1cbda8e5cbab1213e5cc6b662cb518055i0",
  "A6": "https://ordinals.com/content/300fec490199b3036d7368f15a1c38a37b1d7213501cd592f27ecb1203c89526i0",
  "A#6": "https://ordinals.com/content/b402c9a16c95a50c02c59483bc6a892c3f9a212cbb5760d88f2e57793eba6708i0",
  "B6": "https://ordinals.com/content/95ccdf06d6ba1f5b8351915f16cb72840b59030a2cb8cebddaede6c47005c0e2i0",

  "C7": "https://ordinals.com/content/615a08fb8a63c73b15363581dd1d23ff23f059154c6755601872e8e3be616e39i0",
  "C#7": "https://ordinals.com/content/413e2d0017b2928acf5a89853c50c17796dd27558d3a4b03d252126e64ccc38ci0",
  "D7": "https://ordinals.com/content/b6c6dac17ff762794c6edcffccb8d7343dffaa5aa295cf4bfec856a66991780di0",
  "D#7": "https://ordinals.com/content/b393950df54f5f6620105a11f1374cc67102a5b74bd0f65cb8f78424b29f3e85i0",
  "E7": "https://ordinals.com/content/bbb58bf27076a3de2b32d505e328d0e236691edcf6ad5ee457f42e1574bfc00fi0",
  "F7": "https://ordinals.com/content/09c2f1e10ea4e40a459fe0a28aadd0c2dbb85b11d05b28fbdb0182c53da121cbi0",
  "F#7": "https://ordinals.com/content/2183d6e39553adda1b1b591b0db12db9bd9c96fd2404909cb2d2fdb4f0066a63i0",
  "G7": "https://ordinals.com/content/6b2ec0542e8e819b552c5604e560e80a3f15094ccc55aa90bb90486966d00c77i0",
  "G#7": "https://ordinals.com/content/f085dd7942a5b4cf758536338ff23c9c9218bbdc8f9014972eb4267d76dc9e26i0",
  "A7": "https://ordinals.com/content/79701270f7c53a877f0119abd7bc04b01988ca42814521ba22ffb0e45c7f4b7fi0",
  "A#7": "https://ordinals.com/content/2c90f62399f78a33b70266860b128040d32de61f61916f11e74d2ee439948c94i0",
  "B7": "https://ordinals.com/content/da47af65b10a864e2c30d7b87127e9e2c7236a586e93c4127cac2c1f41217436i0",

  "C8": "https://ordinals.com/content/35dca3d73d659e0f7607e4d984ecd6dac7e4f5152d6ff756f9363572471a977ei0"
};

const NOTE_TO_CIPHER = {};
const CIPHER_TO_NOTE = {};

(function buildCipherMaps() {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const lowercase = "abcdefghijklmnopqrstuvwxyz".split("");

  const leftHalf = WHITE_NOTES_ALL.slice(0, 26);
  const rightHalf = WHITE_NOTES_ALL.slice(26).reverse();

  leftHalf.forEach((note, index) => {
    NOTE_TO_CIPHER[note] = uppercase[index];
    CIPHER_TO_NOTE[uppercase[index]] = note;
  });

  rightHalf.forEach((note, index) => {
    NOTE_TO_CIPHER[note] = lowercase[index];
    CIPHER_TO_NOTE[lowercase[index]] = note;
  });
})();

const hero = document.getElementById("hero");
const pianoEl = document.getElementById("piano");
const pianoWrapperEl = document.getElementById("pianoWrapper");
const toggleLabelsBtn = document.getElementById("toggleLabelsBtn");
const toggleCipherBtn = document.getElementById("toggleCipherBtn");
const toggleMappingBtn = document.getElementById("toggleMappingBtn");
const lastNoteDisplay = document.getElementById("lastNoteDisplay");
const soundStatusDisplay = document.getElementById("soundStatusDisplay");
const recordingStatusDisplay = document.getElementById("recordingStatusDisplay");
const mappingPanel = document.getElementById("mappingPanel");
const rangeSelect = document.getElementById("rangeSelect");
const noteSelect = document.getElementById("noteSelect");
const noteUrlInput = document.getElementById("noteUrlInput");
const saveMappingBtn = document.getElementById("saveMappingBtn");
const clearMappingBtn = document.getElementById("clearMappingBtn");
const loadSelectedBtn = document.getElementById("loadSelectedBtn");
const mappingPreview = document.getElementById("mappingPreview");

const sustainBtn = document.getElementById("sustainBtn");
const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");
const soundModeSelect = document.getElementById("soundModeSelect");
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const playSequenceBtn = document.getElementById("playSequenceBtn");
const clearSequenceBtn = document.getElementById("clearSequenceBtn");
const saveSequenceBtn = document.getElementById("saveSequenceBtn");
const exportSequenceBtn = document.getElementById("exportSequenceBtn");
const importSequenceBtn = document.getElementById("importSequenceBtn");
const importSequenceInput = document.getElementById("importSequenceInput");
const exportWavBtn = document.getElementById("exportWavBtn");
const sequenceNameInput = document.getElementById("sequenceNameInput");
const savedSequencesPanel = document.getElementById("savedSequencesPanel");
const savedSequencesContent = document.getElementById("savedSequencesContent");
const toggleSavedSequencesBtn = document.getElementById("toggleSavedSequencesBtn");
const savedSequencesList = document.getElementById("savedSequencesList");
const sequencePreviewMini = document.getElementById("sequencePreviewMini");
const cipherTextPreviewMini = document.getElementById("cipherTextPreviewMini");

let labelsVisible = true;
let cipherModeEnabled = false;
let currentRangeKey = "full";
let activeAudioByNote = {};
let audioCache = {};
let activePointerId = null;
let activePointerNote = null;
let activeKeyboardVisualNote = null;
let keyboardCursorNote = null;

let sustainEnabled = false;
let masterVolume = 0.85;
let currentSoundMode = "classic";
let isRecording = false;
let recordStartTime = 0;
let currentSequence = [];
let savedSequences = [];
let playbackTimeouts = [];
let isSequencePlaying = false;
let heroGlowTimeout = null;

function triggerHeroGlow() {
  if (!hero) return;
  hero.classList.add("note-reactive");
  if (heroGlowTimeout) clearTimeout(heroGlowTimeout);
  heroGlowTimeout = setTimeout(() => {
    hero.classList.remove("note-reactive");
  }, 220);
}

function setSavedSequencesPanelOpen(isOpen) {
  if (!savedSequencesContent || !savedSequencesPanel || !toggleSavedSequencesBtn) return;
  savedSequencesContent.classList.toggle("hidden", !isOpen);
  savedSequencesPanel.classList.toggle("collapsed", !isOpen);
  toggleSavedSequencesBtn.textContent = isOpen ? "Hide Saved Sequences" : "Show Saved Sequences";
}

function toggleSavedSequencesPanel() {
  const isCurrentlyHidden = savedSequencesContent.classList.contains("hidden");
  setSavedSequencesPanelOpen(isCurrentlyHidden);
}

function isBlackKey(note) {
  return note.includes("#");
}

function getNotesForRange(rangeKey) {
  const preset = RANGE_PRESETS[rangeKey];
  const startMidi = noteToMidi(preset.start);
  const endMidi = noteToMidi(preset.end);

  return ALL_NOTES.filter((note) => {
    const midi = noteToMidi(note);
    return midi >= startMidi && midi <= endMidi;
  });
}

function buildPiano(rangeKey = currentRangeKey) {
  currentRangeKey = rangeKey;
  pianoEl.innerHTML = "";

  const notes = getNotesForRange(rangeKey);
  const whiteNotes = notes.filter((note) => !isBlackKey(note));
  const whiteWidth = getWhiteKeyWidth();
  const blackWidth = getBlackKeyWidth();
  const pianoPadding = 18;
  const pianoHeight = getWhiteKeyHeight() + 40;

  const whiteIndexMap = {};
  let whiteIndex = 0;

  notes.forEach((note) => {
    if (!isBlackKey(note)) {
      whiteIndexMap[note] = whiteIndex;
      whiteIndex += 1;
    }
  });

  const totalWidth = whiteNotes.length * whiteWidth + pianoPadding * 2;
  pianoEl.style.width = `${totalWidth}px`;
  pianoEl.style.height = `${pianoHeight}px`;

  whiteNotes.forEach((note) => {
    const key = document.createElement("div");
    key.className = "key white-key";
    key.dataset.note = note;

    const left = pianoPadding + whiteIndexMap[note] * whiteWidth;
    key.style.left = `${left}px`;
    key.style.top = `18px`;
    key.style.width = `${whiteWidth}px`;
    key.style.height = `${getWhiteKeyHeight()}px`;

    const noteLabel = document.createElement("span");
    noteLabel.className = "note-label";
    noteLabel.textContent = note;
    key.appendChild(noteLabel);

    if (NOTE_TO_CIPHER[note]) {
      const cipherLabel = document.createElement("span");
      cipherLabel.className = "cipher-label";
      cipherLabel.textContent = NOTE_TO_CIPHER[note];
      key.appendChild(cipherLabel);
    }

    pianoEl.appendChild(key);
  });

  notes.filter(isBlackKey).forEach((note) => {
    const midi = noteToMidi(note);
    const prevWhite = midiToNote(midi - 1);
    const baseIndex = whiteIndexMap[prevWhite];
    if (baseIndex === undefined) return;

    const key = document.createElement("div");
    key.className = "key black-key";
    key.dataset.note = note;

    const left = pianoPadding + ((baseIndex + 1) * whiteWidth) - (blackWidth / 2);
    key.style.left = `${left}px`;
    key.style.top = `18px`;
    key.style.width = `${blackWidth}px`;
    key.style.height = `${getBlackKeyHeight()}px`;

    const label = document.createElement("span");
    label.className = "note-label";
    label.textContent = note;

    key.appendChild(label);
    pianoEl.appendChild(key);
  });

  bindKeyInteractions();
  refreshUnmappedStates();
  centerScrollForRange(rangeKey);

  const visibleNotes = getNotesForRange(currentRangeKey);
  if (!keyboardCursorNote || !visibleNotes.includes(keyboardCursorNote)) {
    keyboardCursorNote = visibleNotes[0] || null;
  }

  applyLoadedSettingsToUI();
}

function getPianoViewportWidth() {
  return pianoWrapperEl?.clientWidth || window.innerWidth;
}

function getWhiteKeyWidth() {
  const width = getPianoViewportWidth();
  return width <= 420 ? 34 : width <= 680 ? 38 : 44;
}

function getBlackKeyWidth() {
  const width = getPianoViewportWidth();
  return width <= 420 ? 22 : width <= 680 ? 25 : 29;
}

function getWhiteKeyHeight() {
  const width = getPianoViewportWidth();
  return width <= 420 ? 138 : width <= 680 ? 158 : 205;
}

function getBlackKeyHeight() {
  const width = getPianoViewportWidth();
  return width <= 420 ? 84 : width <= 680 ? 98 : 125;
}

function bindKeyInteractions() {
  const keys = document.querySelectorAll(".key");

  keys.forEach((key) => {
    const note = key.dataset.note;

    key.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      activePointerId = event.pointerId;
      activePointerNote = note;

      try { key.setPointerCapture(event.pointerId); } catch (_) {}

      if (currentSoundMode !== "classic") {
        primeSynthForGesture();
      }

      playNote(note);
    });

    key.addEventListener("pointerenter", (event) => {
      if (activePointerId !== event.pointerId) return;
      if (activePointerNote === note) return;
      releaseSynthNote(activePointerNote);
      releaseNoteVisual(activePointerNote);
      activePointerNote = note;
      playNote(note);
    });

    key.addEventListener("pointermove", (event) => {
      if (activePointerId !== event.pointerId) return;
      const elementUnderPointer = document.elementFromPoint(event.clientX, event.clientY);
      const keyUnderPointer = elementUnderPointer?.closest?.(".key");
      if (!keyUnderPointer) return;

      const nextNote = keyUnderPointer.dataset.note;
      if (!nextNote || nextNote === activePointerNote) return;

      releaseSynthNote(activePointerNote);
      releaseNoteVisual(activePointerNote);
      activePointerNote = nextNote;
      playNote(nextNote);
    });

    key.addEventListener("pointerup", (event) => {
      if (activePointerId === event.pointerId) {
        if (!sustainEnabled) { releaseSynthNote(activePointerNote); releaseNoteVisual(activePointerNote); }
        activePointerId = null;
        activePointerNote = null;
      }
    });

    key.addEventListener("pointercancel", (event) => {
      if (activePointerId === event.pointerId) {
        if (!sustainEnabled) { releaseSynthNote(activePointerNote); releaseNoteVisual(activePointerNote); }
        activePointerId = null;
        activePointerNote = null;
      }
    });

    key.addEventListener("lostpointercapture", (event) => {
      if (activePointerId === event.pointerId) {
        if (!sustainEnabled) { releaseSynthNote(activePointerNote); releaseNoteVisual(activePointerNote); }
        activePointerId = null;
        activePointerNote = null;
      }
    });
  });
}

function primeAudio(note) {
  const url = NOTE_URLS[note];
  if (!url) return null;

  if (!audioCache[note] || audioCache[note].src !== url) {
    const baseAudio = new Audio(url);
    baseAudio.preload = "auto";
    audioCache[note] = baseAudio;
  }

  return audioCache[note];
}

function recordNoteEvent(note) {
  if (!isRecording) return;
  const now = performance.now();
  currentSequence.push({
    note,
    time: Math.round(now - recordStartTime)
  });
  updateSequencePreview();
  updateCipherTextDisplay();
  saveDraftSequence();
}

// The on-chain Grand Piano uses direct HTMLAudioElement playback.
// All other instruments are generated entirely by the Web Audio API.
let synthContext = null;
let synthMaster = null;
let synthRoom = null;
const activeSynthVoices = new Set();
const synthByNote = new Map();
const MAX_SYNTH_VOICES = 14;

function getSynthContext() {
  if (!synthContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("Web Audio unsupported in this browser");
    synthContext = new AudioContextClass();
    synthMaster = synthContext.createGain();
    synthMaster.gain.value = masterVolume;
    const compressor = synthContext.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 14;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.16;
    synthMaster.connect(compressor);
    compressor.connect(synthContext.destination);

    // Quiet feed-forward room delay, with NO feedback loop.
    const input = synthContext.createGain();
    const delay = synthContext.createDelay(0.5);
    const lowpass = synthContext.createBiquadFilter();
    const output = synthContext.createGain();
    delay.delayTime.value = 0.14;
    lowpass.type = "lowpass";
    lowpass.frequency.value = 2200;
    output.gain.value = 0.22;
    input.connect(delay);
    delay.connect(lowpass);
    lowpass.connect(output);
    output.connect(synthMaster);
    synthRoom = {input};
  }
  return synthContext;
}

function primeSynthForGesture() {
  try {
    const ctx = getSynthContext();

    // iOS WebKit can report either "suspended" or "interrupted".
    // Call resume() directly inside the trusted user gesture and do not
    // await it here, so we don't lose transient user activation.
    if (ctx.state === "suspended" || ctx.state === "interrupted") {
      const resumePromise = ctx.resume();
      if (resumePromise && typeof resumePromise.catch === "function") {
        resumePromise.catch((error) => {
          console.warn("Synth AudioContext resume failed:", error);
        });
      }
    }

    // Start an inaudible one-shot oscillator in the SAME gesture.
    // This "warms" the output path on iOS without producing a sound.
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.00001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.015);

    osc.addEventListener("ended", () => {
      try { osc.disconnect(); } catch (_) {}
      try { gain.disconnect(); } catch (_) {}
    }, { once: true });

    return ctx;
  } catch (error) {
    console.warn("Synth audio prime failed:", error);
    return null;
  }
}

function releaseSynthVoice(voice, fade = 0.055) {
  if (!voice || voice.released) return;
  voice.released = true;
  const ctx = synthContext;
  if (!ctx) return;
  const t = ctx.currentTime;
  voice.amp.gain.cancelScheduledValues(t);
  voice.amp.gain.setTargetAtTime(0, t, Math.max(0.008, fade / 3));
  voice.oscillators.forEach(o => {
    try { o.stop(t + Math.max(0.065, fade * 4)); } catch (_) {}
  });
  if (synthByNote.get(voice.note) === voice) synthByNote.delete(voice.note);
}

function releaseSynthNote(note) {
  if (!sustainEnabled) releaseSynthVoice(synthByNote.get(note));
}

function releaseAllSynthVoices() {
  for (const voice of [...activeSynthVoices]) releaseSynthVoice(voice, 0.012);
}

function playSynthesizedNote(note) {
  const ctx = getSynthContext();

  // iPhone/iPad WebKit may leave Web Audio suspended/interrupted even after
  // a page has been interacted with. Resume first, then retry this note.
  if (ctx.state === "suspended" || ctx.state === "interrupted") {
    const resumePromise = ctx.resume();
    if (resumePromise && typeof resumePromise.then === "function") {
      resumePromise
        .then(() => {
          if (ctx.state === "running") playSynthesizedNote(note);
        })
        .catch((error) => {
          console.warn("Could not resume synth for note:", error);
          soundStatusDisplay.textContent = "Tap the piano again to enable synth audio";
        });
    }
    return;
  }

  const midi = noteToMidi(note);
  if (midi === null) return;
  const frequency = 440 * Math.pow(2, (midi - 69) / 12);
  const now = ctx.currentTime;
  const mode = currentSoundMode;
  if (synthByNote.has(note)) releaseSynthVoice(synthByNote.get(note), 0.012);
  if (activeSynthVoices.size >= MAX_SYNTH_VOICES) {
    releaseSynthVoice(activeSynthVoices.values().next().value, 0.015);
  }

  const amp = ctx.createGain();
  const tone = ctx.createBiquadFilter();
  const voiceOut = ctx.createGain();
  const oscillators = [];
  const nodes = [amp, tone, voiceOut];
  const voice = {note, amp, oscillators, nodes, released:false};
  activeSynthVoices.add(voice);
  synthByNote.set(note, voice);

  const config = {
    electric: {attack:0.008, decay:0.65, level:0.18, cutoff:6200, hold:0.09, tail:0.48, room:0.12},
    organ: {attack:0.013, decay:0.06, level:0.13, cutoff:6100, hold:1.15, tail:0.10, room:0.07},
    lead: {attack:0.012, decay:0.16, level:0.14, cutoff:3900, hold:0.40, tail:0.20, room:0.07},
    arcade: {attack:0.004, decay:0.09, level:0.12, cutoff:7200, hold:0.12, tail:0.10, room:0},
    musicbox: {attack:0.003, decay:0.95, level:0.17, cutoff:9500, hold:0.02, tail:0.35, room:0.08},
    vibes: {attack:0.006, decay:1.02, level:0.16, cutoff:7500, hold:0.07, tail:0.40, room:0.12},
    celesta: {attack:0.003, decay:1.25, level:0.14, cutoff:10500, hold:0.02, tail:0.55, room:0.11},
    clavinet: {attack:0.002, decay:0.27, level:0.13, cutoff:5400, hold:0.045, tail:0.12, room:0.015}
  }[mode] || {attack:0.01, decay:0.25, level:0.12, cutoff:7000, hold:0.20, tail:0.20, room:0};

  tone.type = "lowpass";
  tone.frequency.setValueAtTime(config.cutoff,now);
  tone.Q.value = mode === 'lead' ? 1.1 : 0.45;
  tone.connect(amp);
  amp.connect(voiceOut);
  voiceOut.gain.value = config.level;
  voiceOut.connect(synthMaster);
  if(config.room) {
    const send=ctx.createGain();send.gain.value=config.room;
    voiceOut.connect(send); send.connect(synthRoom.input); nodes.push(send);
  }

  const peak = 0.95;
  amp.gain.setValueAtTime(0.0001,now);
  amp.gain.exponentialRampToValueAtTime(peak,now+config.attack);
  amp.gain.exponentialRampToValueAtTime(0.22,now+config.attack+config.decay);
  const finish=now+config.attack+config.decay+config.hold;
  amp.gain.setValueAtTime(0.22,finish);
  amp.gain.exponentialRampToValueAtTime(0.0001,finish+config.tail);

  function add(type,ratio,level,detune=0,decay=null) {
    const o=ctx.createOscillator(); const g=ctx.createGain();
    o.type=type; o.frequency.value=frequency*ratio; o.detune.value=detune;
    g.gain.setValueAtTime(level,now);
    if(decay) g.gain.exponentialRampToValueAtTime(Math.max(0.0001,level*0.005),now+decay);
    o.connect(g); g.connect(tone); o.start(now);
    o.stop(finish+config.tail+0.06);
    oscillators.push(o);nodes.push(g);
    return o;
  }
  if(mode==='electric') {
    add('sine',1,0.68);add('sine',2,0.16,0,0.48);add('sine',3,0.09,0,0.32);
    // A quickly-decaying FM strike adds the characteristic electric-piano tine.
    const carrier=ctx.createOscillator(),mod=ctx.createOscillator();
    const depth=ctx.createGain(),strike=ctx.createGain();
    carrier.type='sine';carrier.frequency.value=frequency;
    mod.frequency.value=frequency*7;depth.gain.setValueAtTime(frequency*0.8,now);
    depth.gain.exponentialRampToValueAtTime(0.1,now+0.32);
    mod.connect(depth);depth.connect(carrier.frequency);
    strike.gain.setValueAtTime(0.22,now);strike.gain.exponentialRampToValueAtTime(0.0001,now+0.38);
    carrier.connect(strike);strike.connect(tone);
    mod.start(now);carrier.start(now);mod.stop(finish+config.tail);carrier.stop(finish+config.tail);
    oscillators.push(carrier,mod);nodes.push(depth,strike);
  } else if(mode==='organ') {
    [[0.5,0.14],[1,0.7],[2,0.3],[3,0.19],[4,0.08],[6,0.08]].forEach(([r,v])=>add('sine',r,v));
  } else if(mode==='lead') {
    add('sawtooth',1,0.44,-4);add('sawtooth',1,0.44,4);add('triangle',0.5,0.22);
    tone.frequency.setValueAtTime(1500,now);
    tone.frequency.exponentialRampToValueAtTime(4700,now+0.08);
    tone.frequency.exponentialRampToValueAtTime(1700,now+0.4);
  } else if(mode==='arcade') {
    add('square',1,0.62);add('triangle',0.5,0.22);
  } else if(mode==='musicbox') {
    add('sine',1,0.75);add('sine',2.01,0.19,0,0.34);
    add('sine',4.06,0.09,0,0.22);add('sine',6.25,0.04,0,0.16);
  } else if(mode==='clavinet') {
    // Clavinet: a bright, funky plucked-string timbre. Short upper partials
    // provide the percussive bite; the fundamental fades more slowly.
    add('sawtooth',1,0.38);
    add('triangle',1,0.32);
    add('sine',2,0.19,0,0.22);
    add('sine',3,0.11,0,0.13);
    add('sine',5,0.055,0,0.075);
    tone.frequency.setValueAtTime(7800,now);
    tone.frequency.exponentialRampToValueAtTime(1900,now+0.21);
  } else if(mode==='celesta') {
    // Bell-like celesta: pure fundamental plus slightly inharmonic upper partials.
    // The higher partials disappear faster, leaving a soft, sustained chime.
    add('sine',1,0.72);
    add('sine',2.01,0.20,0,0.65);
    add('sine',3.92,0.11,0,0.36);
    add('sine',5.43,0.055,0,0.21);
    add('sine',7.15,0.025,0,0.13);
  } else if(mode==='vibes') {
    add('sine',1,0.76);add('sine',3.99,0.18,0,0.65);add('sine',9.2,0.04,0,0.31);
    const trem=ctx.createOscillator();const depth=ctx.createGain();
    trem.frequency.value=5.7;depth.gain.value=0.12;
    // Small pitch vibrato avoids abrupt volume transients.
    trem.connect(depth);oscillators.slice(0,3).forEach(o=>depth.connect(o.detune));
    trem.start(now);trem.stop(finish+config.tail);oscillators.push(trem);nodes.push(depth);
  }

  let remaining=oscillators.length;
  for(const o of oscillators) {
    o.addEventListener('ended',()=>{
      remaining--;
      if(remaining!==0)return;
      activeSynthVoices.delete(voice);
      if(synthByNote.get(note)===voice)synthByNote.delete(note);
      oscillators.forEach(x=>{try{x.disconnect()}catch(_){}});
      nodes.forEach(x=>{try{x.disconnect()}catch(_){}});
    },{once:true});
  }
}

function playNote(note) {
  const keyEl = document.querySelector(`.key[data-note="${cssEscape(note)}"]`);
  if (keyEl) keyEl.classList.add("active");
  lastNoteDisplay.textContent = note;
  triggerHeroGlow();
  recordNoteEvent(note);

  if (currentSoundMode !== "classic") {
    try {
      playSynthesizedNote(note);
      soundStatusDisplay.textContent = `Playing ${note} • ${soundModeSelect?.selectedOptions?.[0]?.textContent || currentSoundMode}`;
    } catch (error) {
      console.error(error);
      soundStatusDisplay.textContent = `Synth error: ${error.message}`;
    }
    if (!sustainEnabled) setTimeout(() => {
      if (activePointerNote !== note && activeKeyboardVisualNote !== note) releaseNoteVisual(note);
    }, 280);
    return;
  }

  // The original, proven working playback path for all 88 on-chain samples.
  const url = NOTE_URLS[note];
  if (!url) {
    soundStatusDisplay.textContent = `${note} is unassigned`;
    if (!sustainEnabled) setTimeout(() => releaseNoteVisual(note), 110);
    return;
  }
  const baseAudio = primeAudio(note);
  if (!baseAudio) return;
  try {
    if (activeAudioByNote[note]) {
      activeAudioByNote[note].pause();
      activeAudioByNote[note].currentTime = 0;
    }
    const audio = baseAudio.cloneNode(true);
    audio.currentTime = 0;
    audio.volume = masterVolume;
    activeAudioByNote[note] = audio;
    const promise = audio.play();
    if (promise) promise.then(() => {
      soundStatusDisplay.textContent = `Playing ${note}`;
    }).catch((error) => {
      console.warn("Classic note playback:", error);
      soundStatusDisplay.textContent = `Playback blocked for ${note}`;
    });
    audio.addEventListener("ended", () => {
      if (activeAudioByNote[note] === audio) delete activeAudioByNote[note];
      if (!sustainEnabled && activePointerNote !== note && activeKeyboardVisualNote !== note) releaseNoteVisual(note);
    });
  } catch (error) {
    console.error(error);
    soundStatusDisplay.textContent = `Error playing ${note}`;
  }
}
function releaseNoteVisual(note) {
  if (!note) return;
  const keyEl = document.querySelector(`.key[data-note="${cssEscape(note)}"]`);
  if (!keyEl) return;
  keyEl.classList.remove("active");
}

function releaseAllKeyVisuals() {
  document.querySelectorAll(".key.active").forEach((key) => key.classList.remove("active"));
}

function stopAllActiveAudio() {
  Object.values(activeAudioByNote).forEach((audio) => {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (e) {}
  });
  activeAudioByNote = {};
  releaseAllSynthVoices();
}

function refreshUnmappedStates() {
  const keys = document.querySelectorAll(".key");
  keys.forEach((key) => {
    const note = key.dataset.note;
    if (NOTE_URLS[note]) key.classList.remove("unmapped");
    else key.classList.add("unmapped");
  });
  updateMappingPreview();
}

function populateRangeSelect() {
  rangeSelect.innerHTML = "";
  Object.entries(RANGE_PRESETS).forEach(([key, preset]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = preset.label;
    rangeSelect.appendChild(option);
  });
  rangeSelect.value = currentRangeKey;
}

function populateNoteSelect() {
  noteSelect.innerHTML = "";
  ALL_NOTES.forEach((note) => {
    const option = document.createElement("option");
    option.value = note;
    option.textContent = note;
    noteSelect.appendChild(option);
  });
}

function updateMappingPreview() {
  const ordered = {};
  ALL_NOTES.forEach((note) => {
    ordered[note] = NOTE_URLS[note] || "";
  });
  mappingPreview.value = `const NOTE_URLS = ${JSON.stringify(ordered, null, 2)};`;
}

function formatSequencePreview(sequence) {
  if (!sequence.length) return "[]";
  return JSON.stringify(sequence.slice(0, 8), null, 2) + (sequence.length > 8 ? "\n..." : "");
}

function updateSequencePreview() {
  sequencePreviewMini.textContent = formatSequencePreview(currentSequence);
}

function decodeSequenceToCipherText(sequence) {
  return sequence.map((event) => NOTE_TO_CIPHER[event.note] || "").join("");
}

function updateCipherTextDisplay() {
  if (!cipherModeEnabled) {
    cipherTextPreviewMini.textContent = "Cipher Mode Off";
    cipherTextPreviewMini.classList.add("preview-box-empty");
    return;
  }

  const text = decodeSequenceToCipherText(currentSequence);
  if (!text) {
    cipherTextPreviewMini.textContent = "No cipher text yet.";
    cipherTextPreviewMini.classList.add("preview-box-empty");
    return;
  }

  cipherTextPreviewMini.textContent = text;
  cipherTextPreviewMini.classList.remove("preview-box-empty");
}

function loadSelectedMapping() {
  const note = noteSelect.value;
  noteUrlInput.value = NOTE_URLS[note] || "";
  soundStatusDisplay.textContent = `Loaded mapping for ${note}`;
}

function saveSelectedMapping() {
  const note = noteSelect.value;
  const url = noteUrlInput.value.trim();

  NOTE_URLS[note] = url;
  if (url) primeAudio(note);
  else delete audioCache[note];

  refreshUnmappedStates();
  soundStatusDisplay.textContent = url ? `Saved mapping for ${note}` : `Cleared mapping for ${note}`;
}

function clearSelectedMapping() {
  const note = noteSelect.value;
  NOTE_URLS[note] = "";
  noteUrlInput.value = "";
  delete audioCache[note];
  refreshUnmappedStates();
  soundStatusDisplay.textContent = `Cleared ${note}`;
}

function toggleLabels() {
  labelsVisible = !labelsVisible;
  pianoWrapperEl.classList.toggle("hidden-labels", !labelsVisible);
  toggleLabelsBtn.textContent = labelsVisible ? "Hide Note Labels" : "Show Note Labels";
  toggleLabelsBtn.classList.toggle("active", labelsVisible);
  saveSettings();
}

function toggleCipherMode() {
  cipherModeEnabled = !cipherModeEnabled;
  toggleCipherBtn.textContent = cipherModeEnabled ? "Cipher Mode On" : "Cipher Mode Off";
  toggleCipherBtn.classList.toggle("active", cipherModeEnabled);
  pianoWrapperEl.classList.toggle("cipher-mode-on", cipherModeEnabled);
  updateCipherTextDisplay();
  saveSettings();
}

function toggleMappingPanel() {
  mappingPanel.classList.toggle("hidden");
  const isOpen = !mappingPanel.classList.contains("hidden");
  toggleMappingBtn.textContent = isOpen ? "Hide Mapping Panel" : "Show Mapping Panel";
  toggleMappingBtn.classList.toggle("active", isOpen);
}

function toggleSustain() {
  sustainEnabled = !sustainEnabled;
  sustainBtn.textContent = sustainEnabled ? "Sustain On" : "Sustain Off";
  sustainBtn.classList.toggle("active", sustainEnabled);
  if (!sustainEnabled) releaseAllKeyVisuals();
  saveSettings();
}

function updateVolume() {
  masterVolume = parseFloat(volumeSlider.value);
  volumeValue.textContent = `${Math.round(masterVolume * 100)}%`;
  if (synthMaster && synthContext) synthMaster.gain.setTargetAtTime(masterVolume, synthContext.currentTime, 0.015);
  saveSettings();
}

function getVisibleKeyboardMap() {
  const visibleNotes = getNotesForRange(currentRangeKey);
  const keyboardKeys = [
    "a","w","s","e","d","f","t","g","y","h","u","j",
    "k","o","l","p",";","'","[","]","\\",
    "z","x","c","v","b","n","m",",",".","/"
  ];

  const map = {};
  visibleNotes.slice(0, keyboardKeys.length).forEach((note, index) => {
    map[keyboardKeys[index]] = note;
  });
  return map;
}

function stepKeyboardCursor(direction) {
  const visibleNotes = getNotesForRange(currentRangeKey);
  if (!visibleNotes.length) return;

  let index = visibleNotes.indexOf(keyboardCursorNote);
  if (index === -1) index = 0;

  index += direction;
  if (index < 0) index = 0;
  if (index > visibleNotes.length - 1) index = visibleNotes.length - 1;

  const nextNote = visibleNotes[index];

  if (!sustainEnabled && activeKeyboardVisualNote && activeKeyboardVisualNote !== nextNote) {
    releaseSynthNote(activeKeyboardVisualNote);
    releaseNoteVisual(activeKeyboardVisualNote);
  }

  keyboardCursorNote = nextNote;
  activeKeyboardVisualNote = nextNote;
  playNote(nextNote);
  scrollNoteIntoView(nextNote);
}

function scrollNoteIntoView(note) {
  const keyEl = document.querySelector(`.key[data-note="${cssEscape(note)}"]`);
  if (!keyEl) return;

  const wrapperRect = pianoWrapperEl.getBoundingClientRect();
  const keyRect = keyEl.getBoundingClientRect();

  if (keyRect.left < wrapperRect.left + 20) {
    pianoWrapperEl.scrollLeft -= (wrapperRect.left - keyRect.left) + 40;
  } else if (keyRect.right > wrapperRect.right - 20) {
    pianoWrapperEl.scrollLeft += (keyRect.right - wrapperRect.right) + 40;
  }
}

function startRecording() {
  currentSequence = [];
  recordStartTime = performance.now();
  isRecording = true;
  isSequencePlaying = false;
  clearPlaybackTimeouts();
  recordingStatusDisplay.textContent = "Recording...";
  recordBtn.classList.add("active");
  soundStatusDisplay.textContent = "Recording started";
  updateSequencePreview();
  updateCipherTextDisplay();
  saveDraftSequence();
}

function stopRecording() {
  isRecording = false;
  recordBtn.classList.remove("active");
  recordingStatusDisplay.textContent = "Stopped";
  soundStatusDisplay.textContent = "Recording stopped";
  saveDraftSequence();
}

function clearSequence() {
  currentSequence = [];
  isRecording = false;
  isSequencePlaying = false;
  clearPlaybackTimeouts();
  stopAllActiveAudio();
  releaseAllKeyVisuals();
  recordBtn.classList.remove("active");
  recordingStatusDisplay.textContent = "Idle";
  soundStatusDisplay.textContent = "Sequence cleared";
  updateSequencePreview();
  updateCipherTextDisplay();
  saveDraftSequence();
}

function playCurrentSequence() {
  if (!currentSequence.length) {
    soundStatusDisplay.textContent = "No sequence to play";
    return;
  }

  clearPlaybackTimeouts();
  stopAllActiveAudio();
  releaseAllKeyVisuals();
  isSequencePlaying = true;
  recordingStatusDisplay.textContent = "Playing Sequence";
  soundStatusDisplay.textContent = "Sequence playback started";
  updateCipherTextDisplay();

  currentSequence.forEach((event) => {
    const timeout = setTimeout(() => {
      playNote(event.note);
      if (!sustainEnabled) {
        setTimeout(() => releaseNoteVisual(event.note), 140);
      }
    }, event.time);
    playbackTimeouts.push(timeout);
  });

  const finalTime = currentSequence[currentSequence.length - 1].time + 500;
  const endTimeout = setTimeout(() => {
    isSequencePlaying = false;
    recordingStatusDisplay.textContent = isRecording ? "Recording..." : "Idle";
    soundStatusDisplay.textContent = "Sequence playback finished";
    if (!sustainEnabled) releaseAllKeyVisuals();
  }, finalTime);
  playbackTimeouts.push(endTimeout);
}

function clearPlaybackTimeouts() {
  playbackTimeouts.forEach((timeout) => clearTimeout(timeout));
  playbackTimeouts = [];
}

function getSavedSequences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.sequences);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function persistSavedSequences() {
  localStorage.setItem(STORAGE_KEYS.sequences, JSON.stringify(savedSequences));
}

function saveSequenceLocally() {
  if (!currentSequence.length) {
    soundStatusDisplay.textContent = "No sequence to save";
    return;
  }

  const title = sequenceNameInput.value.trim() || `Sequence ${new Date().toLocaleString()}`;
  const entry = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    createdAt: new Date().toISOString(),
    events: [...currentSequence]
  };

  savedSequences.unshift(entry);
  persistSavedSequences();
  renderSavedSequences();
  setSavedSequencesPanelOpen(true);
  soundStatusDisplay.textContent = `Saved "${title}" locally`;
}

function loadSequenceById(id) {
  const found = savedSequences.find((seq) => seq.id === id);
  if (!found) return;

  currentSequence = [...found.events];
  sequenceNameInput.value = found.title;
  updateSequencePreview();
  updateCipherTextDisplay();
  saveDraftSequence();
  soundStatusDisplay.textContent = `Loaded "${found.title}"`;
}

function deleteSequenceById(id) {
  savedSequences = savedSequences.filter((seq) => seq.id !== id);
  persistSavedSequences();
  renderSavedSequences();
  soundStatusDisplay.textContent = "Deleted saved sequence";
}

function renderSavedSequences() {
  if (!savedSequences.length) {
    savedSequencesList.innerHTML = `<div class="empty-state">No saved sequences yet.</div>`;
    return;
  }

  savedSequencesList.innerHTML = "";

  savedSequences.forEach((seq) => {
    const item = document.createElement("div");
    item.className = "saved-sequence-item";

    const meta = document.createElement("div");
    meta.className = "saved-sequence-meta";

    const title = document.createElement("div");
    title.className = "saved-sequence-title";
    title.textContent = seq.title;

    const subtitle = document.createElement("div");
    subtitle.className = "saved-sequence-subtitle";
    subtitle.textContent = `${seq.events.length} note events • ${new Date(seq.createdAt).toLocaleString()}`;

    meta.appendChild(title);
    meta.appendChild(subtitle);

    const actions = document.createElement("div");
    actions.className = "saved-sequence-actions";

    const loadBtn = document.createElement("button");
    loadBtn.className = "mini-btn";
    loadBtn.textContent = "Load";
    loadBtn.addEventListener("click", () => loadSequenceById(seq.id));

    const playBtn = document.createElement("button");
    playBtn.className = "mini-btn";
    playBtn.textContent = "Play";
    playBtn.addEventListener("click", () => {
      currentSequence = [...seq.events];
      updateSequencePreview();
      updateCipherTextDisplay();
      playCurrentSequence();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "mini-btn danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteSequenceById(seq.id));

    actions.appendChild(loadBtn);
    actions.appendChild(playBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(meta);
    item.appendChild(actions);
    savedSequencesList.appendChild(item);
  });
}

function exportCurrentSequenceJson() {
  if (!currentSequence.length) {
    soundStatusDisplay.textContent = "No sequence to export";
    return;
  }

  const title = (sequenceNameInput.value.trim() || "bitcoin-piano-sequence").replace(/\s+/g, "-").toLowerCase();
  const blob = new Blob([JSON.stringify(currentSequence, null, 2)], { type: "application/json" });
  downloadBlob(blob, `${title}.json`);
  soundStatusDisplay.textContent = "Sequence JSON exported";
}

function importCurrentSequenceJson(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const validated = validateImportedSequence(parsed);

      currentSequence = validated;
      updateSequencePreview();
      updateCipherTextDisplay();
      saveDraftSequence();

      const cleanName = file.name.replace(/\.json$/i, "");
      sequenceNameInput.value = cleanName;

      soundStatusDisplay.textContent = `Imported "${file.name}"`;
      recordingStatusDisplay.textContent = "Idle";
    } catch (error) {
      console.error(error);
      soundStatusDisplay.textContent = "Invalid JSON sequence file";
    }
  };

  reader.onerror = () => {
    soundStatusDisplay.textContent = "Could not read JSON file";
  };

  reader.readAsText(file);
}

function validateImportedSequence(parsed) {
  if (!Array.isArray(parsed)) {
    throw new Error("Sequence JSON must be an array.");
  }

  const validated = parsed.map((event, index) => {
    if (!event || typeof event !== "object") {
      throw new Error(`Event ${index} is invalid.`);
    }

    const note = event.note;
    const time = Number(event.time);

    if (!ALL_NOTES.includes(note)) {
      throw new Error(`Event ${index} has invalid note: ${note}`);
    }

    if (!Number.isFinite(time) || time < 0) {
      throw new Error(`Event ${index} has invalid time.`);
    }

    return {
      note,
      time: Math.round(time)
    };
  });

  validated.sort((a, b) => a.time - b.time);
  return validated;
}

async function exportCurrentSequenceWav() {
  if (!currentSequence.length) {
    soundStatusDisplay.textContent = "No sequence to export";
    return;
  }

  try {
    soundStatusDisplay.textContent = "Rendering WAV...";
    const renderedBuffer = await renderSequenceToAudioBuffer(currentSequence);
    const wavBlob = audioBufferToWavBlob(renderedBuffer);
    const title = (sequenceNameInput.value.trim() || "bitcoin-piano-sequence").replace(/\s+/g, "-").toLowerCase();
    downloadBlob(wavBlob, `${title}.wav`);
    soundStatusDisplay.textContent = "WAV exported";
  } catch (error) {
    console.error(error);
    soundStatusDisplay.textContent = "WAV export failed";
  }
}

async function renderSequenceToAudioBuffer(sequence) {
  const validEvents = sequence.filter((event) => NOTE_URLS[event.note]);
  if (!validEvents.length) {
    throw new Error("No mapped notes available for rendering.");
  }

  const decodedMap = {};
  const fetchPromises = [...new Set(validEvents.map((event) => event.note))].map(async (note) => {
    const url = NOTE_URLS[note];
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const tempContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await tempContext.decodeAudioData(arrayBuffer.slice(0));
    await tempContext.close();
    decodedMap[note] = audioBuffer;
  });

  await Promise.all(fetchPromises);

  let totalDurationSec = 0;
  validEvents.forEach((event) => {
    const sample = decodedMap[event.note];
    const endSec = event.time / 1000 + sample.duration;
    if (endSec > totalDurationSec) totalDurationSec = endSec;
  });

  totalDurationSec += 0.5;

  const sampleRate = 44100;
  const offlineContext = new OfflineAudioContext(2, Math.ceil(totalDurationSec * sampleRate), sampleRate);

  validEvents.forEach((event) => {
    const sample = decodedMap[event.note];
    const source = offlineContext.createBufferSource();
    source.buffer = sample;

    const gainNode = offlineContext.createGain();
    gainNode.gain.value = masterVolume;

    source.connect(gainNode);
    gainNode.connect(offlineContext.destination);
    source.start(event.time / 1000);
  });

  return await offlineContext.startRendering();
}

function audioBufferToWavBlob(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;

  const channelData = [];
  for (let channel = 0; channel < numChannels; channel++) {
    channelData.push(buffer.getChannelData(channel));
  }

  const interleaved = interleave(channelData);
  const wavBuffer = encodeWAV(interleaved, sampleRate, numChannels, bitDepth, format);

  return new Blob([wavBuffer], { type: "audio/wav" });
}

function interleave(channelData) {
  if (channelData.length === 1) return channelData[0];

  const length = channelData[0].length + channelData[1].length;
  const result = new Float32Array(length);

  let inputIndex = 0;
  let outputIndex = 0;

  while (outputIndex < length) {
    for (let channel = 0; channel < channelData.length; channel++) {
      result[outputIndex++] = channelData[channel][inputIndex];
    }
    inputIndex++;
  }

  return result;
}

function encodeWAV(samples, sampleRate, numChannels, bitDepth, format) {
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * bytesPerSample, true);

  floatTo16BitPCM(view, 44, samples);
  return buffer;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(view, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let sample = Math.max(-1, Math.min(1, input[i]));
    sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(offset, sample, true);
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function saveSettings() {
  const data = {
    labelsVisible,
    cipherModeEnabled,
    sustainEnabled,
    masterVolume,
    currentRangeKey,
    currentSoundMode
  };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(data));
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return;
    const data = JSON.parse(raw);

    labelsVisible = typeof data.labelsVisible === "boolean" ? data.labelsVisible : true;
    cipherModeEnabled = typeof data.cipherModeEnabled === "boolean" ? data.cipherModeEnabled : false;
    sustainEnabled = typeof data.sustainEnabled === "boolean" ? data.sustainEnabled : false;
    masterVolume = typeof data.masterVolume === "number" ? data.masterVolume : 0.85;
    currentRangeKey = data.currentRangeKey || "full";
    currentSoundMode = ["classic","electric","organ","lead","arcade","musicbox","vibes","celesta","clavinet"].includes(data.currentSoundMode) ? data.currentSoundMode : "classic";
  } catch (error) {
    console.error(error);
  }
}

function saveDraftSequence() {
  localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify({
    sequenceName: sequenceNameInput.value,
    events: currentSequence
  }));
}

function loadDraftSequence() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.draft);
    if (!raw) return;
    const data = JSON.parse(raw);
    currentSequence = Array.isArray(data.events) ? data.events : [];
    sequenceNameInput.value = data.sequenceName || "";
    updateSequencePreview();
    updateCipherTextDisplay();
  } catch (error) {
    console.error(error);
  }
}

function bindKeyboard() {
  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;

    if (event.key === " ") {
      event.preventDefault();
      toggleSustain();
      return;
    }

    if (cipherModeEnabled && /^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
      const note = CIPHER_TO_NOTE[event.key];
      if (!note) return;

      if (!sustainEnabled && activeKeyboardVisualNote && activeKeyboardVisualNote !== note) {
        releaseSynthNote(activeKeyboardVisualNote);
    releaseNoteVisual(activeKeyboardVisualNote);
      }

      keyboardCursorNote = note;
      activeKeyboardVisualNote = note;
      playNote(note);
      return;
    }

    if (event.repeat && event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepKeyboardCursor(-1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepKeyboardCursor(1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      stepKeyboardCursor(-12);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      stepKeyboardCursor(12);
      return;
    }

    const mappedNote = getVisibleKeyboardMap()[event.key.toLowerCase()];
    if (!mappedNote) return;

    if (!sustainEnabled && activeKeyboardVisualNote && activeKeyboardVisualNote !== mappedNote) {
      releaseSynthNote(activeKeyboardVisualNote);
    releaseNoteVisual(activeKeyboardVisualNote);
    }

    keyboardCursorNote = mappedNote;
    activeKeyboardVisualNote = mappedNote;
    playNote(mappedNote);
  });

  document.addEventListener("keyup", (event) => {
    const key = event.key;

    if (
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === " "
    ) {
      return;
    }

    if (cipherModeEnabled && /^[a-zA-Z]$/.test(event.key)) {
      const note = CIPHER_TO_NOTE[event.key];
      if (!note) return;

      if (!sustainEnabled && activeKeyboardVisualNote === note) {
        releaseSynthNote(note);
        releaseNoteVisual(note);
        activeKeyboardVisualNote = null;
      }
      return;
    }

    const mappedNote = getVisibleKeyboardMap()[event.key.toLowerCase()];
    if (!mappedNote) return;

    if (!sustainEnabled && activeKeyboardVisualNote === mappedNote) {
      releaseSynthNote(mappedNote);
      releaseNoteVisual(mappedNote);
      activeKeyboardVisualNote = null;
    }
  });
}

function bindUI() {
  toggleLabelsBtn.addEventListener("click", toggleLabels);
  toggleCipherBtn.addEventListener("click", toggleCipherMode);
  toggleMappingBtn.addEventListener("click", toggleMappingPanel);
  if (toggleSavedSequencesBtn) {
    toggleSavedSequencesBtn.addEventListener("click", toggleSavedSequencesPanel);
  }

  saveMappingBtn.addEventListener("click", saveSelectedMapping);
  clearMappingBtn.addEventListener("click", clearSelectedMapping);
  loadSelectedBtn.addEventListener("click", loadSelectedMapping);

  noteSelect.addEventListener("change", loadSelectedMapping);

  rangeSelect.addEventListener("change", () => {
    buildPiano(rangeSelect.value);
    saveSettings();
  });

  sustainBtn.addEventListener("click", toggleSustain);
  volumeSlider.addEventListener("input", updateVolume);
  soundModeSelect.addEventListener("change", () => {
    releaseAllSynthVoices();
    currentSoundMode = soundModeSelect.value;

    if (currentSoundMode !== "classic") {
      primeSynthForGesture();
    }

    soundStatusDisplay.textContent = `Sound mode: ${soundModeSelect.options[soundModeSelect.selectedIndex].text}`;
    saveSettings();
  });

  recordBtn.addEventListener("click", startRecording);
  stopBtn.addEventListener("click", stopRecording);
  playSequenceBtn.addEventListener("click", playCurrentSequence);
  clearSequenceBtn.addEventListener("click", clearSequence);
  saveSequenceBtn.addEventListener("click", saveSequenceLocally);
  exportSequenceBtn.addEventListener("click", exportCurrentSequenceJson);
  exportWavBtn.addEventListener("click", exportCurrentSequenceWav);

  importSequenceBtn.addEventListener("click", () => {
    importSequenceInput.value = "";
    importSequenceInput.click();
  });

  importSequenceInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) importCurrentSequenceJson(file);
  });

  sequenceNameInput.addEventListener("input", saveDraftSequence);

  window.addEventListener("resize", debounce(() => {
    buildPiano(currentRangeKey);
  }, 120));
}

function centerScrollForRange(rangeKey) {
  if (rangeKey === "full") {
    pianoWrapperEl.scrollLeft = 0;
    return;
  }

  const firstNote = RANGE_PRESETS[rangeKey].start;
  const firstKey = document.querySelector(`.key[data-note="${cssEscape(firstNote)}"]`);
  if (!firstKey) return;

  const wrapperWidth = pianoWrapperEl.clientWidth;
  const targetLeft = firstKey.offsetLeft - (wrapperWidth * 0.15);
  pianoWrapperEl.scrollLeft = Math.max(0, targetLeft);
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value);
  }
  return value.replace(/([#.;?+*~':"!^$[\]()=>|/@])/g, "\\$1");
}

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function applyLoadedSettingsToUI() {
  pianoWrapperEl.classList.toggle("hidden-labels", !labelsVisible);
  pianoWrapperEl.classList.toggle("cipher-mode-on", cipherModeEnabled);

  toggleLabelsBtn.textContent = labelsVisible ? "Hide Note Labels" : "Show Note Labels";
  toggleLabelsBtn.classList.toggle("active", labelsVisible);

  toggleCipherBtn.textContent = cipherModeEnabled ? "Cipher Mode On" : "Cipher Mode Off";
  toggleCipherBtn.classList.toggle("active", cipherModeEnabled);

  sustainBtn.textContent = sustainEnabled ? "Sustain On" : "Sustain Off";
  sustainBtn.classList.toggle("active", sustainEnabled);

  volumeSlider.value = masterVolume;
  volumeValue.textContent = `${Math.round(masterVolume * 100)}%`;
  soundModeSelect.value = currentSoundMode;

  updateCipherTextDisplay();
}

function init() {
  loadSettings();
  savedSequences = getSavedSequences();
  populateRangeSelect();
  populateNoteSelect();
  buildPiano(currentRangeKey);
  bindKeyboard();
  bindUI();
  loadSelectedMapping();
  loadDraftSequence();
  renderSavedSequences();
  updateMappingPreview();
  updateSequencePreview();
  updateCipherTextDisplay();
  applyLoadedSettingsToUI();
  recordingStatusDisplay.textContent = "Idle";
  setSavedSequencesPanelOpen(false);
}

init();


/* =========================================================
   IOS WEB AUDIO LIFECYCLE RECOVERY
   ========================================================= */
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && synthContext) {
    // We cannot force playback without a user gesture, but we can reset the
    // status so the next tap will prime/resume the context correctly.
    if (synthContext.state === "interrupted" || synthContext.state === "suspended") {
      soundStatusDisplay.textContent = "Tap a key to resume synth audio";
    }
  }
});

window.addEventListener("pageshow", () => {
  if (synthContext && (synthContext.state === "interrupted" || synthContext.state === "suspended")) {
    soundStatusDisplay.textContent = "Tap a key to resume synth audio";
  }
});

/* =========================================================
   M88N LABS ARCADE SHELL
   ========================================================= */
(function initArcadeShell(){
  const homeScreen = document.getElementById("homeScreen");
  const workbenchScreen = document.getElementById("workbenchScreen");
  const homePlayBtn = document.getElementById("homePlayBtn");
  const gameHomeBtn = document.getElementById("gameHomeBtn");
  const overlayButtons = document.querySelectorAll("[data-overlay]");
  const overlays = document.querySelectorAll(".tool-overlay");
  const overlayCloseButtons = document.querySelectorAll(".overlay-close");

  function closeOverlays(){
    overlays.forEach((overlay) => {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden","true");
    });
  }

  function showWorkbench(){
    closeOverlays();
    homeScreen?.classList.remove("visible");
    workbenchScreen?.classList.add("visible");
    requestAnimationFrame(() => {
      buildPiano(currentRangeKey);
    });
  }

  function showHome(){
    closeOverlays();
    stopAllActiveAudio();
    homeScreen?.classList.add("visible");
    workbenchScreen?.classList.remove("visible");
  }

  function openOverlay(id){
    const overlay = document.getElementById(id);
    if(!overlay) return;
    closeOverlays();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden","false");

    if(id === "savedOverlay") {
      setSavedSequencesPanelOpen(true);
      renderSavedSequences();
    }
  }

  homePlayBtn?.addEventListener("pointerdown", () => {
    // Unlock the Web Audio path on the very first explicit app interaction.
    primeSynthForGesture();
  });
  homePlayBtn?.addEventListener("click", showWorkbench);
  gameHomeBtn?.addEventListener("click", showHome);

  overlayButtons.forEach((button) => {
    button.addEventListener("click", () => openOverlay(button.dataset.overlay));
  });

  overlayCloseButtons.forEach((button) => {
    button.addEventListener("click", closeOverlays);
  });

  // Keep piano interactions inside the cabinet from moving the browser page.
  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if(tag === "input" || tag === "textarea" || tag === "select") return;

    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "].includes(event.key) &&
       workbenchScreen?.classList.contains("visible")) {
      event.preventDefault();
    }
  }, {passive:false});
})();


/* =========================================================
   INSTRUMENT GRID UI
   Keeps the original soundModeSelect as the source of truth.
   ========================================================= */
(function initInstrumentGrid(){
  const grid = document.getElementById("instrumentGrid");
  const activeSoundLabel = document.getElementById("activeSoundLabel");
  if (!grid || !soundModeSelect) return;

  const buttons = Array.from(grid.querySelectorAll("[data-sound-mode]"));

  function cleanSoundLabel(text) {
    return String(text || "")
      .replace(" (On-Chain)", "")
      .trim();
  }

  function syncInstrumentGrid() {
    const value = soundModeSelect.value;
    buttons.forEach((button) => {
      const active = button.dataset.soundMode === value;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (activeSoundLabel) {
      activeSoundLabel.textContent =
        cleanSoundLabel(soundModeSelect.selectedOptions?.[0]?.textContent || value);
    }
  }

  buttons.forEach((button) => {
    // pointerdown is used deliberately here: iOS is strict about Web Audio
    // being unlocked inside the original trusted gesture.
    button.addEventListener("pointerdown", () => {
      const mode = button.dataset.soundMode;
      if (mode && mode !== "classic") {
        primeSynthForGesture();
      }
    });

    button.addEventListener("click", () => {
      const mode = button.dataset.soundMode;
      if (!mode || mode === soundModeSelect.value) {
        if (mode && mode !== "classic") primeSynthForGesture();
        syncInstrumentGrid();
        return;
      }

      soundModeSelect.value = mode;
      soundModeSelect.dispatchEvent(new Event("change", { bubbles: true }));
      syncInstrumentGrid();
    });
  });

  soundModeSelect.addEventListener("change", syncInstrumentGrid);
  syncInstrumentGrid();
})();


/* =========================================================
   MOBILE / TOUCH KEYBOARD ARROW NAVIGATION
   Tap = one white key. Hold = continuous movement.
   Piano keys retain drag-across-keys glissando behavior.
   ========================================================= */
(function initPianoArrowNavigation(){
  const leftBtn = document.getElementById("pianoNavLeft");
  const rightBtn = document.getElementById("pianoNavRight");
  if (!leftBtn || !rightBtn || !pianoWrapperEl) return;

  const HOLD_DELAY = 260;

  let holdFrame = null;
  let holdDelayTimer = null;
  let holdDirection = 0;
  let holdStartedAt = 0;
  let holdActive = false;

  function maxScrollLeft() {
    return Math.max(0, pianoWrapperEl.scrollWidth - pianoWrapperEl.clientWidth);
  }

  function clampScroll(value) {
    return Math.max(0, Math.min(maxScrollLeft(), value));
  }

  function whiteKeyStep() {
    // Always use the live key width so mobile/tablet/desktop all move
    // exactly one visible white piano key per tap.
    return Math.max(1, getWhiteKeyWidth());
  }

  function tapMove(direction) {
    pianoWrapperEl.scrollTo({
      left: clampScroll(pianoWrapperEl.scrollLeft + direction * whiteKeyStep()),
      behavior: "smooth"
    });
  }

  function clearHoldDelay() {
    if (holdDelayTimer !== null) {
      clearTimeout(holdDelayTimer);
      holdDelayTimer = null;
    }
  }

  function stopHold() {
    clearHoldDelay();

    if (holdFrame !== null) {
      cancelAnimationFrame(holdFrame);
      holdFrame = null;
    }

    holdDirection = 0;
    holdActive = false;
    leftBtn.classList.remove("holding");
    rightBtn.classList.remove("holding");
  }

  function holdTick(now) {
    if (!holdActive || !holdDirection) return;

    const elapsed = now - holdStartedAt;

    // Gentle start, then gradually faster for long holds.
    const speed = elapsed > 1200 ? 9 : elapsed > 700 ? 6.5 : 4.25;
    const current = pianoWrapperEl.scrollLeft;
    const next = clampScroll(current + holdDirection * speed);

    pianoWrapperEl.scrollLeft = next;

    if (next === current || next === 0 || next === maxScrollLeft()) {
      stopHold();
      return;
    }

    holdFrame = requestAnimationFrame(holdTick);
  }

  function beginContinuousHold(direction, button) {
    holdDirection = direction;
    holdActive = true;
    holdStartedAt = performance.now();
    button.classList.add("holding");
    holdFrame = requestAnimationFrame(holdTick);
  }

  function startPress(direction, button, event) {
    event.preventDefault();
    stopHold();

    holdDirection = direction;

    try {
      button.setPointerCapture(event.pointerId);
    } catch (_) {}

    // Do not move immediately. This delay is what separates a normal
    // tap from a deliberate press-and-hold.
    holdDelayTimer = setTimeout(() => {
      holdDelayTimer = null;
      beginContinuousHold(direction, button);
    }, HOLD_DELAY);
  }

  function finishPress(direction, event) {
    event.preventDefault();

    const wasHolding = holdActive;

    // If the hold threshold was never reached, this was a tap.
    if (!wasHolding) {
      clearHoldDelay();
      tapMove(direction);
    }

    stopHold();
  }

  [
    [leftBtn, -1],
    [rightBtn, 1]
  ].forEach(([button, direction]) => {
    button.addEventListener("pointerdown", (event) => {
      startPress(direction, button, event);
    });

    button.addEventListener("pointerup", (event) => {
      finishPress(direction, event);
    });

    button.addEventListener("pointercancel", stopHold);
    button.addEventListener("lostpointercapture", stopHold);

    // Keyboard-accessible controls.
    button.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      tapMove(direction);
    });
  });

  window.addEventListener("blur", stopHold);
})();
