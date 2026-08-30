import React from "react";

interface SafraLogoProps {
  dotSize?: number;
  width?: number;
  height?: number;
  fill?: string;
  className?: string;
}

export default function SafraLogo({
  dotSize = 8,
  width,
  height,
  fill = "#121816",
  className = "",
}: SafraLogoProps) {
  const actualDotSize = dotSize || (width ? Math.min(width, 10) : 8);

  return (
    <div className={`flex items-center gap-2.5 font-display font-bold tracking-tight text-ink ${className}`}>
      <span
        style={{ width: `${actualDotSize}px`, height: `${actualDotSize}px` }}
        className="rounded-full bg-signal inline-block shrink-0 animate-pulse"
      />
      <span className="text-xl tracking-tight font-bold">SAFRA</span>
    </div>
  );
}
