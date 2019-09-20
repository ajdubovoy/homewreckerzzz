import ADSR from 'adsr';
/*
Simple sine instrument. Returns its sound source and requires an audio context to run.
Example usage:
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var sine = sineSustain(440, context);
    sine.stop(context.currentTime + 1); //stops after a second, always manually stopped
*/
export function sineSustain(freq, peak, context) {
    var gain = context.createGain();
    var sound = context.createOscillator();
    sound.connect(gain);
    gain.connect(context.destination);
    gain.gain.value = peak;
    sound.frequency.setValueAtTime(freq, context.currentTime);
    sound.start(0);
    return sound;
}

/*
Simple sine instrument. Returns its sound source and requires an audio context to run. Takes a duration and has simple envelope. Stops after 'dur' seconds.
Example usage:
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var sine = sine(440, 1, context); //stops after a second, always stops automatically
*/
export function sineDoop(freq, dur, peak, context) {
    var gain = context.createGain();
    var sound = context.createOscillator();
    var env = ADSR(context);

    sound.connect(gain);
    gain.connect(context.destination);
    env.connect(gain.gain);
    
    env.attack = 0.3*dur;
    env.decay = 0.05*dur;
    env.sustain = 0.8;
    env.release = 0.65*dur;
    env.value.value = peak;

    gain.gain.value = 0;
    
    sound.frequency.setValueAtTime(freq, context.currentTime);
    sound.start(context.currentTime);
    env.start(context.currentTime);
    var end = env.stop(context.currentTime + dur, true);
    sound.stop(end + 0.1);
    return sound;
}