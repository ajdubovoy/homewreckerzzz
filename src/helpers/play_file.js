// use fetch to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source
export default function loadClip(url, context) {
  var source = context.createBufferSource();

  return fetch(url)
  .then(function(response) {
    if (!response.ok) {
      throw new Error("HTTP error, status = " + response.status);
    }
    return response.arrayBuffer();
  })
  .then(function(buffer) {
    context.decodeAudioData(buffer, function(decodedData) {
      source.buffer = decodedData;
      source.connect(context.destination);
      source.start(0);
    });
  });
}
