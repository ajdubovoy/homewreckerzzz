import wave from '../helpers/wave.js';

export default class {
  constructor(context) {
    this.context = context;
    this.active = [];
    this.options = {};
  }

  play = (options = {}) => {
    const compressor = this.context.createDynamicsCompressor();
    const gain = this.context.createGain();
    compressor.connect(gain);
    gain.connect(this.context.destination);
    const desiredAmplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error
    gain.gain.value = desiredAmplitude;
    this.active.push(wave(options.frequency, options.sustain ? 0 : 0.2, this.context, options.waveType, gain));
    this.options = options;
    return this.active[0];
  }

  update = (options = {}) => {
    const { frequency } = options;
    const amplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error

    this.active.forEach((wave) => {
      wave.osc.frequency.exponentialRampToValueAtTime(frequency, wave.context.currentTime + 0.2);
      let curr = wave.destination.gain.value;
      wave.destination.gain.setValueAtTime(curr, wave.context.currentTime);
      wave.destination.gain.exponentialRampToValueAtTime(amplitude, wave.context.currentTime + 0.1);
    });
    this.options = options;
    return this.active[0];
  }

  kill = () => {
    var self = this;
    this.active.forEach(function(sound) {
      var end = sound.env.stop(self.context.currentTime)
      sound.osc.stop(end);
    });
    this.active = [];
  }

  color = () => {
    switch(this.options.waveType) {
      case 'sine':
        return {
          h: 240 + (this.options.frequency / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'square':
        return {
          h: 270 + (this.options.frequency / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'triangle':
        return {
          h: 50 + (this.options.frequency / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'sawtooth':
        return {
          h: 300 + (this.options.frequency / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
    }
  }
}
