// // src/components/AddReading.js

// import { useState } from "react";
// import axios from "axios";

// export default function AddReading({ onAdded }) {
//   // ... (keep the existing state and handleSubmit logic)
//   const [form, setForm] = useState({ beforeLunch: "", afterLunch: "", beforeDinner: "", afterDinner: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     const readingData = Object.fromEntries(Object.entries(form).filter(([_, v]) => v !== ""));
//     if (Object.keys(readingData).length === 0) return setError("Please enter at least one value.");
//     setError("");
//     try {
//       const res = await axios.post("http://localhost:5000/api/readings", readingData, { headers: { Authorization: `Bearer ${token}` } });
//       onAdded(res.data);
//       setForm({ beforeLunch: "", afterLunch: "", beforeDinner: "", afterDinner: "" });
//     } catch (err) {
//       setError("Error saving reading.");
//     }
//   };

//   const labels = {
//     beforeLunch: "Before Lunch", afterLunch: "After Lunch",
//     beforeDinner: "Before Dinner", afterDinner: "After Dinner",
//   };

//   return (
//     <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-8">
//       <h3 className="text-xl font-bold text-slate-900 mb-4">Add a New Reading</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//           {Object.keys(form).map((key) => (
//             <div key={key}>
//               <label className="block text-sm font-medium text-slate-700">{labels[key]}</label>
//               <input
//                 type="number" name={key} value={form[key]} onChange={handleChange}
//                 placeholder="mg/dL"
//                 className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//           ))}
//         </div>
//         {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
//         <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 transition-all">
//           Save Reading
//         </button>
//       </form>
//     </div>
//   );
// }



// src/components/AddReading.js

import { useState } from "react";
import axios from "axios";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";

export default function AddReading({ onAdded }) {
  // Get today's date in YYYY-MM-DD format for the input default
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: today, // <-- Added date field, defaults to today
    beforeLunch: "",
    afterLunch: "",
    beforeDinner: "",
    afterDinner: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const readingData = Object.fromEntries(
      Object.entries(form).filter(([key, value]) => value !== "" && key !== 'date')
    );
    
    // Ensure at least one reading value is present
    if (Object.keys(readingData).length === 0) {
      return setError("Please enter at least one reading value.");
    }
    setError("");

    try {
      // The 'form' state now includes the date, which will be sent to the backend
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/readings`, form, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      onAdded(res.data);
      setForm({
        date: today, // Reset form but keep today's date
        beforeLunch: "",
        afterLunch: "",
        beforeDinner: "",
        afterDinner: "",
      });
    } catch (err) {
      setError("Error saving reading.");
    }
  };
  
  const labels = {
    beforeLunch: "Before Lunch", afterLunch: "After Lunch",
    beforeDinner: "Before Dinner", afterDinner: "After Dinner",
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Add a New Reading</h3>
      <form onSubmit={handleSubmit}>
        {/* --- START OF NEW DATE INPUT --- */}
        <div className="mb-6">
            <label htmlFor="date" className="flex items-center text-sm font-medium text-slate-700 mb-1">
                <CalendarDaysIcon className="h-5 w-5 mr-2 text-slate-400"/>
                Select Date
            </label>
            <input 
                type="date"
                id="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="block w-full sm:max-w-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                required
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {Object.keys(form).filter(key => key !== 'date').map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700">{labels[key]}</label>
              <input
                type="number" name={key} value={form[key]} onChange={handleChange}
                placeholder="mg/dL"
                className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 transition-all">
          Save Reading
        </button>
      </form>
    </div>
  );
}