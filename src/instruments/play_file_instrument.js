import {loadClip, playClip} from "../helpers/play_file.js";

export default class {
  constructor(context) {
    this.context = context;
    this.active = [];
    this.buffers = [];
  }

  play(options = {}) {
    const compressor = this.context.createDynamicsCompressor();
    compressor.connect(this.context.destination);
    this.active.push(playClip(this.buffers[options.index], this.context, compressor));
  }

  async load(options = {}) {
    const buf = await loadClip(options.file, this.context);
    this.buffers.push(buf);
  }

  kill = () => {
    var self = this;
    this.active.forEach(function(sound) {
      sound.stop(end);
    });
    this.active = [];
  }
}