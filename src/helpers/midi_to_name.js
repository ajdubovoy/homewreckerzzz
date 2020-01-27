export default function fromMidi (midi) {
  const CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B' ];
  const name = CHROMATIC[Math.floor(midi % 12)];
  const oct = Math.floor(midi / 12) - 1;
  return name + oct;
}
