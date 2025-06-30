// components/Map.tsx
import React, { useEffect, useMemo } from "react";
import { GoogleMap, HeatmapLayer, Marker } from "@react-google-maps/api";
import { generateColors } from "../utils/helper";

type MapProps = {
  center: { lat: number; lng: number };
  zoom: number;
  colorList: any;
  data: Array<{ lat: number; lng: number, material:string, address:string, weight?: number }>;
};

const containerStyle = {
  width: "100%",
  height: "600px",
};

const Map: React.FC<MapProps> = ({ center, zoom, data, colorList }) => {


  const heatmapData = useMemo(() => {
    if (typeof google === "undefined") return [];
    return data.map((location: { lat: number; lng: number }) => new google.maps.LatLng(location.lat, location.lng));
  }, [data]);
  

  console.log(colorList)

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
      {heatmapData.length > 0 && 
      // <HeatmapLayer data={heatmapData} />
      <HeatmapLayer
  data={heatmapData}
  options={{
    radius: 40, // controls size of each point
    opacity: 0.6, // transparency of the heatmap
    gradient: [
      "rgba(0, 255, 255, 0)",     // transparent cyan
      "rgba(0, 255, 255, 1)",     // cyan
      "rgba(0, 191, 255, 1)",     // deep sky blue
      "rgba(0, 127, 255, 1)",     // dodger blue
      "rgba(0, 63, 255, 1)",      // strong blue
      "rgba(0, 0, 255, 1)",       // blue
      "rgba(255, 0, 255, 1)",     // magenta
      "rgba(255, 0, 127, 1)",     // pink
      "rgba(255, 0, 63, 1)",      // hot pink
      "rgba(255, 0, 0, 1)",       // red
    ],
  }}
/>
      
      }

      {data.map((location, index) => (
        <Marker
        key={index}
          position={{ lat: location.lat, lng: location.lng }}
          title={`${location.material} - ${location.weight || 0} kg`}
          icon={{
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
            fillColor: colorList[location.material] || "#00FF00",
            fillOpacity: 1,
            strokeColor: "#000000",
            strokeWeight: 1,
            scale: 1.5,
            anchor: new google.maps.Point(12, 22), // adjust based on your path
          }}
        />

      ))}
    </GoogleMap>
  );
};

export default Map;
