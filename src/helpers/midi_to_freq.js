export default function(midinote) {
  var exp = (midinote-69)/12;
  return Math.pow(2, exp)*440;
}
