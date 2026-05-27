// Definición de fases (5 minutos cada una)
const phases = [
  { name: 'Presentación', description: 'Primer bloque de 5 minutos para exponer la propuesta.', duration: 300 },
  { name: 'Demostración del prototipo', description: 'Segundo bloque de 5 minutos para mostrar el funcionamiento.', duration: 300 },
  { name: 'Preguntas', description: 'Tercer bloque de 5 minutos para resolver dudas.', duration: 300 }
];

const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
const midpointSeconds = 150; // 2:30

let currentPhaseIndex = 0;
let phaseRemaining = phases[0].duration;
let totalRemaining = totalDuration;
let timer = null;
let isRunning = false;
let audioContext = null;
let audioEnabled = false;
let midpointAlertPlayed = false;
let finalAlertPlayed = false;

const ui = {
  phaseTitle: document.getElementById('phaseTitle'),
  phaseDescription: document.getElementById('phaseDescription'),
  statusBadge: document.getElementById('statusBadge'),
  statusText: document.getElementById('statusText'),
  timeDisplay: document.getElementById('timeDisplay'),
  timeLabel: document.getElementById('timeLabel'),
  stageMessage: document.getElementById('stageMessage'),
  progressMeta: document.getElementById('progressMeta'),
  progressBar: document.getElementById('progressBar'),
  alertBanner: document.getElementById('alertBanner'),
  alertText: document.getElementById('alertText'),
  finalScreen: document.getElementById('finalScreen'),
  nextBtn: document.getElementById('nextBtn')
};

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function ensureAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
  audioEnabled = !!audioContext;
}

