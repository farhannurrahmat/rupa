// Mengambil warna dominan karya dari versi kecil (64 px), bukan dari file aslinya
const cache = new Map();

export function dominantRgb(src) {
  if (cache.has(src)) return cache.get(src);

  const job = new Promise((resolve) => {
    const im = new Image();
    im.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = c.height = 12;
        const x = c.getContext("2d");
        x.drawImage(im, 0, 0, 12, 12);
        const p = x.getImageData(0, 0, 12, 12).data;
        let R = 0, G = 0, B = 0, n = 0;
        for (let i = 0; i < p.length; i += 4) {
          // Warna yang lebih jenuh diberi bobot lebih besar
          const w = 1 + (Math.max(p[i], p[i + 1], p[i + 2]) - Math.min(p[i], p[i + 1], p[i + 2])) / 64;
          R += p[i] * w; G += p[i + 1] * w; B += p[i + 2] * w; n += w;
        }
        resolve([R / n, G / n, B / n].map(Math.round).join(" "));
      } catch {
        resolve(null);
      }
    };
    im.onerror = () => resolve(null);
    im.src = `/_next/image?url=${encodeURIComponent(src)}&w=64&q=75`;
  });

  cache.set(src, job);
  return job;
}