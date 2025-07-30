// pages/index.tsx
import { useLoadScript } from "@react-google-maps/api";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { generateColors } from "../utils/helper";
import Loader from "../components/Loader";

// Dynamically import the Map component to prevent SSR issues
const Map = dynamic(() => import("../components/MapView"), { ssr: false });

export default function Home() {
  const [data, setData] = useState([]);
  const [materials, setMaterials] = useState<{ name: string; value: string }[]>([]);
  const [colorList, setColorList] = useState<Record<string, string>>({});
  const [showLegend, setShowLegend] = useState(false);
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-30");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places", "visualization"],
  });

  useEffect(() => {

    setSelectedCategory(materials[10]?.name || null);
    
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

  const fetchData = async (category: string | null) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://beta.pakam.ng/collector/api/v2/heatmap/transactions?startDate=${startDate}&endDate=${endDate}&state=Lagos&categoryName=${
        category ? `${encodeURIComponent(category)}` : ""}`
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
          lcda: item._id.lcd,
          user_name:item._id?.fullname,
          user_phone:item._id?.phone,
          schedule_date:item._id?.scheduleDate
        }))
      );
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
    }
    setIsLoading(false);
    setShowLegend(false)
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchData(selectedCategory);
    } 
  }, [selectedCategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  useEffect(() => {
    // fetchData(selectedCategory || null);
    fetchCatItems();
  }, []);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
<main style={{ position: "relative", height: "100vh" }}>
  { isLoading && <Loader /> }
      {/* Date Filter */}
      <div className="date-filter">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: "8px", padding: "4px" }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginRight: "8px", padding: "4px" }}
        />
        <button
          onClick={() => fetchData(selectedCategory || null)}
          style={{
            padding: "6px 12px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Filter
        </button>
      </div>

      {/* Legend Dropdown */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10, display: "flex", justifyContent: "space-between", width: "90%", gap: "10px" }}>
        <div>
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
                  onClick={() => handleCategoryClick(material)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    gap: "8px",
                    cursor: "pointer",
                    backgroundColor: selectedCategory === material ? "#f0f0f0" : "transparent",
                    border: selectedCategory === material ? "1px solid #007BFF" : "none",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: color,
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ fontSize: "12px" }}>{material}</span>
                </div>
              ))}
          </div>
        )}
      </div>
      <div>
        <span style={{backgroundColor:'white', padding: '4px 8px', border: '1px solid #000', borderRadius: '4px'}}>{selectedCategory} </span>
      </div>
        
      </div>

      {/* Map Component */}
      <div  onClick={() => setShowLegend(false)}>
        <Map center={{ lat: 6.5244, lng: 3.3792 }} zoom={12} data={data} colorList={colorList} />
      </div>

    </main>
  );
}



