// pages/index.tsx
import { useLoadScript } from "@react-google-maps/api";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { generateColors } from "../utils/helper";

// Dynamically import the Map component to prevent SSR issues
const Map = dynamic(() => import("../components/MapView"), { ssr: false });

export default function Home() {
  const [data, setData] = useState([]);
  const [materials, setMaterials] = useState<{ name: string; value: string }[]>([]);
  const [colorList, setColorList] = useState<Record<string, string>>({});
  const [showLegend, setShowLegend] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places", "visualization"],
  });

  useEffect(() => {
    const colors = generateColors(materials.length);

    const cList = materials.reduce((acc, material, index) => {
      if (material?.name) {
        acc[material.name] = colors[index];
      }
      return acc;
    }, {} as Record<string, string>);

    setColorList(cList);
  }, [materials]);

  const fetchCatItems = async () => {
    try {
      const res = await fetch(`https://beta.pakam.ng/collector/api/v2/category/all`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await res.json();
      setMaterials(result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://beta.pakam.ng/collector/api/v2/heatmap/transactions?startDate=2025-01-01&endDate=2025-06-30&state=Lagos&minWeight=10&maxWeight=1000"
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await res.json();
      setData(
        result.data.map((item: any) => ({
          lat: item._id.lat,
          lng: item._id.long,
          material: item._id.material,
          weight: item.quantity,
          address: item._id.address,
        }))
      );
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCatItems();
  }, []);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <main style={{ position: "relative", height: "100vh" }}>
      {/* Toggleable Legend Dropdown */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <button
          onClick={() => setShowLegend((prev) => !prev)}
          style={{
            padding: "8px 12px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {showLegend ? "Hide Legend" : "Show Legend"}
        </button>

        {showLegend && Object.keys(colorList).length > 0 && (
          <div
            style={{
              marginTop: "10px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              padding: "12px",
              maxWidth: "300px",
              maxHeight: "80vh",
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {Object.entries(colorList).map(([material, color]) => (
              <div
                key={material}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    backgroundColor: color,
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></div>
                <span style={{ fontSize: "12px" }}>{material}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google Map */}
      <Map center={{ lat: 6.5244, lng: 3.3792 }} zoom={12} data={data} colorList={colorList} />
    </main>
  );
}
