// use fetch to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source
export async function loadClip(url, context) {
  var buffer, data;
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error("HTTP error, status = " + response.status);
  } else {
    data = await response.arrayBuffer();
  }
  buffer = await context.decodeAudioData(data);
  return buffer;
}

export function playClip(buffer, context, destination) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(destination);
  source.start(0);
  return source;
}
