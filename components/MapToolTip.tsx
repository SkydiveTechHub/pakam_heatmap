// components/MapTooltip.tsx
import React from "react";

type MapTooltipProps = {
  x: number;
  y: number;
  material: string;
  address: string;
  weight?: number;
    lcda?: string;
};

const MapTooltip: React.FC<MapTooltipProps> = ({ x, y, material, address, weight, lcda }) => {
  return (
    <div
      className="absolute bg-white shadow-xl rounded-lg p-4 text-sm z-50 transition-opacity duration-200"
      style={{
        top: y,
        left: x,
        position: "absolute",
        zIndex: 1000,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        width: "300px",
        // textAlign: "center",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        color: "#333",
        // whiteSpace: "nowrap",
        // overflow: "hidden",
        transform: "translate(-50%, -100%)",
        pointerEvents: "none",
      }}
    >
      <div className="font-bold text-gray-800"><span style={{fontWeight: "bold"}}>Name:</span> {material}</div>
      <div className="text-gray-500"><span style={{fontWeight: "bold"}}>Weight:</span> {weight || 0} kg</div>
      <div className="text-gray-600"><span style={{fontWeight: "bold"}}>Address:</span> {address}</div>
      <div className="text-gray-500"><span style={{fontWeight: "bold"}}>LCDA:</span> {lcda} kg</div>
    </div>
  );
};

export default MapTooltip;