function pulse(freq, start, duration, type = 'square', volume = 0.22) {
  if (!audioEnabled) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function playMidAlert() {
  const now = audioContext.currentTime + 0.02;
  pulse(820, now, 0.18, 'square', 0.18);
  pulse(820, now + 0.26, 0.18, 'square', 0.18);
}

function playFinalAlert() {
  const now = audioContext.currentTime + 0.02;
  pulse(220, now, 0.28, 'sawtooth', 0.25);
  pulse(220, now + 0.32, 0.28, 'sawtooth', 0.25);
  pulse(140, now + 0.68, 0.6, 'square', 0.32);
}

function currentSignalColor() {
  if (phaseRemaining > midpointSeconds) return 'green';
  if (phaseRemaining > 0) return 'yellow';
  return 'red';
}

function setBackgroundForSignal(signal) {
  let solid, soft;
  const root = document.documentElement;

  if (signal === 'green') {
    solid = getComputedStyle(root).getPropertyValue('--green').trim();
    soft  = getComputedStyle(root).getPropertyValue('--green-soft').trim();
  } else if (signal === 'yellow') {
    solid = getComputedStyle(root).getPropertyValue('--yellow').trim();
    soft  = getComputedStyle(root).getPropertyValue('--yellow-soft').trim();
  } else {
    solid = getComputedStyle(root).getPropertyValue('--red').trim();
    soft  = getComputedStyle(root).getPropertyValue('--red-soft').trim();
  }

  document.body.style.backgroundImage =
    `radial-gradient(circle at 20% 20%, ${soft} 0, transparent 55%),` +
    `radial-gradient(circle at 80% 80%, rgba(15,23,42,.18) 0, transparent 60%)`;
  document.body.style.backgroundColor = solid;
}

function updateCards() {
  phases.forEach((phase, index) => {
    const card = document.getElementById(`card-${index}`);
    const mini = document.getElementById(`mini-${index}`);

    card.classList.toggle('active', index === currentPhaseIndex && totalRemaining > 0);
    card.classList.toggle('done', index < currentPhaseIndex || (index === currentPhaseIndex && phaseRemaining <= 0));

    let pct = 0;
    if (index < currentPhaseIndex) pct = 100;
    else if (index === currentPhaseIndex) pct = ((phase.duration - Math.max(phaseRemaining, 0)) / phase.duration) * 100;
    mini.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  });
}

function setAlert(mode, text) {
  ui.alertBanner.classList.remove('warn', 'danger', 'info');
  if (mode) ui.alertBanner.classList.add(mode);
  ui.alertText.textContent = text;
}

function updateNextButtonState() {
  const disabled = currentPhaseIndex >= phases.length - 1 && phaseRemaining <= 0;
  ui.nextBtn.disabled = disabled;
  ui.nextBtn.style.opacity = disabled ? '.55' : '1';
  ui.nextBtn.style.cursor = disabled ? 'not-allowed' : 'pointer';
}

function render() {
  const phase = phases[currentPhaseIndex] || phases[phases.length - 1];
  const signal = currentSignalColor();
  setBackgroundForSignal(signal);

  const labelMap = {
    green: 'Verde · Inicio activo',
    yellow: 'Amarillo · Mitad del tiempo',
    red: 'Rojo · Tiempo finalizado'
  };
  const colorVar = {
    green: 'var(--green)',
    yellow: 'var(--yellow)',
    red: 'var(--red)'
  };

  ui.phaseTitle.textContent = phase.name;
  ui.phaseDescription.textContent = phase.description;
  ui.statusText.textContent = labelMap[signal];
  ui.statusBadge.style.color = colorVar[signal];
  ui.timeDisplay.textContent = formatTime(Math.max(phaseRemaining, 0));
  ui.timeLabel.textContent = `Bloque ${Math.min(currentPhaseIndex + 1, phases.length)} de ${phases.length}`;
  ui.progressMeta.textContent = `Tiempo total restante: ${formatTime(Math.max(totalRemaining, 0))} de 15:00.`;
  ui.progressBar.style.width = `${((totalDuration - Math.max(totalRemaining, 0)) / totalDuration) * 100}%`;

  if (signal === 'green') {
    ui.stageMessage.textContent = 'Etapa en curso. Aprovecha el inicio para organizar el mensaje principal.';
  } else if (signal === 'yellow') {
    ui.stageMessage.textContent = 'Mitad del bloque alcanzada. Conviene cerrar ideas clave y preparar el siguiente cambio.';
  } else {
    ui.stageMessage.textContent = 'Bloque finalizado. El sistema avanzará automáticamente al siguiente momento.';
  }

  updateCards();
  updateNextButtonState();
}

function finishEvent() {
  clearInterval(timer);
  isRunning = false;
  ui.timeDisplay.textContent = '00:00';
  ui.statusText.textContent = 'Secuencia completada';
  ui.phaseTitle.textContent = 'Evaluación finalizada';
  ui.phaseDescription.textContent = 'Los tres bloques terminaron.';
  ui.stageMessage.textContent = 'Puedes reiniciar para comenzar nuevamente.';
  setAlert('danger', 'Fin del evento. Se completaron presentación, demostración y preguntas.');
  ui.finalScreen.classList.add('show');
  updateCards();
  updateNextButtonState();
}

function advancePhase(manual = false) {
  currentPhaseIndex += 1;
  midpointAlertPlayed = false;
  finalAlertPlayed = false;

  if (currentPhaseIndex >= phases.length) {
    phaseRemaining = 0;
    totalRemaining = 0;
    finishEvent();
    return;
  }

  phaseRemaining = phases[currentPhaseIndex].duration;
  render();
  setAlert(
    manual ? 'info' : null,
    manual
      ? `Cambio manual realizado. Inicia el bloque ${currentPhaseIndex + 1}: ${phases[currentPhaseIndex].name}.`
      : `Inicia el bloque ${currentPhaseIndex + 1}: ${phases[currentPhaseIndex].name}.`
  );
}

function skipToNextPhase() {
  if (currentPhaseIndex >= phases.length - 1) {
    phaseRemaining = 0;
    totalRemaining = 0;
    finishEvent();
    return;
  }

  const skipped = Math.max(phaseRemaining, 0);
  totalRemaining = Math.max(0, totalRemaining - skipped);
  phaseRemaining = 0;
  playFinalAlert();
  setAlert('info', `Se cerró anticipadamente la sección actual. Cambio a: ${phases[currentPhaseIndex + 1].name}.`);
  render();
  setTimeout(() => advancePhase(true), 500);
}

function tick() {
  if (!isRunning) return;
  phaseRemaining -= 1;
  totalRemaining -= 1;

  if (!midpointAlertPlayed && phaseRemaining === midpointSeconds) {
    midpointAlertPlayed = true;
    playMidAlert();
    setAlert('warn', `Mitad del tiempo en ${phases[currentPhaseIndex].name}. Quedan 02:30.`);
  }

  if (!finalAlertPlayed && phaseRemaining === 0) {
    finalAlertPlayed = true;
    playFinalAlert();
    render();
    setAlert('danger', `Tiempo terminado en ${phases[currentPhaseIndex].name}. Cambio de bloque.`);
    setTimeout(() => advancePhase(false), 900);
    return;
  }

  render();
}

function startTimer() {
  ensureAudio();
  ui.finalScreen.classList.remove('show');
  if (isRunning) return;
  isRunning = true;
  clearInterval(timer);
  timer = setInterval(tick, 1000);
  setAlert(null, `Temporizador iniciado. Bloque activo: ${phases[currentPhaseIndex].name}.`);
  render();
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timer);
  setAlert(null, 'Temporizador pausado. El estado actual permanece visible.');
}

function resetTimer() {
  pauseTimer();
  currentPhaseIndex = 0;
  phaseRemaining = phases[0].duration;
  totalRemaining = totalDuration;
  midpointAlertPlayed = false;
  finalAlertPlayed = false;
  ui.finalScreen.classList.remove('show');
  document.body.style.backgroundColor = '#f3f4f6';
  document.body.style.backgroundImage = 'none';
  setAlert(null, 'Temporizador reiniciado. Todo vuelve al primer bloque.');
  render();
}

/* Eventos de botones */
document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
document.getElementById('nextBtn').addEventListener('click', skipToNextPhase);
document.getElementById('resetBtn').addEventListener('click', resetTimer);

/* Render inicial */
render();