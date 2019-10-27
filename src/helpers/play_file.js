import ADSR from 'adsr';

// use fetch to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source
export async function loadClip(url, context) {
  var buffer, data;
  let response = await fetch("uploads/" + url);
  if (!response.ok) {
    throw new Error("HTTP error, status = " + response.status);
  } else {
    data = await response.arrayBuffer();
  }
  buffer = await context.decodeAudioData(data);
  return buffer;
}

export function playClip(buffer, peak, context, destination) {

  const gain = context.createGain();
  const sound = context.createBufferSource();
  sound.buffer = buffer;
  console.log(buffer);
  const env = ADSR(context);

  sound.connect(gain);
  gain.connect(destination);
  env.connect(gain.gain);
  
  const multiplier = (amt) => {
    return amt;
  }
  env.attack = multiplier(0.3);
  env.decay = multiplier(0.5);
  env.sustain = multiplier(0.8);
  env.release = multiplier(0.65);
  env.value.value = peak;

  gain.gain.value = 0;

  sound.start(context.currentTime);
  env.start(context.currentTime);

  return {
    osc: sound,
    env: env,
    gain,
    destination,
    context
  };
}
