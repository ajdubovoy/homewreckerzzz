import wave from '../helpers/wave.js';
import midiToFreq from '../helpers/midi_to_freq';
import freqToMidi from '../helpers/freq_to_midi';

export default class {
  constructor(context) {
    this.context = context;
    this.active = [];
    this.destination = null;
    this.options = {};
  }

  play(options = {}) {
    const frequency = parseInt(options.frequency, 10);
    const root = freqToMidi(frequency);
    const compressor = this.context.createDynamicsCompressor();
    const gain = this.context.createGain();
    this.destination = gain;
    compressor.connect(gain);
    gain.connect(this.context.destination);
    const desiredAmplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error
    gain.gain.value = desiredAmplitude;
    const chord = this[options.clusterType](root);
    this.playChord(chord, options);
    this.options = options;
    return this.active[0];
  }

  update = (options = {}) => {
    const frequency = parseInt(options.frequency, 10);
    const root = freqToMidi(frequency);
    const chord = this[options.clusterType](root);
    const amplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error

    chord.forEach((m, index) => {
      const sound  = this.active[index];
      if (sound) {
        let curr = sound.destination.gain.value;
        sound.destination.gain.exponentialRampToValueAtTime(curr, sound.context.currentTime);
        sound.destination.gain.exponentialRampToValueAtTime(amplitude, sound.context.currentTime + 0.1);
        sound.osc.frequency.exponentialRampToValueAtTime(midiToFreq(m), sound.context.currentTime + 0.2);
      } else {
        this.active.push(wave(midiToFreq(m), options.sustain ? 0 : 0.2, this.context, options.waveType, this.destination));
      }
    });
    this.options = options;
    return this.active[0];
  }

  playChord = (chord, options = {}) => {
    chord.forEach((m) => this.active.push(wave(midiToFreq(m), options.sustain ? 0 : 0.2, this.context, options.waveType, this.destination)));
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

  golden = (root) => {
    const freq = freqToMidi(root);
    const ratio = 1.61803;
    return [freq, freq * Math.pow(ratio, 1), freq * Math.pow(ratio, ratio), freq * Math.pow(ratio, 3), freq * Math.pow(ratio, 3), freq * Math.pow(ratio, 4)];
  }

  euler = (root) => {
    const freq = freqToMidi(root);
    const ratio = Math.E / 2;
    return [freq, freq * Math.pow(ratio, 1), freq * Math.pow(ratio, ratio), freq * Math.pow(ratio, 3), freq * Math.pow(ratio, 3), freq * Math.pow(ratio, 4)];
  }

  pythagoras = (root) => {
    const freq = freqToMidi(root);
    const ratio = 3/2;
    return [freq, freq * Math.pow(ratio, 1), freq * Math.pow(ratio, ratio), freq * Math.pow(ratio, 3), freq * Math.pow(ratio, 3), freq * Math.pow(ratio, 4)];
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
          h: 240 + (freqToMidi(this.options.frequency) / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'major':
        return {
          h: 270 + (freqToMidi((this.options.frequency)) / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'chromatic':
        return {
          h: 50 + (freqToMidi(this.options.frequency) / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'random':
        return {
          h: 300 + (freqToMidi(this.options.frequency) / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'golden':
        return {
          h: 50 + (freqToMidi(this.options.frequency) / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'euler':
        return {
          h: 50 + (freqToMidi(this.options.frequency) / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'pythagoras':
        return {
          h: 50 + (freqToMidi(this.options.frequency) / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
    }
  }
}
