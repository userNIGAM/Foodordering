// src/Components/contact/NepalMap.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, ZoomIn, ZoomOut, Navigation } from "lucide-react";

// Custom marker icon (Leaflet default icons break with Vite)
const orangeIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Helper component for zoom controls
const MapZoomControls = ({ zoomLevel, setZoomLevel }) => {
  const map = useMap();

  const handleZoomIn = () => {
    if (zoomLevel < 18) {
      map.setZoom(zoomLevel + 1);
      setZoomLevel(zoomLevel + 1);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 5) {
      map.setZoom(zoomLevel - 1);
      setZoomLevel(zoomLevel - 1);
    }
  };

  const handleReset = () => {
    map.setView([26.642, 88.002], 13);
    setZoomLevel(13);
  };

  return (
    <div className="absolute top-4 right-4 flex space-x-2 z-[1000]">
      <button
        onClick={handleZoomIn}
        disabled={zoomLevel >= 18}
        className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Zoom in"
      >
        <ZoomIn size={18} />
      </button>
      <button
        onClick={handleZoomOut}
        disabled={zoomLevel <= 5}
        className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Zoom out"
      >
        <ZoomOut size={18} />
      </button>
      <button
        onClick={handleReset}
        className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
        aria-label="Reset view"
      >
        <Navigation size={18} />
      </button>
    </div>
  );
};

const NepalMap = () => {
  const [zoomLevel, setZoomLevel] = useState(13);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 relative">
      <h3 className="text-xl font-semibold text-orange-900 mb-4">
        Our Location
      </h3>

      {/* Map */}
      <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-blue-50 h-[400px]">
        <MapContainer
          center={[26.642, 88.002]} // Birtamode, Jhapa
          zoom={zoomLevel}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />

          {/* Marker at Birtamode */}
          <Marker
            position={[26.642, 88.002]}
            icon={orangeIcon}
            eventHandlers={{
              mouseover: () => setShowInfo(true),
              mouseout: () => setShowInfo(false),
            }}
          >
            <Popup>Birtamode, Jhapa, Nepal</Popup>
          </Marker>

          {/* Custom zoom controls */}
          <MapZoomControls zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
        </MapContainer>

        {/* Floating info card like your SVG version */}
        {showInfo && (
          <div className="absolute top-16 left-16 bg-white p-4 rounded-lg shadow-lg border border-orange-200 w-64 z-[1000]">
            <div className="flex items-start">
              <MapPin
                className="text-orange-600 mt-1 mr-2 flex-shrink-0"
                size={16}
              />
              <div>
                <h4 className="font-semibold text-orange-900">
                  Birtamode, Jhapa
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Birtamode is a bustling city in the Jhapa District of Nepal,
                  known as the commercial hub of the eastern region.
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  <p>📍 Near Mechi Highway</p>
                  <p>📌 Close to the Indian border</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom location tag */}
        <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 flex items-center">
            <MapPin size={12} className="mr-1 text-orange-600" />
            <span>Birtamode, Jhapa, Nepal</span>
          </p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          We're located in the vibrant city of Birtamode, serving delicious
          meals across the region.
        </p>
      </div>
    </div>
  );
};

export default NepalMap;
