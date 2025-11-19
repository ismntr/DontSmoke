import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks
function MapEvents({ onMapClick, isPinningMode }) {
    useMapEvents({
        click(e) {
            if (isPinningMode && onMapClick) {
                onMapClick(e.latlng);
            }
        },
    });
    return null;
}

// Component to handle map center updates
function MapController({ center }) {
    const map = useMapEvents({});
    useEffect(() => {
        if (center) {
            map.flyTo(center, 16);
        }
    }, [center, map]);
    return null;
}

const MapComponent = ({ reports, onMapClick, isPinningMode, mapCenter }) => {
    const defaultPosition = [41.0082, 28.9784]; // Istanbul

    return (
        <MapContainer
            center={defaultPosition}
            zoom={13}
            className="h-full w-full z-0"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onMapClick={onMapClick} isPinningMode={isPinningMode} />
            <MapController center={mapCenter} />
            {reports.map((report) => (
                <Marker key={report.id} position={[report.lat, report.lng]}>
                    <Popup>
                        <div className="min-w-[200px]">
                            <h3 className="font-bold text-lg mb-1">{report.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                            <div className="flex items-center justify-between mt-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${report.severity === 'High' ? 'bg-red-500' :
                                        report.severity === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                                    }`}>
                                    {report.severity}
                                </span>
                                <span className="text-xs text-gray-400">{new Date(report.timestamp).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
