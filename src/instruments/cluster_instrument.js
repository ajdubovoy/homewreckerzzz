import wave from '../helpers/wave.js';
import midiToFreq from '../helpers/midi_to_freq';

export default class {
  constructor(context) {
    this.context = context;
    this.active = [];
    this.compressor = null;
    this.options = {};
  }

  play(options = {}) {
    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.connect(this.context.destination);

    const chord = this[options.clusterType](parseInt(options.frequency, 10));
    this.playChord(chord, this.compressor, options);
    this.options = options;
    return this.active[0];
  }

  update = (options = {}) => {
    const chord = this[options.clusterType](parseInt(options.frequency, 10));
    const amplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error

    chord.forEach((m, index) => {
      const selectedWave = this.active[index];
      if (selectedWave) {
        selectedWave.env.value.exponentialRampToValueAtTime(amplitude, selectedWave.context.currentTime + 0.3);
        selectedWave.osc.frequency.exponentialRampToValueAtTime(midiToFreq(m), selectedWave.context.currentTime + 0.3);
      } else {
        this.active.push(wave(midiToFreq(m), options.sustain ? 0 : 0.2, amplitude, this.context, options.waveType, this.compressor));
      }
    });
    this.options = options;
    return this.active[0];
  }

  playChord = (chord, destination, options = {}) => {
    const desiredAmplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error
    chord.forEach((m) => this.active.push(wave(midiToFreq(m), options.sustain ? 0 : 0.2, desiredAmplitude, this.context, options.waveType, destination)));
  }

  major = (root) => {
    return [root, root+4, root+7];
  }

  minor = (root) => {
    return [root, root+3, root+7];
  }

  chromatic = (root) => {
    return [root, root+1, root+2, root+3, root+4, root+5];
  }

  random = (root) => {
    const randomScaleDegree = () => {
      return Math.round(Math.random() * 12) + root;
    }

    const chord = [root];

    [1, 2, 3, 4, 5, 6].forEach(() => {
      if (Math.random() >= 0.1) {
        chord.push(randomScaleDegree());
      }
    });

    return chord;
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
    switch(this.options.clusterType) {
      case 'minor':
        return {
          h: 240 + (this.options.frequency / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'major':
        return {
          h: 270 + (this.options.frequency / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'chromatic':
        return {
          h: 50 + (this.options.frequency / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'random':
        return {
          h: 300 + (this.options.frequency / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
    }
  }
}
