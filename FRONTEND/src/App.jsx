import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from './components/Navbar/Navbar.jsx'
import Home from './pages/Home/Home.jsx'
import Auth from './components/Auth/Auth.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from './components/DashBoard/DashBoard.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Report from './components/Report/Report.jsx';
import JobTracker from './components/JobTracker/JobTracker.jsx';
import ScanHistory from './components/ScanHistory/ScanHistory.jsx';
import EditJobTrack from './components/EditJobTrack/EditJobTrack.jsx';
import JobTrackHistory from './components/JobTrackHistory/JobTrackHistory.jsx';
import VerifyOtp from './components/Auth/VerifyOtp.jsx';
function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Routes>
        <Route path="/" element={<Home />} />
        {!user ? (
          <>
            <Route path="/auth" element={<Auth />} />
            <Route path='/verify' element={<VerifyOtp/>}/>
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Dashboard isSidebarOpen={isSidebarOpen}/>} />
            <Route path="/report/:scanId" element={<Report isSidebarOpen={isSidebarOpen}/>}/>
            <Route path='/jobtracker' element={<JobTracker isSidebarOpen={isSidebarOpen}/>}/>
            <Route path='/history' element={<ScanHistory isSidebarOpen={isSidebarOpen}/>}/>
            <Route path='/EditJobdetails/:id' element={<EditJobTrack isSidebarOpen={isSidebarOpen}/>}/>
            <Route path='/jobhistory' element={<JobTrackHistory isSidebarOpen={isSidebarOpen}/>}/>
            {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
          </>
        )}
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App
