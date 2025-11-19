import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import ReportModal from './components/ReportModal';
import { Plus, MapPin } from 'lucide-react';

function App() {
  const [reports, setReports] = useState([]);
  const [isPinningMode, setIsPinningMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  // Load reports from LocalStorage on mount
  useEffect(() => {
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error("Failed to parse reports", e);
      }
    }
  }, []);

  // Save reports to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  const handleMapClick = (latlng) => {
    setTempLocation(latlng);
    setIsPinningMode(false);
    setIsModalOpen(true);
  };

  const handleReportSubmit = (reportData) => {
    const newReport = {
      id: Date.now(),
      ...reportData
    };
    setReports([...reports, newReport]);
    setIsModalOpen(false);
    setTempLocation(null);
    setMapCenter([newReport.lat, newReport.lng]); // Fly to new report
  };

  const handleReportClick = (report) => {
    setMapCenter([report.lat, report.lng]);
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden font-sans text-gray-800 flex">
      <Sidebar reports={reports} onReportClick={handleReportClick} />

      <div className="flex-1 relative h-full">
        <MapComponent
          reports={reports}
          onMapClick={handleMapClick}
          isPinningMode={isPinningMode}
          mapCenter={mapCenter}
        />

        {/* Header / Overlay (Only visible on larger screens or when sidebar is closed, but sidebar is absolute so this is fine) */}
        <div className="absolute top-4 right-4 md:left-auto md:right-4 z-[400] bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20 max-w-xs pointer-events-none">
          <h1 className="text-2xl font-bold text-teal-700 flex items-center gap-2">
            <MapPin className="fill-teal-700 text-white" />
            Clean Air Map
          </h1>
          <p className="text-sm text-gray-500 mt-1">Report smoke violations and reclaim fresh air.</p>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => {
            setIsPinningMode(!isPinningMode);
            if (isPinningMode) setTempLocation(null);
          }}
          className={`absolute bottom-8 right-8 z-[400] px-6 py-4 rounded-full shadow-xl transition-all transform hover:scale-105 flex items-center gap-3 font-bold text-lg ${isPinningMode
              ? 'bg-gray-700 text-white hover:bg-gray-800'
              : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
        >
          {isPinningMode ? (
            <>Cancel</>
          ) : (
            <>
              <Plus size={24} />
              <span>Duman Bildir</span>
            </>
          )}
        </button>

        {/* Pinning Mode Instruction */}
        {isPinningMode && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-[400] bg-teal-600 text-white px-6 py-3 rounded-full shadow-xl animate-bounce flex items-center gap-2 pointer-events-none">
            <MapPin size={20} />
            <span className="font-medium">Tap on the map to pin location</span>
          </div>
        )}

        <ReportModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTempLocation(null);
          }}
          onSubmit={handleReportSubmit}
          location={tempLocation}
        />
      </div>
    </div>
  );
}

export default App;
