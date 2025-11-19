import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, List, MapPin } from 'lucide-react';

const Sidebar = ({ reports, onReportClick }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`absolute top-1/2 transform -translate-y-1/2 z-[1000] bg-white p-2 shadow-md rounded-r-lg border-y border-r border-gray-200 transition-all duration-300 ${isOpen ? 'left-80' : 'left-0'
                    }`}
                aria-label="Toggle Sidebar"
            >
                {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            {/* Sidebar Content */}
            <div
                className={`absolute top-0 left-0 h-full bg-white z-[999] shadow-2xl transition-all duration-300 flex flex-col ${isOpen ? 'w-80 translate-x-0' : 'w-80 -translate-x-full'
                    }`}
            >
                <div className="p-4 border-b border-gray-100 bg-teal-50">
                    <h2 className="text-xl font-bold text-teal-800 flex items-center gap-2">
                        <List size={20} />
                        Recent Reports
                    </h2>
                    <p className="text-xs text-teal-600 mt-1">{reports.length} incidents reported</p>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {reports.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10 p-4">
                            <p>No reports yet.</p>
                            <p className="text-sm">Be the first to report an incident!</p>
                        </div>
                    ) : (
                        reports.slice().reverse().map((report) => (
                            <div
                                key={report.id}
                                onClick={() => onReportClick(report)}
                                className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 cursor-pointer transition-all group"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-1">
                                        {report.title}
                                    </h3>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${report.severity === 'High' ? 'bg-red-100 text-red-700' :
                                            report.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {report.severity}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{report.description}</p>
                                <div className="flex items-center text-[10px] text-gray-400 gap-1">
                                    <MapPin size={10} />
                                    <span>{report.lat.toFixed(4)}, {report.lng.toFixed(4)}</span>
                                    <span className="mx-1">•</span>
                                    <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-3 border-t border-gray-100 text-center text-xs text-gray-400">
                    Clean Air Map &copy; 2025
                </div>
            </div>
        </>
    );
};

export default Sidebar;
