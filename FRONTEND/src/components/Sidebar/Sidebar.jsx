import React, { use } from "react";
import './Sidebar.css'
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
export default function Sidebar({ isSidebarOpen }){
    const {logout} = useAuth()
    const navigate = useNavigate()
    return(
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <nav>
          <a onClick={()=>navigate('/dashboard')}>
            <HomeIcon /> {isSidebarOpen && <span>Dashboard</span>}
          </a>
          <a onClick={()=>navigate('/dashboard')}>
            <DescriptionIcon /> {isSidebarOpen && <span>New Scan</span>}
          </a>
          <a onClick={()=>navigate('/history')}>
            <HistoryIcon /> {isSidebarOpen && <span>Scan History</span>}
          </a>
          <a onClick={()=>navigate('/jobhistory')}>
            <WorkIcon /> {isSidebarOpen && <span>Job Tracker</span>}
          </a>
          <a onClick={logout}>
            <LogoutIcon /> {isSidebarOpen && <span>Logout</span>}
          </a>
        </nav>
    </div>
    )
}
