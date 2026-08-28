export class WebGLPathTracer {
  constructor() {
    this.samples = 0
    this.tiles = { set() {} }
    this.textureSize = { set() {} }
    this.bounces = 0
    this.renderDelay = 0
  }
  setScene() { throw new Error('Beauty mode intentionally deferred until the raster PBR art spike passes.') }
  updateCamera() {}
  reset() { this.samples = 0 }
  renderSample() { this.samples += 1 }
}
