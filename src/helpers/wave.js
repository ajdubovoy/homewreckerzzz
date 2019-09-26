import ADSR from 'adsr';
/*
Simple sine instrument. Returns its sound source and requires an audio context to run. Takes a duration and has simple envelope. Stops after 'dur' seconds.
Example usage:
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var sine = sine(440, 1, context); //stops after a second, always stops automatically
*/
export default function(freq, dur, peak, context, wave = 'sine') {
  const gain = context.createGain();
  const sound = context.createOscillator();
  const env = ADSR(context);

  sound.connect(gain);
  gain.connect(context.destination);
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
  
  sound.type = wave;

  sound.frequency.setValueAtTime(freq, context.currentTime);
  sound.start(context.currentTime);
  env.start(context.currentTime);
  if (dur) {
    const end = env.stop(context.currentTime + dur, true);
    sound.stop(end + 0.1);
  }
  return {
    osc: sound,
    env: env
  };
}
