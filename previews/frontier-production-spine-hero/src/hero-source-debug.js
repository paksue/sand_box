// Test-only visual diagnostic helper. It exposes the exact remote reproduction
// Phaser loaded so CI can preserve a full-source screenshot alongside the crop.
(() => {
  const timer = setInterval(() => {
    const game = window.Phaser?.GAMES?.[0];
    if (!game?.textures?.exists?.('hero-source')) return;
    const image = game.textures.get('hero-source').getSourceImage();
    if (!image?.width || !image?.height) return;
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0);
    try {
      window.__heroFullSourceDataURL = canvas.toDataURL('image/jpeg', .88);
      window.__heroFullSourceSize = [image.width, image.height];
    } catch (error) {
      window.__heroFullSourceError = String(error);
    }
    clearInterval(timer);
  }, 100);
})();
