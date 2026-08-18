// Narrow compatibility adapters for the Frontier hero-motion POC.
//
// Spine Phaser v4 deliberately exposes a slightly different surface from
// ordinary Phaser sprites, and Spine 4.3 stores local transforms on bone.pose.
// Keep those version details at this boundary so the animator code can remain
// readable and can later be replaced by authored Spine animation data.

const Phaser = window.Phaser;

// SpineGameObject exposes blendMode but not Phaser's fluent setBlendMode helper.
if (Phaser?.GameObjects?.GameObject && !Phaser.GameObjects.GameObject.prototype.setBlendMode) {
  Phaser.GameObjects.GameObject.prototype.setBlendMode = function setBlendMode(value) {
    this.blendMode = value;
    return this;
  };
}

// The first POC URL referenced a different photographic reproduction whose crop
// coordinates do not match the approved NGA reproduction. Redirect only the
// hero-source request to the 1280×755 NGA image used to calibrate the masks.
const CORRECT_HERO_SOURCE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Albert_Bierstadt%2C_The_Last_of_the_Buffalo%2C_1888%2C_NGA_124525.jpg/1280px-Albert_Bierstadt%2C_The_Last_of_the_Buffalo%2C_1888%2C_NGA_124525.jpg';
const loaderProto = Phaser?.Loader?.LoaderPlugin?.prototype;
if (loaderProto?.image && !loaderProto.image.__frontierHeroWrapped) {
  const originalImage = loaderProto.image;
  const wrappedImage = function frontierHeroImage(key, url, ...rest) {
    const nextUrl = key === 'hero-source' ? CORRECT_HERO_SOURCE : url;
    return originalImage.call(this, key, nextUrl, ...rest);
  };
  wrappedImage.__frontierHeroWrapped = true;
  loaderProto.image = wrappedImage;
}

// Spine 4.3's official control-bones example writes bone.pose.x/y. The initial
// POC intentionally kept its motion curves engine-neutral and used x/y/rotation
// names directly. Add accessors to each returned Spine bone so those curves now
// drive the real Spine 4.3 pose rather than creating unused JavaScript fields.
function adaptBonePose(bone) {
  if (!bone?.pose || bone.__frontierPoseAdapted) return;
  for (const prop of ['x', 'y', 'rotation', 'scaleX', 'scaleY']) {
    Object.defineProperty(bone, prop, {
      configurable: true,
      enumerable: false,
      get() { return this.pose[prop]; },
      set(value) { this.pose[prop] = value; },
    });
  }
  bone.__frontierPoseAdapted = true;
}

const factoryProto = Phaser?.GameObjects?.GameObjectFactory?.prototype;
if (factoryProto?.spine && !factoryProto.spine.__frontierPoseWrapped) {
  const originalSpine = factoryProto.spine;
  const wrappedSpine = function frontierSpineFactory(...args) {
    const gameObject = originalSpine.apply(this, args);
    for (const bone of gameObject?.skeleton?.bones || []) adaptBonePose(bone);
    return gameObject;
  };
  wrappedSpine.__frontierPoseWrapped = true;
  factoryProto.spine = wrappedSpine;
}
