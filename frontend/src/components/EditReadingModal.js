
import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function EditReadingModal({ reading, onClose, onSave }) {
  const [form, setForm] = useState({
    beforeLunch: "",
    afterLunch: "",
    beforeDinner: "",
    afterDinner: "",
  });

  useEffect(() => {
    if (reading) {
      setForm({
        beforeLunch: reading.beforeLunch || "",
        afterLunch: reading.afterLunch || "",
        beforeDinner: reading.beforeDinner || "",
        afterDinner: reading.afterDinner || "",
      });
    }
  }, [reading]);

  if (!reading) return null; 

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSave = () => {
    onSave(reading._id, form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Reading for {new Date(reading.date).toLocaleDateString()}</h2>
          <button onClick={onClose}><XMarkIcon className="h-6 w-6 text-slate-500 hover:text-slate-800" /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {Object.keys(form).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700">{key.replace(/([A-Z])/g, " $1")}</label>
              <input type="number" name={key} value={form[key]} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm" />
            </div>
          ))}
        </div>
        <button onClick={handleSave} className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}