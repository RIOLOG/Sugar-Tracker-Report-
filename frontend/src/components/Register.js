// src/components/Register.js

import { useState } from "react";
import axios from "axios";
import { UserPlusIcon } from "@heroicons/react/24/solid";

export default function Register({ setView }) {
  const [formData, setFormData] = useState({email: "", password: "", confirmPassword: ""});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { email: formData.email, password: formData.password });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => setView("login"), 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <UserPlusIcon className="mx-auto h-12 w-12 text-indigo-500" />
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Create a new account</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email" name="email" value={formData.email} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password" name="password" value={formData.password} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Create Account
        </button>
      </form>
       <p className="text-center text-sm">
        Already registered?{' '}
        <button onClick={() => setView('login')} className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </button>
      </p>
    </div>
  );
}