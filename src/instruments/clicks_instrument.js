import ADSR from 'adsr';
import freqToMidi from '../helpers/freq_to_midi';

export default class {
  constructor(context) {
    this.context = context;
    this.active = null;
    this.options = {};
    this.intervals = [505, 410, 333, 255];
  }

  play = (options = {}) => {
    const amplitude = options.amplitude / 128 || 0.000001; // Convert from MIDI standard and prevent 0 value error
    const frequency = options.frequency;
    const wave = options.waveType;

    const compressor = this.context.createDynamicsCompressor();
    compressor.connect(this.context.destination);

    this.active = setInterval(() => {
      this.randMetro(options.density, frequency, 0.2, wave, amplitude, compressor);
    }, 1000);

    this.options = options;
  }

  update = (options = {}) => {
    this.kill();
    this.play(options);
  }

  kill = () => {
    clearInterval(this.active);
  }

  color = () => {
    switch(this.options.waveType) {
      case 'sine':
        return {
          h: 240 + (freqToMidi(this.options.frequency) / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'square':
        return {
          h: 270 + (freqToMidi(this.options.frequency) / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'triangle':
        return {
          h: 50 + (freqToMidi(this.options.frequency) / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
      case 'sawtooth':
        return {
          h: 300 + (freqToMidi(this.options.frequency) / 128 * 360 / 4 - 45),
          s: this.options.amplitude / 128,
          l: this.options.amplitude / (128 * 2)
        };
    }
  }

  randMetro = (density, pitch, dur, wave, peak, compressor) => {
    const env = ADSR(this.context);

    var gain, time;
    const oscillators = new Array(5);
    for (let i = 0; i < density; i++) {
      gain = this.context.createGain();
      time = this.context.currentTime + Math.random();
      gain.connect(compressor);
      env.connect(gain.gain);

      const multiplier = (amt) => {
        return dur ? amt * dur : amt;
      }
      env.attack = multiplier(0.3);
      env.decay = multiplier(0.5);
      env.sustain = multiplier(0.8);
      env.release = multiplier(0.65);
      env.value.value = peak;
      gain.gain.value = 0;

      for(var j = 0; j < 5; j++) {
        oscillators[j] = this.context.createOscillator();
        oscillators[j].frequency.setValueAtTime(pitch * (j+1), this.context.currentTime);
        oscillators[j].connect(gain);
        oscillators[j].start(time);
        oscillators[j].stop(time + 0.3);
        oscillators[j].type = wave;
      }
      gain.gain.setValueAtTime(0.00000001, time);
      gain.gain.linearRampToValueAtTime(peak, time + 0.02);
      gain.gain.linearRampToValueAtTime(peak, time + 0.04);
      gain.gain.linearRampToValueAtTime(0.00000001, time + 0.08);
    }
    const context = this.context;
    return oscillators.map(osc => {
      return {
        osc,
        env,
        gain,
        compressor,
        context
      }
    });
  }

  intervalCalc = (fund) => {
    const frac = fund % 1;
    var first, second;
    if(frac === 0) {
      return this.intervals[fund];
    } else {
      first = this.intervals[Math.ceil(fund-1)];
      second = this.intervals[Math.ceil(fund)];
      return first - ((first-second) * frac);
    }
  }

  density = () => {
    return this.options.density;
  }
}
