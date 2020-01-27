export default function(frequency) {
  // I hope this math is right ;)
  return 12 * Math.log2(frequency / 440) + 69
}
