
import { useState, Fragment } from "react";
import { ArrowRightOnRectangleIcon, ChartPieIcon } from "@heroicons/react/24/solid";
import Login from "./components/Login";
import Register from "./components/Register";
import AddReading from "./components/AddReading";
import ReadingList from "./components/ReadingList";
import Footer from "./components/Footer";
import toast, { Toaster } from "react-hot-toast"; 
import ReadingsChart from "./components/ReadingsChart";
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {

  const getDecodedRole = () => {
    const encodedRole = localStorage.getItem("role");
    if (!encodedRole) {
      return "viewer";
    }
    try {
      return atob(encodedRole);
    } catch (error) {
      console.error("Failed to decode role:", error);
      localStorage.removeItem("role");
      return "viewer";
    }
  };

  const [refresh, setRefresh] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(getDecodedRole());
  const [view, setView] = useState("login");
   const navigate = useNavigate(); 


  const handleLogin = (userRole) => {
    setLoggedIn(true);
    setRole(userRole);
    navigate("/"); 
  };

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setRole("viewer");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800">

    <Toaster position="top-center" reverseOrder={false} />

      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ChartPieIcon className="h-8 w-8 text-sky-400" />
              <span className="text-xl font-semibold text-white tracking-tight">
                Sugar Tracker
              </span>
            </div>

            {loggedIn && (
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-slate-400 group-hover:text-slate-200 transition-colors" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* {!loggedIn ? (
            <div className="flex justify-center mt-10">
              {view === 'login' ? <Login onLogin={handleLogin} setView={setView} /> : <Register setView={setView} />}
            </div>
          ) : (
            <Fragment>
              {role === "admin" && <AddReading onAdded={() => setRefresh(!refresh)} />}
              <ReadingList refresh={refresh} setRefresh={setRefresh} role={role} />
            </Fragment>
          )} */}



          <Routes>
            {!loggedIn ? (
              <>
                <Route path="/login" element={view === 'login' ? <Login onLogin={handleLogin} setView={setView} /> : <Register setView={setView} />} />
                {/* Redirect any other path to /login if not logged in */}
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                {/* Main page with the table */}
                <Route path="/" element={
                  <>
                    {role === "admin" && <AddReading onAdded={() => setRefresh(!refresh)} />}
                    <ReadingList refresh={refresh} setRefresh={setRefresh} role={role} />
                  </>
                } />
                {/* Dedicated page for the chart */}
                <Route path="/chart" element={<ReadingsChart />} />
                {/* Redirect any other path to the home page if logged in */}
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>



        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;