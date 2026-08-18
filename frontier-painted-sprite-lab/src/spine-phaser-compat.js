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

// Use the exact user-approved 316×264 painterly horse/rider crop as the rig's
// source of truth. It is embedded as text chunks so the static GitHub Pages POC
// does not depend on a remote museum reproduction having identical dimensions.
const HERO_MASTER_B64 = window.__HERO_MASTER_B64 || '';
const HERO_MASTER_DATA_URI = HERO_MASTER_B64 ? `data:image/webp;base64,${HERO_MASTER_B64}` : '';
const loaderProto = Phaser?.Loader?.LoaderPlugin?.prototype;
if (loaderProto?.addFile && !loaderProto.addFile.__frontierHeroWrapped) {
  const originalAddFile = loaderProto.addFile;
  const redirectHeroFile = (file) => {
    if (Array.isArray(file)) {
      file.forEach(redirectHeroFile);
    } else if (file?.key === 'hero-source' && file?.type === 'image' && HERO_MASTER_DATA_URI) {
      file.url = HERO_MASTER_DATA_URI;
    }
  };
  const wrappedAddFile = function frontierAddFile(file, ...rest) {
    redirectHeroFile(file);
    return originalAddFile.call(this, file, ...rest);
  };
  wrappedAddFile.__frontierHeroWrapped = true;
  loaderProto.addFile = wrappedAddFile;
}

// hero-motion.js was initially calibrated against a larger museum reproduction
// and crops (467,240,421,352) down to 316×264. When the exact approved 316×264
// master is loaded, reinterpret only that one crop operation as a full-image
// draw. Other canvas draws, including part extraction, remain untouched.
const canvasProto = window.CanvasRenderingContext2D?.prototype;
if (canvasProto?.drawImage && !canvasProto.drawImage.__frontierHeroCropWrapped) {
  const originalDrawImage = canvasProto.drawImage;
  const wrappedDrawImage = function frontierHeroDrawImage(image, ...args) {
    if (
      image?.width === 316 && image?.height === 264 &&
      args.length === 8 &&
      args[0] === 467 && args[1] === 240 && args[2] === 421 && args[3] === 352 &&
      args[6] === 316 && args[7] === 264
    ) {
      return originalDrawImage.call(this, image, 0, 0, 316, 264, args[4], args[5], args[6], args[7]);
    }
    return originalDrawImage.call(this, image, ...args);
  };
  wrappedDrawImage.__frontierHeroCropWrapped = true;
  canvasProto.drawImage = wrappedDrawImage;
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
