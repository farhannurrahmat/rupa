"use client";

import { useEffect, useState } from "react";
import ArtworkCard from "@/components/artwork/ArtworkCard";

function getColumnCount(width) {
  if (width >= 1024) return 4;
  if (width >= 640) return 2;
  return 1;
}

export default function MasonryGrid({ items = [], interactive = false }) {
  const [cols, setCols] = useState(4);
  const [ratios, setRatios] = useState({});

  useEffect(() => {
    function handleResize() {
      setCols(getColumnCount(window.innerWidth));
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleRatio(id, ratio) {
    setRatios((prev) => (prev[id] === ratio ? prev : { ...prev, [id]: ratio }));
  }

  // Distribusikan karya dari kiri ke kanan ke kolom terpendek
  const columns = Array.from({ length: cols }, () => []);
  const heights = Array(cols).fill(0);

  items.forEach((artwork, index) => {
    // 4 item pertama selalu masuk kolom 0, 1, 2, 3 berurutan dari kiri ke kanan
    let targetCol = index % cols;
    if (index >= cols) {
      targetCol = heights.indexOf(Math.min(...heights));
    }
    columns[targetCol].push(artwork);
    heights[targetCol] += (ratios[artwork.id] || 1) + 0.35;
  });

  return (
    <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map((colItems, colIdx) => (
        <ul key={colIdx} className="flex flex-col">
          {colItems.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              interactive={interactive}
              onRatio={handleRatio}
            />
          ))}
        </ul>
      ))}
    </div>
  );
}