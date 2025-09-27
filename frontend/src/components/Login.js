
import { useState } from "react";
import axios from "axios";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

export default function Login({ onLogin, setView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", btoa(res.data.role));
      onLogin(res.data.role);
      toast.success("Logged in successfully!");
    } catch (err) {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <LockClosedIcon className="mx-auto h-12 w-12 text-indigo-500" />
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Sign in
        </button>
      </form>
      <p className="text-center text-sm">
        No account?{' '}
        <button onClick={() => setView('register')} className="font-medium text-indigo-600 hover:text-indigo-500">
          Create one now
        </button>
      </p>
    </div>
  );
}