/*
 * Wagon scene rendering repair.
 *
 * The MVP drew each wheel at an offset inside its own Graphics object and then
 * rotated that Graphics object around (0,0). The result was an orbiting wheel.
 * The original scene also used a fixed 1400x600 coordinate system without
 * scaling the root container to the actual canvas, which clipped the ox team on
 * narrower layouts.
 *
 * This compatibility layer repairs the already-created Pixi scene without
 * touching simulation logic. It can be removed once the scene is rebuilt in a
 * dedicated renderer module.
 */

(() => {
  const BASE_W = 1400;
  const BASE_H = 600;
  const WAGON_BASE_Y = 275;
  let installed = false;
  let resizeObserver = null;

  function makeWheel(radius = 30) {
    const wheel = new PIXI.Container();

    const rim = new PIXI.Graphics()
      .circle(0, 0, radius)
      .stroke({ color: 0x3d2a1e, width: 7 });

    const spokes = new PIXI.Graphics();
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      spokes
        .moveTo(0, 0)
        .lineTo(Math.cos(angle) * (radius - 5), Math.sin(angle) * (radius - 5));
    }
    spokes.stroke({ color: 0x3d2a1e, width: 3 });

    const hub = new PIXI.Graphics().circle(0, 0, 5).fill(0x3d2a1e);
    wheel.addChild(rim, spokes, hub);
    return wheel;
  }

  function actualTravelActive() {
    return Boolean(
      state &&
      !document.querySelector('#gameScreen')?.classList.contains('hidden') &&
      !document.querySelector('#modal')?.open &&
      window.frontierAutoTravel?.active
    );
  }

  function install() {
    if (installed) return true;
    if (typeof PIXI === 'undefined' || typeof pixi === 'undefined' || !pixi || typeof scene === 'undefined' || !scene?.wagon) {
      return false;
    }

    const root = pixi.stage.children[0];
    const container = document.querySelector('#pixiScene');
    if (!root || !container || !scene.wheel1 || !scene.wheel2) return false;

    // Preserve a reference to the original ox graphic before appending the new
    // wheels. In the original scene it is the last wagon child.
    const ox = scene.wagon.children.at(-1);

    scene.wagon.removeChild(scene.wheel1);
    scene.wagon.removeChild(scene.wheel2);
    scene.wheel1.destroy();
    scene.wheel2.destroy();

    const wheel1 = makeWheel(30);
    wheel1.position.set(93, 150);
    const wheel2 = makeWheel(30);
    wheel2.position.set(215, 150);

    // Restore the original visual stacking: cover, body, axle, wheels, tongue, ox.
    scene.wagon.addChildAt(wheel1, 3);
    scene.wagon.addChildAt(wheel2, 4);
    scene.wheel1 = wheel1;
    scene.wheel2 = wheel2;
    scene.ox = ox;
    scene.root = root;

    const canonicalTuftX = scene.tufts.map((_, index) => index * 85);

    function layoutScene() {
      const width = Math.max(1, container.clientWidth || pixi.renderer.width || BASE_W);
      const height = Math.max(1, container.clientHeight || pixi.renderer.height || BASE_H);
      const scale = Math.min(width / BASE_W, height / BASE_H);
      root.scale.set(scale);
      root.position.set(
        Math.round((width - BASE_W * scale) / 2),
        Math.round((height - BASE_H * scale) / 2),
      );
    }

    layoutScene();
    resizeObserver = new ResizeObserver(layoutScene);
    resizeObserver.observe(container);

    // game.js owns the original animation ticker. Its old travel predicate was
    // simply "game visible and no modal", so it still animates when the wagon is
    // stopped. This ticker runs afterward and restores canonical positions when
    // continuous travel is inactive. During travel the original ticker remains
    // responsible for wheel rotation, parallax, bobbing and tuft movement.
    pixi.ticker.add(() => {
      if (actualTravelActive()) return;
      scene.wheel1.rotation = 0;
      scene.wheel2.rotation = 0;
      scene.wagon.y = WAGON_BASE_Y;
      scene.farHills.x = 0;
      scene.tufts.forEach((tuft, index) => {
        tuft.x = canonicalTuftX[index];
      });
    });

    scene.layoutScene = layoutScene;
    installed = true;

    window.frontierVisualFix = {
      version: '1.0',
      get installed() { return installed; },
      layoutScene,
      getSnapshot() {
        const canvas = pixi.canvas;
        const wheel1Bounds = scene.wheel1.getBounds();
        const wheel2Bounds = scene.wheel2.getBounds();
        const oxBounds = scene.ox?.getBounds?.();
        return {
          renderer: { width: pixi.renderer.width, height: pixi.renderer.height },
          canvas: { width: canvas.clientWidth, height: canvas.clientHeight },
          root: { x: root.x, y: root.y, scaleX: root.scale.x, scaleY: root.scale.y },
          wheel1: { x: wheel1Bounds.x, y: wheel1Bounds.y, width: wheel1Bounds.width, height: wheel1Bounds.height },
          wheel2: { x: wheel2Bounds.x, y: wheel2Bounds.y, width: wheel2Bounds.width, height: wheel2Bounds.height },
          ox: oxBounds ? { x: oxBounds.x, y: oxBounds.y, width: oxBounds.width, height: oxBounds.height } : null,
          traveling: actualTravelActive(),
        };
      },
    };

    return true;
  }

  function waitForScene() {
    if (install()) return;
    window.setTimeout(waitForScene, 25);
  }

  waitForScene();
})();
