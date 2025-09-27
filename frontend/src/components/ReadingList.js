
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { PencilSquareIcon, TrashIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import EditReadingModal from "./EditReadingModal";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from 'react-router-dom';

const getOverallSum = (reading) => {
  const beforeLunch = Number(reading.beforeLunch) || 0;
  const afterLunch = Number(reading.afterLunch) || 0;
  const beforeDinner = Number(reading.beforeDinner) || 0;
  const afterDinner = Number(reading.afterDinner) || 0;
  return beforeLunch + afterLunch + beforeDinner + afterDinner;
};

export default function ReadingList({ refresh, setRefresh, role }) {
  const [readings, setReadings] =  useState([]);
  const [editingReading, setEditingReading] = useState(null);
  const token = localStorage.getItem("token");
  const [sortOption, setSortOption] = useState("date-desc");
  
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [selectedPdfDays, setSelectedPdfDays] = useState(30);

  useEffect(() => {
    if (!token) return;
    axios.get(`${process.env.REACT_APP_API_URL}/api/readings`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setReadings(res.data))
      .catch((err) => console.error(err));
  }, [refresh, token]);

  const sortedReadings = useMemo(() => {
    let sortableItems = [...readings];
    const [key, direction] = sortOption.split('-');

    sortableItems.sort((a, b) => {
      let aValue = 0;
      let bValue = 0;
      if (key === 'date') {
        aValue = new Date(a.date);
        bValue = new Date(b.date);
      } else if (key === 'overall') {
        aValue = getOverallSum(a);
        bValue = getOverallSum(b);
      } else {
        aValue = a[key] || 0;
        bValue = b[key] || 0;
      }
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sortableItems;
  }, [readings, sortOption]);

  const handleDownloadPDF = (days) => {
    setIsPdfModalOpen(false); 
    const doc = new jsPDF();
    
    const today = new Date();
    const startDate = new Date(new Date().setDate(today.getDate() - days));
    const filteredReadings = sortedReadings.filter(r => new Date(r.date) >= startDate);

    if (filteredReadings.length === 0) {
      toast.error(`No readings found in the last ${days} days.`);
      return;
    }

    
    doc.setFontSize(18);
    doc.text("Sugar Report of Shiv Prakash Singh", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    const dateRangeText = days >= 9999 ? "All Time" : `Last ${days} Days`;
    doc.text(`Report for: ${dateRangeText}`, 14, 30);
    
    // 2. Corrected function call to fix the error
    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Before Lunch', 'After Lunch', 'Before Dinner', 'After Dinner']],
      body: filteredReadings.map(r => [
        new Date(r.date).toLocaleDateString(),
        r.beforeLunch || 'N/A',
        r.afterLunch || 'N/A',
        r.beforeDinner || 'N/A',
        r.afterDinner || 'N/A',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] }, 
    });
    
    doc.save(`sugar-report-${dateRangeText.toLowerCase().replace(' ', '-')}.pdf`);
    toast.success("Report downloaded!");
  };

  const confirmDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col items-center gap-2">
        <p className="font-semibold">Are you sure?</p>
        <div className="flex gap-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              handleDelete(id);
              toast.dismiss(t.id);
            }}
          >
            Delete
          </button>
          <button
            className="bg-slate-200 hover:bg-slate-300 font-bold py-2 px-4 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/readings/${id}`
, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Entry deleted!");
      setRefresh(!refresh);
    } catch (err) {
      toast.error("Failed to delete reading.");
    }
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/readings/${id}`
, updatedData, { headers: { Authorization: `Bearer ${token}` } });
      setEditingReading(null);
      toast.success("Entry updated!");
      setRefresh(!refresh);
    } catch (err) {
      toast.error("Failed to update reading.");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
          <h3 className="text-lg font-semibold text-slate-800">Reading History</h3>
          
          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-x-2 text-sm">
              <label htmlFor="sort-select" className="text-slate-500 font-medium">Sort by:</label>
              
              <select id="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}
                className="block w-full max-w-xs pl-3 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500">
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="beforeLunch-desc">Before Lunch (Highest)</option>
                <option value="beforeLunch-asc">Before Lunch (Lowest)</option>
                <option value="afterLunch-desc">After Lunch (Highest)</option>
                <option value="afterLunch-asc">After Lunch (Lowest)</option>
                <option value="beforeDinner-desc">Before Dinner (Highest)</option>
                <option value="beforeDinner-asc">Before Dinner (Lowest)</option>
                <option value="afterDinner-desc">After Dinner (Highest)</option>
                <option value="afterDinner-asc">After Dinner (Lowest)</option>
                <option value="overall-desc">Overall (Highest Sum)</option>
                <option value="overall-asc">Overall (Lowest Sum)</option>
              </select>


            </div>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Download Report
            </button>
          </div>

          <Link to="/chart" className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700">
            View Chart
          </Link>

        </div>

        <div className="overflow-x-auto">
          {readings.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left font-semibold px-6 py-3 tracking-wider">Date</th>
                  <th className="text-left font-semibold px-6 py-3 tracking-wider">
                    <div>Before Lunch<span className="block font-normal text-xs text-slate-500 tracking-normal">(10 min prior)</span></div>
                  </th>
                  <th className="text-left font-semibold px-6 py-3 tracking-wider">
                    <div>After Lunch<span className="block font-normal text-xs text-slate-500 tracking-normal">Post-meal (2 hours after)</span></div>
                  </th>
                  <th className="text-left font-semibold px-6 py-3 tracking-wider">
                    <div>Before Dinner<span className="block font-normal text-xs text-slate-500 tracking-normal">(10 min prior)</span></div>
                  </th>
                  <th className="text-left font-semibold px-6 py-3 tracking-wider">
                    <div>After Dinner<span className="block font-normal text-xs text-slate-500 tracking-normal">Post-meal (2 hours after)</span></div>
                  </th>
                  {role === 'admin' && <th className="text-left font-semibold px-6 py-3 tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedReadings.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      {new Date(r.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{r.beforeLunch || "—"}</td>
                    <td className="px-6 py-4 text-slate-600">{r.afterLunch || "—"}</td>
                    <td className="px-6 py-4 text-slate-600">{r.beforeDinner || "—"}</td>
                    <td className="px-6 py-4 text-slate-600">{r.afterDinner || "—"}</td>
                    {role === 'admin' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <button onClick={() => setEditingReading(r)} className="text-blue-600 hover:text-blue-800">
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => confirmDelete(r._id)} className="text-red-500 hover:text-red-700">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-16 text-slate-500">No readings have been recorded yet.</p>
          )}
        </div>
      </div>

      <EditReadingModal reading={editingReading} onClose={() => setEditingReading(null)} onSave={handleSaveEdit} />

      {/* New PDF Download Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Report Duration</h3>
              <button onClick={() => setIsPdfModalOpen(false)}><XMarkIcon className="h-6 w-6 text-slate-500 hover:text-slate-800" /></button>
            </div>
            <p className="text-sm text-slate-500 mb-6">Choose the time period for the report.</p>
            <div className="grid grid-cols-1 gap-3">
              {[7, 15, 30, 90].map(days => (
                <button
                  key={days}
                  onClick={() => handleDownloadPDF(days)}
                  className="w-full text-left p-4 rounded-lg bg-slate-100 hover:bg-sky-100 hover:text-sky-800 border border-slate-200 hover:border-sky-300 transition-colors"
                >
                  <span className="font-semibold">Last {days} Days</span>
                </button>
              ))}
              <button
                onClick={() => handleDownloadPDF(9999)} // Use a large number for all time
                className="w-full text-left p-4 rounded-lg bg-slate-100 hover:bg-sky-100 hover:text-sky-800 border border-slate-200 hover:border-sky-300 transition-colors"
              >
                <span className="font-semibold">All Time</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}