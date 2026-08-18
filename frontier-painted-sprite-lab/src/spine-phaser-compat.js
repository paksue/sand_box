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
// coordinates do not match the approved NGA reproduction. ImageFile objects are
// created before LoaderPlugin.addFile(), but Phaser resolves file.url only when
// loading starts, so redirect the single hero-source file at that boundary.
const CORRECT_HERO_SOURCE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Albert_Bierstadt%2C_The_Last_of_the_Buffalo%2C_1888%2C_NGA_124525.jpg/1280px-Albert_Bierstadt%2C_The_Last_of_the_Buffalo%2C_1888%2C_NGA_124525.jpg';
const loaderProto = Phaser?.Loader?.LoaderPlugin?.prototype;
if (loaderProto?.addFile && !loaderProto.addFile.__frontierHeroWrapped) {
  const originalAddFile = loaderProto.addFile;
  const redirectHeroFile = (file) => {
    if (Array.isArray(file)) {
      file.forEach(redirectHeroFile);
    } else if (file?.key === 'hero-source' && file?.type === 'image') {
      file.url = CORRECT_HERO_SOURCE;
    }
  };
  const wrappedAddFile = function frontierAddFile(file, ...rest) {
    redirectHeroFile(file);
    return originalAddFile.call(this, file, ...rest);
  };
  wrappedAddFile.__frontierHeroWrapped = true;
  loaderProto.addFile = wrappedAddFile;
}

// Spine 4.3's official control-bones example writes bone.pose.x/y. The initial
// POC intentionally kept its motion curves engine-neutral and used x/y/rotation
// names directly. Add accessors to every Spine bone returned by a registered
// Phaser GameObject factory so those curves drive the real Spine 4.3 pose.
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

// SpinePlugin registers its GameObject factory inside the plugin constructor,
// after this shim executes. Therefore patch PluginManager.registerGameObject,
// not GameObjectFactory.prototype.spine (which does not exist yet at load time).
const pluginManagerProto = Phaser?.Plugins?.PluginManager?.prototype;
if (pluginManagerProto?.registerGameObject && !pluginManagerProto.registerGameObject.__frontierPoseWrapped) {
  const originalRegisterGameObject = pluginManagerProto.registerGameObject;
  const wrappedRegisterGameObject = function frontierRegisterGameObject(key, factoryCallback, creatorCallback) {
    const wrappedFactory = function frontierFactory(...args) {
      const gameObject = factoryCallback.apply(this, args);
      for (const bone of gameObject?.skeleton?.bones || []) adaptBonePose(bone);
      return gameObject;
    };
    return originalRegisterGameObject.call(this, key, wrappedFactory, creatorCallback);
  };
  wrappedRegisterGameObject.__frontierPoseWrapped = true;
  pluginManagerProto.registerGameObject = wrappedRegisterGameObject;
}
