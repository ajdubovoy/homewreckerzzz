import {loadClip, playClip} from "../helpers/play_file.js";

export default class {
  constructor(context) {
    this.context = context;
    this.active = [];
  }

  async play(options = {}) {
    const compressor = this.context.createDynamicsCompressor();
    const gain = this.context.createGain();
    compressor.connect(gain);
    gain.connect(this.context.destination);
    const desiredAmplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error
    gain.gain.value = desiredAmplitude;
    console.log(options);
    const buffer = await this.load(options);
    console.log(buffer);
    this.active.push(playClip(buffer, desiredAmplitude, this.context, gain));
  }

  async load(options = {}) {
    const buf = await loadClip(options.file, this.context);
    return buf;
  }

  update = (options = {}) => {
    const amplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error

    this.active.forEach((wave) => {
      wave.destination.gain.value.exponentialRampToValueAtTime(amplitude, wave.context.currentTime + 0.2);
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

  color = () => {
    return {
      h: 240 + (this.options.frequency / 128 * 360 / 4 - 45),
      s: this.options.amplitude / (128 * 2),
      l: 0.9
    };
  }
}
