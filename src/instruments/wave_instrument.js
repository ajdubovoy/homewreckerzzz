import wave from '../helpers/wave.js';
import midiToFreq from '../helpers/midi_to_freq';

export default class {
  constructor(context) {
    this.context = context;
    this.active = [];
  }

  play = (options = {}) => {
    const compressor = this.context.createDynamicsCompressor();
    compressor.connect(this.context.destination);

    const desiredAmplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error
    this.active.push(wave(midiToFreq(options.frequency), options.sustain ? 0 : 0.2, desiredAmplitude, this.context, options.waveType, compressor));
  }

  update = (options = {}) => {
    const frequency = midiToFreq(options.frequency);
    const amplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error

    this.active.forEach((wave) => {
      wave.osc.frequency.exponentialRampToValueAtTime(frequency, wave.context.currentTime + 0.1);
      wave.env.value.exponentialRampToValueAtTime(amplitude, wave.context.currentTime + 0.1);
    });
  }

  kill = () => {
    var self = this;
    this.active.forEach(function(sound) {
      var end = sound.env.stop(self.context.currentTime)
      sound.osc.stop(end);
    });
    this.active = [];
  }
}
