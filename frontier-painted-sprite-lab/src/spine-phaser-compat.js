// SpineGameObject in spine-phaser-v4 exposes a `blendMode` property but does not
// mix in Phaser's BlendMode component / setBlendMode() helper. The hero-motion
// POC uses the normal Phaser fluent API, so provide only that missing helper at
// the shared GameObject level. Ordinary Phaser objects already override it.
if (window.Phaser?.GameObjects?.GameObject && !window.Phaser.GameObjects.GameObject.prototype.setBlendMode) {
  window.Phaser.GameObjects.GameObject.prototype.setBlendMode = function setBlendMode(value) {
    this.blendMode = value;
    return this;
  };
}
