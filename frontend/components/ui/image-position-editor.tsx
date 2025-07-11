import React, { useRef } from "react";
import { Button } from "./button";

interface ImagePositionEditorProps {
  imageUrl: string;
  title?: string;
  x: number;
  y: number;
  scale: number;
  onChange: (pos: { x: number; y: number; scale: number }) => void;
  onConfirm?: () => void;
}

export const ImagePositionEditor: React.FC<ImagePositionEditorProps> = ({
  imageUrl,
  title,
  x,
  y,
  scale,
  onChange,
  onConfirm,
}) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !dragRef.current) return;
    const rect = dragRef.current.getBoundingClientRect();
    const dx = (e.clientX - last.current.x) / rect.width;
    const dy = (e.clientY - last.current.y) / rect.height;
    let nx = Math.max(0, Math.min(1, x + dx));
    let ny = Math.max(0, Math.min(1, y + dy));
    last.current = { x: e.clientX, y: e.clientY };
    onChange({ x: nx, y: ny, scale });
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };
  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ x, y, scale: Number(e.target.value) });
  };

  function getImageTransform(x: number, y: number, scale: number) {
    return {
      position: "absolute" as const,
      left: 0,
      top: 0,
      width: `360px`,
      height: `128px`,
      transform: `translate(${-x * 360 * scale + 180}px, ${-y * 128 * scale + 64}px) scale(${scale})`,
      transition: dragging.current ? "none" : "transform 0.2s cubic-bezier(.4,2,.6,1)",
      cursor: dragging.current ? "grabbing" : "grab",
      userSelect: "none" as const,
    };
  }

  return (
    <div className="w-full">
      {title && <div className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">{title}</div>}
      <div
        ref={dragRef}
        className="relative rounded-xl overflow-hidden border shadow bg-white dark:bg-gray-900 select-none"
        style={{ width: 360, height: 128 }}
      >
        <img
          src={imageUrl}
          alt="Kart Önizleme"
          style={getImageTransform(x, y, scale)}
          draggable={false}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end">
          <div className="p-3 flex justify-end">
            <Button className="bg-white/90 text-black rounded-xl px-4 py-2 font-semibold shadow border border-gray-200" disabled>
              Oku
            </Button>
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-[hsl(135,100%,50%)] text-black text-xs font-semibold px-3 py-1 rounded-full shadow">Blog</span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/80 text-gray-800 text-xs font-semibold px-2 py-1 rounded shadow">Önizleme</span>
        </div>
      </div>
      {/* Zoom slider */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <label className="text-xs">Zoom</label>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.01}
          value={scale}
          onChange={handleScaleChange}
          className="w-40"
        />
      </div>
      <div className="flex gap-2 text-xs mt-1">
        <span>X: {Math.round(x * 100)}</span>
        <span>Y: {Math.round(y * 100)}</span>
        <span>Zoom: {scale.toFixed(2)}</span>
      </div>
      {onConfirm && (
        <div className="flex justify-end mt-2">
          <Button onClick={onConfirm} size="sm" variant="default" type="button">Onayla</Button>
        </div>
      )}
    </div>
  );
}; 