"use client";

import { useState, useCallback, useMemo } from "react";
import ArtworkCard from "./ArtworkCard";

export default function ArtworkGrid({ items, interactive = false, showCreator = true }) {
  const [ratios, setRatios] = useState({});

  const handleRatio = useCallback((id, heightRatio) => {
    setRatios((prev) => {
      if (prev[id] && Math.abs(prev[id] - heightRatio) < 0.01) return prev;
      return { ...prev, [id]: heightRatio };
    });
  }, []);

  const columns = useMemo(() => {
    const cols = [[], [], [], []];
    const heights = [0, 0, 0, 0];
    const itemHeight = (item) => (ratios[item.id] ?? 1) + 0.35;

    items.forEach((item) => {
      let shortestIdx = 0;
      for (let i = 1; i < 4; i++) {
        if (heights[i] < heights[shortestIdx]) shortestIdx = i;
      }
      cols[shortestIdx].push(item);
      heights[shortestIdx] += itemHeight(item);
    });

    // Seimbangkan jika selisih kolom tertinggi dan terpendek masih besar
    for (let pass = 0; pass < 4; pass++) {
      let maxIdx = 0;
      let minIdx = 0;
      for (let i = 1; i < 4; i++) {
        if (heights[i] > heights[maxIdx]) maxIdx = i;
        if (heights[i] < heights[minIdx]) minIdx = i;
      }
      const lastItem = cols[maxIdx][cols[maxIdx].length - 1];
      if (!lastItem || cols[maxIdx].length <= 1) break;

      const h = itemHeight(lastItem);
      const currentDiff = heights[maxIdx] - heights[minIdx];
      const nextDiff = Math.abs(heights[maxIdx] - h - (heights[minIdx] + h));

      if (nextDiff < currentDiff) {
        cols[maxIdx].pop();
        cols[minIdx].push(lastItem);
        heights[maxIdx] -= h;
        heights[minIdx] += h;
      } else {
        break;
      }
    }

    return cols;
  }, [items, ratios]);

  return (
    <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map((col, idx) => (
        <ul key={idx} className="flex flex-col gap-8">
          {col.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              interactive={interactive}
              showCreator={showCreator}
              onRatio={handleRatio}
            />
          ))}
        </ul>
      ))}
    </div>
  );
}