// components/Map.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, HeatmapLayer, Marker } from "@react-google-maps/api";
import Loader from "./Loader";
import MapTooltip from "./MapToolTip";

type MapProps = {
  center: { lat: number; lng: number };
  zoom: number;
  colorList: any;
  data: Array<{ lat: number; lng: number; material: string; address: string; weight?: number, lcda?: string, user_name?:string|undefined, user_phone?:string, schedule_date:string }>;
};

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const Map: React.FC<MapProps> = ({ center, zoom, data, colorList }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<{
    lat: number;
    lng: number;
    material: string;
    weight?: number;
    address: string;
    lcda?: string;
    user_name?:string;
    user_phone?:string;
    schedule_date:string
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const heatmapData = useMemo(() => {
    if (typeof google === "undefined") return [];
    return data.map((location) => new google.maps.LatLng(location.lat, location.lng));
  }, [data]);

const handleMouseOver = (location: typeof data[0]) => {
  if (!mapRef.current) return;

  const projection = mapRef.current.getProjection?.();
  const bounds = mapRef.current.getBounds();

  if (!projection || !bounds) return;

  const point = projection.fromLatLngToPoint(new google.maps.LatLng(location.lat, location.lng));
  const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
  const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());

  if (!point || !topRight || !bottomLeft) return;

  const scale = Math.pow(2, mapRef.current.getZoom() || 0);
  const x = (point.x - bottomLeft.x) * scale;
  const y = (point.y - topRight.y) * scale;

  setTooltipPosition({ x, y });
  setHoveredMarker(location);
};


  return (
    <div style={{ position: "relative" }}>
      {!isMapLoaded && <Loader />}

<GoogleMap
  mapContainerStyle={containerStyle}
  center={center}
  zoom={zoom}
  onLoad={(map) => {
    mapRef.current = map;
  }}
  onTilesLoaded={() => setIsMapLoaded(true)} // update loaded state here
>
        {heatmapData.length > 0 && (
          <HeatmapLayer
            data={heatmapData}
            options={{
              radius: 40,
              opacity: 0.6,
              gradient: [
                "rgba(0, 255, 255, 0)",
                "rgba(0, 255, 255, 1)",
                "rgba(0, 191, 255, 1)",
                "rgba(0, 127, 255, 1)",
                "rgba(0, 63, 255, 1)",
                "rgba(0, 0, 255, 1)",
                "rgba(255, 0, 255, 1)",
                "rgba(255, 0, 127, 1)",
                "rgba(255, 0, 63, 1)",
                "rgba(255, 0, 0, 1)",
              ],
            }}
          />
        )}

        {data.map((location, index) => (
          <div key={index} style={{ position: "relative" }}>
            <Marker
              
              position={{ lat: location.lat, lng: location.lng }}
              onMouseOver={() => handleMouseOver(location)}
              onMouseOut={() => {
                setHoveredMarker(null);
                setTooltipPosition(null);
              }}
              title={`${location.material} - ${location.weight || 0} kg`}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                fillColor: colorList[location.material] || "#00FF00",
                fillOpacity: 1,
                strokeColor: "#000000",
                strokeWeight: 1,
                scale: 1.5,
                anchor: new google.maps.Point(12, 22),
              }}
            />   

            {hoveredMarker && hoveredMarker.lat === location.lat && hoveredMarker.lng === location.lng && tooltipPosition && (
              <MapTooltip
                x={tooltipPosition.x}
                y={tooltipPosition.y}
                material={location.material}
                address={location.address}
                weight={location.weight}
                lcda={location.lcda}
                user_name={location?.user_name}
                user_phone={location?.user_phone}
                schedule_date= {location.schedule_date}
              />
            )}         
          </div>

        ))}
      </GoogleMap>

    {/* {hoveredMarker && tooltipPosition && (
      <div
        className="absolute bg-white border rounded shadow-lg p-3 text-xs z-50"
        style={{
          top: tooltipPosition.y,
          left: tooltipPosition.x,
          transform: "translate(-50%, -100%)",
          pointerEvents: "none",
        }}
      >
        <div className="font-semibold">{hoveredMarker.material}</div>
        <div>{hoveredMarker.address}</div>
        <div>{hoveredMarker.weight || 0} kg</div>
      </div>
    )} */}

    </div>
  );
};

export default Map;
