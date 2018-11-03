import ENGINE from "./engine";

const SAMPLES = {};

export async function loadSample(sampleName) {
  if (SAMPLES[sampleName]) return SAMPLES[sampleName];

  let buffer = await fetch(`./samples/${sampleName}.ogg`)
    .then(r => r.arrayBuffer())
    .then(b => ENGINE.ctx.decodeAudioData(b));

  SAMPLES[sampleName] = buffer;
  return buffer;
}

window.loadSample = loadSample;
window.SAMPLES = SAMPLES;
